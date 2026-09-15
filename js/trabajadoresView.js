export class TrabajadoresView {

    constructor(
        mainContent,
        trabajadorService
    ) {

        this.mainContent =
            mainContent;

        this.trabajadorService =
            trabajadorService;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const trabajadores =
            this.trabajadorService
                .obtenerTodos();


        const activos =
            trabajadores.filter(
                trabajador =>
                    trabajador.estado ===
                    "Activo"
            ).length;


        const inactivos =
            trabajadores.filter(
                trabajador =>
                    trabajador.estado ===
                    "Inactivo"
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Trabajadores
                    </h2>

                    <p>
                        Gestiona el personal de la explotación
                    </p>

                </div>


                <button
                    id="nuevoTrabajador"
                    class="primary-button"
                >
                    + Nuevo trabajador
                </button>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        👷
                    </span>

                    <div>

                        <p>
                            Trabajadores
                        </p>

                        <h3>
                            ${trabajadores.length}
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


                <div class="card">

                    <span class="card-icon">
                        ⛔
                    </span>

                    <div>

                        <p>
                            Inactivos
                        </p>

                        <h3>
                            ${inactivos}
                        </h3>

                    </div>

                </div>

            </section>


            <div id="listaTrabajadores"></div>

        `;


        document
            .getElementById(
                "nuevoTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormularioCrear()
            );


        this.mostrarLista();

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const trabajadores =
            this.trabajadorService
                .obtenerTodos();


        const contenedor =
            document.getElementById(
                "listaTrabajadores"
            );


        if (
            trabajadores.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        👷
                    </div>

                    <h3>
                        Todavía no tienes trabajadores
                    </h3>

                    <p>
                        Añade tu primer trabajador.
                    </p>

                </div>

            `;


            return;

        }


        contenedor.innerHTML = `

            <div class="trabajadores-grid">

                ${trabajadores.map(
                    trabajador => `

                        <div class="trabajador-card">

                            <div class="trabajador-card-header">

                                <span class="trabajador-icon">
                                    👷
                                </span>


                                <div class="trabajador-actions">

                                    <button
                                        class="secondary-button editar-trabajador"
                                        data-id="${trabajador.id}"
                                    >
                                        Editar
                                    </button>


                                    <button
                                        class="delete-button eliminar-trabajador"
                                        data-id="${trabajador.id}"
                                    >
                                        ×
                                    </button>

                                </div>

                            </div>


                            <h3>
                                ${this.trabajadorService.obtenerNombreCompleto(trabajador)}
                            </h3>


                            ${
                                trabajador.puesto

                                    ? `

                                        <p class="trabajador-puesto">
                                            ${trabajador.puesto}
                                        </p>

                                    `

                                    : ""
                            }


                            <div class="trabajador-info">

                                <div>

                                    <span>
                                        Estado
                                    </span>

                                    <strong>
                                        ${trabajador.estado}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Alta
                                    </span>

                                    <strong>

                                        ${
                                            trabajador.fechaAlta
                                                ? this.formatearFecha(
                                                    trabajador.fechaAlta
                                                )
                                                : "Sin fecha"
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        PIN de fichaje
                                    </span>

                                    <strong>
                                        ${
                                            trabajador.pin
                                                ? "Configurado"
                                                : "Sin PIN"
                                        }
                                    </strong>

                                </div>

                            </div>


                            ${
                                trabajador.telefono

                                    ? `

                                        <p>
                                            📞 ${trabajador.telefono}
                                        </p>

                                    `

                                    : ""
                            }


                            ${
                                trabajador.email

                                    ? `

                                        <p>
                                            ✉️ ${trabajador.email}
                                        </p>

                                    `

                                    : ""
                            }


                            ${
                                trabajador.notas

                                    ? `

                                        <div class="trabajador-notas">

                                            <span>
                                                Notas
                                            </span>

                                            <p>
                                                ${trabajador.notas}
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


        // =================================================
        // EDITAR
        // =================================================

        document
            .querySelectorAll(
                ".editar-trabajador"
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


        // =================================================
        // ELIMINAR
        // =================================================

        document
            .querySelectorAll(
                ".eliminar-trabajador"
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


                            const trabajador =
                                this.trabajadorService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !trabajador
                            ) {

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar a "${this.trabajadorService.obtenerNombreCompleto(trabajador)}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.trabajadorService
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
    // CREAR
    // =====================================================

    mostrarFormularioCrear() {

        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Nuevo trabajador
                    </h2>

                    <p>
                        Añade una persona a la plantilla
                    </p>

                </div>

            </header>


            ${this.crearFormulario(null)}

        `;


        document
            .getElementById(
                "cancelarTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.guardarNuevo()
            );

    }


    guardarNuevo() {

        const datos =
            this.obtenerDatosFormulario();


        if (
            !datos
        ) {

            return;

        }


        const resultado =
            this.trabajadorService
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


    // =====================================================
    // EDITAR
    // =====================================================

    mostrarFormularioEditar(
        id
    ) {

        const trabajador =
            this.trabajadorService
                .obtenerPorId(
                    id
                );


        if (
            !trabajador
        ) {

            return;

        }


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Editar trabajador
                    </h2>

                    <p>
                        Modifica los datos del trabajador
                    </p>

                </div>

            </header>


            ${this.crearFormulario(trabajador)}

        `;


        document
            .getElementById(
                "cancelarTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarTrabajador"
            )
            .addEventListener(
                "click",
                () => {

                    const datos =
                        this.obtenerDatosFormulario();


                    if (
                        !datos
                    ) {

                        return;

                    }


                    const resultado =
                        this.trabajadorService
                            .actualizar(
                                id,
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
    // FORMULARIO
    // =====================================================

    crearFormulario(
        trabajador
    ) {

        return `

            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Nombre *
                    </label>

                    <input
                        id="nombreTrabajador"
                        type="text"
                        value="${trabajador?.nombre || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Apellidos
                    </label>

                    <input
                        id="apellidosTrabajador"
                        type="text"
                        value="${trabajador?.apellidos || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Teléfono
                    </label>

                    <input
                        id="telefonoTrabajador"
                        type="text"
                        value="${trabajador?.telefono || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        id="emailTrabajador"
                        type="email"
                        value="${trabajador?.email || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Puesto / función
                    </label>

                    <input
                        id="puestoTrabajador"
                        type="text"
                        placeholder="Ej. Tractorista"
                        value="${trabajador?.puesto || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        PIN de fichaje *
                    </label>

                    <input
                        id="pinTrabajador"
                        type="password"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="4"
                        autocomplete="off"
                        placeholder="4 números"
                        value="${trabajador?.pin || ""}"
                    >

                    <small class="form-help">
                        El trabajador utilizará este PIN para registrar sus entradas y salidas.
                    </small>

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select
                        id="estadoTrabajador"
                    >

                        <option
                            value="Activo"
                            ${
                                !trabajador
                                ||
                                trabajador.estado ===
                                "Activo"

                                    ? "selected"
                                    : ""
                            }
                        >
                            Activo
                        </option>


                        <option
                            value="Inactivo"
                            ${
                                trabajador?.estado ===
                                "Inactivo"

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
                        Fecha de alta
                    </label>

                    <input
                        id="fechaAltaTrabajador"
                        type="date"
                        value="${trabajador?.fechaAlta || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasTrabajador"
                        rows="5"
                    >${trabajador?.notas || ""}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarTrabajador"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarTrabajador"
                        class="primary-button"
                    >

                        ${
                            trabajador
                                ? "Guardar cambios"
                                : "Guardar trabajador"
                        }

                    </button>

                </div>

            </div>

        `;

    }


    // =====================================================
    // DATOS FORMULARIO
    // =====================================================

    obtenerDatosFormulario() {

        const nombre =
            document
                .getElementById(
                    "nombreTrabajador"
                )
                .value
                .trim();


        const pin =
            document
                .getElementById(
                    "pinTrabajador"
                )
                .value
                .trim();


        if (
            !nombre
        ) {

            alert(
                "Introduce el nombre del trabajador."
            );

            return null;

        }


        if (
            !/^\d{4}$/.test(
                pin
            )
        ) {

            alert(
                "El PIN debe tener exactamente 4 números."
            );

            return null;

        }


        return {

            nombre:
                nombre,

            apellidos:
                document
                    .getElementById(
                        "apellidosTrabajador"
                    )
                    .value
                    .trim(),

            telefono:
                document
                    .getElementById(
                        "telefonoTrabajador"
                    )
                    .value
                    .trim(),

            email:
                document
                    .getElementById(
                        "emailTrabajador"
                    )
                    .value
                    .trim(),

            puesto:
                document
                    .getElementById(
                        "puestoTrabajador"
                    )
                    .value
                    .trim(),

            pin:
                pin,

            estado:
                document
                    .getElementById(
                        "estadoTrabajador"
                    )
                    .value,

            fechaAlta:
                document
                    .getElementById(
                        "fechaAltaTrabajador"
                    )
                    .value,

            notas:
                document
                    .getElementById(
                        "notasTrabajador"
                    )
                    .value
                    .trim()

        };

    }


    // =====================================================
    // FECHA
    // =====================================================

    formatearFecha(
        fecha
    ) {

        if (
            !fecha
        ) {

            return "";

        }


        const partes =
            fecha.split(
                "-"
            );


        return (
            partes[2]
            +
            "/"
            +
            partes[1]
            +
            "/"
            +
            partes[0]
        );

    }

}