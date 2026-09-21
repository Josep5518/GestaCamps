export function crearAlbaranesFormHelper({
    mainContent,
    albaranService,
    lineasHelper,
    escapar,
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


        const albaran =
            editando

                ? albaranService
                    .obtenerPorId(
                        id
                    )

                : null;


        if (
            editando
            &&
            !albaran
        ) {

            alert(
                "No se ha encontrado el albarán."
            );

            return;

        }


        if (
            albaran?.facturado ===
            true
            ||
            albaran?.estado ===
            "Facturado"
        ) {

            alert(
                "Los albaranes facturados están bloqueados."
            );

            onVolver();

            return;

        }


        const producciones =
            lineasHelper
                .obtenerProducciones();


        const clientes =
            albaranService
                .obtenerClientes();


        if (
            producciones.length ===
            0
        ) {

            alert(
                "Primero debes registrar producción."
            );

            return;

        }


        if (
            clientes.length ===
            0
        ) {

            alert(
                "Primero debes crear un cliente."
            );

            return;

        }


        let lineasFormulario =
            lineasHelper
                .obtenerLineasFormulario(
                    albaran
                );


        if (
            lineasFormulario.length ===
            0
        ) {

            lineasFormulario =
                [
                    lineasHelper
                        .crearLineaVacia()
                ];

        }


        renderizarFormulario({
            editando,
            albaran,
            clientes
        });


        configurarFormulario({
            editando,
            albaran,
            id,
            producciones,
            lineasFormulario
        });

    }


    // =====================================================
    // RENDER PRINCIPAL
    // =====================================================

    function renderizarFormulario({
        editando,
        albaran,
        clientes
    }) {

        mainContent.innerHTML = `

            <button
                type="button"
                id="volverAlbaranes"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        ${
                            editando

                                ? `Editar ${escapar(
                                    albaran.numero
                                )}`

                                : "Nuevo albarán"
                        }
                    </h2>

                    <p>
                        Gestiona las líneas y el estado del albarán
                    </p>

                </div>

            </header>


            <div
                class="form-panel"
                style="
                    max-width:1000px;
                "
            >


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(2,minmax(0,1fr));
                        gap:16px;
                    "
                >

                    <div class="form-group">

                        <label>
                            Fecha *
                        </label>

                        <input
                            id="fechaAlbaran"
                            type="date"

                            value="${
                                albaran?.fecha
                                ||
                                obtenerFechaHoy()
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Cliente *
                        </label>

                        <select id="clienteAlbaran">

                            <option value="">
                                Selecciona un cliente
                            </option>


                            ${clientes
                                .map(
                                    cliente => `

                                        <option
                                            value="${escapar(
                                                cliente.id
                                            )}"

                                            ${
                                                String(
                                                    albaran?.clienteId
                                                    ??
                                                    ""
                                                )
                                                ===
                                                String(
                                                    cliente.id
                                                )

                                                    ? "selected"
                                                    : ""
                                            }
                                        >

                                            ${escapar(
                                                cliente.nombre
                                                ||
                                                cliente.razonSocial
                                                ||
                                                "Cliente"
                                            )}

                                        </option>

                                    `
                                )
                                .join("")}

                        </select>

                    </div>

                </div>


                <div
                    style="
                        border-top:1px solid #edf0ed;
                        padding-top:20px;
                        margin-top:2px;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-bottom:14px;
                            gap:15px;
                        "
                    >

                        <div>

                            <h3
                                style="
                                    margin:0 0 4px;
                                "
                            >
                                Líneas del albarán
                            </h3>

                            <p
                                style="
                                    margin:0;
                                    color:#78837d;
                                    font-size:13px;
                                "
                            >
                                El stock se controla automáticamente según el estado.
                            </p>

                        </div>


                        <button
                            type="button"
                            id="anadirLineaAlbaran"
                            class="secondary-button"
                        >
                            + Añadir línea
                        </button>

                    </div>


                    <div id="lineasAlbaran"></div>

                </div>


                <div
                    style="
                        display:flex;
                        justify-content:flex-end;
                        margin:18px 0;
                    "
                >

                    <div
                        style="
                            min-width:280px;
                            padding:16px;
                            border-radius:10px;
                            background:#edf6f1;
                        "
                    >

                        <span
                            style="
                                display:block;
                                color:#78837d;
                                font-size:12px;
                            "
                        >
                            Total albarán
                        </span>

                        <strong
                            id="totalAlbaran"
                            style="
                                font-size:22px;
                                color:#175640;
                            "
                        >
                            0,00 €
                        </strong>

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select id="estadoAlbaran">

                        ${crearOpcionesEstadoFormulario(
                            albaran?.estado
                            ||
                            "Borrador"
                        )}

                    </select>


                    <small
                        id="explicacionEstadoAlbaran"
                        style="
                            display:block;
                            margin-top:6px;
                            color:#68756f;
                        "
                    ></small>

                </div>


                <div class="form-group">

                    <label>
                        Observaciones
                    </label>

                    <textarea
                        id="observacionesAlbaran"
                        rows="5"
                        placeholder="Observaciones..."
                    >${escapar(
                        albaran?.observaciones
                        ||
                        ""
                    )}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        id="cancelarAlbaran"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        type="button"
                        id="guardarAlbaran"
                        class="primary-button"
                    >

                        ${
                            editando
                                ? "Guardar cambios"
                                : "Crear albarán"
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
        id,
        producciones,
        lineasFormulario
    }) {

        // =================================================
        // RENDER DE LÍNEAS
        // =================================================

        const renderLineas =
            () => {

                const contenedor =
                    document.getElementById(
                        "lineasAlbaran"
                    );


                if (
                    !contenedor
                ) {

                    return;

                }


                contenedor.innerHTML =
                    lineasFormulario
                        .map(
                            (
                                linea,
                                indice
                            ) =>
                                lineasHelper
                                    .crearLineaFormulario(
                                        linea,
                                        indice,
                                        producciones,
                                        lineasFormulario.length,
                                        editando
                                            ? id
                                            : null
                                    )
                        )
                        .join("");


                lineasHelper
                    .configurarEventosLineas(
                        lineasFormulario,
                        renderLineas
                    );


                lineasHelper
                    .calcularTotalFormulario();

            };


        // =================================================
        // AÑADIR LÍNEA
        // =================================================

        document
            .getElementById(
                "anadirLineaAlbaran"
            )
            ?.addEventListener(
                "click",
                () => {

                    lineasFormulario.push(
                        lineasHelper
                            .crearLineaVacia()
                    );


                    renderLineas();

                }
            );


        // =================================================
        // ESTADO
        // =================================================

        const estadoSelect =
            document.getElementById(
                "estadoAlbaran"
            );


        const actualizarExplicacionEstado =
            () => {

                const explicaciones = {

                    Borrador:
                        "📝 Borrador: no reserva producción.",

                    Pendiente:
                        "🕒 Pendiente: reserva la producción indicada.",

                    Entregado:
                        "🚚 Entregado: la producción se considera salida de la explotación.",

                    Cancelado:
                        "🚫 Cancelado: no reserva ni consume producción."

                };


                const elemento =
                    document.getElementById(
                        "explicacionEstadoAlbaran"
                    );


                if (
                    elemento
                ) {

                    elemento.textContent =
                        explicaciones[
                            estadoSelect.value
                        ]
                        ||
                        "";

                }

            };


        estadoSelect
            ?.addEventListener(
                "change",
                actualizarExplicacionEstado
            );


        actualizarExplicacionEstado();


        // =================================================
        // VOLVER
        // =================================================

        document
            .getElementById(
                "volverAlbaranes"
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
                "cancelarAlbaran"
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
                "guardarAlbaran"
            )
            ?.addEventListener(
                "click",
                () => {

                    guardarAlbaran({
                        editando,
                        id
                    });

                }
            );


        // =================================================
        // PRIMER RENDER
        // =================================================

        renderLineas();

    }


    // =====================================================
    // GUARDAR ALBARÁN
    // =====================================================

    function guardarAlbaran({
        editando,
        id
    }) {

        const datos = {

            fecha:
                document
                    .getElementById(
                        "fechaAlbaran"
                    )
                    .value,

            clienteId:
                document
                    .getElementById(
                        "clienteAlbaran"
                    )
                    .value,

            lineas:
                lineasHelper
                    .leerLineasFormulario(),

            estado:
                document
                    .getElementById(
                        "estadoAlbaran"
                    )
                    .value,

            observaciones:
                document
                    .getElementById(
                        "observacionesAlbaran"
                    )
                    .value

        };


        const resultado =
            editando

                ? albaranService
                    .editar(
                        id,
                        datos
                    )

                : albaranService
                    .crear(
                        datos
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
    // OPCIONES DE ESTADO
    // =====================================================

    function crearOpcionesEstadoFormulario(
        seleccionado
    ) {

        const estados =
            [
                "Borrador",
                "Pendiente",
                "Entregado",
                "Cancelado"
            ];


        return estados
            .map(
                estado => `

                    <option
                        value="${escapar(
                            estado
                        )}"

                        ${
                            seleccionado ===
                            estado

                                ? "selected"
                                : ""
                        }
                    >

                        ${escapar(
                            estado
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

        crearOpcionesEstadoFormulario

    };

}