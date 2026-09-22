import {
    escaparHTML,
    formatearDinero,
    obtenerFechaHoy
} from "../utils.js";


export function crearFacturacionFormHelper({
    mainContent,
    facturaService,
    obtenerAlbaranes,
    onVolver
}) {

    // =====================================================
    // MOSTRAR FORMULARIO
    // =====================================================

    function mostrarFormulario() {

        const albaranes =
            obtenerAlbaranes()
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


        mainContent.innerHTML = `

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
                        value="${obtenerFechaHoy()}"
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
                                            value="${escaparHTML(
                                                albaran.id
                                            )}"
                                        >

                                        <strong>
                                            ${escaparHTML(
                                                albaran.numero
                                            )}
                                        </strong>

                                        ·

                                        ${escaparHTML(
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
                                                    ${escaparHTML(
                                                        albaran.campaniaNombre
                                                    )}
                                                `

                                                : ""
                                        }

                                    </div>


                                    <strong>
                                        ${formatearDinero(
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


        configurarEventosFormulario(
            albaranes
        );

    }


    // =====================================================
    // EVENTOS FORMULARIO
    // =====================================================

    function configurarEventosFormulario(
        albaranes
    ) {

        const actualizarBase =
            () => {

                const ids =
                    obtenerIdsSeleccionados();


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


                const elemento =
                    document.getElementById(
                        "baseSeleccionadaFactura"
                    );


                if (
                    elemento
                ) {

                    elemento.textContent =
                        formatearDinero(
                            base
                        );

                }

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
            ?.addEventListener(
                "click",
                () => {

                    onVolver();

                }
            );


        document
            .getElementById(
                "cancelarFactura"
            )
            ?.addEventListener(
                "click",
                () => {

                    onVolver();

                }
            );


        document
            .getElementById(
                "guardarFactura"
            )
            ?.addEventListener(
                "click",
                guardarFactura
            );

    }


    // =====================================================
    // GUARDAR FACTURA
    // =====================================================

    function guardarFactura() {

        const ids =
            obtenerIdsSeleccionados();


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
            facturaService
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


        onVolver();

    }


    // =====================================================
    // IDS SELECCIONADOS
    // =====================================================

    function obtenerIdsSeleccionados() {

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
    // API PÚBLICA
    // =====================================================

    return {

        mostrarFormulario,

        obtenerIdsSeleccionados

    };

}