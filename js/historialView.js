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
                    .filter(Boolean)
            ).size;


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
                class="panel historial-filtros-panel"
            >

                <div
                    class="historial-filtros-grid"
                >

                    <div class="form-group">

                        <label>
                            Buscar
                        </label>

                        <input
                            id="buscarHistorial"
                            type="search"
                            placeholder="Acción, usuario, elemento..."
                            value="${this.escaparHTML(this.busqueda)}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Módulo
                        </label>

                        <select
                            id="filtroModuloHistorial"
                        >

                            <option value="">
                                Todos los módulos
                            </option>


                            ${modulos.map(
                                modulo => `

                                    <option
                                        value="${this.escaparHTML(modulo)}"
                                        ${
                                            this.filtroModulo ===
                                            modulo
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${this.escaparHTML(modulo)}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>

                </div>

            </section>


            <section class="panel historial-actividad-panel">

                <div class="panel-header historial-actividad-header">

                    <h3>
                        Actividad
                    </h3>

                    <span
                        id="contadorHistorial"
                        class="historial-contador"
                    >
                        0 registros
                    </span>

                </div>


                <div
                    id="contenidoHistorial"
                    class="historial-lista"
                ></div>

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


        buscador?.addEventListener(
            "input",
            () => {

                this.busqueda =
                    buscador.value;


                this.mostrarRegistros();

            }
        );


        filtro?.addEventListener(
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


        const contador =
            document.getElementById(
                "contadorHistorial"
            );


        if (
            !contenedor
            ||
            !contador
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
                                registro.usuarioTipo,
                                ...(registro.cambios || [])
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();


                        return texto.includes(
                            busqueda
                        );

                    }
                );

        }


        contador.textContent =
            `${registros.length} ${
                registros.length ===
                1
                    ? "registro"
                    : "registros"
            }`;


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


        const cambios =
            Array.isArray(
                registro.cambios
            )
                ? registro.cambios
                : [];


        return `

            <article class="historial-item">

                <div class="historial-item-icono">

                    ${icono}

                </div>


                <div class="historial-item-contenido">

                    <div class="historial-item-cabecera">

                        <div class="historial-item-titulo">

                            <strong>
                                ${this.escaparHTML(
                                    registro.accion
                                    ||
                                    "Actividad"
                                )}
                            </strong>


                            <span>
                                ·
                                ${this.escaparHTML(
                                    registro.modulo
                                    ||
                                    "GestaCamps"
                                )}
                            </span>

                        </div>


                        <time class="historial-item-fecha">

                            ${this.escaparHTML(
                                this.formatearFechaHora(
                                    registro.fechaHora
                                )
                            )}

                        </time>

                    </div>


                    ${
                        registro.referencia

                            ? `

                                <p class="historial-item-referencia">

                                    ${this.escaparHTML(
                                        registro.referencia
                                    )}

                                </p>

                            `

                            : ""
                    }


                    <p class="historial-item-usuario">

                        👤
                        ${this.escaparHTML(
                            registro.usuarioNombre
                            ||
                            "Administración"
                        )}

                        ${
                            registro.usuarioTipo

                                ? ` · ${this.escaparHTML(
                                    registro.usuarioTipo
                                )}`

                                : ""
                        }

                    </p>


                    ${
                        cambios.length >
                        0

                            ? `

                                <p class="historial-item-cambios">

                                    Campos modificados:
                                    ${cambios
                                        .map(
                                            cambio =>
                                                this.escaparHTML(
                                                    cambio
                                                )
                                        )
                                        .join(", ")}

                                </p>

                            `

                            : ""
                    }

                </div>

            </article>

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


        return fecha.toLocaleString(
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


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    escaparHTML(
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