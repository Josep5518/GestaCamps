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


    mostrar() {

        const productos =
            this.inventarioService.obtenerTodos();


        const stockBajo =
            this.inventarioService
                .obtenerStockBajo()
                .length;


        const sinStock =
            productos.filter(
                producto =>
                    Number(producto.cantidad) <= 0
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Inventario
                    </h2>

                    <p>
                        Controla materiales, productos y existencias
                    </p>

                </div>


                <button
                    id="nuevoProducto"
                    class="primary-button"
                >
                    + Nuevo producto
                </button>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        📦
                    </span>

                    <div>
                        <p>Productos</p>
                        <h3>${productos.length}</h3>
                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ⚠️
                    </span>

                    <div>
                        <p>Stock bajo</p>
                        <h3>${stockBajo}</h3>
                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ⛔
                    </span>

                    <div>
                        <p>Sin stock</p>
                        <h3>${sinStock}</h3>
                    </div>

                </div>

            </section>


            <div id="listaInventario"></div>

        `;


        document
            .getElementById("nuevoProducto")
            .addEventListener(
                "click",
                () => this.mostrarFormularioCrear()
            );


        this.mostrarLista();

    }


    mostrarLista() {

        const productos =
            this.inventarioService.obtenerTodos();


        const contenedor =
            document.getElementById(
                "listaInventario"
            );


        if (productos.length === 0) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📦
                    </div>

                    <h3>
                        Todavía no tienes productos
                    </h3>

                    <p>
                        Añade tu primer producto al inventario.
                    </p>

                </div>

            `;

            return;
        }


        contenedor.innerHTML = `

            <div class="inventario-grid">

                ${productos.map(producto => {

                    const estado =
                        this.inventarioService
                            .obtenerEstadoStock(
                                producto
                            );


                    return `

                        <div class="inventario-card">

                            <div class="inventario-card-header">

                                <span class="inventario-icon">
                                    ${this.obtenerIconoCategoria(producto.categoria)}
                                </span>


                                <div class="inventario-actions">

                                    <button
                                        class="secondary-button editar-producto"
                                        data-id="${producto.id}"
                                    >
                                        Editar
                                    </button>


                                    <button
                                        class="delete-button eliminar-producto"
                                        data-id="${producto.id}"
                                    >
                                        ×
                                    </button>

                                </div>

                            </div>


                            <h3>
                                ${producto.nombre}
                            </h3>


                            <p class="inventario-categoria">
                                ${producto.categoria}
                            </p>


                            <div class="inventario-info">

                                <div>

                                    <span>
                                        Stock
                                    </span>

                                    <strong>
                                        ${producto.cantidad}
                                        ${producto.unidad}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Mínimo
                                    </span>

                                    <strong>
                                        ${producto.stockMinimo}
                                        ${producto.unidad}
                                    </strong>

                                </div>

                            </div>


                            <div
                                class="stock-status ${this.obtenerClaseEstado(estado)}"
                            >
                                ${estado}
                            </div>


                            ${
                                producto.proveedor
                                    ? `
                                        <p>
                                            🚚 ${producto.proveedor}
                                        </p>
                                    `
                                    : ""
                            }


                            ${
                                producto.ubicacion
                                    ? `
                                        <p>
                                            📍 ${producto.ubicacion}
                                        </p>
                                    `
                                    : ""
                            }


                            ${
                                producto.notas
                                    ? `
                                        <div class="inventario-notas">

                                            <span>
                                                Notas
                                            </span>

                                            <p>
                                                ${producto.notas}
                                            </p>

                                        </div>
                                    `
                                    : ""
                            }

                        </div>

                    `;

                }).join("")}

            </div>

        `;


        document
            .querySelectorAll(
                ".editar-producto"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        this.mostrarFormularioEditar(
                            Number(button.dataset.id)
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                ".eliminar-producto"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);


                        const producto =
                            this.inventarioService
                                .obtenerPorId(id);


                        if (!producto) {
                            return;
                        }


                        if (
                            !confirm(
                                `¿Quieres eliminar "${producto.nombre}"?`
                            )
                        ) {
                            return;
                        }


                        this.inventarioService
                            .eliminar(id);


                        this.mostrar();

                    }
                );

            });

    }


    mostrarFormularioCrear() {

        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Nuevo producto
                    </h2>

                    <p>
                        Añade existencias al inventario
                    </p>

                </div>

            </header>


            ${this.crearFormulario(null)}

        `;


        document
            .getElementById("cancelarProducto")
            .addEventListener(
                "click",
                () => this.mostrar()
            );


        document
            .getElementById("guardarProducto")
            .addEventListener(
                "click",
                () => this.guardarNuevo()
            );

    }


    mostrarFormularioEditar(id) {

        const producto =
            this.inventarioService
                .obtenerPorId(id);


        if (!producto) {
            return;
        }


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Editar producto
                    </h2>

                    <p>
                        Modifica los datos del inventario
                    </p>

                </div>

            </header>


            ${this.crearFormulario(producto)}

        `;


        document
            .getElementById("cancelarProducto")
            .addEventListener(
                "click",
                () => this.mostrar()
            );


        document
            .getElementById("guardarProducto")
            .addEventListener(
                "click",
                () => {

                    const datos =
                        this.obtenerDatosFormulario();


                    if (!datos) {
                        return;
                    }


                    const resultado =
                        this.inventarioService
                            .actualizar(
                                id,
                                datos
                            );


                    if (!resultado.ok) {

                        alert(
                            resultado.mensaje
                        );

                        return;
                    }


                    this.mostrar();

                }
            );

    }


    guardarNuevo() {

        const datos =
            this.obtenerDatosFormulario();


        if (!datos) {
            return;
        }


        const resultado =
            this.inventarioService
                .crear(datos);


        if (!resultado.ok) {

            alert(
                resultado.mensaje
            );

            return;
        }


        this.mostrar();

    }


    crearFormulario(producto) {

        return `

            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Nombre *
                    </label>

                    <input
                        id="nombreProducto"
                        type="text"
                        placeholder="Ej. Sulfato de cobre"
                        value="${producto?.nombre || ""}"
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
                        Cantidad
                    </label>

                    <input
                        id="cantidadProducto"
                        type="number"
                        min="0"
                        step="0.01"
                        value="${producto?.cantidad ?? 0}"
                    >

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
                        Stock mínimo
                    </label>

                    <input
                        id="stockMinimoProducto"
                        type="number"
                        min="0"
                        step="0.01"
                        value="${producto?.stockMinimo ?? 0}"
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
                        value="${producto?.proveedor || ""}"
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
                        value="${producto?.ubicacion || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasProducto"
                        rows="5"
                    >${producto?.notas || ""}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarProducto"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarProducto"
                        class="primary-button"
                    >
                        ${
                            producto
                                ? "Guardar cambios"
                                : "Guardar producto"
                        }
                    </button>

                </div>

            </div>

        `;

    }


    obtenerDatosFormulario() {

        const nombre =
            document
                .getElementById(
                    "nombreProducto"
                )
                .value
                .trim();


        if (!nombre) {

            alert(
                "Introduce el nombre del producto."
            );

            return null;
        }


        return {

            nombre: nombre,

            categoria:
                document
                    .getElementById(
                        "categoriaProducto"
                    )
                    .value,

            cantidad:
                Number(
                    document
                        .getElementById(
                            "cantidadProducto"
                        )
                        .value
                ),

            unidad:
                document
                    .getElementById(
                        "unidadProducto"
                    )
                    .value,

            stockMinimo:
                Number(
                    document
                        .getElementById(
                            "stockMinimoProducto"
                        )
                        .value
                ),

            proveedor:
                document
                    .getElementById(
                        "proveedorProducto"
                    )
                    .value
                    .trim(),

            ubicacion:
                document
                    .getElementById(
                        "ubicacionProducto"
                    )
                    .value
                    .trim(),

            notas:
                document
                    .getElementById(
                        "notasProducto"
                    )
                    .value
                    .trim()

        };

    }


    crearOpcionesCategoria(actual) {

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


        return categorias.map(categoria => `

            <option
                value="${categoria}"
                ${
                    categoria === actual
                        ? "selected"
                        : ""
                }
            >
                ${categoria}
            </option>

        `).join("");

    }


    crearOpcionesUnidad(actual) {

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


        return unidades.map(unidad => `

            <option
                value="${unidad}"
                ${
                    unidad === actual
                        ? "selected"
                        : ""
                }
            >
                ${unidad}
            </option>

        `).join("");

    }


    obtenerIconoCategoria(categoria) {

        switch (categoria) {

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


    obtenerClaseEstado(estado) {

        if (estado === "Sin stock") {
            return "stock-empty";
        }

        if (estado === "Stock bajo") {
            return "stock-low";
        }

        return "stock-ok";

    }

}