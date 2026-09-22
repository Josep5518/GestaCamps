import {
    escaparHTML,
    formatearFecha,
    formatearNumero,
    formatearDinero
} from "../utils.js";


export function crearCobrosPagosCardsHelper({
    cobroPagoService,
    obtenerFacturas,
    obtenerGastos
}) {

    // =====================================================
    // TARJETA RESUMEN
    // =====================================================

    function crearTarjeta(
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
    // FILA RESUMEN
    // =====================================================

    function crearFilaResumen(
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

                    ${escaparHTML(
                        titulo
                    )}

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

                    ${formatearDinero(
                        importe
                    )}

                </strong>

            </div>

        `;

    }


    // =====================================================
    // FACTURAS PENDIENTES
    // =====================================================

    function crearListaFacturasPendientes() {

        const facturas =
            obtenerFacturas()
                .filter(
                    factura =>
                        factura.estado !==
                        "Anulada"
                        &&
                        cobroPagoService
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
                            crearTarjetaFacturaPendiente(
                                factura
                            )
                    )
                    .join("")}

            </div>

        `;

    }


    // =====================================================
    // TARJETA FACTURA PENDIENTE
    // =====================================================

    function crearTarjetaFacturaPendiente(
        factura
    ) {

        const total =
            cobroPagoService
                .obtenerTotalFactura(
                    factura
                );


        const cobrado =
            cobroPagoService
                .obtenerCobradoFactura(
                    factura.id
                );


        const pendiente =
            cobroPagoService
                .obtenerPendienteFactura(
                    factura.id
                );


        const estado =
            cobroPagoService
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

                            ${escaparHTML(
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

                            ${escaparHTML(
                                factura.clienteNombre
                                ||
                                factura.cliente
                                ||
                                "Sin cliente"
                            )}

                        </p>

                    </div>


                    ${crearEstadoFactura(
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

                    ${crearMiniDato(
                        "Total",
                        total
                    )}

                    ${crearMiniDato(
                        "Cobrado",
                        cobrado
                    )}

                    ${crearMiniDato(
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

                    ${formatearNumero(
                        porcentaje
                    )}% cobrado

                </div>


                <button
                    type="button"
                    class="
                        primary-button
                        cobrar-factura-directo
                    "
                    data-id="${escaparHTML(
                        factura.id
                    )}"
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


    // =====================================================
    // MINI DATO
    // =====================================================

    function crearMiniDato(
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

                    ${escaparHTML(
                        titulo
                    )}

                </span>


                <strong
                    style="
                        display:block;
                        margin-top:3px;
                    "
                >

                    ${formatearDinero(
                        importe
                    )}

                </strong>

            </div>

        `;

    }


    // =====================================================
    // ESTADO FACTURA
    // =====================================================

    function crearEstadoFactura(
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

                ${escaparHTML(
                    estado
                )}

            </span>

        `;

    }


    // =====================================================
    // GASTOS PENDIENTES
    // =====================================================

    function crearListaGastosPendientes() {

        const gastos =
            obtenerGastos()
                .filter(
                    gasto =>
                        cobroPagoService
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

                                ${escaparHTML(
                                    gasto.concepto
                                )}

                            </strong>

                            <p>

                                ${escaparHTML(
                                    gasto.proveedor
                                    ||
                                    gasto.proveedorNombre
                                    ||
                                    "Sin proveedor"
                                )}

                            </p>

                        </div>


                        <strong>

                            ${formatearDinero(
                                cobroPagoService
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

    function crearMovimientoHTML(
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

                            ${escaparHTML(
                                movimiento.tipo
                            )}

                            ·

                            ${escaparHTML(
                                movimiento.referencia
                            )}

                        </strong>


                        <p>

                            ${escaparHTML(
                                movimiento.tercero
                                ||
                                "Sin tercero"
                            )}

                            ·

                            ${formatearFecha(
                                movimiento.fecha
                            )}

                            ·

                            ${escaparHTML(
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

                                        ${escaparHTML(
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

                        ${formatearDinero(
                            movimiento.importe
                        )}

                    </strong>


                    <button
                        type="button"
                        class="
                            delete-button
                            eliminar-movimiento
                        "
                        data-id="${escaparHTML(
                            movimiento.id
                        )}"
                    >
                        ×
                    </button>

                </div>

            </div>

        `;

    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    return {

        crearTarjeta,

        crearFilaResumen,

        crearListaFacturasPendientes,

        crearTarjetaFacturaPendiente,

        crearMiniDato,

        crearEstadoFactura,

        crearListaGastosPendientes,

        crearMovimientoHTML

    };

}