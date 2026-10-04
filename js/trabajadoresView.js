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


        const conPin =
            trabajadores.filter(
                trabajador =>
                    trabajador.pin
            ).length;


        this.mainContent.innerHTML = `

            <div class="trabajadores-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="trabajadores-hero">

                    <div class="trabajadores-hero-content">

                        <span class="trabajadores-eyebrow">
                            👷 PERSONAL
                        </span>


                        <h1>
                            Tu equipo,
                            <span>
                                el corazón del campo.
                            </span>
                        </h1>


                        <p>
                            Gestiona el personal de la explotación,
                            sus datos, funciones y acceso al sistema
                            de fichaje.
                        </p>


                        <button
                            id="nuevoTrabajador"
                            class="
                                primary-button
                                trabajadores-hero-button
                            "
                            type="button"
                        >
                            + Nuevo trabajador
                        </button>

                    </div>


                    <div class="trabajadores-hero-image">

                        <div class="trabajadores-hero-badge">

                            <span>
                                Personal activo
                            </span>

                            <strong>
                                ${activos}
                            </strong>

                        </div>


                        <div class="trabajadores-hero-copy">

                            <small>
                                EQUIPO · CAMPO · ORGANIZACIÓN
                            </small>

                            <strong>
                                Las personas que<br>
                                hacen crecer el campo
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

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


                    ${this.crearStat(
                        "🔐",
                        "Con PIN",
                        conPin
                    )}

                </section>


                <!-- ==========================================
                     CABECERA LISTADO
                =========================================== -->

                <div class="trabajadores-section-header">

                    <div>

                        <span class="trabajadores-section-eyebrow">
                            EQUIPO DE TRABAJO
                        </span>


                        <h2>
                            Plantilla
                        </h2>


                        <p>
                            Consulta el estado, puesto y datos
                            principales de cada trabajador.
                        </p>

                    </div>


                    <div class="trabajadores-summary">

                        <span>
                            ${trabajadores.length} trabajadores
                        </span>

                        <span>
                            ${activos} activos
                        </span>

                    </div>

                </div>


                <div id="listaTrabajadores"></div>

            </div>

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
            document
                .getElementById(
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

                <div class="trabajadores-empty">

                    <div class="trabajadores-empty-icon">
                        👷
                    </div>


                    <h3>
                        Todavía no tienes trabajadores
                    </h3>


                    <p>
                        Añade tu primer trabajador para comenzar
                        a gestionar el equipo de la explotación.
                    </p>


                    <button
                        id="crearPrimerTrabajador"
                        class="primary-button"
                        type="button"
                    >
                        + Añadir trabajador
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimerTrabajador"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormularioCrear()
                );


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
    // TARJETA
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

                <!-- ==================================
                     CABECERA
                =================================== -->

                <div class="trabajador-card-hero">

                    <div class="trabajador-card-hero-pattern"></div>


                    <div class="trabajador-card-hero-top">

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

                            ●
                            ${escaparHTML(
                                estado
                            )}

                        </span>


                        <div class="trabajador-card-actions">

                            <button
                                class="
                                    trabajador-icon-button
                                    editar-trabajador
                                "
                                data-id="${escaparHTML(
                                    trabajador.id
                                )}"
                                type="button"
                                title="Editar trabajador"
                            >
                                ✎
                            </button>


                            <button
                                class="
                                    trabajador-icon-button
                                    trabajador-delete
                                    eliminar-trabajador
                                "
                                data-id="${escaparHTML(
                                    trabajador.id
                                )}"
                                type="button"
                                title="Eliminar trabajador"
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    <!-- ==================================
                         FOTO FUTURA / AVATAR ACTUAL
                    =================================== -->

                    <div class="trabajador-avatar-wrap">

                        ${
                            trabajador.foto

                                ? `

                                    <img
                                        class="trabajador-avatar-photo"
                                        src="${escaparHTML(
                                            trabajador.foto
                                        )}"
                                        alt="${escaparHTML(
                                            nombreCompleto
                                        )}"
                                    >

                                `

                                : `

                                    <div class="trabajador-avatar">

                                        ${escaparHTML(
                                            iniciales
                                        )}

                                    </div>

                                `
                        }

                    </div>

                </div>


                <!-- ==================================
                     CUERPO
                =================================== -->

                <div class="trabajador-card-body">

                    <span class="trabajador-card-kicker">
                        PERSONAL
                    </span>


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


                    <div class="trabajador-access-row">

                        <span
                            class="
                                trabajador-pin-status
                                ${
                                    trabajador.pin
                                        ? "configured"
                                        : ""
                                }
                            "
                        >

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
                                Fecha de alta
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

                                                <div>

                                                    <span>
                                                        📞
                                                    </span>

                                                    <div>

                                                        <small>
                                                            Teléfono
                                                        </small>

                                                        <strong>
                                                            ${escaparHTML(
                                                                trabajador.telefono
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>

                                            `

                                            : ""
                                    }


                                    ${
                                        trabajador.email

                                            ? `

                                                <div>

                                                    <span>
                                                        ✉️
                                                    </span>

                                                    <div>

                                                        <small>
                                                            Email
                                                        </small>

                                                        <strong>
                                                            ${escaparHTML(
                                                                trabajador.email
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>

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
                                        NOTAS
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


                    <button
                        class="
                            trabajador-main-action
                            editar-trabajador
                        "
                        data-id="${escaparHTML(
                            trabajador.id
                        )}"
                        type="button"
                    >

                        Editar trabajador

                        <span>
                            →
                        </span>

                    </button>

                </div>

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


        this.mostrarFormulario(
            trabajador
        );

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        trabajador
    ) {

        const editando =
            !!trabajador;


        this.mainContent.innerHTML = `

            <div class="trabajador-form-page">

                <button
                    id="volverTrabajadores"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="trabajador-form-header">

                    <span class="trabajador-form-eyebrow">
                        👷 PERSONAL
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar trabajador"
                                : "Nuevo trabajador"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza los datos y configuración del trabajador."

                                : "Añade una nueva persona a la plantilla de la explotación."
                        }

                    </p>

                </header>


                <div class="trabajador-form-layout">

                    ${this.crearFormulario(
                        trabajador
                    )}


                    <aside class="trabajador-form-aside">

                        <div class="trabajador-form-photo">

                            <div>

                                <span>
                                    EQUIPO GESTACAMPS
                                </span>


                                <strong>
                                    Las personas,
                                    primero.
                                </strong>

                            </div>

                        </div>


                        <div class="trabajador-form-tip">

                            <span>
                                📸
                            </span>


                            <div>

                                <strong>
                                    Foto del trabajador
                                </strong>


                                <p>
                                    Más adelante podremos asignar
                                    una fotografía individual a cada
                                    trabajador. Mientras tanto se
                                    mostrarán sus iniciales.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

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
                () => {

                    if (
                        editando
                    ) {

                        this.guardarCambios(
                            trabajador.id
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
        trabajador
    ) {

        return `

            <section
                class="
                    form-panel
                    trabajador-form-panel
                "
            >

                <div class="trabajador-form-section">

                    <div class="trabajador-form-avatar">

                        ${escaparHTML(
                            trabajador
                                ? this.obtenerIniciales(
                                    trabajador
                                )
                                : "👷"
                        )}

                    </div>


                    <div>

                        <h3>
                            Datos del trabajador
                        </h3>


                        <p>
                            Información personal y acceso al fichaje.
                        </p>

                    </div>

                </div>


                <div class="trabajador-form-grid">

                    <div class="form-group">

                        <label>
                            Nombre *
                        </label>


                        <input
                            id="nombreTrabajador"
                            type="text"
                            autocomplete="off"
                            placeholder="Nombre"
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
                            placeholder="Apellidos"
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
                            placeholder="600 000 000"
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
                            placeholder="nombre@empresa.com"
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
                            El trabajador utilizará este PIN
                            para registrar sus entradas y salidas.
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


                    <div
                        class="
                            form-group
                            trabajador-form-wide
                        "
                    >

                        <label>
                            Notas
                        </label>


                        <textarea
                            id="notasTrabajador"
                            rows="5"
                            placeholder="Observaciones sobre el trabajador..."
                        >${escaparHTML(
                            trabajador?.notas
                            ||
                            ""
                        )}</textarea>

                    </div>

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
                .filter(Boolean)
                .join(" ")
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
                .filter(Boolean);


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
                        .charAt(0)
                        .toUpperCase()
            )
            .slice(
                0,
                2
            )
            .join("");

    }

}