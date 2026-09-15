export class ClientesProveedoresView {

    constructor(
        mainContent,
        clienteProveedorService
    ) {

        this.mainContent =
            mainContent;

        this.clienteProveedorService =
            clienteProveedorService;

    }


    mostrar() {

        const contactos =
            this.clienteProveedorService
                .obtenerTodos();


        const clientes =
            contactos.filter(
                contacto =>
                    contacto.tipo === "Cliente"
                    ||
                    contacto.tipo === "Cliente y proveedor"
            ).length;


        const proveedores =
            contactos.filter(
                contacto =>
                    contacto.tipo === "Proveedor"
                    ||
                    contacto.tipo === "Cliente y proveedor"
            ).length;


        const activos =
            contactos.filter(
                contacto =>
                    contacto.activo === true
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Clientes y proveedores
                    </h2>

                    <p>
                        Gestiona tus clientes, proveedores y contactos
                    </p>

                </div>


                <button
                    id="nuevoContacto"
                    class="primary-button"
                >
                    + Nuevo contacto
                </button>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        👥
                    </span>

                    <div>

                        <p>
                            Contactos
                        </p>

                        <h3>
                            ${contactos.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🧑‍💼
                    </span>

                    <div>

                        <p>
                            Clientes
                        </p>

                        <h3>
                            ${clientes}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🚚
                    </span>

                    <div>

                        <p>
                            Proveedores
                        </p>

                        <h3>
                            ${proveedores}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ✅
                    </span>

                    <div>

                        <p>
                            Activos
                        </p>

                        <h3>
                            ${activos}
                        </h3>

                    </div>

                </div>

            </section>


            <div id="listaContactos"></div>

        `;


        document
            .getElementById(
                "nuevoContacto"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormularioCrear()
            );


        this.mostrarLista();

    }


    mostrarLista() {

        const contactos =
            this.clienteProveedorService
                .obtenerTodos();


        const contenedor =
            document.getElementById(
                "listaContactos"
            );


        if (
            contactos.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        👥
                    </div>

                    <h3>
                        Todavía no tienes clientes ni proveedores
                    </h3>

                    <p>
                        Añade el primer contacto de la explotación.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="contactos-grid">

                ${contactos.map(
                    contacto => `

                        <div class="contacto-card">

                            <div class="contacto-card-header">

                                <span class="contacto-icon">
                                    ${this.obtenerIconoTipo(
                                        contacto.tipo
                                    )}
                                </span>


                                <div class="contacto-actions">

                                    <button
                                        class="secondary-button editar-contacto"
                                        data-id="${contacto.id}"
                                    >
                                        Editar
                                    </button>


                                    <button
                                        class="delete-button eliminar-contacto"
                                        data-id="${contacto.id}"
                                    >
                                        ×
                                    </button>

                                </div>

                            </div>


                            <h3>
                                ${contacto.nombre}
                            </h3>


                            <p class="contacto-tipo">
                                ${contacto.tipo}
                            </p>


                            <div class="contacto-info">

                                <div>

                                    <span>
                                        Estado
                                    </span>

                                    <strong>
                                        ${
                                            contacto.activo
                                                ? "Activo"
                                                : "Inactivo"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        NIF / CIF
                                    </span>

                                    <strong>
                                        ${contacto.nif || "—"}
                                    </strong>

                                </div>

                            </div>


                            ${
                                contacto.telefono
                                    ? `
                                        <p>
                                            📞 ${contacto.telefono}
                                        </p>
                                    `
                                    : ""
                            }


                            ${
                                contacto.email
                                    ? `
                                        <p>
                                            ✉️ ${contacto.email}
                                        </p>
                                    `
                                    : ""
                            }


                            ${
                                contacto.direccion
                                ||
                                contacto.localidad
                                    ? `
                                        <p>
                                            📍
                                            ${[
                                                contacto.direccion,
                                                contacto.localidad,
                                                contacto.provincia,
                                                contacto.codigoPostal
                                            ]
                                            .filter(Boolean)
                                            .join(" · ")}
                                        </p>
                                    `
                                    : ""
                            }


                            <span
                                class="contacto-status ${
                                    contacto.activo
                                        ? "contacto-activo"
                                        : "contacto-inactivo"
                                }"
                            >
                                ${
                                    contacto.activo
                                        ? "Activo"
                                        : "Inactivo"
                                }
                            </span>


                            ${
                                contacto.notas
                                    ? `
                                        <div class="contacto-notas">

                                            <span>
                                                Notas
                                            </span>

                                            <p>
                                                ${contacto.notas}
                                            </p>

                                        </div>
                                    `
                                    : ""
                            }

                        </div>

                    `
                ).join("")}

            </div>

        `;


        this.configurarEventos();

    }


    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-contacto"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormularioEditar(
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
                ".eliminar-contacto"
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


                            const contacto =
                                this.clienteProveedorService
                                    .obtenerPorId(id);


                            if (!contacto) {
                                return;
                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar "${contacto.nombre}"?`
                                )
                            ) {
                                return;
                            }


                            const resultado =
                                this.clienteProveedorService
                                    .eliminar(id);


                            if (
                                resultado
                                &&
                                resultado.ok === false
                            ) {

                                alert(
                                    resultado.mensaje
                                    ||
                                    "No se ha podido eliminar el cliente o proveedor."
                                );

                                return;

                            }


                            this.mostrar();

                        }
                    );

                }
            );

    }


    mostrarFormularioCrear() {

        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Nuevo cliente o proveedor
                    </h2>

                    <p>
                        Añade un nuevo contacto
                    </p>

                </div>

            </header>


            ${this.crearFormulario(null)}

        `;


        document
            .getElementById(
                "cancelarContacto"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarContacto"
            )
            .addEventListener(
                "click",
                () =>
                    this.guardarNuevo()
            );

    }


    mostrarFormularioEditar(id) {

        const contacto =
            this.clienteProveedorService
                .obtenerPorId(id);


        if (!contacto) {
            return;
        }


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Editar contacto
                    </h2>

                    <p>
                        Modifica los datos del cliente o proveedor
                    </p>

                </div>

            </header>


            ${this.crearFormulario(contacto)}

        `;


        document
            .getElementById(
                "cancelarContacto"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarContacto"
            )
            .addEventListener(
                "click",
                () => {

                    const datos =
                        this.obtenerDatosFormulario();


                    if (!datos) {
                        return;
                    }


                    const resultado =
                        this.clienteProveedorService
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
            this.clienteProveedorService
                .crear(datos);


        if (!resultado.ok) {

            alert(
                resultado.mensaje
            );

            return;
        }


        this.mostrar();

    }


    crearFormulario(contacto) {

        return `

            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Tipo *
                    </label>

                    <select id="tipoContacto">

                        <option
                            value="Cliente"
                            ${
                                !contacto ||
                                contacto.tipo === "Cliente"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Cliente
                        </option>

                        <option
                            value="Proveedor"
                            ${
                                contacto?.tipo === "Proveedor"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Proveedor
                        </option>

                        <option
                            value="Cliente y proveedor"
                            ${
                                contacto?.tipo === "Cliente y proveedor"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Cliente y proveedor
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Nombre / Razón social *
                    </label>

                    <input
                        id="nombreContacto"
                        type="text"
                        placeholder="Ej. Cooperativa de Lleida"
                        value="${contacto?.nombre || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        NIF / CIF
                    </label>

                    <input
                        id="nifContacto"
                        type="text"
                        placeholder="Ej. B12345678"
                        value="${contacto?.nif || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Teléfono
                    </label>

                    <input
                        id="telefonoContacto"
                        type="tel"
                        placeholder="Ej. 973123456"
                        value="${contacto?.telefono || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        id="emailContacto"
                        type="email"
                        placeholder="correo@empresa.com"
                        value="${contacto?.email || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Dirección
                    </label>

                    <input
                        id="direccionContacto"
                        type="text"
                        placeholder="Calle, número..."
                        value="${contacto?.direccion || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Localidad
                    </label>

                    <input
                        id="localidadContacto"
                        type="text"
                        value="${contacto?.localidad || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Provincia
                    </label>

                    <input
                        id="provinciaContacto"
                        type="text"
                        value="${contacto?.provincia || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Código postal
                    </label>

                    <input
                        id="cpContacto"
                        type="text"
                        value="${contacto?.codigoPostal || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        País
                    </label>

                    <input
                        id="paisContacto"
                        type="text"
                        value="${contacto?.pais || "España"}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select id="activoContacto">

                        <option
                            value="true"
                            ${
                                !contacto ||
                                contacto.activo === true
                                    ? "selected"
                                    : ""
                            }
                        >
                            Activo
                        </option>

                        <option
                            value="false"
                            ${
                                contacto?.activo === false
                                    ? "selected"
                                    : ""
                            }
                        >
                            Inactivo
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasContacto"
                        rows="5"
                    >${contacto?.notas || ""}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarContacto"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarContacto"
                        class="primary-button"
                    >
                        ${
                            contacto
                                ? "Guardar cambios"
                                : "Guardar contacto"
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
                    "nombreContacto"
                )
                .value
                .trim();


        if (!nombre) {

            alert(
                "Introduce el nombre o razón social."
            );

            return null;

        }


        return {

            tipo:
                document
                    .getElementById(
                        "tipoContacto"
                    )
                    .value,

            nombre:
                nombre,

            nif:
                document
                    .getElementById(
                        "nifContacto"
                    )
                    .value
                    .trim(),

            telefono:
                document
                    .getElementById(
                        "telefonoContacto"
                    )
                    .value
                    .trim(),

            email:
                document
                    .getElementById(
                        "emailContacto"
                    )
                    .value
                    .trim(),

            direccion:
                document
                    .getElementById(
                        "direccionContacto"
                    )
                    .value
                    .trim(),

            localidad:
                document
                    .getElementById(
                        "localidadContacto"
                    )
                    .value
                    .trim(),

            provincia:
                document
                    .getElementById(
                        "provinciaContacto"
                    )
                    .value
                    .trim(),

            codigoPostal:
                document
                    .getElementById(
                        "cpContacto"
                    )
                    .value
                    .trim(),

            pais:
                document
                    .getElementById(
                        "paisContacto"
                    )
                    .value
                    .trim(),

            activo:
                document
                    .getElementById(
                        "activoContacto"
                    )
                    .value === "true",

            notas:
                document
                    .getElementById(
                        "notasContacto"
                    )
                    .value
                    .trim()

        };

    }


    obtenerIconoTipo(tipo) {

        if (tipo === "Cliente") {
            return "🧑‍💼";
        }

        if (tipo === "Proveedor") {
            return "🚚";
        }

        return "🤝";

    }

}