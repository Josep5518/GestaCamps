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


        this.fincaService =
            fincaService;


        this.produccionService =
            produccionService;


        this.campaniaService =
            campaniaService;


        this.cultivoService =
            cultivoService;


        this.albaranService =
            albaranService;


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
            this.obtenerRegistros();


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


        const fincas =
            new Set(
                registros
                    .map(
                        registro =>
                            registro.fincaId
                    )
                    .filter(Boolean)
            )
                .size;


        this.mainContent.innerHTML = `

            <div class="produccion-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="produccion-hero">

                    <div class="produccion-hero-content">

                        <span class="produccion-eyebrow">
                            🍎 RECURSOS Y PRODUCCIÓN
                        </span>


                        <h1>
                            Del campo,
                            <span>
                                a cada kilo.
                            </span>
                        </h1>


                        <p>
                            Registra cada recolección y controla
                            en tiempo real qué producción está disponible,
                            reservada o ya entregada.
                        </p>


                        <button
                            id="nuevaProduccion"
                            class="
                                primary-button
                                produccion-hero-button
                            "
                            type="button"
                        >
                            + Nueva producción
                        </button>

                    </div>


                    <div class="produccion-hero-image">

                        <div class="produccion-hero-badge">

                            <span>
                                Disponible
                            </span>


                            <strong>
                                ${formatearNumero(
                                    totalDisponible
                                )} kg
                            </strong>

                        </div>


                        <div class="produccion-hero-copy">

                            <small>
                                RECOLECTA · CONTROLA · ENTREGA
                            </small>


                            <strong>
                                Cada cosecha,<br>
                                convertida en datos
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats produccion-stats">

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


                <!-- ==========================================
                     ESTADO STOCK
                =========================================== -->

                <section class="produccion-stock-legend">

                    <div class="produccion-stock-legend-title">

                        <span>
                            📊
                        </span>


                        <div>

                            <strong>
                                Estado del stock
                            </strong>


                            <p>
                                El stock cambia automáticamente
                                según el estado de los albaranes.
                            </p>

                        </div>

                    </div>


                    <div class="produccion-stock-legend-items">

                        <span class="reservado">

                            <i></i>

                            Pendiente = reservado

                        </span>


                        <span class="entregado">

                            <i></i>

                            Entregado / Facturado = entregado

                        </span>


                        <span class="neutro">

                            <i></i>

                            Borrador / Cancelado = no afecta

                        </span>

                    </div>

                </section>


                <!-- ==========================================
                     CABECERA LISTADO
                =========================================== -->

                <div class="produccion-section-header">

                    <div>

                        <span class="produccion-section-eyebrow">
                            REGISTROS DE PRODUCCIÓN
                        </span>


                        <h2>
                            Cosechas registradas
                        </h2>


                        <p>
                            Consulta la trazabilidad y disponibilidad
                            de cada registro.
                        </p>

                    </div>


                    <div class="produccion-summary">

                        <span>
                            ${registros.length}
                            ${
                                registros.length ===
                                1
                                    ? "registro"
                                    : "registros"
                            }
                        </span>


                        <span>
                            ${fincas}
                            ${
                                fincas ===
                                1
                                    ? "finca"
                                    : "fincas"
                            }
                        </span>

                    </div>

                </div>


                <div id="listaProduccion"></div>

            </div>

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

            <article class="card">

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

            </article>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {


        const registros =
            this.obtenerRegistros()
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) => {

                        const fechaA =
                            new Date(
                                a.fecha
                                ||
                                0
                            )
                                .getTime();


                        const fechaB =
                            new Date(
                                b.fecha
                                ||
                                0
                            )
                                .getTime();


                        return (
                            fechaB
                            -
                            fechaA
                        );

                    }
                );


        const contenedor =
            document
                .getElementById(
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

                <div class="produccion-empty">

                    <div class="produccion-empty-icon">
                        🍎
                    </div>


                    <h3>
                        Todavía no hay producción registrada
                    </h3>


                    <p>
                        Registra tu primera cosecha para comenzar
                        a controlar kilos, reservas y entregas.
                    </p>


                    <button
                        id="crearPrimeraProduccion"
                        class="primary-button"
                        type="button"
                    >
                        + Registrar producción
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimeraProduccion"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormulario()
                );


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
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido eliminar el registro."
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


    // =====================================================
    // REGISTROS
    // =====================================================

    obtenerRegistros() {


        if (
            typeof this.produccionService
                ?.obtenerTodos !==
            "function"
        ) {

            return [];

        }


        const registros =
            this.produccionService
                .obtenerTodos();


        return Array.isArray(
            registros
        )
            ? registros
            : [];

    }

}