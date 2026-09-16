import { StorageService } from "./storage.js";


export class IncidenciaService {

    constructor(
        fincaService,
        trabajoService,
        trabajadorService
    ) {

        this.fincaService =
            fincaService;

        this.trabajoService =
            trabajoService;

        this.trabajadorService =
            trabajadorService;

        this.incidencias =
            StorageService
                .obtenerIncidencias();

    }


    // =====================================================
    // OBTENER TODAS
    // =====================================================

    obtenerTodas() {

        return [...this.incidencias]
            .sort(
                (a, b) =>
                    new Date(
                        b.fechaCreacion
                    )
                    -
                    new Date(
                        a.fechaCreacion
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
            this.incidencias.find(
                incidencia =>
                    Number(
                        incidencia.id
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


    // =====================================================
    // OBTENER POR TRABAJADOR
    // =====================================================

    obtenerPorTrabajador(
        trabajadorId
    ) {

        return this.obtenerTodas()
            .filter(
                incidencia =>
                    Number(
                        incidencia.trabajadorId
                    )
                    ===
                    Number(
                        trabajadorId
                    )
            );

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        datos
    ) {

        const validacion =
            this.validarDatos(
                datos
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const relaciones =
            this.obtenerRelaciones(
                datos
            );


        if (
            !relaciones.ok
        ) {

            return relaciones;

        }


        const {
            finca,
            trabajo,
            trabajador
        } =
            relaciones;


        const ahora =
            new Date();


        const nuevaIncidencia = {

            id:
                StorageService
                    .generarId(),

            tipo:
                datos.tipo,

            prioridad:
                datos.prioridad
                ||
                "Media",

            estado:
                "Abierta",

            descripcion:
                datos.descripcion.trim(),

            fincaId:
                finca
                    ? finca.id
                    : null,

            fincaNombre:
                finca
                    ? finca.nombre
                    : "",

            trabajoId:
                trabajo
                    ? trabajo.id
                    : null,

            trabajoNombre:
                trabajo
                    ? trabajo.titulo
                    : "",

            trabajadorId:
                trabajador
                    ? trabajador.id
                    : null,

            trabajadorNombre:
                trabajador
                    ? this.trabajadorService
                        .obtenerNombreCompleto(
                            trabajador
                        )
                    : "",

            origen:
                datos.origen
                ||
                "Administración",

            fechaCreacion:
                ahora.toISOString(),

            fechaResolucion:
                "",

            observacionesResolucion:
                ""

        };


        this.incidencias.push(
            nuevaIncidencia
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.incidencias =
                this.incidencias
                    .filter(
                        incidencia =>
                            Number(
                                incidencia.id
                            )
                            !==
                            Number(
                                nuevaIncidencia.id
                            )
                    );


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido guardar la incidencia."
            };

        }


        return {
            ok:
                true,

            incidencia:
                nuevaIncidencia
        };

    }


    // =====================================================
    // VALIDAR DATOS
    // =====================================================

    validarDatos(
        datos
    ) {

        if (
            !datos
            ||
            typeof datos !==
            "object"
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Los datos de la incidencia no son válidos."
            };

        }


        if (
            !datos.tipo
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Selecciona el tipo de incidencia."
            };

        }


        if (
            !datos.descripcion
            ||
            !datos.descripcion.trim()
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Describe la incidencia."
            };

        }


        const prioridadesValidas = [
            "Baja",
            "Media",
            "Alta",
            "Urgente"
        ];


        if (
            datos.prioridad
            &&
            !prioridadesValidas.includes(
                datos.prioridad
            )
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Prioridad no válida."
            };

        }


        return {
            ok:
                true
        };

    }


    // =====================================================
    // OBTENER RELACIONES
    // =====================================================

    obtenerRelaciones(
        datos
    ) {

        let finca =
            null;


        if (
            datos.fincaId
        ) {

            finca =
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
                    ok:
                        false,

                    mensaje:
                        "La finca seleccionada no existe."
                };

            }

        }


        let trabajo =
            null;


        if (
            datos.trabajoId
        ) {

            trabajo =
                this.trabajoService
                    .obtenerPorId(
                        Number(
                            datos.trabajoId
                        )
                    );


            if (
                !trabajo
            ) {

                return {
                    ok:
                        false,

                    mensaje:
                        "La tarea seleccionada no existe."
                };

            }


            if (
                finca
                &&
                trabajo.fincaId
                &&
                Number(
                    trabajo.fincaId
                )
                !==
                Number(
                    finca.id
                )
            ) {

                return {
                    ok:
                        false,

                    mensaje:
                        "La tarea seleccionada no pertenece a la finca indicada."
                };

            }

        }


        let trabajador =
            null;


        if (
            datos.trabajadorId
        ) {

            trabajador =
                this.trabajadorService
                    .obtenerPorId(
                        Number(
                            datos.trabajadorId
                        )
                    );


            if (
                !trabajador
            ) {

                return {
                    ok:
                        false,

                    mensaje:
                        "El trabajador seleccionado no existe."
                };

            }

        }


        return {
            ok:
                true,

            finca:
                finca,

            trabajo:
                trabajo,

            trabajador:
                trabajador
        };

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        estado,
        observaciones = ""
    ) {

        const incidencia =
            this.obtenerPorId(
                id
            );


        if (
            !incidencia
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La incidencia no existe."
            };

        }


        if (
            ![
                "Abierta",
                "En revisión",
                "Resuelta"
            ].includes(
                estado
            )
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Estado de incidencia no válido."
            };

        }


        const estadoAnterior = {

            estado:
                incidencia.estado,

            fechaResolucion:
                incidencia.fechaResolucion,

            observacionesResolucion:
                incidencia.observacionesResolucion

        };


        incidencia.estado =
            estado;


        if (
            estado ===
            "Resuelta"
        ) {

            incidencia.fechaResolucion =
                new Date()
                    .toISOString();

            incidencia.observacionesResolucion =
                String(
                    observaciones
                    ||
                    ""
                )
                    .trim();

        }

        else {

            incidencia.fechaResolucion =
                "";

            incidencia.observacionesResolucion =
                "";

        }


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            incidencia.estado =
                estadoAnterior.estado;

            incidencia.fechaResolucion =
                estadoAnterior.fechaResolucion;

            incidencia.observacionesResolucion =
                estadoAnterior.observacionesResolucion;


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido actualizar el estado de la incidencia."
            };

        }


        return {
            ok:
                true,

            incidencia:
                incidencia
        };

    }


    // =====================================================
    // CAMBIAR PRIORIDAD
    // =====================================================

    cambiarPrioridad(
        id,
        prioridad
    ) {

        const incidencia =
            this.obtenerPorId(
                id
            );


        if (
            !incidencia
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La incidencia no existe."
            };

        }


        if (
            ![
                "Baja",
                "Media",
                "Alta",
                "Urgente"
            ].includes(
                prioridad
            )
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Prioridad no válida."
            };

        }


        const prioridadAnterior =
            incidencia.prioridad;


        incidencia.prioridad =
            prioridad;


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            incidencia.prioridad =
                prioridadAnterior;


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido actualizar la prioridad."
            };

        }


        return {
            ok:
                true
        };

    }


    // =====================================================
    // ESTADÍSTICAS
    // =====================================================

    obtenerAbiertas() {

        return this.incidencias.filter(
            incidencia =>
                incidencia.estado ===
                "Abierta"
        );

    }


    obtenerEnRevision() {

        return this.incidencias.filter(
            incidencia =>
                incidencia.estado ===
                "En revisión"
        );

    }


    obtenerResueltas() {

        return this.incidencias.filter(
            incidencia =>
                incidencia.estado ===
                "Resuelta"
        );

    }


    obtenerUrgentesActivas() {

        return this.incidencias.filter(
            incidencia =>
                incidencia.prioridad ===
                "Urgente"
                &&
                incidencia.estado !==
                "Resuelta"
        );

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const incidencia =
            this.obtenerPorId(
                id
            );


        if (
            !incidencia
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La incidencia no existe."
            };

        }


        const incidenciasAnteriores =
            [
                ...this.incidencias
            ];


        this.incidencias =
            this.incidencias.filter(
                item =>
                    Number(
                        item.id
                    )
                    !==
                    Number(
                        id
                    )
            );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.incidencias =
                incidenciasAnteriores;


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar la incidencia."
            };

        }


        return {
            ok:
                true
        };

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarIncidencias(
                this.incidencias
            );

    }

}