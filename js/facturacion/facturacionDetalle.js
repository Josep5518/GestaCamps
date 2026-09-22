import {
    escaparHTML,
    formatearFecha,
    formatearNumero,
    formatearDinero
} from "../utils.js";


export function crearFacturacionDetalleHelper({
    mainContent,
    facturaService,
    obtenerAlbaranesFactura,
    obtenerExplotacion,
    obtenerClienteFactura,
    obtenerNifCliente,
    obtenerBaseFactura,
    obtenerPorcentajeIva,
    obtenerImporteIvaFactura,
    obtenerTotalFactura,
    obtenerLineasAlbaran,
    crearEtiquetaEstado,
    onVolver
}) {

    // =====================================================
    // MOSTRAR DETALLE
    // =====================================================

    function mostrarDetalle(
        id
    ) {

        const factura =
            facturaService
                .obtenerPorId(
                    id
                );


        if (
            !factura
        ) {

            return;

        }


        const albaranes =
            obtenerAlbaranesFactura(
                factura
            );


        const explotacion =
            obtenerExplotacion();


        const cliente =
            obtenerClienteFactura(
                factura
            );


        const base =
            obtenerBaseFactura(
                factura
            );


        const porcentajeIva =
            obtenerPorcentajeIva(
                factura
            );


        const importeIva =
            obtenerImporteIvaFactura(
                factura
            );


        const total =
            obtenerTotalFactura(
                factura
            );


        const mostrarMarca =
            explotacion
            &&
            explotacion.mostrarMarcaGestaCamps ===
            true;


        mainContent.innerHTML = `

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
                            ${escaparHTML(
                                factura.numero
                            )}
                        </h1>

                        <p>
                            Fecha:
                            ${formatearFecha(
                                factura.fecha
                            )}
                        </p>

                    </div>


                    ${crearEtiquetaEstado(
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
                            ${escaparHTML(
                                explotacion?.nombre
                                ||
                                explotacion?.nombreExplotacion
                                ||
                                "GestaCamps"
                            )}
                        </h3>

                        <p>
                            ${escaparHTML(
                                explotacion?.nifCif
                                ||
                                explotacion?.nif
                                ||
                                "NIF/CIF sin configurar"
                            )}
                        </p>


                        ${
                            explotacion?.direccion

                                ? `
                                    <p>
                                        ${escaparHTML(
                                            explotacion.direccion
                                        )}
                                    </p>
                                `

                                : ""
                        }


                        <p>
                            ${escaparHTML(
                                [
                                    explotacion?.localidad,
                                    explotacion?.provincia
                                ]
                                    .filter(
                                        Boolean
                                    )
                                    .join(
                                        " · "
                                    )
                            )}
                        </p>


                        ${
                            explotacion?.pais

                                ? `
                                    <p>
                                        ${escaparHTML(
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
                            ${escaparHTML(
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
                            ${escaparHTML(
                                obtenerNifCliente(
                                    factura,
                                    cliente
                                )
                            )}
                        </p>


                        ${
                            cliente?.direccion

                                ? `
                                    <p>
                                        ${escaparHTML(
                                            cliente.direccion
                                        )}
                                    </p>
                                `

                                : ""
                        }


                        <p>
                            ${escaparHTML(
                                [
                                    cliente?.localidad,
                                    cliente?.provincia
                                ]
                                    .filter(
                                        Boolean
                                    )
                                    .join(
                                        " · "
                                    )
                            )}
                        </p>


                        ${
                            cliente?.pais

                                ? `
                                    <p>
                                        ${escaparHTML(
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
                            crearDetalleAlbaran(
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
                            ${formatearDinero(
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
                            IVA (
                            ${formatearNumero(
                                porcentajeIva
                            )}%)
                        </span>

                        <strong>
                            ${formatearDinero(
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
                            ${formatearDinero(
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


        configurarEventosDetalle();

    }


    // =====================================================
    // EVENTOS DETALLE
    // =====================================================

    function configurarEventosDetalle() {

        document
            .getElementById(
                "volverFacturas"
            )
            ?.addEventListener(
                "click",
                () => {

                    onVolver();

                }
            );


        document
            .getElementById(
                "imprimirFactura"
            )
            ?.addEventListener(
                "click",
                () => {

                    window.print();

                }
            );


        document
            .getElementById(
                "descargarFactura"
            )
            ?.addEventListener(
                "click",
                () => {

                    window.print();

                }
            );

    }


    // =====================================================
    // DETALLE ALBARÁN
    // =====================================================

    function crearDetalleAlbaran(
        albaran
    ) {

        const lineas =
            obtenerLineasAlbaran(
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
                        ${escaparHTML(
                            albaran.numero
                        )}
                    </strong>

                    <span>
                        ${formatearFecha(
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
                                        ${escaparHTML(
                                            [
                                                linea.producto,
                                                linea.variedad
                                            ]
                                                .filter(
                                                    Boolean
                                                )
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

                                        ${escaparHTML(
                                            [
                                                linea.fincaNombre,
                                                linea.parcela
                                            ]
                                                .filter(
                                                    Boolean
                                                )
                                                .join(
                                                    " · "
                                                )
                                        )}

                                        ${
                                            linea.campaniaNombre

                                                ? `
                                                    ·
                                                    ${escaparHTML(
                                                        linea.campaniaNombre
                                                    )}
                                                `

                                                : ""
                                        }

                                    </div>

                                </div>


                                <div>

                                    ${formatearNumero(
                                        linea.cantidad
                                    )}

                                    ${escaparHTML(
                                        linea.unidad
                                        ||
                                        "kg"
                                    )}

                                </div>


                                <div>

                                    ${formatearNumero(
                                        linea.precio
                                    )}

                                    € /

                                    ${escaparHTML(
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

                                    ${formatearDinero(
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
                        ${formatearDinero(
                            albaran.total
                        )}
                    </strong>

                </div>

            </div>

        `;

    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    return {

        mostrarDetalle,

        crearDetalleAlbaran

    };

}