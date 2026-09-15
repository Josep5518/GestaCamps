export class GastosView {

    constructor(
        mainContent,
        gastoService,
        fincaService,
        maquinariaService,
        clienteProveedorService,
        campaniaService
    ) {

        this.mainContent =
            mainContent;

        this.gastoService =
            gastoService;

        this.fincaService =
            fincaService;

        this.maquinariaService =
            maquinariaService;

        this.clienteProveedorService =
            clienteProveedorService;

        this.campaniaService =
            campaniaService;

    }


    // =====================================================
    // MAQUINARIA
    // =====================================================

    obtenerMaquinaria() {

        if (
            this.maquinariaService
            &&
            typeof
            this.maquinariaService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.maquinariaService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // CONTACTOS
    // =====================================================

    obtenerContactos() {

        if (
            this.clienteProveedorService
            &&
            typeof
            this.clienteProveedorService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.clienteProveedorService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const gastos =
            this.gastoService
                .obtenerTodos();


        const total =
            gastos.reduce(
                (
                    suma,
                    gasto
                ) =>
                    suma
                    +
                    Number(
                        gasto.importe
                        ||
                        0
                    ),
                0
            );


        const pagado =
            gastos.reduce(
                (
                    suma,
                    gasto
                ) =>
                    suma
                    +
                    Number(
                        gasto.pagadoAcumulado
                        ||
                        0
                    ),
                0
            );


        const pendiente =
            gastos.reduce(
                (
                    suma,
                    gasto
                ) =>
                    suma
                    +
                    Number(
                        gasto.pendientePago
                        ??
                        gasto.importe
                        ??
                        0
                    ),
                0
            );


        const parciales =
            gastos.filter(
                gasto =>
                    gasto.estado ===
                    "Parcialmente pagado"
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Gastos
                    </h2>

                    <p>
                        Controla los gastos y sus pagos
                    </p>

                </div>


                <button
                    id="nuevoGasto"
                    class="primary-button"
                    type="button"
                >
                    + Nuevo gasto
                </button>

            </header>


            <section class="stats">

                ${this.crearTarjeta(
                    "💸",
                    "Gastos",
                    gastos.length
                )}

                ${this.crearTarjeta(
                    "💰",
                    "Total",
                    this.formatearDinero(
                        total
                    )
                )}

                ${this.crearTarjeta(
                    "✅",
                    "Pagado",
                    this.formatearDinero(
                        pagado
                    )
                )}

                ${this.crearTarjeta(
                    "🕒",
                    "Pendiente",
                    this.formatearDinero(
                        pendiente
                    )
                )}

            </section>


            ${
                parciales >
                0

                    ? `
                        <div
                            style="
                                display:inline-block;
                                margin:18px 0 4px;
                                padding:8px 12px;
                                border-radius:999px;
                                background:#eaf1fb;
                                color:#3d5d91;
                                font-size:12px;
                                font-weight:600;
                            "
                        >
                            ◐
                            ${parciales}
                            ${
                                parciales === 1
                                    ? "gasto parcialmente pagado"
                                    : "gastos parcialmente pagados"
                            }
                        </div>
                    `

                    : ""
            }


            <div id="listaGastos"></div>

        `;


        document
            .getElementById(
                "nuevoGasto"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrarFormulario();

                }
            );


        this.mostrarLista();

    }


    // =====================================================
    // TARJETA RESUMEN
    // =====================================================

    crearTarjeta(
        icono,
        titulo,
        valor
    ) {

        return `

            <div class="card">

                <span class="card-icon">
                    ${icono}
                </span>

                <div>

                    <p>
                        ${titulo}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const gastos =
            this.gastoService
                .obtenerTodos()
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.fecha
                        )
                        -
                        new Date(
                            a.fecha
                        )
                );


        const contenedor =
            document.getElementById(
                "listaGastos"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            gastos.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        💸
                    </div>

                    <h3>
                        Todavía no tienes gastos
                    </h3>

                    <p>
                        Registra tu primer gasto de explotación.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="gastos-grid">

                ${gastos
                    .map(
                        gasto =>
                            this.crearTarjetaGasto(
                                gasto
                            )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA GASTO
    // =====================================================

    crearTarjetaGasto(
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
                        ${this.obtenerIconoCategoria(
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
                            data-id="${gasto.id}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="
                                delete-button
                                eliminar-gasto
                            "
                            data-id="${gasto.id}"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <h3>
                    ${this.escapar(
                        gasto.concepto
                    )}
                </h3>


                <strong class="gasto-categoria">
                    ${this.escapar(
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

                    ${this.crearDatoFinanciero(
                        "Importe",
                        importe
                    )}

                    ${this.crearDatoFinanciero(
                        "Pagado",
                        pagado,
                        "#e8f5ed"
                    )}

                    ${this.crearDatoFinanciero(
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

                    ${this.crearEtiquetaEstado(
                        gasto.estado
                    )}


                    <span
                        style="
                            color:#78837d;
                            font-size:11px;
                        "
                    >
                        ${this.formatearNumero(
                            porcentaje
                        )}% pagado
                    </span>

                </div>


                <p class="gasto-linea">

                    🗓️
                    ${this.formatearFecha(
                        gasto.fecha
                    )}

                </p>


                ${
                    gasto.proveedorNombre

                        ? `
                            <p class="gasto-linea">

                                🚚
                                ${this.escapar(
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
                                ${this.escapar(
                                    gasto.fincaNombre
                                )}

                                ${
                                    gasto.parcela

                                        ? ` · ${this.escapar(
                                            gasto.parcela
                                        )}`

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
                                ${this.escapar(
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
                                ${this.escapar(
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
                                <strong>Cobros y pagos</strong>.
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
                                <strong>Cobros y pagos</strong>.
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
                                ${this.escapar(
                                    gasto.observaciones
                                )}
                            </p>
                        `

                        : ""
                }

            </div>

        `;

    }


    crearDatoFinanciero(
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
                    ${titulo}
                </span>

                <strong
                    style="
                        display:block;
                        margin-top:3px;
                    "
                >
                    ${this.formatearDinero(
                        importe
                    )}
                </strong>

            </div>

        `;

    }


    crearEtiquetaEstado(
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
                ${this.escapar(
                    estado
                    ||
                    "Pendiente"
                )}
            </span>

        `;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-gasto"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormulario(
                                Number(
                                    boton.dataset.id
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-gasto"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                Number(
                                    boton.dataset.id
                                );


                            const gasto =
                                this.gastoService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !gasto
                            ) {

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar el gasto "${gasto.concepto}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.gastoService
                                    .eliminar(
                                        id
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


                            this.mostrar();

                        }
                    );

                }
            );

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        id = null
    ) {

        const editando =
            id !==
            null;


        const gasto =
            editando

                ? this.gastoService
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
            this.obtenerFincas();


        const maquinaria =
            this.obtenerMaquinaria();


        const contactos =
            this.obtenerContactos();


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


        this.mainContent.innerHTML = `

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
                                    ${this.formatearDinero(
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
                        value="${this.escapar(
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

                        ${this.crearOpcionesCategoria(
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
                                    ${this.formatearDinero(
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
                            this.obtenerFechaHoy()
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
                                        value="${proveedor.id}"

                                        ${
                                            Number(
                                                gasto?.proveedorId
                                            )
                                            ===
                                            Number(
                                                proveedor.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${this.escapar(
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
                                        value="${finca.id}"

                                        ${
                                            Number(
                                                gasto?.fincaId
                                            )
                                            ===
                                            Number(
                                                finca.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${this.escapar(
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
                        value="${this.escapar(
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
                                        value="${maquina.id}"

                                        ${
                                            Number(
                                                gasto?.maquinariaId
                                            )
                                            ===
                                            Number(
                                                maquina.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${this.escapar(
                                            [
                                                maquina.nombre,
                                                maquina.marca,
                                                maquina.modelo
                                            ]
                                                .filter(Boolean)
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
                    >${this.escapar(
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


        const fincaSelect =
            document.getElementById(
                "fincaGasto"
            );


        const campaniaSelect =
            document.getElementById(
                "campaniaGasto"
            );


        const cargarCampanyas =
            () => {

                const fincaId =
                    Number(
                        fincaSelect.value
                    );


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
                    this.obtenerCampanyas()
                        .filter(
                            campania =>
                                Number(
                                    campania.fincaId
                                )
                                ===
                                fincaId
                        );


                campaniaSelect.innerHTML = `

                    <option value="">
                        Sin campanya
                    </option>


                    ${campanyas
                        .map(
                            campania => `

                                <option
                                    value="${campania.id}"
                                >
                                    ${this.escapar(
                                        campania.nombre
                                    )}

                                    ${
                                        campania.estado
                                            ? ` · ${this.escapar(
                                                campania.estado
                                            )}`
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
                            Number(
                                campania.id
                            )
                            ===
                            Number(
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


        fincaSelect
            .addEventListener(
                "change",
                cargarCampanyas
            );


        cargarCampanyas();


        document
            .getElementById(
                "volverGastos"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarGasto"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "guardarGasto"
            )
            .addEventListener(
                "click",
                () => {

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

                            ? this.gastoService
                                .editar(
                                    id,
                                    datos
                                )

                            : this.gastoService
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


                    this.mostrar();

                }
            );

    }


    // =====================================================
    // FINCAS
    // =====================================================

    obtenerFincas() {

        if (
            this.fincaService
            &&
            typeof
            this.fincaService
                .obtenerTodas ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerTodas()
                ||
                []
            );

        }


        if (
            this.fincaService
            &&
            typeof
            this.fincaService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // CAMPANYAS
    // =====================================================

    obtenerCampanyas() {

        if (
            this.campaniaService
            &&
            typeof
            this.campaniaService
                .obtenerTodas ===
            "function"
        ) {

            return (
                this.campaniaService
                    .obtenerTodas()
                ||
                []
            );

        }


        if (
            this.campaniaService
            &&
            typeof
            this.campaniaService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.campaniaService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // CATEGORÍAS
    // =====================================================

    crearOpcionesCategoria(
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
                        value="${this.escapar(
                            categoria
                        )}"

                        ${
                            seleccionada ===
                            categoria

                                ? "selected"
                                : ""
                        }
                    >
                        ${this.escapar(
                            categoria
                        )}
                    </option>

                `
            )
            .join("");

    }


    // =====================================================
    // ICONOS
    // =====================================================

    obtenerIconoCategoria(
        categoria
    ) {

        const iconos = {

            Combustible:
                "⛽",

            Fitosanitarios:
                "🧪",

            Fertilizantes:
                "🌱",

            "Semillas y plantas":
                "🌾",

            Maquinaria:
                "🚜",

            Mantenimiento:
                "🔧",

            Personal:
                "👷",

            Agua:
                "💧",

            Electricidad:
                "⚡",

            Transporte:
                "🚚",

            Servicios:
                "🧾",

            Otros:
                "💸"

        };


        return (
            iconos[
                categoria
            ]
            ||
            "💸"
        );

    }


    // =====================================================
    // FECHA
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        const year =
            fecha.getFullYear();


        const month =
            String(
                fecha.getMonth() +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const day =
            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${year}-${month}-${day}`
        );

    }


    formatearFecha(
        fecha
    ) {

        if (
            !fecha
        ) {

            return "—";

        }


        const partes =
            String(
                fecha
            )
                .split(
                    "-"
                );


        if (
            partes.length !==
            3
        ) {

            return fecha;

        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );

    }


    // =====================================================
    // FORMATOS
    // =====================================================

    formatearNumero(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    maximumFractionDigits:
                        2
                }
            );

    }


    formatearDinero(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )
            +
            " €";

    }


    escapar(
        valor
    ) {

        return String(
            valor
            ??
            ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }

}