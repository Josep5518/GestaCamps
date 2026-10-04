export class InventarioView {

    constructor(
        mainContent,
        inventarioService
    ) {

        this.mainContent =
            mainContent;

        this.inventarioService =
            inventarioService;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const productos =
            this.obtenerProductos();


        const stockBajo =
            this.obtenerStockBajo()
                .length;


        const sinStock =
            productos.filter(
                producto =>
                    Number(
                        producto.cantidad
                        ||
                        0
                    ) <=
                    0
            ).length;


        const categorias =
            new Set(
                productos
                    .map(
                        producto =>
                            producto.categoria
                    )
                    .filter(Boolean)
            )
                .size;


        this.mainContent.innerHTML = `

            <div class="inventario-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="inventario-hero">

                    <div class="inventario-hero-content">

                        <span class="inventario-eyebrow">
                            📦 RECURSOS Y PRODUCCIÓN
                        </span>


                        <h1>
                            Todo en su sitio,
                            <span>
                                siempre disponible.
                            </span>
                        </h1>


                        <p>
                            Controla materiales, productos y existencias
                            y detecta a tiempo qué recursos necesitan
                            reposición.
                        </p>


                        <button
                            id="nuevoProducto"
                            class="
                                primary-button
                                inventario-hero-button
                            "
                            type="button"
                        >
                            + Nuevo producto
                        </button>

                    </div>


                    <div class="inventario-hero-image">

                        <div class="inventario-hero-badge">

                            <span>
                                Productos
                            </span>

                            <strong>
                                ${productos.length}
                            </strong>

                        </div>


                        <div class="inventario-hero-copy">

                            <small>
                                CONTROLA · REPÓN · ORGANIZA
                            </small>


                            <strong>
                                Cada recurso,<br>
                                bajo control
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats inventario-stats">

                    ${this.crearStat(
                        "📦",
                        "Productos",
                        productos.length
                    )}


                    ${this.crearStat(
                        "⚠️",
                        "Stock bajo",
                        stockBajo
                    )}


                    ${this.crearStat(
                        "⛔",
                        "Sin stock",
                        sinStock
                    )}


                    ${this.crearStat(
                        "🗂️",
                        "Categorías",
                        categorias
                    )}

                </section>


                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <div class="inventario-section-header">

                    <div>

                        <span class="inventario-section-eyebrow">
                            EXISTENCIAS
                        </span>


                        <h2>
                            Materiales y productos
                        </h2>


                        <p>
                            Consulta cantidades, stock mínimo,
                            ubicación y proveedor.
                        </p>

                    </div>


                    <div class="inventario-summary">

                        <span>
                            ${productos.length} productos
                        </span>


                        ${
                            stockBajo > 0

                                ? `

                                    <span class="warning">
                                        ${stockBajo} con stock bajo
                                    </span>

                                `

                                : ""
                        }


                        ${
                            sinStock > 0

                                ? `

                                    <span class="danger">
                                        ${sinStock} sin stock
                                    </span>

                                `

                                : ""
                        }

                    </div>

                </div>


                <!-- ==========================================
                     LISTA
                =========================================== -->

                <div
                    id="listaInventario"
                    class="inventario-list"
                ></div>

            </div>

        `;


        document
            .getElementById(
                "nuevoProducto"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormularioCrear()
            );


        this.mostrarLista();

    }


    // =====================================================
    // STAT
    // =====================================================

    crearStat(
        icono,
        titulo,
        valor
    ) {

        return `

            <article class="card">

                <span class="card-icon">
                    ${icono}
                </span>


                <div>

                    <p>
                        ${this.escapar(
                            titulo
                        )}
                    </p>


                    <h3>
                        ${this.escapar(
                            valor
                        )}
                    </h3>

                </div>

            </article>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const productos =
            this.obtenerProductos();


        const contenedor =
            document
                .getElementById(
                    "listaInventario"
                );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            productos.length ===
            0
        ) {

            contenedor.innerHTML =
                this.crearVacio();


            document
                .getElementById(
                    "crearPrimerProducto"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormularioCrear()
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="inventario-grid">

                ${productos
                    .map(
                        (
                            producto,
                            index
                        ) =>
                            this.crearTarjeta(
                                producto,
                                index
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

    crearTarjeta(
        producto,
        index
    ) {

        const estado =
            this.obtenerEstadoStock(
                producto
            );


        const imagen =
            (
                index %
                3
            )
            +
            1;


        const cantidad =
            Number(
                producto.cantidad
                ||
                0
            );


        const minimo =
            Number(
                producto.stockMinimo
                ||
                0
            );


        const porcentaje =
            this.calcularPorcentajeStock(
                cantidad,
                minimo
            );


        return `

            <article class="inventario-card">

                <!-- ==================================
                     FOTO
                =================================== -->

                <div
                    class="
                        inventario-cover
                        inventario-cover-${imagen}
                    "
                >

                    <div class="inventario-cover-overlay"></div>


                    <div class="inventario-cover-top">

                        <span
                            class="
                                inventario-stock-pill
                                ${this.obtenerClaseEstado(
                                    estado
                                )}
                            "
                        >

                            ●
                            ${this.escapar(
                                estado
                            )}

                        </span>


                        <div class="inventario-cover-actions">

                            <button
                                class="
                                    inventario-icon-button
                                    editar-producto
                                "
                                data-id="${this.escapar(
                                    producto.id
                                )}"
                                type="button"
                                title="Editar producto"
                            >
                                ✎
                            </button>


                            <button
                                class="
                                    inventario-icon-button
                                    inventario-delete
                                    eliminar-producto
                                "
                                data-id="${this.escapar(
                                    producto.id
                                )}"
                                type="button"
                                title="Eliminar producto"
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    <div class="inventario-cover-copy">

                        <span>

                            ${this.obtenerIconoCategoria(
                                producto.categoria
                            )}

                            ${this.escapar(
                                producto.categoria
                                ||
                                "INVENTARIO"
                            )}

                        </span>


                        <strong>
                            ${this.escapar(
                                producto.nombre
                                ||
                                "Producto"
                            )}
                        </strong>

                    </div>

                </div>


                <!-- ==================================
                     CUERPO
                =================================== -->

                <div class="inventario-card-body">

                    <div class="inventario-title-row">

                        <div>

                            <span class="inventario-kicker">
                                RECURSO
                            </span>


                            <h3>
                                ${this.escapar(
                                    producto.nombre
                                    ||
                                    "Producto"
                                )}
                            </h3>

                        </div>


                        <span class="inventario-category-chip">

                            ${this.obtenerIconoCategoria(
                                producto.categoria
                            )}

                            ${this.escapar(
                                producto.categoria
                                ||
                                "Otros"
                            )}

                        </span>

                    </div>


                    <div class="inventario-stock-main">

                        <div>

                            <span>
                                Stock actual
                            </span>


                            <strong>

                                ${this.formatearNumero(
                                    cantidad
                                )}

                                ${this.escapar(
                                    producto.unidad
                                    ||
                                    ""
                                )}

                            </strong>

                        </div>


                        <div>

                            <span>
                                Stock mínimo
                            </span>


                            <strong>

                                ${this.formatearNumero(
                                    minimo
                                )}

                                ${this.escapar(
                                    producto.unidad
                                    ||
                                    ""
                                )}

                            </strong>

                        </div>

                    </div>


                    <div class="inventario-stock-progress">

                        <div class="inventario-stock-progress-top">

                            <span>
                                Nivel de existencias
                            </span>


                            <strong>
                                ${porcentaje} %
                            </strong>

                        </div>


                        <div class="inventario-progress-track">

                            <div
                                class="
                                    inventario-progress-bar
                                    ${this.obtenerClaseEstado(
                                        estado
                                    )}
                                "
                                style="width:${porcentaje}%"
                            ></div>

                        </div>

                    </div>


                    ${
                        producto.proveedor

                            ? `

                                <div class="inventario-detail-row">

                                    <span>
                                        🚚
                                    </span>


                                    <div>

                                        <small>
                                            Proveedor
                                        </small>


                                        <strong>
                                            ${this.escapar(
                                                producto.proveedor
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    ${
                        producto.ubicacion

                            ? `

                                <div class="inventario-detail-row">

                                    <span>
                                        📍
                                    </span>


                                    <div>

                                        <small>
                                            Ubicación
                                        </small>


                                        <strong>
                                            ${this.escapar(
                                                producto.ubicacion
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    ${
                        producto.notas

                            ? `

                                <div class="inventario-notas">

                                    <span>
                                        NOTAS
                                    </span>


                                    <p>
                                        ${this.escapar(
                                            producto.notas
                                        )}
                                    </p>

                                </div>

                            `

                            : ""
                    }


                    <button
                        class="
                            inventario-main-action
                            editar-producto
                        "
                        data-id="${this.escapar(
                            producto.id
                        )}"
                        type="button"
                    >

                        Ver y editar producto

                        <span>
                            →
                        </span>

                    </button>

                </div>

            </article>

        `;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-producto"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormularioEditar(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-producto"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                boton.dataset.id;


                            const producto =
                                this.inventarioService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !producto
                            ) {

                                alert(
                                    "El producto no existe."
                                );

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar "${producto.nombre}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.inventarioService
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
                                    ||
                                    "No se ha podido eliminar el producto."
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
    // CREAR
    // =====================================================

    mostrarFormularioCrear() {

        this.mostrarFormulario(
            null
        );

    }


    // =====================================================
    // EDITAR
    // =====================================================

    mostrarFormularioEditar(
        id
    ) {

        const producto =
            this.inventarioService
                .obtenerPorId(
                    id
                );


        if (
            !producto
        ) {

            alert(
                "El producto no existe."
            );

            return;

        }


        this.mostrarFormulario(
            producto
        );

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        producto
    ) {

        const editando =
            !!producto;


        this.mainContent.innerHTML = `

            <div class="inventario-form-page">

                <button
                    id="volverInventario"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="inventario-form-header">

                    <span>
                        📦 RECURSOS Y PRODUCCIÓN
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar producto"
                                : "Nuevo producto"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza las existencias y datos del producto."

                                : "Añade un nuevo recurso al inventario de la explotación."
                        }

                    </p>

                </header>


                <div class="inventario-form-layout">

                    ${this.crearFormulario(
                        producto
                    )}


                    <aside class="inventario-form-aside">

                        <div class="inventario-form-photo">

                            <div>

                                <span>
                                    CONTROL DE EXISTENCIAS
                                </span>


                                <strong>
                                    Tener stock
                                    es estar preparado.
                                </strong>

                            </div>

                        </div>


                        <div class="inventario-form-tip">

                            <span>
                                ⚠️
                            </span>


                            <div>

                                <strong>
                                    Define un stock mínimo
                                </strong>


                                <p>
                                    GestaCamps podrá avisarte cuando
                                    las existencias estén próximas
                                    a agotarse.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverInventario"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarProducto"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarProducto"
            )
            ?.addEventListener(
                "click",
                () => {

                    if (
                        editando
                    ) {

                        this.guardarCambios(
                            producto.id
                        );

                    }

                    else {

                        this.guardarNuevo();

                    }

                }
            );

    }


    // =====================================================
    // CREAR FORMULARIO
    // =====================================================

    crearFormulario(
        producto
    ) {

        return `

            <section
                class="
                    form-panel
                    inventario-form-panel
                "
            >

                <div class="inventario-form-section">

                    <span>

                        ${this.obtenerIconoCategoria(
                            producto?.categoria
                            ||
                            "Otros"
                        )}

                    </span>


                    <div>

                        <h3>
                            Datos del producto
                        </h3>


                        <p>
                            Existencias, proveedor y ubicación.
                        </p>

                    </div>

                </div>


                <div class="inventario-form-grid">

                    <div
                        class="
                            form-group
                            inventario-form-wide
                        "
                    >

                        <label>
                            Nombre *
                        </label>


                        <input
                            id="nombreProducto"
                            type="text"
                            placeholder="Ej. Sulfato de cobre"
                            value="${this.escapar(
                                producto?.nombre
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Categoría
                        </label>


                        <select id="categoriaProducto">

                            ${this.crearOpcionesCategoria(
                                producto?.categoria
                            )}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Unidad
                        </label>


                        <select id="unidadProducto">

                            ${this.crearOpcionesUnidad(
                                producto?.unidad
                            )}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Cantidad
                        </label>


                        <input
                            id="cantidadProducto"
                            type="number"
                            min="0"
                            step="0.01"
                            value="${
                                Number(
                                    producto?.cantidad
                                    ??
                                    0
                                )
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Stock mínimo
                        </label>


                        <input
                            id="stockMinimoProducto"
                            type="number"
                            min="0"
                            step="0.01"
                            value="${
                                Number(
                                    producto?.stockMinimo
                                    ??
                                    0
                                )
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Proveedor
                        </label>


                        <input
                            id="proveedorProducto"
                            type="text"
                            placeholder="Ej. Agro Lleida"
                            value="${this.escapar(
                                producto?.proveedor
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Ubicación
                        </label>


                        <input
                            id="ubicacionProducto"
                            type="text"
                            placeholder="Ej. Almacén principal"
                            value="${this.escapar(
                                producto?.ubicacion
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div
                        class="
                            form-group
                            inventario-form-wide
                        "
                    >

                        <label>
                            Notas
                        </label>


                        <textarea
                            id="notasProducto"
                            rows="5"
                            placeholder="Observaciones sobre el producto..."
                        >${this.escapar(
                            producto?.notas
                            ||
                            ""
                        )}</textarea>

                    </div>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarProducto"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarProducto"
                        class="primary-button"
                        type="button"
                    >

                        ${
                            producto
                                ? "Guardar cambios"
                                : "Guardar producto"
                        }

                    </button>

                </div>

            </section>

        `;

    }


    // =====================================================
    // GUARDAR NUEVO
    // =====================================================

    guardarNuevo() {

        const datos =
            this.obtenerDatosFormulario();


        if (
            !datos
        ) {

            return;

        }


        const resultado =
            this.inventarioService
                .crear(
                    datos
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido crear el producto."
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // GUARDAR CAMBIOS
    // =====================================================

    guardarCambios(
        id
    ) {

        const datos =
            this.obtenerDatosFormulario();


        if (
            !datos
        ) {

            return;

        }


        const resultado =
            this.inventarioService
                .actualizar(
                    id,
                    datos
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido actualizar el producto."
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // DATOS FORMULARIO
    // =====================================================

    obtenerDatosFormulario() {

        const nombre =
            this.obtenerValor(
                "nombreProducto"
            );


        if (
            !nombre
        ) {

            alert(
                "Introduce el nombre del producto."
            );

            return null;

        }


        return {

            nombre,

            categoria:
                this.obtenerValor(
                    "categoriaProducto"
                ),

            cantidad:
                Number(
                    this.obtenerValor(
                        "cantidadProducto"
                    )
                    ||
                    0
                ),

            unidad:
                this.obtenerValor(
                    "unidadProducto"
                ),

            stockMinimo:
                Number(
                    this.obtenerValor(
                        "stockMinimoProducto"
                    )
                    ||
                    0
                ),

            proveedor:
                this.obtenerValor(
                    "proveedorProducto"
                ),

            ubicacion:
                this.obtenerValor(
                    "ubicacionProducto"
                ),

            notas:
                this.obtenerValor(
                    "notasProducto"
                )

        };

    }


    // =====================================================
    // VALOR
    // =====================================================

    obtenerValor(
        id
    ) {

        return (
            document
                .getElementById(
                    id
                )
                ?.value
                ?.trim()
            ||
            ""
        );

    }


    // =====================================================
    // PRODUCTOS
    // =====================================================

    obtenerProductos() {

        if (
            typeof this.inventarioService
                ?.obtenerTodos !==
            "function"
        ) {

            return [];

        }


        const productos =
            this.inventarioService
                .obtenerTodos();


        return Array.isArray(
            productos
        )
            ? productos
            : [];

    }


    // =====================================================
    // STOCK BAJO
    // =====================================================

    obtenerStockBajo() {

        if (
            typeof this.inventarioService
                ?.obtenerStockBajo ===
            "function"
        ) {

            const productos =
                this.inventarioService
                    .obtenerStockBajo();


            return Array.isArray(
                productos
            )
                ? productos
                : [];

        }


        return this.obtenerProductos()
            .filter(
                producto => {

                    const cantidad =
                        Number(
                            producto.cantidad
                            ||
                            0
                        );


                    const minimo =
                        Number(
                            producto.stockMinimo
                            ||
                            0
                        );


                    return (
                        cantidad >
                        0
                        &&
                        cantidad <=
                        minimo
                    );

                }
            );

    }


    // =====================================================
    // ESTADO STOCK
    // =====================================================

    obtenerEstadoStock(
        producto
    ) {

        if (
            typeof this.inventarioService
                ?.obtenerEstadoStock ===
            "function"
        ) {

            return this.inventarioService
                .obtenerEstadoStock(
                    producto
                );

        }


        const cantidad =
            Number(
                producto.cantidad
                ||
                0
            );


        const minimo =
            Number(
                producto.stockMinimo
                ||
                0
            );


        if (
            cantidad <=
            0
        ) {

            return "Sin stock";

        }


        if (
            cantidad <=
            minimo
        ) {

            return "Stock bajo";

        }


        return "Disponible";

    }


    // =====================================================
    // PORCENTAJE STOCK
    // =====================================================

    calcularPorcentajeStock(
        cantidad,
        minimo
    ) {

        if (
            cantidad <=
            0
        ) {

            return 0;

        }


        if (
            minimo <=
            0
        ) {

            return 100;

        }


        const referencia =
            minimo *
            2;


        const porcentaje =
            (
                cantidad
                /
                referencia
            )
            *
            100;


        return Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    porcentaje
                )
            )
        );

    }


    // =====================================================
    // CATEGORÍAS
    // =====================================================

    crearOpcionesCategoria(
        actual
    ) {

        const categorias = [

            "Fertilizantes",
            "Fitosanitarios",
            "Semillas",
            "Herramientas",
            "Repuestos",
            "Combustible",
            "Embalajes",
            "EPI",
            "Otros"

        ];


        return categorias
            .map(
                categoria => `

                    <option
                        value="${this.escapar(
                            categoria
                        )}"
                        ${
                            categoria ===
                            actual

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
    // UNIDADES
    // =====================================================

    crearOpcionesUnidad(
        actual
    ) {

        const unidades = [

            "ud",
            "kg",
            "g",
            "L",
            "ml",
            "m",
            "m²",
            "cajas",
            "sacos"

        ];


        return unidades
            .map(
                unidad => `

                    <option
                        value="${this.escapar(
                            unidad
                        )}"
                        ${
                            unidad ===
                            actual

                                ? "selected"

                                : ""
                        }
                    >
                        ${this.escapar(
                            unidad
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

        switch (
            categoria
        ) {

            case "Fertilizantes":
                return "🪴";

            case "Fitosanitarios":
                return "🧪";

            case "Semillas":
                return "🌱";

            case "Herramientas":
                return "🛠️";

            case "Repuestos":
                return "⚙️";

            case "Combustible":
                return "⛽";

            case "Embalajes":
                return "📦";

            case "EPI":
                return "🦺";

            default:
                return "📦";

        }

    }


    // =====================================================
    // CLASE STOCK
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        if (
            estado ===
            "Sin stock"
        ) {

            return "stock-empty";

        }


        if (
            estado ===
            "Stock bajo"
        ) {

            return "stock-low";

        }


        return "stock-ok";

    }


    // =====================================================
    // NÚMERO
    // =====================================================

    formatearNumero(
        valor
    ) {

        return Number(
            valor
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
    // VACÍO
    // =====================================================

    crearVacio() {

        return `

            <div class="inventario-empty">

                <div class="inventario-empty-icon">
                    📦
                </div>


                <h3>
                    Todavía no tienes productos
                </h3>


                <p>
                    Añade tu primer material o producto
                    al inventario.
                </p>


                <button
                    id="crearPrimerProducto"
                    class="primary-button"
                    type="button"
                >
                    + Añadir producto
                </button>

            </div>

        `;

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