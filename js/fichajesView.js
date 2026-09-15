export class FichajesView {

    constructor(
        mainContent,
        fichajeService,
        trabajadorService
    ) {

        this.mainContent =
            mainContent;

        this.fichajeService =
            fichajeService;

        this.trabajadorService =
            trabajadorService;

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

            </section>


            <div class="dashboard-grid">


                <!-- ======================================
                     REGISTRAR FICHAJE
                ======================================= -->

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
                            justify-content: flex-start;
                            flex-wrap: wrap;
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


                <!-- ======================================
                     TRABAJANDO AHORA
                ======================================= -->

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
                                        color: #78837d;
                                        margin: 0;
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
                                                    ${this.trabajadorService.obtenerNombreCompleto(trabajador)}
                                                </strong>

                                                <p>
                                                    ${trabajador.puesto || "Trabajador"}
                                                </p>

                                            </div>

                                        </div>

                                    `
                                )
                                .join("")
                    }

                </section>

            </div>


            <!-- ==========================================
                 HISTORIAL
            =========================================== -->

            <section
                class="panel"
                style="margin-top: 25px;"
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
                                fichaje => `

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
                                            style="flex: 1;"
                                        >

                                            <strong>
                                                ${fichaje.trabajadorNombre}
                                            </strong>

                                            <p>

                                                ${fichaje.tipo}

                                                ·

                                                ${this.formatearFecha(
                                                    fichaje.fecha
                                                )}

                                                ·

                                                ${fichaje.hora}

                                            </p>

                                        </div>


                                        <span
                                            class="status ${
                                                fichaje.tipo ===
                                                "Entrada"

                                                    ? "progress"

                                                    : "completed"
                                            }"
                                        >
                                            ${fichaje.tipo}
                                        </span>

                                    </div>

                                `
                            )
                            .join("")
                }

            </section>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // CONFIGURAR EVENTOS
    // =====================================================

    configurarEventos() {

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


    // =====================================================
    // REGISTRAR ENTRADA
    // =====================================================

    registrarEntrada() {

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
            fecha.split(
                "-"
            );


        return (
            partes[2]
            +
            "/"
            +
            partes[1]
            +
            "/"
            +
            partes[0]
        );

    }

}