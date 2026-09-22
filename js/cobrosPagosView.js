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
                .sincronizarEstadosFacturas ===
            "function"
        ) {

            this.cobroPagoService
                .sincronizarEstadosFacturas();

        }


        const movimientos =
            this.cobroPagoService
                .obtenerTodos();


        const cobrado =
            this.cobroPagoService
                .obtenerTotalCobrado();


        const pagado =
            this.cobroPagoService
                .obtenerTotalPagado();


        const pendienteCobro =
            this.cobroPagoService
                .obtenerTotalPendienteCobro();


        const pendientePago =
            this.cobroPagoService
                .obtenerTotalPendientePago();


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Cobros y pagos
                    </h2>

                    <p>
                        Controla el dinero cobrado, pendiente y pagado de la explotación
                    </p>

                </div>


                <div class="cobros-top-actions">

                    <button
                        id="nuevoCobro"
                        type="button"
                        class="primary-button"
                    >
                        + Nuevo cobro
                    </button>


                    <button
                        id="nuevoPago"
                        type="button"
                        class="secondary-button"
                    >
                        + Nuevo pago
                    </button>

                </div>

            </header>


            <section class="stats">

                ${this.cardsHelper.crearTarjeta(
                    "💰",
                    "Cobrado",
                    formatearDinero(
                        cobrado
                    )
                )}

                ${this.cardsHelper.crearTarjeta(
                    "📥",
                    "Pendiente de cobro",
                    formatearDinero(
                        pendienteCobro
                    )
                )}

                ${this.cardsHelper.crearTarjeta(
                    "💸",
                    "Pagado",
                    formatearDinero(
                        pagado
                    )
                )}

                ${this.cardsHelper.crearTarjeta(
                    "📤",
                    "Pendiente de pago",
                    formatearDinero(
                        pendientePago
                    )
                )}

            </section>


            <section
                class="panel"
                style="
                    margin-top:22px;
                "
            >

                <div class="panel-header">

                    <div>

                        <h3>
                            Facturas por cobrar
                        </h3>

                        <p
                            style="
                                margin:4px 0 0;
                                color:#78837d;
                                font-size:13px;
                            "
                        >
                            El estado se actualiza automáticamente según los cobros.
                        </p>

                    </div>

                </div>


                ${this.cardsHelper
                    .crearListaFacturasPendientes()}

            </section>


            <section
                class="dashboard-grid"
                style="
                    margin-top:20px;
                "
            >

                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            Gastos pendientes de pago
                        </h3>

                    </div>


                    ${this.cardsHelper
                        .crearListaGastosPendientes()}

                </div>


                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            Resumen de caja
                        </h3>

                    </div>


                    <div
                        style="
                            display:grid;
                            gap:10px;
                        "
                    >

                        ${this.cardsHelper.crearFilaResumen(
                            "Entradas",
                            cobrado,
                            "💰"
                        )}

                        ${this.cardsHelper.crearFilaResumen(
                            "Salidas",
                            pagado,
                            "💸"
                        )}

                        ${this.cardsHelper.crearFilaResumen(
                            "Caja",
                            cobrado -
                            pagado,
                            "🏦",
                            true
                        )}

                    </div>

                </div>

            </section>


            <section
                class="panel cobros-movimientos-panel"
                style="
                    margin-top:20px;
                "
            >

                <div class="panel-header">

                    <h3>
                        Movimientos
                    </h3>

                </div>


                <div id="listaMovimientos">

                    ${
                        movimientos.length ===
                        0

                            ? `
                                <p>
                                    Todavía no hay cobros ni pagos registrados.
                                </p>
                            `

                            : `
                                <div class="movimientos-list">

                                    ${movimientos
                                        .slice()
                                        .sort(
                                            (
                                                a,
                                                b
                                            ) =>
                                                new Date(
                                                    b.fechaCreacion
                                                    ||
                                                    b.fecha
                                                )
                                                -
                                                new Date(
                                                    a.fechaCreacion
                                                    ||
                                                    a.fecha
                                                )
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

        `;


        document
            .getElementById(
                "nuevoCobro"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrarFormularioCobro();

                }
            );


        document
            .getElementById(
                "nuevoPago"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrarFormularioPago();

                }
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