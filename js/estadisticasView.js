import {
    formatearNumero,
    formatearDinero
} from "./utils.js";

import {
    crearTarjetaEstadistica,
    crearTarjetaMiniEstadistica,
    crearBarrasEstadistica,
    crearGraficoColumnasEstadistica,
    crearGraficoDonutEstadistica,
    crearGraficoComparacionEstadistica,
    crearFilaResumenEstadistica,
    crearFilaResumenTextoEstadistica,
    crearTarjetaCampaniaEstadistica,
    crearTarjetaFincaEstadistica,
    formatearPorcentaje
} from "./estadisticas/estadisticasRender.js";


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


            <!-- ==========================================
                 RENTABILIDAD
            =========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Rentabilidad
                </h3>

                <p>
                    Resultado económico de la actividad, independientemente de cuándo se cobre o pague
                </p>

            </div>


            <section class="stats">

                ${crearTarjetaEstadistica(
                    "💰",
                    "Ingresos sin IVA",
                    formatearDinero(
                        ingresos
                    )
                )}

                ${crearTarjetaEstadistica(
                    "💸",
                    "Gastos",
                    formatearDinero(
                        gastos
                    )
                )}

                ${crearTarjetaEstadistica(
                    "📈",
                    "Beneficio",
                    formatearDinero(
                        beneficio
                    )
                )}

                ${crearTarjetaEstadistica(
                    "📊",
                    "Margen",
                    formatearPorcentaje(
                        margen
                    )
                )}

            </section>


            <!-- ==========================================
                 FACTURACIÓN Y TESORERÍA
            =========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Facturación y tesorería
                </h3>

                <p>
                    Facturas emitidas frente al dinero realmente cobrado y pagado
                </p>

            </div>


            <section class="stats">

                ${crearTarjetaEstadistica(
                    "🧾",
                    "Facturado con IVA",
                    formatearDinero(
                        facturado
                    )
                )}

                ${crearTarjetaEstadistica(
                    "📥",
                    "Cobrado",
                    formatearDinero(
                        cobrado
                    )
                )}

                ${crearTarjetaEstadistica(
                    "🕒",
                    "Pendiente de cobro",
                    formatearDinero(
                        pendienteCobro
                    )
                )}

                ${crearTarjetaEstadistica(
                    "🏦",
                    "Caja real",
                    formatearDinero(
                        cajaReal
                    )
                )}

            </section>


            <section
                class="stats estadisticas-mini-stats"
                style="
                    margin-top:14px;
                "
            >

                ${crearTarjetaEstadistica(
                    "📤",
                    "Pagado",
                    formatearDinero(
                        pagado
                    )
                )}

                ${crearTarjetaEstadistica(
                    "⏳",
                    "Pendiente de pago",
                    formatearDinero(
                        pendientePago
                    )
                )}

            </section>


            <!-- ==========================================
                 PRODUCCIÓN
            =========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Producción
                </h3>

                <p>
                    Situación productiva y disponibilidad real
                </p>

            </div>


            <section class="stats">

                ${crearTarjetaEstadistica(
                    "🍎",
                    "Producido",
                    `${formatearNumero(
                        producido
                    )} kg`
                )}

                ${crearTarjetaEstadistica(
                    "🕒",
                    "Reservado",
                    `${formatearNumero(
                        reservado
                    )} kg`
                )}

                ${crearTarjetaEstadistica(
                    "🚚",
                    "Entregado",
                    `${formatearNumero(
                        entregado
                    )} kg`
                )}

                ${crearTarjetaEstadistica(
                    "📦",
                    "Disponible",
                    `${formatearNumero(
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

                ${crearTarjetaMiniEstadistica(
                    "💶",
                    "Precio medio vendido",
                    `${formatearNumero(
                        precioMedio
                    )} € / kg`
                )}

                ${crearTarjetaMiniEstadistica(
                    "📦",
                    "Coste por kg producido",
                    `${formatearNumero(
                        costeKg
                    )} € / kg`
                )}

            </section>


            <!-- ==========================================
                 PRODUCCIÓN POR PASADA
            =========================================== -->

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
                            crearTarjetaMiniEstadistica(
                                "🍑",
                                item.pasada ===
                                "R"

                                    ? "R · Repaso"

                                    : `${item.pasada} pasada`,

                                `${formatearNumero(
                                    item.total
                                )} kg`
                            )
                    )
                    .join("")}

            </section>


            <!-- ==========================================
                 GRÁFICOS PRINCIPALES
            =========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Análisis visual
                </h3>

                <p>
                    Comparativa gráfica de producción, costes e ingresos
                </p>

            </div>


            <div class="estadisticas-grid estadisticas-graficos-grid">


                <!-- GASTOS -->

                <section class="estadistica-panel gc-chart-panel">

                    <div class="gc-chart-panel-header">

                        <div>

                            <h3>
                                Gastos por categoría
                            </h3>

                            <p class="estadistica-subtitulo">
                                Distribución de costes registrados
                            </p>

                        </div>

                        <span class="gc-chart-badge">
                            Gastos
                        </span>

                    </div>


                    ${crearGraficoDonutEstadistica(
                        gastosCategoria,
                        "categoria",
                        "total",
                        "dinero"
                    )}

                </section>


                <!-- PRODUCCIÓN POR PASADA -->

                <section class="estadistica-panel gc-chart-panel">

                    <div class="gc-chart-panel-header">

                        <div>

                            <h3>
                                Producción por pasada
                            </h3>

                            <p class="estadistica-subtitulo">
                                Comparativa entre recolecciones
                            </p>

                        </div>

                        <span class="gc-chart-badge">
                            kg
                        </span>

                    </div>


                    ${crearGraficoColumnasEstadistica(
                        produccionPasada,
                        "pasada",
                        "total",
                        "kg"
                    )}

                </section>


                <!-- INGRESOS VS GASTOS -->

                <section class="estadistica-panel gc-chart-panel">

                    <div class="gc-chart-panel-header">

                        <div>

                            <h3>
                                Ingresos y gastos
                            </h3>

                            <p class="estadistica-subtitulo">
                                Comparativa de rentabilidad
                            </p>

                        </div>

                        <span class="gc-chart-badge">
                            €
                        </span>

                    </div>


                    ${crearGraficoComparacionEstadistica({

                        tituloA:
                            "Ingresos sin IVA",

                        valorA:
                            ingresos,

                        tituloB:
                            "Gastos",

                        valorB:
                            gastos,

                        tipo:
                            "dinero"

                    })}

                </section>


                <!-- COBROS VS PAGOS -->

                <section class="estadistica-panel gc-chart-panel">

                    <div class="gc-chart-panel-header">

                        <div>

                            <h3>
                                Cobros y pagos
                            </h3>

                            <p class="estadistica-subtitulo">
                                Dinero realmente movido
                            </p>

                        </div>

                        <span class="gc-chart-badge">
                            Caja
                        </span>

                    </div>


                    ${crearGraficoComparacionEstadistica({

                        tituloA:
                            "Cobrado",

                        valorA:
                            cobrado,

                        tituloB:
                            "Pagado",

                        valorB:
                            pagado,

                        tipo:
                            "dinero"

                    })}

                </section>

            </div>


            <!-- ==========================================
                 DETALLE POR FINCA / CLIENTE
            =========================================== -->

            <div class="estadistica-seccion-titulo">

                <h3>
                    Distribución
                </h3>

                <p>
                    Producción y facturación por finca y cliente
                </p>

            </div>


            <div class="estadisticas-grid">


                <section class="estadistica-panel">

                    <h3>
                        Producción por finca
                    </h3>

                    <p class="estadistica-subtitulo">
                        Kilos producidos
                    </p>

                    ${crearBarrasEstadistica(
                        produccionFinca,
                        "finca",
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

                    ${crearBarrasEstadistica(
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

                    ${crearBarrasEstadistica(
                        cobradoCliente,
                        "cliente",
                        "total",
                        "dinero"
                    )}

                </section>


                <!-- ======================================
                     RESUMEN ECONÓMICO
                ======================================= -->

                <section class="estadistica-panel">

                    <h3>
                        Resumen económico
                    </h3>

                    <p class="estadistica-subtitulo">
                        Rentabilidad de la explotación
                    </p>

                    ${crearFilaResumenEstadistica(
                        "Ingresos sin IVA",
                        ingresos
                    )}

                    ${crearFilaResumenEstadistica(
                        "Gastos registrados",
                        -gastos
                    )}

                    <div class="estadistica-separador"></div>

                    ${crearFilaResumenEstadistica(
                        "Beneficio",
                        beneficio,
                        true
                    )}

                    ${crearFilaResumenTextoEstadistica(
                        "Margen",
                        formatearPorcentaje(
                            margen
                        )
                    )}

                </section>


                <!-- ======================================
                     RESUMEN TESORERÍA
                ======================================= -->

                <section class="estadistica-panel">

                    <h3>
                        Resumen de tesorería
                    </h3>

                    <p class="estadistica-subtitulo">
                        Dinero realmente movido
                    </p>

                    ${crearFilaResumenEstadistica(
                        "Cobrado",
                        cobrado
                    )}

                    ${crearFilaResumenEstadistica(
                        "Pagado",
                        -pagado
                    )}

                    <div class="estadistica-separador"></div>

                    ${crearFilaResumenEstadistica(
                        "Caja real",
                        cajaReal,
                        true
                    )}

                    ${crearFilaResumenEstadistica(
                        "Pendiente de cobro",
                        pendienteCobro
                    )}

                    ${crearFilaResumenEstadistica(
                        "Pendiente de pago",
                        pendientePago
                    )}

                </section>

            </div>


            <!-- ==========================================
                 RENTABILIDAD POR CAMPANYA
            =========================================== -->

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
                                        crearTarjetaCampaniaEstadistica(
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


            <!-- ==========================================
                 RENTABILIDAD POR FINCA
            =========================================== -->

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
                                        crearTarjetaFincaEstadistica(
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

}