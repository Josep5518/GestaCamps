import { crearVistas } from "./views.js";

import { AuthService } from "./auth.js";

import { LoginView } from "./loginView.js";


// =====================================================
// CONSTANTES
// =====================================================

const PAGINA_INICIO =
    "inicio";


const PAGINA_PORTAL_TRABAJADOR =
    "trabajadorPortal";


const ANCHO_MENU_MOVIL =
    760;


const MODOS_INTERFAZ = {

    ADMIN:
        "admin",

    LOGIN:
        "login",

    TRABAJADOR:
        "trabajador"

};


// =====================================================
// ELEMENTOS PRINCIPALES
// =====================================================

const mainContent =
    document.getElementById(
        "main-content"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


const mobileHeader =
    document.querySelector(
        ".mobile-header"
    );


const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


const mobileMenuClose =
    document.getElementById(
        "mobileMenuClose"
    );


const sidebarBackdrop =
    document.getElementById(
        "sidebarBackdrop"
    );


const menuLinks =
    document.querySelectorAll(
        "nav a"
    );


// =====================================================
// AUTENTICACIÓN
// =====================================================

const authService =
    new AuthService();


const loginView =
    new LoginView(
        mainContent,
        authService,
        () =>
            iniciarAdministracion()
    );


// =====================================================
// NAVEGACIÓN PÚBLICA
// =====================================================

function navegarA(
    pagina,
    guardarHistorial = true
) {

    const paginaDestino =
        normalizarPagina(
            pagina
        );


    if (
        paginaDestino ===
        PAGINA_PORTAL_TRABAJADOR
    ) {

        if (
            guardarHistorial
        ) {

            guardarPaginaEnHistorial(
                PAGINA_PORTAL_TRABAJADOR,
                false
            );

        }


        mostrarPortalTrabajador();


        return;

    }


    if (
        !authService
            .haySesionActiva()
    ) {

        mostrarAccesoAdministracion();


        return;

    }


    const paginaPermitida =
        resolverPaginaAdministracion(
            paginaDestino
        );


    if (
        guardarHistorial
    ) {

        guardarPaginaEnHistorial(
            paginaPermitida,
            false
        );

    }


    mostrarPaginaAdministracion(
        paginaPermitida
    );

}


// =====================================================
// NORMALIZAR PÁGINA
// =====================================================

function normalizarPagina(
    pagina
) {

    const valor =
        String(
            pagina
            ??
            ""
        )
            .trim();


    return (
        valor
        ||
        PAGINA_INICIO
    );

}


// =====================================================
// ACCESO GENERAL
// =====================================================

function puedeAccederPagina(
    pagina
) {

    if (
        pagina ===
        PAGINA_PORTAL_TRABAJADOR
    ) {

        return true;

    }


    if (
        !authService
            .haySesionActiva()
    ) {

        return false;

    }


    return puedeVerPaginaAdministracion(
        pagina
    );

}


// =====================================================
// PERMISO DE VISUALIZACIÓN
// =====================================================

function puedeVerPaginaAdministracion(
    pagina
) {

    if (
        !existePaginaAdministracion(
            pagina
        )
    ) {

        return false;

    }


    return authService
        .tienePermiso(
            pagina,
            "ver"
        );

}


// =====================================================
// PRIMERA PÁGINA PERMITIDA
// =====================================================

function obtenerPrimeraPaginaPermitida() {

    if (
        puedeVerPaginaAdministracion(
            PAGINA_INICIO
        )
    ) {

        return PAGINA_INICIO;

    }


    const paginasDisponibles =
        Object.keys(
            paginas
        );


    const primera =
        paginasDisponibles
            .find(
                pagina =>
                    puedeVerPaginaAdministracion(
                        pagina
                    )
            );


    return (
        primera
        ||
        null
    );

}


// =====================================================
// RESOLVER PÁGINA ADMIN
// =====================================================

function resolverPaginaAdministracion(
    pagina
) {

    if (
        puedeVerPaginaAdministracion(
            pagina
        )
    ) {

        return pagina;

    }


    return (
        obtenerPrimeraPaginaPermitida()
        ||
        PAGINA_INICIO
    );

}


// =====================================================
// ACTIVAR MENÚ
// =====================================================

function activarMenu(
    pagina
) {

    menuLinks.forEach(
        link => {

            link.classList.toggle(
                "active",
                link.dataset.page ===
                pagina
            );

        }
    );

}


// =====================================================
// APLICAR PERMISOS AL SIDEBAR
// =====================================================

function aplicarPermisosSidebar() {

    const haySesion =
        authService
            .haySesionActiva();


    menuLinks.forEach(
        link => {

            const pagina =
                normalizarPagina(
                    link.dataset.page
                );


            if (
                pagina ===
                PAGINA_PORTAL_TRABAJADOR
            ) {

                link.hidden =
                    false;


                return;

            }


            if (
                !haySesion
            ) {

                link.hidden =
                    false;


                return;

            }


            link.hidden =
                !authService
                    .tienePermiso(
                        pagina,
                        "ver"
                    );

        }
    );

}


// =====================================================
// URL
// =====================================================

function obtenerPaginaDeURL() {

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            )
            .trim();


    return normalizarPagina(
        hash
    );

}


// =====================================================
// HISTORIAL DEL NAVEGADOR
// =====================================================

function guardarPaginaEnHistorial(
    pagina,
    reemplazar = false
) {

    const metodo =
        reemplazar
            ? "replaceState"
            : "pushState";


    history[
        metodo
    ](
        {
            pagina:
                pagina
        },
        "",
        `#${pagina}`
    );

}


// =====================================================
// MODO DE INTERFAZ
// =====================================================

function aplicarModoInterfaz(
    modo
) {

    cerrarMenuMovil();


    const esLogin =
        modo ===
        MODOS_INTERFAZ.LOGIN;


    const esTrabajador =
        modo ===
        MODOS_INTERFAZ.TRABAJADOR;


    const esAdmin =
        modo ===
        MODOS_INTERFAZ.ADMIN;


    document.body.classList.toggle(
        "worker-portal-mode",
        esTrabajador
    );


    if (
        sidebar
    ) {

        sidebar.style.display =
            esAdmin
                ? ""
                : "none";

    }


    if (
        mobileHeader
    ) {

        mobileHeader.style.display =
            esAdmin
                ? ""
                : "none";

    }


    if (
        mainContent
    ) {

        mainContent.style.marginLeft =
            esAdmin
                ? ""
                : "0";


        mainContent.style.width =
            esAdmin
                ? ""
                : "100%";


        mainContent.style.padding =
            esLogin
                ? "0"
                : "";

    }

}


// =====================================================
// MODO TRABAJADOR
// =====================================================

function entrarModoTrabajador() {

    aplicarModoInterfaz(
        MODOS_INTERFAZ.TRABAJADOR
    );

}


// =====================================================
// SALIR MODO TRABAJADOR
// =====================================================

function salirModoTrabajador() {

    if (
        authService
            .haySesionActiva()
    ) {

        const pagina =
            obtenerPrimeraPaginaPermitida();


        if (
            pagina
        ) {

            guardarPaginaEnHistorial(
                pagina,
                true
            );


            mostrarPaginaAdministracion(
                pagina
            );


            return;

        }

    }


    mostrarAccesoAdministracion();

}


// =====================================================
// CREAR VISTAS
// =====================================================

const {

    inicioView,

    fincasView,

    campaniasView,

    cultivosView,

    cuadernoCampoView,

    tratamientosView,

    trabajosView,

    trabajadoresView,

    fichajesView,

    incidenciasView,

    historialView,

    buscadorGlobalView,

    trabajadorPortalView,

    maquinariaView,

    inventarioView,

    produccionView,

    clientesProveedoresView,

    albaranesView,

    facturacionView,

    gastosView,

    cobrosPagosView,

    estadisticasView,

    usuariosView,

    perfilView

} =
    crearVistas(
        mainContent,
        navegarA,
        salirModoTrabajador
    );


// =====================================================
// MAPA DE PÁGINAS
// =====================================================

const paginas = {

    inicio:
        () =>
            inicioView.mostrar(),

    buscador:
        () =>
            buscadorGlobalView.mostrar(),

    fincas:
        () =>
            fincasView.mostrar(),

    campanias:
        () =>
            campaniasView.mostrar(),

    cultivos:
        () =>
            cultivosView.mostrar(),

    cuadernoCampo:
        () =>
            cuadernoCampoView.mostrar(),

    tratamientos:
        () =>
            tratamientosView.mostrar(),

    trabajos:
        () =>
            trabajosView.mostrar(),

    trabajadores:
        () =>
            trabajadoresView.mostrar(),

    fichajes:
        () =>
            fichajesView.mostrar(),

    incidencias:
        () =>
            incidenciasView.mostrar(),

    maquinaria:
        () =>
            maquinariaView.mostrar(),

    inventario:
        () =>
            inventarioView.mostrar(),

    produccion:
        () =>
            produccionView.mostrar(),

    clientesProveedores:
        () =>
            clientesProveedoresView.mostrar(),

    albaranes:
        () =>
            albaranesView.mostrar(),

    facturacion:
        () =>
            facturacionView.mostrar(),

    cobrosPagos:
        () =>
            cobrosPagosView.mostrar(),

    gastos:
        () =>
            gastosView.mostrar(),

    estadisticas:
        () =>
            estadisticasView.mostrar(),

    historial:
        () =>
            historialView.mostrar(),

    usuarios:
        () =>
            usuariosView.mostrar(),

    perfil:
        () =>
            perfilView.mostrar()

};


// =====================================================
// SABER SI EXISTE PÁGINA ADMIN
// =====================================================

function existePaginaAdministracion(
    pagina
) {

    return Boolean(
        paginas[
            pagina
        ]
    );

}


// =====================================================
// MOSTRAR PÁGINA
// =====================================================

function mostrarPagina(
    pagina
) {

    if (
        pagina ===
        PAGINA_PORTAL_TRABAJADOR
    ) {

        mostrarPortalTrabajador();


        return;

    }


    if (
        !authService
            .haySesionActiva()
    ) {

        mostrarAccesoAdministracion();


        return;

    }


    const paginaPermitida =
        resolverPaginaAdministracion(
            pagina
        );


    mostrarPaginaAdministracion(
        paginaPermitida
    );

}


// =====================================================
// PÁGINA ADMINISTRACIÓN
// =====================================================

function mostrarPaginaAdministracion(
    pagina
) {

    if (
        !authService
            .haySesionActiva()
    ) {

        mostrarAccesoAdministracion();


        return;

    }


    const paginaValida =
        resolverPaginaAdministracion(
            pagina
        );


    if (
        !paginaValida
        ||
        !puedeVerPaginaAdministracion(
            paginaValida
        )
    ) {

        mostrarSinPermisos();


        return;

    }


    aplicarModoInterfaz(
        MODOS_INTERFAZ.ADMIN
    );


    aplicarPermisosSidebar();


    asegurarBotonCerrarSesion();


    activarMenu(
        paginaValida
    );


    paginas[
        paginaValida
    ]();

}


// =====================================================
// SIN PERMISOS
// =====================================================

function mostrarSinPermisos() {

    aplicarModoInterfaz(
        MODOS_INTERFAZ.ADMIN
    );


    aplicarPermisosSidebar();


    asegurarBotonCerrarSesion();


    activarMenu(
        ""
    );


    if (
        !mainContent
    ) {

        return;

    }


    mainContent.innerHTML = `

        <section class="empty-state">

            <div class="empty-icon">
                🔒
            </div>

            <h3>
                Sin permisos disponibles
            </h3>

            <p>
                Este usuario no tiene acceso a ningún módulo
                de Administración.
            </p>

        </section>

    `;

}


// =====================================================
// PORTAL TRABAJADOR
// =====================================================

function mostrarPortalTrabajador() {

    entrarModoTrabajador();


    activarMenu(
        PAGINA_PORTAL_TRABAJADOR
    );


    trabajadorPortalView
        .mostrar();

}


// =====================================================
// LOGIN
// =====================================================

function mostrarAccesoAdministracion() {

    aplicarModoInterfaz(
        MODOS_INTERFAZ.LOGIN
    );


    loginView.mostrar();

}


// =====================================================
// INICIAR ADMINISTRACIÓN
// =====================================================

function iniciarAdministracion() {

    aplicarPermisosSidebar();


    let pagina =
        obtenerPaginaDeURL();


    if (
        pagina ===
        PAGINA_PORTAL_TRABAJADOR
    ) {

        pagina =
            obtenerPrimeraPaginaPermitida();

    }


    if (
        !pagina
        ||
        !puedeVerPaginaAdministracion(
            pagina
        )
    ) {

        pagina =
            obtenerPrimeraPaginaPermitida();

    }


    if (
        !pagina
    ) {

        mostrarSinPermisos();


        return;

    }


    guardarPaginaEnHistorial(
        pagina,
        true
    );


    mostrarPaginaAdministracion(
        pagina
    );

}


// =====================================================
// BOTÓN CERRAR SESIÓN
// =====================================================

function asegurarBotonCerrarSesion() {

    if (
        !sidebar
    ) {

        return;

    }


    const existente =
        document.getElementById(
            "cerrarSesionAdmin"
        );


    if (
        existente
    ) {

        return;

    }


    const boton =
        document.createElement(
            "button"
        );


    boton.id =
        "cerrarSesionAdmin";


    boton.type =
        "button";


    boton.className =
        "sidebar-logout-button";


    boton.textContent =
        "🔒 Cerrar sesión";


    boton.addEventListener(
        "click",
        cerrarSesionAdministracion
    );


    sidebar.appendChild(
        boton
    );

}


// =====================================================
// CERRAR SESIÓN
// =====================================================

function cerrarSesionAdministracion() {

    const confirmar =
        window.confirm(
            "¿Quieres cerrar la sesión de Administración?"
        );


    if (
        !confirmar
    ) {

        return;

    }


    authService
        .cerrarSesion();


    aplicarPermisosSidebar();


    guardarPaginaEnHistorial(
        PAGINA_INICIO,
        true
    );


    mostrarAccesoAdministracion();

}


// =====================================================
// NAVEGACIÓN DESDE NAVEGADOR
// =====================================================

function procesarNavegacionNavegador(
    pagina
) {

    const destino =
        normalizarPagina(
            pagina
        );


    if (
        destino ===
        PAGINA_PORTAL_TRABAJADOR
    ) {

        mostrarPortalTrabajador();


        cerrarMenuMovil();


        return;

    }


    if (
        !authService
            .haySesionActiva()
    ) {

        mostrarAccesoAdministracion();


        cerrarMenuMovil();


        return;

    }


    const paginaPermitida =
        resolverPaginaAdministracion(
            destino
        );


    if (
        paginaPermitida !==
        destino
    ) {

        guardarPaginaEnHistorial(
            paginaPermitida,
            true
        );

    }


    mostrarPaginaAdministracion(
        paginaPermitida
    );


    cerrarMenuMovil();

}


// =====================================================
// EVENTOS DEL MENÚ
// =====================================================

menuLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                navegarA(
                    link.dataset.page
                );

            }
        );

    }
);


// =====================================================
// ATRÁS / ADELANTE
// =====================================================

window.addEventListener(
    "popstate",
    event => {

        const pagina =
            event.state
            ?.pagina
            ||
            obtenerPaginaDeURL();


        procesarNavegacionNavegador(
            pagina
        );

    }
);


// =====================================================
// CAMBIO MANUAL HASH
// =====================================================

window.addEventListener(
    "hashchange",
    () => {

        procesarNavegacionNavegador(
            obtenerPaginaDeURL()
        );

    }
);


// =====================================================
// MENÚ MÓVIL
// =====================================================

function abrirMenuMovil() {

    if (
        !sidebar
        ||
        !authService
            .haySesionActiva()
    ) {

        return;

    }


    sidebar.classList.add(
        "sidebar-open"
    );


    document.body.classList.add(
        "mobile-menu-open"
    );


    actualizarEstadoBotonMenu(
        true
    );

}


function cerrarMenuMovil() {

    if (
        sidebar
    ) {

        sidebar.classList.remove(
            "sidebar-open"
        );

    }


    document.body.classList.remove(
        "mobile-menu-open"
    );


    actualizarEstadoBotonMenu(
        false
    );

}


// =====================================================
// ARIA MENÚ MÓVIL
// =====================================================

function actualizarEstadoBotonMenu(
    abierto
) {

    if (
        !mobileMenuButton
    ) {

        return;

    }


    mobileMenuButton.setAttribute(
        "aria-expanded",
        String(
            abierto
        )
    );

}


// =====================================================
// EVENTOS MENÚ MÓVIL
// =====================================================

if (
    mobileMenuButton
) {

    mobileMenuButton.addEventListener(
        "click",
        abrirMenuMovil
    );

}


if (
    mobileMenuClose
) {

    mobileMenuClose.addEventListener(
        "click",
        cerrarMenuMovil
    );

}


if (
    sidebarBackdrop
) {

    sidebarBackdrop.addEventListener(
        "click",
        cerrarMenuMovil
    );

}


window.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            cerrarMenuMovil();

        }

    }
);


window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            ANCHO_MENU_MOVIL
        ) {

            cerrarMenuMovil();

        }

    }
);


// =====================================================
// ARRANQUE
// =====================================================

function arrancar() {

    const paginaInicial =
        obtenerPaginaDeURL();


    if (
        paginaInicial ===
        PAGINA_PORTAL_TRABAJADOR
    ) {

        guardarPaginaEnHistorial(
            PAGINA_PORTAL_TRABAJADOR,
            true
        );


        mostrarPortalTrabajador();


        return;

    }


    if (
        !authService
            .haySesionActiva()
    ) {

        guardarPaginaEnHistorial(
            paginaInicial,
            true
        );


        mostrarAccesoAdministracion();


        return;

    }


    aplicarPermisosSidebar();


    const paginaPermitida =
        resolverPaginaAdministracion(
            paginaInicial
        );


    if (
        !paginaPermitida
        ||
        !puedeVerPaginaAdministracion(
            paginaPermitida
        )
    ) {

        mostrarSinPermisos();


        return;

    }


    guardarPaginaEnHistorial(
        paginaPermitida,
        true
    );


    mostrarPaginaAdministracion(
        paginaPermitida
    );

}


arrancar();


// =====================================================
// SERVICE WORKER
// =====================================================

function registrarServiceWorker() {

    if (
        !(
            "serviceWorker"
            in navigator
        )
    ) {

        return;

    }


    navigator.serviceWorker
        .register(
            "./service-worker.js"
        )
        .then(
            registration => {

                console.log(
                    "GestaCamps PWA activa.",
                    registration.scope
                );

            }
        )
        .catch(
            error => {

                console.error(
                    "No se ha podido registrar el Service Worker de GestaCamps:",
                    error
                );

            }
        );

}


window.addEventListener(
    "load",
    registrarServiceWorker
);