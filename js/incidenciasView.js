export class IncidenciasView {

    constructor(
        mainContent,
        incidenciaService,
        fincaService,
        trabajoService,
        trabajadorService
    ) {

        this.mainContent =
            mainContent;

        this.incidenciaService =
            incidenciaService;

        this.fincaService =
            fincaService;

        this.trabajoService =
            trabajoService;

        this.trabajadorService =
            trabajadorService;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const incidencias =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerTodas()
            );


        const abiertas =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerAbiertas()
            )
                .length;


        const revision =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerEnRevision()
            )
                .length;


        const resueltas =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerResueltas()
            )
                .length;


        const urgentes =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerUrgentesActivas()
            )
                .length;


        this.mainContent.innerHTML = `

            <div class="incidencias-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="incidencias-hero">

                    <div class="incidencias-hero-content">

                        <span class="incidencias-eyebrow">
                            ⚠️ PERSONAL
                        </span>


                        <h1>
                            Detecta el problema,
                            <span>
                                actúa a tiempo.
                            </span>
                        </h1>


                        <p>
                            Registra averías, problemas en cultivo,
                            incidencias de seguridad y cualquier aviso
                            que requiera atención en la explotación.
                        </p>


                        <button
                            id="nuevaIncidencia"
                            class="
                                primary-button
                                incidencias-hero-button
                            "
                            type="button"
                        >
                            + Nueva incidencia
                        </button>

                    </div>


                    <div class="incidencias-hero-image">

                        <div class="incidencias-hero-badge">

                            <span>
                                Incidencias activas
                            </span>

                            <strong>
                                ${abiertas + revision}
                            </strong>

                        </div>


                        <div class="incidencias-hero-copy">

                            <small>
                                DETECTA · COMUNICA · RESUELVE
                            </small>

                            <strong>
                                Ningún problema<br>
                                pasa desapercibido
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats incidencias-stats">

                    ${this.crearStat(
                        "⚠️",
                        "Abiertas",
                        abiertas
                    )}


                    ${this.crearStat(
                        "🔎",
                        "En revisión",
                        revision
                    )}


                    ${this.crearStat(
                        "✅",
                        "Resueltas",
                        resueltas
                    )}


                    ${this.crearStat(
                        "🚨",
                        "Urgentes",
                        urgentes
                    )}

                </section>


                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <div class="incidencias-section-header">

                    <div>

                        <span class="incidencias-section-eyebrow">
                            CONTROL DE INCIDENCIAS
                        </span>


                        <h2>
                            Avisos de la explotación
                        </h2>


                        <p>
                            Consulta el estado, prioridad y origen
                            de cada incidencia registrada.
                        </p>

                    </div>


                    <span class="incidencias-count">

                        ${incidencias.length}

                        ${
                            incidencias.length === 1
                                ? "incidencia"
                                : "incidencias"
                        }

                    </span>

                </div>


                <!-- ==========================================
                     LISTA
                =========================================== -->

                <div
                    id="listaIncidencias"
                    class="incidencias-grid"
                >

                    ${
                        incidencias.length ===
                        0

                            ? this.crearVacio()

                            : incidencias
                                .map(
                                    incidencia =>
                                        this.crearTarjeta(
                                            incidencia
                                        )
                                )
                                .join("")
                    }

                </div>

            </div>

        `;


        document
            .getElementById(
                "nuevaIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        this.configurarEventos();

    }


    // =====================================================
    // STAT
    // =====================================================

    crearStat(
        icono,
        titulo,
        valor
    ) {

        return `

            <article class="card">

                <span class="card-icon">
                    ${icono}
                </span>


                <div>

                    <p>
                        ${this.escapar(
                            titulo
                        )}
                    </p>


                    <h3>
                        ${valor}
                    </h3>

                </div>

            </article>

        `;

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        incidencia
    ) {

        const prioridad =
            incidencia.prioridad
            ||
            "Media";


        const estado =
            incidencia.estado
            ||
            "Abierta";


        const icono =
            this.obtenerIconoTipo(
                incidencia.tipo
            );


        return `

            <article class="incidencia-card">

                <!-- ==================================
                     CABECERA
                =================================== -->

                <div class="incidencia-card-top">

                    <div class="incidencia-card-main">

                        <span class="incidencia-card-icon">
                            ${icono}
                        </span>


                        <div>

                            <span class="incidencia-card-kicker">
                                INCIDENCIA
                            </span>


                            <h3>
                                ${this.escapar(
                                    incidencia.tipo
                                    ||
                                    "Incidencia"
                                )}
                            </h3>


                            <p>

                                ${
                                    incidencia.fincaNombre
                                        ? `📍 ${this.escapar(
                                            incidencia.fincaNombre
                                        )}`
                                        : "Sin finca concreta"
                                }

                            </p>

                        </div>

                    </div>


                    <span
                        class="
                            incidencia-priority
                            ${this.obtenerClasePrioridad(
                                prioridad
                            )}
                        "
                    >

                        ${this.escapar(
                            prioridad
                        )}

                    </span>

                </div>


                <!-- ==================================
                     ESTADO
                =================================== -->

                <div class="incidencia-status-row">

                    <span
                        class="
                            incidencia-status
                            ${this.obtenerClaseEstado(
                                estado
                            )}
                        "
                    >

                        ●
                        ${this.escapar(
                            estado
                        )}

                    </span>


                    <span class="incidencia-date">

                        🕒
                        ${this.formatearFechaHora(
                            incidencia.fechaCreacion
                        )}

                    </span>

                </div>


                <!-- ==================================
                     RELACIONES
                =================================== -->

                ${
                    incidencia.trabajoNombre
                    ||
                    incidencia.trabajadorNombre

                        ? `

                            <div class="incidencia-relations">

                                ${
                                    incidencia.trabajoNombre

                                        ? `

                                            <div>

                                                <span>
                                                    📋
                                                </span>


                                                <div>

                                                    <small>
                                                        Tarea
                                                    </small>

                                                    <strong>
                                                        ${this.escapar(
                                                            incidencia.trabajoNombre
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                        `

                                        : ""
                                }


                                ${
                                    incidencia.trabajadorNombre

                                        ? `

                                            <div>

                                                <span>
                                                    👷
                                                </span>


                                                <div>

                                                    <small>
                                                        Comunicada por
                                                    </small>

                                                    <strong>
                                                        ${this.escapar(
                                                            incidencia.trabajadorNombre
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }


                <!-- ==================================
                     DESCRIPCIÓN
                =================================== -->

                <div class="incidencia-description">

                    <span>
                        DESCRIPCIÓN
                    </span>


                    <p>
                        ${this.escapar(
                            incidencia.descripcion
                            ||
                            "Sin descripción."
                        )}
                    </p>

                </div>


                <!-- ==================================
                     RESOLUCIÓN
                =================================== -->

                ${
                    estado ===
                    "Resuelta"

                        ? `

                            <div class="incidencia-resolution">

                                <div>

                                    <span>
                                        ✅
                                    </span>


                                    <div>

                                        <strong>
                                            Incidencia resuelta
                                        </strong>

                                        <p>
                                            ${this.formatearFechaHora(
                                                incidencia.fechaResolucion
                                            )}
                                        </p>

                                    </div>

                                </div>


                                ${
                                    incidencia.observacionesResolucion

                                        ? `

                                            <p class="incidencia-resolution-notes">

                                                ${this.escapar(
                                                    incidencia.observacionesResolucion
                                                )}

                                            </p>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }


                <!-- ==================================
                     ACCIONES
                =================================== -->

                <div class="incidencia-actions">

                    ${
                        estado !==
                        "Resuelta"

                            ? `

                                ${
                                    estado !==
                                    "En revisión"

                                        ? `

                                            <button
                                                class="
                                                    secondary-button
                                                    incidencia-revision
                                                "
                                                data-id="${this.escapar(
                                                    incidencia.id
                                                )}"
                                                type="button"
                                            >
                                                🔎 En revisión
                                            </button>

                                        `

                                        : ""
                                }


                                <button
                                    class="
                                        primary-button
                                        incidencia-resolver
                                    "
                                    data-id="${this.escapar(
                                        incidencia.id
                                    )}"
                                    type="button"
                                >
                                    ✓ Resolver
                                </button>

                            `

                            : `

                                <button
                                    class="
                                        secondary-button
                                        incidencia-reabrir
                                    "
                                    data-id="${this.escapar(
                                        incidencia.id
                                    )}"
                                    type="button"
                                >
                                    ↩ Reabrir incidencia
                                </button>

                            `
                    }

                </div>

            </article>

        `;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .getElementById(
                "crearPrimeraIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        document
            .querySelectorAll(
                ".incidencia-revision"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstado(
                                boton.dataset.id,
                                "En revisión"
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".incidencia-resolver"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const observaciones =
                                prompt(
                                    "¿Cómo se ha resuelto la incidencia? Puedes dejarlo vacío."
                                )
                                ||
                                "";


                            this.cambiarEstado(
                                boton.dataset.id,
                                "Resuelta",
                                observaciones
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".incidencia-reabrir"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstado(
                                boton.dataset.id,
                                "Abierta"
                            );

                        }
                    );

                }
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

        const resultado =
            this.incidenciaService
                .cambiarEstado(
                    id,
                    estado,
                    observaciones
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido actualizar la incidencia."
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario() {

        const fincas =
            this.obtenerListaSegura(
                () =>
                    this.fincaService
                        .obtenerTodas()
            );


        const trabajos =
            this.obtenerListaSegura(
                () =>
                    this.trabajoService
                        .obtenerTodos()
            );


        const trabajadores =
            this.obtenerListaSegura(
                () =>
                    this.trabajadorService
                        .obtenerTodos()
            );


        this.mainContent.innerHTML = `

            <div class="incidencia-form-page">

                <button
                    id="volverIncidencias"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="incidencia-form-header">

                    <span>
                        ⚠️ PERSONAL
                    </span>


                    <h1>
                        Nueva incidencia
                    </h1>


                    <p>
                        Registra un problema o aviso relacionado
                        con la explotación.
                    </p>

                </header>


                <div class="incidencia-form-layout">

                    <section
                        class="
                            form-panel
                            incidencia-form-panel
                        "
                    >

                        <div class="incidencia-form-section">

                            <span>
                                ⚠️
                            </span>


                            <div>

                                <h3>
                                    Datos de la incidencia
                                </h3>


                                <p>
                                    Describe qué ha ocurrido
                                    y dónde se ha detectado.
                                </p>

                            </div>

                        </div>


                        <div class="incidencia-form-grid">

                            <div class="form-group">

                                <label>
                                    Tipo *
                                </label>


                                <select id="tipoIncidencia">

                                    <option value="Avería">
                                        Avería
                                    </option>

                                    <option value="Falta de material">
                                        Falta de material
                                    </option>

                                    <option value="Problema en cultivo">
                                        Problema en cultivo
                                    </option>

                                    <option value="Plaga / enfermedad">
                                        Plaga / enfermedad
                                    </option>

                                    <option value="Riego">
                                        Riego
                                    </option>

                                    <option value="Maquinaria">
                                        Maquinaria
                                    </option>

                                    <option value="Seguridad">
                                        Seguridad
                                    </option>

                                    <option value="Otro">
                                        Otro
                                    </option>

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Prioridad
                                </label>


                                <select id="prioridadIncidencia">

                                    <option value="Baja">
                                        Baja
                                    </option>

                                    <option
                                        value="Media"
                                        selected
                                    >
                                        Media
                                    </option>

                                    <option value="Alta">
                                        Alta
                                    </option>

                                    <option value="Urgente">
                                        Urgente
                                    </option>

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Finca
                                </label>


                                <select id="fincaIncidencia">

                                    <option value="">
                                        Sin finca concreta
                                    </option>


                                    ${fincas
                                        .map(
                                            finca => `

                                                <option
                                                    value="${finca.id}"
                                                >
                                                    ${this.escapar(
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
                                    Tarea relacionada
                                </label>


                                <select id="trabajoIncidencia">

                                    <option value="">
                                        Sin tarea relacionada
                                    </option>


                                    ${trabajos
                                        .map(
                                            trabajo => `

                                                <option
                                                    value="${trabajo.id}"
                                                >
                                                    ${this.escapar(
                                                        trabajo.titulo
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div
                                class="
                                    form-group
                                    incidencia-form-wide
                                "
                            >

                                <label>
                                    Trabajador que comunica
                                </label>


                                <select id="trabajadorIncidencia">

                                    <option value="">
                                        Administración
                                    </option>


                                    ${trabajadores
                                        .map(
                                            trabajador => `

                                                <option
                                                    value="${trabajador.id}"
                                                >
                                                    ${this.escapar(
                                                        this.obtenerNombreTrabajador(
                                                            trabajador
                                                        )
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div
                                class="
                                    form-group
                                    incidencia-form-wide
                                "
                            >

                                <label>
                                    Descripción *
                                </label>


                                <textarea
                                    id="descripcionIncidencia"
                                    rows="6"
                                    placeholder="Explica qué ha ocurrido..."
                                ></textarea>

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarIncidencia"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarIncidencia"
                                class="primary-button"
                                type="button"
                            >
                                Guardar incidencia
                            </button>

                        </div>

                    </section>


                    <aside class="incidencia-form-aside">

                        <div class="incidencia-form-photo">

                            <div>

                                <span>
                                    DETECCIÓN TEMPRANA
                                </span>


                                <strong>
                                    Ver el problema
                                    es empezar a resolverlo.
                                </strong>

                            </div>

                        </div>


                        <div class="incidencia-form-tip">

                            <span>
                                ⚡
                            </span>


                            <div>

                                <strong>
                                    Prioriza correctamente
                                </strong>


                                <p>
                                    Usa prioridad urgente solo para
                                    incidencias que necesitan atención
                                    inmediata.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverIncidencias"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarFormulario()
            );

    }


    // =====================================================
    // GUARDAR FORMULARIO
    // =====================================================

    guardarFormulario() {

        const descripcion =
            document
                .getElementById(
                    "descripcionIncidencia"
                )
                ?.value
                .trim()
            ||
            "";


        if (
            !descripcion
        ) {

            alert(
                "Escribe una descripción de la incidencia."
            );

            return;

        }


        const resultado =
            this.incidenciaService
                .crear(
                    {

                        tipo:
                            document
                                .getElementById(
                                    "tipoIncidencia"
                                )
                                .value,

                        prioridad:
                            document
                                .getElementById(
                                    "prioridadIncidencia"
                                )
                                .value,

                        fincaId:
                            document
                                .getElementById(
                                    "fincaIncidencia"
                                )
                                .value
                            ||
                            null,

                        trabajoId:
                            document
                                .getElementById(
                                    "trabajoIncidencia"
                                )
                                .value
                            ||
                            null,

                        trabajadorId:
                            document
                                .getElementById(
                                    "trabajadorIncidencia"
                                )
                                .value
                            ||
                            null,

                        descripcion,

                        origen:
                            "Administración"

                    }
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido registrar la incidencia."
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // ICONO TIPO
    // =====================================================

    obtenerIconoTipo(
        tipo
    ) {

        const iconos = {

            "Avería":
                "🔧",

            "Falta de material":
                "📦",

            "Problema en cultivo":
                "🌱",

            "Plaga / enfermedad":
                "🐛",

            "Riego":
                "💧",

            "Maquinaria":
                "🚜",

            "Seguridad":
                "🦺",

            "Otro":
                "⚠️"

        };


        return (
            iconos[tipo]
            ||
            "⚠️"
        );

    }


    // =====================================================
    // CLASE PRIORIDAD
    // =====================================================

    obtenerClasePrioridad(
        prioridad
    ) {

        if (
            prioridad ===
            "Urgente"
        ) {

            return "urgente";

        }


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
    // CLASE ESTADO
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        if (
            estado ===
            "Resuelta"
        ) {

            return "resuelta";

        }


        if (
            estado ===
            "En revisión"
        ) {

            return "revision";

        }


        return "abierta";

    }


    // =====================================================
    // NOMBRE TRABAJADOR
    // =====================================================

    obtenerNombreTrabajador(
        trabajador
    ) {

        if (
            typeof this.trabajadorService
                ?.obtenerNombreCompleto ===
            "function"
        ) {

            return this.trabajadorService
                .obtenerNombreCompleto(
                    trabajador
                );

        }


        return (
            [
                trabajador?.nombre,
                trabajador?.apellidos
            ]
                .filter(Boolean)
                .join(" ")
                .trim()
            ||
            "Trabajador"
        );

    }


    // =====================================================
    // LISTA SEGURA
    // =====================================================

    obtenerListaSegura(
        callback
    ) {

        try {

            const resultado =
                callback();


            return Array.isArray(
                resultado
            )
                ? resultado
                : [];

        }

        catch {

            return [];

        }

    }


    // =====================================================
    // VACÍO
    // =====================================================

    crearVacio() {

        return `

            <div class="incidencias-empty">

                <div class="incidencias-empty-icon">
                    ✅
                </div>


                <h3>
                    No hay incidencias
                </h3>


                <p>
                    Cuando se registre un problema o aviso
                    aparecerá aquí.
                </p>


                <button
                    id="crearPrimeraIncidencia"
                    class="primary-button"
                    type="button"
                >
                    + Registrar incidencia
                </button>

            </div>

        `;

    }


    // =====================================================
    // FORMATEAR FECHA
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

            return String(
                valor
            );

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


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    escapar(
        valor
    ) {

        return String(
            valor
            ??
            ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }

}