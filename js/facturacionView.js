import {
    escaparHTML,
    formatearDinero
} from "./utils.js";

import {
    crearFacturacionCardsHelper
} from "./facturacion/facturacionCards.js";

import {
    crearFacturacionDetalleHelper
} from "./facturacion/facturacionDetalle.js";

import {
    crearFacturacionFormHelper
} from "./facturacion/facturacionForm.js";


export class FacturacionView {

    constructor(
        mainContent,
        facturaService,
        albaranService,
        explotacionService,
        clienteProveedorService
    ) {

        this.mainContent = mainContent;

        this.facturaService = facturaService;
        this.albaranService = albaranService;
        this.explotacionService = explotacionService;
        this.clienteProveedorService = clienteProveedorService;


        // =================================================
        // TARJETAS
        // =================================================

        this.cardsHelper =
            crearFacturacionCardsHelper({

                obtenerBaseFactura:
                    factura =>
                        this.obtenerBaseFactura(
                            factura
                        ),

                obtenerImporteIvaFactura:
                    factura =>
                        this.obtenerImporteIvaFactura(
                            factura
                        ),

                obtenerPorcentajeIva:
                    factura =>
                        this.obtenerPorcentajeIva(
                            factura
                        ),

                obtenerTotalFactura:
                    factura =>
                        this.obtenerTotalFactura(
                            factura
                        ),

                obtenerAlbaranesFactura:
                    factura =>
                        this.obtenerAlbaranesFactura(
                            factura
                        ),

                obtenerLineasAlbaran:
                    albaran =>
                        this.obtenerLineasAlbaran(
                            albaran
                        ),

                obtenerCampanyasFactura:
                    factura =>
                        this.obtenerCampanyasFactura(
                            factura
                        )

            });


        // =================================================
        // DETALLE
        // =================================================

        this.detalleHelper =
            crearFacturacionDetalleHelper({

                mainContent,

                facturaService,

                obtenerAlbaranesFactura:
                    factura =>
                        this.obtenerAlbaranesFactura(
                            factura
                        ),

                obtenerExplotacion:
                    () =>
                        this.obtenerExplotacion(),

                obtenerClienteFactura:
                    factura =>
                        this.obtenerClienteFactura(
                            factura
                        ),

                obtenerNifCliente:
                    (
                        factura,
                        cliente
                    ) =>
                        this.obtenerNifCliente(
                            factura,
                            cliente
                        ),

                obtenerBaseFactura:
                    factura =>
                        this.obtenerBaseFactura(
                            factura
                        ),

                obtenerPorcentajeIva:
                    factura =>
                        this.obtenerPorcentajeIva(
                            factura
                        ),

                obtenerImporteIvaFactura:
                    factura =>
                        this.obtenerImporteIvaFactura(
                            factura
                        ),

                obtenerTotalFactura:
                    factura =>
                        this.obtenerTotalFactura(
                            factura
                        ),

                obtenerLineasAlbaran:
                    albaran =>
                        this.obtenerLineasAlbaran(
                            albaran
                        ),

                crearEtiquetaEstado:
                    estado =>
                        this.cardsHelper
                            .crearEtiquetaEstado(
                                estado
                            ),

                onVolver:
                    () =>
                        this.mostrar()

            });


        // =================================================
        // FORMULARIO
        // =================================================

        this.formHelper =
            crearFacturacionFormHelper({

                mainContent,

                facturaService,

                obtenerAlbaranes:
                    () =>
                        this.obtenerAlbaranes(),

                onVolver:
                    () =>
                        this.mostrar()

            });

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const facturas =
            this.obtenerFacturas();


        const pendientes =
            facturas.filter(
                factura =>
                    factura.estado ===
                    "Pendiente"
            ).length;


        const parciales =
            facturas.filter(
                factura =>
                    factura.estado ===
                    "Parcialmente cobrada"
            ).length;


        const cobradas =
            facturas.filter(
                factura =>
                    factura.estado ===
                    "Cobrada"
            ).length;


        const anuladas =
            facturas.filter(
                factura =>
                    factura.estado ===
                    "Anulada"
            ).length;


        const totalFacturado =
            facturas
                .filter(
                    factura =>
                        factura.estado !==
                        "Anulada"
                )
                .reduce(
                    (
                        total,
                        factura
                    ) =>
                        total
                        +
                        this.obtenerTotalFactura(
                            factura
                        ),
                    0
                );


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Facturación
                    </h2>

                    <p>
                        Genera facturas a partir de albaranes entregados
                    </p>

                </div>


                <button
                    id="nuevaFactura"
                    type="button"
                    class="primary-button"
                >
                    + Nueva factura
                </button>

            </header>


            <section class="stats">

                ${this.crearTarjetaResumen(
                    "💶",
                    "Facturas",
                    facturas.length
                )}

                ${this.crearTarjetaResumen(
                    "🕒",
                    "Pendientes",
                    pendientes
                )}

                ${this.crearTarjetaResumen(
                    "◐",
                    "Parciales",
                    parciales
                )}

                ${this.crearTarjetaResumen(
                    "✅",
                    "Cobradas",
                    cobradas
                )}

            </section>


            <section
                class="stats"
                style="margin-top:14px;"
            >

                ${this.crearTarjetaResumen(
                    "💰",
                    "Total facturado",
                    formatearDinero(
                        totalFacturado
                    )
                )}

                ${
                    anuladas > 0

                        ? this.crearTarjetaResumen(
                            "🚫",
                            "Anuladas",
                            anuladas
                        )

                        : ""
                }

            </section>


            <div id="listaFacturas"></div>

        `;


        document
            .getElementById(
                "nuevaFactura"
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

    crearTarjetaResumen(
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

        const facturas =
            this.obtenerFacturas()
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
                "listaFacturas"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            facturas.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        💶
                    </div>

                    <h3>
                        Todavía no tienes facturas
                    </h3>

                    <p>
                        Genera tu primera factura a partir de un albarán entregado.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="facturas-grid">

                ${facturas
                    .map(
                        factura =>
                            this.cardsHelper
                                .crearTarjetaFactura(
                                    factura
                                )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventosLista();

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventosLista() {

        document
            .querySelectorAll(
                ".ver-factura"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarDetalle(
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
                ".anular-factura"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.anularFactura(
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
                ".eliminar-factura"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarFactura(
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
    // ANULAR
    // =====================================================

    anularFactura(
        id
    ) {

        if (
            !confirm(
                "¿Quieres anular esta factura? Sus albaranes volverán a estado Entregado."
            )
        ) {

            return;

        }


        const resultado =
            this.facturaService
                .anular(
                    id
                );


        if (
            resultado?.ok ===
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
    // ELIMINAR
    // =====================================================

    eliminarFactura(
        id
    ) {

        if (
            !confirm(
                "¿Quieres eliminar esta factura? Si está activa, sus albaranes volverán a Entregado."
            )
        ) {

            return;

        }


        const resultado =
            this.facturaService
                .eliminar(
                    id
                );


        if (
            resultado?.ok ===
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

    mostrarFormulario() {

        this.formHelper
            .mostrarFormulario();

    }


    // =====================================================
    // DETALLE
    // =====================================================

    mostrarDetalle(
        id
    ) {

        this.detalleHelper
            .mostrarDetalle(
                id
            );

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
    // ALBARANES
    // =====================================================

    obtenerAlbaranes() {

        if (
            typeof
            this.albaranService
                ?.obtenerTodos ===
            "function"
        ) {

            const datos =
                this.albaranService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.albaranService
                ?.obtenerTodas ===
            "function"
        ) {

            const datos =
                this.albaranService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    obtenerAlbaranesFactura(
        factura
    ) {

        const ids =
            Array.isArray(
                factura?.albaranesIds
            )
                ? factura.albaranesIds
                : [];


        return ids
            .map(
                id =>
                    this.obtenerAlbaranes()
                        .find(
                            albaran =>
                                String(
                                    albaran.id
                                )
                                ===
                                String(
                                    id
                                )
                        )
            )
            .filter(
                Boolean
            );

    }


    // =====================================================
    // LÍNEAS ALBARÁN
    // =====================================================

    obtenerLineasAlbaran(
        albaran
    ) {

        if (
            Array.isArray(
                albaran?.lineas
            )
            &&
            albaran.lineas.length >
            0
        ) {

            return albaran.lineas;

        }


        if (
            !albaran
        ) {

            return [];

        }


        return [
            {

                produccionId:
                    albaran.produccionId,

                fincaId:
                    albaran.fincaId,

                fincaNombre:
                    albaran.fincaNombre,

                parcela:
                    albaran.parcela,

                producto:
                    albaran.producto,

                variedad:
                    albaran.variedad,

                campaniaId:
                    albaran.campaniaId,

                campaniaNombre:
                    albaran.campaniaNombre,

                cantidad:
                    albaran.cantidad,

                unidad:
                    albaran.unidad,

                precio:
                    albaran.precio,

                total:
                    albaran.total

            }
        ];

    }


    // =====================================================
    // CAMPANYAS DE FACTURA
    // =====================================================

    obtenerCampanyasFactura(
        factura
    ) {

        const campanyas =
            [];


        this.obtenerAlbaranesFactura(
            factura
        )
            .forEach(
                albaran => {

                    this.obtenerLineasAlbaran(
                        albaran
                    )
                        .forEach(
                            linea => {

                                if (
                                    linea.campaniaNombre
                                ) {

                                    campanyas.push(
                                        linea.campaniaNombre
                                    );

                                }

                            }
                        );

                }
            );


        return [
            ...new Set(
                campanyas
            )
        ];

    }


    // =====================================================
    // EXPLOTACIÓN
    // =====================================================

    obtenerExplotacion() {

        if (
            typeof
            this.explotacionService
                ?.obtener ===
            "function"
        ) {

            return (
                this.explotacionService
                    .obtener()
                ||
                {}
            );

        }


        if (
            typeof
            this.explotacionService
                ?.obtenerDatos ===
            "function"
        ) {

            return (
                this.explotacionService
                    .obtenerDatos()
                ||
                {}
            );

        }


        return {};

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
    // CLIENTE FACTURA
    // =====================================================

    obtenerClienteFactura(
        factura
    ) {

        const contactos =
            this.obtenerContactos();


        // =================================================
        // CLIENTE ID DE FACTURA
        // =================================================

        if (
            factura?.clienteId
        ) {

            const contacto =
                contactos.find(
                    item =>
                        String(
                            item.id
                        )
                        ===
                        String(
                            factura.clienteId
                        )
                );


            if (
                contacto
            ) {

                return contacto;

            }

        }


        const albaranes =
            this.obtenerAlbaranesFactura(
                factura
            );


        // =================================================
        // CLIENTE ID DE ALBARÁN
        // =================================================

        for (
            const albaran
            of
            albaranes
        ) {

            if (
                !albaran.clienteId
            ) {

                continue;

            }


            const contacto =
                contactos.find(
                    item =>
                        String(
                            item.id
                        )
                        ===
                        String(
                            albaran.clienteId
                        )
                );


            if (
                contacto
            ) {

                return contacto;

            }

        }


        // =================================================
        // NOMBRE DE FACTURA
        // =================================================

        const nombreFactura =
            String(
                factura?.clienteNombre
                ||
                factura?.cliente
                ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            nombreFactura
        ) {

            const contacto =
                contactos.find(
                    item =>
                        String(
                            item.nombre
                            ||
                            ""
                        )
                            .trim()
                            .toLowerCase()
                        ===
                        nombreFactura
                );


            if (
                contacto
            ) {

                return contacto;

            }

        }


        // =================================================
        // NOMBRE DE ALBARÁN
        // =================================================

        for (
            const albaran
            of
            albaranes
        ) {

            const nombreAlbaran =
                String(
                    albaran.clienteNombre
                    ||
                    albaran.cliente
                    ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            if (
                !nombreAlbaran
            ) {

                continue;

            }


            const contacto =
                contactos.find(
                    item =>
                        String(
                            item.nombre
                            ||
                            ""
                        )
                            .trim()
                            .toLowerCase()
                        ===
                        nombreAlbaran
                );


            if (
                contacto
            ) {

                return contacto;

            }

        }


        // =================================================
        // COMPATIBILIDAD: UN ÚNICO CLIENTE
        // =================================================

        const clientes =
            contactos.filter(
                contacto =>
                    String(
                        contacto.tipo
                        ||
                        ""
                    )
                        .toLowerCase()
                    ===
                    "cliente"
            );


        return clientes.length ===
            1
                ? clientes[0]
                : null;

    }


    // =====================================================
    // NIF CLIENTE
    // =====================================================

    obtenerNifCliente(
        factura,
        cliente = null
    ) {

        const contacto =
            cliente
            ||
            this.obtenerClienteFactura(
                factura
            );


        return (
            contacto?.nif
            ||
            contacto?.nifCif
            ||
            contacto?.cif
            ||
            factura?.clienteNif
            ||
            factura?.nifCliente
            ||
            "NIF/CIF no disponible"
        );

    }


    // =====================================================
    // BASE IMPONIBLE
    // =====================================================

    obtenerBaseFactura(
        factura
    ) {

        if (
            factura?.baseImponible !==
            undefined
        ) {

            return Number(
                factura.baseImponible
                ||
                0
            );

        }


        if (
            factura?.subtotal !==
            undefined
        ) {

            return Number(
                factura.subtotal
                ||
                0
            );

        }


        if (
            factura?.base !==
            undefined
        ) {

            return Number(
                factura.base
                ||
                0
            );

        }


        return this.obtenerAlbaranesFactura(
            factura
        )
            .reduce(
                (
                    total,
                    albaran
                ) =>
                    total
                    +
                    Number(
                        albaran.total
                        ||
                        0
                    ),
                0
            );

    }


    // =====================================================
    // IVA
    // =====================================================

    obtenerPorcentajeIva(
        factura
    ) {

        if (
            factura?.porcentajeIva !==
            undefined
        ) {

            return Number(
                factura.porcentajeIva
                ||
                0
            );

        }


        const iva =
            Number(
                factura?.iva
                ??
                21
            );


        return (
            iva >= 0
            &&
            iva <= 100
        )
            ? iva
            : 21;

    }


    obtenerImporteIvaFactura(
        factura
    ) {

        if (
            factura?.importeIva !==
            undefined
        ) {

            return Number(
                factura.importeIva
                ||
                0
            );

        }


        return (
            this.obtenerBaseFactura(
                factura
            )
            *
            (
                this.obtenerPorcentajeIva(
                    factura
                )
                /
                100
            )
        );

    }


    // =====================================================
    // TOTAL FACTURA
    // =====================================================

    obtenerTotalFactura(
        factura
    ) {

        if (
            factura?.total !==
            undefined
        ) {

            return Number(
                factura.total
                ||
                0
            );

        }


        if (
            factura?.totalFactura !==
            undefined
        ) {

            return Number(
                factura.totalFactura
                ||
                0
            );

        }


        return (
            this.obtenerBaseFactura(
                factura
            )
            +
            this.obtenerImporteIvaFactura(
                factura
            )
        );

    }

}