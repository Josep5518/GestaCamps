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


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const contactos =
            this.obtenerContactos();


        const clientes =
            contactos.filter(
                contacto =>
                    contacto.tipo ===
                    "Cliente"
                    ||
                    contacto.tipo ===
                    "Cliente y proveedor"
            ).length;


        const proveedores =
            contactos.filter(
                contacto =>
                    contacto.tipo ===
                    "Proveedor"
                    ||
                    contacto.tipo ===
                    "Cliente y proveedor"
            ).length;


        const activos =
            contactos.filter(
                contacto =>
                    contacto.activo ===
                    true
            ).length;


        this.mainContent.innerHTML = `

            <div class="contactos-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="contactos-hero">

                    <div class="contactos-hero-content">

                        <span class="contactos-eyebrow">
                            🤝 COMERCIAL Y FINANZAS
                        </span>


                        <h1>
                            Relaciones sólidas,
                            <span>
                                negocio que crece.
                            </span>
                        </h1>


                        <p>
                            Gestiona clientes, proveedores y contactos
                            desde un único lugar y mantén toda la información
                            comercial siempre organizada.
                        </p>


                        <button
                            id="nuevoContacto"
                            class="
                                primary-button
                                contactos-hero-button
                            "
                            type="button"
                        >
                            + Nuevo contacto
                        </button>

                    </div>


                    <div class="contactos-hero-image">

                        <div class="contactos-hero-badge">

                            <span>
                                Contactos activos
                            </span>


                            <strong>
                                ${activos}
                            </strong>

                        </div>


                        <div class="contactos-hero-copy">

                            <small>
                                CLIENTES · PROVEEDORES · NEGOCIO
                            </small>


                            <strong>
                                Cada relación cuenta
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats contactos-stats">

                    ${this.crearStat(
                        "👥",
                        "Contactos",
                        contactos.length
                    )}


                    ${this.crearStat(
                        "🧑‍💼",
                        "Clientes",
                        clientes
                    )}


                    ${this.crearStat(
                        "🚚",
                        "Proveedores",
                        proveedores
                    )}


                    ${this.crearStat(
                        "✅",
                        "Activos",
                        activos
                    )}

                </section>


                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <div class="contactos-section-header">

                    <div>

                        <span class="contactos-section-eyebrow">
                            RED COMERCIAL
                        </span>


                        <h2>
                            Clientes y proveedores
                        </h2>


                        <p>
                            Consulta datos fiscales, contacto,
                            ubicación y estado de cada relación comercial.
                        </p>

                    </div>


                    <div class="contactos-summary">

                        <span>
                            ${contactos.length} contactos
                        </span>


                        <span>
                            ${clientes} clientes
                        </span>


                        <span>
                            ${proveedores} proveedores
                        </span>

                    </div>

                </div>


                <div id="listaContactos"></div>

            </div>

        `;


        document
            .getElementById(
                "nuevoContacto"
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

        const contactos =
            this.obtenerContactos();


        const contenedor =
            document
                .getElementById(
                    "listaContactos"
                );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            contactos.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="contactos-empty">

                    <div class="contactos-empty-icon">
                        🤝
                    </div>


                    <h3>
                        Todavía no tienes contactos
                    </h3>


                    <p>
                        Añade tu primer cliente o proveedor
                        para empezar a organizar tu red comercial.
                    </p>


                    <button
                        id="crearPrimerContacto"
                        class="primary-button"
                        type="button"
                    >
                        + Añadir contacto
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimerContacto"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormularioCrear()
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="contactos-grid">

                ${contactos
                    .map(
                        (
                            contacto,
                            index
                        ) =>
                            this.crearTarjetaContacto(
                                contacto,
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

    crearTarjetaContacto(
        contacto,
        index
    ) {

        const imagen =
            (
                index %
                3
            )
            +
            1;


        const activo =
            contacto.activo ===
            true;


        const direccion =
            [
                contacto.direccion,
                contacto.localidad,
                contacto.provincia,
                contacto.codigoPostal
            ]
                .filter(Boolean)
                .join(" · ");


        return `

            <article class="contacto-card">

                <!-- ==================================
                     COVER
                =================================== -->

                <div
                    class="
                        contacto-cover
                        contacto-cover-${imagen}
                    "
                >

                    <div class="contacto-cover-overlay"></div>


                    <div class="contacto-cover-top">

                        <span
                            class="
                                contacto-status-pill
                                ${
                                    activo
                                        ? "activo"
                                        : "inactivo"
                                }
                            "
                        >

                            ●
                            ${
                                activo
                                    ? "Activo"
                                    : "Inactivo"
                            }

                        </span>


                        <div class="contacto-cover-actions">

                            <button
                                class="
                                    contacto-icon-button
                                    editar-contacto
                                "
                                data-id="${this.escapar(
                                    contacto.id
                                )}"
                                type="button"
                                title="Editar contacto"
                            >
                                ✎
                            </button>


                            <button
                                class="
                                    contacto-icon-button
                                    contacto-delete
                                    eliminar-contacto
                                "
                                data-id="${this.escapar(
                                    contacto.id
                                )}"
                                type="button"
                                title="Eliminar contacto"
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    <div class="contacto-cover-copy">

                        <span>
                            ${this.obtenerIconoTipo(
                                contacto.tipo
                            )}

                            ${this.escapar(
                                contacto.tipo
                                ||
                                "CONTACTO"
                            )}
                        </span>


                        <strong>
                            ${this.escapar(
                                contacto.nombre
                                ||
                                "Contacto"
                            )}
                        </strong>

                    </div>

                </div>


                <!-- ==================================
                     CUERPO
                =================================== -->

                <div class="contacto-card-body">

                    <div class="contacto-title-row">

                        <div>

                            <span class="contacto-kicker">
                                RELACIÓN COMERCIAL
                            </span>


                            <h3>
                                ${this.escapar(
                                    contacto.nombre
                                    ||
                                    "Contacto"
                                )}
                            </h3>

                        </div>


                        <span class="contacto-type-chip">

                            ${this.obtenerIconoTipo(
                                contacto.tipo
                            )}

                            ${this.escapar(
                                contacto.tipo
                                ||
                                "Contacto"
                            )}

                        </span>

                    </div>


                    <div class="contacto-info-grid">

                        <div>

                            <span>
                                Estado
                            </span>


                            <strong>
                                ${
                                    activo
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
                                ${this.escapar(
                                    contacto.nif
                                    ||
                                    "—"
                                )}
                            </strong>

                        </div>

                    </div>


                    ${
                        contacto.telefono

                            ? `

                                <div class="contacto-detail-row">

                                    <span>
                                        📞
                                    </span>


                                    <div>

                                        <small>
                                            Teléfono
                                        </small>


                                        <strong>
                                            ${this.escapar(
                                                contacto.telefono
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    ${
                        contacto.email

                            ? `

                                <div class="contacto-detail-row">

                                    <span>
                                        ✉️
                                    </span>


                                    <div>

                                        <small>
                                            Email
                                        </small>


                                        <strong>
                                            ${this.escapar(
                                                contacto.email
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    ${
                        direccion

                            ? `

                                <div class="contacto-detail-row">

                                    <span>
                                        📍
                                    </span>


                                    <div>

                                        <small>
                                            Dirección
                                        </small>


                                        <strong>
                                            ${this.escapar(
                                                direccion
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    ${
                        contacto.notas

                            ? `

                                <div class="contacto-notas">

                                    <span>
                                        NOTAS
                                    </span>


                                    <p>
                                        ${this.escapar(
                                            contacto.notas
                                        )}
                                    </p>

                                </div>

                            `

                            : ""
                    }


                    <button
                        class="
                            contacto-main-action
                            editar-contacto
                        "
                        data-id="${this.escapar(
                            contacto.id
                        )}"
                        type="button"
                    >

                        Ver y editar contacto

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
                ".editar-contacto"
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
                ".eliminar-contacto"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                boton.dataset.id;


                            const contacto =
                                this.clienteProveedorService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !contacto
                            ) {

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

        const contacto =
            this.clienteProveedorService
                .obtenerPorId(
                    id
                );


        if (
            !contacto
        ) {

            return;

        }


        this.mostrarFormulario(
            contacto
        );

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        contacto
    ) {

        const editando =
            !!contacto;


        this.mainContent.innerHTML = `

            <div class="contacto-form-page">

                <button
                    id="volverContactos"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="contacto-form-header">

                    <span>
                        🤝 COMERCIAL Y FINANZAS
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar contacto"
                                : "Nuevo cliente o proveedor"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza los datos comerciales y fiscales del contacto."

                                : "Añade un nuevo cliente, proveedor o colaborador comercial."
                        }

                    </p>

                </header>


                <div class="contacto-form-layout">

                    ${this.crearFormulario(
                        contacto
                    )}


                    <aside class="contacto-form-aside">

                        <div class="contacto-form-photo">

                            <div>

                                <span>
                                    RED COMERCIAL
                                </span>


                                <strong>
                                    Buenas relaciones,
                                    mejores oportunidades.
                                </strong>

                            </div>

                        </div>


                        <div class="contacto-form-tip">

                            <span>
                                🤝
                            </span>


                            <div>

                                <strong>
                                    Información centralizada
                                </strong>


                                <p>
                                    Mantén actualizados los datos fiscales
                                    y de contacto para facilitar albaranes,
                                    facturación y pagos.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverContactos"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarContacto"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarContacto"
            )
            ?.addEventListener(
                "click",
                () => {

                    if (
                        editando
                    ) {

                        this.guardarCambios(
                            contacto.id
                        );

                    }

                    else {

                        this.guardarNuevo();

                    }

                }
            );

    }


    // =====================================================
    // FORMULARIO HTML
    // =====================================================

    crearFormulario(
        contacto
    ) {

        return `

            <section
                class="
                    form-panel
                    contacto-form-panel
                "
            >

                <div class="contacto-form-section">

                    <span>
                        ${this.obtenerIconoTipo(
                            contacto?.tipo
                            ||
                            "Cliente"
                        )}
                    </span>


                    <div>

                        <h3>
                            Datos del contacto
                        </h3>


                        <p>
                            Información comercial, fiscal y de contacto.
                        </p>

                    </div>

                </div>


                <div class="contacto-form-grid">

                    <div class="form-group">

                        <label>
                            Tipo *
                        </label>


                        <select id="tipoContacto">

                            <option
                                value="Cliente"
                                ${
                                    !contacto
                                    ||
                                    contacto.tipo ===
                                    "Cliente"

                                        ? "selected"

                                        : ""
                                }
                            >
                                Cliente
                            </option>


                            <option
                                value="Proveedor"
                                ${
                                    contacto?.tipo ===
                                    "Proveedor"

                                        ? "selected"

                                        : ""
                                }
                            >
                                Proveedor
                            </option>


                            <option
                                value="Cliente y proveedor"
                                ${
                                    contacto?.tipo ===
                                    "Cliente y proveedor"

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
                            Estado
                        </label>


                        <select id="activoContacto">

                            <option
                                value="true"
                                ${
                                    !contacto
                                    ||
                                    contacto.activo ===
                                    true

                                        ? "selected"

                                        : ""
                                }
                            >
                                Activo
                            </option>


                            <option
                                value="false"
                                ${
                                    contacto?.activo ===
                                    false

                                        ? "selected"

                                        : ""
                                }
                            >
                                Inactivo
                            </option>

                        </select>

                    </div>


                    <div
                        class="
                            form-group
                            contacto-form-wide
                        "
                    >

                        <label>
                            Nombre / Razón social *
                        </label>


                        <input
                            id="nombreContacto"
                            type="text"
                            placeholder="Ej. Cooperativa de Lleida"
                            value="${this.escapar(
                                contacto?.nombre
                                ||
                                ""
                            )}"
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
                            value="${this.escapar(
                                contacto?.nif
                                ||
                                ""
                            )}"
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
                            value="${this.escapar(
                                contacto?.telefono
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div
                        class="
                            form-group
                            contacto-form-wide
                        "
                    >

                        <label>
                            Email
                        </label>


                        <input
                            id="emailContacto"
                            type="email"
                            placeholder="correo@empresa.com"
                            value="${this.escapar(
                                contacto?.email
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div
                        class="
                            form-group
                            contacto-form-wide
                        "
                    >

                        <label>
                            Dirección
                        </label>


                        <input
                            id="direccionContacto"
                            type="text"
                            placeholder="Calle, número..."
                            value="${this.escapar(
                                contacto?.direccion
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Localidad
                        </label>


                        <input
                            id="localidadContacto"
                            type="text"
                            value="${this.escapar(
                                contacto?.localidad
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Provincia
                        </label>


                        <input
                            id="provinciaContacto"
                            type="text"
                            value="${this.escapar(
                                contacto?.provincia
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Código postal
                        </label>


                        <input
                            id="cpContacto"
                            type="text"
                            value="${this.escapar(
                                contacto?.codigoPostal
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            País
                        </label>


                        <input
                            id="paisContacto"
                            type="text"
                            value="${this.escapar(
                                contacto?.pais
                                ||
                                "España"
                            )}"
                        >

                    </div>


                    <div
                        class="
                            form-group
                            contacto-form-wide
                        "
                    >

                        <label>
                            Notas
                        </label>


                        <textarea
                            id="notasContacto"
                            rows="5"
                            placeholder="Observaciones sobre el contacto..."
                        >${this.escapar(
                            contacto?.notas
                            ||
                            ""
                        )}</textarea>

                    </div>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarContacto"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarContacto"
                        class="primary-button"
                        type="button"
                    >

                        ${
                            contacto
                                ? "Guardar cambios"
                                : "Guardar contacto"
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
            this.clienteProveedorService
                .crear(
                    datos
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido crear el contacto."
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
            this.clienteProveedorService
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
                "No se ha podido actualizar el contacto."
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
                "nombreContacto"
            );


        if (
            !nombre
        ) {

            alert(
                "Introduce el nombre o razón social."
            );


            return null;

        }


        return {

            tipo:
                this.obtenerValor(
                    "tipoContacto"
                ),

            nombre,

            nif:
                this.obtenerValor(
                    "nifContacto"
                ),

            telefono:
                this.obtenerValor(
                    "telefonoContacto"
                ),

            email:
                this.obtenerValor(
                    "emailContacto"
                ),

            direccion:
                this.obtenerValor(
                    "direccionContacto"
                ),

            localidad:
                this.obtenerValor(
                    "localidadContacto"
                ),

            provincia:
                this.obtenerValor(
                    "provinciaContacto"
                ),

            codigoPostal:
                this.obtenerValor(
                    "cpContacto"
                ),

            pais:
                this.obtenerValor(
                    "paisContacto"
                ),

            activo:
                this.obtenerValor(
                    "activoContacto"
                ) ===
                "true",

            notas:
                this.obtenerValor(
                    "notasContacto"
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
    // CONTACTOS
    // =====================================================

    obtenerContactos() {

        const contactos =
            this.clienteProveedorService
                ?.obtenerTodos?.();


        return Array.isArray(
            contactos
        )
            ? contactos
            : [];

    }


    // =====================================================
    // ICONO
    // =====================================================

    obtenerIconoTipo(
        tipo
    ) {

        if (
            tipo ===
            "Cliente"
        ) {

            return "🧑‍💼";

        }


        if (
            tipo ===
            "Proveedor"
        ) {

            return "🚚";

        }


        return "🤝";

    }


    // =====================================================
    // ESCAPAR
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