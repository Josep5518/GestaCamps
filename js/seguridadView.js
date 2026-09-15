import {
    escaparHTML,
    formatearFechaHora
} from "./utils.js";


export class SeguridadView {

    constructor(
        authService,
        onActualizado = null
    ) {

        this.authService =
            authService;

        this.onActualizado =
            onActualizado;

    }


    // =====================================================
    // RENDER
    // =====================================================

    render(
        datosPerfil = {}
    ) {

        const acceso =
            this.authService
                .obtenerConfiguracion();


        const usuario =
            acceso?.usuario
            ||
            datosPerfil.nombreUsuario
            ||
            "Josep";


        const fechaModificacion =
            acceso?.fechaModificacion
            ||
            acceso?.fechaCreacion
            ||
            null;


        return `

            <section
                class="
                    perfil-edit-card
                    perfil-section-spaced
                "
            >

                <div class="perfil-edit-header">

                    <h3>
                        🔐 Seguridad y acceso
                    </h3>

                    <p>
                        Gestiona el acceso de Administración
                    </p>

                </div>


                <div class="seguridad-grid">

                    <div
                        class="
                            seguridad-card
                            seguridad-card-resumen
                        "
                    >

                        <div class="seguridad-icon">
                            👤
                        </div>


                        <h3>
                            Acceso actual
                        </h3>


                        <p class="seguridad-user">

                            Usuario:

                            <strong>
                                ${escaparHTML(
                                    usuario
                                )}
                            </strong>

                        </p>


                        <p class="seguridad-meta">

                            Última modificación:

                            ${
                                fechaModificacion
                                    ? formatearFechaHora(
                                        fechaModificacion
                                    )
                                    : "—"
                            }

                        </p>

                    </div>


                    <div class="seguridad-card">

                        <h3>
                            Cambiar credenciales
                        </h3>


                        <p class="seguridad-description">

                            Debes introducir el PIN actual
                            para guardar cualquier cambio.

                        </p>


                        <div class="perfil-field">

                            <label>
                                Usuario *
                            </label>

                            <input
                                id="seguridadUsuario"
                                type="text"
                                autocomplete="username"
                                value="${escaparHTML(
                                    usuario
                                )}"
                            >

                        </div>


                        <div class="perfil-field">

                            <label>
                                PIN actual *
                            </label>

                            <input
                                id="seguridadPinActual"
                                type="password"
                                inputmode="numeric"
                                autocomplete="current-password"
                                maxlength="8"
                                placeholder="Introduce tu PIN actual"
                            >

                        </div>


                        <div class="perfil-field">

                            <label>
                                Nuevo PIN
                            </label>

                            <input
                                id="seguridadPinNuevo"
                                type="password"
                                inputmode="numeric"
                                autocomplete="new-password"
                                maxlength="8"
                                placeholder="Déjalo vacío para mantenerlo"
                            >

                        </div>


                        <div class="perfil-field">

                            <label>
                                Repetir nuevo PIN
                            </label>

                            <input
                                id="seguridadPinRepetir"
                                type="password"
                                inputmode="numeric"
                                autocomplete="new-password"
                                maxlength="8"
                                placeholder="Repite el nuevo PIN"
                            >

                        </div>


                        <div
                            id="seguridadMensaje"
                            class="seguridad-mensaje"
                        >
                        </div>


                        <button
                            id="guardarSeguridad"
                            type="button"
                            class="
                                primary-button
                                seguridad-save-button
                            "
                        >
                            Guardar credenciales
                        </button>

                    </div>

                </div>

            </section>

        `;

    }


    // =====================================================
    // MONTAR EVENTOS
    // =====================================================

    montar() {

        const boton =
            document.getElementById(
                "guardarSeguridad"
            );


        if (
            boton
        ) {

            boton.addEventListener(
                "click",
                () =>
                    this.guardar()
            );

        }


        const repetir =
            document.getElementById(
                "seguridadPinRepetir"
            );


        if (
            repetir
        ) {

            repetir.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        this.guardar();

                    }

                }
            );

        }

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    async guardar() {

        const boton =
            document.getElementById(
                "guardarSeguridad"
            );


        this.ocultarMensaje();


        if (
            boton
        ) {

            boton.disabled =
                true;

        }


        try {

            const resultado =
                await this.authService
                    .cambiarCredenciales(

                        this.obtenerValor(
                            "seguridadUsuario"
                        ),

                        this.obtenerValor(
                            "seguridadPinActual"
                        ),

                        this.obtenerValor(
                            "seguridadPinNuevo"
                        ),

                        this.obtenerValor(
                            "seguridadPinRepetir"
                        )

                    );


            if (
                !resultado
                ||
                !resultado.ok
            ) {

                this.mostrarMensaje(
                    resultado?.mensaje
                    ||
                    "No se han podido actualizar las credenciales.",
                    false
                );


                return;

            }


            if (
                typeof this.onActualizado ===
                "function"
            ) {

                this.onActualizado(
                    resultado
                );


                return;

            }


            this.mostrarMensaje(
                "Credenciales de Administración actualizadas correctamente.",
                true
            );

        }

        catch (
            error
        ) {

            console.error(
                error
            );


            this.mostrarMensaje(
                "No se han podido actualizar las credenciales.",
                false
            );

        }

        finally {

            if (
                boton
            ) {

                boton.disabled =
                    false;

            }

        }

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
            ??
            ""
        );

    }


    // =====================================================
    // MENSAJE
    // =====================================================

    mostrarMensaje(
        mensaje,
        correcto
    ) {

        const contenedor =
            document.getElementById(
                "seguridadMensaje"
            );


        if (
            !contenedor
        ) {

            return;

        }


        contenedor.textContent =
            mensaje;


        contenedor.classList.remove(
            "is-success",
            "is-error"
        );


        contenedor.classList.add(
            "is-visible",
            correcto
                ? "is-success"
                : "is-error"
        );

    }


    ocultarMensaje() {

        const contenedor =
            document.getElementById(
                "seguridadMensaje"
            );


        if (
            !contenedor
        ) {

            return;

        }


        contenedor.textContent =
            "";


        contenedor.classList.remove(
            "is-visible",
            "is-success",
            "is-error"
        );

    }

}