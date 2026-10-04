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

        this.mainContent =
            mainContent;

        this.trabajadorService =
            trabajadorService;

        this.trabajoService =
            trabajoService;

        this.incidenciaService =
            incidenciaService;

        this.fincaService =
            fincaService;

        this.fichajeService =
            fichajeService;

        this.onSalirPortal =
            onSalirPortal;


        this.claveSesion =
            "gestacamps_trabajador_sesion";


        this.claveModoCampo =
            "gestacamps_modo_campo";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const trabajador =
            this.obtenerTrabajadorSesion();


        if (
            trabajador
        ) {

            if (
                this.estaModoCampoActivo()
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


            return;

        }


        this.mostrarAcceso();

    }


    // =====================================================
    // ACCESO
    // =====================================================

    mostrarAcceso() {

        this.mainContent.innerHTML = `

            <div class="portal-access-page">

                <div class="portal-access-layout">

                    <section class="portal-access-photo">

                        <div class="portal-access-brand">

                            <span>
                                🌿 GESTACAMPS
                            </span>


                            <strong>
                                Tu jornada,<br>
                                en tus manos.
                            </strong>


                            <p>
                                Consulta tus tareas, registra tu actividad
                                y mantente conectado con la explotación.
                            </p>

                        </div>

                    </section>


                    <section class="portal-access-card">

                        <div class="portal-access-icon">
                            👷
                        </div>


                        <span class="portal-access-eyebrow">
                            PORTAL DEL TRABAJADOR
                        </span>


                        <h1>
                            Bienvenido
                        </h1>


                        <p class="portal-access-subtitle">
                            Introduce tu PIN personal para acceder
                            a tu espacio de trabajo.
                        </p>


                        <div class="portal-pin-group">

                            <label for="pinPortalTrabajador">
                                PIN personal
                            </label>


                            <input
                                id="pinPortalTrabajador"
                                type="password"
                                inputmode="numeric"
                                pattern="[0-9]*"
                                maxlength="4"
                                autocomplete="off"
                                placeholder="••••"
                            >


                            <small>
                                Introduce los 4 números de tu PIN.
                            </small>

                        </div>


                        <button
                            id="entrarPortalTrabajador"
                            class="
                                primary-button
                                portal-access-main-button
                            "
                            type="button"
                        >
                            Entrar al portal
                        </button>


                        <button
                            id="volverAdministracionPortal"
                            class="
                                secondary-button
                                portal-access-back-button
                            "
                            type="button"
                        >
                            ← Volver a administración
                        </button>

                    </section>

                </div>

            </div>

        `;


        const input =
            document.getElementById(
                "pinPortalTrabajador"
            );


        input
            ?.addEventListener(
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


        input
            ?.addEventListener(
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
            ?.addEventListener(
                "click",
                () =>
                    this.iniciarSesion()
            );


        document
            .getElementById(
                "volverAdministracionPortal"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.volverAdministracion()
            );


        input?.focus();

    }


    // =====================================================
    // INICIAR SESIÓN
    // =====================================================

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

            input.focus();

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


    // =====================================================
    // TRABAJADOR SESIÓN
    // =====================================================

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


    // =====================================================
    // CERRAR SESIÓN
    // =====================================================

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
    // PANEL PRINCIPAL
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
                    ||
                    tarea.estado ===
                    "Completado"
            );


        const incidencias =
            this.obtenerIncidenciasTrabajador(
                trabajador.id
            );


        const incidenciasActivas =
            incidencias.filter(
                incidencia =>
                    incidencia.estado !==
                    "Resuelta"
            );


        const fichajes =
            this.obtenerFichajesTrabajador(
                trabajador.id
            )
                .slice(
                    0,
                    20
                );


        const correccionesPendientes =
            fichajes.filter(
                fichaje =>
                    fichaje.correccion
                    &&
                    fichaje.correccion.estado ===
                    "Pendiente"
            );


        const nombre =
            this.obtenerNombreTrabajador(
                trabajador
            );


        this.mainContent.innerHTML = `

            <div class="portal-worker-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="portal-worker-hero">

                    <div class="portal-worker-hero-content">

                        <span class="portal-worker-eyebrow">
                            👷 PORTAL DEL TRABAJADOR
                        </span>


                        <h1>
                            Hola,
                            <span>
                                ${this.escapar(
                                    nombre
                                )}
                            </span>
                        </h1>


                        <p>
                            ${this.escapar(
                                trabajador.puesto
                                ||
                                "Trabajador"
                            )}
                            · Consulta tu jornada y tus tareas.
                        </p>


                        <div class="portal-worker-actions">

                            <button
                                id="activarModoCampo"
                                class="primary-button"
                                type="button"
                            >
                                🌾 Modo campo
                            </button>


                            <button
                                id="comunicarIncidencia"
                                class="secondary-button"
                                type="button"
                            >
                                ⚠️ Comunicar incidencia
                            </button>


                            <button
                                id="cerrarSesionTrabajador"
                                class="portal-logout-button"
                                type="button"
                            >
                                Cerrar sesión
                            </button>

                        </div>

                    </div>


                    <div class="portal-worker-hero-image">

                        <div class="portal-worker-avatar">

                            ${
                                trabajador.foto

                                    ? `

                                        <img
                                            src="${this.escapar(
                                                trabajador.foto
                                            )}"
                                            alt=""
                                        >

                                    `

                                    : `

                                        ${this.obtenerIniciales(
                                            trabajador
                                        )}

                                    `
                            }

                        </div>


                        <div class="portal-worker-hero-copy">

                            <small>
                                TU JORNADA · TUS TAREAS
                            </small>

                            <strong>
                                Todo lo que necesitas<br>
                                para trabajar hoy
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats portal-worker-stats">

                    ${this.crearStat(
                        "📋",
                        "Mis tareas",
                        tareas.length
                    )}


                    ${this.crearStat(
                        "🕒",
                        "Pendientes",
                        pendientes.length
                    )}


                    ${this.crearStat(
                        "🚜",
                        "En curso",
                        enCurso.length
                    )}


                    ${this.crearStat(
                        "⚠️",
                        "Incidencias",
                        incidenciasActivas.length
                    )}


                    ${this.crearStat(
                        "✏️",
                        "Correcciones",
                        correccionesPendientes.length
                    )}

                </section>


                <!-- ==========================================
                     TAREAS
                =========================================== -->

                ${this.crearSeccionTareas(
                    "🚜",
                    "En curso",
                    "Tareas que estás realizando ahora.",
                    enCurso,
                    "enCurso"
                )}


                ${this.crearSeccionTareas(
                    "🕒",
                    "Pendientes",
                    "Próximos trabajos asignados.",
                    pendientes,
                    "pendientes"
                )}


                ${this.crearSeccionTareas(
                    "✅",
                    "Completadas",
                    "Trabajos que ya has finalizado.",
                    completadas,
                    "completadas"
                )}


                ${this.crearSeccionFichajes(
                    fichajes
                )}


                ${this.crearSeccionIncidencias(
                    incidencias
                )}

            </div>

        `;


        document
            .getElementById(
                "cerrarSesionTrabajador"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.cerrarSesion()
            );


        document
            .getElementById(
                "activarModoCampo"
            )
            ?.addEventListener(
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
            ?.addEventListener(
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
    // SECCIÓN TAREAS
    // =====================================================

    crearSeccionTareas(
        icono,
        titulo,
        descripcion,
        tareas,
        tipo
    ) {

        return `

            <section class="portal-section">

                <div class="portal-section-header">

                    <div>

                        <span class="portal-section-eyebrow">
                            MIS TAREAS
                        </span>


                        <h2>
                            ${icono}
                            ${this.escapar(
                                titulo
                            )}
                        </h2>


                        <p>
                            ${this.escapar(
                                descripcion
                            )}
                        </p>

                    </div>


                    <span class="portal-section-count">
                        ${tareas.length}
                    </span>

                </div>


                <div class="portal-task-grid">

                    ${
                        tareas.length

                            ? tareas
                                .map(
                                    tarea =>
                                        this.crearTarjetaTarea(
                                            tarea,
                                            tipo
                                        )
                                )
                                .join("")

                            : this.crearEstadoVacio(
                                "🌱",
                                `No hay tareas ${titulo.toLowerCase()}`,
                                "Cuando tengas nuevas tareas aparecerán aquí."
                            )
                    }

                </div>

            </section>

        `;

    }


    // =====================================================
    // TARJETA TAREA
    // =====================================================

    crearTarjetaTarea(
        tarea,
        tipo
    ) {

        return `

            <article class="portal-task-card">

                <div class="portal-task-top">

                    <div>

                        <span class="portal-task-kicker">
                            ${this.escapar(
                                tarea.tipo
                                ||
                                "TRABAJO"
                            )}
                        </span>


                        <h3>
                            ${this.escapar(
                                tarea.titulo
                                ||
                                "Tarea"
                            )}
                        </h3>

                    </div>


                    <span
                        class="
                            portal-task-status
                            ${this.obtenerClaseEstado(
                                tarea.estado
                            )}
                        "
                    >
                        ${this.escapar(
                            tarea.estado
                            ||
                            "Pendiente"
                        )}
                    </span>

                </div>


                <div class="portal-task-location">

                    📍
                    ${this.escapar(
                        tarea.fincaNombre
                        ||
                        "Sin finca"
                    )}

                    ${
                        tarea.parcela

                            ? ` · ${this.escapar(
                                tarea.parcela
                            )}`

                            : ""
                    }

                </div>


                <div class="portal-task-data">

                    <div>

                        <span>
                            Fecha
                        </span>

                        <strong>
                            ${this.formatearFecha(
                                tarea.fecha
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Prioridad
                        </span>

                        <strong>
                            ${this.escapar(
                                tarea.prioridad
                                ||
                                "Media"
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    tarea.campaniaNombre

                        ? `

                            <span class="portal-task-chip">
                                🗓️
                                ${this.escapar(
                                    tarea.campaniaNombre
                                )}
                            </span>

                        `

                        : ""
                }


                ${
                    tarea.cultivo

                        ? `

                            <span class="portal-task-chip">
                                🌱
                                ${this.escapar(
                                    tarea.cultivo
                                )}
                            </span>

                        `

                        : ""
                }


                ${
                    tarea.maquinariaNombre

                        ? `

                            <div class="portal-task-resource">

                                🚜
                                ${this.escapar(
                                    tarea.maquinariaNombre
                                )}

                            </div>

                        `

                        : ""
                }


                ${
                    tarea.notas

                        ? `

                            <div class="portal-task-notes">

                                <span>
                                    NOTAS
                                </span>

                                <p>
                                    ${this.escapar(
                                        tarea.notas
                                    )}
                                </p>

                            </div>

                        `

                        : ""
                }


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
                                ▶ Iniciar tarea
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
                                ✓ Completar tarea
                            </button>

                        `

                        : ""
                }

            </article>

        `;

    }


    // =====================================================
    // EVENTOS TAREAS
    // =====================================================

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
                        () => {

                            this.cambiarEstadoTarea(
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
                ".portal-completar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstadoTarea(
                                boton.dataset.id,
                                "Completada",
                                trabajador
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // CAMBIAR ESTADO TAREA
    // =====================================================

    cambiarEstadoTarea(
        id,
        estado,
        trabajador
    ) {

        const resultado =
            this.trabajoService
                .cambiarEstado(
                    id,
                    estado
                );


        if (
            resultado
            &&
            resultado.ok ===
            false
        ) {

            alert(
                resultado.mensaje
                ||
                "No se ha podido actualizar la tarea."
            );

            return;

        }


        this.mostrarPanel(
            trabajador
        );

    }


    // =====================================================
    // FICHAJES
    // =====================================================

    crearSeccionFichajes(
        fichajes
    ) {

        if (
            !this.fichajeService
        ) {

            return "";

        }


        return `

            <section class="portal-section">

                <div class="portal-section-header">

                    <div>

                        <span class="portal-section-eyebrow">
                            JORNADA
                        </span>


                        <h2>
                            ⏱️ Mis fichajes
                        </h2>


                        <p>
                            Entradas, salidas y solicitudes de corrección.
                        </p>

                    </div>


                    <span class="portal-section-count">
                        ${fichajes.length}
                    </span>

                </div>


                <div class="portal-fichajes-list">

                    ${
                        fichajes.length

                            ? fichajes
                                .map(
                                    fichaje =>
                                        this.crearFilaFichajePortal(
                                            fichaje
                                        )
                                )
                                .join("")

                            : this.crearEstadoVacio(
                                "⏱️",
                                "Todavía no hay fichajes",
                                "Tus entradas y salidas aparecerán aquí."
                            )
                    }

                </div>

            </section>

        `;

    }


    // =====================================================
    // FILA FICHAJE
    // =====================================================

    crearFilaFichajePortal(
        fichaje
    ) {

        const correccion =
            fichaje.correccion
            ||
            null;


        const pendiente =
            correccion
            &&
            correccion.estado ===
            "Pendiente";


        return `

            <div class="portal-fichaje-row">

                <span
                    class="
                        portal-fichaje-icon
                        ${
                            fichaje.tipo ===
                            "Entrada"

                                ? "entrada"

                                : "salida"
                        }
                    "
                >

                    ${
                        fichaje.tipo ===
                        "Entrada"
                            ? "↗"
                            : "↙"
                    }

                </span>


                <div class="portal-fichaje-main">

                    <strong>
                        ${this.escapar(
                            fichaje.tipo
                            ||
                            "Fichaje"
                        )}
                    </strong>


                    <p>
                        ${this.formatearFecha(
                            fichaje.fecha
                        )}
                        ·
                        ${this.escapar(
                            fichaje.hora
                            ||
                            "—"
                        )}
                    </p>


                    ${
                        correccion

                            ? `

                                <span
                                    class="
                                        portal-correction-pill
                                        ${this.obtenerClaseCorreccion(
                                            correccion.estado
                                        )}
                                    "
                                >
                                    ✏️ Corrección
                                    ${this.escapar(
                                        correccion.estado
                                    )}
                                </span>

                            `

                            : ""
                    }

                </div>


                <button
                    type="button"
                    class="
                        secondary-button
                        portal-solicitar-correccion
                    "
                    data-fichaje-id="${fichaje.id}"
                    ${pendiente ? "disabled" : ""}
                >

                    ${
                        pendiente
                            ? "⌛ Pendiente"
                            : "✏️ Corregir"
                    }

                </button>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS FICHAJES
    // =====================================================

    configurarEventosFichajes(
        trabajador
    ) {

        document
            .querySelectorAll(
                ".portal-solicitar-correccion"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            if (
                                boton.disabled
                            ) {

                                return;

                            }


                            this.mostrarFormularioCorreccion(
                                trabajador,
                                boton.dataset.fichajeId
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // CORRECCIÓN
    // =====================================================

    mostrarFormularioCorreccion(
        trabajador,
        fichajeId
    ) {

        if (
            !this.fichajeService
        ) {

            alert(
                "El servicio de fichajes no está disponible."
            );

            return;

        }


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
                "No se ha podido encontrar el fichaje."
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
                "Este fichaje ya tiene una corrección pendiente."
            );

            return;

        }


        const horaActual =
            String(
                fichaje.hora
                ||
                ""
            )
                .slice(
                    0,
                    5
                );


        this.mainContent.innerHTML = `

            <div class="portal-form-page">

                <button
                    id="volverCorreccionFichaje"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="portal-form-header">

                    <span>
                        ✏️ PORTAL DEL TRABAJADOR
                    </span>


                    <h1>
                        Solicitar corrección
                    </h1>


                    <p>
                        Envía la hora correcta para que administración
                        pueda revisarla.
                    </p>

                </header>


                <div class="portal-form-layout">

                    <section
                        class="
                            form-panel
                            portal-form-panel
                        "
                    >

                        <div class="portal-current-record">

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
                                    ${this.escapar(
                                        fichaje.tipo
                                    )}
                                </strong>

                                <p>
                                    ${this.formatearFecha(
                                        fichaje.fecha
                                    )}
                                    · Hora actual:
                                    ${this.escapar(
                                        fichaje.hora
                                    )}
                                </p>

                            </div>

                        </div>


                        <div class="form-group">

                            <label>
                                Nueva hora *
                            </label>


                            <input
                                id="portalNuevaHoraFichaje"
                                type="time"
                                value="${horaActual}"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Motivo *
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

                    </section>

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
            ?.addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "cancelarCorreccionFichaje"
            )
            ?.addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "enviarCorreccionFichaje"
            )
            ?.addEventListener(
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
                            .value
                            .trim();


                    if (
                        !nuevaHora
                        ||
                        !motivo
                    ) {

                        alert(
                            "Indica la nueva hora y el motivo."
                        );

                        return;

                    }


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
                        ||
                        "Solicitud enviada."
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

            <section class="portal-section">

                <div class="portal-section-header">

                    <div>

                        <span class="portal-section-eyebrow">
                            COMUNICACIONES
                        </span>


                        <h2>
                            ⚠️ Mis incidencias
                        </h2>


                        <p>
                            Incidencias comunicadas a administración.
                        </p>

                    </div>


                    <span class="portal-section-count">
                        ${incidencias.length}
                    </span>

                </div>


                <div class="portal-incidencias-grid">

                    ${incidencias
                        .map(
                            incidencia => `

                                <article class="portal-incidencia-card">

                                    <div>

                                        <span
                                            class="
                                                portal-incidencia-icon
                                            "
                                        >
                                            ${
                                                incidencia.estado ===
                                                "Resuelta"
                                                    ? "✅"
                                                    : "⚠️"
                                            }
                                        </span>


                                        <div>

                                            <h3>
                                                ${this.escapar(
                                                    incidencia.tipo
                                                    ||
                                                    "Incidencia"
                                                )}
                                            </h3>


                                            <p>
                                                ${this.escapar(
                                                    incidencia.descripcion
                                                    ||
                                                    ""
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    <footer>

                                        <span>
                                            ${this.escapar(
                                                incidencia.prioridad
                                                ||
                                                "Media"
                                            )}
                                        </span>


                                        <strong>
                                            ${this.escapar(
                                                incidencia.estado
                                                ||
                                                "Pendiente"
                                            )}
                                        </strong>

                                    </footer>

                                </article>

                            `
                        )
                        .join("")}

                </div>

            </section>

        `;

    }


    // =====================================================
    // FORMULARIO INCIDENCIA
    // =====================================================

    mostrarFormularioIncidencia(
        trabajador,
        volverAModoCampo = false
    ) {

        const tareas =
            this.obtenerTareasTrabajador(
                trabajador.id
            );


        const fincas =
            this.obtenerFincas();


        this.mainContent.innerHTML = `

            <div class="portal-form-page">

                <button
                    id="volverPortalIncidencia"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="portal-form-header">

                    <span>
                        ⚠️ PORTAL DEL TRABAJADOR
                    </span>


                    <h1>
                        Comunicar incidencia
                    </h1>


                    <p>
                        Explica el problema para que administración
                        pueda revisarlo.
                    </p>

                </header>


                <div class="portal-form-layout">

                    <section
                        class="
                            form-panel
                            portal-form-panel
                        "
                    >

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


                            <select id="portalTrabajoIncidencia">

                                <option value="">
                                    Sin tarea relacionada
                                </option>


                                ${tareas
                                    .map(
                                        tarea => `

                                            <option
                                                value="${tarea.id}"
                                            >
                                                ${this.escapar(
                                                    tarea.titulo
                                                )}
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

                    </section>

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
            ?.addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "cancelarPortalIncidencia"
            )
            ?.addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "guardarPortalIncidencia"
            )
            ?.addEventListener(
                "click",
                () => {

                    const descripcion =
                        document
                            .getElementById(
                                "portalDescripcionIncidencia"
                            )
                            .value
                            .trim();


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

                                    descripcion,

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
    // MODO CAMPO
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
            this.obtenerIncidenciasTrabajador(
                trabajador.id
            );


        const incidenciasActivas =
            incidencias.filter(
                incidencia =>
                    incidencia.estado !==
                    "Resuelta"
            );


        const tareaActual =
            enCurso[0]
            ||
            null;


        this.mainContent.innerHTML = `

            <div class="campo-page">

                <header class="campo-header">

                    <div>

                        <span>
                            🌾 GESTACAMPS · MODO CAMPO
                        </span>


                        <h1>
                            ${this.escapar(
                                this.obtenerNombreTrabajador(
                                    trabajador
                                )
                            )}
                        </h1>


                        <p>
                            ${
                                tareaActual
                                    ? "Tienes una tarea en curso."
                                    : "Consulta y gestiona tu jornada."
                            }
                        </p>

                    </div>


                    <button
                        id="salirModoCampo"
                        type="button"
                    >
                        Vista completa
                    </button>

                </header>


                <section class="campo-stats">

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


                <section class="campo-current-card">

                    <span class="campo-section-label">
                        TRABAJO ACTUAL
                    </span>


                    ${
                        tareaActual

                            ? this.crearTareaActualCampo(
                                tareaActual
                            )

                            : this.crearEstadoVacio(
                                "🌱",
                                "No tienes ninguna tarea en curso",
                                "Puedes iniciar una de tus tareas pendientes."
                            )
                    }

                </section>


                <section class="campo-actions">

                    <button
                        id="campoVerTareas"
                        class="campo-action-primary"
                        type="button"
                    >
                        📋 Ver todas mis tareas
                    </button>


                    <button
                        id="campoIncidencia"
                        class="campo-action-warning"
                        type="button"
                    >
                        ⚠️ Comunicar incidencia
                    </button>

                </section>


                ${
                    pendientes.length

                        ? `

                            <section class="campo-section">

                                <span class="campo-section-label">
                                    PRÓXIMAS TAREAS
                                </span>


                                <div class="campo-task-list">

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


                <button
                    id="campoCerrarSesion"
                    class="campo-logout"
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
            ?.addEventListener(
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
            ?.addEventListener(
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
            ?.addEventListener(
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
            ?.addEventListener(
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
                        () =>
                            this.cambiarEstadoTareaCampo(
                                boton.dataset.id,
                                "En curso",
                                trabajador
                            )
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
                        () =>
                            this.cambiarEstadoTareaCampo(
                                boton.dataset.id,
                                "Completada",
                                trabajador
                            )
                    );

                }
            );

    }


    // =====================================================
    // RESUMEN MODO CAMPO
    // =====================================================

    crearTarjetaCampoResumen(
        icono,
        titulo,
        valor
    ) {

        return `

            <article class="campo-stat-card">

                <span>
                    ${icono}
                </span>

                <p>
                    ${this.escapar(
                        titulo
                    )}
                </p>

                <strong>
                    ${valor}
                </strong>

            </article>

        `;

    }


    // =====================================================
    // TAREA ACTUAL CAMPO
    // =====================================================

    crearTareaActualCampo(
        tarea
    ) {

        return `

            <div class="campo-current-task">

                <div class="campo-current-heading">

                    <div>

                        <h2>
                            ${this.escapar(
                                tarea.titulo
                            )}
                        </h2>


                        <strong>
                            ${this.escapar(
                                tarea.tipo
                                ||
                                "Trabajo"
                            )}
                        </strong>

                    </div>


                    <span>
                        En curso
                    </span>

                </div>


                <div class="campo-current-data">

                    <p>
                        📍
                        ${this.escapar(
                            tarea.fincaNombre
                            ||
                            "Sin finca"
                        )}
                    </p>


                    ${
                        tarea.parcela
                            ? `<p>🗺️ ${this.escapar(tarea.parcela)}</p>`
                            : ""
                    }


                    ${
                        tarea.cultivo
                            ? `<p>🌱 ${this.escapar(tarea.cultivo)}</p>`
                            : ""
                    }


                    ${
                        tarea.maquinariaNombre

                            ? `<p>🚜 ${this.escapar(
                                tarea.maquinariaNombre
                            )}</p>`

                            : ""
                    }

                </div>


                ${
                    tarea.notas

                        ? `

                            <div class="campo-current-notes">

                                <strong>
                                    Notas
                                </strong>

                                <p>
                                    ${this.escapar(
                                        tarea.notas
                                    )}
                                </p>

                            </div>

                        `

                        : ""
                }


                <button
                    type="button"
                    class="
                        campo-completar-tarea
                        campo-complete-button
                    "
                    data-id="${tarea.id}"
                >
                    ✅ Completar tarea
                </button>

            </div>

        `;

    }


    // =====================================================
    // TAREA PENDIENTE CAMPO
    // =====================================================

    crearTarjetaPendienteCampo(
        tarea
    ) {

        return `

            <article class="campo-pending-task">

                <div>

                    <strong>
                        ${this.escapar(
                            tarea.titulo
                        )}
                    </strong>


                    <p>
                        📍
                        ${this.escapar(
                            tarea.fincaNombre
                            ||
                            "Sin finca"
                        )}
                    </p>

                </div>


                <button
                    type="button"
                    class="campo-iniciar-tarea"
                    data-id="${tarea.id}"
                >
                    ▶ Iniciar
                </button>

            </article>

        `;

    }


    // =====================================================
    // CAMBIAR ESTADO CAMPO
    // =====================================================

    cambiarEstadoTareaCampo(
        id,
        estado,
        trabajador
    ) {

        const resultado =
            this.trabajoService
                .cambiarEstado(
                    id,
                    estado
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


        this.mostrarModoCampo(
            trabajador
        );

    }


    // =====================================================
    // TAREAS TRABAJADOR
    // =====================================================

    obtenerTareasTrabajador(
        trabajadorId
    ) {

        if (
            this.trabajoService
            &&
            typeof this.trabajoService
                .obtenerPorTrabajador ===
                "function"
        ) {

            const datos =
                this.trabajoService
                    .obtenerPorTrabajador(
                        trabajadorId
                    );


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // INCIDENCIAS TRABAJADOR
    // =====================================================

    obtenerIncidenciasTrabajador(
        trabajadorId
    ) {

        if (
            this.incidenciaService
            &&
            typeof this.incidenciaService
                .obtenerPorTrabajador ===
                "function"
        ) {

            const datos =
                this.incidenciaService
                    .obtenerPorTrabajador(
                        trabajadorId
                    );


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // FICHAJES TRABAJADOR
    // =====================================================

    obtenerFichajesTrabajador(
        trabajadorId
    ) {

        if (
            this.fichajeService
            &&
            typeof this.fichajeService
                .obtenerPorTrabajador ===
                "function"
        ) {

            const datos =
                this.fichajeService
                    .obtenerPorTrabajador(
                        trabajadorId
                    );


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // FINCAS
    // =====================================================

    obtenerFincas() {

        if (
            this.fincaService
            &&
            typeof this.fincaService
                .obtenerTodas ===
                "function"
        ) {

            const datos =
                this.fincaService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // VOLVER ADMIN
    // =====================================================

    volverAdministracion() {

        sessionStorage.removeItem(
            this.claveSesion
        );


        sessionStorage.removeItem(
            this.claveModoCampo
        );


        if (
            typeof this.onSalirPortal ===
            "function"
        ) {

            this.onSalirPortal();

        }

    }


    // =====================================================
    // NOMBRE
    // =====================================================

    obtenerNombreTrabajador(
        trabajador
    ) {

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
    // INICIALES
    // =====================================================

    obtenerIniciales(
        trabajador
    ) {

        return [
            trabajador?.nombre,
            trabajador?.apellidos
        ]
            .filter(Boolean)
            .map(
                texto =>
                    String(
                        texto
                    )
                        .trim()
                        .charAt(0)
                        .toUpperCase()
            )
            .slice(
                0,
                2
            )
            .join("")
        ||
        "T";

    }


    // =====================================================
    // CLASE ESTADO
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        if (
            estado ===
            "En curso"
        ) {

            return "progress";

        }


        if (
            estado ===
            "Completada"
            ||
            estado ===
            "Completado"
        ) {

            return "completed";

        }


        return "pending";

    }


    // =====================================================
    // CLASE CORRECCIÓN
    // =====================================================

    obtenerClaseCorreccion(
        estado
    ) {

        if (
            estado ===
            "Aprobada"
        ) {

            return "approved";

        }


        if (
            estado ===
            "Rechazada"
        ) {

            return "rejected";

        }


        return "pending";

    }


    // =====================================================
    // VACÍO
    // =====================================================

    crearEstadoVacio(
        icono,
        titulo,
        texto
    ) {

        return `

            <div class="portal-empty">

                <span>
                    ${icono}
                </span>


                <div>

                    <strong>
                        ${this.escapar(
                            titulo
                        )}
                    </strong>

                    <p>
                        ${this.escapar(
                            texto
                        )}
                    </p>

                </div>

            </div>

        `;

    }


    // =====================================================
    // FECHA
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


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
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