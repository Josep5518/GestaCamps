import { StorageService } from "./storage.js";

export class CampaniaService {

    constructor(
        fincaService
    ) {

        this.fincaService =
            fincaService;

        this.campanias =
            StorageService.obtenerCampanias();


        if (
            !Array.isArray(
                this.campanias
            )
        ) {

            this.campanias = [];

        }

    }


    // =====================================================
    // COMPARAR IDS
    // =====================================================

    mismoId(
        idA,
        idB
    ) {

        if (
            idA === null
            ||
            idA === undefined
            ||
            idB === null
            ||
            idB === undefined
        ) {

            return false;

        }


        return (
            String(
                idA
            )
            ===
            String(
                idB
            )
        );

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtenerTodas() {

        return this.campanias;

    }


    obtenerTodos() {

        return this.campanias;

    }


    obtenerPorId(
        id
    ) {

        return (
            this.campanias.find(
                campania =>
                    this.mismoId(
                        campania.id,
                        id
                    )
            )
            ||
            null
        );

    }


    obtenerActivas() {

        return this.campanias.filter(
            campania =>
                campania.estado ===
                "Activa"
        );

    }


    obtenerCerradas() {

        return this.campanias.filter(
            campania =>
                campania.estado ===
                "Cerrada"
        );

    }


    obtenerPorFinca(
        fincaId
    ) {

        return this.campanias.filter(
            campania =>
                this.mismoId(
                    campania.fincaId,
                    fincaId
                )
        );

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        datos
    ) {

        const nombre =
            String(
                datos.nombre
                ||
                ""
            )
                .trim();


        if (
            !nombre
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce el nombre de la campanya."
            };

        }


        const finca =
            this.fincaService
                .obtenerPorId(
                    datos.fincaId
                );


        if (
            !finca
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona una finca válida."
            };

        }


        if (
            !datos.fechaInicio
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce la fecha de inicio."
            };

        }


        if (
            datos.fechaFin
            &&
            datos.fechaFin <
            datos.fechaInicio
        ) {

            return {
                ok: false,

                mensaje:
                    "La fecha de fin no puede ser anterior a la fecha de inicio."
            };

        }


        // =================================================
        // NO PERMITIR CREAR COMO CERRADA UNA CAMPANYA FUTURA
        // =================================================

        if (
            (
                datos.estado
                ||
                "Activa"
            )
            ===
            "Cerrada"
        ) {

            const hoy =
                this.obtenerFechaHoy();


            if (
                hoy <
                datos.fechaInicio
            ) {

                return {
                    ok: false,

                    mensaje:
                        "No puedes cerrar una campanya antes de su fecha de inicio."
                };

            }

        }


        const duplicada =
            this.campanias.some(
                campania =>
                    this.mismoId(
                        campania.fincaId,
                        finca.id
                    )
                    &&
                    String(
                        campania.nombre
                        ||
                        ""
                    )
                        .trim()
                        .toLowerCase()
                    ===
                    nombre.toLowerCase()
            );


        if (
            duplicada
        ) {

            return {
                ok: false,

                mensaje:
                    "Ya existe una campanya con ese nombre en esta finca."
            };

        }


        const nuevaCampania = {

            id:
                Date.now(),

            nombre:
                nombre,

            fincaId:
                finca.id,

            fincaNombre:
                finca.nombre,

            fechaInicio:
                datos.fechaInicio,

            fechaFin:
                datos.fechaFin
                ||
                "",

            estado:
                datos.estado
                ||
                "Activa",

            notas:
                String(
                    datos.notas
                    ||
                    ""
                )
                    .trim(),

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        if (
            nuevaCampania.estado ===
            "Cerrada"
            &&
            !nuevaCampania.fechaFin
        ) {

            nuevaCampania.fechaFin =
                this.obtenerFechaHoy();

        }


        this.campanias.push(
            nuevaCampania
        );


        this.guardar();


        return {
            ok: true,

            campania:
                nuevaCampania
        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {
                ok: false,

                mensaje:
                    "La campanya no existe."
            };

        }


        const finca =
            this.fincaService
                .obtenerPorId(
                    datos.fincaId
                );


        if (
            !finca
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona una finca válida."
            };

        }


        const nombre =
            String(
                datos.nombre
                ||
                ""
            )
                .trim();


        if (
            !nombre
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce el nombre de la campanya."
            };

        }


        if (
            !datos.fechaInicio
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce la fecha de inicio."
            };

        }


        if (
            datos.fechaFin
            &&
            datos.fechaFin <
            datos.fechaInicio
        ) {

            return {
                ok: false,

                mensaje:
                    "La fecha de fin no puede ser anterior a la fecha de inicio."
            };

        }


        // =================================================
        // NO PERMITIR CERRAR DESDE EDITAR ANTES DEL INICIO
        // =================================================

        if (
            (
                datos.estado
                ||
                "Activa"
            )
            ===
            "Cerrada"
        ) {

            const hoy =
                this.obtenerFechaHoy();


            if (
                hoy <
                datos.fechaInicio
            ) {

                return {
                    ok: false,

                    mensaje:
                        "No puedes cerrar una campanya antes de su fecha de inicio."
                };

            }

        }


        const duplicada =
            this.campanias.some(
                item =>
                    !this.mismoId(
                        item.id,
                        campania.id
                    )
                    &&
                    this.mismoId(
                        item.fincaId,
                        finca.id
                    )
                    &&
                    String(
                        item.nombre
                        ||
                        ""
                    )
                        .trim()
                        .toLowerCase()
                    ===
                    nombre.toLowerCase()
            );


        if (
            duplicada
        ) {

            return {
                ok: false,

                mensaje:
                    "Ya existe otra campanya con ese nombre en esta finca."
            };

        }


        campania.nombre =
            nombre;

        campania.fincaId =
            finca.id;

        campania.fincaNombre =
            finca.nombre;

        campania.fechaInicio =
            datos.fechaInicio;

        campania.fechaFin =
            datos.fechaFin
            ||
            "";

        campania.estado =
            datos.estado
            ||
            "Activa";

        campania.notas =
            String(
                datos.notas
                ||
                ""
            )
                .trim();


        if (
            campania.estado ===
            "Cerrada"
            &&
            !campania.fechaFin
        ) {

            campania.fechaFin =
                this.obtenerFechaHoy();

        }


        this.guardar();


        return {
            ok: true,

            campania:
                campania
        };

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        estado
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {
                ok: false,

                mensaje:
                    "La campanya no existe."
            };

        }


        if (
            ![
                "Activa",
                "Cerrada"
            ].includes(
                estado
            )
        ) {

            return {
                ok: false,

                mensaje:
                    "El estado de la campanya no es válido."
            };

        }


        // =================================================
        // CERRAR
        // =================================================

        if (
            estado ===
            "Cerrada"
        ) {

            const hoy =
                this.obtenerFechaHoy();


            /*
             * No permitimos cerrar una campanya
             * cuya fecha de inicio todavía no ha llegado.
             */

            if (
                campania.fechaInicio
                &&
                hoy <
                campania.fechaInicio
            ) {

                return {
                    ok: false,

                    mensaje:
                        "No puedes cerrar una campanya antes de su fecha de inicio."
                };

            }


            /*
             * Si existe una fecha de fin antigua
             * que sea anterior al inicio, tampoco
             * permitimos guardar un estado incoherente.
             */

            if (
                campania.fechaFin
                &&
                campania.fechaFin <
                campania.fechaInicio
            ) {

                return {
                    ok: false,

                    mensaje:
                        "La fecha de fin no puede ser anterior a la fecha de inicio."
                };

            }


            campania.estado =
                "Cerrada";


            if (
                !campania.fechaFin
            ) {

                campania.fechaFin =
                    hoy;

            }

        }


        // =================================================
        // REABRIR
        // =================================================

        else {

            campania.estado =
                "Activa";


            /*
             * Conservamos la fecha de fin histórica.
             * Si se quiere eliminar, se hace desde Editar.
             */

        }


        this.guardar();


        return {
            ok: true,

            campania:
                campania
        };

    }


    // =====================================================
    // COMPROBAR VÍNCULOS
    // =====================================================

    obtenerVinculos(
        id
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {
                total: 0
            };

        }


        const cultivos =
            this.obtenerStorage(
                "obtenerCultivos"
            );


        const produccion =
            this.obtenerStorage(
                "obtenerProduccion"
            );


        const trabajos =
            this.obtenerStorage(
                "obtenerTrabajos"
            );


        const gastos =
            this.obtenerStorage(
                "obtenerGastos"
            );


        const albaranes =
            this.obtenerStorage(
                "obtenerAlbaranes"
            );


        const coincide =
            registro => {

                if (
                    registro?.campaniaId !==
                    undefined
                    &&
                    registro?.campaniaId !==
                    null
                    &&
                    this.mismoId(
                        registro.campaniaId,
                        campania.id
                    )
                ) {

                    return true;

                }


                return (
                    registro?.campaniaNombre
                    &&
                    String(
                        registro.campaniaNombre
                    )
                    ===
                    String(
                        campania.nombre
                    )
                );

            };


        const cultivosVinculados =
            cultivos.filter(
                coincide
            ).length;


        const produccionVinculada =
            produccion.filter(
                coincide
            ).length;


        const trabajosVinculados =
            trabajos.filter(
                coincide
            ).length;


        const gastosVinculados =
            gastos.filter(
                coincide
            ).length;


        let lineasAlbaran =
            0;


        albaranes.forEach(
            albaran => {

                const lineas =
                    Array.isArray(
                        albaran.lineas
                    )
                    &&
                    albaran.lineas.length >
                    0

                        ? albaran.lineas

                        : [
                            albaran
                        ];


                lineas.forEach(
                    linea => {

                        if (
                            coincide(
                                linea
                            )
                        ) {

                            lineasAlbaran++;

                        }

                    }
                );

            }
        );


        return {

            cultivos:
                cultivosVinculados,

            produccion:
                produccionVinculada,

            trabajos:
                trabajosVinculados,

            gastos:
                gastosVinculados,

            lineasAlbaran:
                lineasAlbaran,

            total:
                cultivosVinculados
                +
                produccionVinculada
                +
                trabajosVinculados
                +
                gastosVinculados
                +
                lineasAlbaran

        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {
                ok: false,

                mensaje:
                    "La campanya no existe."
            };

        }


        const vinculos =
            this.obtenerVinculos(
                id
            );


        if (
            vinculos.total >
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes eliminar esta campanya porque ya tiene información vinculada. Si ha terminado, ciérrala en lugar de eliminarla."
            };

        }


        this.campanias =
            this.campanias.filter(
                item =>
                    !this.mismoId(
                        item.id,
                        id
                    )
            );


        this.guardar();


        return {
            ok: true
        };

    }


    // =====================================================
    // STORAGE SEGURO
    // =====================================================

    obtenerStorage(
        metodo
    ) {

        try {

            if (
                typeof
                StorageService[
                    metodo
                ]
                !==
                "function"
            ) {

                return [];

            }


            const datos =
                StorageService[
                    metodo
                ]();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch {

            return [];

        }

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarCampanias(
                this.campanias
            );

    }


    // =====================================================
    // FECHA
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        const year =
            fecha.getFullYear();


        const month =
            String(
                fecha.getMonth()
                +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const day =
            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${year}-${month}-${day}`
        );

    }

}