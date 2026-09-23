import {
    crearVistas
} from "./views.js";

import {
    AuthService
} from "./auth.js";

import {
    LoginView
} from "./loginView.js";


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
        "nav a[data-page]"
    );


const navGroups =
    document.querySelectorAll(
        ".sidebar-group"
    );


const navGroupToggles =
    document.querySelectorAll(
        ".sidebar-group-toggle"
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
// NORMALIZAR PÁGINA
// =====================================================

function normalizarPagina(
    pagina
) {

    return (
        String(
            pagina
            ??
            ""
        )
            .trim()
        ||
        PAGINA_INICIO
    );

}


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


    const primera =
        Object
            .keys(
                paginas
            )
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
// RESOLVER PÁGINA
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
// ESTADO DE GRUPO
// =====================================================

function establecerEstadoGrupo(
    grupo,
    abierto
) {

    if (
        !grupo
    ) {

        return;

    }


    grupo.classList.toggle(
        "is-open",
        abierto
    );


    const boton =
        grupo.querySelector(
            ".sidebar-group-toggle"
        );


    boton?.setAttribute(
        "aria-expanded",
        String(
            abierto
        )
    );

}


// =====================================================
// CERRAR TODOS LOS GRUPOS
// =====================================================

function cerrarTodosLosGrupos(
    excepto = null
) {

    navGroups.forEach(
        grupo => {

            if (
                grupo ===
                excepto
            ) {

                return;

            }


            establecerEstadoGrupo(
                grupo,
                false
            );

        }
    );

}


// =====================================================
// ABRIR GRUPO
// =====================================================

function abrirGrupo(
    grupo
) {

    if (
        !grupo
        ||
        grupo.hidden
    ) {

        return;

    }


    cerrarTodosLosGrupos(
        grupo
    );


    establecerEstadoGrupo(
        grupo,
        true
    );

}


// =====================================================
// OBTENER GRUPO DE UNA PÁGINA
// =====================================================

function obtenerGrupoDePagina(
    pagina
) {

    const enlace =
        Array
            .from(
                menuLinks
            )
            .find(
                link =>
                    link.dataset.page ===
                    pagina
            );


    return (
        enlace?.closest(
            ".sidebar-group"
        )
        ||
        null
    );

}


// =====================================================
// ABRIR GRUPO DE PÁGINA ACTIVA
// =====================================================

function abrirGrupoDePagina(
    pagina
) {

    const grupo =
        obtenerGrupoDePagina(
            pagina
        );


    /*
     * Inicio y Buscar global están fuera
     * de los desplegables.
     */

    if (
        !grupo
    ) {

        cerrarTodosLosGrupos();

        return;

    }


    abrirGrupo(
        grupo
    );

}


// =====================================================
// EVENTOS DE LOS 5 DESPLEGABLES
// =====================================================

navGroupToggles.forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                const grupo =
                    boton.closest(
                        ".sidebar-group"
                    );


                if (
                    !grupo
                ) {

                    return;

                }


                const estabaAbierto =
                    boton.getAttribute(
                        "aria-expanded"
                    ) ===
                    "true";


                cerrarTodosLosGrupos();


                if (
                    !estabaAbierto
                ) {

                    establecerEstadoGrupo(
                        grupo,
                        true
                    );

                }

            }
        );

    }
);


// =====================================================
// ACTIVAR MENÚ
// =====================================================

function activarMenu(
    pagina
) {

    menuLinks.forEach(
        link => {

            const activo =
                link.dataset.page ===
                pagina;


            link.classList.toggle(
                "active",
                activo
            );


            if (
                activo
            ) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            }

            else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        }
    );


    if (
        pagina
    ) {

        abrirGrupoDePagina(
            pagina
        );

    }

    else {

        cerrarTodosLosGrupos();

    }

}


// =====================================================
// VISIBILIDAD DE GRUPOS
// =====================================================

function actualizarVisibilidadGrupos() {

    navGroups.forEach(
        grupo => {

            const enlaces =
                Array.from(
                    grupo.querySelectorAll(
                        "a[data-page]"
                    )
                );


            const tieneEnlacesVisibles =
                enlaces.some(
                    enlace =>
                        !enlace.hidden
                );


            grupo.hidden =
                !tieneEnlacesVisibles;


            if (
                grupo.hidden
            ) {

                establecerEstadoGrupo(
                    grupo,
                    false
                );

            }

        }
    );

}


// =====================================================
// PERMISOS SIDEBAR
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


    actualizarVisibilidadGrupos();

}


// =====================================================
// OBTENER PÁGINA DE URL
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
// HISTORIAL
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
            pagina
        },
        "",
        `#${pagina}`
    );

}


// =====================================================
// MODO INTERFAZ
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
// SALIR DEL PORTAL TRABAJADOR
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
// PÁGINAS
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
// EXISTE PÁGINA
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


    mostrarPaginaAdministracion(
        resolverPaginaAdministracion(
            pagina
        )
    );

}


// =====================================================
// MOSTRAR ADMINISTRACIÓN
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


    /*
     * Primero utilizamos el botón que ya existe
     * en index.html.
     */

    let boton =
        document.getElementById(
            "cerrarSesion"
        );


    /*
     * Compatibilidad por si algún HTML antiguo
     * todavía utiliza cerrarSesionAdmin.
     */

    if (
        !boton
    ) {

        boton =
            document.getElementById(
                "cerrarSesionAdmin"
            );

    }


    /*
     * Si no existe ninguno, lo creamos.
     */

    if (
        !boton
    ) {

        let footer =
            sidebar.querySelector(
                ".sidebar-footer"
            );


        if (
            !footer
        ) {

            footer =
                document.createElement(
                    "div"
                );


            footer.className =
                "sidebar-footer";


            sidebar.appendChild(
                footer
            );

        }


        boton =
            document.createElement(
                "button"
            );


        boton.id =
            "cerrarSesion";


        boton.type =
            "button";


        boton.className =
            "sidebar-logout-button";


        boton.textContent =
            "🔒 Cerrar sesión";


        footer.appendChild(
            boton
        );

    }


    /*
     * Evitamos añadir el mismo listener
     * varias veces.
     */

    if (
        boton.dataset.logoutReady ===
        "1"
    ) {

        return;

    }


    boton.dataset.logoutReady =
        "1";


    boton.addEventListener(
        "click",
        cerrarSesionAdministracion
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


    cerrarTodosLosGrupos();


    guardarPaginaEnHistorial(
        PAGINA_INICIO,
        true
    );


    mostrarAccesoAdministracion();

}


// =====================================================
// NAVEGACIÓN NAVEGADOR
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
// EVENTOS LINKS MENÚ
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
            event.state?.pagina
            ||
            obtenerPaginaDeURL();


        procesarNavegacionNavegador(
            pagina
        );

    }
);


// =====================================================
// CAMBIO MANUAL DE HASH
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
// ABRIR MENÚ MÓVIL
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


// =====================================================
// CERRAR MENÚ MÓVIL
// =====================================================

function cerrarMenuMovil() {

    sidebar?.classList.remove(
        "sidebar-open"
    );


    document.body.classList.remove(
        "mobile-menu-open"
    );


    actualizarEstadoBotonMenu(
        false
    );

}


// =====================================================
// ESTADO ARIA DEL MENÚ
// =====================================================

function actualizarEstadoBotonMenu(
    abierto
) {

    mobileMenuButton?.setAttribute(
        "aria-expanded",
        String(
            abierto
        )
    );

}


// =====================================================
// BOTÓN ☰
// =====================================================

mobileMenuButton
    ?.addEventListener(
        "click",
        abrirMenuMovil
    );


// =====================================================
// BOTÓN X
// =====================================================

mobileMenuClose
    ?.addEventListener(
        "click",
        cerrarMenuMovil
    );


// =====================================================
// BACKDROP
// =====================================================

sidebarBackdrop
    ?.addEventListener(
        "click",
        cerrarMenuMovil
    );


// =====================================================
// ESCAPE
// =====================================================

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


// =====================================================
// RESIZE
// =====================================================

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

    asegurarBotonCerrarSesion();


    /*
     * Los cinco bloques empiezan cerrados.
     * Después activarMenu abrirá únicamente
     * el correspondiente a la página actual.
     */

    cerrarTodosLosGrupos();


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


// =====================================================
// INICIAR
// =====================================================

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


// =====================================================
// REGISTRAR SERVICE WORKER
// =====================================================

window.addEventListener(
    "load",
    registrarServiceWorker
);