export class ProduccionView {

    constructor(
        mainContent,
        fincaService,
        produccionService,
        campaniaService,
        cultivoService,
        albaranService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.produccionService =
            produccionService;

        this.campaniaService =
            campaniaService;

        this.cultivoService =
            cultivoService;

        this.albaranService =
            albaranService;

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const registros =
            this.produccionService
                .obtenerTodos();


        const totalProducido =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    Number(
                        registro.cantidad
                        ||
                        0
                    ),
                0
            );


        const totalReservado =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    this.obtenerCantidadReservada(
                        registro.id
                    ),
                0
            );


        const totalEntregado =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    this.obtenerCantidadEntregada(
                        registro.id
                    ),
                0
            );


        const totalDisponible =
            registros.reduce(
                (
                    suma,
                    registro
                ) =>
                    suma
                    +
                    this.obtenerCantidadDisponible(
                        registro
                    ),
                0
            );


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Producción
                    </h2>

                    <p>
                        Controla la producción, reservas, entregas y disponibilidad
                    </p>

                </div>


                <button
                    id="nuevaProduccion"
                    class="primary-button"
                    type="button"
                >
                    + Nueva producción
                </button>

            </header>


            <section class="stats">


                <div class="card">

                    <span class="card-icon">
                        🍎
                    </span>

                    <div>

                        <p>
                            Producido
                        </p>

                        <h3>
                            ${this.formatearNumero(
                                totalProducido
                            )} kg
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🕒
                    </span>

                    <div>

                        <p>
                            Reservado
                        </p>

                        <h3>
                            ${this.formatearNumero(
                                totalReservado
                            )} kg
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🚚
                    </span>

                    <div>

                        <p>
                            Entregado
                        </p>

                        <h3>
                            ${this.formatearNumero(
                                totalEntregado
                            )} kg
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        📦
                    </span>

                    <div>

                        <p>
                            Disponible
                        </p>

                        <h3>
                            ${this.formatearNumero(
                                totalDisponible
                            )} kg
                        </h3>

                    </div>

                </div>


            </section>


            <div
                style="
                    margin:18px 0 22px;
                    padding:13px 16px;
                    border-radius:10px;
                    background:#edf6f1;
                    color:#315f4d;
                    font-size:13px;
                    line-height:1.5;
                "
            >

                <strong>
                    Estado del stock:
                </strong>

                Pendiente = reservado ·
                Entregado/Facturado = entregado ·
                Borrador/Cancelado = no afecta al stock.

            </div>


            <div id="listaProduccion"></div>

        `;


        document
            .getElementById(
                "nuevaProduccion"
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
    // LISTA
    // =====================================================

    mostrarLista() {

        const registros =
            this.produccionService
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
                "listaProduccion"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            registros.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🍎
                    </div>

                    <h3>
                        Todavía no hay producción registrada
                    </h3>

                    <p>
                        Añade el primer registro de producción de tu explotación.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="produccion-grid">

                ${registros
                    .map(
                        registro =>
                            this.crearTarjetaProduccion(
                                registro
                            )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjetaProduccion(
        registro
    ) {

        const producido =
            Number(
                registro.cantidad
                ||
                0
            );


        const reservado =
            this.obtenerCantidadReservada(
                registro.id
            );


        const entregado =
            this.obtenerCantidadEntregada(
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
            disponible <=
            0;


        const sobreasignado =
            ocupado >
            producido;


        return `

            <div class="produccion-card">


                <div class="produccion-card-header">

                    <span class="produccion-icon">
                        🍎
                    </span>


                    <div class="produccion-actions">

                        <button
                            class="
                                secondary-button
                                editar-produccion
                            "
                            data-id="${registro.id}"
                            type="button"
                        >
                            Editar
                        </button>


                        <button
                            class="
                                delete-button
                                eliminar-produccion
                            "
                            data-id="${registro.id}"
                            type="button"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <h3>

                    ${this.escapar(
                        registro.producto
                        ||
                        registro.cultivoNombre
                        ||
                        "Producto sin definir"
                    )}

                    ${
                        registro.variedad

                            ? ` · ${this.escapar(
                                registro.variedad
                            )}`

                            : ""
                    }

                </h3>


                <p class="produccion-location">

                    📍
                    ${this.escapar(
                        registro.fincaNombre
                        ||
                        "Sin finca"
                    )}

                    ${
                        registro.parcela

                            ? ` · ${this.escapar(
                                registro.parcela
                            )}`

                            : ""
                    }

                </p>


                ${
                    registro.campaniaNombre

                        ? `
                            <p class="produccion-campania">
                                📅 ${this.escapar(
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
                        display:grid;
                        grid-template-columns:
                            repeat(4,minmax(0,1fr));
                        gap:8px;
                        margin-top:16px;
                    "
                >


                    ${this.crearMiniDato(
                        "Producido",
                        producido,
                        registro.unidad,
                        "#f5f7f5",
                        "#111"
                    )}


                    ${this.crearMiniDato(
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


                    ${this.crearMiniDato(
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


                    ${this.crearMiniDato(
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
                    reservado >
                    0

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
                                ${this.formatearNumero(
                                    reservado
                                )}
                                ${this.escapar(
                                    registro.unidad
                                    ||
                                    "kg"
                                )}
                                reservados en albaranes pendientes
                            </div>
                        `

                        : ""
                }


                ${
                    agotado
                    &&
                    !sobreasignado

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
                                ${this.formatearNumero(
                                    ocupado -
                                    producido
                                )}
                                ${this.escapar(
                                    registro.unidad
                                    ||
                                    "kg"
                                )}
                            </div>
                        `

                        : ""
                }


                <div
                    class="produccion-info-grid"
                    style="
                        margin-top:12px;
                    "
                >

                    <div>

                        <span>
                            Fecha
                        </span>

                        <strong>
                            ${this.formatearFecha(
                                registro.fecha
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Estado
                        </span>

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
                                ${this.escapar(
                                    registro.observaciones
                                )}
                            </p>
                        `

                        : ""
                }


            </div>

        `;

    }


    // =====================================================
    // MINI DATO
    // =====================================================

    crearMiniDato(
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
                    ${titulo}
                </span>


                <strong
                    style="
                        display:block;
                        color:${color};
                        white-space:nowrap;
                    "
                >
                    ${this.formatearNumero(
                        valor
                    )}
                    ${this.escapar(
                        unidad
                        ||
                        "kg"
                    )}
                </strong>

            </div>

        `;

    }


    // =====================================================
    // CANTIDAD RESERVADA
    // =====================================================

    obtenerCantidadReservada(
        produccionId
    ) {

        if (
            !this.albaranService
        ) {

            return 0;

        }


        if (
            typeof
            this.albaranService
                .obtenerCantidadReservada ===
            "function"
        ) {

            return Number(
                this.albaranService
                    .obtenerCantidadReservada(
                        produccionId
                    )
                ||
                0
            );

        }


        return this.calcularCantidadPorEstados(
            produccionId,
            [
                "Pendiente"
            ]
        );

    }


    // =====================================================
    // CANTIDAD ENTREGADA
    // =====================================================

    obtenerCantidadEntregada(
        produccionId
    ) {

        if (
            !this.albaranService
        ) {

            return 0;

        }


        if (
            typeof
            this.albaranService
                .obtenerCantidadConsumida ===
            "function"
        ) {

            return Number(
                this.albaranService
                    .obtenerCantidadConsumida(
                        produccionId
                    )
                ||
                0
            );

        }


        return this.calcularCantidadPorEstados(
            produccionId,
            [
                "Entregado",
                "Facturado"
            ],
            true
        );

    }


    // =====================================================
    // TOTAL UTILIZADO
    // =====================================================

    obtenerCantidadUtilizada(
        produccionId
    ) {

        return (
            this.obtenerCantidadReservada(
                produccionId
            )
            +
            this.obtenerCantidadEntregada(
                produccionId
            )
        );

    }


    // =====================================================
    // DISPONIBLE
    // =====================================================

    obtenerCantidadDisponible(
        registro
    ) {

        const producido =
            Number(
                registro.cantidad
                ||
                0
            );


        const ocupado =
            this.obtenerCantidadUtilizada(
                registro.id
            );


        return Math.max(
            0,
            producido -
            ocupado
        );

    }


    // =====================================================
    // RESPALDO PARA VERSIONES ANTIGUAS
    // =====================================================

    calcularCantidadPorEstados(
        produccionId,
        estados,
        incluirFacturado = false
    ) {

        const albaranes =
            this.obtenerAlbaranes();


        let total =
            0;


        albaranes.forEach(
            albaran => {

                let coincideEstado =
                    estados.includes(
                        albaran.estado
                    );


                if (
                    incluirFacturado
                    &&
                    albaran.facturado ===
                    true
                ) {

                    coincideEstado =
                        true;

                }


                if (
                    !coincideEstado
                ) {

                    return;

                }


                const lineas =
                    this.obtenerLineasAlbaran(
                        albaran
                    );


                lineas.forEach(
                    linea => {

                        if (
                            Number(
                                linea.produccionId
                            )
                            !==
                            Number(
                                produccionId
                            )
                        ) {

                            return;

                        }


                        total +=
                            Number(
                                linea.cantidad
                                ||
                                0
                            );

                    }
                );

            }
        );


        return total;

    }


    obtenerAlbaranes() {

        if (
            !this.albaranService
        ) {

            return [];

        }


        if (
            typeof
            this.albaranService
                .obtenerTodos ===
            "function"
        ) {

            const datos =
                this.albaranService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            this.albaranService
                .obtenerTodas ===
            "function"
        ) {

            const datos =
                this.albaranService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    obtenerLineasAlbaran(
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

                    cantidad:
                        albaran.cantidad,

                    unidad:
                        albaran.unidad
                }
            ];

        }


        return [];

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-produccion"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormulario(
                                Number(
                                    button.dataset.id
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-produccion"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                Number(
                                    button.dataset.id
                                );


                            const registro =
                                this.produccionService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !registro
                            ) {

                                return;

                            }


                            const reservado =
                                this.obtenerCantidadReservada(
                                    id
                                );


                            const entregado =
                                this.obtenerCantidadEntregada(
                                    id
                                );


                            const utilizado =
                                reservado
                                +
                                entregado;


                            if (
                                utilizado >
                                0
                            ) {

                                let mensaje =
                                    "No puedes eliminar esta producción porque tiene";


                                if (
                                    reservado >
                                    0
                                ) {

                                    mensaje +=
                                        ` ${this.formatearNumero(
                                            reservado
                                        )} ${registro.unidad || "kg"} reservados`;

                                }


                                if (
                                    reservado >
                                    0
                                    &&
                                    entregado >
                                    0
                                ) {

                                    mensaje +=
                                        " y";

                                }


                                if (
                                    entregado >
                                    0
                                ) {

                                    mensaje +=
                                        ` ${this.formatearNumero(
                                            entregado
                                        )} ${registro.unidad || "kg"} entregados`;

                                }


                                mensaje +=
                                    " en albaranes.";


                                alert(
                                    mensaje
                                );

                                return;

                            }


                            if (
                                !confirm(
                                    "¿Quieres eliminar este registro de producción?"
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.produccionService
                                    .eliminar(
                                        id
                                    );


                            if (
                                !resultado.ok
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


        const registro =
            editando

                ? this.produccionService
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
            this.cultivoService
                .obtenerTodos();


        if (
            cultivos.length ===
            0
        ) {

            alert(
                "Primero debes crear un cultivo."
            );

            return;

        }


        let cultivoSeleccionadoId =
            registro?.cultivoId
            ||
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
                            Number(
                                cultivo.fincaId
                            )
                            ===
                            Number(
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
                                Number(
                                    cultivo.fincaId
                                )
                                ===
                                Number(
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
                                Number(
                                    cultivo.fincaId
                                )
                                ===
                                Number(
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

                ? this.obtenerCantidadReservada(
                    id
                )

                : 0;


        const cantidadEntregada =
            editando

                ? this.obtenerCantidadEntregada(
                    id
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

                ? Number(
                    cultivoSeleccionadoId
                )

                : null;


        const unidadOriginal =
            editando

                ? String(
                    registro.unidad
                    ||
                    "kg"
                )

                : null;


        this.mainContent.innerHTML = `

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
                                                ${this.formatearNumero(
                                                    cantidadReservada
                                                )}
                                                ${this.escapar(
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
                                                ${this.formatearNumero(
                                                    cantidadEntregada
                                                )}
                                                ${this.escapar(
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
                                    ${this.formatearNumero(
                                        cantidadUtilizada
                                    )}
                                    ${this.escapar(
                                        registro.unidad
                                        ||
                                        "kg"
                                    )}
                                </strong>

                                <br><br>

                                Para mantener la trazabilidad,
                                no puedes cambiar el cultivo ni la unidad.

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
                                        value="${cultivo.id}"

                                        ${
                                            Number(
                                                cultivoSeleccionadoId
                                            )
                                            ===
                                            Number(
                                                cultivo.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${this.escapar(
                                            cultivo.tipo
                                        )}

                                        ·

                                        ${this.escapar(
                                            cultivo.variedad
                                        )}

                                        ·

                                        ${this.escapar(
                                            cultivo.fincaNombre
                                        )}

                                        ${
                                            cultivo.campaniaNombre

                                                ? ` · ${this.escapar(
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
                        Cantidad *
                    </label>

                    <input
                        id="cantidadProduccion"
                        type="number"

                        min="${
                            tieneSalidas
                                ? cantidadUtilizada
                                : "0.01"
                        }"

                        step="0.01"

                        value="${
                            registro?.cantidad
                            ??
                            ""
                        }"
                    >


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
                                    Mínimo permitido:

                                    <strong>
                                        ${this.formatearNumero(
                                            cantidadUtilizada
                                        )}
                                        ${this.escapar(
                                            registro.unidad
                                            ||
                                            "kg"
                                        )}
                                    </strong>

                                    =

                                    ${this.formatearNumero(
                                        cantidadReservada
                                    )}
                                    reservados

                                    +

                                    ${this.formatearNumero(
                                        cantidadEntregada
                                    )}
                                    entregados
                                </small>
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
                            this.obtenerFechaHoy()
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
                    >${this.escapar(
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


        const cultivoSelect =
            document.getElementById(
                "cultivoProduccion"
            );


        // =================================================
        // COMPLETAR DATOS CULTIVO
        // =================================================

        const completarDatosCultivo =
            () => {

                const cultivoId =
                    Number(
                        cultivoSelect.value
                    );


                const cultivo =
                    this.cultivoService
                        .obtenerPorId(
                            cultivoId
                        );


                if (
                    !cultivo
                ) {

                    document
                        .getElementById(
                            "productoProduccion"
                        )
                        .value =
                        "";


                    document
                        .getElementById(
                            "variedadProduccion"
                        )
                        .value =
                        "";


                    document
                        .getElementById(
                            "fincaProduccion"
                        )
                        .value =
                        "";


                    document
                        .getElementById(
                            "parcelaProduccion"
                        )
                        .value =
                        "";


                    document
                        .getElementById(
                            "campaniaProduccion"
                        )
                        .value =
                        "";


                    return;

                }


                document
                    .getElementById(
                        "productoProduccion"
                    )
                    .value =
                    cultivo.tipo
                    ||
                    "";


                document
                    .getElementById(
                        "variedadProduccion"
                    )
                    .value =
                    cultivo.variedad
                    ||
                    "";


                document
                    .getElementById(
                        "fincaProduccion"
                    )
                    .value =
                    cultivo.fincaNombre
                    ||
                    "";


                document
                    .getElementById(
                        "parcelaProduccion"
                    )
                    .value =
                    cultivo.parcela
                    ||
                    "";


                document
                    .getElementById(
                        "campaniaProduccion"
                    )
                    .value =
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
        // VOLVER
        // =================================================

        document
            .getElementById(
                "volverProduccion"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        // =================================================
        // CANCELAR
        // =================================================

        document
            .getElementById(
                "cancelarProduccion"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        // =================================================
        // GUARDAR
        // =================================================

        document
            .getElementById(
                "guardarProduccion"
            )
            .addEventListener(
                "click",
                () => {


                    const cultivoId =
                        Number(
                            document
                                .getElementById(
                                    "cultivoProduccion"
                                )
                                .value
                        );


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


                    const cantidad =
                        Number(
                            document
                                .getElementById(
                                    "cantidadProduccion"
                                )
                                .value
                        );


                    if (
                        !Number.isFinite(
                            cantidad
                        )
                        ||
                        cantidad <=
                        0
                    ) {

                        alert(
                            "Introduce una cantidad válida."
                        );

                        return;

                    }


                    // =====================================
                    // TRAZABILIDAD
                    // =====================================

                    if (
                        editando
                        &&
                        tieneSalidas
                    ) {

                        if (
                            Number(
                                cultivoId
                            )
                            !==
                            Number(
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
                            cantidad <
                            cantidadUtilizada
                        ) {

                            alert(
                                `No puedes reducir esta producción a `
                                +
                                `${this.formatearNumero(
                                    cantidad
                                )} ${registro.unidad || "kg"} `
                                +
                                `porque hay `
                                +
                                `${this.formatearNumero(
                                    cantidadReservada
                                )} ${registro.unidad || "kg"} reservados `
                                +
                                `y `
                                +
                                `${this.formatearNumero(
                                    cantidadEntregada
                                )} ${registro.unidad || "kg"} entregados.`
                            );

                            return;

                        }

                    }


                    const datos = {

                        cultivoId:
                            cultivoId,

                        cantidad:
                            cantidad,

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


                    const resultado =
                        editando

                            ? this.produccionService
                                .editar(
                                    id,
                                    datos
                                )

                            : this.produccionService
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


                    this.mostrar();

                }
            );

    }


    // =====================================================
    // FECHA HOY
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


    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

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
    // NÚMERO
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


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

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