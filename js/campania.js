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
    // OBTENER
    // =====================================================

    obtenerTodas() {

        return this.campanias;

    }


    obtenerTodos() {

        return this.campanias;

    }


    obtenerPorId(id) {

        return (
            this.campanias.find(
                campania =>
                    Number(
                        campania.id
                    )
                    ===
                    Number(
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
                Number(
                    campania.fincaId
                )
                ===
                Number(
                    fincaId
                )
        );

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(datos) {

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
                    Number(
                        datos.fincaId
                    )
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


        const duplicada =
            this.campanias.some(
                campania =>
                    Number(
                        campania.fincaId
                    )
                    ===
                    Number(
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
                    Number(
                        datos.fincaId
                    )
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


        const duplicada =
            this.campanias.some(
                item =>
                    Number(
                        item.id
                    )
                    !==
                    Number(
                        campania.id
                    )
                    &&
                    Number(
                        item.fincaId
                    )
                    ===
                    Number(
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


        campania.estado =
            estado;


        if (
            estado ===
            "Cerrada"
            &&
            !campania.fechaFin
        ) {

            campania.fechaFin =
                this.obtenerFechaHoy();

        }


        /*
         * Al reabrir mantenemos la fecha de fin.
         * Así no perdemos información histórica.
         * El usuario puede quitarla desde Editar si quiere.
         */


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
                    Number(
                        registro?.campaniaId
                    )
                    ===
                    Number(
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

    eliminar(id) {

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
                    Number(
                        item.id
                    )
                    !==
                    Number(
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
                fecha.getMonth() +
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