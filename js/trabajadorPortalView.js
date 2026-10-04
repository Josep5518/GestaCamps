export class TrabajadorPortalView {

    constructor(
        mainContent,
        trabajadorService,
        trabajoService,
        incidenciaService,
        fincaService,
        fichajeService,
        onSalirPortal = null
    ) {
        this.mainContent = mainContent;
        this.trabajadorService = trabajadorService;
        this.trabajoService = trabajoService;
        this.incidenciaService = incidenciaService;
        this.fincaService = fincaService;
        this.fichajeService = fichajeService;
        this.onSalirPortal = onSalirPortal;

        this.claveSesion = "gestacamps_trabajador_sesion";
        this.claveModoCampo = "gestacamps_modo_campo";
    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {
        const trabajador = this.obtenerTrabajadorSesion();

        if (trabajador) {

            if (this.estaModoCampoActivo()) {
                this.mostrarModoCampo(
                    trabajador
                );
            }

            else {
                this.mostrarPanel(
                    trabajador
                );
            }

            return;
        }

        this.mostrarAcceso();
    }


    // =====================================================
    // ACCESO POR PIN
    // =====================================================

    mostrarAcceso() {
        this.mainContent.innerHTML = `

            <div class="portal-login-screen">

                <div class="panel portal-login-card">

                    <div class="portal-login-header">

                        <div class="portal-login-icon">
                            👷
                        </div>

                        <h2>
                            Portal del trabajador
                        </h2>

                        <p>
                            Introduce tu PIN personal para acceder.
                        </p>

                    </div>


                    <div class="form-group">

                        <label>
                            PIN
                        </label>

                        <input
                            id="pinPortalTrabajador"
                            class="portal-login-pin"
                            type="password"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            maxlength="4"
                            autocomplete="off"
                            placeholder="••••"
                        >

                    </div>


                    <button
                        id="entrarPortalTrabajador"
                        class="primary-button portal-login-button"
                        type="button"
                    >
                        Entrar
                    </button>


                    <button
                        id="volverAdministracionPortal"
                        class="secondary-button portal-login-button portal-login-back"
                        type="button"
                    >
                        ← Volver a administración
                    </button>

                </div>

            </div>

        `;


        const input =
            document.getElementById(
                "pinPortalTrabajador"
            );


        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
                            0,
                            4
                        );

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    this.iniciarSesion();

                }

            }
        );


        document
            .getElementById(
                "entrarPortalTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.iniciarSesion()
            );


        document
            .getElementById(
                "volverAdministracionPortal"
            )
            .addEventListener(
                "click",
                () =>
                    this.volverAdministracion()
            );


        input.focus();
    }


    iniciarSesion() {
        const input =
            document.getElementById(
                "pinPortalTrabajador"
            );


        if (
            !input
        ) {
            return;
        }


        const pin =
            input.value.trim();


        if (
            !/^\d{4}$/.test(
                pin
            )
        ) {

            alert(
                "Introduce un PIN de 4 números."
            );

            return;
        }


        const trabajador =
            this.trabajadorService
                .obtenerPorPin(
                    pin
                );


        if (
            !trabajador
        ) {

            alert(
                "PIN incorrecto."
            );

            input.value =
                "";

            input.focus();

            return;
        }


        if (
            trabajador.estado !==
            "Activo"
        ) {

            alert(
                "Este trabajador está inactivo."
            );

            return;
        }


        sessionStorage.setItem(
            this.claveSesion,
            String(
                trabajador.id
            )
        );


        sessionStorage.removeItem(
            this.claveModoCampo
        );


        this.mostrarPanel(
            trabajador
        );
    }


    obtenerTrabajadorSesion() {
        const id =
            sessionStorage.getItem(
                this.claveSesion
            );


        if (
            !id
        ) {
            return null;
        }


        const trabajador =
            this.trabajadorService
                .obtenerPorId(
                    id
                );


        if (
            !trabajador
            ||
            trabajador.estado !==
            "Activo"
        ) {

            sessionStorage.removeItem(
                this.claveSesion
            );

            sessionStorage.removeItem(
                this.claveModoCampo
            );

            return null;
        }


        return trabajador;
    }


    cerrarSesion() {
        sessionStorage.removeItem(
            this.claveSesion
        );

        sessionStorage.removeItem(
            this.claveModoCampo
        );

        this.mostrarAcceso();
    }


    // =====================================================
    // MODO CAMPO
    // =====================================================

    estaModoCampoActivo() {
        return (
            sessionStorage.getItem(
                this.claveModoCampo
            ) ===
            "true"
        );
    }


    activarModoCampo(
        trabajador
    ) {

        sessionStorage.setItem(
            this.claveModoCampo,
            "true"
        );


        this.mostrarModoCampo(
            trabajador
        );
    }


    desactivarModoCampo(
        trabajador
    ) {

        sessionStorage.removeItem(
            this.claveModoCampo
        );


        this.mostrarPanel(
            trabajador
        );
    }


    // =====================================================
    // PANEL COMPLETO
    // =====================================================

    mostrarPanel(
        trabajador
    ) {

        const tareas =
            this.obtenerTareasTrabajador(
                trabajador.id
            );


        const pendientes =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "Pendiente"
            );


        const enCurso =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "En curso"
            );


        const completadas =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "Completada"
            );


        const incidencias =
            this.incidenciaService
                .obtenerPorTrabajador(
                    trabajador.id
                );


        const incidenciasActivas =
            incidencias.filter(
                incidencia =>
                    incidencia.estado !==
                    "Resuelta"
            );


        const fichajes =
            this.fichajeService

                ? this.fichajeService
                    .obtenerPorTrabajador(
                        trabajador.id
                    )
                    .slice(
                        0,
                        30
                    )

                : [];


        const correccionesPendientes =
            fichajes.filter(
                fichaje =>
                    fichaje.correccion
                    &&
                    fichaje.correccion.estado ===
                    "Pendiente"
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar portal-worker-hero">

                <div>

                    <p class="portal-worker-kicker">
                        Portal del trabajador
                    </p>

                    <h2>
                        Hola, ${this.obtenerNombreTrabajador(
                            trabajador
                        )}
                    </h2>

                    <p>
                        ${trabajador.puesto || "Trabajador"}
                    </p>

                </div>


                <div class="portal-header-actions">

                    <button
                        id="activarModoCampo"
                        class="primary-button"
                        type="button"
                    >
                        🌾 Modo campo
                    </button>


                    <button
                        id="comunicarIncidencia"
                        class="primary-button"
                        type="button"
                    >
                        ⚠️ Comunicar incidencia
                    </button>


                    <button
                        id="cerrarSesionTrabajador"
                        class="secondary-button"
                        type="button"
                    >
                        Cerrar sesión
                    </button>

                </div>

            </header>


            <section class="stats portal-worker-stats">

                ${this.crearStatPortal(
                    "📋",
                    "Mis tareas",
                    tareas.length
                )}


                ${this.crearStatPortal(
                    "🕒",
                    "Pendientes",
                    pendientes.length
                )}


                ${this.crearStatPortal(
                    "🚜",
                    "En curso",
                    enCurso.length
                )}


                ${this.crearStatPortal(
                    "⚠️",
                    "Incidencias abiertas",
                    incidenciasActivas.length
                )}


                ${this.crearStatPortal(
                    "✏️",
                    "Correcciones pendientes",
                    correccionesPendientes
                )}

            </section>


            ${
                this.crearSeccionTareas(
                    "🚜 En curso",
                    enCurso,
                    "enCurso"
                )
            }


            ${
                this.crearSeccionTareas(
                    "🕒 Pendientes",
                    pendientes,
                    "pendientes"
                )
            }


            ${
                this.crearSeccionTareas(
                    "✅ Completadas",
                    completadas,
                    "completadas"
                )
            }


            ${
                this.crearSeccionFichajes(
                    fichajes
                )
            }


            ${
                this.crearSeccionIncidencias(
                    incidencias
                )
            }

        `;


        document
            .getElementById(
                "cerrarSesionTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.cerrarSesion()
            );


        document
            .getElementById(
                "activarModoCampo"
            )
            .addEventListener(
                "click",
                () =>
                    this.activarModoCampo(
                        trabajador
                    )
            );


        document
            .getElementById(
                "comunicarIncidencia"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormularioIncidencia(
                        trabajador
                    )
            );


        this.configurarEventosTareas(
            trabajador
        );


        this.configurarEventosFichajes(
            trabajador
        );
    }


    crearStatPortal(
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
                        ${titulo}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;
    }


    // =====================================================
    // VISTA MODO CAMPO
    // =====================================================

    mostrarModoCampo(
        trabajador
    ) {

        const tareas =
            this.obtenerTareasTrabajador(
                trabajador.id
            );


        const pendientes =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "Pendiente"
            );


        const enCurso =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "En curso"
            );


        const incidencias =
            this.incidenciaService
                .obtenerPorTrabajador(
                    trabajador.id
                );


        const incidenciasActivas =
            incidencias.filter(
                incidencia =>
                    incidencia.estado !==
                    "Resuelta"
            );


        const tareaActual =
            enCurso.length >
            0

                ? enCurso[0]

                : null;


        this.mainContent.innerHTML = `

            <div class="modo-campo-shell">

                <section class="modo-campo-hero">

                    <div class="modo-campo-hero-content">

                        <div>

                            <p class="modo-campo-kicker">
                                🌾 GestaCamps · Modo campo
                            </p>

                            <h2>
                                ${this.obtenerNombreTrabajador(
                                    trabajador
                                )}
                            </h2>

                            <p class="modo-campo-role">
                                ${trabajador.puesto || "Trabajador"}
                            </p>

                        </div>


                        <button
                            id="salirModoCampo"
                            class="modo-campo-vista-completa"
                            type="button"
                        >
                            Vista completa
                        </button>

                    </div>

                </section>


                <section class="modo-campo-stats">

                    ${this.crearTarjetaCampoResumen(
                        "🚜",
                        "En curso",
                        enCurso.length
                    )}


                    ${this.crearTarjetaCampoResumen(
                        "🕒",
                        "Pendientes",
                        pendientes.length
                    )}


                    ${this.crearTarjetaCampoResumen(
                        "⚠️",
                        "Incidencias",
                        incidenciasActivas.length
                    )}

                </section>


                <section
                    class="
                        modo-campo-panel
                        modo-campo-trabajo-actual
                    "
                >

                    <p class="modo-campo-section-label">
                        Trabajo actual
                    </p>


                    ${
                        tareaActual

                            ? this.crearTareaActualCampo(
                                tareaActual
                            )

                            : `

                                <div class="modo-campo-empty">

                                    <div class="modo-campo-empty-icon">
                                        🌱
                                    </div>

                                    <strong>
                                        No tienes ninguna tarea en curso
                                    </strong>

                                    <p>
                                        Puedes iniciar una de tus tareas pendientes.
                                    </p>

                                </div>

                            `
                    }

                </section>


                <div class="modo-campo-quick-actions">

                    <button
                        id="campoVerTareas"
                        class="
                            modo-campo-action
                            modo-campo-action-primary
                        "
                        type="button"
                    >
                        📋 Mis tareas
                    </button>


                    <button
                        id="campoIncidencia"
                        class="
                            modo-campo-action
                            modo-campo-action-warning
                        "
                        type="button"
                    >
                        ⚠️ Comunicar incidencia
                    </button>

                </div>


                ${
                    pendientes.length >
                    0

                        ? `

                            <section class="modo-campo-panel">

                                <h3 class="modo-campo-panel-title">
                                    🕒 Próximas tareas
                                </h3>


                                <div class="modo-campo-pending-list">

                                    ${pendientes
                                        .map(
                                            tarea =>
                                                this.crearTarjetaPendienteCampo(
                                                    tarea
                                                )
                                        )
                                        .join("")}

                                </div>

                            </section>

                        `

                        : ""
                }


                ${
                    incidenciasActivas.length >
                    0

                        ? `

                            <section class="modo-campo-panel">

                                <h3 class="modo-campo-panel-title">
                                    ⚠️ Mis incidencias activas
                                </h3>


                                <div class="modo-campo-incidencias-list">

                                    ${incidenciasActivas
                                        .map(
                                            incidencia => `

                                                <div class="modo-campo-incidencia-item">

                                                    <strong>
                                                        ${incidencia.tipo}
                                                    </strong>

                                                    <p>
                                                        ${incidencia.descripcion}
                                                    </p>

                                                    <small>
                                                        ${incidencia.estado}
                                                        ·
                                                        ${incidencia.prioridad}
                                                    </small>

                                                </div>

                                            `
                                        )
                                        .join("")}

                                </div>

                            </section>

                        `

                        : ""
                }


                <button
                    id="campoCerrarSesion"
                    class="modo-campo-logout"
                    type="button"
                >
                    Cerrar sesión
                </button>

            </div>

        `;


        document
            .getElementById(
                "salirModoCampo"
            )
            .addEventListener(
                "click",
                () =>
                    this.desactivarModoCampo(
                        trabajador
                    )
            );


        document
            .getElementById(
                "campoVerTareas"
            )
            .addEventListener(
                "click",
                () =>
                    this.desactivarModoCampo(
                        trabajador
                    )
            );


        document
            .getElementById(
                "campoIncidencia"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormularioIncidencia(
                        trabajador,
                        true
                    )
            );


        document
            .getElementById(
                "campoCerrarSesion"
            )
            .addEventListener(
                "click",
                () =>
                    this.cerrarSesion()
            );


        document
            .querySelectorAll(
                ".campo-iniciar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstadoTareaCampo(
                                boton.dataset.id,
                                "En curso",
                                trabajador
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".campo-completar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstadoTareaCampo(
                                boton.dataset.id,
                                "Completada",
                                trabajador
                            );

                        }
                    );

                }
            );
    }


    crearTarjetaCampoResumen(
        icono,
        titulo,
        valor
    ) {

        return `

            <div class="modo-campo-stat-card">

                <div class="modo-campo-stat-icon">
                    ${icono}
                </div>

                <p>
                    ${titulo}
                </p>

                <strong>
                    ${valor}
                </strong>

            </div>

        `;
    }


    crearTareaActualCampo(
        tarea
    ) {

        return `

            <div class="modo-campo-current-task">

                <div class="modo-campo-current-head">

                    <div>

                        <h2>
                            ${tarea.titulo}
                        </h2>

                        <strong class="modo-campo-task-type">
                            ${tarea.tipo || "Trabajo"}
                        </strong>

                    </div>


                    <span class="modo-campo-status">
                        En curso
                    </span>

                </div>


                <div class="modo-campo-current-meta">

                    <div>
                        📍
                        <strong>
                            ${tarea.fincaNombre || "Sin finca"}
                        </strong>
                    </div>


                    ${
                        tarea.parcela

                            ? `

                                <div>
                                    🗺️ ${tarea.parcela}
                                </div>

                            `

                            : ""
                    }


                    ${
                        tarea.campaniaNombre

                            ? `

                                <div>
                                    🗓️ ${tarea.campaniaNombre}
                                </div>

                            `

                            : ""
                    }


                    ${
                        tarea.cultivo

                            ? `

                                <div>
                                    🌱 ${tarea.cultivo}
                                </div>

                            `

                            : ""
                    }


                    ${
                        tarea.maquinariaNombre

                            ? `

                                <div>
                                    🚜 ${tarea.maquinariaNombre}
                                </div>

                            `

                            : ""
                    }


                    <div>
                        ⚠️ Prioridad:
                        <strong>
                            ${tarea.prioridad || "Media"}
                        </strong>
                    </div>

                </div>


                ${
                    tarea.notas

                        ? `

                            <div class="modo-campo-task-notes">

                                <strong>
                                    Notas
                                </strong>

                                <p>
                                    ${tarea.notas}
                                </p>

                            </div>

                        `

                        : ""
                }


                <button
                    type="button"
                    class="
                        campo-completar-tarea
                        modo-campo-complete-button
                    "
                    data-id="${tarea.id}"
                >
                    ✅ Completar tarea
                </button>

            </div>

        `;
    }


    crearTarjetaPendienteCampo(
        tarea
    ) {

        return `

            <article class="modo-campo-pending-card">

                <h3>
                    ${tarea.titulo}
                </h3>

                <p>
                    📍 ${tarea.fincaNombre || "Sin finca"}
                </p>


                ${
                    tarea.campaniaNombre

                        ? `

                            <p>
                                🗓️ ${tarea.campaniaNombre}
                            </p>

                        `

                        : ""
                }


                <p>
                    📅 ${this.formatearFecha(
                        tarea.fecha
                    )}
                </p>


                <button
                    type="button"
                    class="
                        campo-iniciar-tarea
                        modo-campo-start-button
                    "
                    data-id="${tarea.id}"
                >
                    ▶️ Iniciar tarea
                </button>

            </article>

        `;
    }


    cambiarEstadoTareaCampo(
        tareaId,
        estado,
        trabajador
    ) {

        const resultado =
            this.cambiarEstadoTarea(
                tareaId,
                estado,
                trabajador,
                false
            );


        if (
            resultado
        ) {

            this.mostrarModoCampo(
                trabajador
            );

        }
    }


    // =====================================================
    // TAREAS
    // =====================================================

    obtenerTareasTrabajador(
        trabajadorId
    ) {

        return this.trabajoService
            .obtenerPorTrabajador(
                trabajadorId
            )
            .slice()
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        a.fecha
                    )
                    -
                    new Date(
                        b.fecha
                    )
            );
    }


    crearSeccionTareas(
        titulo,
        tareas,
        tipo
    ) {

        if (
            tareas.length ===
            0
        ) {
            return "";
        }


        return `

            <section class="panel portal-section">

                <div class="panel-header">

                    <h3>
                        ${titulo}
                    </h3>

                </div>


                <div class="portal-task-grid">

                    ${tareas
                        .map(
                            tarea =>
                                this.crearTarjetaTarea(
                                    tarea,
                                    tipo
                                )
                        )
                        .join("")}

                </div>

            </section>

        `;
    }


    crearTarjetaTarea(
        tarea,
        tipo
    ) {

        return `

            <article class="portal-task-card">

                <h3>
                    ${tarea.titulo}
                </h3>


                <strong class="portal-task-type">
                    ${tarea.tipo || "Trabajo"}
                </strong>


                <p class="trabajo-linea">
                    📍 ${tarea.fincaNombre || "Sin finca"}
                </p>


                ${
                    tarea.parcela

                        ? `

                            <p class="trabajo-linea">
                                🗺️ ${tarea.parcela}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.cultivo

                        ? `

                            <p class="trabajo-linea">
                                🌱 ${tarea.cultivo}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.campaniaNombre

                        ? `

                            <p class="trabajo-linea">
                                🗓️ ${tarea.campaniaNombre}
                            </p>

                        `

                        : ""
                }


                <p class="trabajo-linea">
                    📅 ${this.formatearFecha(
                        tarea.fecha
                    )}
                </p>


                <p class="trabajo-linea">
                    ⚠️ Prioridad:
                    <strong>
                        ${tarea.prioridad || "Media"}
                    </strong>
                </p>


                ${
                    tarea.maquinariaNombre

                        ? `

                            <p class="trabajo-linea">
                                🚜 ${tarea.maquinariaNombre}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.fechaInicio

                        ? `

                            <p class="trabajo-linea">
                                ▶️ Iniciada:
                                ${this.formatearFechaHora(
                                    tarea.fechaInicio
                                )}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.fechaCompletada

                        ? `

                            <p class="trabajo-linea">
                                ✅ Finalizada:
                                ${this.formatearFechaHora(
                                    tarea.fechaCompletada
                                )}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.notas

                        ? `

                            <div class="portal-task-notes">
                                ${tarea.notas}
                            </div>

                        `

                        : ""
                }


                <div
                    class="
                        form-actions
                        portal-task-actions
                    "
                >

                    ${
                        tipo ===
                        "pendientes"

                            ? `

                                <button
                                    class="
                                        primary-button
                                        portal-iniciar-tarea
                                    "
                                    data-id="${tarea.id}"
                                    type="button"
                                >
                                    ▶️ Iniciar tarea
                                </button>

                            `

                            : ""
                    }


                    ${
                        tipo ===
                        "enCurso"

                            ? `

                                <button
                                    class="
                                        primary-button
                                        portal-completar-tarea
                                    "
                                    data-id="${tarea.id}"
                                    type="button"
                                >
                                    ✅ Completar
                                </button>

                            `

                            : ""
                    }

                </div>

            </article>

        `;
    }


    configurarEventosTareas(
        trabajador
    ) {

        document
            .querySelectorAll(
                ".portal-iniciar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.cambiarEstadoTarea(
                                boton.dataset.id,
                                "En curso",
                                trabajador
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".portal-completar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.cambiarEstadoTarea(
                                boton.dataset.id,
                                "Completada",
                                trabajador
                            )
                    );

                }
            );
    }


    cambiarEstadoTarea(
        tareaId,
        estado,
        trabajador,
        repintar = true
    ) {

        const tarea =
            this.trabajoService
                .obtenerPorId(
                    tareaId
                );


        if (
            !tarea
        ) {

            alert(
                "La tarea no existe."
            );

            return false;
        }


        const asignado =
            Array.isArray(
                tarea.trabajadorIds
            )
            &&
            tarea.trabajadorIds
                .some(
                    id =>
                        String(
                            id
                        ) ===
                        String(
                            trabajador.id
                        )
                );


        if (
            !asignado
        ) {

            alert(
                "Esta tarea no está asignada a este trabajador."
            );

            return false;
        }


        const resultado =
            this.trabajoService
                .cambiarEstado(
                    tareaId,
                    estado
                );


        if (
            !resultado.ok
        ) {

            alert(
                resultado.mensaje
            );

            return false;
        }


        if (
            repintar
        ) {

            this.mostrarPanel(
                trabajador
            );

        }


        return true;
    }


    // =====================================================
    // FICHAJES
    // =====================================================

    crearSeccionFichajes(
        fichajes
    ) {

        return `

            <section class="panel portal-section">

                <div class="panel-header">

                    <h3>
                        🕒 Mis fichajes
                    </h3>

                    <p>
                        Consulta tus entradas y salidas y solicita una corrección si detectas una hora incorrecta.
                    </p>

                </div>


                ${
                    fichajes.length ===
                    0

                        ? `

                            <div class="empty-state">

                                <div class="empty-icon">
                                    🕒
                                </div>

                                <h3>
                                    Todavía no tienes fichajes
                                </h3>

                                <p>
                                    Tus entradas y salidas aparecerán aquí.
                                </p>

                            </div>

                        `

                        : `

                            <div class="portal-fichajes-list">

                                ${fichajes
                                    .map(
                                        fichaje =>
                                            this.crearTarjetaFichaje(
                                                fichaje
                                            )
                                    )
                                    .join("")}

                            </div>

                        `
                }

            </section>

        `;
    }


    crearTarjetaFichaje(
        fichaje
    ) {

        const correccion =
            fichaje.correccion
            ||
            null;


        const estadoCorreccion =
            correccion?.estado
            ||
            "";


        const puedeSolicitar =
            estadoCorreccion !==
            "Pendiente";


        const claseEstado =
            this.obtenerClaseCorreccion(
                estadoCorreccion
            );


        return `

            <article class="portal-fichaje-item">

                <div class="portal-fichaje-head">

                    <div class="portal-fichaje-identity">

                        <span>

                            ${
                                fichaje.tipo ===
                                "Entrada"

                                    ? "🟢"

                                    : "🔴"
                            }

                        </span>


                        <div>

                            <strong>
                                ${fichaje.tipo}
                            </strong>

                            <p>
                                ${this.formatearFecha(
                                    fichaje.fecha
                                )}
                                ·
                                ${fichaje.hora}
                            </p>

                        </div>

                    </div>


                    ${
                        estadoCorreccion

                            ? `

                                <span
                                    class="
                                        portal-correction-status
                                        ${claseEstado}
                                    "
                                >
                                    Corrección ${estadoCorreccion}
                                </span>

                            `

                            : ""
                    }

                </div>


                ${
                    correccion

                        ? `

                            <div class="portal-correction-box">

                                <p>

                                    <strong>
                                        Hora solicitada:
                                    </strong>

                                    ${correccion.nuevaHora || "—"}

                                </p>


                                <p class="portal-correction-muted">
                                    ${correccion.motivo || "Sin motivo"}
                                </p>


                                ${
                                    estadoCorreccion ===
                                    "Aprobada"

                                        ? `

                                            <p class="portal-correction-original">
                                                Hora original:
                                                ${correccion.horaOriginal || "—"}
                                            </p>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }


                ${
                    puedeSolicitar

                        ? `

                            <button
                                type="button"
                                class="
                                    secondary-button
                                    portal-corregir-fichaje
                                "
                                data-id="${fichaje.id}"
                            >
                                ✏️ Solicitar corrección
                            </button>

                        `

                        : `

                            <p class="portal-correction-pending">
                                ⏳ Esta solicitud está pendiente de revisión.
                            </p>

                        `
                }

            </article>

        `;
    }


    obtenerClaseCorreccion(
        estado
    ) {

        if (
            estado ===
            "Aprobada"
        ) {
            return "aprobada";
        }


        if (
            estado ===
            "Rechazada"
        ) {
            return "rechazada";
        }


        return "pendiente";
    }


    configurarEventosFichajes(
        trabajador
    ) {

        document
            .querySelectorAll(
                ".portal-corregir-fichaje"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormularioCorreccion(
                                trabajador,
                                boton.dataset.id
                            );

                        }
                    );

                }
            );
    }


    mostrarFormularioCorreccion(
        trabajador,
        fichajeId
    ) {

        const fichaje =
            this.fichajeService
                .obtenerPorId(
                    fichajeId
                );


        if (
            !fichaje
            ||
            String(
                fichaje.trabajadorId
            ) !==
            String(
                trabajador.id
            )
        ) {

            alert(
                "El fichaje seleccionado no existe o no pertenece a este trabajador."
            );


            this.mostrarPanel(
                trabajador
            );


            return;
        }


        if (
            fichaje.correccion
            &&
            fichaje.correccion.estado ===
            "Pendiente"
        ) {

            alert(
                "Este fichaje ya tiene una solicitud de corrección pendiente."
            );


            this.mostrarPanel(
                trabajador
            );


            return;
        }


        this.mainContent.innerHTML = `

            <button
                id="volverCorreccionFichaje"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar portal-form-header">

                <div>

                    <h2>
                        Solicitar corrección
                    </h2>

                    <p>
                        Solicita un cambio de hora para este fichaje.
                    </p>

                </div>

            </header>


            <div class="form-panel portal-form-panel">

                <div class="portal-fichaje-summary">

                    <strong>
                        ${fichaje.tipo}
                    </strong>

                    <p>
                        ${this.formatearFecha(
                            fichaje.fecha
                        )}
                        ·
                        Hora actual:
                        <strong>
                            ${fichaje.hora}
                        </strong>
                    </p>

                </div>


                <div class="form-group">

                    <label>
                        Nueva hora *
                    </label>

                    <input
                        id="portalNuevaHoraFichaje"
                        type="time"
                        value="${String(
                            fichaje.hora
                            ||
                            ""
                        ).slice(
                            0,
                            5
                        )}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Motivo de la corrección *
                    </label>

                    <textarea
                        id="portalMotivoCorreccionFichaje"
                        rows="5"
                        placeholder="Ej. Olvidé fichar a la hora correcta..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarCorreccionFichaje"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="enviarCorreccionFichaje"
                        class="primary-button"
                        type="button"
                    >
                        Enviar solicitud
                    </button>

                </div>

            </div>

        `;


        const volver =
            () =>
                this.mostrarPanel(
                    trabajador
                );


        document
            .getElementById(
                "volverCorreccionFichaje"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "cancelarCorreccionFichaje"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "enviarCorreccionFichaje"
            )
            .addEventListener(
                "click",
                () => {

                    const nuevaHora =
                        document
                            .getElementById(
                                "portalNuevaHoraFichaje"
                            )
                            .value;


                    const motivo =
                        document
                            .getElementById(
                                "portalMotivoCorreccionFichaje"
                            )
                            .value;


                    const resultado =
                        this.fichajeService
                            .solicitarCorreccion(
                                trabajador.id,
                                fichaje.id,
                                nuevaHora,
                                motivo
                            );


                    if (
                        !resultado.ok
                    ) {

                        alert(
                            resultado.mensaje
                        );

                        return;
                    }


                    alert(
                        resultado.mensaje
                    );


                    this.mostrarPanel(
                        trabajador
                    );

                }
            );
    }


    // =====================================================
    // INCIDENCIAS
    // =====================================================

    crearSeccionIncidencias(
        incidencias
    ) {

        if (
            incidencias.length ===
            0
        ) {
            return "";
        }


        return `

            <section class="panel portal-section">

                <div class="panel-header">

                    <h3>
                        ⚠️ Mis incidencias
                    </h3>

                </div>


                <div class="portal-incidencias-list">

                    ${incidencias
                        .map(
                            incidencia => `

                                <div
                                    class="
                                        activity
                                        portal-incidencia-item
                                    "
                                >

                                    <span>

                                        ${
                                            incidencia.estado ===
                                            "Resuelta"

                                                ? "✅"

                                                : "⚠️"
                                        }

                                    </span>


                                    <div class="portal-incidencia-content">

                                        <strong>
                                            ${incidencia.tipo}
                                        </strong>

                                        <p>
                                            ${incidencia.descripcion}
                                        </p>

                                        <p>
                                            ${this.formatearFechaHora(
                                                incidencia.fechaCreacion
                                            )}
                                            ·
                                            ${incidencia.estado}
                                        </p>

                                    </div>

                                </div>

                            `
                        )
                        .join("")}

                </div>

            </section>

        `;
    }


    mostrarFormularioIncidencia(
        trabajador,
        volverAModoCampo = false
    ) {

        const tareas =
            this.trabajoService
                .obtenerPorTrabajador(
                    trabajador.id
                );


        const fincas =
            this.fincaService
                .obtenerTodas();


        this.mainContent.innerHTML = `

            <button
                id="volverPortalIncidencia"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar portal-form-header">

                <div>

                    <h2>
                        Comunicar incidencia
                    </h2>

                    <p>
                        Explica el problema para que administración pueda revisarlo
                    </p>

                </div>

            </header>


            <div class="form-panel portal-form-panel">

                <div class="form-group">

                    <label>
                        Tipo *
                    </label>

                    <select id="portalTipoIncidencia">

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

                    <select id="portalPrioridadIncidencia">

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

                    <select id="portalFincaIncidencia">

                        <option value="">
                            Sin finca concreta
                        </option>


                        ${fincas
                            .map(
                                finca => `

                                    <option value="${finca.id}">
                                        ${finca.nombre}
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

                    <select id="portalTrabajoIncidencia">

                        <option value="">
                            Sin tarea relacionada
                        </option>


                        ${tareas
                            .map(
                                tarea => `

                                    <option value="${tarea.id}">
                                        ${tarea.titulo}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Descripción *
                    </label>

                    <textarea
                        id="portalDescripcionIncidencia"
                        rows="6"
                        placeholder="Explica qué ha ocurrido..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarPortalIncidencia"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarPortalIncidencia"
                        class="primary-button"
                        type="button"
                    >
                        Comunicar incidencia
                    </button>

                </div>

            </div>

        `;


        const volver =
            () => {

                if (
                    volverAModoCampo
                ) {

                    this.mostrarModoCampo(
                        trabajador
                    );

                }

                else {

                    this.mostrarPanel(
                        trabajador
                    );

                }

            };


        document
            .getElementById(
                "volverPortalIncidencia"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "cancelarPortalIncidencia"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "guardarPortalIncidencia"
            )
            .addEventListener(
                "click",
                () => {

                    const resultado =
                        this.incidenciaService
                            .crear(
                                {

                                    tipo:
                                        document
                                            .getElementById(
                                                "portalTipoIncidencia"
                                            )
                                            .value,

                                    prioridad:
                                        document
                                            .getElementById(
                                                "portalPrioridadIncidencia"
                                            )
                                            .value,

                                    fincaId:
                                        document
                                            .getElementById(
                                                "portalFincaIncidencia"
                                            )
                                            .value
                                        ||
                                        null,

                                    trabajoId:
                                        document
                                            .getElementById(
                                                "portalTrabajoIncidencia"
                                            )
                                            .value
                                        ||
                                        null,

                                    trabajadorId:
                                        trabajador.id,

                                    descripcion:
                                        document
                                            .getElementById(
                                                "portalDescripcionIncidencia"
                                            )
                                            .value,

                                    origen:
                                        "Portal trabajador"

                                }
                            );


                    if (
                        !resultado.ok
                    ) {

                        alert(
                            resultado.mensaje
                        );

                        return;
                    }


                    alert(
                        "Incidencia comunicada correctamente."
                    );


                    volver();

                }
            );
    }


    // =====================================================
    // SALIR / HELPERS
    // =====================================================

    volverAdministracion() {
        sessionStorage.removeItem(
            this.claveSesion
        );

        sessionStorage.removeItem(
            this.claveModoCampo
        );


        if (
            typeof
            this.onSalirPortal ===
            "function"
        ) {

            this.onSalirPortal();

        }
    }


    obtenerNombreTrabajador(
        trabajador
    ) {

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


    formatearFecha(
        fecha
    ) {

        if (
            !fecha
        ) {
            return "—";
        }


        const partes =
            fecha.split(
                "-"
            );


        if (
            partes.length !==
            3
        ) {
            return fecha;
        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );
    }


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