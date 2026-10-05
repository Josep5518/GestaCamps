import {

    escaparHTML,

    formatearFecha,

    formatearNumero,

    formatearDinero,

    obtenerFechaHoy

} from "./utils.js";


import {

    crearAlbaranesCardsHelper

} from "./albaranes/albaranesCards.js";


import {

    crearAlbaranesLineasHelper

} from "./albaranes/albaranesLineas.js";


import {

    crearAlbaranesFormHelper

} from "./albaranes/albaranesForm.js";



export class AlbaranesView {

    constructor(
        mainContent,
        fincaService,
        produccionService,
        albaranService,
        clienteProveedorService
    ) {

        this.mainContent =
            mainContent;


        this.albaranService =
            albaranService;


        // =================================================
        // LÍNEAS
        // =================================================

        this.lineasHelper =
            crearAlbaranesLineasHelper({

                albaranService,

                produccionService,

                escapar:
                    escaparHTML,

                formatearNumero,

                formatearDinero

            });


        // =================================================
        // TARJETAS
        // =================================================

        this.cardsHelper =
            crearAlbaranesCardsHelper({

                obtenerLineasAlbaran:
                    albaran =>
                        this.lineasHelper
                            .obtenerLineasAlbaran(
                                albaran
                            ),

                escapar:
                    escaparHTML,

                formatearFecha,

                formatearNumero,

                formatearDinero

            });


        // =================================================
        // FORMULARIO
        // =================================================

        this.formHelper =
            crearAlbaranesFormHelper({

                mainContent,

                albaranService,

                lineasHelper:
                    this.lineasHelper,

                escapar:
                    escaparHTML,

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

        const albaranes =
            this.obtenerAlbaranes();


        const borradores =
            albaranes.filter(
                albaran =>
                    albaran.estado ===
                    "Borrador"
            ).length;


        const pendientes =
            albaranes.filter(
                albaran =>
                    albaran.estado ===
                    "Pendiente"
            ).length;


        const entregados =
            albaranes.filter(
                albaran =>
                    albaran.estado ===
                    "Entregado"
            ).length;


        const facturados =
            albaranes.filter(
                albaran =>
                    albaran.facturado ===
                    true
                    ||
                    albaran.estado ===
                    "Facturado"
            ).length;


        const cancelados =
            albaranes.filter(
                albaran =>
                    albaran.estado ===
                    "Cancelado"
            ).length;


        const importeTotal =
            albaranes
                .filter(
                    albaran =>
                        albaran.estado !==
                        "Cancelado"
                )
                .reduce(
                    (
                        suma,
                        albaran
                    ) =>
                        suma
                        +
                        Number(
                            albaran.total
                            ||
                            0
                        ),
                    0
                );


        this.mainContent.innerHTML = `

            <div class="albaranes-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="albaranes-hero">

                    <div class="albaranes-hero-content">

                        <span class="albaranes-eyebrow">
                            🧾 COMERCIAL Y FINANZAS
                        </span>


                        <h1>
                            Del almacén,
                            <span>
                                hasta el cliente.
                            </span>
                        </h1>


                        <p>
                            Gestiona reservas, salidas y entregas
                            de producción manteniendo siempre
                            el stock y la trazabilidad bajo control.
                        </p>


                        <button
                            id="nuevoAlbaran"
                            class="
                                primary-button
                                albaranes-hero-button
                            "
                            type="button"
                        >
                            + Nuevo albarán
                        </button>

                    </div>


                    <div class="albaranes-hero-image">

                        <div class="albaranes-hero-badge">

                            <span>
                                Importe gestionado
                            </span>


                            <strong>
                                ${formatearDinero(
                                    importeTotal
                                )}
                            </strong>

                        </div>


                        <div class="albaranes-hero-copy">

                            <small>
                                RESERVA · ENTREGA · FACTURA
                            </small>


                            <strong>
                                Cada salida,<br>
                                perfectamente trazada
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats albaranes-stats">

                    ${this.crearTarjetaEstadistica(
                        "📝",
                        "Borradores",
                        borradores
                    )}


                    ${this.crearTarjetaEstadistica(
                        "🕒",
                        "Pendientes",
                        pendientes
                    )}


                    ${this.crearTarjetaEstadistica(
                        "🚚",
                        "Entregados",
                        entregados
                    )}


                    ${this.crearTarjetaEstadistica(
                        "💶",
                        "Facturados",
                        facturados
                    )}

                </section>


                <!-- ==========================================
                     CONTROL STOCK
                =========================================== -->

                <section class="albaranes-stock-guide">

                    <div class="albaranes-stock-guide-title">

                        <span>
                            📦
                        </span>


                        <div>

                            <strong>
                                Control automático de stock
                            </strong>


                            <p>
                                El estado del albarán determina
                                cómo afecta a la producción disponible.
                            </p>

                        </div>

                    </div>


                    <div class="albaranes-stock-guide-items">

                        <span class="draft">
                            <i></i>
                            Borrador · no reserva
                        </span>


                        <span class="pending">
                            <i></i>
                            Pendiente · reserva
                        </span>


                        <span class="delivered">
                            <i></i>
                            Entregado · consume
                        </span>


                        <span class="invoiced">
                            <i></i>
                            Facturado · mantiene
                        </span>


                        <span class="cancelled">
                            <i></i>
                            Cancelado · libera
                        </span>

                    </div>

                </section>


                <!-- ==========================================
                     CABECERA LISTADO
                =========================================== -->

                <div class="albaranes-section-header">

                    <div>

                        <span class="albaranes-section-eyebrow">
                            DOCUMENTOS DE SALIDA
                        </span>


                        <h2>
                            Albaranes
                        </h2>


                        <p>
                            Consulta clientes, productos, cantidades,
                            importes y estado de cada entrega.
                        </p>

                    </div>


                    <div class="albaranes-summary">

                        <span>
                            ${albaranes.length}
                            ${
                                albaranes.length ===
                                1
                                    ? "albarán"
                                    : "albaranes"
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
                            cancelados >
                            0

                                ? `

                                    <span class="neutral">
                                        ${cancelados} cancelados
                                    </span>

                                `

                                : ""
                        }

                    </div>

                </div>


                <div id="listaAlbaranes"></div>

            </div>

        `;


        document
            .getElementById(
                "nuevoAlbaran"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
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
                        )}
                    </h3>

                </div>

            </article>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const albaranes =
            this.obtenerAlbaranes()
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
                    "listaAlbaranes"
                );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            albaranes.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="albaranes-empty">

                    <div class="albaranes-empty-icon">
                        🧾
                    </div>


                    <h3>
                        Todavía no tienes albaranes
                    </h3>


                    <p>
                        Crea el primer albarán de salida
                        para empezar a gestionar reservas
                        y entregas de producción.
                    </p>


                    <button
                        id="crearPrimerAlbaran"
                        class="primary-button"
                        type="button"
                    >
                        + Crear albarán
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimerAlbaran"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormulario()
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="albaranes-grid">

                ${albaranes
                    .map(
                        albaran =>
                            this.cardsHelper
                                .crearTarjetaAlbaran(
                                    albaran
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
                ".editar-albaran"
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
                ".eliminar-albaran"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarAlbaran(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".estado-albaran"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstadoAlbaran(
                                boton.dataset.id,
                                boton.dataset.estado
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminarAlbaran(
        id
    ) {

        const albaran =
            this.albaranService
                .obtenerPorId(
                    id
                );


        if (
            !albaran
        ) {

            return;

        }


        if (
            !confirm(
                `¿Eliminar ${albaran.numero}?`
            )
        ) {

            return;

        }


        const resultado =
            this.albaranService
                .eliminar(
                    id
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido eliminar el albarán."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstadoAlbaran(
        id,
        estado
    ) {

        if (
            estado ===
            "Cancelado"
        ) {

            if (
                !confirm(
                    "¿Cancelar este albarán? La producción reservada quedará disponible de nuevo."
                )
            ) {

                return;

            }

        }


        const resultado =
            this.albaranService
                .cambiarEstado(
                    id,
                    estado
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido cambiar el estado del albarán."
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
    // DATOS
    // =====================================================

    obtenerAlbaranes() {

        const albaranes =
            this.albaranService
                ?.obtenerTodos?.();


        return Array.isArray(
            albaranes
        )
            ? albaranes
            : [];

    }

}