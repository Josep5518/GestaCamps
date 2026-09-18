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


    // =====================================================
    // PERMISOS
    // =====================================================

    puedeCrearFichajes() {

        if (
            !this.authService
            ||
            typeof this.authService
                .tienePermiso !==
                "function"
        ) {

            return false;

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
            typeof this.authService
                .tienePermiso !==
                "function"
        ) {

            return false;

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
            this.trabajadorService
                .obtenerActivos();


        const trabajando =
            this.fichajeService
                .obtenerTrabajandoAhora();


        const fichajesHoy =
            this.fichajeService
                .obtenerFichajesHoy();


        const historial =
            this.fichajeService
                .obtenerTodos()
                .slice(
                    0,
                    30
                );


        const solicitudes =
            this.fichajeService
                .obtenerSolicitudesCorreccion();


        const solicitudesPendientes =
            solicitudes
                .filter(
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
                        Control de entrada y salida del personal
                    </p>

                </div>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        👷
                    </span>

                    <div>

                        <p>
                            Trabajadores activos
                        </p>

                        <h3>
                            ${trabajadoresActivos.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🟢
                    </span>

                    <div>

                        <p>
                            Trabajando ahora
                        </p>

                        <h3>
                            ${trabajando.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🕒
                    </span>

                    <div>

                        <p>
                            Fichajes hoy
                        </p>

                        <h3>
                            ${fichajesHoy.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ✏️
                    </span>

                    <div>

                        <p>
                            Correcciones pendientes
                        </p>

                        <h3>
                            ${solicitudesPendientes.length}
                        </h3>

                    </div>

                </div>

            </section>


            <div class="dashboard-grid">


                ${

                    puedeCrear

                        ? `

                            <section class="panel">

                                <div class="panel-header">

                                    <h3>
                                        Registrar fichaje
                                    </h3>

                                </div>


                                <div class="form-group">

                                    <label>
                                        PIN del trabajador
                                    </label>

                                    <input
                                        id="pinFichaje"
                                        type="password"
                                        inputmode="numeric"
                                        pattern="[0-9]*"
                                        maxlength="4"
                                        autocomplete="off"
                                        placeholder="••••"
                                    >

                                    <small class="form-help">
                                        Introduce el PIN personal de 4 números.
                                    </small>

                                </div>


                                <div
                                    class="form-actions"
                                    style="
                                        justify-content:flex-start;
                                        flex-wrap:wrap;
                                    "
                                >

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

                            </section>

                        `

                        : `

                            <section class="panel">

                                <div class="panel-header">

                                    <h3>
                                        Registrar fichaje
                                    </h3>

                                </div>


                                <p
                                    style="
                                        color:#78837d;
                                        margin:0;
                                    "
                                >
                                    No tienes permiso para registrar fichajes.
                                </p>

                            </section>

                        `

                }


                <section class="panel">

                    <div class="panel-header">

                        <h3>
                            Trabajando ahora
                        </h3>

                    </div>


                    ${
                        trabajando.length ===
                        0

                            ? `

                                <p
                                    style="
                                        color:#78837d;
                                        margin:0;
                                    "
                                >
                                    No hay ningún trabajador con una entrada abierta.
                                </p>

                            `

                            : trabajando
                                .map(
                                    trabajador => `

                                        <div class="activity">

                                            <span>
                                                🟢
                                            </span>

                                            <div>

                                                <strong>
                                                    ${this.escapar(
                                                        this.trabajadorService
                                                            .obtenerNombreCompleto(
                                                                trabajador
                                                            )
                                                    )}
                                                </strong>

                                                <p>
                                                    ${this.escapar(
                                                        trabajador.puesto
                                                        ||
                                                        "Trabajador"
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                    `
                                )
                                .join(
                                    ""
                                )
                    }

                </section>

            </div>


            <section
                class="panel"
                style="
                    margin-top:25px;
                "
            >

                <div
                    class="panel-header"
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:12px;
                        flex-wrap:wrap;
                    "
                >

                    <div>

                        <h3>
                            ✏️ Solicitudes de corrección
                        </h3>

                        <p
                            style="
                                margin:4px 0 0;
                                color:#78837d;
                            "
                        >
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
                                    style="
                                        display:inline-flex;
                                        align-items:center;
                                        justify-content:center;
                                        min-width:30px;
                                        height:30px;
                                        padding:0 10px;
                                        border-radius:999px;
                                        background:#fff3cd;
                                        color:#755700;
                                        font-weight:700;
                                    "
                                >
                                    ${solicitudesPendientes.length}
                                </span>

                            `

                            : ""
                    }

                </div>


                ${this.crearSolicitudesCorreccion(
                    solicitudes,
                    puedeEditar
                )}

            </section>


            <section
                class="panel"
                style="
                    margin-top:25px;
                "
            >

                <div class="panel-header">

                    <h3>
                        Historial reciente
                    </h3>

                </div>


                ${
                    historial.length ===
                    0

                        ? `

                            <div class="empty-state">

                                <div class="empty-icon">
                                    🕒
                                </div>

                                <h3>
                                    Todavía no hay fichajes
                                </h3>

                                <p>
                                    Las entradas y salidas aparecerán aquí.
                                </p>

                            </div>

                        `

                        : historial
                            .map(
                                fichaje =>
                                    this.crearFilaHistorial(
                                        fichaje
                                    )
                            )
                            .join(
                                ""
                            )
                }

            </section>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // CREAR SOLICITUDES
    // =====================================================

    crearSolicitudesCorreccion(
        solicitudes,
        puedeEditar
    ) {

        if (
            solicitudes.length ===
            0
        ) {

            return `

                <div class="empty-state">

                    <div class="empty-icon">
                        ✏️
                    </div>

                    <h3>
                        No hay solicitudes
                    </h3>

                    <p>
                        Las solicitudes de corrección aparecerán aquí.
                    </p>

                </div>

            `;

        }


        const ordenadas =
            [
                ...solicitudes
            ]
                .sort(
                    (
                        a,
                        b
                    ) => {

                        const prioridad = {

                            Pendiente:
                                0,

                            Aprobada:
                                1,

                            Rechazada:
                                2

                        };


                        const estadoA =
                            a.correccion?.estado
                            ||
                            "";


                        const estadoB =
                            b.correccion?.estado
                            ||
                            "";


                        const diferenciaEstado =
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
                            diferenciaEstado !==
                            0
                        ) {

                            return diferenciaEstado;

                        }


                        return (
                            new Date(
                                b.correccion?.fechaSolicitud
                                ||
                                0
                            )
                            -
                            new Date(
                                a.correccion?.fechaSolicitud
                                ||
                                0
                            )
                        );

                    }
                );


        return ordenadas
            .map(
                fichaje =>
                    this.crearTarjetaSolicitud(
                        fichaje,
                        puedeEditar
                    )
            )
            .join(
                ""
            );

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


        const estiloEstado =
            this.obtenerEstiloEstadoCorreccion(
                estado
            );


        return `

            <div
                style="
                    border:1px solid #e0e8e2;
                    border-radius:12px;
                    padding:15px;
                    margin-top:12px;
                    background:#ffffff;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:12px;
                        flex-wrap:wrap;
                    "
                >

                    <div>

                        <strong
                            style="
                                display:block;
                                font-size:15px;
                            "
                        >
                            ${this.escapar(
                                fichaje.trabajadorNombre
                                ||
                                "Trabajador"
                            )}
                        </strong>

                        <span
                            style="
                                display:block;
                                margin-top:4px;
                                color:#78837d;
                                font-size:12px;
                            "
                        >
                            ${this.escapar(
                                fichaje.tipo
                            )}

                            ·

                            ${this.formatearFecha(
                                fichaje.fecha
                            )}
                        </span>

                    </div>


                    <span
                        style="
                            display:inline-flex;
                            align-items:center;
                            border-radius:999px;
                            padding:5px 10px;
                            font-size:12px;
                            font-weight:700;
                            background:${estiloEstado.fondo};
                            color:${estiloEstado.texto};
                        "
                    >
                        ${this.escapar(
                            estado
                        )}
                    </span>

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(170px, 1fr)
                            );
                        gap:10px;
                        margin-top:14px;
                    "
                >

                    <div
                        style="
                            padding:10px;
                            background:#f7f9f7;
                            border-radius:9px;
                        "
                    >

                        <small
                            style="
                                color:#78837d;
                            "
                        >
                            Hora original
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:3px;
                            "
                        >
                            ${this.escapar(
                                correccion.horaOriginal
                                ||
                                fichaje.hora
                                ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div
                        style="
                            padding:10px;
                            background:#f7f9f7;
                            border-radius:9px;
                        "
                    >

                        <small
                            style="
                                color:#78837d;
                            "
                        >
                            Nueva hora solicitada
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:3px;
                            "
                        >
                            ${this.escapar(
                                correccion.nuevaHora
                                ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div
                        style="
                            padding:10px;
                            background:#f7f9f7;
                            border-radius:9px;
                        "
                    >

                        <small
                            style="
                                color:#78837d;
                            "
                        >
                            Solicitud
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:3px;
                            "
                        >
                            ${this.formatearFechaHora(
                                correccion.fechaSolicitud
                            )}
                        </strong>

                    </div>

                </div>


                <div
                    style="
                        margin-top:12px;
                        padding:11px;
                        background:#f7f9f7;
                        border-radius:9px;
                    "
                >

                    <small
                        style="
                            color:#78837d;
                        "
                    >
                        Motivo
                    </small>

                    <p
                        style="
                            margin:5px 0 0;
                        "
                    >
                        ${this.escapar(
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

                            <p
                                style="
                                    margin:10px 0 0;
                                    color:#78837d;
                                    font-size:12px;
                                "
                            >
                                Resuelta:
                                ${this.formatearFechaHora(
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

                            <div
                                style="
                                    display:flex;
                                    gap:8px;
                                    flex-wrap:wrap;
                                    margin-top:14px;
                                "
                            >

                                <button
                                    type="button"
                                    class="
                                        primary-button
                                        aprobar-correccion
                                    "
                                    data-solicitud-id="${this.escapar(
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
                                    data-solicitud-id="${this.escapar(
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

                            <p
                                style="
                                    margin:12px 0 0;
                                    color:#8a6b00;
                                    font-size:12px;
                                "
                            >
                                🔒 No tienes permiso para aprobar o rechazar esta solicitud.
                            </p>

                        `

                        : ""
                }

            </div>

        `;

    }


    // =====================================================
    // ESTILO ESTADO
    // =====================================================

    obtenerEstiloEstadoCorreccion(
        estado
    ) {

        if (
            estado ===
            "Aprobada"
        ) {

            return {

                fondo:
                    "#def5e8",

                texto:
                    "#176044"

            };

        }


        if (
            estado ===
            "Rechazada"
        ) {

            return {

                fondo:
                    "#fde8e8",

                texto:
                    "#a42b2b"

            };

        }


        return {

            fondo:
                "#fff4d8",

            texto:
                "#745500"

        };

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


        return `

            <div class="activity">

                <span>

                    ${
                        fichaje.tipo ===
                        "Entrada"

                            ? "🟢"

                            : "🔴"
                    }

                </span>


                <div
                    style="
                        flex:1;
                    "
                >

                    <strong>
                        ${this.escapar(
                            fichaje.trabajadorNombre
                            ||
                            "Trabajador"
                        )}
                    </strong>

                    <p>

                        ${this.escapar(
                            fichaje.tipo
                        )}

                        ·

                        ${this.formatearFecha(
                            fichaje.fecha
                        )}

                        ·

                        ${this.escapar(
                            fichaje.hora
                        )}

                    </p>


                    ${
                        estadoCorreccion

                            ? `

                                <p
                                    style="
                                        margin-top:3px;
                                    "
                                >
                                    ✏️ Corrección:
                                    ${this.escapar(
                                        estadoCorreccion
                                    )}

                                    ${
                                        estadoCorreccion ===
                                        "Aprobada"

                                            ? ` · hora original ${this.escapar(
                                                correccion.horaOriginal
                                                ||
                                                ""
                                            )}`

                                            : ""
                                    }
                                </p>

                            `

                            : ""
                    }

                </div>


                <span
                    class="status ${
                        fichaje.tipo ===
                        "Entrada"

                            ? "progress"

                            : "completed"
                    }"
                >
                    ${this.escapar(
                        fichaje.tipo
                    )}
                </span>

            </div>

        `;

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


            const botonEntrada =
                document.getElementById(
                    "ficharEntrada"
                );


            if (
                botonEntrada
            ) {

                botonEntrada.addEventListener(
                    "click",
                    () =>
                        this.registrarEntrada()
                );

            }


            const botonSalida =
                document.getElementById(
                    "ficharSalida"
                );


            if (
                botonSalida
            ) {

                botonSalida.addEventListener(
                    "click",
                    () =>
                        this.registrarSalida()
                );

            }

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


        const input =
            document.getElementById(
                "pinFichaje"
            );


        if (
            !input
        ) {

            return;

        }


        const resultado =
            this.fichajeService
                .ficharEntrada(
                    input.value
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


        const input =
            document.getElementById(
                "pinFichaje"
            );


        if (
            !input
        ) {

            return;

        }


        const resultado =
            this.fichajeService
                .ficharSalida(
                    input.value
                );


        this.procesarResultado(
            resultado
        );

    }


    // =====================================================
    // PROCESAR RESULTADO
    // =====================================================

    procesarResultado(
        resultado
    ) {

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


        this.mostrar();

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

            return "";

        }


        const partes =
            String(
                fecha
            )
                .split(
                    "-"
                );


        if (
            partes.length !==
            3
        ) {

            return String(
                fecha
            );

        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );

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

}