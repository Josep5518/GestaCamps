export class BuscadorGlobalView {

    constructor(
        mainContent,
        buscadorService,
        navegarA
    ) {

        this.mainContent =
            mainContent;

        this.buscadorService =
            buscadorService;

        this.navegarA =
            navegarA;

        this.consulta =
            "";

        this.modulo =
            "";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const modulos =
            this.buscadorService
                .obtenerModulos();


        this.mainContent.innerHTML = `

            <div class="buscador-page">

                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <section class="buscador-hero">

                    <div class="buscador-hero-contenido">

                        <span class="buscador-eyebrow">
                            🔎 BUSCADOR GLOBAL
                        </span>

                        <h1>
                            Encuentra todo
                            <span>en segundos.</span>
                        </h1>

                        <p>
                            Busca en cualquier rincón de GestaCamps:
                            fincas, trabajadores, facturas,
                            maquinaria, tareas y mucho más.
                        </p>

                    </div>


                    <div class="buscador-hero-imagen">

                        <div class="buscador-hero-overlay">

                            <small>
                                GESTIÓN CENTRALIZADA
                            </small>

                            <strong>
                                Toda la información<br>
                                de tu explotación
                            </strong>

                            <em>
                                al alcance de tu mano
                            </em>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     PANEL DE BÚSQUEDA
                =========================================== -->

                <section class="buscador-panel">

                    <div class="buscador-panel-head">

                        <div>

                            <span class="buscador-panel-icon">
                                🔎
                            </span>

                            <div>

                                <h2>
                                    Buscar en GestaCamps
                                </h2>

                                <p>
                                    Introduce un nombre, referencia o dato.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div class="buscador-filtros">

                        <!-- BUSCAR -->

                        <div class="buscador-form-group buscador-form-search">

                            <label for="buscadorGlobalInput">
                                Buscar
                            </label>


                            <div class="buscador-input-wrap">

                                <span>
                                    ⌕
                                </span>

                                <input
                                    id="buscadorGlobalInput"
                                    type="search"
                                    autocomplete="off"
                                    placeholder="Ej. Can Rovira, Josep, factura, tractor..."
                                    value="${this.escaparHTML(
                                        this.consulta
                                    )}"
                                >

                                <button
                                    id="limpiarBuscadorGlobal"
                                    class="buscador-clear"
                                    type="button"
                                    title="Limpiar búsqueda"
                                    ${
                                        this.consulta
                                            ? ""
                                            : "hidden"
                                    }
                                >
                                    ×
                                </button>

                            </div>

                        </div>


                        <!-- MÓDULO -->

                        <div class="buscador-form-group buscador-form-module">

                            <label for="buscadorGlobalModulo">
                                Módulo
                            </label>


                            <div class="buscador-select-wrap">

                                <span>
                                    ▦
                                </span>

                                <select
                                    id="buscadorGlobalModulo"
                                >

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
                                                        this.modulo ===
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

                        </div>

                    </div>


                    <div class="buscador-ayuda-row">

                        <p
                            id="ayudaBuscadorGlobal"
                            class="buscador-global-ayuda"
                            ${
                                this.consulta
                                    .trim()
                                    .length >= 2

                                    ? "hidden"

                                    : ""
                            }
                        >
                            Escribe al menos 2 caracteres para comenzar.
                        </p>


                        <span class="buscador-tip">
                            ↵ Busca automáticamente mientras escribes
                        </span>

                    </div>

                </section>


                <!-- ==========================================
                     RESULTADOS
                =========================================== -->

                <section class="buscador-resultados-panel">

                    <div class="buscador-resultados-header">

                        <div>

                            <span class="buscador-resultados-eyebrow">
                                RESULTADOS
                            </span>

                            <h2>
                                Coincidencias encontradas
                            </h2>

                        </div>


                        <span
                            id="contadorResultadosGlobal"
                            class="buscador-global-contador"
                        >
                            0 resultados
                        </span>

                    </div>


                    <div
                        id="resultadosBuscadorGlobal"
                        class="buscador-global-resultados"
                    ></div>

                </section>

            </div>

        `;


        // =================================================
        // ELEMENTOS
        // =================================================

        const input =
            document.getElementById(
                "buscadorGlobalInput"
            );


        const filtroModulo =
            document.getElementById(
                "buscadorGlobalModulo"
            );


        const botonLimpiar =
            document.getElementById(
                "limpiarBuscadorGlobal"
            );


        // =================================================
        // INPUT
        // =================================================

        input?.addEventListener(
            "input",
            () => {

                this.consulta =
                    input.value;


                if (
                    botonLimpiar
                ) {

                    botonLimpiar.hidden =
                        !this.consulta;

                }


                this.actualizarResultados();

            }
        );


        // =================================================
        // SELECT
        // =================================================

        filtroModulo?.addEventListener(
            "change",
            () => {

                this.modulo =
                    filtroModulo.value;


                this.actualizarResultados();

            }
        );


        // =================================================
        // LIMPIAR
        // =================================================

        botonLimpiar?.addEventListener(
            "click",
            () => {

                this.consulta =
                    "";

                input.value =
                    "";

                botonLimpiar.hidden =
                    true;


                this.actualizarResultados();


                input.focus();

            }
        );


        // =================================================
        // PRIMER RENDER
        // =================================================

        this.actualizarResultados();


        setTimeout(
            () => {

                input?.focus();

            },
            0
        );

    }


    // =====================================================
    // RESULTADOS
    // =====================================================

    actualizarResultados() {

        const contenedor =
            document.getElementById(
                "resultadosBuscadorGlobal"
            );


        const contador =
            document.getElementById(
                "contadorResultadosGlobal"
            );


        const ayuda =
            document.getElementById(
                "ayudaBuscadorGlobal"
            );


        if (
            !contenedor
            ||
            !contador
        ) {

            return;

        }


        const consulta =
            this.consulta.trim();


        // =================================================
        // TEXTO DE AYUDA
        // =================================================

        if (
            ayuda
        ) {

            ayuda.hidden =
                consulta.length >=
                2;

        }


        // =================================================
        // MENOS DE 2 CARACTERES
        // =================================================

        if (
            consulta.length <
            2
        ) {

            contador.textContent =
                "0 resultados";


            contenedor.innerHTML = `

                <div class="buscador-empty">

                    <div class="buscador-empty-visual">

                        <div class="buscador-empty-sun"></div>


                        <div class="buscador-empty-document documento-1">

                            <span>
                                🌿
                            </span>

                            <i></i>
                            <i></i>
                            <i></i>

                        </div>


                        <div class="buscador-empty-document documento-2">

                            <span>
                                📄
                            </span>

                            <i></i>
                            <i></i>

                        </div>


                        <div class="buscador-empty-search">
                            🔍
                        </div>


                        <div class="buscador-empty-landscape">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>


                    <h3>
                        Busca en todo GestaCamps
                    </h3>


                    <p>
                        Puedes buscar fincas, trabajadores,
                        tareas, facturas, incidencias,
                        maquinaria y mucho más.
                    </p>


                    <div class="buscador-empty-tags">

                        <span>
                            🌾 Fincas
                        </span>

                        <span>
                            👷 Personal
                        </span>

                        <span>
                            🧾 Facturas
                        </span>

                        <span>
                            🚜 Maquinaria
                        </span>

                    </div>

                </div>

            `;


            return;

        }


        // =================================================
        // BUSCAR
        // =================================================

        const resultados =
            this.buscadorService
                .buscar(
                    consulta,
                    this.modulo
                );


        contador.textContent =
            `${resultados.length} ${
                resultados.length ===
                1

                    ? "resultado"

                    : "resultados"
            }`;


        // =================================================
        // SIN RESULTADOS
        // =================================================

        if (
            resultados.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="buscador-empty buscador-empty-no-results">

                    <div class="buscador-empty-no-icon">
                        🔍
                    </div>


                    <h3>
                        No hemos encontrado resultados
                    </h3>


                    <p>
                        No hay coincidencias para
                        <strong>
                            “${this.escaparHTML(
                                consulta
                            )}”
                        </strong>.
                        Prueba con otro nombre,
                        referencia, finca, trabajador
                        o número.
                    </p>


                    <button
                        id="reiniciarBuscadorGlobal"
                        class="buscador-empty-button"
                        type="button"
                    >
                        Limpiar búsqueda
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "reiniciarBuscadorGlobal"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        this.consulta =
                            "";


                        const input =
                            document.getElementById(
                                "buscadorGlobalInput"
                            );


                        const botonLimpiar =
                            document.getElementById(
                                "limpiarBuscadorGlobal"
                            );


                        if (
                            input
                        ) {

                            input.value =
                                "";

                            input.focus();

                        }


                        if (
                            botonLimpiar
                        ) {

                            botonLimpiar.hidden =
                                true;

                        }


                        this.actualizarResultados();

                    }
                );


            return;

        }


        // =================================================
        // MOSTRAR RESULTADOS
        // =================================================

        contenedor.innerHTML = `

            <div class="buscador-results-summary">

                <div>

                    <span>
                        🔎
                    </span>

                    <p>
                        Resultados para
                        <strong>
                            “${this.escaparHTML(
                                consulta
                            )}”
                        </strong>
                    </p>

                </div>


                ${
                    this.modulo

                        ? `

                            <span class="buscador-active-filter">

                                ${this.obtenerIconoModulo(
                                    this.modulo
                                )}

                                ${this.escaparHTML(
                                    this.modulo
                                )}

                            </span>

                        `

                        : ""
                }

            </div>


            <div class="buscador-global-resultados-grid">

                ${resultados
                    .map(
                        resultado =>
                            this.crearResultado(
                                resultado
                            )
                    )
                    .join("")}

            </div>

        `;


        document
            .querySelectorAll(
                ".resultado-global"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const pagina =
                                boton.dataset.pagina;


                            if (
                                pagina
                            ) {

                                this.navegarA(
                                    pagina
                                );

                            }

                        }
                    );

                }
            );

    }


    // =====================================================
    // TARJETA DE RESULTADO
    // =====================================================

    crearResultado(
        resultado
    ) {

        const icono =
            resultado.icono
            ||
            this.obtenerIconoModulo(
                resultado.modulo
            );


        return `

            <button
                type="button"
                class="
                    resultado-global
                    buscador-global-resultado
                "
                data-pagina="${this.escaparHTML(
                    resultado.pagina
                )}"
            >

                <div class="buscador-global-icono">

                    ${icono}

                </div>


                <div class="buscador-global-contenido">

                    <div class="buscador-global-titulo-row">

                        <strong class="buscador-global-titulo">

                            ${this.escaparHTML(
                                resultado.titulo
                            )}

                        </strong>


                        <span class="buscador-global-modulo">

                            ${this.obtenerIconoModulo(
                                resultado.modulo
                            )}

                            ${this.escaparHTML(
                                resultado.modulo
                            )}

                        </span>

                    </div>


                    ${
                        resultado.subtitulo

                            ? `

                                <p class="buscador-global-subtitulo">

                                    ${this.escaparHTML(
                                        resultado.subtitulo
                                    )}

                                </p>

                            `

                            : ""
                    }


                    ${
                        resultado.detalle

                            ? `

                                <p class="buscador-global-detalle">

                                    ${this.escaparHTML(
                                        resultado.detalle
                                    )}

                                </p>

                            `

                            : ""
                    }

                </div>


                <span class="buscador-global-flecha">
                    →
                </span>

            </button>

        `;

    }


    // =====================================================
    // ICONOS
    // =====================================================

    obtenerIconoModulo(
        modulo
    ) {

        const iconos = {

            "Fincas":
                "🌾",

            "Campanyas":
                "🗓️",

            "Cultivos":
                "🌱",

            "Cuaderno de campo":
                "📖",

            "Tratamientos":
                "🧪",

            "Trabajos":
                "👨‍🌾",

            "Trabajadores":
                "👷",

            "Fichajes":
                "⏱️",

            "Incidencias":
                "⚠️",

            "Maquinaria":
                "🚜",

            "Inventario":
                "📦",

            "Producción":
                "🍎",

            "Clientes y Proveedores":
                "👥",

            "Albaranes":
                "🧾",

            "Facturación":
                "💶",

            "Cobros y pagos":
                "💳",

            "Gastos":
                "💰"

        };


        return (
            iconos[modulo]
            ||
            "📄"
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