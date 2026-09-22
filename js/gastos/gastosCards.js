import {
    escaparHTML,
    formatearFecha,
    formatearNumero,
    formatearDinero
} from "../utils.js";


export function crearGastosCardsHelper({
    obtenerIconoCategoria
}) {

    // =====================================================
    // TARJETA GASTO
    // =====================================================

    function crearTarjetaGasto(
        gasto
    ) {

        const importe =
            Number(
                gasto.importe
                ||
                0
            );


        const pagado =
            Number(
                gasto.pagadoAcumulado
                ||
                0
            );


        const pendiente =
            Number(
                gasto.pendientePago
                ??
                Math.max(
                    0,
                    importe -
                    pagado
                )
            );


        const porcentaje =
            importe >
            0

                ? Math.min(
                    100,
                    Math.max(
                        0,
                        (
                            pagado /
                            importe
                        )
                        *
                        100
                    )
                )

                : 0;


        const tienePagos =
            pagado >
            0.001;


        return `

            <div class="gasto-card">

                <div class="gasto-card-header">

                    <span class="gasto-icon">

                        ${obtenerIconoCategoria(
                            gasto.categoria
                        )}

                    </span>


                    <div class="gasto-actions">

                        <button
                            type="button"
                            class="
                                secondary-button
                                editar-gasto
                            "
                            data-id="${escaparHTML(
                                gasto.id
                            )}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="
                                delete-button
                                eliminar-gasto
                            "
                            data-id="${escaparHTML(
                                gasto.id
                            )}"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <h3>

                    ${escaparHTML(
                        gasto.concepto
                    )}

                </h3>


                <strong class="gasto-categoria">

                    ${escaparHTML(
                        gasto.categoria
                    )}

                </strong>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(3,minmax(0,1fr));
                        gap:8px;
                        margin-top:15px;
                    "
                >

                    ${crearDatoFinanciero(
                        "Importe",
                        importe
                    )}

                    ${crearDatoFinanciero(
                        "Pagado",
                        pagado,
                        "#e8f5ed"
                    )}

                    ${crearDatoFinanciero(
                        "Pendiente",
                        pendiente,
                        pendiente > 0
                            ? "#fff4dc"
                            : "#e8f5ed"
                    )}

                </div>


                <div
                    style="
                        height:8px;
                        background:#edf0ed;
                        border-radius:999px;
                        overflow:hidden;
                        margin-top:13px;
                    "
                >

                    <div
                        style="
                            width:${porcentaje}%;
                            height:100%;
                            background:#26795d;
                            border-radius:999px;
                        "
                    ></div>

                </div>


                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-top:7px;
                    "
                >

                    ${crearEtiquetaEstado(
                        gasto.estado
                    )}


                    <span
                        style="
                            color:#78837d;
                            font-size:11px;
                        "
                    >

                        ${formatearNumero(
                            porcentaje
                        )}% pagado

                    </span>

                </div>


                <p class="gasto-linea">

                    🗓️

                    ${formatearFecha(
                        gasto.fecha
                    )}

                </p>


                ${
                    gasto.proveedorNombre

                        ? `

                            <p class="gasto-linea">

                                🚚

                                ${escaparHTML(
                                    gasto.proveedorNombre
                                )}

                            </p>

                        `

                        : ""
                }


                ${
                    gasto.fincaNombre

                        ? `

                            <p class="gasto-linea">

                                📍

                                ${escaparHTML(
                                    gasto.fincaNombre
                                )}

                                ${
                                    gasto.parcela

                                        ? `
                                            ·
                                            ${escaparHTML(
                                                gasto.parcela
                                            )}
                                        `

                                        : ""
                                }

                            </p>

                        `

                        : ""
                }


                ${
                    gasto.campaniaNombre

                        ? `

                            <p class="gasto-campania">

                                📅

                                ${escaparHTML(
                                    gasto.campaniaNombre
                                )}

                            </p>

                        `

                        : `

                            <p
                                class="
                                    gasto-campania
                                    gasto-sin-campania
                                "
                            >
                                📅 Sin campanya asignada
                            </p>

                        `
                }


                ${
                    gasto.maquinariaNombre

                        ? `

                            <p class="gasto-linea">

                                🚜

                                ${escaparHTML(
                                    gasto.maquinariaNombre
                                )}

                            </p>

                        `

                        : ""
                }


                ${
                    tienePagos

                        ? `

                            <div
                                style="
                                    margin-top:12px;
                                    padding:9px 12px;
                                    background:#edf6f1;
                                    color:#315f4d;
                                    border-radius:9px;
                                    font-size:12px;
                                "
                            >

                                💳 Este gasto tiene pagos registrados.

                                Su estado se controla desde

                                <strong>
                                    Cobros y pagos
                                </strong>.

                            </div>

                        `

                        : `

                            <div
                                style="
                                    margin-top:12px;
                                    padding:9px 12px;
                                    background:#f5f7f5;
                                    color:#68756f;
                                    border-radius:9px;
                                    font-size:12px;
                                "
                            >

                                💳 Registra los pagos desde

                                <strong>
                                    Cobros y pagos
                                </strong>.

                            </div>

                        `
                }


                ${
                    gasto.observaciones

                        ? `

                            <p
                                style="
                                    margin-top:12px;
                                    color:#68756f;
                                    font-size:12px;
                                "
                            >

                                ${escaparHTML(
                                    gasto.observaciones
                                )}

                            </p>

                        `

                        : ""
                }

            </div>

        `;

    }


    // =====================================================
    // DATO FINANCIERO
    // =====================================================

    function crearDatoFinanciero(
        titulo,
        importe,
        fondo = "#f5f7f5"
    ) {

        return `

            <div
                style="
                    padding:10px;
                    border-radius:9px;
                    background:${fondo};
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
    // ESTADO
    // =====================================================

    function crearEtiquetaEstado(
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


            "Parcialmente pagado": {

                icono:
                    "◐",

                fondo:
                    "#eaf1fb",

                color:
                    "#3d5d91"

            },


            Pagado: {

                icono:
                    "✅",

                fondo:
                    "#e7f5ed",

                color:
                    "#176044"

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
                    display:inline-block;
                    padding:6px 10px;
                    border-radius:999px;
                    background:${estilo.fondo};
                    color:${estilo.color};
                    font-size:11px;
                    font-weight:600;
                "
            >

                ${estilo.icono}

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

        crearTarjetaGasto,

        crearDatoFinanciero,

        crearEtiquetaEstado

    };

}