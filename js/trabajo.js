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

        const trabajosGuardados =
            StorageService
                .obtenerTrabajos();


        this.trabajos =
            Array.isArray(
                trabajosGuardados
            )
                ? trabajosGuardados
                    .map(
                        trabajo =>
                            this.normalizarTrabajo(
                                trabajo
                            )
                    )
                : [];

    }


    // =====================================================
    // NORMALIZAR TRABAJO ANTIGUO
    // =====================================================

    normalizarTrabajo(
        trabajo
    ) {

        const trabajadorIds =
            Array.isArray(
                trabajo?.trabajadorIds
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

                : trabajo?.trabajadorId
                    ? [
                        trabajo.trabajadorId
                    ]
                    : [];


        const trabajadorNombres =
            Array.isArray(
                trabajo?.trabajadorNombres
            )
                ? trabajo.trabajadorNombres
                    .filter(
                        Boolean
                    )

                : trabajo?.trabajadorNombre
                    ? [
                        trabajo.trabajadorNombre
                    ]
                    : [];


        const recurrencia =
            this.normalizarRecurrenciaGuardada(
                trabajo?.recurrencia
            );


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
                trabajo?.fechaInicio
                ||
                "",

            fechaCompletada:
                trabajo?.fechaCompletada
                ||
                "",

            serieRecurrenciaId:
                trabajo?.serieRecurrenciaId
                ??
                null,

            recurrencia:
                recurrencia

        };

    }


    // =====================================================
    // NORMALIZAR RECURRENCIA GUARDADA
    // =====================================================

    normalizarRecurrenciaGuardada(
        recurrencia
    ) {

        if (
            !recurrencia
            ||
            typeof recurrencia !==
            "object"
            ||
            recurrencia.activa !==
            true
        ) {

            return {

                activa:
                    false,

                tipo:
                    "Ninguna",

                finTipo:
                    "repeticiones",

                repeticiones:
                    1,

                fechaFin:
                    "",

                indice:
                    1,

                total:
                    1

            };

        }


        return {

            activa:
                true,

            tipo:
                recurrencia.tipo
                ||
                "Semanal",

            finTipo:
                recurrencia.finTipo
                ||
                "repeticiones",

            repeticiones:
                Number(
                    recurrencia.repeticiones
                    ??
                    recurrencia.total
                    ??
                    1
                ),

            fechaFin:
                recurrencia.fechaFin
                ||
                "",

            indice:
                Number(
                    recurrencia.indice
                    ??
                    1
                ),

            total:
                Number(
                    recurrencia.total
                    ??
                    recurrencia.repeticiones
                    ??
                    1
                )

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
    // OBTENER POR SERIE RECURRENTE
    // =====================================================

    obtenerPorSerie(
        serieRecurrenciaId
    ) {

        if (
            !serieRecurrenciaId
        ) {

            return [];

        }


        return this.trabajos
            .filter(
                trabajo =>
                    mismoId(
                        trabajo.serieRecurrenciaId,
                        serieRecurrenciaId
                    )
            )
            .slice()
            .sort(
                (
                    a,
                    b
                ) =>
                    String(
                        a.fecha
                        ||
                        ""
                    )
                        .localeCompare(
                            String(
                                b.fecha
                                ||
                                ""
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


        if (
            !this.esFechaISOValida(
                datos.fecha
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La fecha del trabajo no es válida."

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
            ]
                .includes(
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
            ]
                .includes(
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
    // VALIDAR RECURRENCIA
    // =====================================================

    validarRecurrencia(
        recurrencia,
        fechaInicial
    ) {

        if (
            !recurrencia
            ||
            recurrencia.activa !==
            true
            ||
            recurrencia.tipo ===
            "Ninguna"
        ) {

            return {

                ok:
                    true,

                recurrencia: {

                    activa:
                        false,

                    tipo:
                        "Ninguna",

                    finTipo:
                        "repeticiones",

                    repeticiones:
                        1,

                    fechaFin:
                        ""

                }

            };

        }


        const tipo =
            String(
                recurrencia.tipo
                ??
                ""
            )
                .trim();


        if (
            ![
                "Diaria",
                "Semanal",
                "Quincenal",
                "Mensual"
            ]
                .includes(
                    tipo
                )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El tipo de recurrencia no es válido."

            };

        }


        const finTipo =
            recurrencia.finTipo ===
            "fecha"
                ? "fecha"
                : "repeticiones";


        if (
            finTipo ===
            "repeticiones"
        ) {

            const repeticiones =
                Number(
                    recurrencia.repeticiones
                );


            if (
                !Number.isInteger(
                    repeticiones
                )
                ||
                repeticiones <
                2
                ||
                repeticiones >
                365
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "Las repeticiones deben estar entre 2 y 365."

                };

            }


            return {

                ok:
                    true,

                recurrencia: {

                    activa:
                        true,

                    tipo:
                        tipo,

                    finTipo:
                        "repeticiones",

                    repeticiones:
                        repeticiones,

                    fechaFin:
                        ""

                }

            };

        }


        const fechaFin =
            String(
                recurrencia.fechaFin
                ??
                ""
            )
                .trim();


        if (
            !this.esFechaISOValida(
                fechaFin
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce una fecha final válida para la recurrencia."

            };

        }


        if (
            fechaFin <=
            fechaInicial
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La fecha final de la recurrencia debe ser posterior a la fecha inicial."

            };

        }


        return {

            ok:
                true,

            recurrencia: {

                activa:
                    true,

                tipo:
                    tipo,

                finTipo:
                    "fecha",

                repeticiones:
                    null,

                fechaFin:
                    fechaFin

            }

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


        const listaTrabajadores =
            Array.isArray(
                trabajadores
            )
                ? trabajadores
                : [];


        const listaMaquinaria =
            Array.isArray(
                maquinaria
            )
                ? maquinaria
                : [];


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
                        listaTrabajadores
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
                listaMaquinaria
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


        const validacionRecurrencia =
            this.validarRecurrencia(
                datos.recurrencia,
                datos.fecha
            );


        if (
            !validacionRecurrencia.ok
        ) {

            return validacionRecurrencia;

        }


        const recurrencia =
            validacionRecurrencia
                .recurrencia;


        const fechas =
            recurrencia.activa

                ? this.generarFechasRecurrencia(
                    datos.fecha,
                    recurrencia
                )

                : [
                    datos.fecha
                ];


        if (
            fechas.length ===
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido generar la recurrencia."

            };

        }


        if (
            fechas.length >
            365
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La recurrencia genera demasiadas tareas. El máximo es 365."

            };

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


        const serieRecurrenciaId =
            recurrencia.activa
                ? generarId()
                : null;


        const trabajosNuevos =
            fechas
                .map(
                    (
                        fecha,
                        indice
                    ) => {

                        const estado =
                            indice ===
                            0
                                ? validacion.estado
                                : "Pendiente";


                        return {

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
                                fecha,

                            prioridad:
                                validacion.prioridad,

                            estado:
                                estado,

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
                                estado ===
                                "En curso"
                                    ? ahora
                                    : "",

                            fechaCompletada:
                                estado ===
                                "Completada"
                                    ? ahora
                                    : "",

                            serieRecurrenciaId:
                                serieRecurrenciaId,

                            recurrencia: {

                                activa:
                                    recurrencia.activa,

                                tipo:
                                    recurrencia.activa
                                        ? recurrencia.tipo
                                        : "Ninguna",

                                finTipo:
                                    recurrencia.finTipo,

                                repeticiones:
                                    fechas.length,

                                fechaFin:
                                    recurrencia.fechaFin
                                    ||
                                    "",

                                indice:
                                    indice + 1,

                                total:
                                    fechas.length

                            }

                        };

                    }
                );


        const trabajosAnteriores =
            [
                ...this.trabajos
            ];


        this.trabajos.push(
            ...trabajosNuevos
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
                    recurrencia.activa
                        ? "No se ha podido guardar la serie de tareas."
                        : "No se ha podido guardar el trabajo."

            };

        }


        return {

            ok:
                true,

            trabajo:
                trabajosNuevos[0],

            trabajos:
                trabajosNuevos,

            recurrente:
                recurrencia.activa,

            serieRecurrenciaId:
                serieRecurrenciaId,

            totalCreados:
                trabajosNuevos.length

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
            ]
                .includes(
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


        const estadoCompletoAnterior = {

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
    // GENERAR FECHAS DE RECURRENCIA
    // =====================================================

    generarFechasRecurrencia(
        fechaInicial,
        recurrencia
    ) {

        const fechas =
            [
                fechaInicial
            ];


        if (
            recurrencia.finTipo ===
            "repeticiones"
        ) {

            let fechaActual =
                fechaInicial;


            while (
                fechas.length <
                recurrencia.repeticiones
                &&
                fechas.length <
                365
            ) {

                fechaActual =
                    this.obtenerSiguienteFechaRecurrencia(
                        fechaActual,
                        recurrencia.tipo
                    );


                fechas.push(
                    fechaActual
                );

            }


            return fechas;

        }


        let fechaActual =
            fechaInicial;


        while (
            fechas.length <
            365
        ) {

            const siguiente =
                this.obtenerSiguienteFechaRecurrencia(
                    fechaActual,
                    recurrencia.tipo
                );


            if (
                siguiente >
                recurrencia.fechaFin
            ) {

                break;

            }


            fechas.push(
                siguiente
            );


            fechaActual =
                siguiente;

        }


        return fechas;

    }


    // =====================================================
    // SIGUIENTE FECHA DE RECURRENCIA
    // =====================================================

    obtenerSiguienteFechaRecurrencia(
        fecha,
        tipo
    ) {

        if (
            tipo ===
            "Diaria"
        ) {

            return this.sumarDiasISO(
                fecha,
                1
            );

        }


        if (
            tipo ===
            "Semanal"
        ) {

            return this.sumarDiasISO(
                fecha,
                7
            );

        }


        if (
            tipo ===
            "Quincenal"
        ) {

            return this.sumarDiasISO(
                fecha,
                14
            );

        }


        if (
            tipo ===
            "Mensual"
        ) {

            return this.sumarMesesISO(
                fecha,
                1
            );

        }


        return fecha;

    }


    // =====================================================
    // SUMAR DÍAS ISO
    // =====================================================

    sumarDiasISO(
        fechaISO,
        dias
    ) {

        const fecha =
            this.convertirFechaISOADate(
                fechaISO
            );


        fecha.setDate(
            fecha.getDate()
            +
            dias
        );


        return this.convertirDateAISO(
            fecha
        );

    }


    // =====================================================
    // SUMAR MESES ISO
    // =====================================================

    sumarMesesISO(
        fechaISO,
        meses
    ) {

        const partes =
            String(
                fechaISO
            )
                .split(
                    "-"
                )
                .map(
                    Number
                );


        const anio =
            partes[0];


        const mes =
            partes[1] -
            1;


        const dia =
            partes[2];


        const primerDiaDestino =
            new Date(
                anio,
                mes + meses,
                1
            );


        const ultimoDiaDestino =
            new Date(
                primerDiaDestino.getFullYear(),
                primerDiaDestino.getMonth() + 1,
                0
            )
                .getDate();


        const diaDestino =
            Math.min(
                dia,
                ultimoDiaDestino
            );


        const resultado =
            new Date(
                primerDiaDestino.getFullYear(),
                primerDiaDestino.getMonth(),
                diaDestino
            );


        return this.convertirDateAISO(
            resultado
        );

    }


    // =====================================================
    // CONVERTIR ISO A DATE LOCAL
    // =====================================================

    convertirFechaISOADate(
        fechaISO
    ) {

        const [
            anio,
            mes,
            dia
        ] =
            String(
                fechaISO
            )
                .split(
                    "-"
                )
                .map(
                    Number
                );


        return new Date(
            anio,
            mes - 1,
            dia
        );

    }


    // =====================================================
    // CONVERTIR DATE A ISO LOCAL
    // =====================================================

    convertirDateAISO(
        fecha
    ) {

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
    // VALIDAR FECHA ISO
    // =====================================================

    esFechaISOValida(
        valor
    ) {

        if (
            !/^\d{4}-\d{2}-\d{2}$/
                .test(
                    String(
                        valor
                        ??
                        ""
                    )
                )
        ) {

            return false;

        }


        const fecha =
            this.convertirFechaISOADate(
                valor
            );


        return (
            this.convertirDateAISO(
                fecha
            )
            ===
            valor
        );

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


        const listaIncidencias =
            Array.isArray(
                incidencias
            )
                ? incidencias
                : [];


        const incidenciasVinculadas =
            listaIncidencias
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
    // ELIMINAR TAREA
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
    // ELIMINAR SERIE RECURRENTE
    // =====================================================

    eliminarSerie(
        serieRecurrenciaId
    ) {

        const serie =
            this.obtenerPorSerie(
                serieRecurrenciaId
            );


        if (
            serie.length ===
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La serie recurrente no existe."

            };

        }


        const tareasConVinculos =
            serie
                .filter(
                    trabajo =>
                        this.obtenerVinculos(
                            trabajo.id
                        )
                            .total >
                        0
                );


        if (
            tareasConVinculos.length >
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar la serie completa porque ${tareasConVinculos.length} tarea${
                        tareasConVinculos.length ===
                        1
                            ? ""
                            : "s"
                    } tiene${
                        tareasConVinculos.length ===
                        1
                            ? ""
                            : "n"
                    } incidencias vinculadas.`

            };

        }


        const trabajosAnteriores =
            [
                ...this.trabajos
            ];


        this.trabajos =
            this.trabajos
                .filter(
                    trabajo =>
                        !mismoId(
                            trabajo.serieRecurrenciaId,
                            serieRecurrenciaId
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
                    "No se ha podido eliminar la serie recurrente."

            };

        }


        return {

            ok:
                true,

            eliminadas:
                serie.length

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