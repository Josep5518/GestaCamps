export function crearProduccionCardsHelper({
    stockHelper,
    escapar,
    formatearNumero,
    formatearFecha
}) {

    function crearMiniDato(
        titulo,
        valor,
        unidad,
        fondo,
        color
    ) {

        return `
            <div
                style="
                    background:${fondo};
                    padding:11px;
                    border-radius:9px;
                    min-width:0;
                "
            >
                <span
                    style="
                        display:block;
                        color:#78837d;
                        font-size:11px;
                        margin-bottom:4px;
                    "
                >
                    ${escapar(titulo)}
                </span>

                <strong
                    style="
                        display:block;
                        color:${color};
                        white-space:nowrap;
                    "
                >
                    ${formatearNumero(valor)}
                    ${escapar(unidad || "kg")}
                </strong>
            </div>
        `;

    }


    function crearTarjetaProduccion(
        registro
    ) {

        const producido =
            Number(
                registro.cantidad
                ||
                0
            );

        const pesoBruto =
            Number(
                registro.pesoBruto
                ??
                registro.cantidad
                ??
                0
            );

        const tara =
            Number(
                registro.tara
                ??
                0
            );

        const pesoNeto =
            Number(
                registro.pesoNeto
                ??
                registro.cantidad
                ??
                0
            );

        const reservado =
            stockHelper
                .obtenerCantidadReservada(
                    registro.id
                );

        const entregado =
            stockHelper
                .obtenerCantidadEntregada(
                    registro.id
                );

        const ocupado =
            reservado
            +
            entregado;

        const disponible =
            Math.max(
                0,
                producido -
                ocupado
            );

        const agotado =
            disponible <= 0;

        const sobreasignado =
            ocupado > producido;


        return `
            <div class="produccion-card">

                <div class="produccion-card-header">

                    <span class="produccion-icon">
                        🍎
                    </span>

                    <div class="produccion-actions">

                        <button
                            class="secondary-button editar-produccion"
                            data-id="${escapar(registro.id)}"
                            type="button"
                        >
                            Editar
                        </button>

                        <button
                            class="delete-button eliminar-produccion"
                            data-id="${escapar(registro.id)}"
                            type="button"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <h3>
                    ${escapar(
                        registro.producto
                        ||
                        registro.cultivoNombre
                        ||
                        "Producto sin definir"
                    )}

                    ${
                        registro.variedad
                            ? ` · ${escapar(registro.variedad)}`
                            : ""
                    }
                </h3>


                <p class="produccion-location">
                    📍 ${escapar(
                        registro.fincaNombre
                        ||
                        "Sin finca"
                    )}

                    ${
                        registro.parcela
                            ? ` · ${escapar(registro.parcela)}`
                            : ""
                    }
                </p>


                ${
                    registro.campaniaNombre

                        ? `
                            <p class="produccion-campania">
                                📅 ${escapar(
                                    registro.campaniaNombre
                                )}
                            </p>
                        `

                        : `
                            <p
                                class="
                                    produccion-campania
                                    produccion-sin-campania
                                "
                            >
                                📅 Sin campanya asignada
                            </p>
                        `
                }


                <div
                    style="
                        display:inline-flex;
                        align-items:center;
                        gap:6px;
                        margin-top:8px;
                        padding:6px 10px;
                        border-radius:999px;
                        background:#edf6f1;
                        color:#176044;
                        font-size:12px;
                        font-weight:700;
                    "
                >
                    🍑 Pasada:
                    ${escapar(
                        registro.pasada
                        ||
                        "1ª"
                    )}
                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:repeat(3,minmax(0,1fr));
                        gap:8px;
                        margin-top:12px;
                    "
                >
                    ${crearMiniDato(
                        "Peso bruto",
                        pesoBruto,
                        registro.unidad,
                        "#f7f9f6",
                        "#111"
                    )}

                    ${crearMiniDato(
                        "Tara",
                        tara,
                        registro.unidad,
                        "#f7f9f6",
                        "#68756f"
                    )}

                    ${crearMiniDato(
                        "Peso neto",
                        pesoNeto,
                        registro.unidad,
                        "#edf6f1",
                        "#176044"
                    )}
                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:repeat(4,minmax(0,1fr));
                        gap:8px;
                        margin-top:16px;
                    "
                >
                    ${crearMiniDato(
                        "Producido",
                        producido,
                        registro.unidad,
                        "#f5f7f5",
                        "#111"
                    )}

                    ${crearMiniDato(
                        "Reservado",
                        reservado,
                        registro.unidad,
                        reservado > 0
                            ? "#fff4dc"
                            : "#f5f7f5",
                        reservado > 0
                            ? "#855d00"
                            : "#111"
                    )}

                    ${crearMiniDato(
                        "Entregado",
                        entregado,
                        registro.unidad,
                        entregado > 0
                            ? "#eef0f8"
                            : "#f5f7f5",
                        entregado > 0
                            ? "#4f5583"
                            : "#111"
                    )}

                    ${crearMiniDato(
                        "Disponible",
                        disponible,
                        registro.unidad,
                        agotado
                            ? "#f5eeee"
                            : "#e8f5ed",
                        agotado
                            ? "#8e3f3f"
                            : "#176044"
                    )}
                </div>


                ${
                    reservado > 0

                        ? `
                            <div
                                style="
                                    margin-top:12px;
                                    padding:9px 12px;
                                    background:#fff4dc;
                                    color:#855d00;
                                    border-radius:9px;
                                    font-size:12px;
                                    font-weight:600;
                                "
                            >
                                🕒
                                ${formatearNumero(reservado)}
                                ${escapar(registro.unidad || "kg")}
                                reservados en albaranes pendientes
                            </div>
                        `

                        : ""
                }


                ${
                    agotado && !sobreasignado

                        ? `
                            <div
                                style="
                                    margin-top:12px;
                                    padding:9px 12px;
                                    background:#f5eeee;
                                    color:#8e3f3f;
                                    border-radius:9px;
                                    font-size:12px;
                                    font-weight:600;
                                "
                            >
                                📦 Producción agotada
                            </div>
                        `

                        : ""
                }


                ${
                    sobreasignado

                        ? `
                            <div
                                style="
                                    margin-top:12px;
                                    padding:9px 12px;
                                    background:#fff3dc;
                                    color:#9a6200;
                                    border-radius:9px;
                                    font-size:12px;
                                    font-weight:600;
                                "
                            >
                                ⚠️ Producción sobreasignada en
                                ${formatearNumero(
                                    ocupado - producido
                                )}
                                ${escapar(
                                    registro.unidad || "kg"
                                )}
                            </div>
                        `

                        : ""
                }


                <div
                    class="produccion-info-grid"
                    style="margin-top:12px;"
                >

                    <div>
                        <span>Fecha</span>

                        <strong>
                            ${formatearFecha(
                                registro.fecha
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>Estado</span>

                        <strong>
                            ${
                                sobreasignado
                                    ? "⚠️ Revisar"
                                    : agotado
                                        ? "Agotada"
                                        : reservado > 0
                                            ? "Con reservas"
                                            : "Disponible"
                            }
                        </strong>
                    </div>

                </div>


                ${
                    registro.observaciones

                        ? `
                            <p class="produccion-notas">
                                ${escapar(
                                    registro.observaciones
                                )}
                            </p>
                        `

                        : ""
                }

            </div>
        `;

    }


    return {
        crearTarjetaProduccion,
        crearMiniDato
    };

}