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

            <div class="perfil-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                ${this.crearHero(
                    datos,
                    usuarioActual
                )}


                <!-- ==========================================
                     RESUMEN
                =========================================== -->

                ${this.crearResumenPerfil(
                    datos,
                    usuarioActual
                )}


                <!-- ==========================================
                     DATOS EXPLOTACIÓN
                =========================================== -->

                ${
                    puedeEditarPerfil

                        ? this.crearFormularioPerfil(
                            datos,
                            mensaje
                        )

                        : this.crearInformacionSoloLectura()
                }


                <!-- ==========================================
                     SEGURIDAD
                =========================================== -->

                <section class="perfil-section-block">

                    <div class="perfil-section-heading">

                        <div>

                            <span>
                                SEGURIDAD
                            </span>


                            <h2>
                                Acceso y credenciales
                            </h2>


                            <p>
                                Gestiona las credenciales asociadas
                                a tu sesión de GestaCamps.
                            </p>

                        </div>


                        <div class="perfil-section-icon">
                            🔐
                        </div>

                    </div>


                    ${this.seguridadView.render(
                        usuarioActual
                        ||
                        {}
                    )}

                </section>


                <!-- ==========================================
                     BACKUP
                =========================================== -->

                ${
                    esAdministrador

                        ? this.crearSeccionBackup(
                            ultimaCopia
                        )

                        : ""
                }

            </div>

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
    // HERO
    // =====================================================

    crearHero(
        datos,
        usuarioActual
    ) {

        const nombreExplotacion =
            datos.nombre
            ||
            datos.nombreExplotacion
            ||
            "Mi explotación";


        const nombreUsuario =
            this.obtenerNombreUsuarioActual(
                usuarioActual
            );


        const rol =
            this.obtenerNombreRolActual(
                usuarioActual
            );


        return `

            <section class="perfil-premium-hero">

                <div class="perfil-premium-content">

                    <span class="perfil-eyebrow">
                        ⚙️ SISTEMA
                    </span>


                    <h1>
                        Tu explotación,
                        <span>
                            bien configurada.
                        </span>
                    </h1>


                    <p>
                        Centraliza los datos generales,
                        fiscales y de acceso que utiliza
                        GestaCamps en toda la aplicación.
                    </p>


                    <div class="perfil-hero-user">

                        <div class="perfil-hero-avatar">

                            ${escaparHTML(
                                this.obtenerIniciales(
                                    nombreUsuario
                                )
                            )}

                        </div>


                        <div>

                            <small>
                                SESIÓN ACTUAL
                            </small>


                            <strong>
                                ${escaparHTML(
                                    nombreUsuario
                                )}
                            </strong>


                            <span>
                                ${escaparHTML(
                                    rol
                                )}
                            </span>

                        </div>

                    </div>

                </div>


                <div class="perfil-premium-image">

                    <div class="perfil-hero-badge">

                        <span>
                            Explotación
                        </span>


                        <strong>
                            ${escaparHTML(
                                nombreExplotacion
                            )}
                        </strong>

                    </div>


                    <div class="perfil-hero-copy">

                        <small>
                            IDENTIDAD · SEGURIDAD · DATOS
                        </small>


                        <strong>
                            Todo preparado<br>
                            para trabajar
                        </strong>

                    </div>

                </div>

            </section>

        `;

    }


    // =====================================================
    // RESUMEN PERFIL
    // =====================================================

    crearResumenPerfil(
        datos,
        usuarioActual
    ) {

        return `

            <section class="perfil-top-grid">

                <!-- EXPLOTACIÓN -->

                <article class="perfil-card">

                    <div class="perfil-card-header">

                        <span class="perfil-icon">
                            🌾
                        </span>


                        <div>

                            <span class="perfil-card-eyebrow">
                                EXPLOTACIÓN
                            </span>


                            <h3>
                                Datos generales
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

                </article>


                <!-- USUARIO -->

                <article class="perfil-card perfil-user-card">

                    <div class="perfil-card-header">

                        <span class="perfil-icon">
                            👤
                        </span>


                        <div>

                            <span class="perfil-card-eyebrow">
                                USUARIO
                            </span>


                            <h3>
                                Sesión actual
                            </h3>


                            <p>
                                Usuario que está utilizando GestaCamps
                            </p>

                        </div>

                    </div>


                    <div class="perfil-user-box">

                        <span class="perfil-user-avatar">

                            ${escaparHTML(
                                this.obtenerIniciales(
                                    this.obtenerNombreUsuarioActual(
                                        usuarioActual
                                    )
                                )
                            )}

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


                    <div class="perfil-user-note">

                        <span>
                            🔒
                        </span>


                        <p>
                            Los permisos disponibles dependen
                            del rol asignado a este usuario.
                        </p>

                    </div>

                </article>

            </section>

        `;

    }


    // =====================================================
    // SOLO LECTURA
    // =====================================================

    crearInformacionSoloLectura() {

        return `

            <section class="perfil-edit-card">

                <div class="perfil-readonly">

                    <span>
                        ℹ️
                    </span>


                    <div>

                        <h3>
                            Datos en modo consulta
                        </h3>


                        <p>
                            Tu usuario puede consultar
                            la información de la explotación,
                            pero no modificarla.
                        </p>

                    </div>

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

                                <span>
                                    ✓
                                </span>

                                ${escaparHTML(
                                    mensaje
                                )}

                            </div>

                        `

                        : ""
                }


                <div class="perfil-section-heading">

                    <div>

                        <span>
                            CONFIGURACIÓN
                        </span>


                        <h2>
                            Datos de la explotación
                        </h2>


                        <p>
                            Esta información se reutiliza
                            en documentos y módulos de GestaCamps.
                        </p>

                    </div>


                    <div class="perfil-section-icon">
                        ✎
                    </div>

                </div>


                <div class="perfil-form-layout">

                    <div class="perfil-field perfil-full">

                        <label for="perfilNombre">
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

                        <label for="perfilTitular">
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

                        <label for="perfilNif">
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

                        <label for="perfilTelefono">
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

                        <label for="perfilEmail">
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

                        <label for="perfilDireccion">
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

                        <label for="perfilLocalidad">
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

                        <label for="perfilProvincia">
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

                        <label for="perfilCodigoPostal">
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

                        <label for="perfilPais">
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


                    <div class="perfil-divider perfil-full"></div>


                    <div class="perfil-docs perfil-full">

                        <div class="perfil-docs-header">

                            <span>
                                DOCUMENTOS
                            </span>


                            <h3>
                                Identidad en documentos
                            </h3>


                            <p>
                                Configura cómo aparece
                                GestaCamps en documentos generados.
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


                            <span class="perfil-checkbox-ui"></span>


                            <div>

                                <strong>
                                    Mostrar marca GestaCamps
                                </strong>


                                <span>
                                    Añade “Generado con GestaCamps”
                                    al pie de facturas y documentos.
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
    // BACKUP
    // =====================================================

    crearSeccionBackup(
        ultimaCopia
    ) {

        return `

            <section class="perfil-section-block perfil-backup-section">

                <div class="perfil-section-heading">

                    <div>

                        <span>
                            PROTECCIÓN DE DATOS
                        </span>


                        <h2>
                            Copias de seguridad
                        </h2>


                        <p>
                            Descarga o restaura todos los datos
                            almacenados en GestaCamps.
                        </p>

                    </div>


                    <div class="perfil-section-icon">
                        💾
                    </div>

                </div>


                <div class="backup-grid">

                    <!-- DESCARGAR -->

                    <article class="backup-card">

                        <div class="backup-icon">
                            ↓
                        </div>


                        <span class="backup-kicker">
                            EXPORTAR
                        </span>


                        <h3>
                            Descargar copia
                        </h3>


                        <p class="backup-description">
                            Guarda fincas, campañas, cultivos,
                            tratamientos, trabajadores, documentos,
                            producción, historial y datos financieros.
                        </p>


                        <button
                            id="descargarBackup"
                            type="button"
                            class="primary-button backup-action"
                        >
                            Descargar copia
                        </button>


                        <p class="backup-last">

                            Última copia:

                            <strong>

                                ${
                                    ultimaCopia
                                        ? formatearFechaHora(
                                            ultimaCopia
                                        )
                                        : "Nunca"
                                }

                            </strong>

                        </p>

                    </article>


                    <!-- RESTAURAR -->

                    <article class="backup-card">

                        <div class="backup-icon">
                            ↑
                        </div>


                        <span class="backup-kicker">
                            IMPORTAR
                        </span>


                        <h3>
                            Restaurar copia
                        </h3>


                        <p class="backup-description">
                            Recupera una copia anterior
                            de todos los datos de GestaCamps.
                        </p>


                        <label class="backup-file-label">

                            <span>
                                Seleccionar archivo JSON
                            </span>


                            <input
                                id="archivoBackup"
                                type="file"
                                accept=".json,application/json"
                                class="backup-file-input"
                            >

                        </label>


                        <div
                            id="resumenBackup"
                            class="backup-summary"
                        ></div>

                    </article>

                </div>


                <!-- ZONA PELIGRO -->

                <div class="perfil-danger-zone">

                    <div class="perfil-danger-icon">
                        ⚠
                    </div>


                    <div>

                        <h3>
                            Zona de peligro
                        </h3>


                        <p>
                            Elimina todos los datos locales de GestaCamps.
                            Antes de utilizar esta opción,
                            descarga una copia de seguridad.
                        </p>

                    </div>


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

        const guardar =
            document
                .getElementById(
                    "guardarPerfil"
                );


        guardar
            ?.addEventListener(
                "click",
                () =>
                    this.guardarPerfil()
            );

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
            document
                .getElementById(
                    "descargarBackup"
                );


        const archivoInput =
            document
                .getElementById(
                    "archivoBackup"
                );


        const borrar =
            document
                .getElementById(
                    "borrarDatosGestaCamps"
                );


        botonDescargar
            ?.addEventListener(
                "click",
                () =>
                    this.descargarBackup()
            );


        archivoInput
            ?.addEventListener(
                "change",
                event =>
                    this.seleccionarBackup(
                        event
                    )
            );


        borrar
            ?.addEventListener(
                "click",
                () =>
                    this.borrarDatos()
            );

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
            document
                .getElementById(
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


        document
            .getElementById(
                "restaurarBackup"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.restaurarBackup()
            );

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
                    ✓ Copia válida de GestaCamps
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
                        🗓️ ${resumen.campanias} campañas
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
                    class="primary-button backup-restore-button"
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
    // DATOS
    // =====================================================

    obtenerDatos() {

        if (
            this.explotacionService
            &&
            typeof
            this.explotacionService
                .obtener ===
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
            typeof
            this.explotacionService
                .obtenerDatos ===
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
    // USUARIO
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
                .filter(Boolean)
                .join(" ")
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