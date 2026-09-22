import {
    escaparHTML,
    formatearFecha,
    formatearNumero,
    obtenerFechaHoy,
    mismoId
} from "./utils.js";

import {
    crearProduccionStockHelper
} from "./produccion/produccionStock.js";

import {
    crearProduccionCardsHelper
} from "./produccion/produccionCards.js";

import {
    crearProduccionFormHelper
} from "./produccion/produccionForm.js";


export class ProduccionView {

    constructor(
        mainContent,
        fincaService,
        produccionService,
        campaniaService,
        cultivoService,
        albaranService
    ) {

        this.mainContent =
            mainContent;

        this.produccionService =
            produccionService;


        // =================================================
        // STOCK
        // =================================================

        this.stockHelper =
            crearProduccionStockHelper({

                albaranService,

                mismoId

            });


        // =================================================
        // TARJETAS
        // =================================================

        this.cardsHelper =
            crearProduccionCardsHelper({

                stockHelper:
                    this.stockHelper,

                escapar:
                    escaparHTML,

                formatearNumero,

                formatearFecha

            });


        // =================================================
        // FORMULARIO
        // =================================================

        this.formHelper =
            crearProduccionFormHelper({

                mainContent,

                produccionService,

                cultivoService,

                stockHelper:
                    this.stockHelper,

                mismoId,

                escapar:
                    escaparHTML,

                formatearNumero,

                obtenerFechaHoy,

                onVolver:
                    () =>
                        this.mostrar()

            });

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const registros =
            this.produccionService
                .obtenerTodos();


        const totalProducido =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    Number(
                        registro.cantidad
                        ||
                        0
                    ),
                0
            );


        const totalReservado =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    this.stockHelper
                        .obtenerCantidadReservada(
                            registro.id
                        ),
                0
            );


        const totalEntregado =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    this.stockHelper
                        .obtenerCantidadEntregada(
                            registro.id
                        ),
                0
            );


        const totalDisponible =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    this.stockHelper
                        .obtenerCantidadDisponible(
                            registro
                        ),
                0
            );


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Producción
                    </h2>

                    <p>
                        Controla la producción, reservas, entregas y disponibilidad
                    </p>

                </div>


                <button
                    id="nuevaProduccion"
                    class="primary-button"
                    type="button"
                >
                    + Nueva producción
                </button>

            </header>


            <section class="stats">

                ${this.crearTarjetaEstadistica(
                    "🍎",
                    "Producido",
                    totalProducido
                )}

                ${this.crearTarjetaEstadistica(
                    "🕒",
                    "Reservado",
                    totalReservado
                )}

                ${this.crearTarjetaEstadistica(
                    "🚚",
                    "Entregado",
                    totalEntregado
                )}

                ${this.crearTarjetaEstadistica(
                    "📦",
                    "Disponible",
                    totalDisponible
                )}

            </section>


            <div
                style="
                    margin:18px 0 22px;
                    padding:13px 16px;
                    border-radius:10px;
                    background:#edf6f1;
                    color:#315f4d;
                    font-size:13px;
                    line-height:1.5;
                "
            >

                <strong>
                    Estado del stock:
                </strong>

                Pendiente = reservado ·
                Entregado/Facturado = entregado ·
                Borrador/Cancelado = no afecta al stock.

            </div>


            <div id="listaProduccion"></div>

        `;


        document
            .getElementById(
                "nuevaProduccion"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrarFormulario();

                }
            );


        this.mostrarLista();

    }


    // =====================================================
    // TARJETA ESTADÍSTICA
    // =====================================================

    crearTarjetaEstadistica(
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
                        ${escaparHTML(
                            titulo
                        )}
                    </p>

                    <h3>
                        ${formatearNumero(
                            valor
                        )} kg
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const registros =
            this.produccionService
                .obtenerTodos()
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.fecha
                        )
                        -
                        new Date(
                            a.fecha
                        )
                );


        const contenedor =
            document.getElementById(
                "listaProduccion"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            registros.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🍎
                    </div>

                    <h3>
                        Todavía no hay producción registrada
                    </h3>

                    <p>
                        Añade el primer registro de producción de tu explotación.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="produccion-grid">

                ${registros
                    .map(
                        registro =>
                            this.cardsHelper
                                .crearTarjetaProduccion(
                                    registro
                                )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-produccion"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormulario(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-produccion"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarProduccion(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminarProduccion(
        id
    ) {

        const registro =
            this.produccionService
                .obtenerPorId(
                    id
                );


        if (
            !registro
        ) {

            alert(
                "No se ha encontrado el registro de producción."
            );

            return;

        }


        const reservado =
            this.stockHelper
                .obtenerCantidadReservada(
                    registro.id
                );


        const entregado =
            this.stockHelper
                .obtenerCantidadEntregada(
                    registro.id
                );


        const utilizado =
            reservado
            +
            entregado;


        if (
            utilizado >
            0
        ) {

            let mensaje =
                "No puedes eliminar esta producción porque tiene";


            if (
                reservado >
                0
            ) {

                mensaje +=
                    ` ${formatearNumero(
                        reservado
                    )} ${registro.unidad || "kg"} reservados`;

            }


            if (
                reservado >
                0
                &&
                entregado >
                0
            ) {

                mensaje +=
                    " y";

            }


            if (
                entregado >
                0
            ) {

                mensaje +=
                    ` ${formatearNumero(
                        entregado
                    )} ${registro.unidad || "kg"} entregados`;

            }


            mensaje +=
                " en albaranes.";


            alert(
                mensaje
            );

            return;

        }


        if (
            !confirm(
                "¿Quieres eliminar este registro de producción?"
            )
        ) {

            return;

        }


        const resultado =
            this.produccionService
                .eliminar(
                    registro.id
                );


        if (
            !resultado.ok
        ) {

            alert(
                resultado.mensaje
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        id = null
    ) {

        this.formHelper
            .mostrarFormulario(
                id
            );

    }

}