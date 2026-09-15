import { BackupService } from "./backup.js";
import { AuthService } from "./auth.js";
import { SeguridadView } from "./seguridadView.js";
import { NOMBRES_ROL } from "./usuario.js";

import {
    escaparHTML,
    formatearFechaHora
} from "./utils.js";


export class PerfilView {

    constructor(
        mainContent,
        explotacionService
    ) {

        this.mainContent =
            mainContent;

        this.explotacionService =
            explotacionService;

        this.backupService =
            new BackupService();

        this.authService =
            new AuthService();

        this.seguridadView =
            new SeguridadView(
                this.authService,
                () =>
                    this.mostrar(
                        "Credenciales actualizadas correctamente."
                    )
            );

        this.copiaPendiente =
            null;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar(
        mensaje = ""
    ) {

        const datos =
            this.obtenerDatos();


        const usuarioActual =
            this.authService
                .obtenerUsuarioActual();


        const puedeEditarPerfil =
            this.authService
                .tienePermiso(
                    "perfil",
                    "editar"
                );


        const esAdministrador =
            this.authService
                .esAdministrador();


        const ultimaCopia =
            esAdministrador
                ? this.backupService
                    .obtenerUltimaCopia()
                : null;


        this.mainContent.innerHTML = `

            <button
                type="button"
                id="volverPerfil"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        Perfil y explotación
                    </h2>

                    <p>
                        Gestiona los datos generales de tu explotación
                    </p>

                </div>

            </header>


            ${this.crearResumenPerfil(
                datos,
                usuarioActual
            )}


            ${
                puedeEditarPerfil
                    ? this.crearFormularioPerfil(
                        datos,
                        mensaje
                    )
                    : this.crearInformacionSoloLectura()
            }


            ${this.seguridadView.render(
                usuarioActual
                ||
                {}
            )}


            ${
                esAdministrador
                    ? this.crearSeccionBackup(
                        ultimaCopia
                    )
                    : ""
            }

        `;


        this.configurarEventosPerfil();


        this.seguridadView
            .montar();


        if (
            esAdministrador
        ) {

            this.configurarEventosBackup();

        }

    }


    // =====================================================
    // RESUMEN PERFIL
    // =====================================================

    crearResumenPerfil(
        datos,
        usuarioActual
    ) {

        return `

            <div class="perfil-top-grid">

                <section class="perfil-card">

                    <div class="perfil-card-header">

                        <span class="perfil-icon">
                            🌾
                        </span>


                        <div>

                            <h3>
                                Datos de la explotación
                            </h3>

                            <p>
                                Información general y fiscal
                            </p>

                        </div>

                    </div>


                    <div class="perfil-summary-grid">

                        ${this.crearDato(
                            "Explotación",
                            datos.nombre
                            ||
                            datos.nombreExplotacion
                            ||
                            "—"
                        )}


                        ${this.crearDato(
                            "Titular",
                            datos.titular
                            ||
                            datos.razonSocial
                            ||
                            "—"
                        )}


                        ${this.crearDato(
                            "NIF / CIF",
                            datos.nifCif
                            ||
                            datos.nif
                            ||
                            "—"
                        )}


                        ${this.crearDato(
                            "Teléfono",
                            datos.telefono
                            ||
                            "—"
                        )}


                        ${this.crearDato(
                            "Email",
                            datos.email
                            ||
                            "—"
                        )}


                        ${this.crearDato(
                            "Localidad",
                            datos.localidad
                            ||
                            "—"
                        )}

                    </div>

                </section>


                <section class="perfil-card">

                    <div class="perfil-card-header">

                        <span class="perfil-icon">
                            👤
                        </span>


                        <div>

                            <h3>
                                Usuario
                            </h3>

                            <p>
                                Datos del usuario actual
                            </p>

                        </div>

                    </div>


                    <div class="perfil-user-box">

                        <span class="perfil-icon">
                            👤
                        </span>


                        <div>

                            <strong>
                                ${escaparHTML(
                                    this.obtenerNombreUsuarioActual(
                                        usuarioActual
                                    )
                                )}
                            </strong>


                            <span>
                                ${escaparHTML(
                                    this.obtenerNombreRolActual(
                                        usuarioActual
                                    )
                                )}
                            </span>

                        </div>

                    </div>

                </section>

            </div>

        `;

    }


    // =====================================================
    // INFORMACIÓN SOLO LECTURA
    // =====================================================

    crearInformacionSoloLectura() {

        return `

            <section
                class="
                    perfil-edit-card
                    perfil-section-spaced
                "
            >

                <div class="perfil-edit-header">

                    <h3>
                        ℹ️ Datos de la explotación
                    </h3>

                    <p>
                        Tu usuario puede consultar estos datos,
                        pero no modificarlos.
                    </p>

                </div>

            </section>

        `;

    }


    // =====================================================
    // FORMULARIO PERFIL
    // =====================================================

    crearFormularioPerfil(
        datos,
        mensaje
    ) {

        return `

            <section class="perfil-edit-card">

                ${
                    mensaje
                        ? `

                            <div class="perfil-success">

                                ✓ ${escaparHTML(
                                    mensaje
                                )}

                            </div>

                        `
                        : ""
                }


                <div class="perfil-edit-header">

                    <h3>
                        Editar datos
                    </h3>

                    <p>
                        Estos datos se reutilizarán en otros módulos
                    </p>

                </div>


                <div class="perfil-form-layout">

                    <div class="perfil-field perfil-full">

                        <label>
                            Nombre de la explotación *
                        </label>

                        <input
                            id="perfilNombre"
                            type="text"
                            value="${escaparHTML(
                                datos.nombre
                                ||
                                datos.nombreExplotacion
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field perfil-full">

                        <label>
                            Titular / Razón social
                        </label>

                        <input
                            id="perfilTitular"
                            type="text"
                            value="${escaparHTML(
                                datos.titular
                                ||
                                datos.razonSocial
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field">

                        <label>
                            NIF / CIF
                        </label>

                        <input
                            id="perfilNif"
                            type="text"
                            value="${escaparHTML(
                                datos.nifCif
                                ||
                                datos.nif
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field">

                        <label>
                            Teléfono
                        </label>

                        <input
                            id="perfilTelefono"
                            type="text"
                            value="${escaparHTML(
                                datos.telefono
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field perfil-full">

                        <label>
                            Email
                        </label>

                        <input
                            id="perfilEmail"
                            type="email"
                            value="${escaparHTML(
                                datos.email
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field perfil-full">

                        <label>
                            Dirección
                        </label>

                        <input
                            id="perfilDireccion"
                            type="text"
                            value="${escaparHTML(
                                datos.direccion
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field">

                        <label>
                            Localidad
                        </label>

                        <input
                            id="perfilLocalidad"
                            type="text"
                            value="${escaparHTML(
                                datos.localidad
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field">

                        <label>
                            Provincia
                        </label>

                        <input
                            id="perfilProvincia"
                            type="text"
                            value="${escaparHTML(
                                datos.provincia
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field">

                        <label>
                            Código postal
                        </label>

                        <input
                            id="perfilCodigoPostal"
                            type="text"
                            value="${escaparHTML(
                                datos.codigoPostal
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="perfil-field">

                        <label>
                            País
                        </label>

                        <input
                            id="perfilPais"
                            type="text"
                            value="${escaparHTML(
                                datos.pais
                                ||
                                "España"
                            )}"
                        >

                    </div>


                    <div class="perfil-divider perfil-full">
                    </div>


                    <div class="perfil-docs perfil-full">

                        <div class="perfil-docs-header">

                            <h3>
                                Documentos
                            </h3>

                            <p>
                                Personaliza cómo aparecen tus facturas y documentos
                            </p>

                        </div>


                        <label class="perfil-doc-option">

                            <input
                                id="perfilMarcaGestaCamps"
                                type="checkbox"
                                ${
                                    datos.mostrarMarcaGestaCamps
                                        ? "checked"
                                        : ""
                                }
                            >


                            <div>

                                <strong>
                                    Mostrar marca GestaCamps
                                </strong>


                                <span>
                                    Añade “Generado con GestaCamps” al pie de facturas y documentos.
                                </span>

                            </div>

                        </label>

                    </div>


                    <div class="perfil-actions perfil-full">

                        <button
                            id="guardarPerfil"
                            type="button"
                            class="primary-button"
                        >
                            Guardar datos
                        </button>

                    </div>

                </div>

            </section>

        `;

    }


    // =====================================================
    // SECCIÓN BACKUP
    // =====================================================

    crearSeccionBackup(
        ultimaCopia
    ) {

        return `

            <section
                class="
                    perfil-edit-card
                    perfil-section-spaced
                "
            >

                <div class="perfil-edit-header">

                    <h3>
                        💾 Copias de seguridad
                    </h3>

                    <p>
                        Protege todos los datos almacenados en GestaCamps
                    </p>

                </div>


                <div class="backup-grid">

                    <div class="backup-card">

                        <div class="backup-icon">
                            📥
                        </div>


                        <h3>
                            Descargar copia
                        </h3>


                        <p class="backup-description">

                            Guarda fincas, Campanyas, cultivos,
                            tratamientos, trabajadores, facturas,
                            historial y el resto de datos.

                        </p>


                        <button
                            id="descargarBackup"
                            type="button"
                            class="
                                primary-button
                                backup-action
                            "
                        >
                            Descargar copia
                        </button>


                        <p class="backup-last">

                            Última copia:

                            ${
                                ultimaCopia
                                    ? formatearFechaHora(
                                        ultimaCopia
                                    )
                                    : "Nunca"
                            }

                        </p>

                    </div>


                    <div class="backup-card">

                        <div class="backup-icon">
                            📤
                        </div>


                        <h3>
                            Restaurar copia
                        </h3>


                        <p class="backup-description">

                            Recupera los datos desde una copia anterior
                            de GestaCamps.

                        </p>


                        <input
                            id="archivoBackup"
                            type="file"
                            accept=".json,application/json"
                            class="backup-file-input"
                        >


                        <div
                            id="resumenBackup"
                            class="backup-summary"
                        >
                        </div>

                    </div>

                </div>


                <div class="perfil-danger-zone">

                    <h3>
                        ⚠️ Zona de peligro
                    </h3>


                    <p>

                        Esta opción borra todos los datos locales
                        de GestaCamps.

                        Antes de hacerlo es recomendable descargar
                        una copia.

                    </p>


                    <button
                        id="borrarDatosGestaCamps"
                        type="button"
                        class="secondary-button"
                    >
                        Borrar todos los datos
                    </button>

                </div>

            </section>

        `;

    }


    // =====================================================
    // EVENTOS PERFIL
    // =====================================================

    configurarEventosPerfil() {

        const volver =
            document.getElementById(
                "volverPerfil"
            );


        if (
            volver
        ) {

            volver.addEventListener(
                "click",
                () =>
                    this.volver()
            );

        }


        const guardar =
            document.getElementById(
                "guardarPerfil"
            );


        if (
            guardar
        ) {

            guardar.addEventListener(
                "click",
                () =>
                    this.guardarPerfil()
            );

        }

    }


    // =====================================================
    // VOLVER
    // =====================================================

    volver() {

        if (
            window.history.length >
            1
        ) {

            history.back();


            return;

        }


        window.location.hash =
            "#inicio";

    }


    // =====================================================
    // GUARDAR PERFIL
    // =====================================================

    guardarPerfil() {

        if (
            !this.authService
                .tienePermiso(
                    "perfil",
                    "editar"
                )
        ) {

            alert(
                "No tienes permiso para modificar los datos de la explotación."
            );


            return;

        }


        const datosActuales =
            this.obtenerDatos();


        const resultado =
            this.explotacionService
                .actualizar(
                    {

                        nombre:
                            this.obtenerValor(
                                "perfilNombre"
                            ),

                        titular:
                            this.obtenerValor(
                                "perfilTitular"
                            ),

                        nifCif:
                            this.obtenerValor(
                                "perfilNif"
                            ),

                        telefono:
                            this.obtenerValor(
                                "perfilTelefono"
                            ),

                        email:
                            this.obtenerValor(
                                "perfilEmail"
                            ),

                        direccion:
                            this.obtenerValor(
                                "perfilDireccion"
                            ),

                        localidad:
                            this.obtenerValor(
                                "perfilLocalidad"
                            ),

                        provincia:
                            this.obtenerValor(
                                "perfilProvincia"
                            ),

                        codigoPostal:
                            this.obtenerValor(
                                "perfilCodigoPostal"
                            ),

                        pais:
                            this.obtenerValor(
                                "perfilPais"
                            ),

                        nombreUsuario:
                            datosActuales.nombreUsuario
                            ??
                            "",

                        cargo:
                            datosActuales.cargo
                            ??
                            datosActuales.cargoUsuario
                            ??
                            "",

                        cargoUsuario:
                            datosActuales.cargoUsuario
                            ??
                            datosActuales.cargo
                            ??
                            "",

                        mostrarMarcaGestaCamps:
                            Boolean(
                                document
                                    .getElementById(
                                        "perfilMarcaGestaCamps"
                                    )
                                    ?.checked
                            )

                    }
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


        this.mostrar(
            "Datos guardados correctamente."
        );

    }


    // =====================================================
    // EVENTOS BACKUP
    // =====================================================

    configurarEventosBackup() {

        if (
            !this.authService
                .esAdministrador()
        ) {

            return;

        }


        const botonDescargar =
            document.getElementById(
                "descargarBackup"
            );


        const archivoInput =
            document.getElementById(
                "archivoBackup"
            );


        const borrar =
            document.getElementById(
                "borrarDatosGestaCamps"
            );


        if (
            botonDescargar
        ) {

            botonDescargar.addEventListener(
                "click",
                () =>
                    this.descargarBackup()
            );

        }


        if (
            archivoInput
        ) {

            archivoInput.addEventListener(
                "change",
                event =>
                    this.seleccionarBackup(
                        event
                    )
            );

        }


        if (
            borrar
        ) {

            borrar.addEventListener(
                "click",
                () =>
                    this.borrarDatos()
            );

        }

    }


    // =====================================================
    // DESCARGAR BACKUP
    // =====================================================

    descargarBackup() {

        if (
            !this.authService
                .esAdministrador()
        ) {

            alert(
                "Solo un Administrador puede descargar copias de seguridad."
            );


            return;

        }


        const resultado =
            this.backupService
                .descargarCopia();


        if (
            !resultado
            ||
            !resultado.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido crear la copia."
            );


            return;

        }


        this.mostrar(
            "Copia de seguridad creada correctamente."
        );

    }


    // =====================================================
    // SELECCIONAR BACKUP
    // =====================================================

    async seleccionarBackup(
        event
    ) {

        if (
            !this.authService
                .esAdministrador()
        ) {

            return;

        }


        const archivo =
            event.target
                .files?.[0];


        const resumen =
            document.getElementById(
                "resumenBackup"
            );


        if (
            !archivo
            ||
            !resumen
        ) {

            return;

        }


        const resultado =
            await this.backupService
                .leerArchivo(
                    archivo
                );


        if (
            !resultado
            ||
            !resultado.ok
        ) {

            this.copiaPendiente =
                null;


            resumen.innerHTML = `

                <div class="backup-error">

                    ${escaparHTML(
                        resultado?.mensaje
                        ||
                        "La copia no es válida."
                    )}

                </div>

            `;


            return;

        }


        this.copiaPendiente =
            resultado.copia;


        resumen.innerHTML =
            this.crearResumenBackup(
                resultado.resumen
            );


        const restaurar =
            document.getElementById(
                "restaurarBackup"
            );


        if (
            restaurar
        ) {

            restaurar.addEventListener(
                "click",
                () =>
                    this.restaurarBackup()
            );

        }

    }


    // =====================================================
    // RESUMEN BACKUP
    // =====================================================

    crearResumenBackup(
        resumen
    ) {

        return `

            <div class="backup-preview">

                <strong>
                    Copia válida de GestaCamps
                </strong>


                <p>

                    <strong>
                        Explotación:
                    </strong>

                    ${escaparHTML(
                        resumen.explotacion
                    )}

                </p>


                <p>

                    <strong>
                        Fecha:
                    </strong>

                    ${formatearFechaHora(
                        resumen.fecha
                    )}

                </p>


                <div class="backup-preview-grid">

                    <span>
                        🌾 ${resumen.fincas} fincas
                    </span>

                    <span>
                        🗓️ ${resumen.campanias} Campanyas
                    </span>

                    <span>
                        🌱 ${resumen.cultivos} cultivos
                    </span>

                    <span>
                        📖 ${resumen.cuaderno} cuaderno
                    </span>

                    <span>
                        🧪 ${resumen.tratamientos} tratamientos
                    </span>

                    <span>
                        👨‍🌾 ${resumen.trabajos} trabajos
                    </span>

                    <span>
                        👷 ${resumen.trabajadores} trabajadores
                    </span>

                    <span>
                        ⏱️ ${resumen.fichajes} fichajes
                    </span>

                    <span>
                        ⚠️ ${resumen.incidencias} incidencias
                    </span>

                    <span>
                        🚜 ${resumen.maquinaria} maquinaria
                    </span>

                    <span>
                        📦 ${resumen.inventario} inventario
                    </span>

                    <span>
                        🍎 ${resumen.produccion} producción
                    </span>

                    <span>
                        👥 ${resumen.contactos} contactos
                    </span>

                    <span>
                        🧾 ${resumen.albaranes} albaranes
                    </span>

                    <span>
                        💶 ${resumen.facturas} facturas
                    </span>

                    <span>
                        💳 ${resumen.movimientos} cobros/pagos
                    </span>

                    <span>
                        💰 ${resumen.gastos} gastos
                    </span>

                    <span>
                        🕒 ${resumen.historial} historial
                    </span>

                </div>


                <button
                    id="restaurarBackup"
                    type="button"
                    class="
                        primary-button
                        backup-restore-button
                    "
                >
                    Restaurar esta copia
                </button>

            </div>

        `;

    }


    // =====================================================
    // RESTAURAR
    // =====================================================

    restaurarBackup() {

        if (
            !this.authService
                .esAdministrador()
        ) {

            alert(
                "Solo un Administrador puede restaurar copias de seguridad."
            );


            return;

        }


        if (
            !this.copiaPendiente
        ) {

            return;

        }


        const confirmar =
            window.confirm(
                "La restauración sustituirá los datos actuales de GestaCamps por los contenidos en esta copia.\n\n¿Quieres continuar?"
            );


        if (
            !confirmar
        ) {

            return;

        }


        const segundoConfirmar =
            window.confirm(
                "Esta acción reemplazará los datos actuales.\n\n¿Confirmas definitivamente la restauración?"
            );


        if (
            !segundoConfirmar
        ) {

            return;

        }


        const resultado =
            this.backupService
                .restaurarCopia(
                    this.copiaPendiente
                );


        if (
            !resultado
            ||
            !resultado.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido restaurar la copia."
            );


            return;

        }


        alert(
            "Copia restaurada correctamente. GestaCamps se recargará ahora."
        );


        window.location.hash =
            "#inicio";


        window.location.reload();

    }


    // =====================================================
    // BORRAR DATOS
    // =====================================================

    borrarDatos() {

        if (
            !this.authService
                .esAdministrador()
        ) {

            alert(
                "Solo un Administrador puede borrar todos los datos de GestaCamps."
            );


            return;

        }


        const primera =
            window.confirm(
                "¿Quieres borrar TODOS los datos de GestaCamps?\n\nEsta acción no se puede deshacer sin una copia de seguridad."
            );


        if (
            !primera
        ) {

            return;

        }


        const texto =
            window.prompt(
                "Para confirmar escribe exactamente:\n\nBORRAR"
            );


        if (
            texto !==
            "BORRAR"
        ) {

            alert(
                "Operación cancelada. No se ha borrado ningún dato."
            );


            return;

        }


        const resultado =
            this.backupService
                .borrarTodosLosDatos();


        if (
            !resultado
            ||
            !resultado.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se han podido borrar los datos."
            );


            return;

        }


        alert(
            "Todos los datos de GestaCamps han sido borrados."
        );


        window.location.hash =
            "#inicio";


        window.location.reload();

    }


    // =====================================================
    // OBTENER DATOS
    // =====================================================

    obtenerDatos() {

        if (
            this.explotacionService
            &&
            typeof this.explotacionService.obtener ===
            "function"
        ) {

            return (
                this.explotacionService
                    .obtener()
                ||
                {}
            );

        }


        if (
            this.explotacionService
            &&
            typeof this.explotacionService.obtenerDatos ===
            "function"
        ) {

            return (
                this.explotacionService
                    .obtenerDatos()
                ||
                {}
            );

        }


        return {};

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
            ??
            ""
        );

    }


    // =====================================================
    // USUARIO ACTUAL
    // =====================================================

    obtenerNombreUsuarioActual(
        usuario
    ) {

        if (
            !usuario
        ) {

            return "—";

        }


        return (
            [
                usuario.nombre,
                usuario.apellidos
            ]
                .filter(
                    Boolean
                )
                .join(
                    " "
                )
            ||
            usuario.usuario
            ||
            "—"
        );

    }


    obtenerNombreRolActual(
        usuario
    ) {

        if (
            !usuario
        ) {

            return "—";

        }


        return (
            NOMBRES_ROL[
                usuario.rol
            ]
            ||
            usuario.rol
            ||
            "Usuario"
        );

    }


    // =====================================================
    // CREAR DATO
    // =====================================================

    crearDato(
        titulo,
        valor
    ) {

        return `

            <div class="perfil-summary-item">

                <span>
                    ${escaparHTML(
                        titulo
                    )}
                </span>

                <strong>
                    ${escaparHTML(
                        valor
                    )}
                </strong>

            </div>

        `;

    }

}