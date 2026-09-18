export class EstadisticasView {

    constructor(
        mainContent,
        estadisticasService
    ) {

        this.mainContent =
            mainContent;

        this.estadisticasService =
            estadisticasService;

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const facturado =
            this.estadisticasService
                .obtenerTotalFacturado();


        const ingresos =
            this.estadisticasService
                .obtenerIngresos();


        const gastos =
            this.estadisticasService
                .obtenerTotalGastos();


        const beneficio =
            this.estadisticasService
                .obtenerBeneficio();


        const margen =
            this.estadisticasService
                .obtenerMargen();


        const cobrado =
            this.estadisticasService
                .obtenerTotalCobrado();


        const pendienteCobro =
            this.estadisticasService
                .obtenerPendienteCobro();


        const pagado =
            this.estadisticasService
                .obtenerTotalPagadoReal();


        const pendientePago =
            this.estadisticasService
                .obtenerPendientePago();


        const cajaReal =
            this.estadisticasService
                .obtenerCajaReal();


        const producido =
            this.estadisticasService
                .obtenerProduccionTotal();


        const reservado =
            this.estadisticasService
                .obtenerProduccionReservada();


        const entregado =
            this.estadisticasService
                .obtenerProduccionEntregada();


        const disponible =
            this.estadisticasService
                .obtenerProduccionDisponible();


        const precioMedio =
            this.estadisticasService
                .obtenerPrecioMedio();


        const costeKg =
            this.estadisticasService
                .obtenerCostePorKg();


        const gastosCategoria =
            this.estadisticasService
                .obtenerGastosPorCategoria();


        const produccionFinca =
            this.estadisticasService
                .obtenerProduccionPorFinca();


        const produccionPasada =
            this.estadisticasService
                .obtenerProduccionPorPasada();


        const facturacionCliente =
            this.estadisticasService
                .obtenerFacturacionPorCliente();


        const cobradoCliente =
            this.estadisticasService
                .obtenerCobradoPorCliente();


        const rentabilidadFinca =
            this.estadisticasService
                .obtenerRentabilidadPorFinca();


        const rentabilidadCampania =
            this.estadisticasService
                .obtenerRentabilidadPorCampania();


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Estadísticas
                    </h2>

                    <p>
                        Analiza rentabilidad, tesorería y producción de la explotación
                    </p>

                </div>

            </header>


            <!-- =========================================
                 RENTABILIDAD
            ========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Rentabilidad
                </h3>

                <p>
                    Resultado económico de la actividad, independientemente de cuándo se cobre o pague
                </p>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "💰",
                    "Ingresos sin IVA",
                    this.formatearDinero(
                        ingresos
                    )
                )}


                ${this.crearTarjeta(
                    "💸",
                    "Gastos",
                    this.formatearDinero(
                        gastos
                    )
                )}


                ${this.crearTarjeta(
                    "📈",
                    "Beneficio",
                    this.formatearDinero(
                        beneficio
                    )
                )}


                ${this.crearTarjeta(
                    "📊",
                    "Margen",
                    this.formatearPorcentaje(
                        margen
                    )
                )}

            </section>


            <!-- =========================================
                 FACTURACIÓN Y TESORERÍA
            ========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Facturación y tesorería
                </h3>

                <p>
                    Facturas emitidas frente al dinero realmente cobrado y pagado
                </p>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "🧾",
                    "Facturado con IVA",
                    this.formatearDinero(
                        facturado
                    )
                )}


                ${this.crearTarjeta(
                    "📥",
                    "Cobrado",
                    this.formatearDinero(
                        cobrado
                    )
                )}


                ${this.crearTarjeta(
                    "🕒",
                    "Pendiente de cobro",
                    this.formatearDinero(
                        pendienteCobro
                    )
                )}


                ${this.crearTarjeta(
                    "🏦",
                    "Caja real",
                    this.formatearDinero(
                        cajaReal
                    )
                )}

            </section>


            <section
                class="stats"
                style="
                    margin-top:14px;
                "
            >

                ${this.crearTarjeta(
                    "📤",
                    "Pagado",
                    this.formatearDinero(
                        pagado
                    )
                )}


                ${this.crearTarjeta(
                    "⏳",
                    "Pendiente de pago",
                    this.formatearDinero(
                        pendientePago
                    )
                )}

            </section>


            <!-- =========================================
                 PRODUCCIÓN
            ========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Producción
                </h3>

                <p>
                    Situación productiva y disponibilidad real
                </p>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "🍎",
                    "Producido",
                    `${this.formatearNumero(
                        producido
                    )} kg`
                )}


                ${this.crearTarjeta(
                    "🕒",
                    "Reservado",
                    `${this.formatearNumero(
                        reservado
                    )} kg`
                )}


                ${this.crearTarjeta(
                    "🚚",
                    "Entregado",
                    `${this.formatearNumero(
                        entregado
                    )} kg`
                )}


                ${this.crearTarjeta(
                    "📦",
                    "Disponible",
                    `${this.formatearNumero(
                        disponible
                    )} kg`
                )}

            </section>


            <section
                class="stats estadisticas-mini-stats"
                style="
                    margin-top:14px;
                "
            >

                ${this.crearTarjetaMini(
                    "💶",
                    "Precio medio vendido",
                    `${this.formatearNumero(
                        precioMedio
                    )} € / kg`
                )}


                ${this.crearTarjetaMini(
                    "📦",
                    "Coste por kg producido",
                    `${this.formatearNumero(
                        costeKg
                    )} € / kg`
                )}

            </section>


            <!-- =========================================
                 PRODUCCIÓN POR PASADA
            ========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Producción por pasada
                </h3>

                <p>
                    Kilos registrados en cada pasada de recolección
                </p>

            </div>


            <section class="stats">

                ${produccionPasada
                    .map(
                        item =>
                            this.crearTarjetaMini(
                                "🍑",
                                item.pasada ===
                                "R"

                                    ? "R · Repaso"

                                    : `${item.pasada} pasada`,
                                `${this.formatearNumero(
                                    item.total
                                )} kg`
                            )
                    )
                    .join("")}

            </section>


            <!-- =========================================
                 GRÁFICOS
            ========================================== -->

            <div class="estadisticas-grid">


                <section class="estadistica-panel">

                    <h3>
                        Gastos por categoría
                    </h3>

                    <p class="estadistica-subtitulo">
                        Distribución de costes registrados
                    </p>


                    ${this.crearBarras(
                        gastosCategoria,
                        "categoria",
                        "total",
                        "dinero"
                    )}

                </section>


                <section class="estadistica-panel">

                    <h3>
                        Producción por finca
                    </h3>

                    <p class="estadistica-subtitulo">
                        Kilos producidos
                    </p>


                    ${this.crearBarras(
                        produccionFinca,
                        "finca",
                        "total",
                        "kg"
                    )}

                </section>


                <section class="estadistica-panel">

                    <h3>
                        Producción por pasada
                    </h3>

                    <p class="estadistica-subtitulo">
                        Kilos producidos en 1ª, 2ª, 3ª y repaso
                    </p>


                    ${this.crearBarras(
                        produccionPasada,
                        "pasada",
                        "total",
                        "kg"
                    )}

                </section>


                <section class="estadistica-panel">

                    <h3>
                        Facturación por cliente
                    </h3>

                    <p class="estadistica-subtitulo">
                        Base imponible de facturas activas
                    </p>


                    ${this.crearBarras(
                        facturacionCliente,
                        "cliente",
                        "total",
                        "dinero"
                    )}

                </section>


                <section class="estadistica-panel">

                    <h3>
                        Cobrado por cliente
                    </h3>

                    <p class="estadistica-subtitulo">
                        Dinero realmente recibido
                    </p>


                    ${this.crearBarras(
                        cobradoCliente,
                        "cliente",
                        "total",
                        "dinero"
                    )}

                </section>


                <section class="estadistica-panel">

                    <h3>
                        Resumen económico
                    </h3>

                    <p class="estadistica-subtitulo">
                        Rentabilidad de la explotación
                    </p>


                    ${this.crearFilaResumen(
                        "Ingresos sin IVA",
                        ingresos
                    )}


                    ${this.crearFilaResumen(
                        "Gastos registrados",
                        -gastos
                    )}


                    <div class="estadistica-separador"></div>


                    ${this.crearFilaResumen(
                        "Beneficio",
                        beneficio,
                        true
                    )}


                    ${this.crearFilaResumenTexto(
                        "Margen",
                        this.formatearPorcentaje(
                            margen
                        )
                    )}

                </section>


                <section class="estadistica-panel">

                    <h3>
                        Resumen de tesorería
                    </h3>

                    <p class="estadistica-subtitulo">
                        Dinero realmente movido
                    </p>


                    ${this.crearFilaResumen(
                        "Cobrado",
                        cobrado
                    )}


                    ${this.crearFilaResumen(
                        "Pagado",
                        -pagado
                    )}


                    <div class="estadistica-separador"></div>


                    ${this.crearFilaResumen(
                        "Caja real",
                        cajaReal,
                        true
                    )}


                    ${this.crearFilaResumen(
                        "Pendiente de cobro",
                        pendienteCobro
                    )}


                    ${this.crearFilaResumen(
                        "Pendiente de pago",
                        pendientePago
                    )}

                </section>

            </div>


            <!-- =========================================
                 RENTABILIDAD CAMPANYA
            ========================================== -->

            <div class="rentabilidad-bloque">

                <div class="estadistica-seccion-titulo">

                    <h3>
                        Rentabilidad por campanya
                    </h3>

                    <p>
                        Producción, ingresos facturados y gastos asociados
                    </p>

                </div>


                <div class="rentabilidad-grid">

                    ${
                        rentabilidadCampania.length >
                        0

                            ? rentabilidadCampania
                                .map(
                                    campania =>
                                        this.crearTarjetaCampania(
                                            campania
                                        )
                                )
                                .join("")

                            : `
                                <div class="estadistica-panel">
                                    Todavía no hay campanyas para analizar.
                                </div>
                            `
                    }

                </div>

            </div>


            <!-- =========================================
                 RENTABILIDAD FINCA
            ========================================== -->

            <div class="rentabilidad-bloque">

                <div class="estadistica-seccion-titulo">

                    <h3>
                        Rentabilidad por finca
                    </h3>

                    <p>
                        Producción, ventas facturadas y gastos asociados
                    </p>

                </div>


                <div class="rentabilidad-grid">

                    ${
                        rentabilidadFinca.length >
                        0

                            ? rentabilidadFinca
                                .map(
                                    finca =>
                                        this.crearTarjetaFinca(
                                            finca
                                        )
                                )
                                .join("")

                            : `
                                <div class="estadistica-panel">
                                    Todavía no hay fincas para analizar.
                                </div>
                            `
                    }

                </div>

            </div>

        `;

    }


    // =====================================================
    // TARJETAS
    // =====================================================

    crearTarjeta(
        icono,
        titulo,
        valor
    ) {

        return `

            <div class="card">

                <span class="card-icon">
                    ${icono}
                </span>

                <div>

                    <p>
                        ${titulo}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    crearTarjetaMini(
        icono,
        titulo,
        valor
    ) {

        return this.crearTarjeta(
            icono,
            titulo,
            valor
        );

    }


    // =====================================================
    // BARRAS
    // =====================================================

    crearBarras(
        datos,
        propiedadNombre,
        propiedadValor,
        tipo
    ) {

        if (
            !datos
            ||
            datos.length ===
            0
        ) {

            return `

                <p class="estadistica-vacio">
                    Sin datos.
                </p>

            `;

        }


        const maximo =
            Math.max(
                ...datos.map(
                    item =>
                        Math.abs(
                            Number(
                                item[
                                    propiedadValor
                                ]
                                ||
                                0
                            )
                        )
                ),
                1
            );


        return datos
            .map(
                item => {

                    const valor =
                        Number(
                            item[
                                propiedadValor
                            ]
                            ||
                            0
                        );


                    const porcentaje =
                        Math.max(
                            2,
                            (
                                Math.abs(
                                    valor
                                )
                                /
                                maximo
                            )
                            *
                            100
                        );


                    const textoValor =
                        tipo ===
                        "kg"

                            ? `${this.formatearNumero(
                                valor
                            )} kg`

                            : this.formatearDinero(
                                valor
                            );


                    return `

                        <div class="estadistica-barra-item">

                            <div class="estadistica-barra-cabecera">

                                <strong>
                                    ${this.escapar(
                                        item[
                                            propiedadNombre
                                        ]
                                    )}
                                </strong>

                                <span>
                                    ${textoValor}
                                </span>

                            </div>


                            <div class="estadistica-barra-fondo">

                                <div
                                    class="estadistica-barra"
                                    style="
                                        width:${porcentaje}%;
                                    "
                                ></div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    }


    // =====================================================
    // FILAS RESUMEN
    // =====================================================

    crearFilaResumen(
        titulo,
        valor,
        destacado = false
    ) {

        return `

            <div
                class="
                    estadistica-resumen-fila
                    ${
                        destacado
                            ? "estadistica-resumen-destacado"
                            : ""
                    }
                "
            >

                <span>
                    ${titulo}
                </span>

                <strong>
                    ${this.formatearDinero(
                        valor
                    )}
                </strong>

            </div>

        `;

    }


    crearFilaResumenTexto(
        titulo,
        valor
    ) {

        return `

            <div class="estadistica-resumen-fila">

                <span>
                    ${titulo}
                </span>

                <strong>
                    ${valor}
                </strong>

            </div>

        `;

    }


    // =====================================================
    // CAMPANYA
    // =====================================================

    crearTarjetaCampania(
        campania
    ) {

        return `

            <article class="rentabilidad-card">

                <div class="rentabilidad-card-header">

                    <span class="card-icon">
                        📅
                    </span>


                    <div>

                        <h3>
                            ${this.escapar(
                                campania.nombre
                            )}
                        </h3>

                        <p>
                            ${this.escapar(
                                campania.fincaNombre
                                ||
                                "Sin finca"
                            )}
                        </p>

                    </div>


                    <span
                        class="
                            campania-status
                            ${
                                campania.estado ===
                                "Activa"

                                    ? "campania-activa"

                                    : "campania-cerrada"
                            }
                        "
                    >
                        ${this.escapar(
                            campania.estado
                            ||
                            "Sin estado"
                        )}
                    </span>

                </div>


                <div class="rentabilidad-card-grid">

                    <div>

                        <span>
                            Producción
                        </span>

                        <strong>
                            ${this.formatearNumero(
                                campania.produccion
                            )}
                            kg
                        </strong>

                    </div>


                    <div>

                        <span>
                            Ingresos
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                campania.ingresos
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Gastos
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                campania.gastos
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Beneficio
                        </span>

                        <strong
                            class="${
                                campania.beneficio >=
                                0

                                    ? "valor-positivo"

                                    : "valor-negativo"
                            }"
                        >
                            ${this.formatearDinero(
                                campania.beneficio
                            )}
                        </strong>

                    </div>

                </div>


                <div class="rentabilidad-footer">

                    <span>
                        Margen
                    </span>

                    <strong>
                        ${this.formatearPorcentaje(
                            campania.margen
                        )}
                    </strong>

                </div>

            </article>

        `;

    }


    // =====================================================
    // FINCA
    // =====================================================

    crearTarjetaFinca(
        finca
    ) {

        return `

            <article class="rentabilidad-card">

                <div class="rentabilidad-card-header">

                    <span class="card-icon">
                        🌾
                    </span>

                    <div>

                        <h3>
                            ${this.escapar(
                                finca.fincaNombre
                            )}
                        </h3>

                    </div>

                </div>


                <div class="rentabilidad-card-grid">

                    <div>

                        <span>
                            Producción
                        </span>

                        <strong>
                            ${this.formatearNumero(
                                finca.produccion
                            )}
                            kg
                        </strong>

                    </div>


                    <div>

                        <span>
                            Ventas
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                finca.ventas
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Gastos
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                finca.gastos
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Resultado
                        </span>

                        <strong
                            class="${
                                finca.resultado >=
                                0

                                    ? "valor-positivo"

                                    : "valor-negativo"
                            }"
                        >
                            ${this.formatearDinero(
                                finca.resultado
                            )}
                        </strong>

                    </div>

                </div>


                <div class="rentabilidad-footer">

                    <span>
                        Margen
                    </span>

                    <strong>
                        ${this.formatearPorcentaje(
                            finca.margen
                        )}
                    </strong>

                </div>

            </article>

        `;

    }


    // =====================================================
    // FORMATOS
    // =====================================================

    formatearDinero(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )
            +
            " €";

    }


    formatearNumero(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    minimumFractionDigits:
                        0,

                    maximumFractionDigits:
                        2
                }
            );

    }


    formatearPorcentaje(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    minimumFractionDigits:
                        1,

                    maximumFractionDigits:
                        1
                }
            )
            +
            " %";

    }


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

}