import {

    ROLES_USUARIO,

    NOMBRES_ROL

} from "./usuario.js";


import {

    escaparHTML

} from "./utils.js";



export class UsuariosView {

    constructor(
        mainContent,
        usuarioService,
        trabajadorService
    ) {

        this.mainContent =
            mainContent;

        this.usuarioService =
            usuarioService;

        this.trabajadorService =
            trabajadorService;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const usuarios =
            this.obtenerUsuarios();


        const activos =
            usuarios.filter(
                usuario =>
                    usuario.activo !==
                    false
            ).length;


        const administradores =
            usuarios.filter(
                usuario =>
                    usuario.rol ===
                    ROLES_USUARIO.ADMINISTRADOR
            ).length;


        const encargados =
            usuarios.filter(
                usuario =>
                    usuario.rol ===
                    ROLES_USUARIO.ENCARGADO
            ).length;


        const trabajadores =
            usuarios.filter(
                usuario =>
                    usuario.rol ===
                    ROLES_USUARIO.TRABAJADOR
            ).length;


        this.mainContent.innerHTML = `

            <div class="usuarios-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="usuarios-hero">

                    <div class="usuarios-hero-content">

                        <span class="usuarios-eyebrow">
                            🔐 SISTEMA
                        </span>


                        <h1>
                            Cada usuario,
                            <span>
                                solo donde debe.
                            </span>
                        </h1>


                        <p>
                            Controla quién puede acceder a GestaCamps,
                            qué rol tiene cada persona y qué usuarios
                            están activos en la explotación.
                        </p>


                        <button
                            id="nuevoUsuario"
                            class="
                                primary-button
                                usuarios-hero-button
                            "
                            type="button"
                        >
                            + Nuevo usuario
                        </button>

                    </div>


                    <div class="usuarios-hero-image">

                        <div class="usuarios-hero-badge">

                            <span>
                                Usuarios activos
                            </span>


                            <strong>
                                ${activos}
                            </strong>

                        </div>


                        <div class="usuarios-hero-copy">

                            <small>
                                ACCESO · ROLES · CONTROL
                            </small>


                            <strong>
                                Seguridad sencilla,<br>
                                acceso controlado
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats usuarios-stats">

                    ${this.crearStat(
                        "👥",
                        "Usuarios",
                        usuarios.length
                    )}


                    ${this.crearStat(
                        "✅",
                        "Activos",
                        activos
                    )}


                    ${this.crearStat(
                        "🔐",
                        "Administradores",
                        administradores
                    )}


                    ${this.crearStat(
                        "👨‍🌾",
                        "Encargados / trabajadores",
                        encargados + trabajadores
                    )}

                </section>


                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <div class="usuarios-section-header">

                    <div>

                        <span class="usuarios-section-eyebrow">
                            CONTROL DE ACCESO
                        </span>


                        <h2>
                            Usuarios y permisos
                        </h2>


                        <p>
                            Gestiona accesos, roles,
                            vinculación con trabajadores y estado.
                        </p>

                    </div>


                    <div class="usuarios-summary">

                        <span>
                            ${usuarios.length} usuarios
                        </span>


                        <span class="success">
                            ${activos} activos
                        </span>


                        <span>
                            ${administradores} admin
                        </span>

                    </div>

                </div>


                <div id="listaUsuarios">

                    ${this.crearListado(
                        usuarios
                    )}

                </div>

            </div>

        `;


        this.configurarEventosListado();

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
    // LISTADO
    // =====================================================

    crearListado(
        usuarios
    ) {

        if (
            usuarios.length ===
            0
        ) {

            return `

                <section class="usuarios-empty">

                    <div class="usuarios-empty-icon">
                        👥
                    </div>


                    <h3>
                        No hay usuarios
                    </h3>


                    <p>
                        Crea el primer usuario
                        para empezar a gestionar accesos.
                    </p>


                    <button
                        id="crearPrimerUsuario"
                        class="primary-button"
                        type="button"
                    >
                        + Crear usuario
                    </button>

                </section>

            `;

        }


        return `

            <div class="usuarios-grid">

                ${usuarios
                    .map(
                        (
                            usuario,
                            index
                        ) =>
                            this.crearTarjetaUsuario(
                                usuario,
                                index
                            )
                    )
                    .join("")}

            </div>

        `;

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjetaUsuario(
        usuario,
        index
    ) {

        const nombreCompleto =
            [
                usuario.nombre,
                usuario.apellidos
            ]
                .filter(Boolean)
                .join(" ")
            ||
            usuario.usuario;


        const nombreRol =
            NOMBRES_ROL[
                usuario.rol
            ]
            ||
            "Usuario";


        const activo =
            usuario.activo !==
            false;


        const imagen =
            (
                index %
                3
            )
            +
            1;


        const iniciales =
            this.obtenerIniciales(
                nombreCompleto
            );


        return `

            <article class="usuario-card">

                <div
                    class="
                        usuario-cover
                        usuario-cover-${imagen}
                    "
                >

                    <div class="usuario-cover-overlay"></div>


                    <div class="usuario-cover-top">

                        <span
                            class="
                                usuario-status
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
                                    : "Desactivado"
                            }
                        </span>


                        <button
                            type="button"
                            class="
                                usuario-edit-icon
                                editar-usuario
                            "
                            data-id="${escaparHTML(
                                usuario.id
                            )}"
                            title="Editar usuario"
                        >
                            ✎
                        </button>

                    </div>


                    <div class="usuario-cover-bottom">

                        <div class="usuario-avatar">
                            ${escaparHTML(
                                iniciales
                            )}
                        </div>


                        <div>

                            <small>
                                ${escaparHTML(
                                    nombreRol
                                )}
                            </small>


                            <strong>
                                ${escaparHTML(
                                    nombreCompleto
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <div class="usuario-card-body">

                    <div class="usuario-role-row">

                        <span class="usuario-role-chip">

                            ${this.obtenerIconoRol(
                                usuario.rol
                            )}

                            ${escaparHTML(
                                nombreRol
                            )}

                        </span>

                    </div>


                    <div class="usuario-info-grid">

                        <div>

                            <span>
                                Usuario
                            </span>


                            <strong>
                                ${escaparHTML(
                                    usuario.usuario
                                    ||
                                    "—"
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Estado
                            </span>


                            <strong>
                                ${
                                    activo
                                        ? "Activo"
                                        : "Desactivado"
                                }
                            </strong>

                        </div>

                    </div>


                    ${
                        usuario.trabajadorId

                            ? `

                                <div class="usuario-linked">

                                    <span>
                                        👷
                                    </span>


                                    <div>

                                        <small>
                                            Trabajador vinculado
                                        </small>


                                        <strong>
                                            ${escaparHTML(
                                                this.obtenerNombreTrabajador(
                                                    usuario.trabajadorId
                                                )
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    <div class="usuario-actions">

                        <button
                            type="button"
                            class="
                                secondary-button
                                cambiar-estado-usuario
                            "
                            data-id="${escaparHTML(
                                usuario.id
                            )}"
                            data-activo="${
                                activo
                                    ? "false"
                                    : "true"
                            }"
                        >

                            ${
                                activo
                                    ? "Desactivar"
                                    : "Activar"
                            }

                        </button>


                        <button
                            type="button"
                            class="
                                secondary-button
                                editar-usuario
                            "
                            data-id="${escaparHTML(
                                usuario.id
                            )}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="
                                delete-button
                                eliminar-usuario
                            "
                            data-id="${escaparHTML(
                                usuario.id
                            )}"
                            aria-label="Eliminar usuario"
                            title="Eliminar usuario"
                        >
                            ×
                        </button>

                    </div>

                </div>

            </article>

        `;

    }


    // =====================================================
    // EVENTOS LISTADO
    // =====================================================

    configurarEventosListado() {

        const nuevo =
            document
                .getElementById(
                    "nuevoUsuario"
                );


        const primero =
            document
                .getElementById(
                    "crearPrimerUsuario"
                );


        nuevo
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        primero
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        document
            .querySelectorAll(
                ".editar-usuario"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.mostrarFormulario(
                                boton.dataset.id
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".cambiar-estado-usuario"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.cambiarEstado(
                                boton.dataset.id,
                                boton.dataset.activo ===
                                "true"
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-usuario"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.eliminar(
                                boton.dataset.id
                            )
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


        const usuario =
            editando

                ? this.usuarioService
                    .obtenerPorId(
                        id
                    )

                : null;


        if (
            editando
            &&
            !usuario
        ) {

            alert(
                "El usuario no existe."
            );


            this.mostrar();


            return;

        }


        const trabajadores =
            this.obtenerTrabajadores();


        this.mainContent.innerHTML = `

            <div class="usuario-form-page">

                <button
                    type="button"
                    id="volverUsuarios"
                    class="back-button"
                >
                    ← Volver
                </button>


                <header class="usuario-form-header">

                    <span>
                        🔐 SISTEMA
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar usuario"
                                : "Nuevo usuario"
                        }

                    </h1>


                    <p>
                        Configura los datos de acceso,
                        el rol y la vinculación con trabajadores.
                    </p>

                </header>


                <div class="usuario-form-layout">

                    <section class="form-panel usuario-form-panel">

                        <div class="usuario-form-section">

                            <span>
                                👤
                            </span>


                            <div>

                                <h3>
                                    Datos del usuario
                                </h3>


                                <p>
                                    Información de acceso y permisos.
                                </p>

                            </div>

                        </div>


                        <div class="usuario-form-grid">

                            <div class="form-group">

                                <label for="usuarioNombre">
                                    Nombre *
                                </label>


                                <input
                                    id="usuarioNombre"
                                    type="text"
                                    value="${escaparHTML(
                                        usuario?.nombre
                                        ??
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label for="usuarioApellidos">
                                    Apellidos
                                </label>


                                <input
                                    id="usuarioApellidos"
                                    type="text"
                                    value="${escaparHTML(
                                        usuario?.apellidos
                                        ??
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label for="usuarioLogin">
                                    Nombre de usuario *
                                </label>


                                <input
                                    id="usuarioLogin"
                                    type="text"
                                    autocomplete="username"
                                    value="${escaparHTML(
                                        usuario?.usuario
                                        ??
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label for="usuarioRol">
                                    Rol *
                                </label>


                                <select id="usuarioRol">

                                    ${this.crearOpcionesRol(
                                        usuario?.rol
                                    )}

                                </select>

                            </div>


                            <div
                                class="
                                    form-group
                                    usuario-form-wide
                                "
                            >

                                <label for="usuarioTrabajador">
                                    Trabajador vinculado
                                </label>


                                <select id="usuarioTrabajador">

                                    <option value="">
                                        Sin vincular
                                    </option>


                                    ${this.crearOpcionesTrabajadores(
                                        trabajadores,
                                        usuario?.trabajadorId
                                    )}

                                </select>


                                <small class="form-help">
                                    Opcional. Permite relacionar
                                    el usuario con un trabajador existente.
                                </small>

                            </div>


                            <div class="form-group">

                                <label for="usuarioPin">

                                    ${
                                        editando
                                            ? "Nuevo PIN"
                                            : "PIN *"
                                    }

                                </label>


                                <input
                                    id="usuarioPin"
                                    type="password"
                                    inputmode="numeric"
                                    autocomplete="new-password"
                                    maxlength="8"
                                    placeholder="${
                                        editando
                                            ? "Déjalo vacío para mantener el actual"
                                            : "Entre 4 y 8 números"
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label for="usuarioRepetirPin">

                                    ${
                                        editando
                                            ? "Repetir nuevo PIN"
                                            : "Repetir PIN *"
                                    }

                                </label>


                                <input
                                    id="usuarioRepetirPin"
                                    type="password"
                                    inputmode="numeric"
                                    autocomplete="new-password"
                                    maxlength="8"
                                >

                            </div>


                            <div
                                class="
                                    form-group
                                    usuario-form-wide
                                "
                            >

                                <label class="usuario-active-label">

                                    <input
                                        id="usuarioActivo"
                                        type="checkbox"
                                        ${
                                            usuario?.activo !==
                                            false
                                                ? "checked"
                                                : ""
                                        }
                                    >


                                    <span>

                                        <strong>
                                            Usuario activo
                                        </strong>


                                        <small>
                                            Permite iniciar sesión
                                            y acceder según su rol.
                                        </small>

                                    </span>

                                </label>

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarUsuario"
                                type="button"
                                class="secondary-button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarUsuario"
                                type="button"
                                class="primary-button"
                            >

                                ${
                                    editando
                                        ? "Guardar cambios"
                                        : "Crear usuario"
                                }

                            </button>

                        </div>

                    </section>


                    <aside class="usuario-form-aside">

                        <div class="usuario-form-photo">

                            <div>

                                <span>
                                    CONTROL DE ACCESO
                                </span>


                                <strong>
                                    Cada rol,
                                    con el acceso adecuado.
                                </strong>

                            </div>

                        </div>


                        <div class="usuario-role-help">

                            <div>

                                <span>
                                    🔐
                                </span>


                                <div>

                                    <strong>
                                        Administrador
                                    </strong>


                                    <p>
                                        Acceso completo
                                        a la gestión.
                                    </p>

                                </div>

                            </div>


                            <div>

                                <span>
                                    🧑‍🌾
                                </span>


                                <div>

                                    <strong>
                                        Encargado
                                    </strong>


                                    <p>
                                        Gestión operativa
                                        con permisos limitados.
                                    </p>

                                </div>

                            </div>


                            <div>

                                <span>
                                    👷
                                </span>


                                <div>

                                    <strong>
                                        Trabajador
                                    </strong>


                                    <p>
                                        Acceso únicamente
                                        a sus funciones autorizadas.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        this.configurarEventosFormulario(
            usuario
        );

    }


    // =====================================================
    // OPCIONES ROL
    // =====================================================

    crearOpcionesRol(
        rolActual = null
    ) {

        return Object
            .values(
                ROLES_USUARIO
            )
            .map(
                rol => {

                    const seleccionado =
                        rol ===
                        rolActual
                            ? "selected"
                            : "";


                    return `

                        <option
                            value="${escaparHTML(
                                rol
                            )}"
                            ${seleccionado}
                        >
                            ${escaparHTML(
                                NOMBRES_ROL[
                                    rol
                                ]
                            )}
                        </option>

                    `;

                }
            )
            .join("");

    }


    // =====================================================
    // TRABAJADORES
    // =====================================================

    obtenerTrabajadores() {

        if (
            !this.trabajadorService
        ) {

            return [];

        }


        if (
            typeof
            this.trabajadorService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.trabajadorService
                    .obtenerTodos()
                ||
                []
            );

        }


        if (
            typeof
            this.trabajadorService
                .obtenerTrabajadores ===
            "function"
        ) {

            return (
                this.trabajadorService
                    .obtenerTrabajadores()
                ||
                []
            );

        }


        return [];

    }


    crearOpcionesTrabajadores(
        trabajadores,
        trabajadorIdActual
    ) {

        return trabajadores
            .map(
                trabajador => {

                    const nombre =
                        [
                            trabajador.nombre,
                            trabajador.apellidos
                        ]
                            .filter(Boolean)
                            .join(" ")
                        ||
                        `Trabajador ${trabajador.id}`;


                    const seleccionado =
                        String(
                            trabajador.id
                        )
                        ===
                        String(
                            trabajadorIdActual
                            ??
                            ""
                        )
                            ? "selected"
                            : "";


                    return `

                        <option
                            value="${escaparHTML(
                                trabajador.id
                            )}"
                            ${seleccionado}
                        >
                            ${escaparHTML(
                                nombre
                            )}
                        </option>

                    `;

                }
            )
            .join("");

    }


    // =====================================================
    // EVENTOS FORMULARIO
    // =====================================================

    configurarEventosFormulario(
        usuario
    ) {

        const volver =
            document
                .getElementById(
                    "volverUsuarios"
                );


        const cancelar =
            document
                .getElementById(
                    "cancelarUsuario"
                );


        const guardar =
            document
                .getElementById(
                    "guardarUsuario"
                );


        volver
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        cancelar
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        guardar
            ?.addEventListener(
                "click",
                () =>
                    this.guardar(
                        usuario
                    )
            );


        const repetirPin =
            document
                .getElementById(
                    "usuarioRepetirPin"
                );


        repetirPin
            ?.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        this.guardar(
                            usuario
                        );

                    }

                }
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    async guardar(
        usuarioActual
    ) {

        const nombre =
            this.obtenerValor(
                "usuarioNombre"
            );


        const apellidos =
            this.obtenerValor(
                "usuarioApellidos"
            );


        const login =
            this.obtenerValor(
                "usuarioLogin"
            );


        const rol =
            this.obtenerValor(
                "usuarioRol"
            );


        const trabajadorIdValor =
            this.obtenerValor(
                "usuarioTrabajador"
            );


        const trabajadorId =
            trabajadorIdValor
                ? trabajadorIdValor
                : null;


        const pin =
            this.obtenerValor(
                "usuarioPin"
            );


        const repetirPin =
            this.obtenerValor(
                "usuarioRepetirPin"
            );


        const activo =
            Boolean(
                document
                    .getElementById(
                        "usuarioActivo"
                    )
                    ?.checked
            );


        let resultado;


        if (
            usuarioActual
        ) {

            const cambioRol =
                usuarioActual.rol !==
                rol;


            resultado =
                await this.usuarioService
                    .actualizar(
                        usuarioActual.id,
                        {

                            nombre,

                            apellidos,

                            usuario:
                                login,

                            rol,

                            activo,

                            trabajadorId,

                            permisos:
                                cambioRol

                                    ? this.usuarioService
                                        .crearPermisosRol(
                                            rol
                                        )

                                    : usuarioActual.permisos,

                            pinNuevo:
                                pin,

                            repetirPinNuevo:
                                repetirPin

                        }
                    );

        }

        else {

            resultado =
                await this.usuarioService
                    .crear(
                        {

                            nombre,

                            apellidos,

                            usuario:
                                login,

                            rol,

                            activo,

                            trabajadorId,

                            pin,

                            repetirPin

                        }
                    );

        }


        if (
            !resultado
            ||
            !resultado.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido guardar el usuario."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        activo
    ) {

        const resultado =
            this.usuarioService
                .cambiarEstado(
                    id,
                    activo
                );


        if (
            !resultado
            ||
            !resultado.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido cambiar el estado."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const usuario =
            this.usuarioService
                .obtenerPorId(
                    id
                );


        if (
            !usuario
        ) {

            return;

        }


        const nombre =
            [
                usuario.nombre,
                usuario.apellidos
            ]
                .filter(Boolean)
                .join(" ")
            ||
            usuario.usuario;


        const confirmar =
            window.confirm(
                `¿Quieres eliminar el usuario "${nombre}"?`
            );


        if (
            !confirmar
        ) {

            return;

        }


        const resultado =
            this.usuarioService
                .eliminar(
                    id
                );


        if (
            !resultado
            ||
            !resultado.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido eliminar el usuario."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // HELPERS
    // =====================================================

    obtenerUsuarios() {

        const usuarios =
            this.usuarioService
                ?.obtenerTodos?.();


        return Array.isArray(
            usuarios
        )
            ? usuarios
            : [];

    }


    obtenerIconoRol(
        rol
    ) {

        if (
            rol ===
            ROLES_USUARIO.ADMINISTRADOR
        ) {

            return "🔐";

        }


        if (
            rol ===
            ROLES_USUARIO.ENCARGADO
        ) {

            return "🧑‍🌾";

        }


        if (
            rol ===
            ROLES_USUARIO.TRABAJADOR
        ) {

            return "👷";

        }


        return "👤";

    }


    obtenerIniciales(
        nombre
    ) {

        return String(
            nombre
            ||
            "U"
        )
            .trim()
            .split(/\s+/)
            .slice(
                0,
                2
            )
            .map(
                parte =>
                    parte
                        .charAt(0)
                        .toUpperCase()
            )
            .join("");

    }


    obtenerNombreTrabajador(
        id
    ) {

        const trabajador =
            this.obtenerTrabajadores()
                .find(
                    item =>
                        String(
                            item.id
                        )
                        ===
                        String(
                            id
                        )
                );


        if (
            !trabajador
        ) {

            return "Trabajador vinculado";

        }


        return (
            [
                trabajador.nombre,
                trabajador.apellidos
            ]
                .filter(Boolean)
                .join(" ")
            ||
            `Trabajador ${trabajador.id}`
        );

    }


    obtenerValor(
        id
    ) {

        return String(
            document
                .getElementById(
                    id
                )
                ?.value
            ??
            ""
        )
            .trim();

    }

}