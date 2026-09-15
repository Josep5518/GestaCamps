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
                class="panel"
                style="
                    margin-bottom: 22px;
                "
            >

                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            minmax(220px, 1fr)
                            minmax(180px, 280px);
                        gap: 12px;
                        align-items: end;
                    "
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


                <p
                    style="
                        margin:
                            8px 0 0;
                        color: #78837d;
                        font-size: 13px;
                    "
                >
                    Escribe al menos 2 caracteres.
                </p>

            </section>


            <section class="panel">

                <div
                    class="panel-header"
                    style="
                        display: flex;
                        justify-content: space-between;
                        gap: 15px;
                        align-items: center;
                    "
                >

                    <h3>
                        Resultados
                    </h3>


                    <span
                        id="contadorResultadosGlobal"
                        style="
                            color: #78837d;
                            font-size: 14px;
                        "
                    >
                        0 resultados
                    </span>

                </div>


                <div
                    id="resultadosBuscadorGlobal"
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


        input.addEventListener(
            "input",
            () => {

                this.consulta =
                    input.value;


                this.actualizarResultados();

            }
        );


        filtroModulo.addEventListener(
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

                input.focus();

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

            <div
                style="
                    display: grid;
                    gap: 10px;
                "
            >

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
                class="resultado-global"
                data-pagina="${this.escaparHTML(
                    resultado.pagina
                )}"
                style="
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    text-align: left;
                    padding: 15px;
                    border: 1px solid #e1e8e3;
                    border-radius: 13px;
                    background: white;
                    cursor: pointer;
                    font: inherit;
                "
            >

                <div
                    style="
                        width: 44px;
                        height: 44px;
                        min-width: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 11px;
                        background: #edf6f1;
                        font-size: 21px;
                    "
                >
                    ${resultado.icono}
                </div>


                <div
                    style="
                        flex: 1;
                        min-width: 0;
                    "
                >

                    <div
                        style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            flex-wrap: wrap;
                        "
                    >

                        <strong
                            style="
                                font-size: 15px;
                            "
                        >
                            ${this.escaparHTML(
                                resultado.titulo
                            )}
                        </strong>


                        <span
                            style="
                                padding: 4px 8px;
                                border-radius: 999px;
                                background: #edf6f1;
                                color: #247354;
                                font-size: 11px;
                                font-weight: 600;
                            "
                        >
                            ${this.escaparHTML(
                                resultado.modulo
                            )}
                        </span>

                    </div>


                    ${
                        resultado.subtitulo

                            ? `

                                <p
                                    style="
                                        margin: 5px 0 0;
                                        color: #5f6d66;
                                        font-size: 13px;
                                    "
                                >
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

                                <p
                                    style="
                                        margin: 4px 0 0;
                                        color: #78837d;
                                        font-size: 12px;
                                    "
                                >
                                    ${this.escaparHTML(
                                        resultado.detalle
                                    )}
                                </p>

                            `

                            : ""
                    }

                </div>


                <span
                    style="
                        color: #78837d;
                        font-size: 20px;
                    "
                >
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