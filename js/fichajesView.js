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
        authService
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

        return Boolean(
            this.authService
            &&
            typeof this.authService.tienePermiso ===
            "function"
            &&
            this.authService.tienePermiso(
                "fichajes",
                "crear"
            )
        );

    }


    puedeEditarFichajes() {

        return Boolean(
            this.authService
            &&
            typeof this.authService.tienePermiso ===
            "function"
            &&
            this.authService.tienePermiso(
                "fichajes",
                "editar"
            )
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
                () =>
                    this.fichajeService
                        .obtenerSolicitudesCorreccion()
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

            <header class="topbar">

                <div>

                    <h2>
                        Fichajes
                    </h2>

                    <p>
                        Control de entrada, salida y correcciones del personal
                    </p>

                </div>

            </header>


            <!-- ==========================================
                 RESUMEN
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

            <section class="panel fichajes-section">

                <div class="panel-header fichajes-panel-header">

                    <div>

                        <h3>
                            ✏️ Solicitudes de corrección
                        </h3>

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

                                <span class="fichajes-counter fichajes-counter-warning">

                                    ${solicitudesPendientes.length}

                                </span>

                            `

                            : ""
                    }

                </div>


                <div class="fichajes-section-body">

                    ${this.crearSolicitudesCorreccion(
                        solicitudes,
                        puedeEditar
                    )}

                </div>

            </section>


            <!-- ==========================================
                 HISTORIAL
            =========================================== -->

            <section class="panel fichajes-section">

                <div class="panel-header fichajes-panel-header">

                    <div>

                        <h3>
                            Historial reciente
                        </h3>

                        <p>
                            Últimas entradas y salidas registradas
                        </p>

                    </div>


                    <span class="fichajes-counter">

                        ${Math.min(
                            historial.length,
                            30
                        )}

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

                <article class="panel fichajes-register-card">

                    <div class="panel-header">

                        <div>

                            <h3>
                                Registrar fichaje
                            </h3>

                            <p>
                                Entrada y salida mediante PIN personal
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

            <article class="panel fichajes-register-card">

                <div class="panel-header">

                    <div>

                        <h3>
                            Registrar fichaje
                        </h3>

                        <p>
                            Entrada y salida mediante PIN personal
                        </p>

                    </div>

                </div>


                <div class="fichajes-pin-area">

                    <div class="fichajes-pin-icon">
                        🔢
                    </div>


                    <div>

                        <label for="pinFichaje">
                            PIN del trabajador
                        </label>

                        <p>
                            Introduce el PIN personal de 4 números.
                        </p>

                    </div>

                </div>


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


                <div class="fichajes-register-actions">

                    <button
                        id="ficharEntrada"
                        class="primary-button"
                        type="button"
                    >
                        ▶️ Fichar entrada
                    </button>


                    <button
                        id="ficharSalida"
                        class="secondary-button"
                        type="button"
                    >
                        ⏹️ Fichar salida
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

            <article class="panel fichajes-working-card">

                <div class="panel-header fichajes-panel-header">

                    <div>

                        <h3>
                            Trabajando ahora
                        </h3>

                        <p>
                            Personal con una entrada abierta
                        </p>

                    </div>


                    <span class="fichajes-counter fichajes-counter-success">

                        ${trabajando.length}

                    </span>

                </div>


                <div class="fichajes-working-list">

                    ${
                        trabajando.length ===
                        0

                            ? this.crearEstadoVacio(
                                "✅",
                                "Sin fichajes abiertos",
                                "No hay ningún trabajador con una entrada abierta."
                            )

                            : trabajando
                                .map(
                                    trabajador =>
                                        this.crearTrabajadorActivo(
                                            trabajador
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
        trabajador
    ) {

        return `

            <div class="fichajes-worker">

                <span class="fichajes-worker-status">
                    🟢
                </span>


                <div>

                    <strong>

                        ${escaparHTML(
                            this.obtenerNombreTrabajador(
                                trabajador
                            )
                        )}

                    </strong>

                    <p>

                        ${escaparHTML(
                            trabajador.puesto
                            ||
                            "Trabajador"
                        )}

                    </p>

                </div>

            </div>

        `;

    }


    // =====================================================
    // SOLICITUDES
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


        const prioridad = {

            Pendiente:
                0,

            Aprobada:
                1,

            Rechazada:
                2

        };


        const ordenadas =
            [
                ...solicitudes
            ]
                .sort(
                    (
                        a,
                        b
                    ) => {

                        const estadoA =
                            a.correccion?.estado
                            ||
                            "";


                        const estadoB =
                            b.correccion?.estado
                            ||
                            "";


                        const diferencia =
                            (
                                prioridad[
                                    estadoA
                                ]
                                ??
                                99
                            )
                            -
                            (
                                prioridad[
                                    estadoB
                                ]
                                ??
                                99
                            );


                        if (
                            diferencia !==
                            0
                        ) {

                            return diferencia;

                        }


                        return (
                            this.obtenerTimestamp(
                                b.correccion?.fechaSolicitud
                            )
                            -
                            this.obtenerTimestamp(
                                a.correccion?.fechaSolicitud
                            )
                        );

                    }
                );


        return `

            <div class="fichajes-corrections-list">

                ${ordenadas
                    .map(
                        fichaje =>
                            this.crearTarjetaSolicitud(
                                fichaje,
                                puedeEditar
                            )
                    )
                    .join("")}

            </div>

        `;

    }


    // =====================================================
    // TARJETA SOLICITUD
    // =====================================================

    crearTarjetaSolicitud(
        fichaje,
        puedeEditar
    ) {

        const correccion =
            fichaje.correccion;


        if (
            !correccion
        ) {

            return "";

        }


        const estado =
            correccion.estado
            ||
            "Pendiente";


        const esPendiente =
            estado ===
            "Pendiente";


        return `

            <article class="fichajes-correction-card">

                <div class="fichajes-correction-header">

                    <div>

                        <strong>

                            ${escaparHTML(
                                fichaje.trabajadorNombre
                                ||
                                "Trabajador"
                            )}

                        </strong>


                        <p>

                            ${escaparHTML(
                                fichaje.tipo
                                ||
                                "Fichaje"
                            )}

                            ·

                            ${formatearFecha(
                                fichaje.fecha
                            )}

                        </p>

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

                    ${this.crearDatoCorreccion(
                        "Hora original",
                        correccion.horaOriginal
                        ||
                        fichaje.hora
                        ||
                        "—"
                    )}

                    ${this.crearDatoCorreccion(
                        "Nueva hora",
                        correccion.nuevaHora
                        ||
                        "—"
                    )}

                    ${this.crearDatoCorreccion(
                        "Solicitud",
                        formatearFechaHora(
                            correccion.fechaSolicitud
                        )
                    )}

                </div>


                <div class="fichajes-correction-reason">

                    <span>
                        Motivo
                    </span>

                    <p>

                        ${escaparHTML(
                            correccion.motivo
                            ||
                            "Sin motivo"
                        )}

                    </p>

                </div>


                ${
                    !esPendiente
                    &&
                    correccion.fechaResolucion

                        ? `

                            <p class="fichajes-correction-resolved">

                                Resuelta:

                                ${formatearFechaHora(
                                    correccion.fechaResolucion
                                )}

                            </p>

                        `

                        : ""
                }


                ${
                    esPendiente
                    &&
                    puedeEditar

                        ? `

                            <div class="fichajes-correction-actions">

                                <button
                                    type="button"
                                    class="
                                        primary-button
                                        aprobar-correccion
                                    "
                                    data-solicitud-id="${escaparHTML(
                                        correccion.id
                                    )}"
                                >
                                    ✅ Aprobar
                                </button>


                                <button
                                    type="button"
                                    class="
                                        secondary-button
                                        rechazar-correccion
                                    "
                                    data-solicitud-id="${escaparHTML(
                                        correccion.id
                                    )}"
                                >
                                    ❌ Rechazar
                                </button>

                            </div>

                        `

                        : ""
                }


                ${
                    esPendiente
                    &&
                    !puedeEditar

                        ? `

                            <div class="fichajes-permission-inline">

                                🔒 No tienes permiso para aprobar o rechazar esta solicitud.

                            </div>

                        `

                        : ""
                }

            </article>

        `;

    }


    // =====================================================
    // DATO CORRECCIÓN
    // =====================================================

    crearDatoCorreccion(
        titulo,
        valor
    ) {

        return `

            <div>

                <span>
                    ${escaparHTML(
                        titulo
                    )}
                </span>

                <strong>
                    ${escaparHTML(
                        valor
                    )}
                </strong>

            </div>

        `;

    }


    // =====================================================
    // FILA HISTORIAL
    // =====================================================

    crearFilaHistorial(
        fichaje
    ) {

        const correccion =
            fichaje.correccion;


        const estadoCorreccion =
            correccion?.estado
            ||
            null;


        const esEntrada =
            fichaje.tipo ===
            "Entrada";


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
                            : "↘"
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

                        ${escaparHTML(
                            fichaje.tipo
                            ||
                            ""
                        )}

                        ·

                        ${formatearFecha(
                            fichaje.fecha
                        )}

                        ·

                        ${escaparHTML(
                            fichaje.hora
                            ||
                            "—"
                        )}

                    </p>


                    ${
                        estadoCorreccion

                            ? `

                                <small>

                                    ✏️ Corrección:
                                    ${escaparHTML(
                                        estadoCorreccion
                                    )}

                                    ${
                                        estadoCorreccion ===
                                        "Aprobada"
                                        &&
                                        correccion?.horaOriginal

                                            ? ` · original ${escaparHTML(
                                                correccion.horaOriginal
                                            )}`

                                            : ""
                                    }

                                </small>

                            `

                            : ""
                    }

                </div>


                <span
                    class="
                        status
                        ${
                            esEntrada
                                ? "progress"
                                : "completed"
                        }
                    "
                >

                    ${escaparHTML(
                        fichaje.tipo
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
        descripcion
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
                            descripcion
                        )}
                    </p>

                </div>

            </div>

        `;

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


    // =====================================================
    // CONFIGURAR EVENTOS
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


                inputPin.focus();

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
                            () => {

                                this.aprobarCorreccion(
                                    boton.dataset.solicitudId
                                );

                            }
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
                            () => {

                                this.rechazarCorreccion(
                                    boton.dataset.solicitudId
                                );

                            }
                        );

                    }
                );

        }

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

            alert(
                "No tienes permiso para aprobar correcciones de fichajes."
            );

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

            alert(
                "No tienes permiso para rechazar correcciones de fichajes."
            );

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
        );


        this.mostrar();

    }


    // =====================================================
    // REGISTRAR ENTRADA
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
    // REGISTRAR SALIDA
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
    // OBTENER PIN
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


        return input.value;

    }


    // =====================================================
    // PROCESAR RESULTADO
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
        );


        this.mostrar();

    }


    // =====================================================
    // NOMBRE TRABAJADOR
    // =====================================================

    obtenerNombreTrabajador(
        trabajador
    ) {

        if (
            this.trabajadorService
            &&
            typeof
            this.trabajadorService
                .obtenerNombreCompleto ===
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
                .filter(
                    Boolean
                )
                .join(
                    " "
                )
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
    // TIMESTAMP
    // =====================================================

    obtenerTimestamp(
        valor
    ) {

        if (
            !valor
        ) {

            return 0;

        }


        const fecha =
            new Date(
                valor
            );


        return Number.isNaN(
            fecha.getTime()
        )
            ? 0
            : fecha.getTime();

    }

}