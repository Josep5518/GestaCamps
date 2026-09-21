export function crearAlbaranesLineasHelper({
    albaranService,
    produccionService,
    escapar,
    formatearNumero,
    formatearDinero
}) {

    // =====================================================
    // LÍNEA VACÍA
    // =====================================================

    function crearLineaVacia() {

        return {

            id:
                Date.now()
                +
                Math.floor(
                    Math.random() *
                    100000
                ),

            produccionId:
                "",

            cantidad:
                "",

            unidad:
                "kg",

            precio:
                ""

        };

    }


    // =====================================================
    // LÍNEAS DESDE ALBARÁN
    // =====================================================

    function obtenerLineasFormulario(
        albaran
    ) {

        if (
            !albaran
        ) {

            return [];

        }


        return obtenerLineasAlbaran(
            albaran
        )
            .map(
                linea => (
                    {

                        id:
                            linea.id
                            ||
                            Date.now(),

                        produccionId:
                            linea.produccionId
                            ||
                            "",

                        cantidad:
                            linea.cantidad
                            ??
                            "",

                        unidad:
                            linea.unidad
                            ||
                            "kg",

                        precio:
                            linea.precio
                            ??
                            ""

                    }
                )
            );

    }


    // =====================================================
    // FORMULARIO DE LÍNEA
    // =====================================================

    function crearLineaFormulario(
        linea,
        indice,
        producciones,
        totalLineas,
        albaranId = null
    ) {

        const produccion =
            obtenerProduccionPorId(
                linea.produccionId
            );


        const disponibilidad =
            produccion

                ? albaranService
                    .obtenerDisponibilidadProduccion(
                        produccion.id,
                        albaranId
                    )

                : {

                    producido:
                        0,

                    reservado:
                        0,

                    consumido:
                        0,

                    disponible:
                        0,

                    unidad:
                        "kg"

                };


        return `

            <div
                class="albaran-linea-form"
                data-linea-id="${escapar(
                    linea.id
                )}"
                style="
                    background:#f7f9f6;
                    border:1px solid #edf0ed;
                    border-radius:12px;
                    padding:16px;
                    margin-bottom:12px;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:12px;
                    "
                >

                    <strong>
                        Línea ${indice + 1}
                    </strong>


                    ${
                        totalLineas >
                        1

                            ? `

                                <button
                                    type="button"
                                    class="
                                        delete-button
                                        quitar-linea-albaran
                                    "
                                    data-index="${indice}"
                                >
                                    ×
                                </button>

                            `

                            : ""
                    }

                </div>


                <div class="form-group">

                    <label>
                        Producción de origen *
                    </label>

                    <select
                        class="linea-produccion"
                        data-index="${indice}"
                    >

                        <option value="">
                            Selecciona una producción
                        </option>


                        ${producciones
                            .map(
                                item => {

                                    const datos =
                                        albaranService
                                            .obtenerDisponibilidadProduccion(
                                                item.id,
                                                albaranId
                                            );


                                    return `

                                        <option
                                            value="${escapar(
                                                item.id
                                            )}"

                                            ${
                                                String(
                                                    linea.produccionId
                                                    ??
                                                    ""
                                                )
                                                ===
                                                String(
                                                    item.id
                                                    ??
                                                    ""
                                                )

                                                    ? "selected"
                                                    : ""
                                            }
                                        >

                                            ${escapar(
                                                item.producto
                                                ||
                                                item.productoNombre
                                                ||
                                                "Producto"
                                            )}

                                            ${
                                                item.variedad

                                                    ? ` · ${escapar(
                                                        item.variedad
                                                    )}`

                                                    : ""
                                            }

                                            · ${escapar(
                                                item.pasada
                                                ||
                                                "1ª"
                                            )}

                                            ${
                                                item.fincaNombre

                                                    ? ` · ${escapar(
                                                        item.fincaNombre
                                                    )}`

                                                    : ""
                                            }

                                            ${
                                                item.parcela

                                                    ? ` · ${escapar(
                                                        item.parcela
                                                    )}`

                                                    : ""
                                            }

                                            ${
                                                item.campaniaNombre

                                                    ? ` · ${escapar(
                                                        item.campaniaNombre
                                                    )}`

                                                    : ""
                                            }

                                            · Disponible:

                                            ${formatearNumero(
                                                datos.disponible
                                            )}

                                            ${escapar(
                                                datos.unidad
                                            )}

                                        </option>

                                    `;

                                }
                            )
                            .join("")}

                    </select>

                </div>


                ${
                    produccion

                        ? `

                            <div
                                style="
                                    margin:12px 0;
                                    padding:11px 13px;
                                    border-radius:10px;
                                    background:#edf6f1;
                                    color:#315f4d;
                                    font-size:12px;
                                    line-height:1.6;
                                "
                            >

                                <strong>
                                    Origen:
                                </strong>

                                ${escapar(
                                    produccion.fincaNombre
                                    ||
                                    "Sin finca"
                                )}

                                ${
                                    produccion.parcela

                                        ? ` · ${escapar(
                                            produccion.parcela
                                        )}`

                                        : ""
                                }

                                ${
                                    produccion.campaniaNombre

                                        ? ` · ${escapar(
                                            produccion.campaniaNombre
                                        )}`

                                        : " · Sin campanya"
                                }

                                · Pasada

                                <strong>
                                    ${escapar(
                                        produccion.pasada
                                        ||
                                        "1ª"
                                    )}
                                </strong>

                            </div>


                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                        repeat(4,minmax(0,1fr));
                                    gap:8px;
                                    margin:12px 0;
                                "
                            >

                                ${miniDato(
                                    "Producido",
                                    disponibilidad.producido,
                                    disponibilidad.unidad
                                )}

                                ${miniDato(
                                    "Reservado",
                                    disponibilidad.reservado,
                                    disponibilidad.unidad
                                )}

                                ${miniDato(
                                    "Entregado",
                                    disponibilidad.consumido,
                                    disponibilidad.unidad
                                )}

                                ${miniDato(
                                    "Disponible",
                                    disponibilidad.disponible,
                                    disponibilidad.unidad,
                                    true
                                )}

                            </div>

                        `

                        : ""
                }


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            1fr 0.7fr 1fr 1fr;
                        gap:12px;
                        align-items:end;
                    "
                >

                    <div class="form-group">

                        <label>
                            Cantidad *
                        </label>

                        <input
                            class="linea-cantidad"
                            data-index="${indice}"
                            type="number"
                            min="0.01"
                            step="0.01"

                            value="${escapar(
                                linea.cantidad
                                ??
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Unidad
                        </label>

                        <input
                            class="linea-unidad"
                            data-index="${indice}"
                            type="text"
                            disabled

                            value="${escapar(
                                produccion?.unidad
                                ||
                                linea.unidad
                                ||
                                "kg"
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Precio / unidad (€) *
                        </label>

                        <input
                            class="linea-precio"
                            data-index="${indice}"
                            type="number"
                            min="0"
                            step="0.01"

                            value="${escapar(
                                linea.precio
                                ??
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Subtotal
                        </label>

                        <input
                            class="linea-subtotal"
                            data-index="${indice}"
                            disabled

                            value="${formatearDinero(
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
                            )}"
                        >

                    </div>

                </div>

            </div>

        `;

    }


    // =====================================================
    // MINI DATO
    // =====================================================

    function miniDato(
        titulo,
        valor,
        unidad,
        verde = false
    ) {

        return `

            <div
                style="
                    background:
                        ${
                            verde
                                ? "#e7f5ed"
                                : "white"
                        };
                    padding:10px;
                    border-radius:8px;
                "
            >

                <span
                    style="
                        display:block;
                        color:#78837d;
                        font-size:11px;
                    "
                >
                    ${escapar(
                        titulo
                    )}
                </span>


                <strong
                    style="
                        ${
                            verde
                                ? "color:#176044;"
                                : ""
                        }
                    "
                >

                    ${formatearNumero(
                        valor
                    )}

                    ${escapar(
                        unidad
                    )}

                </strong>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS DE LÍNEAS
    // =====================================================

    function configurarEventosLineas(
        lineasFormulario,
        renderLineas
    ) {

        document
            .querySelectorAll(
                ".linea-produccion"
            )
            .forEach(
                select => {

                    select
                        .addEventListener(
                            "change",
                            () => {

                                const indice =
                                    Number(
                                        select.dataset.index
                                    );


                                const produccion =
                                    obtenerProduccionPorId(
                                        select.value
                                    );


                                lineasFormulario[
                                    indice
                                ].produccionId =
                                    select.value;


                                if (
                                    produccion
                                ) {

                                    lineasFormulario[
                                        indice
                                    ].unidad =
                                        produccion.unidad
                                        ||
                                        "kg";

                                }


                                renderLineas();

                            }
                        );

                }
            );


        document
            .querySelectorAll(
                ".linea-cantidad"
            )
            .forEach(
                input => {

                    input
                        .addEventListener(
                            "input",
                            () => {

                                const indice =
                                    Number(
                                        input.dataset.index
                                    );


                                lineasFormulario[
                                    indice
                                ].cantidad =
                                    input.value;


                                actualizarSubtotalLinea(
                                    indice
                                );


                                calcularTotalFormulario();

                            }
                        );

                }
            );


        document
            .querySelectorAll(
                ".linea-precio"
            )
            .forEach(
                input => {

                    input
                        .addEventListener(
                            "input",
                            () => {

                                const indice =
                                    Number(
                                        input.dataset.index
                                    );


                                lineasFormulario[
                                    indice
                                ].precio =
                                    input.value;


                                actualizarSubtotalLinea(
                                    indice
                                );


                                calcularTotalFormulario();

                            }
                        );

                }
            );


        document
            .querySelectorAll(
                ".quitar-linea-albaran"
            )
            .forEach(
                boton => {

                    boton
                        .addEventListener(
                            "click",
                            () => {

                                lineasFormulario.splice(
                                    Number(
                                        boton.dataset.index
                                    ),
                                    1
                                );


                                renderLineas();

                            }
                        );

                }
            );

    }


    // =====================================================
    // ACTUALIZAR SUBTOTAL
    // =====================================================

    function actualizarSubtotalLinea(
        indice
    ) {

        const cantidad =
            document.querySelector(
                `.linea-cantidad[data-index="${indice}"]`
            );


        const precio =
            document.querySelector(
                `.linea-precio[data-index="${indice}"]`
            );


        const subtotal =
            document.querySelector(
                `.linea-subtotal[data-index="${indice}"]`
            );


        if (
            !cantidad
            ||
            !precio
            ||
            !subtotal
        ) {

            return;

        }


        subtotal.value =
            formatearDinero(
                Number(
                    cantidad.value
                    ||
                    0
                )
                *
                Number(
                    precio.value
                    ||
                    0
                )
            );

    }


    // =====================================================
    // CALCULAR TOTAL
    // =====================================================

    function calcularTotalFormulario() {

        const bloques =
            document.querySelectorAll(
                ".albaran-linea-form"
            );


        let total =
            0;


        bloques.forEach(
            bloque => {

                const cantidad =
                    Number(
                        bloque
                            .querySelector(
                                ".linea-cantidad"
                            )
                            ?.value
                        ||
                        0
                    );


                const precio =
                    Number(
                        bloque
                            .querySelector(
                                ".linea-precio"
                            )
                            ?.value
                        ||
                        0
                    );


                total +=
                    cantidad *
                    precio;

            }
        );


        const elemento =
            document.getElementById(
                "totalAlbaran"
            );


        if (
            elemento
        ) {

            elemento.textContent =
                formatearDinero(
                    total
                );

        }


        return total;

    }


    // =====================================================
    // LEER LÍNEAS
    // =====================================================

    function leerLineasFormulario() {

        return Array.from(
            document.querySelectorAll(
                ".albaran-linea-form"
            )
        )
            .map(
                bloque => {

                    const produccionId =
                        bloque
                            .querySelector(
                                ".linea-produccion"
                            )
                            ?.value
                        ||
                        "";


                    const produccion =
                        obtenerProduccionPorId(
                            produccionId
                        );


                    return {

                        id:
                            bloque.dataset.lineaId
                            ||
                            Date.now(),

                        produccionId:
                            produccionId,

                        cantidad:
                            bloque
                                .querySelector(
                                    ".linea-cantidad"
                                )
                                ?.value
                            ||
                            "",

                        unidad:
                            produccion?.unidad
                            ||
                            "kg",

                        precio:
                            bloque
                                .querySelector(
                                    ".linea-precio"
                                )
                                ?.value
                            ??
                            ""

                    };

                }
            );

    }


    // =====================================================
    // PRODUCCIONES
    // =====================================================

    function obtenerProducciones() {

        if (
            produccionService
            &&
            typeof
            produccionService
                .obtenerTodos ===
            "function"
        ) {

            return (
                produccionService
                    .obtenerTodos()
                ||
                []
            );

        }


        if (
            produccionService
            &&
            typeof
            produccionService
                .obtenerTodas ===
            "function"
        ) {

            return (
                produccionService
                    .obtenerTodas()
                ||
                []
            );

        }


        return [];

    }


    function obtenerProduccionPorId(
        id
    ) {

        if (
            !id
        ) {

            return null;

        }


        if (
            produccionService
            &&
            typeof
            produccionService
                .obtenerPorId ===
            "function"
        ) {

            return (
                produccionService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return (
            obtenerProducciones()
                .find(
                    produccion =>
                        String(
                            produccion.id
                            ??
                            ""
                        )
                        ===
                        String(
                            id
                            ??
                            ""
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // COMPATIBILIDAD LÍNEAS ANTIGUAS
    // =====================================================

    function obtenerLineasAlbaran(
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
            albaran?.produccionId
        ) {

            return [
                {

                    produccionId:
                        albaran.produccionId,

                    cultivoId:
                        albaran.cultivoId
                        ??
                        null,

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

                    pasada:
                        albaran.pasada
                        ||
                        "1ª",

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
    // API PÚBLICA
    // =====================================================

    return {

        crearLineaVacia,

        obtenerLineasFormulario,

        crearLineaFormulario,

        miniDato,

        configurarEventosLineas,

        actualizarSubtotalLinea,

        calcularTotalFormulario,

        leerLineasFormulario,

        obtenerProducciones,

        obtenerProduccionPorId,

        obtenerLineasAlbaran

    };

}