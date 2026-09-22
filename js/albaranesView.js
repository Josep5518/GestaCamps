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
            this.albaranService
                .obtenerTodos();


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


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Albaranes
                    </h2>

                    <p>
                        Gestiona reservas, salidas y entregas de producción
                    </p>

                </div>


                <button
                    id="nuevoAlbaran"
                    type="button"
                    class="primary-button"
                >
                    + Nuevo albarán
                </button>

            </header>


            <section class="stats">

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
                    Control de stock:
                </strong>

                Borrador no reserva ·
                Pendiente reserva ·
                Entregado consume ·
                Facturado mantiene ·
                Cancelado libera.

            </div>


            <div id="listaAlbaranes"></div>

        `;


        document
            .getElementById(
                "nuevoAlbaran"
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
                        )}
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const albaranes =
            this.albaranService
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

                <div class="empty-state">

                    <div class="empty-icon">
                        🧾
                    </div>

                    <h3>
                        Todavía no tienes albaranes
                    </h3>

                    <p>
                        Crea el primer albarán de salida de producción.
                    </p>

                </div>

            `;

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