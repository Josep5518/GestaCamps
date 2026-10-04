import {
    escaparHTML,
    formatearFecha,
    formatearFechaHora
} from "./utils.js";


export class FichajesView {

    constructor(
        mainContent,
        fichajeService,
        trabajadorService,
        authService = null
    ) {

        this.mainContent =
            mainContent;

        this.fichajeService =
            fichajeService;

        this.trabajadorService =
            trabajadorService;

        this.authService =
            authService;

    }


    // =====================================================
    // PERMISOS
    // =====================================================

    puedeCrearFichajes() {

        if (
            !this.authService
            ||
            typeof this.authService.tienePermiso !==
            "function"
        ) {

            return true;

        }


        return this.authService
            .tienePermiso(
                "fichajes",
                "crear"
            );

    }


    puedeEditarFichajes() {

        if (
            !this.authService
            ||
            typeof this.authService.tienePermiso !==
            "function"
        ) {

            return true;

        }


        return this.authService
            .tienePermiso(
                "fichajes",
                "editar"
            );

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const trabajadoresActivos =
            this.obtenerListaSegura(
                () =>
                    this.trabajadorService
                        .obtenerActivos()
            );


        const trabajando =
            this.obtenerListaSegura(
                () =>
                    this.fichajeService
                        .obtenerTrabajandoAhora()
            );


        const fichajesHoy =
            this.obtenerListaSegura(
                () =>
                    this.fichajeService
                        .obtenerFichajesHoy()
            );


        const historial =
            this.obtenerListaSegura(
                () =>
                    this.fichajeService
                        .obtenerTodos()
            )
                .slice(
                    0,
                    30
                );


        const solicitudes =
            this.obtenerListaSegura(
                () => {

                    if (
                        typeof this.fichajeService
                            .obtenerSolicitudesCorreccion !==
                        "function"
                    ) {

                        return [];

                    }


                    return this.fichajeService
                        .obtenerSolicitudesCorreccion();

                }
            );


        const solicitudesPendientes =
            solicitudes.filter(
                fichaje =>
                    fichaje.correccion
                    &&
                    fichaje.correccion.estado ===
                    "Pendiente"
            );


        const puedeCrear =
            this.puedeCrearFichajes();


        const puedeEditar =
            this.puedeEditarFichajes();


        this.mainContent.innerHTML = `

            <div class="fichajes-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="fichajes-hero">

                    <div class="fichajes-hero-content">

                        <span class="fichajes-eyebrow">
                            ⏱️ PERSONAL
                        </span>


                        <h1>
                            Cada jornada,
                            <span>
                                bien registrada.
                            </span>
                        </h1>


                        <p>
                            Controla entradas y salidas del personal,
                            consulta quién está trabajando y conserva
                            un historial claro de cada jornada.
                        </p>

                    </div>


                    <div class="fichajes-hero-image">

                        <div class="fichajes-hero-badge">

                            <span>
                                Trabajando ahora
                            </span>

                            <strong>
                                ${trabajando.length}
                            </strong>

                        </div>


                        <div class="fichajes-hero-copy">

                            <small>
                                ENTRADA · JORNADA · SALIDA
                            </small>

                            <strong>
                                El tiempo del equipo,<br>
                                bajo control
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats fichajes-stats">

                    ${this.crearStat(
                        "👷",
                        "Trabajadores activos",
                        trabajadoresActivos.length
                    )}


                    ${this.crearStat(
                        "🟢",
                        "Trabajando ahora",
                        trabajando.length
                    )}


                    ${this.crearStat(
                        "🕒",
                        "Fichajes hoy",
                        fichajesHoy.length
                    )}


                    ${this.crearStat(
                        "✏️",
                        "Correcciones pendientes",
                        solicitudesPendientes.length
                    )}

                </section>


                <!-- ==========================================
                     ZONA PRINCIPAL
                =========================================== -->

                <section class="fichajes-main-grid">

                    ${this.crearPanelRegistro(
                        puedeCrear
                    )}


                    ${this.crearPanelTrabajando(
                        trabajando
                    )}

                </section>


                <!-- ==========================================
                     CORRECCIONES
                =========================================== -->

                <section class="fichajes-section">

                    <div class="fichajes-section-header">

                        <div>

                            <span class="fichajes-section-eyebrow">
                                CONTROL DE JORNADA
                            </span>


                            <h2>
                                Solicitudes de corrección
                            </h2>


                            <p>

                                ${
                                    puedeEditar

                                        ? "Revisa las solicitudes enviadas por los trabajadores."

                                        : "Consulta el estado de las solicitudes de corrección."
                                }

                            </p>

                        </div>


                        ${
                            solicitudesPendientes.length >
                            0

                                ? `

                                    <span
                                        class="
                                            fichajes-counter
                                            fichajes-counter-warning
                                        "
                                    >
                                        ${solicitudesPendientes.length}
                                    </span>

                                `

                                : ""
                        }

                    </div>


                    <div class="fichajes-corrections">

                        ${this.crearSolicitudesCorreccion(
                            solicitudes,
                            puedeEditar
                        )}

                    </div>

                </section>


                <!-- ==========================================
                     HISTORIAL
                =========================================== -->

                <section class="fichajes-section">

                    <div class="fichajes-section-header">

                        <div>

                            <span class="fichajes-section-eyebrow">
                                ACTIVIDAD RECIENTE
                            </span>


                            <h2>
                                Historial de fichajes
                            </h2>


                            <p>
                                Últimas entradas y salidas registradas.
                            </p>

                        </div>


                        <span class="fichajes-counter">
                            ${historial.length}
                        </span>

                    </div>


                    <div class="fichajes-history">

                        ${
                            historial.length ===
                            0

                                ? this.crearEstadoVacio(
                                    "🕒",
                                    "Todavía no hay fichajes",
                                    "Las entradas y salidas aparecerán aquí."
                                )

                                : historial
                                    .map(
                                        fichaje =>
                                            this.crearFilaHistorial(
                                                fichaje
                                            )
                                    )
                                    .join("")
                        }

                    </div>

                </section>

            </div>

        `;


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
                        ${escaparHTML(
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
    // PANEL REGISTRO
    // =====================================================

    crearPanelRegistro(
        puedeCrear
    ) {

        if (
            !puedeCrear
        ) {

            return `

                <article class="fichajes-register-card">

                    <div class="fichajes-card-heading">

                        <div>

                            <span class="fichajes-card-eyebrow">
                                FICHAJE
                            </span>

                            <h3>
                                Registrar fichaje
                            </h3>

                            <p>
                                Entrada y salida mediante PIN personal.
                            </p>

                        </div>

                    </div>


                    <div class="fichajes-permission-warning">

                        <span>
                            🔒
                        </span>


                        <div>

                            <strong>
                                Sin permiso
                            </strong>

                            <p>
                                No tienes permiso para registrar fichajes.
                            </p>

                        </div>

                    </div>

                </article>

            `;

        }


        return `

            <article class="fichajes-register-card">

                <div class="fichajes-card-heading">

                    <div>

                        <span class="fichajes-card-eyebrow">
                            FICHAJE
                        </span>


                        <h3>
                            Registrar entrada o salida
                        </h3>


                        <p>
                            Introduce el PIN personal del trabajador.
                        </p>

                    </div>


                    <span class="fichajes-card-icon">
                        🔢
                    </span>

                </div>


                <div class="fichajes-pin-box">

                    <label for="pinFichaje">
                        PIN del trabajador
                    </label>


                    <input
                        id="pinFichaje"
                        class="fichajes-pin-input"
                        type="password"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="4"
                        autocomplete="off"
                        placeholder="••••"
                    >


                    <small>
                        Introduce exactamente 4 números.
                    </small>

                </div>


                <div class="fichajes-register-actions">

                    <button
                        id="ficharEntrada"
                        class="primary-button"
                        type="button"
                    >
                        ▶ Fichar entrada
                    </button>


                    <button
                        id="ficharSalida"
                        class="secondary-button"
                        type="button"
                    >
                        ■ Fichar salida
                    </button>

                </div>

            </article>

        `;

    }


    // =====================================================
    // TRABAJANDO AHORA
    // =====================================================

    crearPanelTrabajando(
        trabajando
    ) {

        return `

            <article class="fichajes-working-card">

                <div class="fichajes-card-heading">

                    <div>

                        <span class="fichajes-card-eyebrow">
                            EN DIRECTO
                        </span>


                        <h3>
                            Trabajando ahora
                        </h3>


                        <p>
                            Personal con una entrada abierta.
                        </p>

                    </div>


                    <span
                        class="
                            fichajes-counter
                            fichajes-counter-success
                        "
                    >
                        ${trabajando.length}
                    </span>

                </div>


                <div class="fichajes-working-list">

                    ${
                        trabajando.length ===
                        0

                            ? this.crearEstadoVacio(
                                "🌿",
                                "Nadie está trabajando ahora",
                                "Los trabajadores aparecerán aquí al fichar entrada."
                            )

                            : trabajando
                                .map(
                                    fichaje =>
                                        this.crearTrabajadorActivo(
                                            fichaje
                                        )
                                )
                                .join("")
                    }

                </div>

            </article>

        `;

    }


    // =====================================================
    // TRABAJADOR ACTIVO
    // =====================================================

    crearTrabajadorActivo(
        fichaje
    ) {

        const nombre =
            fichaje.trabajadorNombre
            ||
            fichaje.nombreTrabajador
            ||
            "Trabajador";


        const iniciales =
            this.obtenerIniciales(
                nombre
            );


        return `

            <div class="fichajes-working-item">

                <div class="fichajes-working-avatar">
                    ${escaparHTML(
                        iniciales
                    )}
                </div>


                <div class="fichajes-working-main">

                    <strong>
                        ${escaparHTML(
                            nombre
                        )}
                    </strong>


                    <p>
                        Entrada:
                        ${
                            fichaje.fechaHora

                                ? formatearFechaHora(
                                    fichaje.fechaHora
                                )

                                : fichaje.fechaCreacion

                                    ? formatearFechaHora(
                                        fichaje.fechaCreacion
                                    )

                                    : fichaje.hora
                                        ||
                                        "—"
                        }
                    </p>

                </div>


                <span class="fichajes-live-dot">
                    Trabajando
                </span>

            </div>

        `;

    }


    // =====================================================
    // CORRECCIONES
    // =====================================================

    crearSolicitudesCorreccion(
        solicitudes,
        puedeEditar
    ) {

        if (
            solicitudes.length ===
            0
        ) {

            return this.crearEstadoVacio(
                "✏️",
                "No hay solicitudes",
                "Las solicitudes de corrección aparecerán aquí."
            );

        }


        return solicitudes
            .map(
                fichaje => {

                    const correccion =
                        fichaje.correccion
                        ||
                        {};


                    const estado =
                        correccion.estado
                        ||
                        "Pendiente";


                    return `

                        <article class="fichajes-correction-card">

                            <div class="fichajes-correction-top">

                                <div>

                                    <span class="fichajes-correction-kicker">
                                        SOLICITUD DE CORRECCIÓN
                                    </span>


                                    <h3>
                                        ${escaparHTML(
                                            fichaje.trabajadorNombre
                                            ||
                                            "Trabajador"
                                        )}
                                    </h3>

                                </div>


                                <span
                                    class="
                                        fichajes-correction-status
                                        ${this.obtenerClaseCorreccion(
                                            estado
                                        )}
                                    "
                                >
                                    ${escaparHTML(
                                        estado
                                    )}
                                </span>

                            </div>


                            <div class="fichajes-correction-data">

                                <div>

                                    <span>
                                        Tipo
                                    </span>

                                    <strong>
                                        ${escaparHTML(
                                            fichaje.tipo
                                            ||
                                            "—"
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Hora original
                                    </span>

                                    <strong>
                                        ${escaparHTML(
                                            correccion.horaOriginal
                                            ||
                                            fichaje.hora
                                            ||
                                            "—"
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Nueva hora
                                    </span>

                                    <strong>
                                        ${escaparHTML(
                                            correccion.nuevaHora
                                            ||
                                            correccion.horaSolicitada
                                            ||
                                            "—"
                                        )}
                                    </strong>

                                </div>

                            </div>


                            ${
                                correccion.motivo

                                    ? `

                                        <div class="fichajes-correction-reason">

                                            <span>
                                                MOTIVO
                                            </span>

                                            <p>
                                                ${escaparHTML(
                                                    correccion.motivo
                                                )}
                                            </p>

                                        </div>

                                    `

                                    : ""
                            }


                            ${
                                puedeEditar
                                &&
                                estado ===
                                "Pendiente"

                                    ? `

                                        <div class="fichajes-correction-actions">

                                            <button
                                                class="
                                                    secondary-button
                                                    rechazar-correccion
                                                "
                                                data-solicitud-id="${escaparHTML(
                                                    fichaje.id
                                                )}"
                                                type="button"
                                            >
                                                Rechazar
                                            </button>


                                            <button
                                                class="
                                                    primary-button
                                                    aprobar-correccion
                                                "
                                                data-solicitud-id="${escaparHTML(
                                                    fichaje.id
                                                )}"
                                                type="button"
                                            >
                                                Aprobar
                                            </button>

                                        </div>

                                    `

                                    : ""
                            }

                        </article>

                    `;

                }
            )
            .join("");

    }


    // =====================================================
    // HISTORIAL
    // =====================================================

    crearFilaHistorial(
        fichaje
    ) {

        const tipo =
            fichaje.tipo
            ||
            "Entrada";


        const esEntrada =
            tipo ===
            "Entrada";


        const correccion =
            fichaje.correccion
            ||
            null;


        return `

            <div class="fichajes-history-row">

                <span
                    class="
                        fichajes-history-icon
                        ${
                            esEntrada
                                ? "entrada"
                                : "salida"
                        }
                    "
                >

                    ${
                        esEntrada
                            ? "↗"
                            : "↙"
                    }

                </span>


                <div class="fichajes-history-main">

                    <strong>
                        ${escaparHTML(
                            fichaje.trabajadorNombre
                            ||
                            "Trabajador"
                        )}
                    </strong>


                    <p>

                        ${
                            fichaje.fecha
                                ? formatearFecha(
                                    fichaje.fecha
                                )
                                : ""
                        }

                        ${
                            fichaje.hora
                                ? ` · ${escaparHTML(
                                    fichaje.hora
                                )}`
                                : ""
                        }

                    </p>


                    ${
                        correccion

                            ? `

                                <small>
                                    ✏️ Corrección:
                                    ${escaparHTML(
                                        correccion.estado
                                        ||
                                        "Pendiente"
                                    )}
                                </small>

                            `

                            : ""
                    }

                </div>


                <span
                    class="
                        fichajes-history-type
                        ${
                            esEntrada
                                ? "entrada"
                                : "salida"
                        }
                    "
                >
                    ${escaparHTML(
                        tipo
                    )}
                </span>

            </div>

        `;

    }


    // =====================================================
    // ESTADO VACÍO
    // =====================================================

    crearEstadoVacio(
        icono,
        titulo,
        texto
    ) {

        return `

            <div class="fichajes-empty">

                <span>
                    ${icono}
                </span>


                <div>

                    <strong>
                        ${escaparHTML(
                            titulo
                        )}
                    </strong>

                    <p>
                        ${escaparHTML(
                            texto
                        )}
                    </p>

                </div>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        const puedeCrear =
            this.puedeCrearFichajes();


        const puedeEditar =
            this.puedeEditarFichajes();


        if (
            puedeCrear
        ) {

            const inputPin =
                document.getElementById(
                    "pinFichaje"
                );


            if (
                inputPin
            ) {

                inputPin.addEventListener(
                    "input",
                    () => {

                        inputPin.value =
                            inputPin.value
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


                inputPin.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            this.registrarEntrada();

                        }

                    }
                );

            }


            document
                .getElementById(
                    "ficharEntrada"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.registrarEntrada()
                );


            document
                .getElementById(
                    "ficharSalida"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.registrarSalida()
                );

        }


        if (
            puedeEditar
        ) {

            document
                .querySelectorAll(
                    ".aprobar-correccion"
                )
                .forEach(
                    boton => {

                        boton.addEventListener(
                            "click",
                            () =>
                                this.aprobarCorreccion(
                                    boton.dataset.solicitudId
                                )
                        );

                    }
                );


            document
                .querySelectorAll(
                    ".rechazar-correccion"
                )
                .forEach(
                    boton => {

                        boton.addEventListener(
                            "click",
                            () =>
                                this.rechazarCorreccion(
                                    boton.dataset.solicitudId
                                )
                        );

                    }
                );

        }

    }


    // =====================================================
    // ENTRADA
    // =====================================================

    registrarEntrada() {

        if (
            !this.puedeCrearFichajes()
        ) {

            alert(
                "No tienes permiso para registrar fichajes."
            );

            return;

        }


        const pin =
            this.obtenerPin();


        if (
            pin ===
            null
        ) {

            return;

        }


        const resultado =
            this.fichajeService
                .ficharEntrada(
                    pin
                );


        this.procesarResultado(
            resultado
        );

    }


    // =====================================================
    // SALIDA
    // =====================================================

    registrarSalida() {

        if (
            !this.puedeCrearFichajes()
        ) {

            alert(
                "No tienes permiso para registrar fichajes."
            );

            return;

        }


        const pin =
            this.obtenerPin();


        if (
            pin ===
            null
        ) {

            return;

        }


        const resultado =
            this.fichajeService
                .ficharSalida(
                    pin
                );


        this.procesarResultado(
            resultado
        );

    }


    // =====================================================
    // PIN
    // =====================================================

    obtenerPin() {

        const input =
            document.getElementById(
                "pinFichaje"
            );


        if (
            !input
        ) {

            return null;

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

            return null;

        }


        return pin;

    }


    // =====================================================
    // RESULTADO
    // =====================================================

    procesarResultado(
        resultado
    ) {

        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido registrar el fichaje."
            );

            return;

        }


        alert(
            resultado.mensaje
            ||
            "Fichaje registrado correctamente."
        );


        this.mostrar();

    }


    // =====================================================
    // APROBAR CORRECCIÓN
    // =====================================================

    aprobarCorreccion(
        solicitudId
    ) {

        if (
            !this.puedeEditarFichajes()
        ) {

            return;

        }


        if (
            typeof this.fichajeService
                .aprobarCorreccion !==
            "function"
        ) {

            return;

        }


        if (
            !confirm(
                "¿Quieres aprobar esta corrección de fichaje?"
            )
        ) {

            return;

        }


        const resultado =
            this.fichajeService
                .aprobarCorreccion(
                    solicitudId
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido aprobar la corrección."
            );

            return;

        }


        alert(
            resultado.mensaje
            ||
            "Corrección aprobada."
        );


        this.mostrar();

    }


    // =====================================================
    // RECHAZAR CORRECCIÓN
    // =====================================================

    rechazarCorreccion(
        solicitudId
    ) {

        if (
            !this.puedeEditarFichajes()
        ) {

            return;

        }


        if (
            typeof this.fichajeService
                .rechazarCorreccion !==
            "function"
        ) {

            return;

        }


        if (
            !confirm(
                "¿Quieres rechazar esta solicitud de corrección?"
            )
        ) {

            return;

        }


        const resultado =
            this.fichajeService
                .rechazarCorreccion(
                    solicitudId
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido rechazar la corrección."
            );

            return;

        }


        alert(
            resultado.mensaje
            ||
            "Corrección rechazada."
        );


        this.mostrar();

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
    // INICIALES
    // =====================================================

    obtenerIniciales(
        nombre
    ) {

        return String(
            nombre
            ||
            "T"
        )
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(
                0,
                2
            )
            .map(
                palabra =>
                    palabra
                        .charAt(0)
                        .toUpperCase()
            )
            .join("")
        ||
        "T";

    }

}