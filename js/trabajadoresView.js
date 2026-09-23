import {
    escaparHTML,
    formatearFecha
} from "./utils.js";


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
            this.obtenerTrabajadores();


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
                    type="button"
                >
                    + Nuevo trabajador
                </button>

            </header>


            <section class="stats trabajadores-stats">

                ${this.crearStat(
                    "👷",
                    "Trabajadores",
                    trabajadores.length
                )}

                ${this.crearStat(
                    "✅",
                    "Activos",
                    activos
                )}

                ${this.crearStat(
                    "⛔",
                    "Inactivos",
                    inactivos
                )}

            </section>


            <div id="listaTrabajadores"></div>

        `;


        document
            .getElementById(
                "nuevoTrabajador"
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
                        ${escaparHTML(
                            titulo
                        )}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </article>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const trabajadores =
            this.obtenerTrabajadores();


        const contenedor =
            document.getElementById(
                "listaTrabajadores"
            );


        if (
            !contenedor
        ) {

            return;

        }


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

            <div class="trabajadores-grid trabajadores-grid-premium">

                ${trabajadores
                    .map(
                        trabajador =>
                            this.crearTarjetaTrabajador(
                                trabajador
                            )
                    )
                    .join("")}

            </div>

        `;


        contenedor
            .querySelectorAll(
                ".editar-trabajador"
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


        contenedor
            .querySelectorAll(
                ".eliminar-trabajador"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarTrabajador(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // TARJETA TRABAJADOR
    // =====================================================

    crearTarjetaTrabajador(
        trabajador
    ) {

        const nombreCompleto =
            this.obtenerNombreCompleto(
                trabajador
            );


        const estado =
            trabajador.estado
            ||
            "Activo";


        const iniciales =
            this.obtenerIniciales(
                trabajador
            );


        return `

            <article class="trabajador-card trabajador-card-premium">

                <div class="trabajador-card-header">

                    <div class="trabajador-identity">

                        <div class="trabajador-avatar">
                            ${escaparHTML(
                                iniciales
                            )}
                        </div>


                        <div>

                            <h3>
                                ${escaparHTML(
                                    nombreCompleto
                                )}
                            </h3>


                            <p class="trabajador-puesto">

                                ${escaparHTML(
                                    trabajador.puesto
                                    ||
                                    "Trabajador"
                                )}

                            </p>

                        </div>

                    </div>


                    <div class="trabajador-actions">

                        <button
                            class="secondary-button editar-trabajador"
                            data-id="${escaparHTML(
                                trabajador.id
                            )}"
                            type="button"
                        >
                            Editar
                        </button>


                        <button
                            class="delete-button eliminar-trabajador"
                            data-id="${escaparHTML(
                                trabajador.id
                            )}"
                            type="button"
                            aria-label="Eliminar trabajador"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <div class="trabajador-state-row">

                    <span
                        class="
                            trabajador-status
                            ${
                                estado ===
                                "Activo"
                                    ? "activo"
                                    : "inactivo"
                            }
                        "
                    >

                        ${
                            estado ===
                            "Activo"
                                ? "● Activo"
                                : "● Inactivo"
                        }

                    </span>


                    <span class="trabajador-pin-status">

                        ${
                            trabajador.pin
                                ? "🔐 PIN configurado"
                                : "🔓 Sin PIN"
                        }

                    </span>

                </div>


                <div class="trabajador-info trabajador-info-premium">

                    <div>

                        <span>
                            Alta
                        </span>

                        <strong>

                            ${
                                trabajador.fechaAlta

                                    ? formatearFecha(
                                        trabajador.fechaAlta
                                    )

                                    : "Sin fecha"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>
                            Estado
                        </span>

                        <strong>
                            ${escaparHTML(
                                estado
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    trabajador.telefono
                    ||
                    trabajador.email

                        ? `

                            <div class="trabajador-contact">

                                ${
                                    trabajador.telefono

                                        ? `

                                            <span>

                                                📞
                                                ${escaparHTML(
                                                    trabajador.telefono
                                                )}

                                            </span>

                                        `

                                        : ""
                                }


                                ${
                                    trabajador.email

                                        ? `

                                            <span>

                                                ✉️
                                                ${escaparHTML(
                                                    trabajador.email
                                                )}

                                            </span>

                                        `

                                        : ""
                                }

                            </div>

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
                                    ${escaparHTML(
                                        trabajador.notas
                                    )}
                                </p>

                            </div>

                        `

                        : ""
                }

            </article>

        `;

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminarTrabajador(
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


        const nombre =
            this.obtenerNombreCompleto(
                trabajador
            );


        if (
            !confirm(
                `¿Quieres eliminar a "${nombre}"?`
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
                ||
                "No se ha podido eliminar el trabajador."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // CREAR
    // =====================================================

    mostrarFormularioCrear() {

        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <button
                        id="volverTrabajadores"
                        class="back-button"
                        type="button"
                    >
                        ← Volver
                    </button>

                    <h2>
                        Nuevo trabajador
                    </h2>

                    <p>
                        Añade una persona a la plantilla
                    </p>

                </div>

            </header>


            ${this.crearFormulario(
                null
            )}

        `;


        document
            .getElementById(
                "volverTrabajadores"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarTrabajador"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarTrabajador"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarNuevo()
            );

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
            this.trabajadorService
                .crear(
                    datos
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido crear el trabajador."
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

                    <button
                        id="volverTrabajadores"
                        class="back-button"
                        type="button"
                    >
                        ← Volver
                    </button>

                    <h2>
                        Editar trabajador
                    </h2>

                    <p>
                        Modifica los datos del trabajador
                    </p>

                </div>

            </header>


            ${this.crearFormulario(
                trabajador
            )}

        `;


        document
            .getElementById(
                "volverTrabajadores"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarTrabajador"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarTrabajador"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarCambios(
                        id
                    )
            );

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
            this.trabajadorService
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
                "No se ha podido actualizar el trabajador."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    crearFormulario(
        trabajador
    ) {

        return `

            <div class="form-panel trabajador-form-panel">

                <div class="trabajador-form-grid">

                    <div class="form-group">

                        <label>
                            Nombre *
                        </label>

                        <input
                            id="nombreTrabajador"
                            type="text"
                            autocomplete="off"
                            value="${escaparHTML(
                                trabajador?.nombre
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Apellidos
                        </label>

                        <input
                            id="apellidosTrabajador"
                            type="text"
                            autocomplete="off"
                            value="${escaparHTML(
                                trabajador?.apellidos
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
                            id="telefonoTrabajador"
                            type="tel"
                            autocomplete="tel"
                            value="${escaparHTML(
                                trabajador?.telefono
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            id="emailTrabajador"
                            type="email"
                            autocomplete="email"
                            value="${escaparHTML(
                                trabajador?.email
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Puesto / función
                        </label>

                        <input
                            id="puestoTrabajador"
                            type="text"
                            autocomplete="off"
                            placeholder="Ej. Tractorista"
                            value="${escaparHTML(
                                trabajador?.puesto
                                ||
                                ""
                            )}"
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
                            value="${escaparHTML(
                                trabajador?.pin
                                ||
                                ""
                            )}"
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
                            value="${escaparHTML(
                                trabajador?.fechaAlta
                                ||
                                ""
                            )}"
                        >

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasTrabajador"
                        rows="5"
                    >${escaparHTML(
                        trabajador?.notas
                        ||
                        ""
                    )}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarTrabajador"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarTrabajador"
                        class="primary-button"
                        type="button"
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
                ?.value
                .trim()
            ||
            "";


        const pin =
            document
                .getElementById(
                    "pinTrabajador"
                )
                ?.value
                .trim()
            ||
            "";


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

            nombre,

            apellidos:
                this.obtenerValor(
                    "apellidosTrabajador"
                ),

            telefono:
                this.obtenerValor(
                    "telefonoTrabajador"
                ),

            email:
                this.obtenerValor(
                    "emailTrabajador"
                ),

            puesto:
                this.obtenerValor(
                    "puestoTrabajador"
                ),

            pin,

            estado:
                this.obtenerValor(
                    "estadoTrabajador"
                )
                ||
                "Activo",

            fechaAlta:
                this.obtenerValor(
                    "fechaAltaTrabajador"
                ),

            notas:
                this.obtenerValor(
                    "notasTrabajador"
                )

        };

    }


    // =====================================================
    // VALOR INPUT
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
    // DATOS
    // =====================================================

    obtenerTrabajadores() {

        const trabajadores =
            this.trabajadorService
                .obtenerTodos();


        return Array.isArray(
            trabajadores
        )
            ? trabajadores
            : [];

    }


    // =====================================================
    // NOMBRE
    // =====================================================

    obtenerNombreCompleto(
        trabajador
    ) {

        if (
            typeof
            this.trabajadorService
                .obtenerNombreCompleto ===
            "function"
        ) {

            return this.trabajadorService
                .obtenerNombreCompleto(
                    trabajador
                );

        }


        return (
            [
                trabajador?.nombre,
                trabajador?.apellidos
            ]
                .filter(
                    Boolean
                )
                .join(
                    " "
                )
                .trim()
            ||
            "Trabajador"
        );

    }


    // =====================================================
    // INICIALES
    // =====================================================

    obtenerIniciales(
        trabajador
    ) {

        const partes =
            [
                trabajador?.nombre,
                trabajador?.apellidos
            ]
                .filter(
                    Boolean
                );


        if (
            partes.length ===
            0
        ) {

            return "👷";

        }


        return partes
            .map(
                parte =>
                    String(
                        parte
                    )
                        .trim()
                        .charAt(
                            0
                        )
                        .toUpperCase()
            )
            .slice(
                0,
                2
            )
            .join("");

    }

}