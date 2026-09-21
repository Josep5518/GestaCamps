export function crearAlbaranesCardsHelper({
    obtenerLineasAlbaran,
    escapar,
    formatearFecha,
    formatearNumero,
    formatearDinero
}) {

    // =====================================================
    // TARJETA ALBARÁN
    // =====================================================

    function crearTarjetaAlbaran(
        albaran
    ) {

        const facturado =
            albaran.facturado ===
            true
            ||
            albaran.estado ===
            "Facturado";


        const lineas =
            obtenerLineasAlbaran(
                albaran
            );


        return `

            <article class="albaran-card">

                <div class="albaran-card-header">

                    <span class="albaran-icon">
                        🧾
                    </span>


                    <div class="albaran-actions">

                        ${
                            !facturado

                                ? `

                                    <button
                                        type="button"
                                        class="
                                            secondary-button
                                            editar-albaran
                                        "
                                        data-id="${escapar(
                                            albaran.id
                                        )}"
                                    >
                                        Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="
                                            delete-button
                                            eliminar-albaran
                                        "
                                        data-id="${escapar(
                                            albaran.id
                                        )}"
                                    >
                                        ×
                                    </button>

                                `

                                : `

                                    <span
                                        style="
                                            background:#efedf9;
                                            color:#514099;
                                            padding:7px 12px;
                                            border-radius:9px;
                                            font-size:12px;
                                        "
                                    >
                                        🔒 Facturado
                                    </span>

                                `
                        }

                    </div>

                </div>


                <h3>
                    ${escapar(
                        albaran.numero
                    )}
                </h3>


                <p>

                    👤

                    <strong>
                        ${escapar(
                            albaran.clienteNombre
                            ||
                            "Sin cliente"
                        )}
                    </strong>

                </p>


                <p>

                    🗓️

                    ${formatearFecha(
                        albaran.fecha
                    )}

                </p>


                <div
                    style="
                        margin:15px 0 10px;
                        display:flex;
                        flex-direction:column;
                        gap:10px;
                    "
                >

                    ${lineas
                        .map(
                            (
                                linea,
                                indice
                            ) =>
                                crearLineaTarjeta(
                                    linea,
                                    indice,
                                    lineas.length
                                )
                        )
                        .join("")}

                </div>


                <div class="albaran-total">

                    <span>
                        Total albarán
                    </span>

                    <strong>
                        ${formatearDinero(
                            albaran.total
                        )}
                    </strong>

                </div>


                <div
                    style="
                        margin-top:14px;
                        display:flex;
                        align-items:center;
                        gap:8px;
                        flex-wrap:wrap;
                    "
                >

                    ${crearEtiquetaEstado(
                        albaran.estado
                    )}


                    ${
                        lineas.length >
                        1

                            ? `

                                <span
                                    style="
                                        background:#edf6f1;
                                        color:#176044;
                                        padding:6px 10px;
                                        border-radius:20px;
                                        font-size:12px;
                                        font-weight:600;
                                    "
                                >
                                    ${lineas.length} líneas
                                </span>

                            `

                            : ""
                    }

                </div>


                ${
                    !facturado

                        ? crearBotonesEstado(
                            albaran
                        )

                        : ""
                }


                ${
                    albaran.observaciones

                        ? `

                            <div class="albaran-notas">

                                <span>
                                    Observaciones
                                </span>

                                <p>
                                    ${escapar(
                                        albaran.observaciones
                                    )}
                                </p>

                            </div>

                        `

                        : ""
                }

            </article>

        `;

    }


    // =====================================================
    // ETIQUETA ESTADO
    // =====================================================

    function crearEtiquetaEstado(
        estado
    ) {

        const estilos = {

            Borrador:
                "background:#f1f2f1;color:#5f6964;",

            Pendiente:
                "background:#fff3d8;color:#855d00;",

            Entregado:
                "background:#e7f5ed;color:#176044;",

            Facturado:
                "background:#efedf9;color:#514099;",

            Cancelado:
                "background:#f7e9e9;color:#9a4444;"

        };


        const iconos = {

            Borrador:
                "📝",

            Pendiente:
                "🕒",

            Entregado:
                "🚚",

            Facturado:
                "💶",

            Cancelado:
                "🚫"

        };


        return `

            <span
                style="
                    ${estilos[estado] || estilos.Borrador}
                    padding:6px 10px;
                    border-radius:20px;
                    font-size:12px;
                    font-weight:600;
                "
            >

                ${iconos[estado] || "📝"}

                ${escapar(
                    estado
                    ||
                    "Borrador"
                )}

            </span>

        `;

    }


    // =====================================================
    // BOTONES ESTADO
    // =====================================================

    function crearBotonesEstado(
        albaran
    ) {

        const estados =
            [
                {
                    valor:
                        "Borrador",

                    texto:
                        "📝 Borrador"
                },

                {
                    valor:
                        "Pendiente",

                    texto:
                        "🕒 Pendiente"
                },

                {
                    valor:
                        "Entregado",

                    texto:
                        "🚚 Entregado"
                },

                {
                    valor:
                        "Cancelado",

                    texto:
                        "🚫 Cancelar"
                }
            ];


        return `

            <div
                style="
                    display:flex;
                    gap:7px;
                    margin-top:12px;
                    flex-wrap:wrap;
                "
            >

                ${estados
                    .filter(
                        estado =>
                            estado.valor !==
                            albaran.estado
                    )
                    .map(
                        estado => `

                            <button
                                type="button"
                                class="
                                    task-state-button
                                    estado-albaran
                                "
                                data-id="${escapar(
                                    albaran.id
                                )}"
                                data-estado="${escapar(
                                    estado.valor
                                )}"
                            >

                                ${estado.texto}

                            </button>

                        `
                    )
                    .join("")}

            </div>

        `;

    }


    // =====================================================
    // LÍNEA TARJETA
    // =====================================================

    function crearLineaTarjeta(
        linea,
        indice,
        totalLineas
    ) {

        const producto =
            [
                linea.producto
                ||
                "Sin producto",

                linea.variedad
            ]
                .filter(
                    Boolean
                )
                .join(
                    " · "
                );


        const ubicacion =
            [
                linea.fincaNombre
                ||
                "Sin finca",

                linea.parcela
            ]
                .filter(
                    Boolean
                )
                .join(
                    " · "
                );


        return `

            <div
                style="
                    background:#f7f9f6;
                    border-radius:10px;
                    padding:13px;
                "
            >

                ${
                    totalLineas >
                    1

                        ? `

                            <span
                                style="
                                    display:block;
                                    color:#78837d;
                                    font-size:11px;
                                    margin-bottom:5px;
                                "
                            >
                                Línea ${indice + 1}
                            </span>

                        `

                        : ""
                }


                <strong>
                    ${escapar(
                        producto
                    )}
                </strong>


                <div
                    style="
                        color:#68756f;
                        font-size:13px;
                        margin-top:6px;
                    "
                >

                    📍 ${escapar(
                        ubicacion
                    )}

                </div>


                <div
                    style="
                        color:#176044;
                        font-size:13px;
                        margin-top:5px;
                    "
                >

                    📅 ${escapar(
                        linea.campaniaNombre
                        ||
                        "Sin campanya"
                    )}

                </div>


                <div
                    style="
                        display:inline-flex;
                        align-items:center;
                        gap:6px;
                        margin-top:6px;
                        padding:5px 9px;
                        border-radius:999px;
                        background:#edf6f1;
                        color:#176044;
                        font-size:12px;
                        font-weight:700;
                    "
                >

                    🍑 Pasada:

                    ${escapar(
                        linea.pasada
                        ||
                        "1ª"
                    )}

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(3,minmax(0,1fr));
                        gap:8px;
                        margin-top:10px;
                    "
                >

                    <div>

                        <span
                            style="
                                display:block;
                                color:#78837d;
                                font-size:11px;
                            "
                        >
                            Cantidad
                        </span>

                        <strong>

                            ${formatearNumero(
                                linea.cantidad
                            )}

                            ${escapar(
                                linea.unidad
                                ||
                                "kg"
                            )}

                        </strong>

                    </div>


                    <div>

                        <span
                            style="
                                display:block;
                                color:#78837d;
                                font-size:11px;
                            "
                        >
                            Precio
                        </span>

                        <strong>

                            ${formatearNumero(
                                linea.precio
                            )}
                            €

                        </strong>

                    </div>


                    <div>

                        <span
                            style="
                                display:block;
                                color:#78837d;
                                font-size:11px;
                            "
                        >
                            Subtotal
                        </span>

                        <strong>

                            ${formatearDinero(
                                linea.total
                            )}

                        </strong>

                    </div>

                </div>

            </div>

        `;

    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    return {

        crearTarjetaAlbaran,

        crearEtiquetaEstado,

        crearBotonesEstado,

        crearLineaTarjeta

    };

}