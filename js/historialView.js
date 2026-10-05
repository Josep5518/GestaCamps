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
            this.obtenerRegistros();


        const hoy =
            this.obtenerRegistrosHoy();


        const modulos =
            this.obtenerModulos();


        const usuarios =
            new Set(
                todos
                    .map(
                        registro =>
                            registro.usuarioNombre
                    )
                    .filter(Boolean)
            )
                .size;


        const ultimoRegistro =
            todos.length >
            0
                ? todos[0]
                : null;


        this.mainContent.innerHTML = `

            <div class="historial-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="historial-hero">

                    <div class="historial-hero-content">

                        <span class="historial-eyebrow">
                            ⚙️ SISTEMA
                        </span>


                        <h1>
                            Cada cambio,
                            <span>
                                siempre registrado.
                            </span>
                        </h1>


                        <p>
                            Consulta toda la actividad de GestaCamps:
                            altas, modificaciones, eliminaciones y cambios
                            de estado realizados por los usuarios.
                        </p>


                        <div class="historial-hero-status">

                            <span>
                                ✓
                            </span>


                            <div>

                                <small>
                                    ÚLTIMA ACTIVIDAD
                                </small>


                                <strong>

                                    ${
                                        ultimoRegistro

                                            ? this.formatearFechaHora(
                                                ultimoRegistro.fechaHora
                                            )

                                            : "Sin actividad"
                                    }

                                </strong>

                            </div>

                        </div>

                    </div>


                    <div class="historial-hero-image">

                        <div class="historial-hero-badge">

                            <span>
                                Registros hoy
                            </span>


                            <strong>
                                ${hoy.length}
                            </strong>

                        </div>


                        <div class="historial-hero-copy">

                            <small>
                                REVISA · CONTROLA · TRAZA
                            </small>


                            <strong>
                                Todo lo que ocurre,<br>
                                queda registrado
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats historial-stats">

                    ${this.crearStat(
                        "🧾",
                        "Registros",
                        todos.length
                    )}


                    ${this.crearStat(
                        "🕒",
                        "Hoy",
                        hoy.length
                    )}


                    ${this.crearStat(
                        "📂",
                        "Módulos",
                        modulos.length
                    )}


                    ${this.crearStat(
                        "👤",
                        "Usuarios",
                        usuarios
                    )}

                </section>


                <!-- ==========================================
                     FILTROS
                =========================================== -->

                <section class="historial-filtros-panel">

                    <div class="historial-filtros-header">

                        <div>

                            <span class="historial-section-eyebrow">
                                FILTROS
                            </span>


                            <h2>
                                Buscar actividad
                            </h2>


                            <p>
                                Localiza rápidamente una acción,
                                usuario, módulo o elemento.
                            </p>

                        </div>


                        <div class="historial-filter-icon">
                            🔍
                        </div>

                    </div>


                    <div class="historial-filtros-grid">

                        <div class="form-group historial-search-group">

                            <label for="buscarHistorial">
                                Buscar
                            </label>


                            <div class="historial-search-wrapper">

                                <span>
                                    🔎
                                </span>


                                <input
                                    id="buscarHistorial"
                                    type="search"
                                    placeholder="Acción, usuario, elemento..."
                                    value="${this.escaparHTML(
                                        this.busqueda
                                    )}"
                                >

                            </div>

                        </div>


                        <div class="form-group">

                            <label for="filtroModuloHistorial">
                                Módulo
                            </label>


                            <select id="filtroModuloHistorial">

                                <option value="">
                                    Todos los módulos
                                </option>


                                ${modulos
                                    .map(
                                        modulo => `

                                            <option
                                                value="${this.escaparHTML(
                                                    modulo
                                                )}"
                                                ${
                                                    this.filtroModulo ===
                                                    modulo

                                                        ? "selected"

                                                        : ""
                                                }
                                            >
                                                ${this.escaparHTML(
                                                    modulo
                                                )}
                                            </option>

                                        `
                                    )
                                    .join("")}

                            </select>

                        </div>


                        <button
                            id="limpiarFiltrosHistorial"
                            class="secondary-button historial-clear-button"
                            type="button"
                        >
                            Limpiar filtros
                        </button>

                    </div>

                </section>


                <!-- ==========================================
                     ACTIVIDAD
                =========================================== -->

                <section class="historial-actividad-panel">

                    <div class="historial-actividad-header">

                        <div>

                            <span class="historial-section-eyebrow">
                                REGISTRO DE ACTIVIDAD
                            </span>


                            <h2>
                                Historial
                            </h2>


                            <p>
                                Últimos movimientos registrados
                                en el sistema.
                            </p>

                        </div>


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

            </div>

        `;


        this.configurarEventos();


        this.mostrarRegistros();

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
                        ${this.escaparHTML(
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
    // EVENTOS
    // =====================================================

    configurarEventos() {

        const buscador =
            document
                .getElementById(
                    "buscarHistorial"
                );


        const filtro =
            document
                .getElementById(
                    "filtroModuloHistorial"
                );


        const limpiar =
            document
                .getElementById(
                    "limpiarFiltrosHistorial"
                );


        buscador
            ?.addEventListener(
                "input",
                () => {

                    this.busqueda =
                        buscador.value;


                    this.mostrarRegistros();

                }
            );


        filtro
            ?.addEventListener(
                "change",
                () => {

                    this.filtroModulo =
                        filtro.value;


                    this.mostrarRegistros();

                }
            );


        limpiar
            ?.addEventListener(
                "click",
                () => {

                    this.busqueda =
                        "";

                    this.filtroModulo =
                        "";


                    if (
                        buscador
                    ) {

                        buscador.value =
                            "";

                    }


                    if (
                        filtro
                    ) {

                        filtro.value =
                            "";

                    }


                    this.mostrarRegistros();

                }
            );

    }


    // =====================================================
    // MOSTRAR REGISTROS
    // =====================================================

    mostrarRegistros() {

        const contenedor =
            document
                .getElementById(
                    "contenidoHistorial"
                );


        const contador =
            document
                .getElementById(
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
            this.obtenerRegistros();


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

                        const cambios =
                            Array.isArray(
                                registro.cambios
                            )
                                ? registro.cambios
                                : [];


                        const texto =
                            [

                                registro.modulo,

                                registro.accion,

                                registro.referencia,

                                registro.usuarioNombre,

                                registro.usuarioTipo,

                                ...cambios

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


        registros =
            registros
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) => {

                        const fechaA =
                            new Date(
                                a.fechaHora
                                ||
                                0
                            )
                                .getTime();


                        const fechaB =
                            new Date(
                                b.fechaHora
                                ||
                                0
                            )
                                .getTime();


                        return (
                            fechaB -
                            fechaA
                        );

                    }
                );


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

                <div class="historial-empty">

                    <div class="historial-empty-icon">
                        🕒
                    </div>


                    <h3>
                        No hay movimientos
                    </h3>


                    <p>

                        ${
                            this.busqueda
                            ||
                            this.filtroModulo

                                ? "No hay registros que coincidan con los filtros seleccionados."

                                : "Los cambios realizados en GestaCamps aparecerán aquí."
                        }

                    </p>

                </div>

            `;


            return;

        }


        contenedor.innerHTML = `

            <div class="historial-timeline">

                ${registros
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
                    .join("")}

            </div>

        `;

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


        const clase =
            this.obtenerClaseAccion(
                registro
            );


        const cambios =
            Array.isArray(
                registro.cambios
            )
                ? registro.cambios
                : [];


        return `

            <article
                class="
                    historial-item
                    ${clase}
                "
            >

                <div class="historial-item-line"></div>


                <div class="historial-item-icono">

                    ${icono}

                </div>


                <div class="historial-item-contenido">

                    <div class="historial-item-cabecera">

                        <div>

                            <div class="historial-item-titulo">

                                <strong>

                                    ${this.escaparHTML(
                                        registro.accion
                                        ||
                                        "Actividad"
                                    )}

                                </strong>


                                <span>

                                    ${this.escaparHTML(
                                        registro.modulo
                                        ||
                                        "GestaCamps"
                                    )}

                                </span>

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

                        </div>


                        <time class="historial-item-fecha">

                            ${this.escaparHTML(
                                this.formatearFechaHora(
                                    registro.fechaHora
                                )
                            )}

                        </time>

                    </div>


                    <div class="historial-item-footer">

                        <div class="historial-item-user">

                            <span class="historial-user-avatar">

                                ${this.obtenerInicialUsuario(
                                    registro.usuarioNombre
                                )}

                            </span>


                            <div>

                                <strong>

                                    ${this.escaparHTML(
                                        registro.usuarioNombre
                                        ||
                                        "Administración"
                                    )}

                                </strong>


                                <small>

                                    ${this.escaparHTML(
                                        registro.usuarioTipo
                                        ||
                                        "Sistema"
                                    )}

                                </small>

                            </div>

                        </div>


                        ${
                            cambios.length >
                            0

                                ? `

                                    <div class="historial-item-cambios">

                                        <span>
                                            CAMPOS MODIFICADOS
                                        </span>


                                        <div>

                                            ${cambios
                                                .map(
                                                    cambio => `

                                                        <small>

                                                            ${this.escaparHTML(
                                                                cambio
                                                            )}

                                                        </small>

                                                    `
                                                )
                                                .join("")}

                                        </div>

                                    </div>

                                `

                                : ""
                        }

                    </div>

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

            return "＋";

        }


        if (
            registro.accion ===
            "Eliminación"
        ) {

            return "×";

        }


        if (
            String(
                registro.accion
                ||
                ""
            )
                .startsWith(
                    "Estado:"
                )
        ) {

            return "↻";

        }


        return "✎";

    }


    // =====================================================
    // CLASE ACCIÓN
    // =====================================================

    obtenerClaseAccion(
        registro
    ) {

        if (
            registro.accion ===
            "Creación"
        ) {

            return "historial-creacion";

        }


        if (
            registro.accion ===
            "Eliminación"
        ) {

            return "historial-eliminacion";

        }


        if (
            String(
                registro.accion
                ||
                ""
            )
                .startsWith(
                    "Estado:"
                )
        ) {

            return "historial-estado";

        }


        return "historial-edicion";

    }


    // =====================================================
    // INICIAL USUARIO
    // =====================================================

    obtenerInicialUsuario(
        nombre
    ) {

        const limpio =
            String(
                nombre
                ||
                "A"
            )
                .trim();


        return this.escaparHTML(
            limpio
                .charAt(0)
                .toUpperCase()
                ||
                "A"
        );

    }


    // =====================================================
    // DATOS
    // =====================================================

    obtenerRegistros() {

        const registros =
            this.historialService
                ?.obtenerTodos?.();


        return Array.isArray(
            registros
        )
            ? registros
            : [];

    }


    obtenerRegistrosHoy() {

        const registros =
            this.historialService
                ?.obtenerHoy?.();


        return Array.isArray(
            registros
        )
            ? registros
            : [];

    }


    obtenerModulos() {

        const modulos =
            this.historialService
                ?.obtenerModulos?.();


        return Array.isArray(
            modulos
        )
            ? modulos
            : [];

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