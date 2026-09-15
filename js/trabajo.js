import { StorageService } from "./storage.js";


export class TrabajoService {

    constructor(
        fincaService,
        campaniaService
    ) {

        this.fincaService =
            fincaService;

        this.campaniaService =
            campaniaService;


        this.trabajos =
            StorageService
                .obtenerTrabajos()
                .map(
                    trabajo =>
                        this.normalizarTrabajo(
                            trabajo
                        )
                );


        this.guardar();

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
                    .map(Number)
                    .filter(Boolean)

                : trabajo.trabajadorId
                    ? [
                        Number(
                            trabajo.trabajadorId
                        )
                    ]
                    : [];


        const trabajadorNombres =
            Array.isArray(
                trabajo.trabajadorNombres
            )
                ? trabajo.trabajadorNombres
                    .filter(Boolean)

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
                ||
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

        return this.trabajos.find(
            trabajo =>
                Number(
                    trabajo.id
                ) ===
                Number(
                    id
                )
        );

    }


    // =====================================================
    // OBTENER POR CAMPANYA
    // =====================================================

    obtenerPorCampania(
        campaniaId
    ) {

        return this.trabajos.filter(
            trabajo =>
                Number(
                    trabajo.campaniaId
                ) ===
                Number(
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

        return this.trabajos.filter(
            trabajo =>
                Array.isArray(
                    trabajo.trabajadorIds
                )
                &&
                trabajo.trabajadorIds
                    .some(
                        id =>
                            Number(id) ===
                            Number(
                                trabajadorId
                            )
                    )
        );

    }


    // =====================================================
    // PENDIENTES
    // =====================================================

    obtenerPendientes() {

        return this.trabajos.filter(
            trabajo =>
                trabajo.estado ===
                "Pendiente"
        );

    }


    // =====================================================
    // EN CURSO
    // =====================================================

    obtenerEnCurso() {

        return this.trabajos.filter(
            trabajo =>
                trabajo.estado ===
                "En curso"
        );

    }


    // =====================================================
    // COMPLETADOS
    // =====================================================

    obtenerCompletados() {

        return this.trabajos.filter(
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
            !datos.titulo
            ||
            !datos.titulo.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce el nombre del trabajo."
            };

        }


        if (
            !datos.tipo
            ||
            !datos.tipo.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Selecciona el tipo de trabajo."
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


        let campania =
            null;


        if (
            datos.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        Number(
                            datos.campaniaId
                        )
                    );


            if (
                !campania
            ) {

                return {
                    ok: false,
                    mensaje:
                        "La campanya seleccionada no existe."
                };

            }


            if (
                Number(
                    campania.fincaId
                )
                !==
                Number(
                    finca.id
                )
            ) {

                return {
                    ok: false,
                    mensaje:
                        "La campanya no pertenece a la finca seleccionada."
                };

            }

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce una fecha."
            };

        }


        return {
            ok: true,
            finca:
                finca,
            campania:
                campania
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


        const finca =
            validacion.finca;


        const campania =
            validacion.campania;


        const trabajadorIds =
            Array.isArray(
                datos.trabajadorIds
            )
                ? datos.trabajadorIds
                    .map(Number)
                    .filter(Boolean)
                : [];


        const trabajadorNombres =
            Array.isArray(
                datos.trabajadorNombres
            )
                ? datos.trabajadorNombres
                    .filter(Boolean)
                : [];


        const ahora =
            new Date()
                .toISOString();


        const estado =
            datos.estado
            ||
            "Pendiente";


        const nuevoTrabajo = {

            id:
                Date.now(),

            titulo:
                datos.titulo.trim(),

            tipo:
                datos.tipo.trim(),

            fincaId:
                finca.id,

            fincaNombre:
                finca.nombre,

            parcela:
                datos.parcela?.trim()
                ||
                "",

            cultivo:
                datos.cultivo?.trim()
                ||
                "",

            campaniaId:
                campania
                    ? campania.id
                    : null,

            campaniaNombre:
                campania
                    ? campania.nombre
                    : "",

            fecha:
                datos.fecha,

            prioridad:
                datos.prioridad
                ||
                "Media",

            estado:
                estado,

            trabajadorIds:
                trabajadorIds,

            trabajadorNombres:
                trabajadorNombres,

            // Compatibilidad con código antiguo

            trabajadorId:
                trabajadorIds[0]
                ||
                null,

            trabajadorNombre:
                trabajadorNombres[0]
                ||
                "",

            maquinariaId:
                datos.maquinariaId
                    ? Number(
                        datos.maquinariaId
                    )
                    : null,

            maquinariaNombre:
                datos.maquinariaNombre
                ||
                "",

            notas:
                datos.notas?.trim()
                ||
                "",

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
                    : ""

        };


        this.trabajos.push(
            nuevoTrabajo
        );


        this.guardar();


        return {
            ok: true,
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
                ok: false,
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


        const finca =
            validacion.finca;


        const campania =
            validacion.campania;


        const trabajadorIds =
            Array.isArray(
                datos.trabajadorIds
            )
                ? datos.trabajadorIds
                    .map(Number)
                    .filter(Boolean)
                : [];


        const trabajadorNombres =
            Array.isArray(
                datos.trabajadorNombres
            )
                ? datos.trabajadorNombres
                    .filter(Boolean)
                : [];


        const estadoAnterior =
            trabajo.estado;


        trabajo.titulo =
            datos.titulo.trim();

        trabajo.tipo =
            datos.tipo.trim();

        trabajo.fincaId =
            finca.id;

        trabajo.fincaNombre =
            finca.nombre;

        trabajo.parcela =
            datos.parcela?.trim()
            ||
            "";

        trabajo.cultivo =
            datos.cultivo?.trim()
            ||
            "";

        trabajo.campaniaId =
            campania
                ? campania.id
                : null;

        trabajo.campaniaNombre =
            campania
                ? campania.nombre
                : "";

        trabajo.fecha =
            datos.fecha;

        trabajo.prioridad =
            datos.prioridad
            ||
            "Media";

        trabajo.estado =
            datos.estado
            ||
            "Pendiente";

        trabajo.trabajadorIds =
            trabajadorIds;

        trabajo.trabajadorNombres =
            trabajadorNombres;


        // Compatibilidad con código antiguo

        trabajo.trabajadorId =
            trabajadorIds[0]
            ||
            null;

        trabajo.trabajadorNombre =
            trabajadorNombres[0]
            ||
            "";


        trabajo.maquinariaId =
            datos.maquinariaId
                ? Number(
                    datos.maquinariaId
                )
                : null;

        trabajo.maquinariaNombre =
            datos.maquinariaNombre
            ||
            "";

        trabajo.notas =
            datos.notas?.trim()
            ||
            "";


        this.actualizarFechasEstado(
            trabajo,
            estadoAnterior,
            trabajo.estado
        );


        this.guardar();


        return {
            ok: true,
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
                ok: false,
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
                ok: false,
                mensaje:
                    "El estado indicado no es válido."
            };

        }


        const estadoAnterior =
            trabajo.estado;


        trabajo.estado =
            estado;


        this.actualizarFechasEstado(
            trabajo,
            estadoAnterior,
            estado
        );


        this.guardar();


        return {
            ok: true,
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
                ok: false,
                mensaje:
                    "El trabajo no existe."
            };

        }


        this.trabajos =
            this.trabajos.filter(
                item =>
                    Number(
                        item.id
                    ) !==
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
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarTrabajos(
                this.trabajos
            );

    }

}