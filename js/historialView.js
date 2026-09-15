export class HistorialView {

    constructor(
        mainContent,
        historialService
    ) {

        this.mainContent =
            mainContent;

        this.historialService =
            historialService;


        this.filtroModulo =
            "";

        this.busqueda =
            "";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const todos =
            this.historialService
                .obtenerTodos();


        const hoy =
            this.historialService
                .obtenerHoy();


        const modulos =
            this.historialService
                .obtenerModulos();


        const usuarios =
            new Set(
                todos
                    .map(
                        registro =>
                            registro.usuarioNombre
                    )
                    .filter(
                        Boolean
                    )
            )
                .size;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Historial
                    </h2>

                    <p>
                        Registro de actividad y cambios de GestaCamps
                    </p>

                </div>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        🧾
                    </span>

                    <div>

                        <p>
                            Registros
                        </p>

                        <h3>
                            ${todos.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🕒
                    </span>

                    <div>

                        <p>
                            Hoy
                        </p>

                        <h3>
                            ${hoy.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        📂
                    </span>

                    <div>

                        <p>
                            Módulos
                        </p>

                        <h3>
                            ${modulos.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        👤
                    </span>

                    <div>

                        <p>
                            Usuarios
                        </p>

                        <h3>
                            ${usuarios}
                        </h3>

                    </div>

                </div>

            </section>


            <section
                class="panel"
                style="
                    margin-bottom: 22px;
                "
            >

                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            minmax(200px, 1fr)
                            minmax(180px, 280px);
                        gap: 12px;
                    "
                >

                    <div class="form-group">

                        <label>
                            Buscar
                        </label>

                        <input
                            id="buscarHistorial"
                            type="search"
                            placeholder="Acción, usuario, elemento..."
                            value="${this.busqueda}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Módulo
                        </label>

                        <select id="filtroModuloHistorial">

                            <option value="">
                                Todos los módulos
                            </option>


                            ${modulos.map(
                                modulo => `

                                    <option
                                        value="${modulo}"

                                        ${
                                            this.filtroModulo ===
                                            modulo
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${modulo}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>

                </div>

            </section>


            <section class="panel">

                <div class="panel-header">

                    <h3>
                        Actividad
                    </h3>

                </div>


                <div id="contenidoHistorial"></div>

            </section>

        `;


        const buscador =
            document.getElementById(
                "buscarHistorial"
            );


        const filtro =
            document.getElementById(
                "filtroModuloHistorial"
            );


        buscador.addEventListener(
            "input",
            () => {

                this.busqueda =
                    buscador.value;


                this.mostrarRegistros();

            }
        );


        filtro.addEventListener(
            "change",
            () => {

                this.filtroModulo =
                    filtro.value;


                this.mostrarRegistros();

            }
        );


        this.mostrarRegistros();

    }


    // =====================================================
    // MOSTRAR REGISTROS
    // =====================================================

    mostrarRegistros() {

        const contenedor =
            document.getElementById(
                "contenidoHistorial"
            );


        if (
            !contenedor
        ) {

            return;

        }


        let registros =
            this.historialService
                .obtenerTodos();


        if (
            this.filtroModulo
        ) {

            registros =
                registros.filter(
                    registro =>
                        registro.modulo ===
                        this.filtroModulo
                );

        }


        const busqueda =
            this.busqueda
                .trim()
                .toLowerCase();


        if (
            busqueda
        ) {

            registros =
                registros.filter(
                    registro => {

                        const texto =
                            [
                                registro.modulo,
                                registro.accion,
                                registro.referencia,
                                registro.usuarioNombre,
                                ...(registro.cambios || [])
                            ]
                                .join(
                                    " "
                                )
                                .toLowerCase();


                        return texto.includes(
                            busqueda
                        );

                    }
                );

        }


        if (
            registros.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🕒
                    </div>

                    <h3>
                        No hay movimientos
                    </h3>

                    <p>
                        Los cambios realizados en GestaCamps aparecerán aquí.
                    </p>

                </div>

            `;


            return;

        }


        contenedor.innerHTML =
            registros
                .slice(
                    0,
                    500
                )
                .map(
                    registro =>
                        this.crearRegistro(
                            registro
                        )
                )
                .join("");

    }


    // =====================================================
    // REGISTRO
    // =====================================================

    crearRegistro(
        registro
    ) {

        const icono =
            this.obtenerIcono(
                registro
            );


        return `

            <div
                class="activity"
                style="
                    align-items: flex-start;
                    padding-top: 14px;
                    padding-bottom: 14px;
                "
            >

                <span
                    style="
                        font-size: 20px;
                        margin-top: 2px;
                    "
                >
                    ${icono}
                </span>


                <div
                    style="
                        flex: 1;
                        min-width: 0;
                    "
                >

                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            gap: 12px;
                            flex-wrap: wrap;
                        "
                    >

                        <div>

                            <strong>
                                ${registro.accion}
                            </strong>

                            <span
                                style="
                                    color: #78837d;
                                "
                            >
                                · ${registro.modulo}
                            </span>

                        </div>


                        <small
                            style="
                                color: #78837d;
                            "
                        >
                            ${this.formatearFechaHora(
                                registro.fechaHora
                            )}
                        </small>

                    </div>


                    ${
                        registro.referencia

                            ? `

                                <p
                                    style="
                                        margin:
                                            5px 0 0;
                                    "
                                >
                                    ${registro.referencia}
                                </p>

                            `

                            : ""
                    }


                    <p
                        style="
                            margin:
                                5px 0 0;
                            color: #78837d;
                            font-size: 13px;
                        "
                    >
                        👤 ${registro.usuarioNombre || "Administración"}

                        ${
                            registro.usuarioTipo

                                ? ` · ${registro.usuarioTipo}`

                                : ""
                        }

                    </p>


                    ${
                        Array.isArray(
                            registro.cambios
                        )
                        &&
                        registro.cambios.length >
                        0

                            ? `

                                <p
                                    style="
                                        margin:
                                            5px 0 0;
                                        color: #78837d;
                                        font-size: 12px;
                                    "
                                >
                                    Campos modificados:
                                    ${registro.cambios.join(", ")}
                                </p>

                            `

                            : ""
                    }

                </div>

            </div>

        `;

    }


    // =====================================================
    // ICONO
    // =====================================================

    obtenerIcono(
        registro
    ) {

        if (
            registro.accion ===
            "Creación"
        ) {

            return "➕";

        }


        if (
            registro.accion ===
            "Eliminación"
        ) {

            return "🗑️";

        }


        if (
            String(
                registro.accion
            )
                .startsWith(
                    "Estado:"
                )
        ) {

            return "🔄";

        }


        return "✏️";

    }


    // =====================================================
    // FECHA
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
                        "2-digit",

                    second:
                        "2-digit"
                }
            );

    }

}