export function crearProduccionFormHelper({
    mainContent,
    produccionService,
    cultivoService,
    stockHelper,
    mismoId,
    escapar,
    formatearNumero,
    obtenerFechaHoy,
    onVolver
}) {

    // =====================================================
    // MOSTRAR FORMULARIO
    // =====================================================

    function mostrarFormulario(
        id = null
    ) {

        const editando =
            id !== null;


        const registro =
            editando

                ? produccionService
                    .obtenerPorId(
                        id
                    )

                : null;


        if (
            editando
            &&
            !registro
        ) {

            alert(
                "No se ha encontrado el registro de producción."
            );

            return;

        }


        const cultivos =
            cultivoService
                .obtenerTodos();


        if (
            cultivos.length === 0
        ) {

            alert(
                "Primero debes crear un cultivo."
            );

            return;

        }


        let cultivoSeleccionadoId =
            registro?.cultivoId
            ??
            null;


        // =================================================
        // COMPATIBILIDAD CON REGISTROS ANTIGUOS
        // =================================================

        if (
            editando
            &&
            !cultivoSeleccionadoId
        ) {

            const normalizar =
                texto =>
                    String(
                        texto
                        ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


            let cultivoEncontrado =
                cultivos.find(
                    cultivo =>
                        normalizar(
                            cultivo.tipo
                        )
                        ===
                        normalizar(
                            registro.producto
                        )
                        &&
                        normalizar(
                            cultivo.variedad
                        )
                        ===
                        normalizar(
                            registro.variedad
                        )
                        &&
                        (
                            !registro.fincaId
                            ||
                            mismoId(
                                cultivo.fincaId,
                                registro.fincaId
                            )
                        )
                );


            if (
                !cultivoEncontrado
            ) {

                cultivoEncontrado =
                    cultivos.find(
                        cultivo =>
                            normalizar(
                                cultivo.variedad
                            )
                            ===
                            normalizar(
                                registro.variedad
                            )
                            &&
                            (
                                !registro.fincaId
                                ||
                                mismoId(
                                    cultivo.fincaId,
                                    registro.fincaId
                                )
                            )
                    );

            }


            if (
                !cultivoEncontrado
            ) {

                cultivoEncontrado =
                    cultivos.find(
                        cultivo =>
                            normalizar(
                                cultivo.tipo
                            )
                            ===
                            normalizar(
                                registro.producto
                            )
                            &&
                            (
                                !registro.fincaId
                                ||
                                mismoId(
                                    cultivo.fincaId,
                                    registro.fincaId
                                )
                            )
                    );

            }


            if (
                cultivoEncontrado
            ) {

                cultivoSeleccionadoId =
                    cultivoEncontrado.id;

            }

        }


        const cantidadReservada =
            editando

                ? stockHelper
                    .obtenerCantidadReservada(
                        registro.id
                    )

                : 0;


        const cantidadEntregada =
            editando

                ? stockHelper
                    .obtenerCantidadEntregada(
                        registro.id
                    )

                : 0;


        const cantidadUtilizada =
            cantidadReservada
            +
            cantidadEntregada;


        const tieneSalidas =
            cantidadUtilizada >
            0;


        const cultivoOriginalId =
            editando

                ? cultivoSeleccionadoId

                : null;


        const unidadOriginal =
            editando

                ? String(
                    registro.unidad
                    ||
                    "kg"
                )

                : null;


        renderizarFormulario({
            editando,
            registro,
            cultivos,
            cultivoSeleccionadoId,
            cantidadReservada,
            cantidadEntregada,
            cantidadUtilizada,
            tieneSalidas
        });


        configurarFormulario({
            editando,
            registro,
            cultivoOriginalId,
            unidadOriginal,
            cantidadReservada,
            cantidadEntregada,
            cantidadUtilizada,
            tieneSalidas
        });

    }


    // =====================================================
    // RENDER FORMULARIO
    // =====================================================

    function renderizarFormulario({
        editando,
        registro,
        cultivos,
        cultivoSeleccionadoId,
        cantidadReservada,
        cantidadEntregada,
        cantidadUtilizada,
        tieneSalidas
    }) {

        mainContent.innerHTML = `

            <button
                id="volverProduccion"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        ${
                            editando
                                ? "Editar producción"
                                : "Nueva producción"
                        }
                    </h2>

                    <p>
                        ${
                            editando
                                ? "Modifica los datos del registro"
                                : "Registra una nueva producción"
                        }
                    </p>

                </div>

            </header>


            <div class="form-panel">


                ${
                    tieneSalidas

                        ? `

                            <div
                                style="
                                    background:#fff7e6;
                                    color:#845b15;
                                    border:1px solid #f2d7a0;
                                    padding:14px 16px;
                                    border-radius:10px;
                                    margin-bottom:18px;
                                    line-height:1.5;
                                "
                            >

                                ⚠️ Esta producción está vinculada a albaranes.

                                <br><br>


                                ${
                                    cantidadReservada > 0

                                        ? `

                                            Reservado:

                                            <strong>
                                                ${formatearNumero(
                                                    cantidadReservada
                                                )}
                                                ${escapar(
                                                    registro.unidad
                                                    ||
                                                    "kg"
                                                )}
                                            </strong>

                                            <br>

                                        `

                                        : ""
                                }


                                ${
                                    cantidadEntregada > 0

                                        ? `

                                            Entregado:

                                            <strong>
                                                ${formatearNumero(
                                                    cantidadEntregada
                                                )}
                                                ${escapar(
                                                    registro.unidad
                                                    ||
                                                    "kg"
                                                )}
                                            </strong>

                                            <br>

                                        `

                                        : ""
                                }


                                Total ocupado:

                                <strong>
                                    ${formatearNumero(
                                        cantidadUtilizada
                                    )}
                                    ${escapar(
                                        registro.unidad
                                        ||
                                        "kg"
                                    )}
                                </strong>


                                <br><br>


                                Para mantener la trazabilidad,
                                no puedes cambiar el cultivo, la pasada ni la unidad.

                                Tampoco puedes reducir la producción
                                por debajo del total reservado y entregado.

                            </div>

                        `

                        : ""
                }


                <div class="form-group">

                    <label>
                        Cultivo *
                    </label>

                    <select
                        id="cultivoProduccion"
                        ${tieneSalidas ? "disabled" : ""}
                    >

                        <option value="">
                            Selecciona un cultivo
                        </option>


                        ${cultivos
                            .map(
                                cultivo => `

                                    <option
                                        value="${escapar(
                                            cultivo.id
                                        )}"

                                        ${
                                            mismoId(
                                                cultivoSeleccionadoId,
                                                cultivo.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${escapar(
                                            cultivo.tipo
                                        )}

                                        ·

                                        ${escapar(
                                            cultivo.variedad
                                        )}

                                        ·

                                        ${escapar(
                                            cultivo.fincaNombre
                                        )}

                                        ${
                                            cultivo.campaniaNombre

                                                ? ` · ${escapar(
                                                    cultivo.campaniaNombre
                                                )}`

                                                : ""
                                        }

                                    </option>

                                `
                            )
                            .join("")}

                    </select>


                    ${
                        tieneSalidas

                            ? `

                                <small
                                    style="
                                        display:block;
                                        margin-top:5px;
                                        color:#68756f;
                                    "
                                >
                                    🔒 Bloqueado porque esta producción ya tiene movimientos.
                                </small>

                            `

                            : ""
                    }

                </div>


                <div class="form-group">

                    <label>
                        Producto
                    </label>

                    <input
                        id="productoProduccion"
                        type="text"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label>
                        Variedad
                    </label>

                    <input
                        id="variedadProduccion"
                        type="text"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label>
                        Finca
                    </label>

                    <input
                        id="fincaProduccion"
                        type="text"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label>
                        Parcela
                    </label>

                    <input
                        id="parcelaProduccion"
                        type="text"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label>
                        Campanya
                    </label>

                    <input
                        id="campaniaProduccion"
                        type="text"
                        disabled
                    >

                </div>


                <div class="form-group">

                    <label>
                        Pasada *
                    </label>

                    <select
                        id="pasadaProduccion"
                        ${tieneSalidas ? "disabled" : ""}
                    >

                        <option
                            value="1ª"

                            ${
                                !registro
                                ||
                                (
                                    registro.pasada
                                    ||
                                    "1ª"
                                )
                                ===
                                "1ª"

                                    ? "selected"
                                    : ""
                            }
                        >
                            1ª pasada
                        </option>


                        <option
                            value="2ª"

                            ${
                                registro?.pasada ===
                                "2ª"

                                    ? "selected"
                                    : ""
                            }
                        >
                            2ª pasada
                        </option>


                        <option
                            value="3ª"

                            ${
                                registro?.pasada ===
                                "3ª"

                                    ? "selected"
                                    : ""
                            }
                        >
                            3ª pasada
                        </option>


                        <option
                            value="R"

                            ${
                                registro?.pasada ===
                                "R"

                                    ? "selected"
                                    : ""
                            }
                        >
                            R · Repaso
                        </option>

                    </select>


                    <small
                        style="
                            display:block;
                            margin-top:5px;
                            color:#68756f;
                        "
                    >
                        Indica a qué pasada de recolección corresponde este registro.
                    </small>

                </div>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(3,minmax(0,1fr));
                        gap:12px;
                        align-items:end;
                    "
                >

                    <div class="form-group">

                        <label>
                            Peso bruto *
                        </label>

                        <input
                            id="pesoBrutoProduccion"
                            type="number"
                            min="0.01"
                            step="0.01"

                            value="${
                                registro?.pesoBruto
                                ??
                                registro?.cantidad
                                ??
                                ""
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Tara *
                        </label>

                        <input
                            id="taraProduccion"
                            type="number"
                            min="0"
                            step="0.01"

                            value="${
                                registro?.tara
                                ??
                                0
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Peso neto
                        </label>

                        <input
                            id="pesoNetoProduccion"
                            type="number"
                            disabled

                            value="${
                                registro?.pesoNeto
                                ??
                                registro?.cantidad
                                ??
                                ""
                            }"
                        >

                    </div>

                </div>


                <div
                    style="
                        margin-top:-2px;
                        margin-bottom:14px;
                        color:#68756f;
                        font-size:12px;
                        line-height:1.5;
                    "
                >

                    ⚖️ El peso neto se calcula automáticamente: bruto − tara.

                    ${
                        tieneSalidas

                            ? `

                                <br>

                                Mínimo neto permitido:

                                <strong>
                                    ${formatearNumero(
                                        cantidadUtilizada
                                    )}
                                    ${escapar(
                                        registro.unidad
                                        ||
                                        "kg"
                                    )}
                                </strong>

                                (${formatearNumero(
                                    cantidadReservada
                                )} reservados +

                                ${formatearNumero(
                                    cantidadEntregada
                                )} entregados).

                            `

                            : ""
                    }

                </div>


                <div class="form-group">

                    <label>
                        Unidad
                    </label>

                    <select
                        id="unidadProduccion"
                        ${tieneSalidas ? "disabled" : ""}
                    >

                        <option
                            value="kg"

                            ${
                                !registro
                                ||
                                registro.unidad ===
                                "kg"

                                    ? "selected"
                                    : ""
                            }
                        >
                            kg
                        </option>


                        <option
                            value="t"

                            ${
                                registro?.unidad ===
                                "t"

                                    ? "selected"
                                    : ""
                            }
                        >
                            toneladas
                        </option>


                        <option
                            value="cajas"

                            ${
                                registro?.unidad ===
                                "cajas"

                                    ? "selected"
                                    : ""
                            }
                        >
                            cajas
                        </option>

                    </select>


                    ${
                        tieneSalidas

                            ? `

                                <small
                                    style="
                                        display:block;
                                        margin-top:5px;
                                        color:#68756f;
                                    "
                                >
                                    🔒 La unidad no puede cambiar cuando existen movimientos.
                                </small>

                            `

                            : ""
                    }

                </div>


                <div class="form-group">

                    <label>
                        Fecha *
                    </label>

                    <input
                        id="fechaProduccion"
                        type="date"

                        value="${
                            registro?.fecha
                            ||
                            obtenerFechaHoy()
                        }"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Observaciones
                    </label>

                    <textarea
                        id="observacionesProduccion"
                        rows="5"
                        placeholder="Observaciones..."
                    >${escapar(
                        registro?.observaciones
                        ||
                        ""
                    )}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarProduccion"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarProduccion"
                        class="primary-button"
                        type="button"
                    >

                        ${
                            editando
                                ? "Guardar cambios"
                                : "Registrar producción"
                        }

                    </button>

                </div>

            </div>

        `;

    }


    // =====================================================
    // CONFIGURAR FORMULARIO
    // =====================================================

    function configurarFormulario({
        editando,
        registro,
        cultivoOriginalId,
        unidadOriginal,
        cantidadReservada,
        cantidadEntregada,
        cantidadUtilizada,
        tieneSalidas
    }) {

        const cultivoSelect =
            document.getElementById(
                "cultivoProduccion"
            );


        const productoInput =
            document.getElementById(
                "productoProduccion"
            );


        const variedadInput =
            document.getElementById(
                "variedadProduccion"
            );


        const fincaInput =
            document.getElementById(
                "fincaProduccion"
            );


        const parcelaInput =
            document.getElementById(
                "parcelaProduccion"
            );


        const campaniaInput =
            document.getElementById(
                "campaniaProduccion"
            );


        // =================================================
        // COMPLETAR DATOS DEL CULTIVO
        // =================================================

        const completarDatosCultivo =
            () => {

                const cultivoId =
                    cultivoSelect.value;


                const cultivo =
                    cultivoService
                        .obtenerPorId(
                            cultivoId
                        );


                if (
                    !cultivo
                ) {

                    productoInput.value =
                        "";

                    variedadInput.value =
                        "";

                    fincaInput.value =
                        "";

                    parcelaInput.value =
                        "";

                    campaniaInput.value =
                        "";

                    return;

                }


                productoInput.value =
                    cultivo.tipo
                    ||
                    "";


                variedadInput.value =
                    cultivo.variedad
                    ||
                    "";


                fincaInput.value =
                    cultivo.fincaNombre
                    ||
                    "";


                parcelaInput.value =
                    cultivo.parcela
                    ||
                    "";


                campaniaInput.value =
                    cultivo.campaniaNombre
                    ||
                    "";

            };


        if (
            !tieneSalidas
        ) {

            cultivoSelect
                .addEventListener(
                    "change",
                    completarDatosCultivo
                );

        }


        completarDatosCultivo();


        // =================================================
        // PESO NETO
        // =================================================

        const pesoBrutoInput =
            document.getElementById(
                "pesoBrutoProduccion"
            );


        const taraInput =
            document.getElementById(
                "taraProduccion"
            );


        const pesoNetoInput =
            document.getElementById(
                "pesoNetoProduccion"
            );


        const actualizarPesoNeto =
            () => {

                const bruto =
                    Number(
                        pesoBrutoInput.value
                        ||
                        0
                    );


                const tara =
                    Number(
                        taraInput.value
                        ||
                        0
                    );


                const neto =
                    Number.isFinite(
                        bruto
                    )
                    &&
                    Number.isFinite(
                        tara
                    )

                        ? Math.max(
                            0,
                            bruto - tara
                        )

                        : 0;


                pesoNetoInput.value =
                    Number(
                        neto.toFixed(
                            2
                        )
                    );

            };


        pesoBrutoInput
            .addEventListener(
                "input",
                actualizarPesoNeto
            );


        taraInput
            .addEventListener(
                "input",
                actualizarPesoNeto
            );


        actualizarPesoNeto();


        // =================================================
        // VOLVER
        // =================================================

        document
            .getElementById(
                "volverProduccion"
            )
            ?.addEventListener(
                "click",
                () => {

                    onVolver();

                }
            );


        // =================================================
        // CANCELAR
        // =================================================

        document
            .getElementById(
                "cancelarProduccion"
            )
            ?.addEventListener(
                "click",
                () => {

                    onVolver();

                }
            );


        // =================================================
        // GUARDAR
        // =================================================

        document
            .getElementById(
                "guardarProduccion"
            )
            ?.addEventListener(
                "click",
                () => {

                    guardarProduccion({
                        editando,
                        registro,
                        cultivoOriginalId,
                        unidadOriginal,
                        cantidadReservada,
                        cantidadEntregada,
                        cantidadUtilizada,
                        tieneSalidas
                    });

                }
            );

    }


    // =====================================================
    // GUARDAR PRODUCCIÓN
    // =====================================================

    function guardarProduccion({
        editando,
        registro,
        cultivoOriginalId,
        unidadOriginal,
        cantidadReservada,
        cantidadEntregada,
        cantidadUtilizada,
        tieneSalidas
    }) {

        const cultivoId =
            document
                .getElementById(
                    "cultivoProduccion"
                )
                .value;


        if (
            !cultivoId
        ) {

            alert(
                "Selecciona un cultivo."
            );

            return;

        }


        const unidad =
            document
                .getElementById(
                    "unidadProduccion"
                )
                .value;


        const pesoBruto =
            Number(
                document
                    .getElementById(
                        "pesoBrutoProduccion"
                    )
                    .value
            );


        const tara =
            Number(
                document
                    .getElementById(
                        "taraProduccion"
                    )
                    .value
            );


        if (
            !Number.isFinite(
                pesoBruto
            )
            ||
            pesoBruto <= 0
        ) {

            alert(
                "Introduce un peso bruto válido."
            );

            return;

        }


        if (
            !Number.isFinite(
                tara
            )
            ||
            tara < 0
        ) {

            alert(
                "Introduce una tara válida."
            );

            return;

        }


        if (
            tara >= pesoBruto
        ) {

            alert(
                "La tara debe ser menor que el peso bruto."
            );

            return;

        }


        const pesoNeto =
            Number(
                (
                    pesoBruto
                    -
                    tara
                )
                    .toFixed(
                        2
                    )
            );


        // =================================================
        // TRAZABILIDAD
        // =================================================

        if (
            editando
            &&
            tieneSalidas
        ) {

            if (
                !mismoId(
                    cultivoId,
                    cultivoOriginalId
                )
            ) {

                alert(
                    "No puedes cambiar el cultivo de esta producción porque ya está vinculada a albaranes."
                );

                return;

            }


            if (
                String(
                    unidad
                )
                !==
                String(
                    unidadOriginal
                )
            ) {

                alert(
                    "No puedes cambiar la unidad de esta producción porque ya está vinculada a albaranes."
                );

                return;

            }


            if (
                pesoNeto <
                cantidadUtilizada
            ) {

                alert(

                    `No puedes reducir esta producción a `
                    +
                    `${formatearNumero(
                        pesoNeto
                    )} ${registro.unidad || "kg"} `
                    +
                    `porque hay `
                    +
                    `${formatearNumero(
                        cantidadReservada
                    )} ${registro.unidad || "kg"} reservados `
                    +
                    `y `
                    +
                    `${formatearNumero(
                        cantidadEntregada
                    )} ${registro.unidad || "kg"} entregados.`

                );

                return;

            }

        }


        const datos = {

            cultivoId:
                cultivoId,

            pasada:
                document
                    .getElementById(
                        "pasadaProduccion"
                    )
                    .value,

            pesoBruto:
                pesoBruto,

            tara:
                tara,

            pesoNeto:
                pesoNeto,

            cantidad:
                pesoNeto,

            unidad:
                unidad,

            fecha:
                document
                    .getElementById(
                        "fechaProduccion"
                    )
                    .value,

            observaciones:
                document
                    .getElementById(
                        "observacionesProduccion"
                    )
                    .value

        };


        let resultado =
            editando

                ? produccionService
                    .editar(
                        registro.id,
                        datos
                    )

                : produccionService
                    .crear(
                        datos
                    );


        // =================================================
        // DUPLICADO
        // =================================================

        if (
            !resultado.ok
            &&
            resultado.duplicado ===
            true
        ) {

            const confirmar =
                confirm(
                    `${resultado.mensaje}\n\n¿Quieres guardarlo igualmente?`
                );


            if (
                !confirmar
            ) {

                return;

            }


            datos.confirmarDuplicado =
                true;


            resultado =
                editando

                    ? produccionService
                        .editar(
                            registro.id,
                            datos
                        )

                    : produccionService
                        .crear(
                            datos
                        );

        }


        if (
            !resultado.ok
        ) {

            alert(
                resultado.mensaje
            );

            return;

        }


        onVolver();

    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    return {

        mostrarFormulario

    };

}