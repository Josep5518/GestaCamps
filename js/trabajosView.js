import {
    escaparHTML,
    mismoId
} from "./utils.js";


export class TrabajosView {

    constructor(
        mainContent,
        fincaService,
        trabajoService,
        trabajadorService,
        maquinariaService,
        campaniaService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.trabajoService =
            trabajoService;

        this.trabajadorService =
            trabajadorService;

        this.maquinariaService =
            maquinariaService;

        this.campaniaService =
            campaniaService;

    }


    // =====================================================
    // TRABAJADORES
    // =====================================================

    obtenerTrabajadores() {

        if (
            this.trabajadorService
            &&
            typeof this.trabajadorService
                .obtenerTodos ===
                "function"
        ) {

            return (
                this.trabajadorService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // MAQUINARIA
    // =====================================================

    obtenerMaquinaria() {

        if (
            this.maquinariaService
            &&
            typeof this.maquinariaService
                .obtenerTodos ===
                "function"
        ) {

            return (
                this.maquinariaService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // TRABAJADOR POR ID
    // =====================================================

    obtenerTrabajadorPorId(
        id
    ) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.trabajadorService
            &&
            typeof this.trabajadorService
                .obtenerPorId ===
                "function"
        ) {

            const trabajador =
                this.trabajadorService
                    .obtenerPorId(
                        id
                    );


            if (
                trabajador
            ) {

                return trabajador;

            }

        }


        return (
            this.obtenerTrabajadores()
                .find(
                    trabajador =>
                        mismoId(
                            trabajador.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // MAQUINARIA POR ID
    // =====================================================

    obtenerMaquinariaPorId(
        id
    ) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.maquinariaService
            &&
            typeof this.maquinariaService
                .obtenerPorId ===
                "function"
        ) {

            const maquina =
                this.maquinariaService
                    .obtenerPorId(
                        id
                    );


            if (
                maquina
            ) {

                return maquina;

            }

        }


        return (
            this.obtenerMaquinaria()
                .find(
                    maquina =>
                        mismoId(
                            maquina.id,
                            id
                        )
                )
            ||
            null
        );

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


        return (
            trabajador.nombreCompleto
            ||
            [
                trabajador.nombre,
                trabajador.apellidos
            ]
                .filter(Boolean)
                .join(" ")
        );

    }


    // =====================================================
    // NOMBRE MAQUINARIA
    // =====================================================

    obtenerNombreMaquinaria(
        maquina
    ) {

        if (
            !maquina
        ) {

            return "";

        }


        return [
            maquina.nombre,
            maquina.marca,
            maquina.modelo
        ]
            .filter(Boolean)
            .join(" · ");

    }


    // =====================================================
    // TRABAJADORES DE UNA TAREA
    // =====================================================

    obtenerNombresTrabajo(
        trabajo
    ) {

        if (
            Array.isArray(
                trabajo.trabajadorNombres
            )
            &&
            trabajo.trabajadorNombres.length >
            0
        ) {

            return trabajo
                .trabajadorNombres
                .join(", ");

        }


        if (
            trabajo.trabajadorNombre
        ) {

            return trabajo.trabajadorNombre;

        }


        return "Sin trabajadores asignados";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const trabajos =
            this.trabajoService
                .obtenerTodos();


        const pendientes =
            trabajos.filter(
                trabajo =>
                    trabajo.estado ===
                    "Pendiente"
            ).length;


        const enCurso =
            trabajos.filter(
                trabajo =>
                    trabajo.estado ===
                    "En curso"
            ).length;


        const completadas =
            trabajos.filter(
                trabajo =>
                    trabajo.estado ===
                    "Completada"
                    ||
                    trabajo.estado ===
                    "Completado"
            ).length;


        this.mainContent.innerHTML = `

            <div class="trabajos-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="trabajos-hero">

                    <div class="trabajos-hero-content">

                        <span class="trabajos-eyebrow">
                            🚜 GESTIÓN AGRÍCOLA
                        </span>


                        <h1>
                            Cada tarea,
                            <span>
                                en el momento justo.
                            </span>
                        </h1>


                        <p>
                            Planifica el trabajo diario, asigna personal
                            y maquinaria y controla el estado de cada
                            tarea de tu explotación.
                        </p>


                        <button
                            id="nuevoTrabajo"
                            class="
                                primary-button
                                trabajos-hero-button
                            "
                            type="button"
                        >
                            + Nueva tarea
                        </button>

                    </div>


                    <div class="trabajos-hero-image">

                        <div class="trabajos-hero-badge">

                            <span>
                                Pendientes
                            </span>

                            <strong>
                                ${pendientes}
                            </strong>

                        </div>


                        <div class="trabajos-hero-copy">

                            <small>
                                PLANIFICA · ASIGNA · COMPLETA
                            </small>

                            <strong>
                                El trabajo del campo,<br>
                                bien organizado
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats trabajos-stats">

                    ${this.crearStat(
                        "📋",
                        "Tareas",
                        trabajos.length
                    )}


                    ${this.crearStat(
                        "🕒",
                        "Pendientes",
                        pendientes
                    )}


                    ${this.crearStat(
                        "🚜",
                        "En curso",
                        enCurso
                    )}


                    ${this.crearStat(
                        "✅",
                        "Completadas",
                        completadas
                    )}

                </section>


                <!-- ==========================================
                     CABECERA LISTADO
                =========================================== -->

                <div class="trabajos-section-header">

                    <div>

                        <span class="trabajos-section-eyebrow">
                            PLANIFICACIÓN DIARIA
                        </span>


                        <h2>
                            Trabajos y tareas
                        </h2>


                        <p>
                            Consulta responsables, maquinaria,
                            prioridad y estado de cada trabajo.
                        </p>

                    </div>


                    <div class="trabajos-summary">

                        <span>
                            ${pendientes} pendientes
                        </span>

                        <span>
                            ${enCurso} en curso
                        </span>

                    </div>

                </div>


                <div id="listaTrabajos"></div>

            </div>

        `;


        document
            .getElementById(
                "nuevoTrabajo"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        this.mostrarLista();

    }


    // =====================================================
    // KPI
    // =====================================================

    crearStat(
        icono,
        titulo,
        valor
    ) {

        return `

            <div class="card">

                <span class="card-icon">
                    ${icono}
                </span>


                <div>

                    <p>
                        ${escaparHTML(
                            titulo
                        )}
                    </p>


                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const trabajos =
            this.trabajoService
                .obtenerTodos()
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) => {

                        const fechaA =
                            new Date(
                                a.fecha
                                ||
                                0
                            )
                                .getTime();


                        const fechaB =
                            new Date(
                                b.fecha
                                ||
                                0
                            )
                                .getTime();


                        return (
                            fechaB
                            -
                            fechaA
                        );

                    }
                );


        const contenedor =
            document.getElementById(
                "listaTrabajos"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            trabajos.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="trabajos-empty">

                    <div class="trabajos-empty-icon">
                        🚜
                    </div>


                    <h3>
                        Todavía no tienes tareas
                    </h3>


                    <p>
                        Crea tu primera tarea para comenzar
                        a organizar el trabajo de la explotación.
                    </p>


                    <button
                        id="crearPrimeraTarea"
                        class="primary-button"
                        type="button"
                    >
                        + Crear primera tarea
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimeraTarea"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormulario()
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="trabajos-grid">

                ${trabajos
                    .map(
                        (
                            trabajo,
                            index
                        ) =>
                            this.crearTarjeta(
                                trabajo,
                                index
                            )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        trabajo,
        index
    ) {

        const numeroImagen =
            (
                index %
                3
            )
            +
            1;


        return `

            <article class="trabajo-card trabajo-card-premium">

                <!-- ==================================
                     FOTO
                =================================== -->

                <div
                    class="
                        trabajo-cover
                        trabajo-cover-${numeroImagen}
                    "
                >

                    <div class="trabajo-cover-overlay"></div>


                    <div class="trabajo-cover-top">

                        <span
                            class="
                                trabajo-status
                                ${this.obtenerClaseEstado(
                                    trabajo.estado
                                )}
                            "
                        >

                            ●
                            ${escaparHTML(
                                trabajo.estado
                                ||
                                "Pendiente"
                            )}

                        </span>


                        <div class="trabajo-cover-actions">

                            <button
                                class="
                                    trabajo-icon-button
                                    editar-trabajo
                                "
                                data-id="${trabajo.id}"
                                type="button"
                                title="Editar tarea"
                            >
                                ✎
                            </button>


                            <button
                                class="
                                    trabajo-icon-button
                                    trabajo-delete
                                    eliminar-trabajo
                                "
                                data-id="${trabajo.id}"
                                type="button"
                                title="Eliminar tarea"
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    <div class="trabajo-cover-copy">

                        <span>
                            ${escaparHTML(
                                trabajo.tipo
                                ||
                                "TRABAJO"
                            )}
                        </span>


                        <strong>
                            ${escaparHTML(
                                trabajo.titulo
                                ||
                                "Trabajo"
                            )}
                        </strong>


                        <p>
                            📍
                            ${escaparHTML(
                                trabajo.fincaNombre
                                ||
                                "Sin finca"
                            )}
                        </p>

                    </div>

                </div>


                <!-- ==================================
                     CUERPO
                =================================== -->

                <div class="trabajo-card-body">

                    <div class="trabajo-title-row">

                        <div>

                            <span class="trabajo-kicker">
                                TRABAJO AGRÍCOLA
                            </span>


                            <h3>
                                ${escaparHTML(
                                    trabajo.titulo
                                    ||
                                    "Trabajo"
                                )}
                            </h3>

                        </div>


                        <span
                            class="
                                trabajo-priority
                                ${this.obtenerClasePrioridad(
                                    trabajo.prioridad
                                )}
                            "
                        >
                            ${escaparHTML(
                                trabajo.prioridad
                                ||
                                "Media"
                            )}
                        </span>

                    </div>


                    <p class="trabajo-location">

                        📍
                        ${escaparHTML(
                            trabajo.fincaNombre
                            ||
                            "Sin finca"
                        )}

                        ${
                            trabajo.parcela

                                ? ` · ${escaparHTML(
                                    trabajo.parcela
                                )}`

                                : ""
                        }

                    </p>


                    <div class="trabajo-tags">

                        ${
                            trabajo.cultivo

                                ? `

                                    <span>
                                        🌱
                                        ${escaparHTML(
                                            trabajo.cultivo
                                        )}
                                    </span>

                                `

                                : ""
                        }


                        ${
                            trabajo.campaniaNombre

                                ? `

                                    <span>
                                        🗓️
                                        ${escaparHTML(
                                            trabajo.campaniaNombre
                                        )}
                                    </span>

                                `

                                : ""
                        }

                    </div>


                    <div class="trabajo-info-grid">

                        <div>

                            <span>
                                Fecha prevista
                            </span>

                            <strong>
                                ${this.formatearFecha(
                                    trabajo.fecha
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Tipo
                            </span>

                            <strong>
                                ${escaparHTML(
                                    trabajo.tipo
                                    ||
                                    trabajo.titulo
                                    ||
                                    "Trabajo"
                                )}
                            </strong>

                        </div>

                    </div>


                    <div class="trabajo-resource">

                        <span>
                            👷
                        </span>


                        <div>

                            <small>
                                Trabajadores
                            </small>

                            <strong>
                                ${escaparHTML(
                                    this.obtenerNombresTrabajo(
                                        trabajo
                                    )
                                )}
                            </strong>

                        </div>

                    </div>


                    <div class="trabajo-resource">

                        <span>
                            🚜
                        </span>


                        <div>

                            <small>
                                Maquinaria
                            </small>

                            <strong>
                                ${escaparHTML(
                                    trabajo.maquinariaNombre
                                    ||
                                    "Sin maquinaria asignada"
                                )}
                            </strong>

                        </div>

                    </div>


                    ${
                        trabajo.fechaInicio

                            ? `

                                <div class="trabajo-time-line">

                                    <span>
                                        ▶
                                    </span>

                                    <p>
                                        Iniciada:
                                        <strong>
                                            ${this.formatearFechaHora(
                                                trabajo.fechaInicio
                                            )}
                                        </strong>
                                    </p>

                                </div>

                            `

                            : ""
                    }


                    ${
                        trabajo.fechaCompletada

                            ? `

                                <div class="trabajo-time-line completed">

                                    <span>
                                        ✓
                                    </span>

                                    <p>
                                        Finalizada:
                                        <strong>
                                            ${this.formatearFechaHora(
                                                trabajo.fechaCompletada
                                            )}
                                        </strong>
                                    </p>

                                </div>

                            `

                            : ""
                    }


                    ${
                        trabajo.notas

                            ? `

                                <div class="trabajo-notes">

                                    <span>
                                        NOTAS
                                    </span>

                                    <p>
                                        ${escaparHTML(
                                            trabajo.notas
                                        )}
                                    </p>

                                </div>

                            `

                            : ""
                    }


                    ${this.crearBotonesEstado(
                        trabajo
                    )}

                </div>

            </article>

        `;

    }


    // =====================================================
    // BOTONES DE ESTADO
    // =====================================================

    crearBotonesEstado(
        trabajo
    ) {

        if (
            trabajo.estado ===
            "Pendiente"
        ) {

            return `

                <div class="trabajo-state-actions">

                    <button
                        class="
                            task-state-button
                            trabajo-start
                            estado-trabajo
                        "
                        data-id="${trabajo.id}"
                        data-estado="En curso"
                        type="button"
                    >
                        ▶ Iniciar tarea
                    </button>

                </div>

            `;

        }


        if (
            trabajo.estado ===
            "En curso"
        ) {

            return `

                <div class="trabajo-state-actions">

                    <button
                        class="
                            task-state-button
                            trabajo-secondary-state
                            estado-trabajo
                        "
                        data-id="${trabajo.id}"
                        data-estado="Pendiente"
                        type="button"
                    >
                        ↩ Pendiente
                    </button>


                    <button
                        class="
                            task-state-button
                            trabajo-complete
                            estado-trabajo
                        "
                        data-id="${trabajo.id}"
                        data-estado="Completada"
                        type="button"
                    >
                        ✓ Completar
                    </button>

                </div>

            `;

        }


        return `

            <div class="trabajo-state-actions">

                <button
                    class="
                        task-state-button
                        trabajo-secondary-state
                        estado-trabajo
                    "
                    data-id="${trabajo.id}"
                    data-estado="En curso"
                    type="button"
                >
                    ↩ Reabrir tarea
                </button>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-trabajo"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            this.mostrarFormulario(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-trabajo"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            const id =
                                boton.dataset.id;


                            const trabajo =
                                this.trabajoService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !trabajo
                            ) {

                                alert(
                                    "No se ha podido encontrar la tarea."
                                );

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar la tarea "${trabajo.titulo}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.trabajoService
                                    .eliminar(
                                        id
                                    );


                            if (
                                resultado
                                &&
                                resultado.ok ===
                                false
                            ) {

                                alert(
                                    resultado.mensaje
                                );

                                return;

                            }


                            this.mostrar();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".estado-trabajo"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            const resultado =
                                this.trabajoService
                                    .cambiarEstado(
                                        boton.dataset.id,
                                        boton.dataset.estado
                                    );


                            if (
                                !resultado.ok
                            ) {

                                alert(
                                    resultado.mensaje
                                );

                                return;

                            }


                            this.mostrar();

                        }
                    );

                }
            );

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        id = null
    ) {

        const editando =
            id !==
            null;


        const trabajo =
            editando

                ? this.trabajoService
                    .obtenerPorId(
                        id
                    )

                : null;


        if (
            editando
            &&
            !trabajo
        ) {

            alert(
                "No se ha podido encontrar la tarea."
            );

            return;

        }


        const fincas =
            this.fincaService
                .obtenerTodas();


        const trabajadores =
            this.obtenerTrabajadores();


        const maquinaria =
            this.obtenerMaquinaria();


        if (
            fincas.length ===
            0
        ) {

            alert(
                "Primero debes crear una finca."
            );

            return;

        }


        const trabajadorIdsActuales =
            Array.isArray(
                trabajo?.trabajadorIds
            )

                ? trabajo.trabajadorIds

                : trabajo?.trabajadorId

                    ? [
                        trabajo.trabajadorId
                    ]

                    : [];


        this.mainContent.innerHTML = `

            <div class="trabajo-form-page">

                <button
                    id="volverTrabajos"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="trabajo-form-header">

                    <span class="trabajo-form-eyebrow">
                        🚜 TRABAJOS Y TAREAS
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar tarea"
                                : "Nueva tarea"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza la planificación y recursos asignados."

                                : "Planifica un nuevo trabajo para tu explotación."
                        }

                    </p>

                </header>


                <div class="trabajo-form-layout">

                    <section
                        class="
                            form-panel
                            trabajo-form-panel
                        "
                    >

                        <div class="trabajo-form-section">

                            <span>
                                🚜
                            </span>


                            <div>

                                <h3>
                                    Información de la tarea
                                </h3>

                                <p>
                                    Define qué hay que hacer,
                                    dónde y quién lo realizará.
                                </p>

                            </div>

                        </div>


                        <div class="trabajo-form-grid">

                            <div class="form-group trabajo-form-wide">

                                <label>
                                    Nombre del trabajo *
                                </label>


                                <input
                                    id="tituloTrabajo"
                                    type="text"
                                    placeholder="Ej. Desbroce"
                                    value="${escaparHTML(
                                        trabajo?.titulo
                                        ||
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Tipo de trabajo *
                                </label>


                                <select
                                    id="tipoTrabajo"
                                >

                                    ${this.crearOpcionesTipo(
                                        trabajo?.tipo
                                        ||
                                        trabajo?.titulo
                                        ||
                                        ""
                                    )}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Fecha prevista *
                                </label>


                                <input
                                    id="fechaTrabajo"
                                    type="date"
                                    value="${
                                        trabajo?.fecha
                                        ||
                                        this.obtenerFechaHoy()
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Finca *
                                </label>


                                <select
                                    id="fincaTrabajo"
                                >

                                    ${fincas
                                        .map(
                                            finca => `

                                                <option
                                                    value="${finca.id}"

                                                    ${
                                                        mismoId(
                                                            trabajo?.fincaId,
                                                            finca.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >
                                                    ${escaparHTML(
                                                        finca.nombre
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Campaña
                                </label>


                                <select
                                    id="campaniaTrabajo"
                                ></select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Parcela
                                </label>


                                <input
                                    id="parcelaTrabajo"
                                    type="text"
                                    placeholder="Ej. Parcela Norte"
                                    value="${escaparHTML(
                                        trabajo?.parcela
                                        ||
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Cultivo
                                </label>


                                <input
                                    id="cultivoTrabajo"
                                    type="text"
                                    placeholder="Ej. Nectarina · Nectared 6"
                                    value="${escaparHTML(
                                        trabajo?.cultivo
                                        ||
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Prioridad
                                </label>


                                <select
                                    id="prioridadTrabajo"
                                >

                                    <option
                                        value="Baja"
                                        ${
                                            trabajo?.prioridad ===
                                            "Baja"

                                                ? "selected"

                                                : ""
                                        }
                                    >
                                        Baja
                                    </option>


                                    <option
                                        value="Media"
                                        ${
                                            !trabajo
                                            ||
                                            trabajo.prioridad ===
                                            "Media"

                                                ? "selected"

                                                : ""
                                        }
                                    >
                                        Media
                                    </option>


                                    <option
                                        value="Alta"
                                        ${
                                            trabajo?.prioridad ===
                                            "Alta"

                                                ? "selected"

                                                : ""
                                        }
                                    >
                                        Alta
                                    </option>

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Estado
                                </label>


                                <select
                                    id="estadoTrabajo"
                                >

                                    <option
                                        value="Pendiente"
                                        ${
                                            !trabajo
                                            ||
                                            trabajo.estado ===
                                            "Pendiente"

                                                ? "selected"

                                                : ""
                                        }
                                    >
                                        Pendiente
                                    </option>


                                    <option
                                        value="En curso"
                                        ${
                                            trabajo?.estado ===
                                            "En curso"

                                                ? "selected"

                                                : ""
                                        }
                                    >
                                        En curso
                                    </option>


                                    <option
                                        value="Completada"
                                        ${
                                            trabajo?.estado ===
                                            "Completada"

                                                ? "selected"

                                                : ""
                                        }
                                    >
                                        Completada
                                    </option>

                                </select>

                            </div>


                            <div class="form-group trabajo-form-wide">

                                <label>
                                    Trabajadores asignados
                                </label>


                                <div class="trabajo-workers">

                                    ${
                                        trabajadores.length

                                            ? trabajadores
                                                .map(
                                                    trabajador => {

                                                        const seleccionado =
                                                            trabajadorIdsActuales
                                                                .some(
                                                                    id =>
                                                                        mismoId(
                                                                            id,
                                                                            trabajador.id
                                                                        )
                                                                );


                                                        return `

                                                            <label class="trabajo-worker">

                                                                <input
                                                                    type="checkbox"
                                                                    class="trabajador-tarea-checkbox"
                                                                    value="${trabajador.id}"

                                                                    ${
                                                                        seleccionado
                                                                            ? "checked"
                                                                            : ""
                                                                    }
                                                                >


                                                                <span class="trabajo-worker-avatar">

                                                                    ${this.obtenerIniciales(
                                                                        trabajador
                                                                    )}

                                                                </span>


                                                                <span>

                                                                    <strong>
                                                                        ${escaparHTML(
                                                                            this.obtenerNombreTrabajador(
                                                                                trabajador
                                                                            )
                                                                        )}
                                                                    </strong>


                                                                    ${
                                                                        trabajador.puesto

                                                                            ? `

                                                                                <small>
                                                                                    ${escaparHTML(
                                                                                        trabajador.puesto
                                                                                    )}
                                                                                </small>

                                                                            `

                                                                            : ""
                                                                    }

                                                                </span>

                                                            </label>

                                                        `;

                                                    }
                                                )
                                                .join("")

                                            : `

                                                <p class="trabajo-no-workers">
                                                    No hay trabajadores creados.
                                                </p>

                                            `
                                    }

                                </div>

                            </div>


                            <div class="form-group trabajo-form-wide">

                                <label>
                                    Maquinaria
                                </label>


                                <select
                                    id="maquinariaTrabajo"
                                >

                                    <option value="">
                                        Sin maquinaria asignada
                                    </option>


                                    ${maquinaria
                                        .map(
                                            maquina => `

                                                <option
                                                    value="${maquina.id}"

                                                    ${
                                                        mismoId(
                                                            trabajo?.maquinariaId,
                                                            maquina.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >

                                                    ${escaparHTML(
                                                        this.obtenerNombreMaquinaria(
                                                            maquina
                                                        )
                                                    )}

                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group trabajo-form-wide">

                                <label>
                                    Notas
                                </label>


                                <textarea
                                    id="notasTrabajo"
                                    rows="5"
                                    placeholder="Observaciones..."
                                >${escaparHTML(
                                    trabajo?.notas
                                    ||
                                    ""
                                )}</textarea>

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarTrabajo"
                                type="button"
                                class="secondary-button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarTrabajo"
                                type="button"
                                class="primary-button"
                            >

                                ${
                                    editando
                                        ? "Guardar cambios"
                                        : "Crear tarea"
                                }

                            </button>

                        </div>

                    </section>


                    <aside class="trabajo-form-aside">

                        <div class="trabajo-form-photo">

                            <div>

                                <span>
                                    TRABAJO DE CAMPO
                                </span>


                                <strong>
                                    Cada jornada,
                                    mejor organizada.
                                </strong>

                            </div>

                        </div>


                        <div class="trabajo-form-tip">

                            <span>
                                👷
                            </span>


                            <div>

                                <strong>
                                    Equipo y recursos
                                </strong>


                                <p>
                                    Asigna trabajadores y maquinaria
                                    para que cada tarea tenga claros
                                    sus responsables.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        const fincaSelect =
            document
                .getElementById(
                    "fincaTrabajo"
                );


        const campaniaSelect =
            document
                .getElementById(
                    "campaniaTrabajo"
                );


        const cargarCampanias =
            () => {

                const fincaId =
                    fincaSelect.value;


                const campanias =
                    this.campaniaService
                        .obtenerTodas()
                        .filter(
                            campania =>
                                mismoId(
                                    campania.fincaId,
                                    fincaId
                                )
                        );


                campaniaSelect.innerHTML = `

                    <option value="">
                        Sin campaña asignada
                    </option>

                    ${campanias
                        .map(
                            campania => `

                                <option
                                    value="${campania.id}"

                                    ${
                                        mismoId(
                                            trabajo?.campaniaId,
                                            campania.id
                                        )

                                            ? "selected"

                                            : ""
                                    }
                                >
                                    ${escaparHTML(
                                        campania.nombre
                                    )}
                                </option>

                            `
                        )
                        .join("")}

                `;

            };


        cargarCampanias();


        fincaSelect
            ?.addEventListener(
                "change",
                cargarCampanias
            );


        document
            .getElementById(
                "volverTrabajos"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarTrabajo"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarTrabajo"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarTrabajo(
                        trabajo,
                        id
                    )
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardarTrabajo(
        trabajo,
        id
    ) {

        const trabajadorIds =
            [
                ...document
                    .querySelectorAll(
                        ".trabajador-tarea-checkbox:checked"
                    )
            ]
                .map(
                    checkbox =>
                        checkbox.value
                );


        const trabajadorNombres =
            trabajadorIds
                .map(
                    trabajadorId => {

                        const trabajador =
                            this.obtenerTrabajadorPorId(
                                trabajadorId
                            );


                        return (
                            this.obtenerNombreTrabajador(
                                trabajador
                            )
                        );

                    }
                )
                .filter(Boolean);


        const maquinariaId =
            document
                .getElementById(
                    "maquinariaTrabajo"
                )
                .value;


        const maquina =
            this.obtenerMaquinariaPorId(
                maquinariaId
            );


        const datos = {

            titulo:
                document
                    .getElementById(
                        "tituloTrabajo"
                    )
                    .value,

            tipo:
                document
                    .getElementById(
                        "tipoTrabajo"
                    )
                    .value,

            fincaId:
                document
                    .getElementById(
                        "fincaTrabajo"
                    )
                    .value,

            parcela:
                document
                    .getElementById(
                        "parcelaTrabajo"
                    )
                    .value,

            cultivo:
                document
                    .getElementById(
                        "cultivoTrabajo"
                    )
                    .value,

            campaniaId:
                document
                    .getElementById(
                        "campaniaTrabajo"
                    )
                    .value
                ||
                null,

            fecha:
                document
                    .getElementById(
                        "fechaTrabajo"
                    )
                    .value,

            prioridad:
                document
                    .getElementById(
                        "prioridadTrabajo"
                    )
                    .value,

            estado:
                document
                    .getElementById(
                        "estadoTrabajo"
                    )
                    .value,

            trabajadorIds,

            trabajadorNombres,

            maquinariaId:
                maquinariaId
                ||
                null,

            maquinariaNombre:
                this.obtenerNombreMaquinaria(
                    maquina
                ),

            notas:
                document
                    .getElementById(
                        "notasTrabajo"
                    )
                    .value

        };


        const resultado =
            trabajo

                ? this.trabajoService
                    .editar(
                        id,
                        datos
                    )

                : this.trabajoService
                    .crear(
                        datos
                    );


        if (
            resultado
            &&
            resultado.ok ===
            false
        ) {

            alert(
                resultado.mensaje
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // TIPOS
    // =====================================================

    crearOpcionesTipo(
        seleccionado = ""
    ) {

        const tipos = [

            "Desbroce",
            "Poda",
            "Riego",
            "Fertilización",
            "Tratamiento",
            "Siembra",
            "Plantación",
            "Cosecha",
            "Mantenimiento",
            "Preparación del terreno",
            "Otro"

        ];


        if (
            seleccionado
            &&
            !tipos.includes(
                seleccionado
            )
        ) {

            tipos.unshift(
                seleccionado
            );

        }


        return tipos
            .map(
                tipo => `

                    <option
                        value="${escaparHTML(
                            tipo
                        )}"

                        ${
                            seleccionado ===
                            tipo

                                ? "selected"

                                : ""
                        }
                    >
                        ${escaparHTML(
                            tipo
                        )}
                    </option>

                `
            )
            .join("");

    }


    // =====================================================
    // ESTADOS VISUALES
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        if (
            estado ===
            "En curso"
        ) {

            return "en-curso";

        }


        if (
            estado ===
            "Completada"
            ||
            estado ===
            "Completado"
        ) {

            return "completada";

        }


        return "pendiente";

    }


    obtenerClasePrioridad(
        prioridad
    ) {

        if (
            prioridad ===
            "Alta"
        ) {

            return "alta";

        }


        if (
            prioridad ===
            "Baja"
        ) {

            return "baja";

        }


        return "media";

    }


    // =====================================================
    // INICIALES
    // =====================================================

    obtenerIniciales(
        trabajador
    ) {

        const nombre =
            String(
                trabajador?.nombre
                ||
                ""
            )
                .trim();


        const apellidos =
            String(
                trabajador?.apellidos
                ||
                ""
            )
                .trim();


        return (
            (
                nombre.charAt(0)
                +
                apellidos.charAt(0)
            )
                .toUpperCase()
            ||
            "T"
        );

    }


    // =====================================================
    // FECHA HOY
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


        return `${year}-${month}-${day}`;

    }


    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

    formatearFecha(
        fecha
    ) {

        if (
            !fecha
        ) {

            return "—";

        }


        const partes =
            String(
                fecha
            )
                .split("-");


        if (
            partes.length !==
            3
        ) {

            return fecha;

        }


        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    // =====================================================
    // FORMATEAR FECHA/HORA
    // =====================================================

    formatearFechaHora(
        valor
    ) {

        if (
            !valor
        ) {

            return "—";

        }


        const fecha =
            new Date(
                valor
            );


        if (
            Number.isNaN(
                fecha.getTime()
            )
        ) {

            return valor;

        }


        return fecha
            .toLocaleString(
                "es-ES",
                {

                    day:
                        "2-digit",

                    month:
                        "2-digit",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"

                }
            );

    }

}