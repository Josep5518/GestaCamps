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

            <header class="topbar">

                <div>

                    <h2>
                        Buscador global
                    </h2>

                    <p>
                        Encuentra cualquier dato de GestaCamps
                    </p>

                </div>

            </header>


            <section
                class="
                    panel
                    buscador-global-filtros-panel
                "
            >

                <div
                    class="buscador-global-filtros-grid"
                >

                    <div class="form-group">

                        <label>
                            Buscar
                        </label>


                        <input
                            id="buscadorGlobalInput"
                            type="search"
                            autocomplete="off"
                            placeholder="Ej. Can Rovira, Josep, factura, tractor..."
                            value="${this.escaparHTML(
                                this.consulta
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Módulo
                        </label>


                        <select
                            id="buscadorGlobalModulo"
                        >

                            <option value="">
                                Todos los módulos
                            </option>


                            ${modulos.map(
                                modulo => `

                                    <option
                                        value="${this.escaparHTML(modulo)}"
                                        ${
                                            this.modulo ===
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


                <p class="buscador-global-ayuda">
                    Escribe al menos 2 caracteres.
                </p>

            </section>


            <section
                class="
                    panel
                    buscador-global-resultados-panel
                "
            >

                <div class="panel-header buscador-global-resultados-header">

                    <h3>
                        Resultados
                    </h3>


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

        `;


        const input =
            document.getElementById(
                "buscadorGlobalInput"
            );


        const filtroModulo =
            document.getElementById(
                "buscadorGlobalModulo"
            );


        input?.addEventListener(
            "input",
            () => {

                this.consulta =
                    input.value;


                this.actualizarResultados();

            }
        );


        filtroModulo?.addEventListener(
            "change",
            () => {

                this.modulo =
                    filtroModulo.value;


                this.actualizarResultados();

            }
        );


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


        if (
            !contenedor
            ||
            !contador
        ) {

            return;

        }


        const consulta =
            this.consulta.trim();


        if (
            consulta.length <
            2
        ) {

            contador.textContent =
                "0 resultados";


            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🔎
                    </div>


                    <h3>
                        Busca en todo GestaCamps
                    </h3>


                    <p>
                        Puedes buscar fincas, trabajadores,
                        tareas, facturas, incidencias,
                        maquinaria y mucho más.
                    </p>

                </div>

            `;


            return;

        }


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


        if (
            resultados.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🔍
                    </div>


                    <h3>
                        No hemos encontrado resultados
                    </h3>


                    <p>
                        Prueba con otro nombre, referencia,
                        finca, trabajador o número.
                    </p>

                </div>

            `;


            return;

        }


        contenedor.innerHTML = `

            <div class="buscador-global-resultados-grid">

                ${resultados.map(
                    resultado =>
                        this.crearResultado(
                            resultado
                        )
                ).join("")}

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

                    ${resultado.icono}

                </div>


                <div class="buscador-global-contenido">

                    <div class="buscador-global-titulo-row">

                        <strong class="buscador-global-titulo">

                            ${this.escaparHTML(
                                resultado.titulo
                            )}

                        </strong>


                        <span class="buscador-global-modulo">

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
                    ›
                </span>

            </button>

        `;

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