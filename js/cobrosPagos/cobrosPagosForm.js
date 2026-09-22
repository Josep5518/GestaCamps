import {
    escaparHTML,
    formatearDinero,
    obtenerFechaHoy
} from "../utils.js";


export function crearCobrosPagosFormHelper({
    mainContent,
    cobroPagoService,
    obtenerFacturas,
    obtenerGastos,
    crearMiniDato,
    onVolver
}) {

    // =====================================================
    // FORMULARIO COBRO
    // =====================================================

    function mostrarFormularioCobro(
        facturaInicialId = null
    ) {

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
                    String(
                        factura.id
                    )
                    ===
                    String(
                        facturaSeleccionadaId
                    )
            )
        ) {

            facturaSeleccionadaId =
                facturas[0].id;

        }


        mainContent.innerHTML = `

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
                                        value="${escaparHTML(
                                            factura.id
                                        )}"

                                        ${
                                            String(
                                                factura.id
                                            )
                                            ===
                                            String(
                                                facturaSeleccionadaId
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${escaparHTML(
                                            factura.numero
                                        )}

                                        ·

                                        ${escaparHTML(
                                            factura.clienteNombre
                                            ||
                                            factura.cliente
                                            ||
                                            "Sin cliente"
                                        )}

                                        · Pendiente:

                                        ${formatearDinero(
                                            cobroPagoService
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
                        value="${obtenerFechaHoy()}"
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

                        ${crearOpcionesMetodo()}

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


        configurarFormularioCobro(
            facturas
        );

    }


    // =====================================================
    // CONFIGURAR COBRO
    // =====================================================

    function configurarFormularioCobro(
        facturas
    ) {

        const facturaSelect =
            document.getElementById(
                "facturaCobro"
            );


        const actualizarFactura =
            () => {

                const facturaId =
                    facturaSelect.value;


                const factura =
                    facturas.find(
                        item =>
                            String(
                                item.id
                            )
                            ===
                            String(
                                facturaId
                            )
                    );


                if (
                    !factura
                ) {

                    return;

                }


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


                const resumen =
                    document.getElementById(
                        "resumenFacturaCobro"
                    );


                if (
                    resumen
                ) {

                    resumen.innerHTML = `

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

                            ${crearMiniDato(
                                "Total factura",
                                total
                            )}

                            ${crearMiniDato(
                                "Ya cobrado",
                                cobrado
                            )}

                            ${crearMiniDato(
                                "Pendiente",
                                pendiente,
                                true
                            )}

                        </div>

                    `;

                }


                const importe =
                    document.getElementById(
                        "importeCobro"
                    );


                if (
                    importe
                ) {

                    importe.max =
                        pendiente.toFixed(
                            2
                        );

                    importe.value =
                        pendiente.toFixed(
                            2
                        );

                }


                const limite =
                    document.getElementById(
                        "limiteCobro"
                    );


                if (
                    limite
                ) {

                    limite.textContent =
                        `Máximo permitido: ${formatearDinero(
                            pendiente
                        )}`;

                }

            };


        facturaSelect
            ?.addEventListener(
                "change",
                actualizarFactura
            );


        actualizarFactura();


        document
            .getElementById(
                "volverCobros"
            )
            ?.addEventListener(
                "click",
                onVolver
            );


        document
            .getElementById(
                "cancelarCobro"
            )
            ?.addEventListener(
                "click",
                onVolver
            );


        document
            .getElementById(
                "guardarCobro"
            )
            ?.addEventListener(
                "click",
                guardarCobro
            );

    }


    // =====================================================
    // GUARDAR COBRO
    // =====================================================

    function guardarCobro() {

        const resultado =
            cobroPagoService
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


        onVolver();

    }


    // =====================================================
    // FORMULARIO PAGO
    // =====================================================

    function mostrarFormularioPago() {

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

            alert(
                "No hay gastos pendientes de pago."
            );

            return;

        }


        mainContent.innerHTML = `

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
                                        value="${escaparHTML(
                                            gasto.id
                                        )}"
                                    >

                                        ${escaparHTML(
                                            gasto.concepto
                                        )}

                                        ·

                                        ${escaparHTML(
                                            gasto.proveedor
                                            ||
                                            gasto.proveedorNombre
                                            ||
                                            "Sin proveedor"
                                        )}

                                        · Pendiente:

                                        ${formatearDinero(
                                            cobroPagoService
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
                        value="${obtenerFechaHoy()}"
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

                        ${crearOpcionesMetodo()}

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


        configurarFormularioPago();

    }


    // =====================================================
    // CONFIGURAR PAGO
    // =====================================================

    function configurarFormularioPago() {

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
                    cobroPagoService
                        .obtenerPendienteGasto(
                            gastoId
                        );


                const input =
                    document.getElementById(
                        "importePago"
                    );


                if (
                    input
                ) {

                    input.value =
                        pendiente.toFixed(
                            2
                        );

                    input.max =
                        pendiente.toFixed(
                            2
                        );

                }


                const limite =
                    document.getElementById(
                        "limitePago"
                    );


                if (
                    limite
                ) {

                    limite.textContent =
                        `Máximo permitido: ${formatearDinero(
                            pendiente
                        )}`;

                }

            };


        gastoSelect
            ?.addEventListener(
                "change",
                completarImporte
            );


        completarImporte();


        document
            .getElementById(
                "volverPagos"
            )
            ?.addEventListener(
                "click",
                onVolver
            );


        document
            .getElementById(
                "cancelarPago"
            )
            ?.addEventListener(
                "click",
                onVolver
            );


        document
            .getElementById(
                "guardarPago"
            )
            ?.addEventListener(
                "click",
                guardarPago
            );

    }


    // =====================================================
    // GUARDAR PAGO
    // =====================================================

    function guardarPago() {

        const resultado =
            cobroPagoService
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


        onVolver();

    }


    // =====================================================
    // MÉTODOS DE PAGO
    // =====================================================

    function crearOpcionesMetodo() {

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

                    <option
                        value="${escaparHTML(
                            metodo
                        )}"
                    >
                        ${escaparHTML(
                            metodo
                        )}
                    </option>

                `
            )
            .join("");

    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    return {

        mostrarFormularioCobro,

        mostrarFormularioPago,

        crearOpcionesMetodo

    };

}