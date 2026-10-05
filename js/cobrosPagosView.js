import {

    formatearDinero

} from "./utils.js";


import {

    crearCobrosPagosCardsHelper

} from "./cobrosPagos/cobrosPagosCards.js";


import {

    crearCobrosPagosFormHelper

} from "./cobrosPagos/cobrosPagosForm.js";



export class CobrosPagosView {

    constructor(
        mainContent,
        cobroPagoService,
        facturaService,
        gastoService
    ) {

        this.mainContent =
            mainContent;

        this.cobroPagoService =
            cobroPagoService;

        this.facturaService =
            facturaService;

        this.gastoService =
            gastoService;


        // =================================================
        // TARJETAS
        // =================================================

        this.cardsHelper =
            crearCobrosPagosCardsHelper({

                cobroPagoService,

                obtenerFacturas:
                    () =>
                        this.obtenerFacturas(),

                obtenerGastos:
                    () =>
                        this.obtenerGastos()

            });


        // =================================================
        // FORMULARIOS
        // =================================================

        this.formHelper =
            crearCobrosPagosFormHelper({

                mainContent,

                cobroPagoService,

                obtenerFacturas:
                    () =>
                        this.obtenerFacturas(),

                obtenerGastos:
                    () =>
                        this.obtenerGastos(),

                crearMiniDato:
                    (
                        titulo,
                        importe,
                        destacar
                    ) =>
                        this.cardsHelper
                            .crearMiniDato(
                                titulo,
                                importe,
                                destacar
                            ),

                onVolver:
                    () =>
                        this.mostrar()

            });

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        if (
            typeof
            this.cobroPagoService
                ?.sincronizarEstadosFacturas ===
            "function"
        ) {

            this.cobroPagoService
                .sincronizarEstadosFacturas();

        }


        const movimientos =
            this.obtenerMovimientos();


        const cobrado =
            Number(
                this.cobroPagoService
                    ?.obtenerTotalCobrado?.()
                ||
                0
            );


        const pagado =
            Number(
                this.cobroPagoService
                    ?.obtenerTotalPagado?.()
                ||
                0
            );


        const pendienteCobro =
            Number(
                this.cobroPagoService
                    ?.obtenerTotalPendienteCobro?.()
                ||
                0
            );


        const pendientePago =
            Number(
                this.cobroPagoService
                    ?.obtenerTotalPendientePago?.()
                ||
                0
            );


        const caja =
            cobrado -
            pagado;


        const cobrosRegistrados =
            movimientos.filter(
                movimiento =>
                    movimiento.tipo ===
                    "Cobro"
            ).length;


        const pagosRegistrados =
            movimientos.filter(
                movimiento =>
                    movimiento.tipo ===
                    "Pago"
            ).length;


        this.mainContent.innerHTML = `

            <div class="cobros-pagos-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="cobros-pagos-hero">

                    <div class="cobros-pagos-hero-content">

                        <span class="cobros-pagos-eyebrow">
                            💳 COMERCIAL Y FINANZAS
                        </span>


                        <h1>
                            Cada euro,
                            <span>
                                bajo control.
                            </span>
                        </h1>


                        <p>
                            Registra cobros y pagos, controla
                            las facturas pendientes y conoce
                            el estado real de la caja de tu explotación.
                        </p>


                        <div class="cobros-pagos-hero-actions">

                            <button
                                id="nuevoCobro"
                                class="primary-button"
                                type="button"
                            >
                                + Nuevo cobro
                            </button>


                            <button
                                id="nuevoPago"
                                class="secondary-button"
                                type="button"
                            >
                                + Nuevo pago
                            </button>

                        </div>

                    </div>


                    <div class="cobros-pagos-hero-image">

                        <div class="cobros-pagos-hero-badge">

                            <span>
                                Caja actual
                            </span>


                            <strong>
                                ${formatearDinero(
                                    caja
                                )}
                            </strong>

                        </div>


                        <div class="cobros-pagos-hero-copy">

                            <small>
                                COBRA · PAGA · CONTROLA
                            </small>


                            <strong>
                                Finanzas claras,<br>
                                decisiones mejores
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats cobros-pagos-stats">

                    ${this.cardsHelper
                        .crearTarjeta(
                            "💰",
                            "Cobrado",
                            formatearDinero(
                                cobrado
                            )
                        )}


                    ${this.cardsHelper
                        .crearTarjeta(
                            "📥",
                            "Pendiente de cobro",
                            formatearDinero(
                                pendienteCobro
                            )
                        )}


                    ${this.cardsHelper
                        .crearTarjeta(
                            "💸",
                            "Pagado",
                            formatearDinero(
                                pagado
                            )
                        )}


                    ${this.cardsHelper
                        .crearTarjeta(
                            "📤",
                            "Pendiente de pago",
                            formatearDinero(
                                pendientePago
                            )
                        )}

                </section>


                <!-- ==========================================
                     BALANCE
                =========================================== -->

                <section class="cobros-balance">

                    <div class="cobros-balance-main">

                        <span>
                            🏦
                        </span>


                        <div>

                            <small>
                                BALANCE DE CAJA
                            </small>


                            <strong>
                                ${formatearDinero(
                                    caja
                                )}
                            </strong>


                            <p>
                                Diferencia entre cobros
                                registrados y pagos realizados.
                            </p>

                        </div>

                    </div>


                    <div class="cobros-balance-data">

                        <div>

                            <span>
                                Movimientos
                            </span>


                            <strong>
                                ${movimientos.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Cobros
                            </span>


                            <strong>
                                ${cobrosRegistrados}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Pagos
                            </span>


                            <strong>
                                ${pagosRegistrados}
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     FACTURAS POR COBRAR
                =========================================== -->

                <section class="panel cobros-panel">

                    <div class="panel-header cobros-panel-header">

                        <div>

                            <span class="cobros-section-eyebrow">
                                COBROS PENDIENTES
                            </span>


                            <h3>
                                Facturas por cobrar
                            </h3>


                            <p>
                                El estado de la factura
                                se actualiza automáticamente
                                según los cobros registrados.
                            </p>

                        </div>


                        <div class="cobros-panel-icon">
                            📥
                        </div>

                    </div>


                    ${this.cardsHelper
                        .crearListaFacturasPendientes()}

                </section>


                <!-- ==========================================
                     PAGOS + CAJA
                =========================================== -->

                <section class="cobros-dashboard-grid">

                    <div class="panel cobros-panel">

                        <div class="panel-header cobros-panel-header">

                            <div>

                                <span class="cobros-section-eyebrow">
                                    PAGOS PENDIENTES
                                </span>


                                <h3>
                                    Gastos por pagar
                                </h3>

                            </div>


                            <div class="cobros-panel-icon">
                                📤
                            </div>

                        </div>


                        ${this.cardsHelper
                            .crearListaGastosPendientes()}

                    </div>


                    <div class="panel cobros-panel">

                        <div class="panel-header cobros-panel-header">

                            <div>

                                <span class="cobros-section-eyebrow">
                                    TESORERÍA
                                </span>


                                <h3>
                                    Resumen de caja
                                </h3>

                            </div>


                            <div class="cobros-panel-icon">
                                🏦
                            </div>

                        </div>


                        <div class="cobros-caja-list">

                            ${this.cardsHelper
                                .crearFilaResumen(
                                    "Entradas",
                                    cobrado,
                                    "💰"
                                )}


                            ${this.cardsHelper
                                .crearFilaResumen(
                                    "Salidas",
                                    pagado,
                                    "💸"
                                )}


                            ${this.cardsHelper
                                .crearFilaResumen(
                                    "Caja",
                                    caja,
                                    "🏦",
                                    true
                                )}

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     MOVIMIENTOS
                =========================================== -->

                <section class="panel cobros-panel cobros-movimientos-panel">

                    <div class="cobros-movimientos-header">

                        <div>

                            <span class="cobros-section-eyebrow">
                                HISTORIAL FINANCIERO
                            </span>


                            <h3>
                                Movimientos
                            </h3>


                            <p>
                                Últimos cobros y pagos registrados
                                en la explotación.
                            </p>

                        </div>


                        <span class="cobros-count">
                            ${movimientos.length}
                            ${
                                movimientos.length ===
                                1
                                    ? "movimiento"
                                    : "movimientos"
                            }
                        </span>

                    </div>


                    <div id="listaMovimientos">

                        ${
                            movimientos.length ===
                            0

                                ? `

                                    <div class="cobros-empty">

                                        <div class="cobros-empty-icon">
                                            💳
                                        </div>


                                        <h3>
                                            Todavía no hay movimientos
                                        </h3>


                                        <p>
                                            Registra un cobro o un pago
                                            para empezar a controlar
                                            la caja de la explotación.
                                        </p>

                                    </div>

                                `

                                : `

                                    <div class="movimientos-list">

                                        ${movimientos
                                            .slice()
                                            .sort(
                                                (
                                                    a,
                                                    b
                                                ) => {

                                                    const fechaA =
                                                        new Date(
                                                            a.fechaCreacion
                                                            ||
                                                            a.fecha
                                                            ||
                                                            0
                                                        )
                                                            .getTime();


                                                    const fechaB =
                                                        new Date(
                                                            b.fechaCreacion
                                                            ||
                                                            b.fecha
                                                            ||
                                                            0
                                                        )
                                                            .getTime();


                                                    return (
                                                        fechaB -
                                                        fechaA
                                                    );

                                                }
                                            )
                                            .map(
                                                movimiento =>
                                                    this.cardsHelper
                                                        .crearMovimientoHTML(
                                                            movimiento
                                                        )
                                            )
                                            .join("")}

                                    </div>

                                `
                        }

                    </div>

                </section>

            </div>

        `;


        document
            .getElementById(
                "nuevoCobro"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormularioCobro()
            );


        document
            .getElementById(
                "nuevoPago"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormularioPago()
            );


        this.configurarEventos();

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".eliminar-movimiento"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarMovimiento(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".cobrar-factura-directo"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormularioCobro(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // ELIMINAR MOVIMIENTO
    // =====================================================

    eliminarMovimiento(
        id
    ) {

        const movimiento =
            this.cobroPagoService
                .obtenerPorId(
                    id
                );


        if (
            !movimiento
        ) {

            alert(
                "No se ha encontrado el movimiento."
            );


            return;

        }


        if (
            !confirm(
                `¿Quieres eliminar este ${String(
                    movimiento.tipo
                    ||
                    "movimiento"
                ).toLowerCase()}?`
            )
        ) {

            return;

        }


        const resultado =
            this.cobroPagoService
                .eliminar(
                    movimiento.id
                );


        if (
            !resultado
            ||
            resultado.ok ===
            false
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido eliminar el movimiento."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // FORMULARIO COBRO
    // =====================================================

    mostrarFormularioCobro(
        facturaInicialId = null
    ) {

        this.formHelper
            .mostrarFormularioCobro(
                facturaInicialId
            );

    }


    // =====================================================
    // FORMULARIO PAGO
    // =====================================================

    mostrarFormularioPago() {

        this.formHelper
            .mostrarFormularioPago();

    }


    // =====================================================
    // MOVIMIENTOS
    // =====================================================

    obtenerMovimientos() {

        if (
            typeof
            this.cobroPagoService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.cobroPagoService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.cobroPagoService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.cobroPagoService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // FACTURAS
    // =====================================================

    obtenerFacturas() {

        if (
            typeof
            this.facturaService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.facturaService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.facturaService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.facturaService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // GASTOS
    // =====================================================

    obtenerGastos() {

        if (
            typeof
            this.gastoService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.gastoService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.gastoService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.gastoService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }

}