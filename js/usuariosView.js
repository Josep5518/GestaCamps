import {
    ROLES_USUARIO,
    NOMBRES_ROL
} from "./usuario.js";

import {
    escaparHTML
} from "./utils.js";


// =====================================================
// GESTACAMPS
// USUARIOS VIEW
// =====================================================

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


    // =================================================
    // MOSTRAR
    // =================================================

    mostrar() {

        const usuarios =
            this.usuarioService
                .obtenerTodos();


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Usuarios y permisos
                    </h2>

                    <p>
                        Gestiona los usuarios que pueden acceder a GestaCamps
                    </p>

                </div>


                <button
                    id="nuevoUsuario"
                    type="button"
                    class="primary-button"
                >
                    + Nuevo usuario
                </button>

            </header>


            ${this.crearResumen(
                usuarios
            )}


            ${this.crearListado(
                usuarios
            )}

        `;


        this.configurarEventosListado();

    }


    // =================================================
    // RESUMEN
    // =================================================

    crearResumen(
        usuarios
    ) {

        const activos =
            usuarios.filter(
                usuario =>
                    usuario.activo !==
                    false
            )
                .length;


        const administradores =
            usuarios.filter(
                usuario =>
                    usuario.rol ===
                    ROLES_USUARIO.ADMINISTRADOR
            )
                .length;


        const encargados =
            usuarios.filter(
                usuario =>
                    usuario.rol ===
                    ROLES_USUARIO.ENCARGADO
            )
                .length;


        const trabajadores =
            usuarios.filter(
                usuario =>
                    usuario.rol ===
                    ROLES_USUARIO.TRABAJADOR
            )
                .length;


        return `

            <div class="stats">

                <div class="card">

                    <div class="card-icon">
                        👥
                    </div>

                    <div>

                        <p>
                            Usuarios
                        </p>

                        <h3>
                            ${usuarios.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <div class="card-icon">
                        ✅
                    </div>

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

                    <div class="card-icon">
                        🔐
                    </div>

                    <div>

                        <p>
                            Administradores
                        </p>

                        <h3>
                            ${administradores}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <div class="card-icon">
                        👨‍🌾
                    </div>

                    <div>

                        <p>
                            Encargados / trabajadores
                        </p>

                        <h3>
                            ${encargados + trabajadores}
                        </h3>

                    </div>

                </div>

            </div>

        `;

    }


    // =================================================
    // LISTADO
    // =================================================

    crearListado(
        usuarios
    ) {

        if (
            usuarios.length ===
            0
        ) {

            return `

                <section class="empty-state">

                    <div class="empty-icon">
                        👥
                    </div>

                    <h3>
                        No hay usuarios
                    </h3>

                    <p>
                        Crea el primer usuario de GestaCamps.
                    </p>

                </section>

            `;

        }


        const tarjetas =
            usuarios
                .map(
                    usuario =>
                        this.crearTarjetaUsuario(
                            usuario
                        )
                )
                .join("");


        return `

            <div class="trabajadores-grid">

                ${tarjetas}

            </div>

        `;

    }


    // =================================================
    // TARJETA USUARIO
    // =================================================

    crearTarjetaUsuario(
        usuario
    ) {

        const nombreCompleto =
            [
                usuario.nombre,
                usuario.apellidos
            ]
                .filter(
                    Boolean
                )
                .join(" ")
            ||
            usuario.usuario;


        const nombreRol =
            NOMBRES_ROL[
                usuario.rol
            ]
            ||
            "Usuario";


        const estadoClase =
            usuario.activo !==
            false
                ? "completed"
                : "pending";


        const estadoTexto =
            usuario.activo !==
            false
                ? "Activo"
                : "Desactivado";


        const icono =
            this.obtenerIconoRol(
                usuario.rol
            );


        return `

            <article class="trabajador-card">

                <div class="trabajador-card-header">

                    <div class="trabajador-icon">
                        ${icono}
                    </div>


                    <div class="trabajador-actions">

                        <button
                            type="button"
                            class="secondary-button editar-usuario"
                            data-id="${escaparHTML(
                                usuario.id
                            )}"
                        >
                            Editar
                        </button>

                    </div>

                </div>


                <h3>
                    ${escaparHTML(
                        nombreCompleto
                    )}
                </h3>


                <p class="trabajador-puesto">
                    ${escaparHTML(
                        nombreRol
                    )}
                </p>


                <div class="trabajador-info">

                    <div>

                        <span>
                            Usuario
                        </span>

                        <strong>
                            ${escaparHTML(
                                usuario.usuario
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Estado
                        </span>

                        <strong>
                            ${escaparHTML(
                                estadoTexto
                            )}
                        </strong>

                    </div>

                </div>


                <span
                    class="status ${estadoClase}"
                >
                    ${escaparHTML(
                        estadoTexto
                    )}
                </span>


                <div class="trabajo-state-actions">

                    <button
                        type="button"
                        class="task-state-button cambiar-estado-usuario"
                        data-id="${escaparHTML(
                            usuario.id
                        )}"
                        data-activo="${
                            usuario.activo !==
                            false
                                ? "false"
                                : "true"
                        }"
                    >
                        ${
                            usuario.activo !==
                            false
                                ? "Desactivar"
                                : "Activar"
                        }
                    </button>


                    <button
                        type="button"
                        class="delete-button eliminar-usuario"
                        data-id="${escaparHTML(
                            usuario.id
                        )}"
                        aria-label="Eliminar usuario"
                        title="Eliminar usuario"
                    >
                        ×
                    </button>

                </div>

            </article>

        `;

    }


    // =================================================
    // ICONO ROL
    // =================================================

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


    // =================================================
    // EVENTOS LISTADO
    // =================================================

    configurarEventosListado() {

        const nuevo =
            document.getElementById(
                "nuevoUsuario"
            );


        if (
            nuevo
        ) {

            nuevo.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );

        }


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


    // =================================================
    // FORMULARIO
    // =================================================

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

            <button
                type="button"
                id="volverUsuarios"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        ${
                            editando
                                ? "Editar usuario"
                                : "Nuevo usuario"
                        }
                    </h2>

                    <p>
                        Configura el acceso y el rol del usuario
                    </p>

                </div>

            </header>


            <section class="form-panel">

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

                    <select
                        id="usuarioRol"
                    >

                        ${this.crearOpcionesRol(
                            usuario?.rol
                        )}

                    </select>

                </div>


                <div class="form-group">

                    <label for="usuarioTrabajador">
                        Trabajador vinculado
                    </label>

                    <select
                        id="usuarioTrabajador"
                    >

                        <option value="">
                            Sin vincular
                        </option>

                        ${this.crearOpcionesTrabajadores(
                            trabajadores,
                            usuario?.trabajadorId
                        )}

                    </select>

                    <small class="form-help">
                        Es opcional. Permite relacionar el usuario con un trabajador existente.
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


                <div class="form-group">

                    <label>

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

                        Usuario activo

                    </label>

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

        `;


        this.configurarEventosFormulario(
            usuario
        );

    }


    // =================================================
    // OPCIONES ROL
    // =================================================

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


    // =================================================
    // TRABAJADORES
    // =================================================

    obtenerTrabajadores() {

        if (
            !this.trabajadorService
        ) {

            return [];

        }


        if (
            typeof this.trabajadorService
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
            typeof this.trabajadorService
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
                            .filter(
                                Boolean
                            )
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


    // =================================================
    // EVENTOS FORMULARIO
    // =================================================

    configurarEventosFormulario(
        usuario
    ) {

        const volver =
            document.getElementById(
                "volverUsuarios"
            );


        const cancelar =
            document.getElementById(
                "cancelarUsuario"
            );


        const guardar =
            document.getElementById(
                "guardarUsuario"
            );


        if (
            volver
        ) {

            volver.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );

        }


        if (
            cancelar
        ) {

            cancelar.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );

        }


        if (
            guardar
        ) {

            guardar.addEventListener(
                "click",
                () =>
                    this.guardar(
                        usuario
                    )
            );

        }


        const repetirPin =
            document.getElementById(
                "usuarioRepetirPin"
            );


        if (
            repetirPin
        ) {

            repetirPin.addEventListener(
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

    }


    // =================================================
    // GUARDAR
    // =================================================

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

                            nombre:
                                nombre,

                            apellidos:
                                apellidos,

                            usuario:
                                login,

                            rol:
                                rol,

                            activo:
                                activo,

                            trabajadorId:
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

                            nombre:
                                nombre,

                            apellidos:
                                apellidos,

                            usuario:
                                login,

                            rol:
                                rol,

                            activo:
                                activo,

                            trabajadorId:
                                trabajadorId,

                            pin:
                                pin,

                            repetirPin:
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


    // =================================================
    // CAMBIAR ESTADO
    // =================================================

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


    // =================================================
    // ELIMINAR
    // =================================================

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
                .filter(
                    Boolean
                )
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


    // =================================================
    // OBTENER VALOR
    // =================================================

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