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
    // COMPARAR IDS
    // Compatible con IDs numéricos y UUID.
    // =====================================================

    mismoId(
        a,
        b
    ) {

        if (
            a === null
            ||
            a === undefined
            ||
            b === null
            ||
            b === undefined
        ) {

            return false;

        }


        return String(a) === String(b);

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
                        ||
                        0
                    )
                    -
                    new Date(
                        a.fechaCreacion
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
            this.incidencias.find(
                incidencia =>
                    this.mismoId(
                        incidencia.id,
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
                    this.mismoId(
                        incidencia.trabajadorId,
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
        } = relaciones;


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
                    ? (
                        trabajo.titulo
                        ||
                        trabajo.nombre
                        ||
                        ""
                    )
                    : "",

            trabajadorId:
                trabajador
                    ? trabajador.id
                    : null,

            trabajadorNombre:
                trabajador
                    ? this.obtenerNombreTrabajador(
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
                "",

            evidencias:
                []

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
                            !this.mismoId(
                                incidencia.id,
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
                this.buscarPorIdEnServicio(
                    this.fincaService,
                    datos.fincaId,
                    [
                        "obtenerPorId"
                    ]
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
                this.buscarPorIdEnServicio(
                    this.trabajoService,
                    datos.trabajoId,
                    [
                        "obtenerPorId"
                    ]
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
                !this.mismoId(
                    trabajo.fincaId,
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
                this.buscarPorIdEnServicio(
                    this.trabajadorService,
                    datos.trabajadorId,
                    [
                        "obtenerPorId"
                    ]
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

            finca,
            trabajo,
            trabajador
        };

    }


    // =====================================================
    // BUSCAR ID EN SERVICIO
    // =====================================================

    buscarPorIdEnServicio(
        servicio,
        id,
        metodos = []
    ) {

        if (
            !servicio
        ) {

            return null;

        }


        for (
            const metodo
            of metodos
        ) {

            if (
                typeof servicio[metodo] ===
                "function"
            ) {

                const directo =
                    servicio[metodo](
                        id
                    );


                if (
                    directo
                ) {

                    return directo;

                }


                const numero =
                    Number(
                        id
                    );


                if (
                    Number.isFinite(
                        numero
                    )
                ) {

                    const numerico =
                        servicio[metodo](
                            numero
                        );


                    if (
                        numerico
                    ) {

                        return numerico;

                    }

                }

            }

        }


        const candidatos = [
            "obtenerTodas",
            "obtenerTodos"
        ];


        for (
            const metodo
            of candidatos
        ) {

            if (
                typeof servicio[metodo] ===
                "function"
            ) {

                const lista =
                    servicio[metodo]();


                if (
                    Array.isArray(
                        lista
                    )
                ) {

                    return (
                        lista.find(
                            item =>
                                this.mismoId(
                                    item?.id,
                                    id
                                )
                        )
                        ||
                        null
                    );

                }

            }

        }


        return null;

    }


    // =====================================================
    // NOMBRE TRABAJADOR
    // =====================================================

    obtenerNombreTrabajador(
        trabajador
    ) {

        if (
            !trabajador
        ) {

            return "";

        }


        if (
            typeof this.trabajadorService
                ?.obtenerNombreCompleto ===
            "function"
        ) {

            return (
                this.trabajadorService
                    .obtenerNombreCompleto(
                        trabajador
                    )
                ||
                ""
            );

        }


        return [
            trabajador.nombre,
            trabajador.apellidos
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            );

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
                true,

            incidencia
        };

    }


    // =====================================================
    // OBTENER EVIDENCIAS
    // =====================================================

    obtenerEvidencias(
        id
    ) {

        const incidencia =
            this.obtenerPorId(
                id
            );


        if (
            !incidencia
        ) {

            return [];

        }


        return Array.isArray(
            incidencia.evidencias
        )
            ? [...incidencia.evidencias]
            : [];

    }


    // =====================================================
    // AÑADIR EVIDENCIA
    // =====================================================

    agregarEvidencia(
        id,
        evidencia
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
            !evidencia
            ||
            !evidencia.id
            ||
            !evidencia.ruta
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La evidencia no es válida."
            };

        }


        const anteriores =
            Array.isArray(
                incidencia.evidencias
            )
                ? [...incidencia.evidencias]
                : [];


        incidencia.evidencias = [
            ...anteriores,
            evidencia
        ];


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            incidencia.evidencias =
                anteriores;


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido asociar la evidencia a la incidencia."
            };

        }


        return {
            ok:
                true,

            incidencia,
            evidencia
        };

    }


    // =====================================================
    // QUITAR EVIDENCIA
    // =====================================================

    quitarEvidencia(
        id,
        evidenciaId
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


        const anteriores =
            Array.isArray(
                incidencia.evidencias
            )
                ? [...incidencia.evidencias]
                : [];


        const evidencia =
            anteriores.find(
                item =>
                    this.mismoId(
                        item?.id,
                        evidenciaId
                    )
            )
            ||
            null;


        if (
            !evidencia
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La evidencia no existe."
            };

        }


        incidencia.evidencias =
            anteriores.filter(
                item =>
                    !this.mismoId(
                        item?.id,
                        evidenciaId
                    )
            );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            incidencia.evidencias =
                anteriores;


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido quitar la evidencia."
            };

        }


        return {
            ok:
                true,

            evidencia
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


        const evidencias =
            Array.isArray(
                incidencia.evidencias
            )
                ? [...incidencia.evidencias]
                : [];


        this.incidencias =
            this.incidencias.filter(
                item =>
                    !this.mismoId(
                        item.id,
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
                true,

            incidencia,
            evidencias
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