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

            <div class="estadisticas-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="estadisticas-hero">

                    <div class="estadisticas-hero-content">

                        <span class="estadisticas-eyebrow">
                            📊 COMERCIAL Y FINANZAS
                        </span>


                        <h1>
                            Datos que ayudan
                            <span>
                                a decidir mejor.
                            </span>
                        </h1>


                        <p>
                            Analiza rentabilidad, tesorería,
                            producción y costes para entender
                            el rendimiento real de la explotación.
                        </p>


                        <div class="estadisticas-hero-highlight">

                            <span>
                                📈
                            </span>


                            <div>

                                <small>
                                    BENEFICIO ACTUAL
                                </small>


                                <strong>
                                    ${formatearDinero(
                                        beneficio
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>


                    <div class="estadisticas-hero-image">

                        <div class="estadisticas-hero-badge">

                            <span>
                                Margen
                            </span>


                            <strong>
                                ${formatearPorcentaje(
                                    margen
                                )}
                            </strong>

                        </div>


                        <div class="estadisticas-hero-copy">

                            <small>
                                MIDE · COMPARA · DECIDE
                            </small>


                            <strong>
                                Tu explotación,<br>
                                convertida en información
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     RENTABILIDAD
                =========================================== -->

                <div class="estadistica-seccion-titulo">

                    <span class="estadistica-kicker">
                        RESULTADO ECONÓMICO
                    </span>


                    <h3>
                        Rentabilidad
                    </h3>


                    <p>
                        Resultado económico de la actividad,
                        independientemente de cuándo se cobre o pague.
                    </p>

                </div>


                <section class="stats estadisticas-main-stats">

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
                     FACTURACIÓN
                =========================================== -->

                <div class="estadistica-seccion-titulo">

                    <span class="estadistica-kicker">
                        TESORERÍA
                    </span>


                    <h3>
                        Facturación y caja
                    </h3>


                    <p>
                        Facturas emitidas frente al dinero
                        realmente cobrado y pagado.
                    </p>

                </div>


                <section class="stats estadisticas-main-stats">

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


                <section class="stats estadisticas-mini-stats">

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

                    <span class="estadistica-kicker">
                        ACTIVIDAD PRODUCTIVA
                    </span>


                    <h3>
                        Producción
                    </h3>


                    <p>
                        Situación productiva y disponibilidad real.
                    </p>

                </div>


                <section class="stats estadisticas-main-stats">

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


                <section class="stats estadisticas-mini-stats">

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

                    <span class="estadistica-kicker">
                        RECOLECCIÓN
                    </span>


                    <h3>
                        Producción por pasada
                    </h3>


                    <p>
                        Kilos registrados en cada pasada
                        de recolección.
                    </p>

                </div>


                <section class="stats estadisticas-pasadas">

                    ${
                        produccionPasada.length >
                        0

                            ? produccionPasada
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
                                .join("")

                            : `

                                <div class="estadisticas-empty-inline">

                                    Todavía no hay pasadas
                                    de producción para analizar.

                                </div>

                            `
                    }

                </section>


                <!-- ==========================================
                     ANÁLISIS VISUAL
                =========================================== -->

                <div class="estadistica-seccion-titulo">

                    <span class="estadistica-kicker">
                        ANÁLISIS VISUAL
                    </span>


                    <h3>
                        Comparativas
                    </h3>


                    <p>
                        Producción, costes e ingresos
                        representados de forma visual.
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
                     DISTRIBUCIÓN
                =========================================== -->

                <div class="estadistica-seccion-titulo">

                    <span class="estadistica-kicker">
                        DISTRIBUCIÓN
                    </span>


                    <h3>
                        Fincas y clientes
                    </h3>


                    <p>
                        Producción, facturación y cobros
                        distribuidos por origen.
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
                     RENTABILIDAD CAMPAÑA
                =========================================== -->

                <div class="rentabilidad-bloque">

                    <div class="estadistica-seccion-titulo">

                        <span class="estadistica-kicker">
                            CAMPAÑAS
                        </span>


                        <h3>
                            Rentabilidad por campanya
                        </h3>


                        <p>
                            Producción, ingresos facturados
                            y gastos asociados.
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
                     RENTABILIDAD FINCA
                =========================================== -->

                <div class="rentabilidad-bloque">

                    <div class="estadistica-seccion-titulo">

                        <span class="estadistica-kicker">
                            FINCAS
                        </span>


                        <h3>
                            Rentabilidad por finca
                        </h3>


                        <p>
                            Producción, ventas facturadas
                            y gastos asociados.
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

            </div>

        `;

    }

}