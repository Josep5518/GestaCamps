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

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        /*
         * Sincronizamos antes de pintar.
         */

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

                ${this.crearTarjeta(
                    "💰",
                    "Cobrado",
                    this.formatearDinero(
                        cobrado
                    )
                )}

                ${this.crearTarjeta(
                    "📥",
                    "Pendiente de cobro",
                    this.formatearDinero(
                        pendienteCobro
                    )
                )}

                ${this.crearTarjeta(
                    "💸",
                    "Pagado",
                    this.formatearDinero(
                        pagado
                    )
                )}

                ${this.crearTarjeta(
                    "📤",
                    "Pendiente de pago",
                    this.formatearDinero(
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


                ${this.crearListaFacturasPendientes()}

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


                    ${this.crearListaGastosPendientes()}

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

                        ${this.crearFilaResumen(
                            "Entradas",
                            cobrado,
                            "💰"
                        )}

                        ${this.crearFilaResumen(
                            "Salidas",
                            pagado,
                            "💸"
                        )}

                        ${this.crearFilaResumen(
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
                                                this.crearMovimientoHTML(
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
            .addEventListener(
                "click",
                () => {

                    this.mostrarFormularioCobro();

                }
            );


        document
            .getElementById(
                "nuevoPago"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrarFormularioPago();

                }
            );


        this.configurarEventos();

    }


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
                        ${titulo}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    crearFilaResumen(
        titulo,
        importe,
        icono,
        destacado = false
    ) {

        return `

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:12px 14px;
                    border-radius:10px;
                    background:${
                        destacado
                            ? "#e8f5ed"
                            : "#f5f7f5"
                    };
                "
            >

                <span>
                    ${icono}
                    ${titulo}
                </span>

                <strong
                    style="
                        ${
                            destacado
                                ? "color:#176044;"
                                : ""
                        }
                    "
                >
                    ${this.formatearDinero(
                        importe
                    )}
                </strong>

            </div>

        `;

    }


    // =====================================================
    // FACTURAS
    // =====================================================

    obtenerFacturas() {

        if (
            typeof
            this.facturaService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.facturaService
                    .obtenerTodos()
                ||
                []
            );

        }


        return (
            this.facturaService
                .obtenerTodas()
            ||
            []
        );

    }


    crearListaFacturasPendientes() {

        const facturas =
            this.obtenerFacturas()
                .filter(
                    factura =>
                        factura.estado !==
                        "Anulada"
                        &&
                        this.cobroPagoService
                            .obtenerPendienteFactura(
                                factura.id
                            )
                        >
                        0.001
                );


        if (
            facturas.length ===
            0
        ) {

            return `

                <div
                    style="
                        padding:18px;
                        text-align:center;
                        color:#68756f;
                    "
                >
                    ✅ No hay facturas pendientes de cobro.
                </div>

            `;

        }


        return `

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(340px,1fr)
                        );
                    gap:14px;
                    margin-top:12px;
                "
            >

                ${facturas
                    .map(
                        factura =>
                            this.crearTarjetaFacturaPendiente(
                                factura
                            )
                    )
                    .join("")}

            </div>

        `;

    }


    crearTarjetaFacturaPendiente(
        factura
    ) {

        const total =
            this.cobroPagoService
                .obtenerTotalFactura(
                    factura
                );


        const cobrado =
            this.cobroPagoService
                .obtenerCobradoFactura(
                    factura.id
                );


        const pendiente =
            this.cobroPagoService
                .obtenerPendienteFactura(
                    factura.id
                );


        const estado =
            this.cobroPagoService
                .obtenerEstadoCobroFactura(
                    factura.id
                );


        const porcentaje =
            total >
            0

                ? Math.min(
                    100,
                    Math.max(
                        0,
                        (
                            cobrado /
                            total
                        )
                        *
                        100
                    )
                )

                : 0;


        return `

            <article
                style="
                    background:#fff;
                    border:1px solid #edf0ed;
                    border-radius:12px;
                    padding:16px;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:15px;
                        align-items:flex-start;
                    "
                >

                    <div>

                        <strong
                            style="
                                font-size:15px;
                            "
                        >
                            ${this.escapar(
                                factura.numero
                            )}
                        </strong>

                        <p
                            style="
                                margin:6px 0 0;
                                color:#68756f;
                            "
                        >
                            👤
                            ${this.escapar(
                                factura.clienteNombre
                                ||
                                factura.cliente
                                ||
                                "Sin cliente"
                            )}
                        </p>

                    </div>


                    ${this.crearEstadoFactura(
                        estado
                    )}

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(3,minmax(0,1fr));
                        gap:8px;
                        margin-top:15px;
                    "
                >

                    ${this.crearMiniDato(
                        "Total",
                        total
                    )}

                    ${this.crearMiniDato(
                        "Cobrado",
                        cobrado
                    )}

                    ${this.crearMiniDato(
                        "Pendiente",
                        pendiente,
                        true
                    )}

                </div>


                <div
                    style="
                        height:8px;
                        border-radius:999px;
                        background:#edf0ed;
                        overflow:hidden;
                        margin-top:14px;
                    "
                >

                    <div
                        style="
                            height:100%;
                            width:${porcentaje}%;
                            background:#26795d;
                            border-radius:999px;
                        "
                    ></div>

                </div>


                <div
                    style="
                        margin-top:6px;
                        color:#78837d;
                        font-size:11px;
                        text-align:right;
                    "
                >
                    ${this.formatearNumero(
                        porcentaje
                    )}% cobrado
                </div>


                <button
                    type="button"
                    class="
                        primary-button
                        cobrar-factura-directo
                    "
                    data-id="${factura.id}"
                    style="
                        margin-top:12px;
                        width:100%;
                    "
                >
                    + Registrar cobro
                </button>

            </article>

        `;

    }


    crearMiniDato(
        titulo,
        importe,
        destacar = false
    ) {

        return `

            <div
                style="
                    padding:10px;
                    border-radius:9px;
                    background:${
                        destacar
                            ? "#fff4dc"
                            : "#f5f7f5"
                    };
                "
            >

                <span
                    style="
                        display:block;
                        font-size:11px;
                        color:#78837d;
                    "
                >
                    ${titulo}
                </span>

                <strong
                    style="
                        display:block;
                        margin-top:3px;
                    "
                >
                    ${this.formatearDinero(
                        importe
                    )}
                </strong>

            </div>

        `;

    }


    crearEstadoFactura(
        estado
    ) {

        const datos = {

            Pendiente: {
                icono:
                    "🕒",

                fondo:
                    "#fff3d8",

                color:
                    "#855d00"
            },

            "Parcialmente cobrada": {
                icono:
                    "◐",

                fondo:
                    "#eaf1fb",

                color:
                    "#3d5d91"
            },

            Cobrada: {
                icono:
                    "✅",

                fondo:
                    "#e7f5ed",

                color:
                    "#176044"
            },

            Anulada: {
                icono:
                    "🚫",

                fondo:
                    "#f7e9e9",

                color:
                    "#994444"
            }

        };


        const estilo =
            datos[
                estado
            ]
            ||
            datos.Pendiente;


        return `

            <span
                style="
                    padding:6px 10px;
                    border-radius:999px;
                    font-size:11px;
                    font-weight:600;
                    background:${estilo.fondo};
                    color:${estilo.color};
                    white-space:nowrap;
                "
            >
                ${estilo.icono}
                ${this.escapar(
                    estado
                )}
            </span>

        `;

    }


    // =====================================================
    // GASTOS
    // =====================================================

    obtenerGastos() {

        if (
            typeof
            this.gastoService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.gastoService
                    .obtenerTodos()
                ||
                []
            );

        }


        if (
            typeof
            this.gastoService
                .obtenerTodas ===
            "function"
        ) {

            return (
                this.gastoService
                    .obtenerTodas()
                ||
                []
            );

        }


        return [];

    }


    crearListaGastosPendientes() {

        const gastos =
            this.obtenerGastos()
                .filter(
                    gasto =>
                        this.cobroPagoService
                            .obtenerPendienteGasto(
                                gasto.id
                            )
                        >
                        0.001
                );


        if (
            gastos.length ===
            0
        ) {

            return `
                <p>
                    No hay gastos pendientes de pago.
                </p>
            `;

        }


        return gastos
            .map(
                gasto => `

                    <div class="task">

                        <div>

                            <strong>
                                ${this.escapar(
                                    gasto.concepto
                                )}
                            </strong>

                            <p>
                                ${this.escapar(
                                    gasto.proveedor
                                    ||
                                    "Sin proveedor"
                                )}
                            </p>

                        </div>


                        <strong>
                            ${this.formatearDinero(
                                this.cobroPagoService
                                    .obtenerPendienteGasto(
                                        gasto.id
                                    )
                            )}
                        </strong>

                    </div>

                `
            )
            .join("");

    }


    // =====================================================
    // MOVIMIENTO
    // =====================================================

    crearMovimientoHTML(
        movimiento
    ) {

        return `

            <div class="movimiento-item">

                <div class="movimiento-main">

                    <span class="movimiento-icon">

                        ${
                            movimiento.tipo ===
                            "Cobro"

                                ? "💰"

                                : "💸"
                        }

                    </span>


                    <div>

                        <strong>
                            ${this.escapar(
                                movimiento.tipo
                            )}
                            ·
                            ${this.escapar(
                                movimiento.referencia
                            )}
                        </strong>

                        <p>

                            ${this.escapar(
                                movimiento.tercero
                                ||
                                "Sin tercero"
                            )}

                            ·

                            ${this.formatearFecha(
                                movimiento.fecha
                            )}

                            ·

                            ${this.escapar(
                                movimiento.metodo
                                ||
                                "Sin método"
                            )}

                        </p>


                        ${
                            movimiento.referenciaPago

                                ? `
                                    <p
                                        style="
                                            margin-top:3px;
                                            font-size:11px;
                                            color:#78837d;
                                        "
                                    >
                                        Ref:
                                        ${this.escapar(
                                            movimiento.referenciaPago
                                        )}
                                    </p>
                                `

                                : ""
                        }

                    </div>

                </div>


                <div class="movimiento-right">

                    <strong
                        class="${
                            movimiento.tipo ===
                            "Cobro"

                                ? "movimiento-cobro"

                                : "movimiento-pago"
                        }"
                    >

                        ${
                            movimiento.tipo ===
                            "Cobro"

                                ? "+"

                                : "-"
                        }

                        ${this.formatearDinero(
                            movimiento.importe
                        )}

                    </strong>


                    <button
                        type="button"
                        class="
                            delete-button
                            eliminar-movimiento
                        "
                        data-id="${movimiento.id}"
                    >
                        ×
                    </button>

                </div>

            </div>

        `;

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
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                Number(
                                    button.dataset.id
                                );


                            const movimiento =
                                this.cobroPagoService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !movimiento
                            ) {

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar este ${movimiento.tipo.toLowerCase()}?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.cobroPagoService
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
                    );

                }
            );


        document
            .querySelectorAll(
                ".cobrar-factura-directo"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormularioCobro(
                                Number(
                                    button.dataset.id
                                )
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // FORMULARIO COBRO
    // =====================================================

    mostrarFormularioCobro(
        facturaInicialId = null
    ) {

        const facturas =
            this.obtenerFacturas()
                .filter(
                    factura =>
                        factura.estado !==
                        "Anulada"
                        &&
                        this.cobroPagoService
                            .obtenerPendienteFactura(
                                factura.id
                            )
                        >
                        0.001
                );


        if (
            facturas.length ===
            0
        ) {

            alert(
                "No hay facturas pendientes de cobro."
            );

            return;

        }


        let facturaSeleccionadaId =
            facturaInicialId;


        if (
            !facturaSeleccionadaId
            ||
            !facturas.some(
                factura =>
                    Number(
                        factura.id
                    )
                    ===
                    Number(
                        facturaSeleccionadaId
                    )
            )
        ) {

            facturaSeleccionadaId =
                facturas[0].id;

        }


        this.mainContent.innerHTML = `

            <button
                id="volverCobros"
                type="button"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        Nuevo cobro
                    </h2>

                    <p>
                        Registra un cobro total o parcial de una factura
                    </p>

                </div>

            </header>


            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Factura *
                    </label>

                    <select id="facturaCobro">

                        ${facturas
                            .map(
                                factura => `

                                    <option
                                        value="${factura.id}"

                                        ${
                                            Number(
                                                factura.id
                                            )
                                            ===
                                            Number(
                                                facturaSeleccionadaId
                                            )

                                                ? "selected"

                                                : ""
                                        }
                                    >

                                        ${this.escapar(
                                            factura.numero
                                        )}

                                        ·

                                        ${this.escapar(
                                            factura.clienteNombre
                                            ||
                                            factura.cliente
                                            ||
                                            "Sin cliente"
                                        )}

                                        · Pendiente:

                                        ${this.formatearDinero(
                                            this.cobroPagoService
                                                .obtenerPendienteFactura(
                                                    factura.id
                                                )
                                        )}

                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div
                    id="resumenFacturaCobro"
                    style="
                        margin-bottom:18px;
                    "
                ></div>


                <div class="form-group">

                    <label>
                        Fecha *
                    </label>

                    <input
                        id="fechaCobro"
                        type="date"
                        value="${this.obtenerFechaHoy()}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Importe (€) *
                    </label>

                    <input
                        id="importeCobro"
                        type="number"
                        min="0.01"
                        step="0.01"
                    >

                    <small
                        id="limiteCobro"
                        style="
                            display:block;
                            margin-top:5px;
                            color:#68756f;
                        "
                    ></small>

                </div>


                <div class="form-group">

                    <label>
                        Método
                    </label>

                    <select id="metodoCobro">
                        ${this.crearOpcionesMetodo()}
                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Referencia
                    </label>

                    <input
                        id="referenciaCobro"
                        type="text"
                        placeholder="Ej. Transferencia bancaria 12345"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasCobro"
                        rows="5"
                        placeholder="Notas del cobro..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarCobro"
                        type="button"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarCobro"
                        type="button"
                        class="primary-button"
                    >
                        Registrar cobro
                    </button>

                </div>

            </div>

        `;


        const facturaSelect =
            document.getElementById(
                "facturaCobro"
            );


        const actualizarFactura =
            () => {

                const facturaId =
                    Number(
                        facturaSelect.value
                    );


                const factura =
                    facturas.find(
                        item =>
                            Number(
                                item.id
                            )
                            ===
                            facturaId
                    );


                if (
                    !factura
                ) {

                    return;

                }


                const total =
                    this.cobroPagoService
                        .obtenerTotalFactura(
                            factura
                        );


                const cobrado =
                    this.cobroPagoService
                        .obtenerCobradoFactura(
                            factura.id
                        );


                const pendiente =
                    this.cobroPagoService
                        .obtenerPendienteFactura(
                            factura.id
                        );


                document
                    .getElementById(
                        "resumenFacturaCobro"
                    )
                    .innerHTML = `

                        <div
                            style="
                                display:grid;
                                grid-template-columns:
                                    repeat(3,minmax(0,1fr));
                                gap:8px;
                                background:#f7f9f6;
                                padding:12px;
                                border-radius:10px;
                            "
                        >

                            ${this.crearMiniDato(
                                "Total factura",
                                total
                            )}

                            ${this.crearMiniDato(
                                "Ya cobrado",
                                cobrado
                            )}

                            ${this.crearMiniDato(
                                "Pendiente",
                                pendiente,
                                true
                            )}

                        </div>

                    `;


                const importe =
                    document
                        .getElementById(
                            "importeCobro"
                        );


                importe.max =
                    pendiente.toFixed(
                        2
                    );


                importe.value =
                    pendiente.toFixed(
                        2
                    );


                document
                    .getElementById(
                        "limiteCobro"
                    )
                    .textContent =
                    `Máximo permitido: ${this.formatearDinero(
                        pendiente
                    )}`;

            };


        facturaSelect
            .addEventListener(
                "change",
                actualizarFactura
            );


        actualizarFactura();


        document
            .getElementById(
                "volverCobros"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarCobro"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "guardarCobro"
            )
            .addEventListener(
                "click",
                () => {

                    const resultado =
                        this.cobroPagoService
                            .registrarCobro(
                                {

                                    facturaId:
                                        Number(
                                            document
                                                .getElementById(
                                                    "facturaCobro"
                                                )
                                                .value
                                        ),

                                    fecha:
                                        document
                                            .getElementById(
                                                "fechaCobro"
                                            )
                                            .value,

                                    importe:
                                        Number(
                                            document
                                                .getElementById(
                                                    "importeCobro"
                                                )
                                                .value
                                        ),

                                    metodo:
                                        document
                                            .getElementById(
                                                "metodoCobro"
                                            )
                                            .value,

                                    referenciaPago:
                                        document
                                            .getElementById(
                                                "referenciaCobro"
                                            )
                                            .value
                                            .trim(),

                                    notas:
                                        document
                                            .getElementById(
                                                "notasCobro"
                                            )
                                            .value
                                            .trim()

                                }
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
            );

    }


    // =====================================================
    // FORMULARIO PAGO
    // =====================================================

    mostrarFormularioPago() {

        const gastos =
            this.obtenerGastos()
                .filter(
                    gasto =>
                        this.cobroPagoService
                            .obtenerPendienteGasto(
                                gasto.id
                            )
                        >
                        0.001
                );


        if (
            gastos.length ===
            0
        ) {

            alert(
                "No hay gastos pendientes de pago."
            );

            return;

        }


        this.mainContent.innerHTML = `

            <button
                id="volverPagos"
                type="button"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        Nuevo pago
                    </h2>

                    <p>
                        Registra un pago realizado a un proveedor
                    </p>

                </div>

            </header>


            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Gasto *
                    </label>

                    <select id="gastoPago">

                        ${gastos
                            .map(
                                gasto => `

                                    <option
                                        value="${gasto.id}"
                                    >
                                        ${this.escapar(
                                            gasto.concepto
                                        )}

                                        ·

                                        ${this.escapar(
                                            gasto.proveedor
                                            ||
                                            "Sin proveedor"
                                        )}

                                        · Pendiente:

                                        ${this.formatearDinero(
                                            this.cobroPagoService
                                                .obtenerPendienteGasto(
                                                    gasto.id
                                                )
                                        )}

                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Fecha *
                    </label>

                    <input
                        id="fechaPago"
                        type="date"
                        value="${this.obtenerFechaHoy()}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Importe (€) *
                    </label>

                    <input
                        id="importePago"
                        type="number"
                        min="0.01"
                        step="0.01"
                    >

                    <small
                        id="limitePago"
                        style="
                            display:block;
                            margin-top:5px;
                            color:#68756f;
                        "
                    ></small>

                </div>


                <div class="form-group">

                    <label>
                        Método
                    </label>

                    <select id="metodoPago">
                        ${this.crearOpcionesMetodo()}
                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Referencia
                    </label>

                    <input
                        id="referenciaPago"
                        type="text"
                        placeholder="Ej. Transferencia, recibo..."
                    >

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasPago"
                        rows="5"
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarPago"
                        type="button"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarPago"
                        type="button"
                        class="primary-button"
                    >
                        Registrar pago
                    </button>

                </div>

            </div>

        `;


        const gastoSelect =
            document.getElementById(
                "gastoPago"
            );


        const completarImporte =
            () => {

                const gastoId =
                    Number(
                        gastoSelect.value
                    );


                const pendiente =
                    this.cobroPagoService
                        .obtenerPendienteGasto(
                            gastoId
                        );


                const input =
                    document
                        .getElementById(
                            "importePago"
                        );


                input.value =
                    pendiente.toFixed(
                        2
                    );


                input.max =
                    pendiente.toFixed(
                        2
                    );


                document
                    .getElementById(
                        "limitePago"
                    )
                    .textContent =
                    `Máximo permitido: ${this.formatearDinero(
                        pendiente
                    )}`;

            };


        gastoSelect
            .addEventListener(
                "change",
                completarImporte
            );


        completarImporte();


        document
            .getElementById(
                "volverPagos"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarPago"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "guardarPago"
            )
            .addEventListener(
                "click",
                () => {

                    const resultado =
                        this.cobroPagoService
                            .registrarPago(
                                {

                                    gastoId:
                                        Number(
                                            document
                                                .getElementById(
                                                    "gastoPago"
                                                )
                                                .value
                                        ),

                                    fecha:
                                        document
                                            .getElementById(
                                                "fechaPago"
                                            )
                                            .value,

                                    importe:
                                        Number(
                                            document
                                                .getElementById(
                                                    "importePago"
                                                )
                                                .value
                                        ),

                                    metodo:
                                        document
                                            .getElementById(
                                                "metodoPago"
                                            )
                                            .value,

                                    referenciaPago:
                                        document
                                            .getElementById(
                                                "referenciaPago"
                                            )
                                            .value
                                            .trim(),

                                    notas:
                                        document
                                            .getElementById(
                                                "notasPago"
                                            )
                                            .value
                                            .trim()

                                }
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
            );

    }


    // =====================================================
    // MÉTODOS
    // =====================================================

    crearOpcionesMetodo() {

        const metodos = [
            "Transferencia",
            "Efectivo",
            "Tarjeta",
            "Domiciliación",
            "Cheque",
            "Bizum",
            "Otro"
        ];


        return metodos
            .map(
                metodo => `

                    <option value="${metodo}">
                        ${metodo}
                    </option>

                `
            )
            .join("");

    }


    // =====================================================
    // FECHA
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        const año =
            fecha.getFullYear();


        const mes =
            String(
                fecha.getMonth() +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const dia =
            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${año}-${mes}-${dia}`
        );

    }


    formatearFecha(fecha) {

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
    // FORMATOS
    // =====================================================

    formatearDinero(numero) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    style:
                        "currency",

                    currency:
                        "EUR"
                }
            );

    }


    formatearNumero(numero) {

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


    escapar(valor) {

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