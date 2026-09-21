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

                albaranService:
                    this.albaranService,

                mismoId:
                    (idA, idB) =>
                        this.mismoId(
                            idA,
                            idB
                        )

            });


        // =================================================
        // TARJETAS
        // =================================================

        this.cardsHelper =
            crearProduccionCardsHelper({

                stockHelper:
                    this.stockHelper,

                escapar:
                    valor =>
                        this.escapar(
                            valor
                        ),

                formatearNumero:
                    numero =>
                        this.formatearNumero(
                            numero
                        ),

                formatearFecha:
                    fecha =>
                        this.formatearFecha(
                            fecha
                        )

            });


        // =================================================
        // FORMULARIO
        // =================================================

        this.formHelper =
            crearProduccionFormHelper({

                mainContent:
                    this.mainContent,

                produccionService:
                    this.produccionService,

                cultivoService:
                    this.cultivoService,

                stockHelper:
                    this.stockHelper,

                mismoId:
                    (idA, idB) =>
                        this.mismoId(
                            idA,
                            idB
                        ),

                escapar:
                    valor =>
                        this.escapar(
                            valor
                        ),

                formatearNumero:
                    numero =>
                        this.formatearNumero(
                            numero
                        ),

                obtenerFechaHoy:
                    () =>
                        this.obtenerFechaHoy(),

                onVolver:
                    () =>
                        this.mostrar()

            });

    }


    // =====================================================
    // COMPARAR IDS
    // =====================================================

    mismoId(
        idA,
        idB
    ) {

        if (
            idA === null
            ||
            idA === undefined
            ||
            idB === null
            ||
            idB === undefined
        ) {

            return false;

        }


        return (
            String(
                idA
            )
            ===
            String(
                idB
            )
        );

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
                    this.obtenerCantidadReservada(
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
                    this.obtenerCantidadEntregada(
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
                    this.obtenerCantidadDisponible(
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
                        ${this.escapar(
                            titulo
                        )}
                    </p>

                    <h3>
                        ${this.formatearNumero(
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
    // STOCK
    // =====================================================

    obtenerCantidadReservada(
        produccionId
    ) {

        return this.stockHelper
            .obtenerCantidadReservada(
                produccionId
            );

    }


    obtenerCantidadEntregada(
        produccionId
    ) {

        return this.stockHelper
            .obtenerCantidadEntregada(
                produccionId
            );

    }


    obtenerCantidadUtilizada(
        produccionId
    ) {

        return this.stockHelper
            .obtenerCantidadUtilizada(
                produccionId
            );

    }


    obtenerCantidadDisponible(
        registro
    ) {

        return this.stockHelper
            .obtenerCantidadDisponible(
                registro
            );

    }


    // =====================================================
    // EVENTOS LISTADO
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-produccion"
            )
            .forEach(
                button => {

                    button
                        .addEventListener(
                            "click",
                            () => {

                                const id =
                                    button.dataset.id;


                                this.mostrarFormulario(
                                    id
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
                button => {

                    button
                        .addEventListener(
                            "click",
                            () => {

                                const id =
                                    button.dataset.id;


                                this.eliminarProduccion(
                                    id
                                );

                            }
                        );

                }
            );

    }


    // =====================================================
    // ELIMINAR PRODUCCIÓN
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
            this.obtenerCantidadReservada(
                registro.id
            );


        const entregado =
            this.obtenerCantidadEntregada(
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
                    ` ${this.formatearNumero(
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
                    ` ${this.formatearNumero(
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


    // =====================================================
    // FECHA HOY
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        const year =
            fecha.getFullYear();


        const month =
            String(
                fecha.getMonth()
                +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const day =
            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${year}-${month}-${day}`
        );

    }


    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

    formatearFecha(
        fecha
    ) {

        if (
            !fecha
        ) {

            return "—";

        }


        const partes =
            String(
                fecha
            )
                .split(
                    "-"
                );


        if (
            partes.length !==
            3
        ) {

            return String(
                fecha
            );

        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );

    }


    // =====================================================
    // NÚMERO
    // =====================================================

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

                    maximumFractionDigits:
                        2

                }
            );

    }


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

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