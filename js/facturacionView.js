export class FacturacionView {

    constructor(
        mainContent,
        facturaService,
        albaranService,
        explotacionService,
        clienteProveedorService
    ) {

        this.mainContent =
            mainContent;

        this.facturaService =
            facturaService;

        this.albaranService =
            albaranService;

        this.explotacionService =
            explotacionService;

        this.clienteProveedorService =
            clienteProveedorService;

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
                style="
                    margin-top:14px;
                "
            >

                ${this.crearTarjetaResumen(
                    "💰",
                    "Total facturado",
                    this.formatearDinero(
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
            .addEventListener(
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
                        ${titulo}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // OBTENER FACTURAS
    // =====================================================

    obtenerFacturas() {

        if (
            this.facturaService
            &&
            typeof
            this.facturaService
                .obtenerTodos ===
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
            this.facturaService
            &&
            typeof
            this.facturaService
                .obtenerTodas ===
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
                            this.crearTarjetaFactura(
                                factura
                            )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventosLista();

    }


    // =====================================================
    // TARJETA FACTURA
    // =====================================================

    crearTarjetaFactura(
        factura
    ) {

        const base =
            this.obtenerBaseFactura(
                factura
            );


        const iva =
            this.obtenerImporteIvaFactura(
                factura
            );


        const porcentajeIva =
            this.obtenerPorcentajeIva(
                factura
            );


        const total =
            this.obtenerTotalFactura(
                factura
            );


        const albaranes =
            this.obtenerAlbaranesFactura(
                factura
            );


        const lineas =
            albaranes.reduce(
                (
                    totalLineas,
                    albaran
                ) =>
                    totalLineas
                    +
                    this.obtenerLineasAlbaran(
                        albaran
                    ).length,
                0
            );


        const campanyas =
            this.obtenerCampanyasFactura(
                factura
            );


        const anulada =
            factura.estado ===
            "Anulada";


        return `

            <article class="factura-card">

                <div class="factura-card-header">

                    <span class="factura-icon">
                        💶
                    </span>


                    <button
                        type="button"
                        class="
                            delete-button
                            eliminar-factura
                        "
                        data-id="${factura.id}"
                    >
                        ×
                    </button>

                </div>


                <h3>
                    ${this.escapar(
                        factura.numero
                    )}
                </h3>


                <p>
                    👤
                    <strong>
                        ${this.escapar(
                            factura.clienteNombre
                            ||
                            factura.cliente
                            ||
                            "Sin cliente"
                        )}
                    </strong>
                </p>


                <p>
                    🗓️
                    ${this.formatearFecha(
                        factura.fecha
                    )}
                </p>


                <div>

                    ${campanyas
                        .map(
                            campanya => `

                                <span
                                    style="
                                        display:inline-block;
                                        background:#edf6f1;
                                        color:#176044;
                                        border-radius:999px;
                                        padding:6px 10px;
                                        margin:3px 4px 8px 0;
                                        font-size:12px;
                                        font-weight:600;
                                    "
                                >
                                    📅
                                    ${this.escapar(
                                        campanya
                                    )}
                                </span>

                            `
                        )
                        .join("")}

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(2,minmax(0,1fr));
                        gap:8px;
                        margin:8px 0;
                    "
                >

                    <div
                        style="
                            background:#f5f7f5;
                            border-radius:10px;
                            padding:12px;
                        "
                    >

                        <span
                            style="
                                display:block;
                                color:#78837d;
                                font-size:12px;
                            "
                        >
                            Albaranes incluidos
                        </span>

                        <strong>
                            ${albaranes.length}
                        </strong>

                    </div>


                    <div
                        style="
                            background:#f5f7f5;
                            border-radius:10px;
                            padding:12px;
                        "
                    >

                        <span
                            style="
                                display:block;
                                color:#78837d;
                                font-size:12px;
                            "
                        >
                            Líneas
                        </span>

                        <strong>
                            ${lineas}
                        </strong>

                    </div>

                </div>


                <div class="factura-info-grid">

                    <div>

                        <span>
                            Base imponible
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                base
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            IVA (${this.formatearNumero(
                                porcentajeIva
                            )}%)
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                iva
                            )}
                        </strong>

                    </div>

                </div>


                <div class="factura-total">

                    <span>
                        Total factura
                    </span>

                    <strong>
                        ${this.formatearDinero(
                            total
                        )}
                    </strong>

                </div>


                <div
                    style="
                        margin-top:12px;
                    "
                >

                    ${this.crearEtiquetaEstado(
                        factura.estado
                    )}

                </div>


                <div
                    style="
                        display:flex;
                        gap:8px;
                        flex-wrap:wrap;
                        margin-top:12px;
                    "
                >

                    ${
                        !anulada

                            ? `
                                <button
                                    type="button"
                                    class="
                                        task-state-button
                                        anular-factura
                                    "
                                    data-id="${factura.id}"
                                >
                                    🚫 Anular
                                </button>
                            `

                            : ""
                    }


                    <button
                        type="button"
                        class="
                            secondary-button
                            ver-factura
                        "
                        data-id="${factura.id}"
                    >
                        Ver detalle
                    </button>

                </div>

            </article>

        `;

    }


    // =====================================================
    // ESTADOS
    // =====================================================

    crearEtiquetaEstado(
        estado
    ) {

        const estilos = {

            Pendiente:
                "background:#fff3d8;color:#855d00;",

            "Parcialmente cobrada":
                "background:#eaf1fb;color:#3d5d91;",

            Cobrada:
                "background:#e7f5ed;color:#176044;",

            Anulada:
                "background:#f7e9e9;color:#994444;"

        };


        const iconos = {

            Pendiente:
                "🕒",

            "Parcialmente cobrada":
                "◐",

            Cobrada:
                "✅",

            Anulada:
                "🚫"

        };


        return `

            <span
                style="
                    ${estilos[estado] || estilos.Pendiente}
                    display:inline-block;
                    padding:6px 10px;
                    border-radius:20px;
                    font-size:12px;
                    font-weight:600;
                "
            >
                ${iconos[estado] || "🕒"}

                ${this.escapar(
                    estado
                    ||
                    "Pendiente"
                )}
            </span>

        `;

    }


    // =====================================================
    // EVENTOS LISTA
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
                                        Number(
                                            boton.dataset.id
                                        )
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
                                        Number(
                                            boton.dataset.id
                                        )
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
                    );

                }
            );

    }


    // =====================================================
    // DETALLE
    // =====================================================

    mostrarDetalle(id) {

        const factura =
            this.facturaService
                .obtenerPorId(
                    id
                );


        if (
            !factura
        ) {

            return;

        }


        const albaranes =
            this.obtenerAlbaranesFactura(
                factura
            );


        const explotacion =
            this.obtenerExplotacion();


        const cliente =
            this.obtenerClienteFactura(
                factura
            );


        const base =
            this.obtenerBaseFactura(
                factura
            );


        const porcentajeIva =
            this.obtenerPorcentajeIva(
                factura
            );


        const importeIva =
            this.obtenerImporteIvaFactura(
                factura
            );


        const total =
            this.obtenerTotalFactura(
                factura
            );


        const mostrarMarca =
            explotacion
                .mostrarMarcaGestaCamps ===
            true;


        this.mainContent.innerHTML = `

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:18px;
                    gap:15px;
                "
            >

                <button
                    id="volverFacturas"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <div
                    style="
                        display:flex;
                        gap:8px;
                    "
                >

                    <button
                        id="imprimirFactura"
                        class="secondary-button"
                        type="button"
                    >
                        🖨 Imprimir
                    </button>


                    <button
                        id="descargarFactura"
                        class="primary-button"
                        type="button"
                    >
                        📄 Descargar PDF
                    </button>

                </div>

            </div>


            <article
                id="facturaImprimible"
                class="factura-documento"
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:20px;
                    "
                >

                    <div>

                        <span
                            style="
                                color:#78837d;
                            "
                        >
                            FACTURA
                        </span>

                        <h1
                            style="
                                margin:3px 0;
                            "
                        >
                            ${this.escapar(
                                factura.numero
                            )}
                        </h1>

                        <p>
                            Fecha:
                            ${this.formatearFecha(
                                factura.fecha
                            )}
                        </p>

                    </div>


                    ${this.crearEtiquetaEstado(
                        factura.estado
                    )}

                </div>


                <hr>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(2,minmax(0,1fr));
                        gap:30px;
                        margin:24px 0;
                    "
                >

                    <div>

                        <span>
                            EMISOR
                        </span>

                        <h3>
                            ${this.escapar(
                                explotacion.nombre
                                ||
                                explotacion.nombreExplotacion
                                ||
                                "GestaCamps"
                            )}
                        </h3>

                        <p>
                            ${this.escapar(
                                explotacion.nifCif
                                ||
                                explotacion.nif
                                ||
                                "NIF/CIF sin configurar"
                            )}
                        </p>


                        ${
                            explotacion.direccion

                                ? `
                                    <p>
                                        ${this.escapar(
                                            explotacion.direccion
                                        )}
                                    </p>
                                `

                                : ""
                        }


                        <p>
                            ${this.escapar(
                                [
                                    explotacion.localidad,
                                    explotacion.provincia
                                ]
                                    .filter(Boolean)
                                    .join(
                                        " · "
                                    )
                            )}
                        </p>


                        ${
                            explotacion.pais

                                ? `
                                    <p>
                                        ${this.escapar(
                                            explotacion.pais
                                        )}
                                    </p>
                                `

                                : ""
                        }

                    </div>


                    <div>

                        <span>
                            CLIENTE
                        </span>

                        <h3>
                            ${this.escapar(
                                factura.clienteNombre
                                ||
                                factura.cliente
                                ||
                                cliente?.nombre
                                ||
                                "Sin cliente"
                            )}
                        </h3>

                        <p>
                            ${this.escapar(
                                this.obtenerNifCliente(
                                    factura,
                                    cliente
                                )
                            )}
                        </p>


                        ${
                            cliente?.direccion

                                ? `
                                    <p>
                                        ${this.escapar(
                                            cliente.direccion
                                        )}
                                    </p>
                                `

                                : ""
                        }


                        <p>
                            ${this.escapar(
                                [
                                    cliente?.localidad,
                                    cliente?.provincia
                                ]
                                    .filter(Boolean)
                                    .join(
                                        " · "
                                    )
                            )}
                        </p>


                        ${
                            cliente?.pais

                                ? `
                                    <p>
                                        ${this.escapar(
                                            cliente.pais
                                        )}
                                    </p>
                                `

                                : ""
                        }

                    </div>

                </div>


                <h3>
                    Albaranes incluidos
                </h3>


                ${albaranes
                    .map(
                        albaran =>
                            this.crearDetalleAlbaran(
                                albaran
                            )
                    )
                    .join("")}


                <div
                    style="
                        max-width:420px;
                        margin-left:auto;
                        margin-top:24px;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            margin-bottom:10px;
                        "
                    >

                        <span>
                            Base imponible
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                base
                            )}
                        </strong>

                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            margin-bottom:10px;
                        "
                    >

                        <span>
                            IVA (${this.formatearNumero(
                                porcentajeIva
                            )}%)
                        </span>

                        <strong>
                            ${this.formatearDinero(
                                importeIva
                            )}
                        </strong>

                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            border-top:1px solid #176044;
                            padding-top:12px;
                            font-size:18px;
                        "
                    >

                        <span>
                            TOTAL
                        </span>

                        <strong
                            style="
                                color:#176044;
                            "
                        >
                            ${this.formatearDinero(
                                total
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    mostrarMarca

                        ? `
                            <div
                                class="factura-footer"
                                style="
                                    margin-top:45px;
                                    padding-top:16px;
                                    border-top:1px solid #edf0ed;
                                    text-align:center;
                                    color:#8a928e;
                                    font-size:11px;
                                "
                            >
                                Generado con GestaCamps
                            </div>
                        `

                        : ""
                }

            </article>

        `;


        document
            .getElementById(
                "volverFacturas"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "imprimirFactura"
            )
            .addEventListener(
                "click",
                () => {

                    window.print();

                }
            );


        document
            .getElementById(
                "descargarFactura"
            )
            .addEventListener(
                "click",
                () => {

                    window.print();

                }
            );

    }


    // =====================================================
    // DETALLE ALBARÁN
    // =====================================================

    crearDetalleAlbaran(
        albaran
    ) {

        const lineas =
            this.obtenerLineasAlbaran(
                albaran
            );


        return `

            <div
                style="
                    margin-bottom:18px;
                    border:1px solid #edf0ed;
                    border-radius:10px;
                    overflow:hidden;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        padding:12px 14px;
                        background:#f5f7f5;
                    "
                >

                    <strong>
                        ${this.escapar(
                            albaran.numero
                        )}
                    </strong>

                    <span>
                        ${this.formatearFecha(
                            albaran.fecha
                        )}
                    </span>

                </div>


                ${lineas
                    .map(
                        linea => `

                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                        2fr 1fr 1fr 1fr;
                                    gap:12px;
                                    align-items:center;
                                    padding:13px 14px;
                                    border-top:1px solid #edf0ed;
                                "
                            >

                                <div>

                                    <strong>
                                        ${this.escapar(
                                            [
                                                linea.producto,
                                                linea.variedad
                                            ]
                                                .filter(Boolean)
                                                .join(
                                                    " · "
                                                )
                                        )}
                                    </strong>

                                    <div
                                        style="
                                            color:#78837d;
                                            font-size:12px;
                                            margin-top:3px;
                                        "
                                    >

                                        ${this.escapar(
                                            [
                                                linea.fincaNombre,
                                                linea.parcela
                                            ]
                                                .filter(Boolean)
                                                .join(
                                                    " · "
                                                )
                                        )}

                                        ${
                                            linea.campaniaNombre

                                                ? `
                                                    ·
                                                    ${this.escapar(
                                                        linea.campaniaNombre
                                                    )}
                                                `

                                                : ""
                                        }

                                    </div>

                                </div>


                                <div>

                                    ${this.formatearNumero(
                                        linea.cantidad
                                    )}

                                    ${this.escapar(
                                        linea.unidad
                                        ||
                                        "kg"
                                    )}

                                </div>


                                <div>

                                    ${this.formatearNumero(
                                        linea.precio
                                    )}

                                    € /

                                    ${this.escapar(
                                        linea.unidad
                                        ||
                                        "kg"
                                    )}

                                </div>


                                <strong
                                    style="
                                        text-align:right;
                                    "
                                >

                                    ${this.formatearDinero(
                                        linea.total
                                        ??
                                        (
                                            Number(
                                                linea.cantidad
                                                ||
                                                0
                                            )
                                            *
                                            Number(
                                                linea.precio
                                                ||
                                                0
                                            )
                                        )
                                    )}

                                </strong>

                            </div>

                        `
                    )
                    .join("")}


                <div
                    style="
                        display:flex;
                        justify-content:flex-end;
                        padding:11px 14px;
                        background:#fafbfa;
                    "
                >

                    <strong>
                        Total albarán:
                        ${this.formatearDinero(
                            albaran.total
                        )}
                    </strong>

                </div>

            </div>

        `;

    }


    // =====================================================
    // NUEVA FACTURA
    // =====================================================

    mostrarFormulario() {

        const albaranes =
            this.obtenerAlbaranes()
                .filter(
                    albaran =>
                        albaran.estado ===
                        "Entregado"
                        &&
                        albaran.facturado !==
                        true
                );


        if (
            albaranes.length ===
            0
        ) {

            alert(
                "No hay albaranes Entregados pendientes de facturar."
            );

            return;

        }


        this.mainContent.innerHTML = `

            <button
                id="volverNuevaFactura"
                type="button"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        Nueva factura
                    </h2>

                    <p>
                        Solo aparecen albaranes con estado Entregado
                    </p>

                </div>

            </header>


            <div class="form-panel">

                <div
                    style="
                        background:#edf6f1;
                        color:#315f4d;
                        padding:12px 14px;
                        border-radius:10px;
                        margin-bottom:18px;
                        font-size:13px;
                    "
                >
                    🚚 Los albaranes Borrador, Pendiente,
                    Cancelado o ya Facturado no pueden incluirse
                    en una factura.
                </div>


                <div class="form-group">

                    <label>
                        Fecha *
                    </label>

                    <input
                        id="fechaFactura"
                        type="date"
                        value="${this.obtenerFechaHoy()}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        IVA (%)
                    </label>

                    <input
                        id="ivaFactura"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value="21"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Albaranes entregados *
                    </label>


                    ${albaranes
                        .map(
                            albaran => `

                                <label
                                    style="
                                        display:flex;
                                        align-items:center;
                                        justify-content:space-between;
                                        gap:15px;
                                        background:#f5f7f5;
                                        padding:12px;
                                        margin-bottom:10px;
                                        border-radius:10px;
                                        cursor:pointer;
                                    "
                                >

                                    <div>

                                        <input
                                            type="checkbox"
                                            class="albaran-factura-check"
                                            value="${albaran.id}"
                                        >

                                        <strong>
                                            ${this.escapar(
                                                albaran.numero
                                            )}
                                        </strong>

                                        ·

                                        ${this.escapar(
                                            albaran.clienteNombre
                                            ||
                                            albaran.cliente
                                            ||
                                            "Sin cliente"
                                        )}


                                        ${
                                            albaran.campaniaNombre

                                                ? `
                                                    · 📅
                                                    ${this.escapar(
                                                        albaran.campaniaNombre
                                                    )}
                                                `

                                                : ""
                                        }

                                    </div>


                                    <strong>
                                        ${this.formatearDinero(
                                            albaran.total
                                        )}
                                    </strong>

                                </label>

                            `
                        )
                        .join("")}

                </div>


                <div
                    style="
                        display:flex;
                        justify-content:flex-end;
                        margin:15px 0;
                    "
                >

                    <div
                        style="
                            background:#edf6f1;
                            border-radius:10px;
                            padding:14px;
                            min-width:280px;
                        "
                    >

                        <span
                            style="
                                display:block;
                                font-size:12px;
                                color:#78837d;
                            "
                        >
                            Base seleccionada
                        </span>

                        <strong
                            id="baseSeleccionadaFactura"
                            style="
                                font-size:20px;
                                color:#176044;
                            "
                        >
                            0,00 €
                        </strong>

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Observaciones
                    </label>

                    <textarea
                        id="observacionesFactura"
                        rows="4"
                        placeholder="Observaciones..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarFactura"
                        type="button"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarFactura"
                        type="button"
                        class="primary-button"
                    >
                        Crear factura
                    </button>

                </div>

            </div>

        `;


        const actualizarBase =
            () => {

                const ids =
                    this.obtenerIdsSeleccionados();


                const base =
                    albaranes
                        .filter(
                            albaran =>
                                ids.includes(
                                    Number(
                                        albaran.id
                                    )
                                )
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


                document
                    .getElementById(
                        "baseSeleccionadaFactura"
                    )
                    .textContent =
                    this.formatearDinero(
                        base
                    );

            };


        document
            .querySelectorAll(
                ".albaran-factura-check"
            )
            .forEach(
                checkbox => {

                    checkbox.addEventListener(
                        "change",
                        actualizarBase
                    );

                }
            );


        document
            .getElementById(
                "volverNuevaFactura"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarFactura"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "guardarFactura"
            )
            .addEventListener(
                "click",
                () => {

                    const ids =
                        this.obtenerIdsSeleccionados();


                    if (
                        ids.length ===
                        0
                    ) {

                        alert(
                            "Selecciona al menos un albarán."
                        );

                        return;

                    }


                    const resultado =
                        this.facturaService
                            .crear(
                                {

                                    fecha:
                                        document
                                            .getElementById(
                                                "fechaFactura"
                                            )
                                            .value,

                                    albaranesIds:
                                        ids,

                                    iva:
                                        Number(
                                            document
                                                .getElementById(
                                                    "ivaFactura"
                                                )
                                                .value
                                        ),

                                    observaciones:
                                        document
                                            .getElementById(
                                                "observacionesFactura"
                                            )
                                            .value

                                }
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
                            "No se ha podido crear la factura."
                        );

                        return;

                    }


                    this.mostrar();

                }
            );

    }


    // =====================================================
    // IDS SELECCIONADOS
    // =====================================================

    obtenerIdsSeleccionados() {

        return Array.from(
            document.querySelectorAll(
                ".albaran-factura-check:checked"
            )
        )
            .map(
                input =>
                    Number(
                        input.value
                    )
            );

    }


    // =====================================================
    // ALBARANES
    // =====================================================

    obtenerAlbaranes() {

        if (
            this.albaranService
            &&
            typeof
            this.albaranService
                .obtenerTodos ===
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
            this.albaranService
            &&
            typeof
            this.albaranService
                .obtenerTodas ===
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

        const todos =
            this.obtenerAlbaranes();


        const ids =
            Array.isArray(
                factura.albaranesIds
            )

                ? factura.albaranesIds

                : [];


        return ids
            .map(
                id =>
                    todos.find(
                        albaran =>
                            Number(
                                albaran.id
                            )
                            ===
                            Number(
                                id
                            )
                    )
            )
            .filter(Boolean);

    }


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
            albaran
        ) {

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


        return [];

    }


    // =====================================================
    // CAMPANYAS
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
            this.explotacionService
            &&
            typeof
            this.explotacionService
                .obtener ===
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
            this.explotacionService
            &&
            typeof
            this.explotacionService
                .obtenerDatos ===
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
            this.clienteProveedorService
            &&
            typeof
            this.clienteProveedorService
                .obtenerTodos ===
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
            this.clienteProveedorService
            &&
            typeof
            this.clienteProveedorService
                .obtenerTodas ===
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


        // 1. CLIENTE DE LA FACTURA

        if (
            factura.clienteId
        ) {

            const porId =
                contactos.find(
                    contacto =>
                        Number(
                            contacto.id
                        )
                        ===
                        Number(
                            factura.clienteId
                        )
                );


            if (
                porId
            ) {

                return porId;

            }

        }


        // 2. CLIENTE DE LOS ALBARANES

        const albaranes =
            this.obtenerAlbaranesFactura(
                factura
            );


        for (
            const albaran
            of
            albaranes
        ) {

            if (
                albaran.clienteId
            ) {

                const porAlbaran =
                    contactos.find(
                        contacto =>
                            Number(
                                contacto.id
                            )
                            ===
                            Number(
                                albaran.clienteId
                            )
                    );


                if (
                    porAlbaran
                ) {

                    return porAlbaran;

                }

            }

        }


        // 3. BUSCAR POR NOMBRE FACTURA

        const nombreFactura =
            String(
                factura.clienteNombre
                ||
                factura.cliente
                ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            nombreFactura
        ) {

            const porNombre =
                contactos.find(
                    contacto =>
                        String(
                            contacto.nombre
                            ||
                            ""
                        )
                            .trim()
                            .toLowerCase()
                        ===
                        nombreFactura
                );


            if (
                porNombre
            ) {

                return porNombre;

            }

        }


        // 4. BUSCAR POR NOMBRE ALBARÁN

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


        // 5. RESPALDO SI SOLO HAY UN CLIENTE

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


        if (
            clientes.length ===
            1
        ) {

            return clientes[0];

        }


        return null;

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
            factura.clienteNif
            ||
            factura.nifCliente
            ||
            "NIF/CIF no disponible"
        );

    }


    // =====================================================
    // BASE
    // =====================================================

    obtenerBaseFactura(
        factura
    ) {

        if (
            factura.baseImponible !==
            undefined
        ) {

            return Number(
                factura.baseImponible
                ||
                0
            );

        }


        if (
            factura.subtotal !==
            undefined
        ) {

            return Number(
                factura.subtotal
                ||
                0
            );

        }


        if (
            factura.base !==
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
            factura.porcentajeIva !==
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
                factura.iva
                ??
                21
            );


        if (
            iva >=
            0
            &&
            iva <=
            100
        ) {

            return iva;

        }


        return 21;

    }


    obtenerImporteIvaFactura(
        factura
    ) {

        if (
            factura.importeIva !==
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
            factura.total !==
            undefined
        ) {

            return Number(
                factura.total
                ||
                0
            );

        }


        if (
            factura.totalFactura !==
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


    // =====================================================
    // FECHA HOY
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        return [
            fecha.getFullYear(),

            String(
                fecha.getMonth() +
                1
            )
                .padStart(
                    2,
                    "0"
                ),

            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                )

        ]
            .join(
                "-"
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

            return fecha;

        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );

    }


    // =====================================================
    // NÚMEROS
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
    // DINERO
    // =====================================================

    formatearDinero(
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
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )
            +
            " €";

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