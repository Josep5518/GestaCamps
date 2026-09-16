import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId
} from "./utils.js";

import {
    obtenerNombreTrabajador,
    obtenerNombreMaquinaria
} from "./entityHelpers.js";


export class TrabajoService {

    constructor(
        fincaService,
        campaniaService
    ) {

        this.fincaService =
            fincaService;

        this.campaniaService =
            campaniaService;


        /*
         * Normalizamos en memoria los trabajos antiguos,
         * pero NO guardamos automáticamente al iniciar.
         *
         * Así evitamos crear auditorías simplemente por
         * abrir GestaCamps.
         */
        this.trabajos =
            StorageService
                .obtenerTrabajos()
                .map(
                    trabajo =>
                        this.normalizarTrabajo(
                            trabajo
                        )
                );

    }


    // =====================================================
    // NORMALIZAR TRABAJO ANTIGUO
    // =====================================================

    normalizarTrabajo(
        trabajo
    ) {

        const trabajadorIds =
            Array.isArray(
                trabajo.trabajadorIds
            )
                ? trabajo.trabajadorIds
                    .filter(
                        id =>
                            id !==
                            null
                            &&
                            id !==
                            undefined
                            &&
                            id !==
                            ""
                    )

                : trabajo.trabajadorId
                    ? [
                        trabajo.trabajadorId
                    ]
                    : [];


        const trabajadorNombres =
            Array.isArray(
                trabajo.trabajadorNombres
            )
                ? trabajo.trabajadorNombres
                    .filter(
                        Boolean
                    )

                : trabajo.trabajadorNombre
                    ? [
                        trabajo.trabajadorNombre
                    ]
                    : [];


        return {

            ...trabajo,

            trabajadorIds:
                trabajadorIds,

            trabajadorNombres:
                trabajadorNombres,

            trabajadorId:
                trabajadorIds[0]
                ??
                null,

            trabajadorNombre:
                trabajadorNombres[0]
                ||
                "",

            fechaInicio:
                trabajo.fechaInicio
                ||
                "",

            fechaCompletada:
                trabajo.fechaCompletada
                ||
                ""

        };

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.trabajos;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.trabajos
                .find(
                    trabajo =>
                        mismoId(
                            trabajo.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // OBTENER POR CAMPANYA
    // =====================================================

    obtenerPorCampania(
        campaniaId
    ) {

        return this.trabajos
            .filter(
                trabajo =>
                    mismoId(
                        trabajo.campaniaId,
                        campaniaId
                    )
            );

    }


    // =====================================================
    // OBTENER POR TRABAJADOR
    // =====================================================

    obtenerPorTrabajador(
        trabajadorId
    ) {

        return this.trabajos
            .filter(
                trabajo =>
                    Array.isArray(
                        trabajo.trabajadorIds
                    )
                    &&
                    trabajo.trabajadorIds
                        .some(
                            id =>
                                mismoId(
                                    id,
                                    trabajadorId
                                )
                        )
            );

    }


    // =====================================================
    // PENDIENTES
    // =====================================================

    obtenerPendientes() {

        return this.trabajos
            .filter(
                trabajo =>
                    trabajo.estado ===
                    "Pendiente"
            );

    }


    // =====================================================
    // EN CURSO
    // =====================================================

    obtenerEnCurso() {

        return this.trabajos
            .filter(
                trabajo =>
                    trabajo.estado ===
                    "En curso"
            );

    }


    // =====================================================
    // COMPLETADOS
    // =====================================================

    obtenerCompletados() {

        return this.trabajos
            .filter(
                trabajo =>
                    trabajo.estado ===
                    "Completada"
            );

    }


    // =====================================================
    // VALIDAR DATOS COMUNES
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
                    "Los datos del trabajo no son válidos."

            };

        }


        const titulo =
            String(
                datos.titulo
                ??
                ""
            )
                .trim();


        if (
            !titulo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce el nombre del trabajo."

            };

        }


        const tipo =
            String(
                datos.tipo
                ??
                ""
            )
                .trim();


        if (
            !tipo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona el tipo de trabajo."

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

                ok:
                    false,

                mensaje:
                    "Selecciona una finca válida."

            };

        }


        let campania =
            null;


        if (
            datos.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        datos.campaniaId
                    );


            if (
                !campania
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La campanya seleccionada no existe."

                };

            }


            if (
                !mismoId(
                    campania.fincaId,
                    finca.id
                )
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La campanya no pertenece a la finca seleccionada."

                };

            }

        }


        if (
            !datos.fecha
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce una fecha."

            };

        }


        const prioridad =
            datos.prioridad
            ||
            "Media";


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
                    "La prioridad indicada no es válida."

            };

        }


        const estado =
            datos.estado
            ||
            "Pendiente";


        if (
            ![
                "Pendiente",
                "En curso",
                "Completada"
            ].includes(
                estado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El estado indicado no es válido."

            };

        }


        const relaciones =
            this.obtenerRelacionesOperativas(
                datos
            );


        if (
            !relaciones.ok
        ) {

            return relaciones;

        }


        return {

            ok:
                true,

            finca:
                finca,

            campania:
                campania,

            trabajadores:
                relaciones.trabajadores,

            maquinaria:
                relaciones.maquinaria,

            titulo:
                titulo,

            tipo:
                tipo,

            prioridad:
                prioridad,

            estado:
                estado

        };

    }


    // =====================================================
    // RELACIONES OPERATIVAS
    // =====================================================

    obtenerRelacionesOperativas(
        datos
    ) {

        const trabajadores =
            StorageService
                .obtenerTrabajadores();


        const maquinaria =
            StorageService
                .obtenerMaquinaria();


        const trabajadorIds =
            Array.isArray(
                datos.trabajadorIds
            )
                ? [
                    ...new Set(
                        datos.trabajadorIds
                            .filter(
                                id =>
                                    id !==
                                    null
                                    &&
                                    id !==
                                    undefined
                                    &&
                                    id !==
                                    ""
                            )
                            .map(
                                id =>
                                    String(
                                        id
                                    )
                            )
                    )
                ]
                : [];


        const trabajadoresSeleccionados =
            trabajadorIds
                .map(
                    id =>
                        trabajadores
                            .find(
                                trabajador =>
                                    mismoId(
                                        trabajador.id,
                                        id
                                    )
                            )
                )
                .filter(
                    Boolean
                );


        if (
            trabajadoresSeleccionados.length !==
            trabajadorIds.length
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Uno o varios trabajadores seleccionados ya no existen."

            };

        }


        let maquina =
            null;


        if (
            datos.maquinariaId
        ) {

            maquina =
                maquinaria
                    .find(
                        item =>
                            mismoId(
                                item.id,
                                datos.maquinariaId
                            )
                    )
                ||
                null;


            if (
                !maquina
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La maquinaria seleccionada no existe."

                };

            }

        }


        return {

            ok:
                true,

            trabajadores:
                trabajadoresSeleccionados,

            maquinaria:
                maquina

        };

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


        const ahora =
            new Date()
                .toISOString();


        const trabajadorIds =
            validacion.trabajadores
                .map(
                    trabajador =>
                        trabajador.id
                );


        const trabajadorNombres =
            validacion.trabajadores
                .map(
                    trabajador =>
                        obtenerNombreTrabajador(
                            trabajador
                        )
                );


        const nuevoTrabajo = {

            id:
                generarId(),

            titulo:
                validacion.titulo,

            tipo:
                validacion.tipo,

            fincaId:
                validacion.finca.id,

            fincaNombre:
                validacion.finca.nombre,

            parcela:
                String(
                    datos.parcela
                    ??
                    ""
                )
                    .trim(),

            cultivo:
                String(
                    datos.cultivo
                    ??
                    ""
                )
                    .trim(),

            campaniaId:
                validacion.campania
                    ? validacion.campania.id
                    : null,

            campaniaNombre:
                validacion.campania
                    ? validacion.campania.nombre
                    : "",

            fecha:
                datos.fecha,

            prioridad:
                validacion.prioridad,

            estado:
                validacion.estado,

            trabajadorIds:
                trabajadorIds,

            trabajadorNombres:
                trabajadorNombres,

            // Compatibilidad con código antiguo

            trabajadorId:
                trabajadorIds[0]
                ??
                null,

            trabajadorNombre:
                trabajadorNombres[0]
                ||
                "",

            maquinariaId:
                validacion.maquinaria
                    ? validacion.maquinaria.id
                    : null,

            maquinariaNombre:
                validacion.maquinaria
                    ? obtenerNombreMaquinaria(
                        validacion.maquinaria
                    )
                    : "",

            notas:
                String(
                    datos.notas
                    ??
                    ""
                )
                    .trim(),

            fechaCreacion:
                ahora,

            fechaInicio:
                validacion.estado ===
                "En curso"
                    ? ahora
                    : "",

            fechaCompletada:
                validacion.estado ===
                "Completada"
                    ? ahora
                    : ""

        };


        this.trabajos.push(
            nuevoTrabajo
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.trabajos =
                this.trabajos
                    .filter(
                        trabajo =>
                            !mismoId(
                                trabajo.id,
                                nuevoTrabajo.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el trabajo."

            };

        }


        return {

            ok:
                true,

            trabajo:
                nuevoTrabajo

        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const trabajo =
            this.obtenerPorId(
                id
            );


        if (
            !trabajo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajo no existe."

            };

        }


        const validacion =
            this.validarDatos(
                datos
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const estadoAnteriorCompleto =
            JSON.parse(
                JSON.stringify(
                    trabajo
                )
            );


        const estadoAnterior =
            trabajo.estado;


        const trabajadorIds =
            validacion.trabajadores
                .map(
                    trabajador =>
                        trabajador.id
                );


        const trabajadorNombres =
            validacion.trabajadores
                .map(
                    trabajador =>
                        obtenerNombreTrabajador(
                            trabajador
                        )
                );


        trabajo.titulo =
            validacion.titulo;


        trabajo.tipo =
            validacion.tipo;


        trabajo.fincaId =
            validacion.finca.id;


        trabajo.fincaNombre =
            validacion.finca.nombre;


        trabajo.parcela =
            String(
                datos.parcela
                ??
                ""
            )
                .trim();


        trabajo.cultivo =
            String(
                datos.cultivo
                ??
                ""
            )
                .trim();


        trabajo.campaniaId =
            validacion.campania
                ? validacion.campania.id
                : null;


        trabajo.campaniaNombre =
            validacion.campania
                ? validacion.campania.nombre
                : "";


        trabajo.fecha =
            datos.fecha;


        trabajo.prioridad =
            validacion.prioridad;


        trabajo.estado =
            validacion.estado;


        trabajo.trabajadorIds =
            trabajadorIds;


        trabajo.trabajadorNombres =
            trabajadorNombres;


        // Compatibilidad con código antiguo

        trabajo.trabajadorId =
            trabajadorIds[0]
            ??
            null;


        trabajo.trabajadorNombre =
            trabajadorNombres[0]
            ||
            "";


        trabajo.maquinariaId =
            validacion.maquinaria
                ? validacion.maquinaria.id
                : null;


        trabajo.maquinariaNombre =
            validacion.maquinaria
                ? obtenerNombreMaquinaria(
                    validacion.maquinaria
                )
                : "";


        trabajo.notas =
            String(
                datos.notas
                ??
                ""
            )
                .trim();


        this.actualizarFechasEstado(
            trabajo,
            estadoAnterior,
            trabajo.estado
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            Object.assign(
                trabajo,
                estadoAnteriorCompleto
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios del trabajo."

            };

        }


        return {

            ok:
                true,

            trabajo:
                trabajo

        };

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        estado
    ) {

        const trabajo =
            this.obtenerPorId(
                id
            );


        if (
            !trabajo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajo no existe."

            };

        }


        if (
            ![
                "Pendiente",
                "En curso",
                "Completada"
            ].includes(
                estado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El estado indicado no es válido."

            };

        }


        const estadoCompletoAnterior =
            {

                estado:
                    trabajo.estado,

                fechaInicio:
                    trabajo.fechaInicio,

                fechaCompletada:
                    trabajo.fechaCompletada

            };


        const estadoAnterior =
            trabajo.estado;


        trabajo.estado =
            estado;


        this.actualizarFechasEstado(
            trabajo,
            estadoAnterior,
            estado
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            trabajo.estado =
                estadoCompletoAnterior.estado;

            trabajo.fechaInicio =
                estadoCompletoAnterior.fechaInicio;

            trabajo.fechaCompletada =
                estadoCompletoAnterior.fechaCompletada;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido cambiar el estado del trabajo."

            };

        }


        return {

            ok:
                true,

            trabajo:
                trabajo

        };

    }


    // =====================================================
    // INICIAR TAREA
    // =====================================================

    iniciar(
        id
    ) {

        return this.cambiarEstado(
            id,
            "En curso"
        );

    }


    // =====================================================
    // COMPLETAR TAREA
    // =====================================================

    completar(
        id
    ) {

        return this.cambiarEstado(
            id,
            "Completada"
        );

    }


    // =====================================================
    // VOLVER A PENDIENTE
    // =====================================================

    marcarPendiente(
        id
    ) {

        return this.cambiarEstado(
            id,
            "Pendiente"
        );

    }


    // =====================================================
    // FECHAS SEGÚN ESTADO
    // =====================================================

    actualizarFechasEstado(
        trabajo,
        estadoAnterior,
        estadoNuevo
    ) {

        const ahora =
            new Date()
                .toISOString();


        if (
            estadoNuevo ===
            "Pendiente"
        ) {

            trabajo.fechaInicio =
                "";

            trabajo.fechaCompletada =
                "";

            return;

        }


        if (
            estadoNuevo ===
            "En curso"
        ) {

            if (
                estadoAnterior !==
                "En curso"
                ||
                !trabajo.fechaInicio
            ) {

                trabajo.fechaInicio =
                    ahora;

            }


            trabajo.fechaCompletada =
                "";

            return;

        }


        if (
            estadoNuevo ===
            "Completada"
        ) {

            if (
                !trabajo.fechaInicio
            ) {

                trabajo.fechaInicio =
                    ahora;

            }


            trabajo.fechaCompletada =
                ahora;

        }

    }


    // =====================================================
    // VÍNCULOS
    // =====================================================

    obtenerVinculos(
        trabajoId
    ) {

        const incidencias =
            StorageService
                .obtenerIncidencias();


        const incidenciasVinculadas =
            incidencias
                .filter(
                    incidencia =>
                        mismoId(
                            incidencia.trabajoId,
                            trabajoId
                        )
                )
                .length;


        return {

            incidencias:
                incidenciasVinculadas,

            total:
                incidenciasVinculadas

        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const trabajo =
            this.obtenerPorId(
                id
            );


        if (
            !trabajo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajo no existe."

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

                ok:
                    false,

                mensaje:
                    `No puedes eliminar este trabajo porque tiene ${vinculos.incidencias} incidencia${
                        vinculos.incidencias ===
                        1
                            ? ""
                            : "s"
                    } vinculada${
                        vinculos.incidencias ===
                        1
                            ? ""
                            : "s"
                    }.`

            };

        }


        const trabajosAnteriores =
            [
                ...this.trabajos
            ];


        this.trabajos =
            this.trabajos
                .filter(
                    item =>
                        !mismoId(
                            item.id,
                            id
                        )
                );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.trabajos =
                trabajosAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el trabajo."

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
            .guardarTrabajos(
                this.trabajos
            );

    }

}