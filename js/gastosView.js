import {
    escaparHTML,
    formatearDinero
} from "./utils.js";

import {
    crearGastosCardsHelper
} from "./gastos/gastosCards.js";

import {
    crearGastosFormHelper
} from "./gastos/gastosForm.js";


export class GastosView {

    constructor(
        mainContent,
        gastoService,
        fincaService,
        maquinariaService,
        clienteProveedorService,
        campaniaService
    ) {

        this.mainContent =
            mainContent;

        this.gastoService =
            gastoService;

        this.fincaService =
            fincaService;

        this.maquinariaService =
            maquinariaService;

        this.clienteProveedorService =
            clienteProveedorService;

        this.campaniaService =
            campaniaService;


        // =================================================
        // TARJETAS
        // =================================================

        this.cardsHelper =
            crearGastosCardsHelper({

                obtenerIconoCategoria:
                    categoria =>
                        this.obtenerIconoCategoria(
                            categoria
                        )

            });


        // =================================================
        // FORMULARIO
        // =================================================

        this.formHelper =
            crearGastosFormHelper({

                mainContent,

                gastoService,

                obtenerFincas:
                    () =>
                        this.obtenerFincas(),

                obtenerMaquinaria:
                    () =>
                        this.obtenerMaquinaria(),

                obtenerContactos:
                    () =>
                        this.obtenerContactos(),

                obtenerCampanyas:
                    () =>
                        this.obtenerCampanyas(),

                onVolver:
                    () =>
                        this.mostrar()

            });

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const gastos =
            this.gastoService
                .obtenerTodos();


        const total =
            gastos.reduce(
                (
                    suma,
                    gasto
                ) =>
                    suma
                    +
                    Number(
                        gasto.importe
                        ||
                        0
                    ),
                0
            );


        const pagado =
            gastos.reduce(
                (
                    suma,
                    gasto
                ) =>
                    suma
                    +
                    Number(
                        gasto.pagadoAcumulado
                        ||
                        0
                    ),
                0
            );


        const pendiente =
            gastos.reduce(
                (
                    suma,
                    gasto
                ) =>
                    suma
                    +
                    Number(
                        gasto.pendientePago
                        ??
                        gasto.importe
                        ??
                        0
                    ),
                0
            );


        const parciales =
            gastos.filter(
                gasto =>
                    gasto.estado ===
                    "Parcialmente pagado"
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Gastos
                    </h2>

                    <p>
                        Controla los gastos y sus pagos
                    </p>

                </div>


                <button
                    id="nuevoGasto"
                    class="primary-button"
                    type="button"
                >
                    + Nuevo gasto
                </button>

            </header>


            <section class="stats">

                ${this.crearTarjeta(
                    "💸",
                    "Gastos",
                    gastos.length
                )}

                ${this.crearTarjeta(
                    "💰",
                    "Total",
                    formatearDinero(
                        total
                    )
                )}

                ${this.crearTarjeta(
                    "✅",
                    "Pagado",
                    formatearDinero(
                        pagado
                    )
                )}

                ${this.crearTarjeta(
                    "🕒",
                    "Pendiente",
                    formatearDinero(
                        pendiente
                    )
                )}

            </section>


            ${
                parciales >
                0

                    ? `
                        <div
                            style="
                                display:inline-block;
                                margin:18px 0 4px;
                                padding:8px 12px;
                                border-radius:999px;
                                background:#eaf1fb;
                                color:#3d5d91;
                                font-size:12px;
                                font-weight:600;
                            "
                        >

                            ◐

                            ${parciales}

                            ${
                                parciales ===
                                1

                                    ? "gasto parcialmente pagado"
                                    : "gastos parcialmente pagados"
                            }

                        </div>
                    `

                    : ""
            }


            <div id="listaGastos"></div>

        `;


        document
            .getElementById(
                "nuevoGasto"
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
    // TARJETA RESUMEN
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
                        ${escaparHTML(
                            titulo
                        )}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const gastos =
            this.gastoService
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
                "listaGastos"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            gastos.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        💸
                    </div>

                    <h3>
                        Todavía no tienes gastos
                    </h3>

                    <p>
                        Registra tu primer gasto de explotación.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="gastos-grid">

                ${gastos
                    .map(
                        gasto =>
                            this.cardsHelper
                                .crearTarjetaGasto(
                                    gasto
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
                ".editar-gasto"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormulario(
                                Number(
                                    boton.dataset.id
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-gasto"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarGasto(
                                Number(
                                    boton.dataset.id
                                )
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminarGasto(
        id
    ) {

        const gasto =
            this.gastoService
                .obtenerPorId(
                    id
                );


        if (
            !gasto
        ) {

            return;

        }


        if (
            !confirm(
                `¿Quieres eliminar el gasto "${gasto.concepto}"?`
            )
        ) {

            return;

        }


        const resultado =
            this.gastoService
                .eliminar(
                    id
                );


        if (
            resultado
            &&
            resultado.ok ===
            false
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
    // MAQUINARIA
    // =====================================================

    obtenerMaquinaria() {

        if (
            typeof
            this.maquinariaService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.maquinariaService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.maquinariaService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.maquinariaService
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
    // CONTACTOS
    // =====================================================

    obtenerContactos() {

        if (
            typeof
            this.clienteProveedorService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.clienteProveedorService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.clienteProveedorService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.clienteProveedorService
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
    // FINCAS
    // =====================================================

    obtenerFincas() {

        if (
            typeof
            this.fincaService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.fincaService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.fincaService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.fincaService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // CAMPANYAS
    // =====================================================

    obtenerCampanyas() {

        if (
            typeof
            this.campaniaService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.campaniaService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.campaniaService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.campaniaService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // ICONOS
    // =====================================================

    obtenerIconoCategoria(
        categoria
    ) {

        const iconos = {

            Combustible:
                "⛽",

            Fitosanitarios:
                "🧪",

            Fertilizantes:
                "🌱",

            "Semillas y plantas":
                "🌾",

            Maquinaria:
                "🚜",

            Mantenimiento:
                "🔧",

            Personal:
                "👷",

            Agua:
                "💧",

            Electricidad:
                "⚡",

            Transporte:
                "🚚",

            Servicios:
                "🧾",

            Otros:
                "💸"

        };


        return (
            iconos[
                categoria
            ]
            ||
            "💸"
        );

    }

}