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

        return this.incidencias.find(
            incidencia =>
                Number(
                    incidencia.id
                )
                ===
                Number(
                    id
                )
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

        if (
            !datos.tipo
        ) {

            return {
                ok: false,
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
                ok: false,
                mensaje:
                    "Describe la incidencia."
            };

        }


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
                    ok: false,
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
                    ok: false,
                    mensaje:
                        "La tarea seleccionada no existe."
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

        }


        const ahora =
            new Date();


        const nuevaIncidencia = {

            id:
                Date.now(),

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


        this.guardar();


        return {
            ok: true,
            incidencia:
                nuevaIncidencia
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
                ok: false,
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
                ok: false,
                mensaje:
                    "Estado de incidencia no válido."
            };

        }


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
                observaciones.trim();

        }

        else {

            incidencia.fechaResolucion =
                "";

        }


        this.guardar();


        return {
            ok: true,
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
                ok: false,
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
                ok: false,
                mensaje:
                    "Prioridad no válida."
            };

        }


        incidencia.prioridad =
            prioridad;


        this.guardar();


        return {
            ok: true
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
                ok: false,
                mensaje:
                    "La incidencia no existe."
            };

        }


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
            .guardarIncidencias(
                this.incidencias
            );

    }

}