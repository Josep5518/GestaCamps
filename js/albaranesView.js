export class AlbaranesView {

    constructor(
        mainContent,
        fincaService,
        produccionService,
        albaranService,
        clienteProveedorService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.produccionService =
            produccionService;

        this.albaranService =
            albaranService;

        this.clienteProveedorService =
            clienteProveedorService;

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const albaranes =
            this.albaranService
                .obtenerTodos();


        const borradores =
            albaranes.filter(
                albaran =>
                    albaran.estado ===
                    "Borrador"
            ).length;


        const pendientes =
            albaranes.filter(
                albaran =>
                    albaran.estado ===
                    "Pendiente"
            ).length;


        const entregados =
            albaranes.filter(
                albaran =>
                    albaran.estado ===
                    "Entregado"
            ).length;


        const facturados =
            albaranes.filter(
                albaran =>
                    albaran.facturado ===
                    true
                    ||
                    albaran.estado ===
                    "Facturado"
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Albaranes
                    </h2>

                    <p>
                        Gestiona reservas, salidas y entregas de producción
                    </p>

                </div>


                <button
                    id="nuevoAlbaran"
                    type="button"
                    class="primary-button"
                >
                    + Nuevo albarán
                </button>

            </header>


            <section class="stats">

                ${this.tarjeta(
                    "📝",
                    "Borradores",
                    borradores
                )}

                ${this.tarjeta(
                    "🕒",
                    "Pendientes",
                    pendientes
                )}

                ${this.tarjeta(
                    "🚚",
                    "Entregados",
                    entregados
                )}

                ${this.tarjeta(
                    "💶",
                    "Facturados",
                    facturados
                )}

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
                <strong>Control de stock:</strong>

                Borrador no reserva ·
                Pendiente reserva ·
                Entregado consume ·
                Facturado mantiene ·
                Cancelado libera.
            </div>


            <div id="listaAlbaranes"></div>

        `;


        document
            .getElementById(
                "nuevoAlbaran"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrarFormulario();

                }
            );


        this.mostrarLista();

    }


    tarjeta(
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

        const albaranes =
            this.albaranService
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
                "listaAlbaranes"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            albaranes.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🧾
                    </div>

                    <h3>
                        Todavía no tienes albaranes
                    </h3>

                    <p>
                        Crea el primer albarán de salida de producción.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="albaranes-grid">

                ${albaranes
                    .map(
                        albaran =>
                            this.crearTarjetaAlbaran(
                                albaran
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

    crearTarjetaAlbaran(
        albaran
    ) {

        const facturado =
            albaran.facturado ===
            true
            ||
            albaran.estado ===
            "Facturado";


        const lineas =
            this.obtenerLineasAlbaran(
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
                                        data-id="${albaran.id}"
                                    >
                                        Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="
                                            delete-button
                                            eliminar-albaran
                                        "
                                        data-id="${albaran.id}"
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
                    ${this.escapar(
                        albaran.numero
                    )}
                </h3>


                <p>
                    👤
                    <strong>
                        ${this.escapar(
                            albaran.clienteNombre
                            ||
                            "Sin cliente"
                        )}
                    </strong>
                </p>


                <p>
                    🗓️
                    ${this.formatearFecha(
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
                                this.crearLineaTarjeta(
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
                        ${this.formatearDinero(
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

                    ${this.crearEtiquetaEstado(
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

                        ? this.crearBotonesEstado(
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
                                    ${this.escapar(
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


    crearEtiquetaEstado(
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
                ${this.escapar(
                    estado
                    ||
                    "Borrador"
                )}
            </span>

        `;

    }


    crearBotonesEstado(
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
                                data-id="${albaran.id}"
                                data-estado="${estado.valor}"
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

    crearLineaTarjeta(
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
                .filter(Boolean)
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
                .filter(Boolean)
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
                    ${this.escapar(
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
                    📍 ${this.escapar(
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
                    📅 ${this.escapar(
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
                    ${this.escapar(
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
                            ${this.formatearNumero(
                                linea.cantidad
                            )}
                            ${this.escapar(
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
                            ${this.formatearNumero(
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
                            ${this.formatearDinero(
                                linea.total
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS LISTA
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-albaran"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormulario(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-albaran"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                boton.dataset.id;


                            const albaran =
                                this.albaranService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !albaran
                            ) {

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Eliminar ${albaran.numero}?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.albaranService
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


        document
            .querySelectorAll(
                ".estado-albaran"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                boton.dataset.id;


                            const estado =
                                boton.dataset.estado;


                            if (
                                estado ===
                                "Cancelado"
                            ) {

                                if (
                                    !confirm(
                                        "¿Cancelar este albarán? La producción reservada quedará disponible de nuevo."
                                    )
                                ) {

                                    return;

                                }

                            }


                            const resultado =
                                this.albaranService
                                    .cambiarEstado(
                                        id,
                                        estado
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


        const albaran =
            editando

                ? this.albaranService
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

            this.mostrar();

            return;

        }


        const producciones =
            this.obtenerProducciones();


        const clientes =
            this.albaranService
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
            this.obtenerLineasFormulario(
                albaran
            );


        if (
            lineasFormulario.length ===
            0
        ) {

            lineasFormulario =
                [
                    this.crearLineaVacia()
                ];

        }


        this.mainContent.innerHTML = `

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

                                ? `Editar ${this.escapar(
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
                                this.obtenerFechaHoy()
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
                                            value="${cliente.id}"

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

                                            ${this.escapar(
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

                        ${this.crearOpcionesEstadoFormulario(
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
                    >${this.escapar(
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


        const renderLineas =
            () => {

                const contenedor =
                    document.getElementById(
                        "lineasAlbaran"
                    );


                contenedor.innerHTML =
                    lineasFormulario
                        .map(
                            (
                                linea,
                                indice
                            ) =>
                                this.crearLineaFormulario(
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


                this.configurarEventosLineas(
                    lineasFormulario,
                    renderLineas
                );


                this.calcularTotalFormulario();

            };


        document
            .getElementById(
                "anadirLineaAlbaran"
            )
            .addEventListener(
                "click",
                () => {

                    lineasFormulario.push(
                        this.crearLineaVacia()
                    );


                    renderLineas();

                }
            );


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


                document
                    .getElementById(
                        "explicacionEstadoAlbaran"
                    )
                    .textContent =
                    explicaciones[
                        estadoSelect.value
                    ]
                    ||
                    "";

            };


        estadoSelect
            .addEventListener(
                "change",
                actualizarExplicacionEstado
            );


        actualizarExplicacionEstado();


        document
            .getElementById(
                "volverAlbaranes"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarAlbaran"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "guardarAlbaran"
            )
            .addEventListener(
                "click",
                () => {

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
                            this.leerLineasFormulario(),

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

                            ? this.albaranService
                                .editar(
                                    id,
                                    datos
                                )

                            : this.albaranService
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


        renderLineas();

    }


    crearOpcionesEstadoFormulario(
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
                        value="${estado}"

                        ${
                            seleccionado ===
                            estado

                                ? "selected"
                                : ""
                        }
                    >
                        ${estado}
                    </option>

                `
            )
            .join("");

    }


    // =====================================================
    // LÍNEA VACÍA
    // =====================================================

    crearLineaVacia() {

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


    obtenerLineasFormulario(
        albaran
    ) {

        if (
            !albaran
        ) {

            return [];

        }


        return this.obtenerLineasAlbaran(
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
    // FORMULARIO LÍNEA
    // =====================================================

    crearLineaFormulario(
        linea,
        indice,
        producciones,
        totalLineas,
        albaranId = null
    ) {

        const produccion =
            this.obtenerProduccionPorId(
                linea.produccionId
            );


        const disponibilidad =
            produccion

                ? this.albaranService
                    .obtenerDisponibilidadProduccion(
                        produccion.id,
                        albaranId
                    )

                : {
                    producido: 0,
                    reservado: 0,
                    consumido: 0,
                    disponible: 0,
                    unidad: "kg"
                };


        return `

            <div
                class="albaran-linea-form"
                data-linea-id="${linea.id}"
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
                                        this.albaranService
                                            .obtenerDisponibilidadProduccion(
                                                item.id,
                                                albaranId
                                            );


                                    return `

                                        <option
                                            value="${item.id}"

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

                                            ${this.escapar(
                                                item.producto
                                                ||
                                                item.productoNombre
                                                ||
                                                "Producto"
                                            )}

                                            ${
                                                item.variedad

                                                    ? ` · ${this.escapar(
                                                        item.variedad
                                                    )}`

                                                    : ""
                                            }

                                            · ${this.escapar(
                                                item.pasada
                                                ||
                                                "1ª"
                                            )}

                                            ${
                                                item.fincaNombre

                                                    ? ` · ${this.escapar(
                                                        item.fincaNombre
                                                    )}`

                                                    : ""
                                            }

                                            ${
                                                item.parcela

                                                    ? ` · ${this.escapar(
                                                        item.parcela
                                                    )}`

                                                    : ""
                                            }

                                            ${
                                                item.campaniaNombre

                                                    ? ` · ${this.escapar(
                                                        item.campaniaNombre
                                                    )}`

                                                    : ""
                                            }

                                            · Disponible:
                                            ${this.formatearNumero(
                                                datos.disponible
                                            )}
                                            ${this.escapar(
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

                                ${this.escapar(
                                    produccion.fincaNombre
                                    ||
                                    "Sin finca"
                                )}

                                ${produccion.parcela
                                    ? ` · ${this.escapar(
                                        produccion.parcela
                                    )}`
                                    : ""
                                }

                                ${produccion.campaniaNombre
                                    ? ` · ${this.escapar(
                                        produccion.campaniaNombre
                                    )}`
                                    : " · Sin campanya"
                                }

                                · Pasada
                                <strong>
                                    ${this.escapar(
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

                                ${this.miniDato(
                                    "Producido",
                                    disponibilidad.producido,
                                    disponibilidad.unidad
                                )}

                                ${this.miniDato(
                                    "Reservado",
                                    disponibilidad.reservado,
                                    disponibilidad.unidad
                                )}

                                ${this.miniDato(
                                    "Entregado",
                                    disponibilidad.consumido,
                                    disponibilidad.unidad
                                )}

                                ${this.miniDato(
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

                            value="${this.escapar(
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

                            value="${this.escapar(
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

                            value="${this.escapar(
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

                            value="${this.formatearDinero(
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


    miniDato(
        titulo,
        valor,
        unidad,
        verde = false
    ) {

        return `

            <div
                style="
                    background:
                        ${verde
                            ? "#e7f5ed"
                            : "white"};
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
                    ${titulo}
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
                    ${this.formatearNumero(
                        valor
                    )}
                    ${this.escapar(
                        unidad
                    )}
                </strong>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS LÍNEAS
    // =====================================================

    configurarEventosLineas(
        lineasFormulario,
        renderLineas
    ) {

        document
            .querySelectorAll(
                ".linea-produccion"
            )
            .forEach(
                select => {

                    select.addEventListener(
                        "change",
                        () => {

                            const indice =
                                Number(
                                    select.dataset.index
                                );


                            const produccion =
                                this.obtenerProduccionPorId(
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

                    input.addEventListener(
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


                            this.actualizarSubtotalLinea(
                                indice
                            );


                            this.calcularTotalFormulario();

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

                    input.addEventListener(
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


                            this.actualizarSubtotalLinea(
                                indice
                            );


                            this.calcularTotalFormulario();

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

                    boton.addEventListener(
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


    actualizarSubtotalLinea(
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
            this.formatearDinero(
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


    calcularTotalFormulario() {

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
                this.formatearDinero(
                    total
                );

        }

    }


    leerLineasFormulario() {

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
                        this.obtenerProduccionPorId(
                            produccionId
                        );


                    return {

                        id:
                            bloque.dataset
                                .lineaId
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
    // PRODUCCIÓN
    // =====================================================

    obtenerProducciones() {

        if (
            this.produccionService
            &&
            typeof
            this.produccionService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.produccionService
                    .obtenerTodos()
                ||
                []
            );

        }


        if (
            this.produccionService
            &&
            typeof
            this.produccionService
                .obtenerTodas ===
            "function"
        ) {

            return (
                this.produccionService
                    .obtenerTodas()
                ||
                []
            );

        }


        return [];

    }


    obtenerProduccionPorId(id) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.produccionService
            &&
            typeof
            this.produccionService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.produccionService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return (
            this.obtenerProducciones()
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
    // FECHA / FORMATOS
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