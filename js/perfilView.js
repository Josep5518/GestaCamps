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

        this.copiaPendiente =
            null;


        this.seguridadView =
            new SeguridadView(
                this.authService,
                () =>
                    this.mostrar(
                        "Credenciales actualizadas correctamente."
                    )
            );

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

            <header class="topbar perfil-topbar">

                <div>

                    <button
                        type="button"
                        id="volverPerfil"
                        class="back-button"
                    >
                        ← Volver
                    </button>


                    <h2>
                        Perfil y explotación
                    </h2>

                    <p>
                        Datos de la explotación, seguridad y configuración
                    </p>

                </div>

            </header>


            ${this.crearCabeceraPerfil(
                datos,
                usuarioActual
            )}


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


            <section class="perfil-section-block">

                <div class="perfil-section-title">

                    <div>

                        <span class="perfil-section-icon">
                            🔐
                        </span>

                        <div>

                            <h3>
                                Seguridad
                            </h3>

                            <p>
                                Credenciales y acceso a GestaCamps
                            </p>

                        </div>

                    </div>

                </div>


                ${this.seguridadView.render(
                    usuarioActual
                    ||
                    {}
                )}

            </section>


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
    // CABECERA PERFIL
    // =====================================================

    crearCabeceraPerfil(
        datos,
        usuarioActual
    ) {

        const nombreUsuario =
            this.obtenerNombreUsuarioActual(
                usuarioActual
            );


        const rol =
            this.obtenerNombreRolActual(
                usuarioActual
            );


        const explotacion =
            datos.nombre
            ||
            datos.nombreExplotacion
            ||
            "GestaCamps";


        const iniciales =
            this.obtenerInicialesUsuario(
                usuarioActual
            );


        return `

            <section class="perfil-hero">

                <div class="perfil-hero-avatar">

                    ${escaparHTML(
                        iniciales
                    )}

                </div>


                <div class="perfil-hero-main">

                    <span class="perfil-hero-label">
                        Usuario
                    </span>


                    <h2>

                        ${escaparHTML(
                            nombreUsuario
                        )}

                    </h2>


                    <p>

                        ${escaparHTML(
                            rol
                        )}

                    </p>

                </div>


                <div class="perfil-hero-explotacion">

                    <span>
                        Explotación
                    </span>

                    <strong>

                        ${escaparHTML(
                            explotacion
                        )}

                    </strong>

                </div>

            </section>

        `;

    }


    // =====================================================
    // RESUMEN
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


                <section class="perfil-card perfil-user-card">

                    <div class="perfil-card-header">

                        <span class="perfil-icon">
                            👤
                        </span>


                        <div>

                            <h3>
                                Cuenta actual
                            </h3>

                            <p>
                                Sesión iniciada en GestaCamps
                            </p>

                        </div>

                    </div>


                    <div class="perfil-user-box">

                        <div class="perfil-user-avatar">

                            ${escaparHTML(
                                this.obtenerInicialesUsuario(
                                    usuarioActual
                                )
                            )}

                        </div>


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
    // SOLO LECTURA
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

                                ✓

                                ${escaparHTML(
                                    mensaje
                                )}

                            </div>

                        `

                        : ""
                }


                <div class="perfil-edit-header">

                    <h3>
                        Datos de la explotación
                    </h3>

                    <p>
                        Esta información se reutiliza en facturas y documentos
                    </p>

                </div>


                <div class="perfil-form-layout">

                    ${this.crearCampoPerfil({
                        id:
                            "perfilNombre",

                        etiqueta:
                            "Nombre de la explotación *",

                        valor:
                            datos.nombre
                            ||
                            datos.nombreExplotacion
                            ||
                            "",

                        completo:
                            true
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilTitular",

                        etiqueta:
                            "Titular / Razón social",

                        valor:
                            datos.titular
                            ||
                            datos.razonSocial
                            ||
                            "",

                        completo:
                            true
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilNif",

                        etiqueta:
                            "NIF / CIF",

                        valor:
                            datos.nifCif
                            ||
                            datos.nif
                            ||
                            ""
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilTelefono",

                        etiqueta:
                            "Teléfono",

                        tipo:
                            "tel",

                        valor:
                            datos.telefono
                            ||
                            ""
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilEmail",

                        etiqueta:
                            "Email",

                        tipo:
                            "email",

                        valor:
                            datos.email
                            ||
                            "",

                        completo:
                            true
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilDireccion",

                        etiqueta:
                            "Dirección",

                        valor:
                            datos.direccion
                            ||
                            "",

                        completo:
                            true
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilLocalidad",

                        etiqueta:
                            "Localidad",

                        valor:
                            datos.localidad
                            ||
                            ""
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilProvincia",

                        etiqueta:
                            "Provincia",

                        valor:
                            datos.provincia
                            ||
                            ""
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilCodigoPostal",

                        etiqueta:
                            "Código postal",

                        valor:
                            datos.codigoPostal
                            ||
                            ""
                    })}


                    ${this.crearCampoPerfil({
                        id:
                            "perfilPais",

                        etiqueta:
                            "País",

                        valor:
                            datos.pais
                            ||
                            "España"
                    })}


                    <div class="perfil-divider perfil-full"></div>


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
    // CAMPO PERFIL
    // =====================================================

    crearCampoPerfil({
        id,
        etiqueta,
        valor = "",
        tipo = "text",
        completo = false
    }) {

        return `

            <div
                class="
                    perfil-field
                    ${
                        completo
                            ? "perfil-full"
                            : ""
                    }
                "
            >

                <label for="${escaparHTML(
                    id
                )}">

                    ${escaparHTML(
                        etiqueta
                    )}

                </label>


                <input
                    id="${escaparHTML(
                        id
                    )}"
                    type="${escaparHTML(
                        tipo
                    )}"
                    value="${escaparHTML(
                        valor
                    )}"
                >

            </div>

        `;

    }


    // =====================================================
    // BACKUP
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

                    <article class="backup-card">

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

                    </article>


                    <article class="backup-card">

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
                        ></div>

                    </article>

                </div>


                <div class="perfil-danger-zone">

                    <div>

                        <h3>
                            ⚠️ Zona de peligro
                        </h3>

                        <p>
                            Esta opción borra todos los datos locales de GestaCamps.
                            Descarga una copia antes si quieres conservarlos.
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

        document
            .getElementById(
                "volverPerfil"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.volver()
            );


        document
            .getElementById(
                "guardarPerfil"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarPerfil()
            );

    }


    // =====================================================
    // VOLVER
    // =====================================================

    volver() {

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
                ||
                "No se han podido guardar los datos."
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


        document
            .getElementById(
                "descargarBackup"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.descargarBackup()
            );


        document
            .getElementById(
                "archivoBackup"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.seleccionarBackup(
                        event
                    )
            );


        document
            .getElementById(
                "borrarDatosGestaCamps"
            )
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

        const elementos = [

            [
                "🌾",
                resumen.fincas,
                "fincas"
            ],

            [
                "🗓️",
                resumen.campanias,
                "Campanyas"
            ],

            [
                "🌱",
                resumen.cultivos,
                "cultivos"
            ],

            [
                "📖",
                resumen.cuaderno,
                "cuaderno"
            ],

            [
                "🧪",
                resumen.tratamientos,
                "tratamientos"
            ],

            [
                "👨‍🌾",
                resumen.trabajos,
                "trabajos"
            ],

            [
                "👷",
                resumen.trabajadores,
                "trabajadores"
            ],

            [
                "⏱️",
                resumen.fichajes,
                "fichajes"
            ],

            [
                "⚠️",
                resumen.incidencias,
                "incidencias"
            ],

            [
                "🚜",
                resumen.maquinaria,
                "maquinaria"
            ],

            [
                "📦",
                resumen.inventario,
                "inventario"
            ],

            [
                "🍎",
                resumen.produccion,
                "producción"
            ],

            [
                "👥",
                resumen.contactos,
                "contactos"
            ],

            [
                "🧾",
                resumen.albaranes,
                "albaranes"
            ],

            [
                "💶",
                resumen.facturas,
                "facturas"
            ],

            [
                "💳",
                resumen.movimientos,
                "cobros/pagos"
            ],

            [
                "💰",
                resumen.gastos,
                "gastos"
            ],

            [
                "🕒",
                resumen.historial,
                "historial"
            ]

        ];


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
                        ||
                        "—"
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

                    ${elementos
                        .map(
                            (
                                [
                                    icono,
                                    cantidad,
                                    nombre
                                ]
                            ) => `

                                <span>

                                    ${icono}

                                    ${Number(
                                        cantidad
                                        ||
                                        0
                                    )}

                                    ${escaparHTML(
                                        nombre
                                    )}

                                </span>

                            `
                        )
                        .join("")}

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


        const primeraConfirmacion =
            window.confirm(
                "La restauración sustituirá los datos actuales de GestaCamps por los contenidos en esta copia.\n\n¿Quieres continuar?"
            );


        if (
            !primeraConfirmacion
        ) {

            return;

        }


        const segundaConfirmacion =
            window.confirm(
                "Esta acción reemplazará los datos actuales.\n\n¿Confirmas definitivamente la restauración?"
            );


        if (
            !segundaConfirmacion
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


        const confirmar =
            window.confirm(
                "¿Quieres borrar TODOS los datos de GestaCamps?\n\nEsta acción no se puede deshacer sin una copia de seguridad."
            );


        if (
            !confirmar
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
                .filter(
                    Boolean
                )
                .join(
                    " "
                )
                .trim()
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


    obtenerInicialesUsuario(
        usuario
    ) {

        if (
            !usuario
        ) {

            return "👤";

        }


        const partes = [

            usuario.nombre,
            usuario.apellidos

        ]
            .filter(
                Boolean
            );


        if (
            partes.length ===
            0
        ) {

            const nombre =
                usuario.usuario
                ||
                "";


            return (
                nombre
                    .slice(
                        0,
                        2
                    )
                    .toUpperCase()
                ||
                "👤"
            );

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


    // =====================================================
    // DATO RESUMEN
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