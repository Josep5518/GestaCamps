import { StorageService } from "./storage.js";


export class FichajeService {

    constructor(
        trabajadorService
    ) {

        this.trabajadorService =
            trabajadorService;


        this.fichajes =
            StorageService
                .obtenerFichajes();

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return [...this.fichajes]
            .sort(
                (a, b) =>
                    new Date(
                        b.fechaHora
                    ) -
                    new Date(
                        a.fechaHora
                    )
            );

    }


    // =====================================================
    // OBTENER POR TRABAJADOR
    // =====================================================

    obtenerPorTrabajador(
        trabajadorId
    ) {

        return this.obtenerTodos()
            .filter(
                fichaje =>
                    Number(
                        fichaje.trabajadorId
                    ) ===
                    Number(
                        trabajadorId
                    )
            );

    }


    // =====================================================
    // OBTENER ÚLTIMO FICHAJE
    // =====================================================

    obtenerUltimoFichaje(
        trabajadorId
    ) {

        return this
            .obtenerPorTrabajador(
                trabajadorId
            )[0] || null;

    }


    // =====================================================
    // COMPROBAR SI ESTÁ TRABAJANDO
    // =====================================================

    estaTrabajando(
        trabajadorId
    ) {

        const ultimo =
            this.obtenerUltimoFichaje(
                trabajadorId
            );


        return (
            ultimo
            &&
            ultimo.tipo ===
                "Entrada"
        );

    }


    // =====================================================
    // OBTENER TRABAJADOR POR PIN
    // =====================================================

    obtenerTrabajadorPorPin(
        pin
    ) {

        const pinLimpio =
            String(
                pin || ""
            ).trim();


        if (
            !/^\d{4}$/.test(
                pinLimpio
            )
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce un PIN de 4 números."
            };

        }


        const trabajador =
            this.trabajadorService
                .obtenerPorPin(
                    pinLimpio
                );


        if (
            !trabajador
        ) {

            return {
                ok: false,
                mensaje:
                    "PIN incorrecto. No existe ningún trabajador con este PIN."
            };

        }


        if (
            trabajador.estado !==
            "Activo"
        ) {

            return {
                ok: false,
                mensaje:
                    "Este trabajador está inactivo y no puede fichar."
            };

        }


        return {
            ok: true,
            trabajador:
                trabajador
        };

    }


    // =====================================================
    // FICHAR ENTRADA
    // =====================================================

    ficharEntrada(
        pin
    ) {

        const resultado =
            this.obtenerTrabajadorPorPin(
                pin
            );


        if (
            !resultado.ok
        ) {

            return resultado;

        }


        const trabajador =
            resultado.trabajador;


        if (
            this.estaTrabajando(
                trabajador.id
            )
        ) {

            return {
                ok: false,
                mensaje:
                    `${this.trabajadorService.obtenerNombreCompleto(trabajador)} ya tiene una entrada abierta.`
            };

        }


        const fichaje =
            this.crearRegistro(
                trabajador,
                "Entrada"
            );


        return {
            ok: true,

            trabajador:
                trabajador,

            fichaje:
                fichaje,

            mensaje:
                `Entrada registrada para ${this.trabajadorService.obtenerNombreCompleto(trabajador)} a las ${fichaje.hora}.`
        };

    }


    // =====================================================
    // FICHAR SALIDA
    // =====================================================

    ficharSalida(
        pin
    ) {

        const resultado =
            this.obtenerTrabajadorPorPin(
                pin
            );


        if (
            !resultado.ok
        ) {

            return resultado;

        }


        const trabajador =
            resultado.trabajador;


        if (
            !this.estaTrabajando(
                trabajador.id
            )
        ) {

            return {
                ok: false,
                mensaje:
                    `${this.trabajadorService.obtenerNombreCompleto(trabajador)} no tiene ninguna entrada abierta.`
            };

        }


        const fichaje =
            this.crearRegistro(
                trabajador,
                "Salida"
            );


        return {
            ok: true,

            trabajador:
                trabajador,

            fichaje:
                fichaje,

            mensaje:
                `Salida registrada para ${this.trabajadorService.obtenerNombreCompleto(trabajador)} a las ${fichaje.hora}.`
        };

    }


    // =====================================================
    // CREAR REGISTRO
    // =====================================================

    crearRegistro(
        trabajador,
        tipo
    ) {

        const ahora =
            new Date();


        const registro = {

            id:
                Date.now(),

            trabajadorId:
                trabajador.id,

            trabajadorNombre:
                this.trabajadorService
                    .obtenerNombreCompleto(
                        trabajador
                    ),

            tipo:
                tipo,

            fecha:
                this.obtenerFechaLocal(
                    ahora
                ),

            hora:
                this.obtenerHoraLocal(
                    ahora
                ),

            fechaHora:
                ahora.toISOString()

        };


        this.fichajes.push(
            registro
        );


        this.guardar();


        return registro;

    }


    // =====================================================
    // FICHAJES DE HOY
    // =====================================================

    obtenerFichajesHoy() {

        const hoy =
            this.obtenerFechaLocal(
                new Date()
            );


        return this
            .obtenerTodos()
            .filter(
                fichaje =>
                    fichaje.fecha ===
                    hoy
            );

    }


    // =====================================================
    // TRABAJADORES TRABAJANDO AHORA
    // =====================================================

    obtenerTrabajandoAhora() {

        return this
            .trabajadorService
            .obtenerActivos()
            .filter(
                trabajador =>
                    this.estaTrabajando(
                        trabajador.id
                    )
            );

    }


    // =====================================================
    // FECHA LOCAL
    // =====================================================

    obtenerFechaLocal(
        fecha
    ) {

        const anio =
            fecha.getFullYear();


        const mes =
            String(
                fecha.getMonth() + 1
            )
                .padStart(
                    2,
                    "0"
                );


        const dia =
            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${anio}-${mes}-${dia}`
        );

    }


    // =====================================================
    // HORA LOCAL
    // =====================================================

    obtenerHoraLocal(
        fecha
    ) {

        return fecha
            .toLocaleTimeString(
                "es-ES",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit"
                }
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarFichajes(
                this.fichajes
            );

    }

}