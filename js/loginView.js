import {
    escaparHTML
} from "./utils.js";


export class LoginView {

    constructor(
        mainContent,
        authService,
        onLogin
    ) {

        this.mainContent =
            mainContent;

        this.authService =
            authService;

        this.onLogin =
            onLogin;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        if (
            this.authService
                .estaConfigurado()
        ) {

            this.mostrarLogin();

        }

        else {

            this.mostrarConfiguracionInicial();

        }

    }


    // =====================================================
    // CONFIGURACIÓN INICIAL
    // =====================================================

    mostrarConfiguracionInicial() {

        const usuario =
            this.authService
                .obtenerUsuarioSugerido();


        this.mainContent.innerHTML =
            this.crearEstructura(
                {

                    configuracionInicial:
                        true,

                    titulo:
                        "GestaCamps",

                    subtitulo:
                        "Configuración de seguridad",

                    contenido: `

                        <div class="auth-info">

                            Crea el acceso de Administración.
                            A partir de ahora necesitarás este
                            usuario y PIN para entrar en GestaCamps.

                        </div>


                        ${this.crearCampo(
                            {

                                id:
                                    "authUsuario",

                                label:
                                    "Usuario *",

                                type:
                                    "text",

                                autocomplete:
                                    "username",

                                value:
                                    usuario

                            }
                        )}


                        ${this.crearCampo(
                            {

                                id:
                                    "authPin",

                                label:
                                    "PIN *",

                                type:
                                    "password",

                                inputmode:
                                    "numeric",

                                autocomplete:
                                    "new-password",

                                maxlength:
                                    "8",

                                placeholder:
                                    "4 - 8 números"

                            }
                        )}


                        ${this.crearCampo(
                            {

                                id:
                                    "authRepetirPin",

                                label:
                                    "Repetir PIN *",

                                type:
                                    "password",

                                inputmode:
                                    "numeric",

                                autocomplete:
                                    "new-password",

                                maxlength:
                                    "8",

                                placeholder:
                                    "Repite el PIN"

                            }
                        )}


                        ${this.crearContenedorError()}


                        <button
                            id="authConfigurar"
                            type="button"
                            class="primary-button"
                        >
                            Crear acceso
                        </button>

                    `

                }
            );


        this.configurarEventoBoton(
            "authConfigurar",
            () =>
                this.configurar()
        );


        this.configurarEnter(
            "authRepetirPin",
            () =>
                this.configurar()
        );

    }


    // =====================================================
    // LOGIN
    // =====================================================

    mostrarLogin() {

        const configuracion =
            this.authService
                .obtenerConfiguracion();


        this.mainContent.innerHTML =
            this.crearEstructura(
                {

                    configuracionInicial:
                        false,

                    titulo:
                        "GestaCamps",

                    subtitulo:
                        "Gestión agrícola",

                    contenido: `

                        ${this.crearCampo(
                            {

                                id:
                                    "authUsuario",

                                label:
                                    "Usuario",

                                type:
                                    "text",

                                autocomplete:
                                    "username",

                                value:
                                    configuracion
                                        ?.usuario
                                    ||
                                    ""

                            }
                        )}


                        ${this.crearCampo(
                            {

                                id:
                                    "authPin",

                                label:
                                    "PIN",

                                type:
                                    "password",

                                inputmode:
                                    "numeric",

                                autocomplete:
                                    "current-password",

                                maxlength:
                                    "8",

                                placeholder:
                                    "Introduce tu PIN"

                            }
                        )}


                        ${this.crearContenedorError()}


                        <button
                            id="authEntrar"
                            type="button"
                            class="primary-button"
                        >
                            Iniciar sesión
                        </button>


                        <button
                            id="authPortalTrabajador"
                            type="button"
                            class="secondary-button"
                        >
                            👤 Acceso trabajador
                        </button>

                    `

                }
            );


        this.configurarEventoBoton(
            "authEntrar",
            () =>
                this.login()
        );


        this.configurarEnter(
            "authPin",
            () =>
                this.login()
        );


        this.configurarEventoBoton(
            "authPortalTrabajador",
            () => {

                window.location.hash =
                    "#trabajadorPortal";

            }
        );

    }


    // =====================================================
    // ESTRUCTURA BASE
    // =====================================================

    crearEstructura(
        opciones
    ) {

        const claseConfiguracion =
            opciones.configuracionInicial
                ? " auth-card-setup"
                : "";


        return `

            <section class="auth-screen">

                <div
                    class="auth-card${claseConfiguracion}"
                >

                    <div class="auth-header">

                        <div class="auth-icon">
                            🌾
                        </div>


                        <h1>
                            ${escaparHTML(
                                opciones.titulo
                            )}
                        </h1>


                        <p>
                            ${escaparHTML(
                                opciones.subtitulo
                            )}
                        </p>

                    </div>


                    ${opciones.contenido}

                </div>

            </section>

        `;

    }


    // =====================================================
    // CREAR CAMPO
    // =====================================================

    crearCampo(
        opciones
    ) {

        const inputmode =
            opciones.inputmode
                ? `inputmode="${escaparHTML(
                    opciones.inputmode
                )}"`
                : "";


        const autocomplete =
            opciones.autocomplete
                ? `autocomplete="${escaparHTML(
                    opciones.autocomplete
                )}"`
                : "";


        const maxlength =
            opciones.maxlength
                ? `maxlength="${escaparHTML(
                    opciones.maxlength
                )}"`
                : "";


        const placeholder =
            opciones.placeholder
                ? `placeholder="${escaparHTML(
                    opciones.placeholder
                )}"`
                : "";


        const value =
            opciones.value !==
            undefined
                ? `value="${escaparHTML(
                    opciones.value
                )}"`
                : "";


        return `

            <div class="form-group">

                <label>
                    ${escaparHTML(
                        opciones.label
                    )}
                </label>


                <input
                    id="${escaparHTML(
                        opciones.id
                    )}"
                    type="${escaparHTML(
                        opciones.type
                        ||
                        "text"
                    )}"
                    ${inputmode}
                    ${autocomplete}
                    ${maxlength}
                    ${placeholder}
                    ${value}
                >

            </div>

        `;

    }


    // =====================================================
    // CONTENEDOR ERROR
    // =====================================================

    crearContenedorError() {

        return `

            <div
                id="authError"
                class="auth-error"
            >
            </div>

        `;

    }


    // =====================================================
    // CONFIGURAR
    // =====================================================

    async configurar() {

        const usuario =
            this.obtenerValor(
                "authUsuario"
            );


        const pin =
            this.obtenerValor(
                "authPin"
            );


        const repetirPin =
            this.obtenerValor(
                "authRepetirPin"
            );


        await this.ejecutarAccion(
            {

                botonId:
                    "authConfigurar",

                accion:
                    () =>
                        this.authService
                            .configurarAcceso(
                                usuario,
                                pin,
                                repetirPin
                            )

            }
        );

    }


    // =====================================================
    // LOGIN
    // =====================================================

    async login() {

        const usuario =
            this.obtenerValor(
                "authUsuario"
            );


        const pin =
            this.obtenerValor(
                "authPin"
            );


        await this.ejecutarAccion(
            {

                botonId:
                    "authEntrar",

                accion:
                    () =>
                        this.authService
                            .iniciarSesion(
                                usuario,
                                pin
                            )

            }
        );

    }


    // =====================================================
    // EJECUTAR ACCIÓN AUTH
    // =====================================================

    async ejecutarAccion(
        opciones
    ) {

        this.ocultarError();


        this.bloquearBoton(
            opciones.botonId,
            true
        );


        try {

            const resultado =
                await opciones
                    .accion();


            if (
                !resultado
                ||
                !resultado.ok
            ) {

                this.mostrarError(
                    resultado
                        ?.mensaje
                    ||
                    "No se ha podido completar la operación."
                );


                return;

            }


            this.onLogin();

        }

        catch (
            error
        ) {

            console.error(
                error
            );


            this.mostrarError(
                "Se ha producido un error inesperado."
            );

        }

        finally {

            this.bloquearBoton(
                opciones.botonId,
                false
            );

        }

    }


    // =====================================================
    // OBTENER VALOR
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
            ??
            ""
        );

    }


    // =====================================================
    // EVENTO BOTÓN
    // =====================================================

    configurarEventoBoton(
        id,
        callback
    ) {

        const boton =
            document
                .getElementById(
                    id
                );


        if (
            !boton
        ) {

            return;

        }


        boton.addEventListener(
            "click",
            callback
        );

    }


    // =====================================================
    // EVENTO ENTER
    // =====================================================

    configurarEnter(
        id,
        callback
    ) {

        const elemento =
            document
                .getElementById(
                    id
                );


        if (
            !elemento
        ) {

            return;

        }


        elemento.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    callback();

                }

            }
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    mostrarError(
        mensaje
    ) {

        const contenedor =
            document
                .getElementById(
                    "authError"
                );


        if (
            !contenedor
        ) {

            return;

        }


        contenedor.textContent =
            mensaje;


        contenedor.classList.add(
            "is-visible"
        );

    }


    ocultarError() {

        const contenedor =
            document
                .getElementById(
                    "authError"
                );


        if (
            !contenedor
        ) {

            return;

        }


        contenedor.textContent =
            "";


        contenedor.classList.remove(
            "is-visible"
        );

    }


    // =====================================================
    // BLOQUEAR BOTÓN
    // =====================================================

    bloquearBoton(
        id,
        bloqueado
    ) {

        const boton =
            document
                .getElementById(
                    id
                );


        if (
            boton
        ) {

            boton.disabled =
                bloqueado;

        }

    }

}