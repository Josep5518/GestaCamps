import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId
} from "./utils.js";


export class FichajeService {

    constructor(
        trabajadorService
    ) {

        this.trabajadorService =
            trabajadorService;


        const fichajesGuardados =
            StorageService
                .obtenerFichajes();


        this.fichajes =
            Array.isArray(
                fichajesGuardados
            )
                ? fichajesGuardados
                    .map(
                        fichaje =>
                            this.normalizarFichaje(
                                fichaje
                            )
                    )
                : [];

    }


    // =====================================================
    // NORMALIZAR FICHAJE
    // =====================================================

    normalizarFichaje(
        fichaje
    ) {

        if (
            !fichaje
            ||
            typeof fichaje !==
            "object"
        ) {

            return fichaje;

        }


        let correccion =
            null;


        if (
            fichaje.correccion
            &&
            typeof fichaje.correccion ===
            "object"
        ) {

            correccion = {

                id:
                    fichaje.correccion.id
                    ??
                    generarId(),

                estado:
                    fichaje.correccion.estado
                    ||
                    "Pendiente",

                horaOriginal:
                    fichaje.correccion.horaOriginal
                    ||
                    fichaje.hora
                    ||
                    "",

                fechaHoraOriginal:
                    fichaje.correccion.fechaHoraOriginal
                    ||
                    fichaje.fechaHora
                    ||
                    "",

                nuevaHora:
                    fichaje.correccion.nuevaHora
                    ||
                    "",

                motivo:
                    fichaje.correccion.motivo
                    ||
                    "",

                fechaSolicitud:
                    fichaje.correccion.fechaSolicitud
                    ||
                    "",

                fechaResolucion:
                    fichaje.correccion.fechaResolucion
                    ||
                    "",

                resolucion:
                    fichaje.correccion.resolucion
                    ||
                    "",

                trabajadorId:
                    fichaje.correccion.trabajadorId
                    ??
                    fichaje.trabajadorId
                    ??
                    null,

                trabajadorNombre:
                    fichaje.correccion.trabajadorNombre
                    ||
                    fichaje.trabajadorNombre
                    ||
                    ""

            };

        }


        return {

            ...fichaje,

            correccion:
                correccion

        };

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return [
            ...this.fichajes
        ]
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        b.fechaHora
                        ||
                        0
                    )
                    -
                    new Date(
                        a.fechaHora
                        ||
                        0
                    )
            );

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.fichajes
                .find(
                    fichaje =>
                        mismoId(
                            fichaje.id,
                            id
                        )
                )
            ||
            null
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
                    mismoId(
                        fichaje.trabajadorId,
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

        return (
            this.obtenerPorTrabajador(
                trabajadorId
            )[0]
            ||
            null
        );

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


        return Boolean(
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
                pin
                ??
                ""
            )
                .trim();


        if (
            !/^\d{4}$/.test(
                pinLimpio
            )
        ) {

            return {

                ok:
                    false,

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

                ok:
                    false,

                mensaje:
                    "PIN incorrecto. No existe ningún trabajador con este PIN."

            };

        }


        if (
            trabajador.estado !==
            "Activo"
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Este trabajador está inactivo y no puede fichar."

            };

        }


        return {

            ok:
                true,

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

                ok:
                    false,

                mensaje:
                    `${this.trabajadorService.obtenerNombreCompleto(
                        trabajador
                    )} ya tiene una entrada abierta.`

            };

        }


        const resultadoRegistro =
            this.crearRegistro(
                trabajador,
                "Entrada"
            );


        if (
            !resultadoRegistro.ok
        ) {

            return resultadoRegistro;

        }


        const fichaje =
            resultadoRegistro.fichaje;


        return {

            ok:
                true,

            trabajador:
                trabajador,

            fichaje:
                fichaje,

            mensaje:
                `Entrada registrada para ${this.trabajadorService.obtenerNombreCompleto(
                    trabajador
                )} a las ${fichaje.hora}.`

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

                ok:
                    false,

                mensaje:
                    `${this.trabajadorService.obtenerNombreCompleto(
                        trabajador
                    )} no tiene ninguna entrada abierta.`

            };

        }


        const resultadoRegistro =
            this.crearRegistro(
                trabajador,
                "Salida"
            );


        if (
            !resultadoRegistro.ok
        ) {

            return resultadoRegistro;

        }


        const fichaje =
            resultadoRegistro.fichaje;


        return {

            ok:
                true,

            trabajador:
                trabajador,

            fichaje:
                fichaje,

            mensaje:
                `Salida registrada para ${this.trabajadorService.obtenerNombreCompleto(
                    trabajador
                )} a las ${fichaje.hora}.`

        };

    }


    // =====================================================
    // CREAR REGISTRO
    // =====================================================

    crearRegistro(
        trabajador,
        tipo
    ) {

        if (
            !trabajador
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajador no es válido."

            };

        }


        if (
            ![
                "Entrada",
                "Salida"
            ].includes(
                tipo
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El tipo de fichaje no es válido."

            };

        }


        const ahora =
            new Date();


        const registro = {

            id:
                generarId(),

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
                ahora.toISOString(),

            correccion:
                null

        };


        this.fichajes.push(
            registro
        );


        const guardado =
            this.guardar();


        if (
            guardado ===
            false
        ) {

            this.fichajes =
                this.fichajes
                    .filter(
                        fichaje =>
                            !mismoId(
                                fichaje.id,
                                registro.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el fichaje."

            };

        }


        return {

            ok:
                true,

            fichaje:
                registro

        };

    }


    // =====================================================
    // SOLICITAR CORRECCIÓN
    // =====================================================

    solicitarCorreccion(
        trabajadorId,
        fichajeId,
        nuevaHora,
        motivo
    ) {

        const fichaje =
            this.obtenerPorId(
                fichajeId
            );


        if (
            !fichaje
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El fichaje seleccionado no existe."

            };

        }


        if (
            !mismoId(
                fichaje.trabajadorId,
                trabajadorId
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Este fichaje no pertenece al trabajador."

            };

        }


        const horaLimpia =
            String(
                nuevaHora
                ??
                ""
            )
                .trim();


        if (
            !this.esHoraValida(
                horaLimpia
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce una nueva hora válida."

            };

        }


        const motivoLimpio =
            String(
                motivo
                ??
                ""
            )
                .trim();


        if (
            motivoLimpio.length <
            3
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Explica brevemente el motivo de la corrección."

            };

        }


        if (
            fichaje.correccion
            &&
            fichaje.correccion.estado ===
            "Pendiente"
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Este fichaje ya tiene una solicitud de corrección pendiente."

            };

        }


        if (
            this.normalizarHoraComparacion(
                fichaje.hora
            )
            ===
            this.normalizarHoraComparacion(
                horaLimpia
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La nueva hora es igual a la hora actual del fichaje."

            };

        }


        const estadoAnterior =
            fichaje.correccion
                ? {
                    ...fichaje.correccion
                }
                : null;


        const ahora =
            new Date();


        fichaje.correccion = {

            id:
                generarId(),

            estado:
                "Pendiente",

            horaOriginal:
                fichaje.hora,

            fechaHoraOriginal:
                fichaje.fechaHora,

            nuevaHora:
                horaLimpia,

            motivo:
                motivoLimpio,

            fechaSolicitud:
                ahora.toISOString(),

            fechaResolucion:
                "",

            resolucion:
                "",

            trabajadorId:
                fichaje.trabajadorId,

            trabajadorNombre:
                fichaje.trabajadorNombre

        };


        const guardado =
            this.guardar();


        if (
            guardado ===
            false
        ) {

            fichaje.correccion =
                estadoAnterior;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido registrar la solicitud de corrección."

            };

        }


        return {

            ok:
                true,

            fichaje:
                fichaje,

            solicitud:
                fichaje.correccion,

            mensaje:
                "Solicitud de corrección enviada correctamente."

        };

    }


    // =====================================================
    // OBTENER SOLICITUDES DE CORRECCIÓN
    // =====================================================

    obtenerSolicitudesCorreccion(
        estado = null
    ) {

        return this.obtenerTodos()
            .filter(
                fichaje =>
                    fichaje.correccion
            )
            .filter(
                fichaje => {

                    if (
                        !estado
                    ) {

                        return true;

                    }


                    return (
                        fichaje.correccion.estado ===
                        estado
                    );

                }
            );

    }


    // =====================================================
    // SOLICITUDES PENDIENTES
    // =====================================================

    obtenerSolicitudesPendientes() {

        return this.obtenerSolicitudesCorreccion(
            "Pendiente"
        );

    }


    // =====================================================
    // SOLICITUDES POR TRABAJADOR
    // =====================================================

    obtenerSolicitudesPorTrabajador(
        trabajadorId
    ) {

        return this.obtenerSolicitudesCorreccion()
            .filter(
                fichaje =>
                    mismoId(
                        fichaje.trabajadorId,
                        trabajadorId
                    )
            );

    }


    // =====================================================
    // BUSCAR SOLICITUD
    // =====================================================

    obtenerPorSolicitudCorreccionId(
        solicitudId
    ) {

        return (
            this.fichajes
                .find(
                    fichaje =>
                        fichaje.correccion
                        &&
                        mismoId(
                            fichaje.correccion.id,
                            solicitudId
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // APROBAR CORRECCIÓN
    // =====================================================

    aprobarCorreccion(
        solicitudId
    ) {

        const fichaje =
            this.obtenerPorSolicitudCorreccionId(
                solicitudId
            );


        if (
            !fichaje
            ||
            !fichaje.correccion
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La solicitud de corrección no existe."

            };

        }


        if (
            fichaje.correccion.estado !==
            "Pendiente"
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La solicitud ya ha sido resuelta."

            };

        }


        const copiaAnterior =
            JSON.parse(
                JSON.stringify(
                    fichaje
                )
            );


        const nuevaHora =
            fichaje.correccion
                .nuevaHora;


        const nuevaFechaHora =
            this.crearFechaHoraLocal(
                fichaje.fecha,
                nuevaHora
            );


        if (
            !nuevaFechaHora
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido calcular la nueva hora del fichaje."

            };

        }


        fichaje.hora =
            this.normalizarHoraConSegundos(
                nuevaHora
            );


        fichaje.fechaHora =
            nuevaFechaHora
                .toISOString();


        fichaje.correccion.estado =
            "Aprobada";


        fichaje.correccion.fechaResolucion =
            new Date()
                .toISOString();


        fichaje.correccion.resolucion =
            "Aprobada";


        const guardado =
            this.guardar();


        if (
            guardado ===
            false
        ) {

            Object.assign(
                fichaje,
                copiaAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido aprobar la corrección."

            };

        }


        return {

            ok:
                true,

            fichaje:
                fichaje,

            mensaje:
                "Corrección aprobada correctamente."

        };

    }


    // =====================================================
    // RECHAZAR CORRECCIÓN
    // =====================================================

    rechazarCorreccion(
        solicitudId
    ) {

        const fichaje =
            this.obtenerPorSolicitudCorreccionId(
                solicitudId
            );


        if (
            !fichaje
            ||
            !fichaje.correccion
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La solicitud de corrección no existe."

            };

        }


        if (
            fichaje.correccion.estado !==
            "Pendiente"
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La solicitud ya ha sido resuelta."

            };

        }


        const correccionAnterior =
            JSON.parse(
                JSON.stringify(
                    fichaje.correccion
                )
            );


        fichaje.correccion.estado =
            "Rechazada";


        fichaje.correccion.fechaResolucion =
            new Date()
                .toISOString();


        fichaje.correccion.resolucion =
            "Rechazada";


        const guardado =
            this.guardar();


        if (
            guardado ===
            false
        ) {

            fichaje.correccion =
                correccionAnterior;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido rechazar la corrección."

            };

        }


        return {

            ok:
                true,

            fichaje:
                fichaje,

            mensaje:
                "Corrección rechazada."

        };

    }


    // =====================================================
    // FICHAJES DE HOY
    // =====================================================

    obtenerFichajesHoy() {

        const hoy =
            this.obtenerFechaLocal(
                new Date()
            );


        return this.obtenerTodos()
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

        return this.trabajadorService
            .obtenerActivos()
            .filter(
                trabajador =>
                    this.estaTrabajando(
                        trabajador.id
                    )
            );

    }


    // =====================================================
    // VALIDAR HORA
    // =====================================================

    esHoraValida(
        hora
    ) {

        return (
            /^([01]\d|2[0-3]):[0-5]\d$/
                .test(
                    String(
                        hora
                        ??
                        ""
                    )
                )
        );

    }


    // =====================================================
    // NORMALIZAR HORA PARA COMPARAR
    // =====================================================

    normalizarHoraComparacion(
        hora
    ) {

        return String(
            hora
            ??
            ""
        )
            .slice(
                0,
                5
            );

    }


    // =====================================================
    // HORA CON SEGUNDOS
    // =====================================================

    normalizarHoraConSegundos(
        hora
    ) {

        const texto =
            String(
                hora
                ??
                ""
            );


        if (
            /^\d{2}:\d{2}:\d{2}$/.test(
                texto
            )
        ) {

            return texto;

        }


        if (
            /^\d{2}:\d{2}$/.test(
                texto
            )
        ) {

            return (
                `${texto}:00`
            );

        }


        return texto;

    }


    // =====================================================
    // CREAR FECHA/HORA LOCAL
    // =====================================================

    crearFechaHoraLocal(
        fecha,
        hora
    ) {

        if (
            !fecha
            ||
            !this.esHoraValida(
                String(
                    hora
                )
                    .slice(
                        0,
                        5
                    )
            )
        ) {

            return null;

        }


        const partesFecha =
            String(
                fecha
            )
                .split(
                    "-"
                )
                .map(
                    Number
                );


        const partesHora =
            String(
                hora
            )
                .split(
                    ":"
                )
                .map(
                    Number
                );


        if (
            partesFecha.length !==
            3
            ||
            partesHora.length <
            2
        ) {

            return null;

        }


        const fechaHora =
            new Date(
                partesFecha[0],
                partesFecha[1] - 1,
                partesFecha[2],
                partesHora[0],
                partesHora[1],
                0,
                0
            );


        if (
            Number.isNaN(
                fechaHora.getTime()
            )
        ) {

            return null;

        }


        return fechaHora;

    }


    // =====================================================
    // FECHA LOCAL
    // =====================================================

    obtenerFechaLocal(
        fecha
    ) {

        if (
            typeof StorageService.obtenerFechaLocal ===
            "function"
        ) {

            return StorageService
                .obtenerFechaLocal(
                    fecha
                );

        }


        const anio =
            fecha.getFullYear();


        const mes =
            String(
                fecha.getMonth() +
                1
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

        return StorageService
            .guardarFichajes(
                this.fichajes
            );

    }

}