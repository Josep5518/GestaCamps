import {
    escaparHTML,
    formatearDinero,
    obtenerFechaHoy
} from "../utils.js";


export function crearGastosFormHelper({
    mainContent,
    gastoService,
    obtenerFincas,
    obtenerMaquinaria,
    obtenerContactos,
    obtenerCampanyas,
    onVolver
}) {

    // =====================================================
    // FORMULARIO
    // =====================================================

    function mostrarFormulario(
        id = null
    ) {

        const editando =
            id !==
            null;


        const gasto =
            editando

                ? gastoService
                    .obtenerPorId(
                        id
                    )

                : null;


        if (
            editando
            &&
            !gasto
        ) {

            alert(
                "El gasto no existe."
            );

            return;

        }


        const fincas =
            obtenerFincas();


        const maquinaria =
            obtenerMaquinaria();


        const contactos =
            obtenerContactos();


        const proveedores =
            contactos.filter(
                contacto =>
                    String(
                        contacto.tipo
                        ||
                        ""
                    )
                        .toLowerCase()
                    ===
                    "proveedor"
            );


        const pagado =
            Number(
                gasto?.pagadoAcumulado
                ||
                0
            );


        const tienePagos =
            pagado >
            0.001;


        mainContent.innerHTML = `

            <button
                id="volverGastos"
                type="button"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        ${
                            editando
                                ? "Editar gasto"
                                : "Nuevo gasto"
                        }
                    </h2>

                    <p>
                        ${
                            editando
                                ? "Modifica los datos del gasto"
                                : "Registra un nuevo gasto de explotación"
                        }
                    </p>

                </div>

            </header>


            <div class="form-panel">


                ${
                    tienePagos

                        ? `
                            <div
                                style="
                                    margin-bottom:18px;
                                    background:#fff7e6;
                                    border:1px solid #f2d7a0;
                                    color:#845b15;
                                    border-radius:10px;
                                    padding:13px 15px;
                                    line-height:1.5;
                                "
                            >

                                ⚠️ Este gasto ya tiene

                                <strong>
                                    ${formatearDinero(
                                        pagado
                                    )}
                                </strong>

                                pagados.

                                No puedes reducir el importe total
                                por debajo de esa cantidad.

                                El estado de pago se gestiona
                                automáticamente desde Cobros y pagos.

                            </div>
                        `

                        : ""
                }


                <div class="form-group">

                    <label>
                        Concepto *
                    </label>

                    <input
                        id="conceptoGasto"
                        type="text"
                        placeholder="Ej. Fertilizante"
                        value="${escaparHTML(
                            gasto?.concepto
                            ||
                            ""
                        )}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Categoría *
                    </label>

                    <select id="categoriaGasto">

                        ${crearOpcionesCategoria(
                            gasto?.categoria
                        )}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Importe (€) *
                    </label>

                    <input
                        id="importeGasto"
                        type="number"
                        min="${
                            tienePagos
                                ? pagado
                                : "0.01"
                        }"
                        step="0.01"
                        value="${gasto?.importe ?? ""}"
                    >


                    ${
                        tienePagos

                            ? `
                                <small
                                    style="
                                        display:block;
                                        margin-top:5px;
                                        color:#68756f;
                                    "
                                >
                                    Mínimo permitido:
                                    ${formatearDinero(
                                        pagado
                                    )}
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
                        id="fechaGasto"
                        type="date"
                        value="${
                            gasto?.fecha
                            ||
                            obtenerFechaHoy()
                        }"
                    >

                </div>


                <div
                    class="form-group"
                    style="
                        background:#f5f7f5;
                        padding:12px;
                        border-radius:10px;
                    "
                >

                    <label>
                        Estado de pago
                    </label>

                    <strong
                        style="
                            display:block;
                            margin-top:5px;
                        "
                    >
                        ${
                            gasto?.estado
                            ||
                            "Pendiente"
                        }
                    </strong>

                    <small
                        style="
                            display:block;
                            margin-top:4px;
                            color:#68756f;
                        "
                    >
                        Se calcula automáticamente desde
                        Cobros y pagos.
                    </small>

                </div>


                <div class="form-group">

                    <label>
                        Proveedor
                    </label>

                    <select id="proveedorGasto">

                        <option value="">
                            Sin proveedor
                        </option>


                        ${proveedores
                            .map(
                                proveedor => `

                                    <option
                                        value="${escaparHTML(
                                            proveedor.id
                                        )}"

                                        ${
                                            String(
                                                gasto?.proveedorId
                                                ??
                                                ""
                                            )
                                            ===
                                            String(
                                                proveedor.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${escaparHTML(
                                            proveedor.nombre
                                            ||
                                            proveedor.razonSocial
                                            ||
                                            "Proveedor"
                                        )}

                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Finca
                    </label>

                    <select id="fincaGasto">

                        <option value="">
                            Sin finca
                        </option>


                        ${fincas
                            .map(
                                finca => `

                                    <option
                                        value="${escaparHTML(
                                            finca.id
                                        )}"

                                        ${
                                            String(
                                                gasto?.fincaId
                                                ??
                                                ""
                                            )
                                            ===
                                            String(
                                                finca.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${escaparHTML(
                                            finca.nombre
                                        )}

                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Parcela
                    </label>

                    <input
                        id="parcelaGasto"
                        type="text"
                        placeholder="Parcela"
                        value="${escaparHTML(
                            gasto?.parcela
                            ||
                            ""
                        )}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Campanya
                    </label>

                    <select
                        id="campaniaGasto"
                    ></select>

                </div>


                <div class="form-group">

                    <label>
                        Maquinaria
                    </label>

                    <select id="maquinariaGasto">

                        <option value="">
                            Sin maquinaria
                        </option>


                        ${maquinaria
                            .map(
                                maquina => `

                                    <option
                                        value="${escaparHTML(
                                            maquina.id
                                        )}"

                                        ${
                                            String(
                                                gasto?.maquinariaId
                                                ??
                                                ""
                                            )
                                            ===
                                            String(
                                                maquina.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${escaparHTML(
                                            [
                                                maquina.nombre,
                                                maquina.marca,
                                                maquina.modelo
                                            ]
                                                .filter(
                                                    Boolean
                                                )
                                                .join(
                                                    " · "
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
                        Observaciones
                    </label>

                    <textarea
                        id="observacionesGasto"
                        rows="5"
                        placeholder="Observaciones..."
                    >${escaparHTML(
                        gasto?.observaciones
                        ||
                        ""
                    )}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarGasto"
                        type="button"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarGasto"
                        type="button"
                        class="primary-button"
                    >
                        ${
                            editando
                                ? "Guardar cambios"
                                : "Crear gasto"
                        }
                    </button>

                </div>

            </div>

        `;


        configurarCampanyas(
            gasto
        );


        configurarEventosFormulario(
            id,
            editando
        );

    }


    // =====================================================
    // CAMPANYAS
    // =====================================================

    function configurarCampanyas(
        gasto
    ) {

        const fincaSelect =
            document.getElementById(
                "fincaGasto"
            );


        const campaniaSelect =
            document.getElementById(
                "campaniaGasto"
            );


        if (
            !fincaSelect
            ||
            !campaniaSelect
        ) {

            return;

        }


        const cargarCampanyas =
            () => {

                const fincaId =
                    fincaSelect.value;


                if (
                    !fincaId
                ) {

                    campaniaSelect.innerHTML = `

                        <option value="">
                            Sin campanya
                        </option>

                    `;

                    return;

                }


                const campanyas =
                    obtenerCampanyas()
                        .filter(
                            campania =>
                                String(
                                    campania.fincaId
                                )
                                ===
                                String(
                                    fincaId
                                )
                        );


                campaniaSelect.innerHTML = `

                    <option value="">
                        Sin campanya
                    </option>


                    ${campanyas
                        .map(
                            campania => `

                                <option
                                    value="${escaparHTML(
                                        campania.id
                                    )}"
                                >

                                    ${escaparHTML(
                                        campania.nombre
                                    )}

                                    ${
                                        campania.estado

                                            ? `
                                                ·
                                                ${escaparHTML(
                                                    campania.estado
                                                )}
                                            `

                                            : ""
                                    }

                                </option>

                            `
                        )
                        .join("")}

                `;


                if (
                    gasto?.campaniaId
                    &&
                    campanyas.some(
                        campania =>
                            String(
                                campania.id
                            )
                            ===
                            String(
                                gasto.campaniaId
                            )
                    )
                ) {

                    campaniaSelect.value =
                        String(
                            gasto.campaniaId
                        );

                    return;

                }


                if (
                    campanyas.length ===
                    1
                ) {

                    campaniaSelect.value =
                        String(
                            campanyas[0].id
                        );

                }

            };


        fincaSelect.addEventListener(
            "change",
            cargarCampanyas
        );


        cargarCampanyas();

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    function configurarEventosFormulario(
        id,
        editando
    ) {

        document
            .getElementById(
                "volverGastos"
            )
            ?.addEventListener(
                "click",
                () => {

                    onVolver();

                }
            );


        document
            .getElementById(
                "cancelarGasto"
            )
            ?.addEventListener(
                "click",
                () => {

                    onVolver();

                }
            );


        document
            .getElementById(
                "guardarGasto"
            )
            ?.addEventListener(
                "click",
                () => {

                    guardarGasto(
                        id,
                        editando
                    );

                }
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    function guardarGasto(
        id,
        editando
    ) {

        const datos = {

            concepto:
                document
                    .getElementById(
                        "conceptoGasto"
                    )
                    .value,

            categoria:
                document
                    .getElementById(
                        "categoriaGasto"
                    )
                    .value,

            importe:
                Number(
                    document
                        .getElementById(
                            "importeGasto"
                        )
                        .value
                ),

            fecha:
                document
                    .getElementById(
                        "fechaGasto"
                    )
                    .value,

            proveedorId:
                document
                    .getElementById(
                        "proveedorGasto"
                    )
                    .value
                ||
                null,

            fincaId:
                document
                    .getElementById(
                        "fincaGasto"
                    )
                    .value
                ||
                null,

            parcela:
                document
                    .getElementById(
                        "parcelaGasto"
                    )
                    .value,

            campaniaId:
                document
                    .getElementById(
                        "campaniaGasto"
                    )
                    .value
                ||
                null,

            maquinariaId:
                document
                    .getElementById(
                        "maquinariaGasto"
                    )
                    .value
                ||
                null,

            observaciones:
                document
                    .getElementById(
                        "observacionesGasto"
                    )
                    .value

        };


        const resultado =
            editando

                ? gastoService
                    .editar(
                        id,
                        datos
                    )

                : gastoService
                    .crear(
                        datos
                    );


        if (
            resultado
            &&
            resultado.ok ===
            false
        ) {

            alert(
                resultado.mensaje
            );

            return;

        }


        onVolver();

    }


    // =====================================================
    // CATEGORÍAS
    // =====================================================

    function crearOpcionesCategoria(
        seleccionada = ""
    ) {

        const categorias = [

            "Combustible",
            "Fitosanitarios",
            "Fertilizantes",
            "Semillas y plantas",
            "Maquinaria",
            "Mantenimiento",
            "Personal",
            "Agua",
            "Electricidad",
            "Transporte",
            "Servicios",
            "Otros"

        ];


        if (
            seleccionada
            &&
            !categorias.includes(
                seleccionada
            )
        ) {

            categorias.unshift(
                seleccionada
            );

        }


        return categorias
            .map(
                categoria => `

                    <option
                        value="${escaparHTML(
                            categoria
                        )}"

                        ${
                            seleccionada ===
                            categoria

                                ? "selected"
                                : ""
                        }
                    >

                        ${escaparHTML(
                            categoria
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

        mostrarFormulario,

        crearOpcionesCategoria

    };

}