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
            this.obtenerGastos();


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


        const pagados =
            gastos.filter(
                gasto =>
                    gasto.estado ===
                    "Pagado"
            ).length;


        const pendientes =
            gastos.filter(
                gasto =>
                    gasto.estado ===
                    "Pendiente"
            ).length;


        const categorias =
            new Set(
                gastos
                    .map(
                        gasto =>
                            gasto.categoria
                    )
                    .filter(Boolean)
            ).size;


        this.mainContent.innerHTML = `

            <div class="gastos-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="gastos-hero">

                    <div class="gastos-hero-content">

                        <span class="gastos-eyebrow">
                            💸 COMERCIAL Y FINANZAS
                        </span>


                        <h1>
                            Controla el coste,
                            <span>
                                protege el margen.
                            </span>
                        </h1>


                        <p>
                            Registra cada gasto de la explotación
                            y conoce en todo momento cuánto has pagado,
                            qué queda pendiente y dónde se está yendo el dinero.
                        </p>


                        <button
                            id="nuevoGasto"
                            class="
                                primary-button
                                gastos-hero-button
                            "
                            type="button"
                        >
                            + Nuevo gasto
                        </button>

                    </div>


                    <div class="gastos-hero-image">

                        <div class="gastos-hero-badge">

                            <span>
                                Gasto acumulado
                            </span>


                            <strong>
                                ${formatearDinero(
                                    total
                                )}
                            </strong>

                        </div>


                        <div class="gastos-hero-copy">

                            <small>
                                REGISTRA · ANALIZA · CONTROLA
                            </small>


                            <strong>
                                Cada coste,<br>
                                perfectamente localizado
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats gastos-stats">

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


                <!-- ==========================================
                     RESUMEN
                =========================================== -->

                <section class="gastos-overview">

                    <div>

                        <span>
                            ✅
                        </span>


                        <div>

                            <small>
                                PAGADOS
                            </small>


                            <strong>
                                ${pagados}
                            </strong>

                        </div>

                    </div>


                    <div>

                        <span>
                            ◐
                        </span>


                        <div>

                            <small>
                                PARCIALES
                            </small>


                            <strong>
                                ${parciales}
                            </strong>

                        </div>

                    </div>


                    <div>

                        <span>
                            🕒
                        </span>


                        <div>

                            <small>
                                PENDIENTES
                            </small>


                            <strong>
                                ${pendientes}
                            </strong>

                        </div>

                    </div>


                    <div>

                        <span>
                            🗂️
                        </span>


                        <div>

                            <small>
                                CATEGORÍAS
                            </small>


                            <strong>
                                ${categorias}
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <div class="gastos-section-header">

                    <div>

                        <span class="gastos-section-eyebrow">
                            COSTES DE EXPLOTACIÓN
                        </span>


                        <h2>
                            Gastos registrados
                        </h2>


                        <p>
                            Consulta importe, pagos, proveedor,
                            finca, campaña y categoría de cada gasto.
                        </p>

                    </div>


                    <div class="gastos-summary">

                        <span>
                            ${gastos.length}
                            ${
                                gastos.length ===
                                1
                                    ? "gasto"
                                    : "gastos"
                            }
                        </span>


                        ${
                            pendientes >
                            0

                                ? `
                                    <span class="warning">
                                        ${pendientes} pendientes
                                    </span>
                                `

                                : ""
                        }


                        ${
                            parciales >
                            0

                                ? `
                                    <span class="partial">
                                        ${parciales} parciales
                                    </span>
                                `

                                : ""
                        }

                    </div>

                </div>


                <div id="listaGastos"></div>

            </div>

        `;


        document
            .getElementById(
                "nuevoGasto"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
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
                        ${valor}
                    </h3>

                </div>

            </article>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const gastos =
            this.obtenerGastos()
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
                            fechaB -
                            fechaA
                        );

                    }
                );


        const contenedor =
            document
                .getElementById(
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

                <div class="gastos-empty">

                    <div class="gastos-empty-icon">
                        💸
                    </div>


                    <h3>
                        Todavía no tienes gastos
                    </h3>


                    <p>
                        Registra tu primer gasto para empezar
                        a controlar los costes de la explotación.
                    </p>


                    <button
                        id="crearPrimerGasto"
                        class="primary-button"
                        type="button"
                    >
                        + Registrar gasto
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimerGasto"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormulario()
                );


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
                                boton.dataset.id
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
                ||
                "No se ha podido eliminar el gasto."
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