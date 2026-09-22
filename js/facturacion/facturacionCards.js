import {
    escaparHTML,
    formatearFecha,
    formatearNumero,
    formatearDinero
} from "../utils.js";


export function crearFacturacionCardsHelper({
    obtenerBaseFactura,
    obtenerImporteIvaFactura,
    obtenerPorcentajeIva,
    obtenerTotalFactura,
    obtenerAlbaranesFactura,
    obtenerLineasAlbaran,
    obtenerCampanyasFactura
}) {

    // =====================================================
    // TARJETA FACTURA
    // =====================================================

    function crearTarjetaFactura(
        factura
    ) {

        const base =
            obtenerBaseFactura(
                factura
            );


        const iva =
            obtenerImporteIvaFactura(
                factura
            );


        const porcentajeIva =
            obtenerPorcentajeIva(
                factura
            );


        const total =
            obtenerTotalFactura(
                factura
            );


        const albaranes =
            obtenerAlbaranesFactura(
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
                    obtenerLineasAlbaran(
                        albaran
                    ).length,
                0
            );


        const campanyas =
            obtenerCampanyasFactura(
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
                        data-id="${escaparHTML(
                            factura.id
                        )}"
                    >
                        ×
                    </button>

                </div>


                <h3>
                    ${escaparHTML(
                        factura.numero
                    )}
                </h3>


                <p>

                    👤

                    <strong>
                        ${escaparHTML(
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

                    ${formatearFecha(
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

                                    ${escaparHTML(
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
                            ${formatearDinero(
                                base
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>

                            IVA (
                            ${formatearNumero(
                                porcentajeIva
                            )}%)

                        </span>

                        <strong>
                            ${formatearDinero(
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
                        ${formatearDinero(
                            total
                        )}
                    </strong>

                </div>


                <div
                    style="
                        margin-top:12px;
                    "
                >

                    ${crearEtiquetaEstado(
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
                                    data-id="${escaparHTML(
                                        factura.id
                                    )}"
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
                        data-id="${escaparHTML(
                            factura.id
                        )}"
                    >
                        Ver detalle
                    </button>

                </div>

            </article>

        `;

    }


    // =====================================================
    // ESTADO
    // =====================================================

    function crearEtiquetaEstado(
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

                ${escaparHTML(
                    estado
                    ||
                    "Pendiente"
                )}

            </span>

        `;

    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    return {

        crearTarjetaFactura,

        crearEtiquetaEstado

    };

}