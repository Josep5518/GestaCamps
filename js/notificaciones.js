// =====================================================
// GESTACAMPS
// CENTRO DE NOTIFICACIONES
// MVP · V2
// =====================================================
//
// Sistema global de avisos.
//
// CORRECCIÓN V2:
// - La campana puede ser recreada por las vistas.
// - Ya no dependemos de un listener pegado a un botón.
// - Usamos delegación global de eventos.
// - Detectamos automáticamente nuevas campanas.
// - Funciona al navegar entre módulos.
// - Funciona en PC y móvil.
//
// =====================================================


// =====================================================
// CONFIGURACIÓN
// =====================================================

const CLAVE_VISTAS =
    "gestacamps_notificaciones_vistas";


const INTERVALO_ACTUALIZACION =
    15000;


// =====================================================
// UTILIDADES
// =====================================================

function normalizarTexto(
    valor
) {

    return String(
        valor
        ??
        ""
    )
        .trim()
        .toLowerCase();

}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(
    valor
) {

    return String(
        valor
        ??
        ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// =====================================================
// FECHA LOCAL
// =====================================================

function obtenerFechaLocal() {

    const fecha =
        new Date();


    const anio =
        fecha.getFullYear();


    const mes =
        String(
            fecha.getMonth()
            +
            1
        )
            .padStart(
                2,
                "0"
            );


    const dia =
        String(
            fecha.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return (
        `${anio}-${mes}-${dia}`
    );

}


// =====================================================
// SUMAR DÍAS
// =====================================================

function sumarDias(
    fechaBase,
    dias
) {

    const fecha =
        new Date(
            fechaBase
        );


    fecha.setDate(
        fecha.getDate()
        +
        dias
    );


    return fecha;

}


// =====================================================
// CONVERTIR FECHA
// =====================================================

function convertirFecha(
    valor
) {

    if (
        !valor
    ) {

        return null;

    }


    if (
        valor instanceof Date
    ) {

        return valor;

    }


    const texto =
        String(
            valor
        )
            .trim();


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            texto
        )
    ) {

        return new Date(
            `${texto}T12:00:00`
        );

    }


    const fecha =
        new Date(
            texto
        );


    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return null;

    }


    return fecha;

}


// =====================================================
// FORMATEAR FECHA
// =====================================================

function formatearFecha(
    valor
) {

    const fecha =
        convertirFecha(
            valor
        );


    if (
        !fecha
    ) {

        return "";

    }


    return fecha
        .toLocaleDateString(
            "es-ES",
            {

                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"

            }
        );

}


// =====================================================
// OBTENER LISTA DESDE SERVICIO
// =====================================================

function obtenerListaServicio(
    servicio
) {

    if (
        !servicio
    ) {

        return [];

    }


    const metodos = [

        "obtenerTodos",

        "obtenerTodas",

        "listar"

    ];


    for (
        const metodo
        of metodos
    ) {

        if (
            typeof servicio[
                metodo
            ] ===
            "function"
        ) {

            try {

                const resultado =
                    servicio[
                        metodo
                    ]();


                if (
                    Array.isArray(
                        resultado
                    )
                ) {

                    return resultado;

                }

            }

            catch (
                error
            ) {

                console.warn(
                    `GestaCamps Notificaciones: error en ${metodo}`,
                    error
                );

            }

        }

    }


    return [];

}


// =====================================================
// SERVICE
// =====================================================

export class NotificacionesService {

    constructor(
        services
    ) {

        this.services =
            services;

    }


    // =================================================
    // TODAS
    // =================================================

    obtenerTodas() {

        const notificaciones = [

            ...this.obtenerNotificacionesTrabajos(),

            ...this.obtenerNotificacionesIncidencias(),

            ...this.obtenerNotificacionesMaquinaria(),

            ...this.obtenerNotificacionesFacturacion(),

            ...this.obtenerNotificacionesGastos()

        ];


        return notificaciones
            .sort(
                (
                    a,
                    b
                ) => {

                    const niveles = {

                        critica:
                            4,

                        alta:
                            3,

                        media:
                            2,

                        baja:
                            1

                    };


                    return (

                        (
                            niveles[
                                b.prioridad
                            ]
                            ||
                            0
                        )

                        -

                        (
                            niveles[
                                a.prioridad
                            ]
                            ||
                            0
                        )

                    );

                }
            );

    }


    // =================================================
    // TRABAJOS
    // =================================================

    obtenerNotificacionesTrabajos() {

        const trabajos =
            obtenerListaServicio(
                this.services?.trabajo
            );


        const hoy =
            obtenerFechaLocal();


        const resultado =
            [];


        trabajos.forEach(
            trabajo => {

                const estado =
                    normalizarTexto(
                        trabajo.estado
                    );


                if (
                    [
                        "completada",
                        "completado",
                        "finalizada",
                        "finalizado",
                        "realizada",
                        "realizado",
                        "cerrada",
                        "cerrado",
                        "cancelada",
                        "cancelado"
                    ]
                        .includes(
                            estado
                        )
                ) {

                    return;

                }


                const fecha =
                    trabajo.fecha
                    ||
                    trabajo.fechaPrevista
                    ||
                    trabajo.fechaProgramada;


                if (
                    !fecha
                ) {

                    return;

                }


                const fechaTexto =
                    String(
                        fecha
                    )
                        .slice(
                            0,
                            10
                        );


                const nombre =
                    trabajo.titulo
                    ||
                    trabajo.nombre
                    ||
                    trabajo.tipo
                    ||
                    "Trabajo";


                if (
                    fechaTexto <
                    hoy
                ) {

                    resultado.push(
                        {

                            id:
                                `trabajo-vencido-${trabajo.id}`,

                            tipo:
                                "trabajo",

                            icono:
                                "⏰",

                            prioridad:
                                "alta",

                            titulo:
                                "Tarea vencida",

                            descripcion:
                                nombre,

                            detalle:
                                formatearFecha(
                                    fecha
                                ),

                            pagina:
                                "trabajos"

                        }
                    );


                    return;

                }


                if (
                    fechaTexto ===
                    hoy
                ) {

                    resultado.push(
                        {

                            id:
                                `trabajo-hoy-${trabajo.id}`,

                            tipo:
                                "trabajo",

                            icono:
                                "🚜",

                            prioridad:
                                "media",

                            titulo:
                                "Tarea para hoy",

                            descripcion:
                                nombre,

                            detalle:
                                trabajo.fincaNombre
                                ||
                                "",

                            pagina:
                                "trabajos"

                        }
                    );

                }

            }
        );


        return resultado;

    }


    // =================================================
    // INCIDENCIAS
    // =================================================

    obtenerNotificacionesIncidencias() {

        const incidencias =
            obtenerListaServicio(
                this.services?.incidencia
            );


        const resultado =
            [];


        incidencias.forEach(
            incidencia => {

                const estado =
                    normalizarTexto(
                        incidencia.estado
                    );


                if (
                    estado ===
                    "resuelta"
                    ||
                    estado ===
                    "cerrada"
                ) {

                    return;

                }


                const prioridad =
                    normalizarTexto(
                        incidencia.prioridad
                    );


                let nivel =
                    "media";


                if (
                    prioridad ===
                    "urgente"
                ) {

                    nivel =
                        "critica";

                }

                else if (
                    prioridad ===
                    "alta"
                ) {

                    nivel =
                        "alta";

                }


                resultado.push(
                    {

                        id:
                            `incidencia-${incidencia.id}-${estado}-${prioridad}`,

                        tipo:
                            "incidencia",

                        icono:
                            prioridad ===
                            "urgente"
                                ? "🚨"
                                : "⚠️",

                        prioridad:
                            nivel,

                        titulo:
                            prioridad ===
                            "urgente"
                                ? "Incidencia urgente"
                                : "Incidencia activa",

                        descripcion:
                            incidencia.tipo
                            ||
                            "Incidencia",

                        detalle:
                            incidencia.fincaNombre
                            ||
                            incidencia.descripcion
                            ||
                            "",

                        pagina:
                            "incidencias"

                    }
                );

            }
        );


        return resultado;

    }


    // =================================================
    // MAQUINARIA
    // =================================================

    obtenerNotificacionesMaquinaria() {

        const maquinas =
            obtenerListaServicio(
                this.services?.maquinaria
            );


        const resultado =
            [];


        const ahora =
            new Date();


        const limite =
            sumarDias(
                ahora,
                15
            );


        maquinas.forEach(
            maquina => {

                const estado =
                    normalizarTexto(
                        maquina.estado
                    );


                const nombre =
                    maquina.nombre
                    ||
                    maquina.tipo
                    ||
                    maquina.modelo
                    ||
                    "Maquinaria";


                if (
                    estado.includes(
                        "aver"
                    )
                    ||
                    estado.includes(
                        "fuera"
                    )
                ) {

                    resultado.push(
                        {

                            id:
                                `maquinaria-averia-${maquina.id}`,

                            tipo:
                                "maquinaria",

                            icono:
                                "🔧",

                            prioridad:
                                "alta",

                            titulo:
                                "Maquinaria no disponible",

                            descripcion:
                                nombre,

                            detalle:
                                maquina.estado
                                ||
                                "",

                            pagina:
                                "maquinaria"

                        }
                    );

                }


                const proximo =
                    maquina.proximoMantenimiento
                    ||
                    maquina.fechaProximoMantenimiento
                    ||
                    maquina.proximoMantenimientoFecha;


                const fechaProxima =
                    convertirFecha(
                        proximo
                    );


                if (
                    !fechaProxima
                ) {

                    return;

                }


                const hoySinHora =
                    new Date(

                        ahora.getFullYear(),

                        ahora.getMonth(),

                        ahora.getDate()

                    );


                const proximaSinHora =
                    new Date(

                        fechaProxima.getFullYear(),

                        fechaProxima.getMonth(),

                        fechaProxima.getDate()

                    );


                if (
                    proximaSinHora <
                    hoySinHora
                ) {

                    resultado.push(
                        {

                            id:
                                `mantenimiento-vencido-${maquina.id}`,

                            tipo:
                                "maquinaria",

                            icono:
                                "🛠️",

                            prioridad:
                                "alta",

                            titulo:
                                "Mantenimiento vencido",

                            descripcion:
                                nombre,

                            detalle:
                                formatearFecha(
                                    fechaProxima
                                ),

                            pagina:
                                "maquinaria"

                        }
                    );


                    return;

                }


                if (
                    fechaProxima <=
                    limite
                ) {

                    resultado.push(
                        {

                            id:
                                `mantenimiento-proximo-${maquina.id}`,

                            tipo:
                                "maquinaria",

                            icono:
                                "🔧",

                            prioridad:
                                "media",

                            titulo:
                                "Mantenimiento próximo",

                            descripcion:
                                nombre,

                            detalle:
                                formatearFecha(
                                    fechaProxima
                                ),

                            pagina:
                                "maquinaria"

                        }
                    );

                }

            }
        );


        return resultado;

    }


    // =================================================
    // FACTURACIÓN
    // =================================================

    obtenerNotificacionesFacturacion() {

        const facturas =
            obtenerListaServicio(
                this.services?.factura
            );


        const resultado =
            [];


        facturas.forEach(
            factura => {

                const estado =
                    normalizarTexto(
                        factura.estado
                    );


                if (
                    [
                        "cobrada",
                        "pagada",
                        "anulada"
                    ]
                        .includes(
                            estado
                        )
                ) {

                    return;

                }


                const total =
                    Number(
                        factura.total
                        ??
                        factura.importeTotal
                        ??
                        factura.totalFactura
                        ??
                        0
                    )
                    ||
                    0;


                const cobrado =
                    Number(
                        factura.cobrado
                        ??
                        factura.importeCobrado
                        ??
                        0
                    )
                    ||
                    0;


                let pendiente =
                    Math.max(
                        0,
                        total - cobrado
                    );


                try {

                    if (
                        typeof this.services
                            ?.cobroPago
                            ?.obtenerPendienteFactura ===
                        "function"
                    ) {

                        pendiente =
                            Number(
                                this.services
                                    .cobroPago
                                    .obtenerPendienteFactura(
                                        factura.id
                                    )
                            )
                            ||
                            pendiente;

                    }

                }

                catch (
                    error
                ) {

                    console.warn(
                        "Notificaciones: no se pudo calcular pendiente de factura.",
                        error
                    );

                }


                if (
                    pendiente <=
                    0.001
                ) {

                    return;

                }


                resultado.push(
                    {

                        id:
                            `factura-${factura.id}-${pendiente.toFixed(
                                2
                            )}`,

                        tipo:
                            "facturacion",

                        icono:
                            "💶",

                        prioridad:
                            "media",

                        titulo:
                            "Factura pendiente de cobro",

                        descripcion:
                            factura.numero
                            ||
                            factura.numeroFactura
                            ||
                            factura.clienteNombre
                            ||
                            "Factura",

                        detalle:
                            this.formatearDinero(
                                pendiente
                            ),

                        pagina:
                            "cobrosPagos"

                    }
                );

            }
        );


        return resultado;

    }


    // =================================================
    // GASTOS
    // =================================================

    obtenerNotificacionesGastos() {

        const gastos =
            obtenerListaServicio(
                this.services?.gasto
            );


        const resultado =
            [];


        gastos.forEach(
            gasto => {

                const estado =
                    normalizarTexto(
                        gasto.estado
                    );


                if (
                    estado ===
                    "pagado"
                    ||
                    estado ===
                    "anulado"
                ) {

                    return;

                }


                const total =
                    Number(
                        gasto.total
                        ??
                        gasto.importe
                        ??
                        gasto.importeTotal
                        ??
                        0
                    )
                    ||
                    0;


                const pagado =
                    Number(
                        gasto.pagado
                        ??
                        gasto.importePagado
                        ??
                        0
                    )
                    ||
                    0;


                let pendiente =
                    Math.max(
                        0,
                        total - pagado
                    );


                try {

                    if (
                        typeof this.services
                            ?.cobroPago
                            ?.obtenerPendienteGasto ===
                        "function"
                    ) {

                        pendiente =
                            Number(
                                this.services
                                    .cobroPago
                                    .obtenerPendienteGasto(
                                        gasto.id
                                    )
                            )
                            ||
                            pendiente;

                    }

                }

                catch (
                    error
                ) {

                    console.warn(
                        "Notificaciones: no se pudo calcular pendiente de gasto.",
                        error
                    );

                }


                if (
                    pendiente <=
                    0.001
                ) {

                    return;

                }


                resultado.push(
                    {

                        id:
                            `gasto-${gasto.id}-${pendiente.toFixed(
                                2
                            )}`,

                        tipo:
                            "gasto",

                        icono:
                            "💸",

                        prioridad:
                            "media",

                        titulo:
                            "Gasto pendiente de pago",

                        descripcion:
                            gasto.concepto
                            ||
                            gasto.proveedorNombre
                            ||
                            "Gasto",

                        detalle:
                            this.formatearDinero(
                                pendiente
                            ),

                        pagina:
                            "cobrosPagos"

                    }
                );

            }
        );


        return resultado;

    }


    // =================================================
    // DINERO
    // =================================================

    formatearDinero(
        valor
    ) {

        return new Intl.NumberFormat(
            "es-ES",
            {

                style:
                    "currency",

                currency:
                    "EUR"

            }
        )
            .format(
                Number(
                    valor
                )
                ||
                0
            );

    }

}


// =====================================================
// UI
// =====================================================

export class NotificacionesUI {

    constructor(
        services,
        navegarA
    ) {

        this.services =
            services;


        this.navegarA =
            navegarA;


        this.service =
            new NotificacionesService(
                services
            );


        this.notificaciones =
            [];


        this.campana =
            null;


        this.panelAbierto =
            false;


        this.intervalo =
            null;


        this.observer =
            null;


        this.iniciado =
            false;

    }


    // =================================================
    // INICIAR
    // =================================================

    iniciar() {

        if (
            this.iniciado
        ) {

            return;

        }


        this.iniciado =
            true;


        this.insertarEstilos();


        const arrancar =
            () => {

                this.configurarClickGlobal();

                this.configurarObserver();

                this.buscarCampana();

                this.actualizar();

                this.iniciarActualizacion();

            };


        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                arrancar,
                {
                    once:
                        true
                }
            );

        }

        else {

            arrancar();

        }

    }


    // =================================================
    // CLICK GLOBAL
    // =================================================

    configurarClickGlobal() {

        document.addEventListener(
            "click",
            event => {

                const trigger =
                    event.target
                        ?.closest(
                            "[data-gc-notifications-trigger='1']"
                        );


                if (
                    trigger
                ) {

                    event.preventDefault();

                    event.stopPropagation();


                    this.togglePanel();


                    return;

                }


                const panel =
                    document.getElementById(
                        "gc-notifications-panel"
                    );


                if (
                    this.panelAbierto
                    &&
                    panel
                    &&
                    !panel.contains(
                        event.target
                    )
                ) {

                    this.cerrarPanel();

                }

            },
            true
        );

    }


    // =================================================
    // OBSERVER
    // =================================================

    configurarObserver() {

        if (
            this.observer
        ) {

            return;

        }


        this.observer =
            new MutationObserver(
                () => {

                    const anterior =
                        this.campana;


                    this.buscarCampana();


                    if (
                        anterior !==
                        this.campana
                    ) {

                        this.pintarBadge();

                    }

                }
            );


        this.observer.observe(
            document.body,
            {

                childList:
                    true,

                subtree:
                    true

            }
        );

    }


    // =================================================
    // BUSCAR CAMPANA
    // =================================================

    buscarCampana() {

        const selectores = [

            "#notificacionesButton",

            "#notificationsButton",

            "#notificationButton",

            "#notificationBtn",

            "#notificationsBtn",

            ".notificaciones-button",

            ".notifications-button",

            ".notification-button",

            ".notification-btn",

            ".notifications-btn",

            ".inicio-notifications",

            ".inicio-notification-button",

            "[data-notificaciones]",

            "[data-notifications]",

            "[aria-label*='notific' i]",

            "[title*='notific' i]",

            "[id*='notific' i]",

            "[class*='notific' i]"

        ];


        let encontrada =
            null;


        for (
            const selector
            of selectores
        ) {

            const candidatos =
                [
                    ...document.querySelectorAll(
                        selector
                    )
                ];


            encontrada =
                candidatos.find(
                    elemento =>
                        elemento.id !==
                        "gc-notifications-panel"
                        &&
                        !elemento.closest(
                            "#gc-notifications-panel"
                        )
                )
                ||
                null;


            if (
                encontrada
            ) {

                break;

            }

        }


        // =============================================
        // BUSCAR POR EMOJI 🔔
        // =============================================

        if (
            !encontrada
        ) {

            const candidatos =
                [
                    ...document.querySelectorAll(
                        "button, a, span, div"
                    )
                ];


            encontrada =
                candidatos.find(
                    elemento => {

                        if (
                            elemento.closest(
                                "#gc-notifications-panel"
                            )
                        ) {

                            return false;

                        }


                        const texto =
                            String(
                                elemento.textContent
                                ||
                                ""
                            )
                                .trim();


                        return (
                            texto ===
                            "🔔"
                            ||
                            texto ===
                            "🔔️"
                        );

                    }
                )
                ||
                null;

        }


        // =============================================
        // SUBIR AL ELEMENTO CLICABLE
        // =============================================

        if (
            encontrada
        ) {

            const clicable =

                encontrada.matches(
                    "button, a, [role='button']"
                )

                    ? encontrada

                    : encontrada.closest(
                        "button, a, [role='button']"
                    )
                    ||
                    encontrada;


            this.campana =
                clicable;


            this.campana.setAttribute(
                "data-gc-notifications-trigger",
                "1"
            );


            this.campana.setAttribute(
                "aria-label",
                "Notificaciones"
            );


            this.campana.classList.add(
                "gc-notifications-trigger"
            );


            return this.campana;

        }


        // =============================================
        // FALLBACK:
        // CREAR CAMPANA PROPIA
        // =============================================

        let fallback =
            document.getElementById(
                "gcNotificationsFallback"
            );


        if (
            !fallback
        ) {

            fallback =
                document.createElement(
                    "button"
                );


            fallback.id =
                "gcNotificationsFallback";


            fallback.type =
                "button";


            fallback.className =
                "gc-notifications-floating gc-notifications-trigger";


            fallback.setAttribute(
                "data-gc-notifications-trigger",
                "1"
            );


            fallback.setAttribute(
                "aria-label",
                "Notificaciones"
            );


            fallback.innerHTML =
                `<span aria-hidden="true">🔔</span>`;


            document.body.appendChild(
                fallback
            );

        }


        this.campana =
            fallback;


        return fallback;

    }


    // =================================================
    // ACTUALIZACIÓN
    // =================================================

    iniciarActualizacion() {

        if (
            this.intervalo
        ) {

            return;

        }


        this.intervalo =
            setInterval(
                () => {

                    if (
                        document.visibilityState ===
                        "visible"
                    ) {

                        this.actualizar();

                    }

                },
                INTERVALO_ACTUALIZACION
            );


        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    this.buscarCampana();

                    this.actualizar();

                }

            }
        );

    }


    // =================================================
    // ACTUALIZAR
    // =================================================

    actualizar() {

        try {

            this.notificaciones =
                this.service
                    .obtenerTodas();

        }

        catch (
            error
        ) {

            console.error(
                "GestaCamps: error calculando notificaciones.",
                error
            );


            this.notificaciones =
                [];

        }


        this.buscarCampana();


        this.pintarBadge();


        if (
            this.panelAbierto
        ) {

            this.pintarContenidoPanel();

        }

    }


    // =================================================
    // VISTAS
    // =================================================

    obtenerVistas() {

        try {

            const texto =
                localStorage.getItem(
                    CLAVE_VISTAS
                );


            if (
                !texto
            ) {

                return [];

            }


            const datos =
                JSON.parse(
                    texto
                );


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch (
            error
        ) {

            return [];

        }

    }


    // =================================================
    // NO VISTAS
    // =================================================

    obtenerNoVistas() {

        const vistas =
            new Set(
                this.obtenerVistas()
            );


        return this.notificaciones
            .filter(
                notificacion =>
                    !vistas.has(
                        notificacion.id
                    )
            );

    }


    // =================================================
    // MARCAR COMO VISTAS
    // =================================================

    marcarActualesComoVistas() {

        try {

            localStorage.setItem(

                CLAVE_VISTAS,

                JSON.stringify(

                    this.notificaciones
                        .map(
                            notificacion =>
                                notificacion.id
                        )

                )

            );

        }

        catch (
            error
        ) {

            console.warn(
                "GestaCamps: no se pudieron guardar las notificaciones vistas.",
                error
            );

        }


        this.pintarBadge();

    }


    // =================================================
    // BADGE
    // =================================================

    pintarBadge() {

        const campana =
            this.buscarCampana();


        if (
            !campana
        ) {

            return;

        }


        let badge =
            campana.querySelector(
                ".gc-notifications-badge"
            );


        const cantidad =
            this.obtenerNoVistas()
                .length;


        if (
            cantidad <=
            0
        ) {

            badge?.remove();


            campana.classList.remove(
                "gc-notifications-has-alerts"
            );


            return;

        }


        if (
            !badge
        ) {

            badge =
                document.createElement(
                    "span"
                );


            badge.className =
                "gc-notifications-badge";


            campana.appendChild(
                badge
            );

        }


        badge.textContent =

            cantidad >
            99

                ? "99+"

                : String(
                    cantidad
                );


        campana.classList.add(
            "gc-notifications-has-alerts"
        );

    }


    // =================================================
    // TOGGLE
    // =================================================

    togglePanel() {

        if (
            this.panelAbierto
        ) {

            this.cerrarPanel();

        }

        else {

            this.abrirPanel();

        }

    }


    // =================================================
    // ABRIR
    // =================================================

    abrirPanel() {

        this.actualizar();


        let panel =
            document.getElementById(
                "gc-notifications-panel"
            );


        if (
            !panel
        ) {

            panel =
                document.createElement(
                    "aside"
                );


            panel.id =
                "gc-notifications-panel";


            panel.className =
                "gc-notifications-panel";


            document.body.appendChild(
                panel
            );

        }


        this.panelAbierto =
            true;


        panel.classList.add(
            "open"
        );


        this.pintarContenidoPanel();


        this.marcarActualesComoVistas();

    }


    // =================================================
    // CERRAR
    // =================================================

    cerrarPanel() {

        document
            .getElementById(
                "gc-notifications-panel"
            )
            ?.classList
            .remove(
                "open"
            );


        this.panelAbierto =
            false;

    }


    // =================================================
    // CONTENIDO
    // =================================================

    pintarContenidoPanel() {

        const panel =
            document.getElementById(
                "gc-notifications-panel"
            );


        if (
            !panel
        ) {

            return;

        }


        const total =
            this.notificaciones.length;


        panel.innerHTML = `

            <div class="gc-notifications-header">

                <div>

                    <span>
                        CENTRO DE AVISOS
                    </span>

                    <h3>
                        Notificaciones
                    </h3>

                    <p>
                        Lo que necesita tu atención ahora.
                    </p>

                </div>


                <button
                    id="gcCerrarNotificaciones"
                    class="gc-notifications-close"
                    type="button"
                    aria-label="Cerrar"
                >
                    ×
                </button>

            </div>


            <div class="gc-notifications-summary">

                <span>
                    ${total}
                </span>

                <div>

                    <strong>

                        ${
                            total === 1
                                ? "aviso activo"
                                : "avisos activos"
                        }

                    </strong>

                    <small>
                        Se actualizan automáticamente
                    </small>

                </div>

            </div>


            <div class="gc-notifications-list">

                ${
                    total === 0

                        ? `

                            <div class="gc-notifications-empty">

                                <span>
                                    ✓
                                </span>

                                <strong>
                                    Todo bajo control
                                </strong>

                                <p>
                                    Ahora mismo no hay avisos que requieran tu atención.
                                </p>

                            </div>

                        `

                        : this.notificaciones
                            .map(
                                notificacion =>
                                    this.crearNotificacion(
                                        notificacion
                                    )
                            )
                            .join("")
                }

            </div>

        `;


        panel
            .querySelector(
                "#gcCerrarNotificaciones"
            )
            ?.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    this.cerrarPanel();

                }
            );


        panel
            .querySelectorAll(
                ".gc-notification-item"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            const pagina =
                                boton.dataset.pagina;


                            this.cerrarPanel();


                            if (
                                pagina
                                &&
                                typeof this.navegarA ===
                                "function"
                            ) {

                                this.navegarA(
                                    pagina
                                );

                            }

                        }
                    );

                }
            );

    }


    // =================================================
    // TARJETA
    // =================================================

    crearNotificacion(
        notificacion
    ) {

        return `

            <button
                class="
                    gc-notification-item
                    gc-notification-${escaparHTML(
                        notificacion.prioridad
                    )}
                "
                data-pagina="${escaparHTML(
                    notificacion.pagina
                )}"
                type="button"
            >

                <span class="gc-notification-icon">

                    ${notificacion.icono}

                </span>


                <span class="gc-notification-content">

                    <span class="gc-notification-kicker">

                        ${this.obtenerEtiquetaTipo(
                            notificacion.tipo
                        )}

                    </span>


                    <strong>

                        ${escaparHTML(
                            notificacion.titulo
                        )}

                    </strong>


                    <span class="gc-notification-description">

                        ${escaparHTML(
                            notificacion.descripcion
                        )}

                    </span>


                    ${
                        notificacion.detalle

                            ? `

                                <small>

                                    ${escaparHTML(
                                        notificacion.detalle
                                    )}

                                </small>

                            `

                            : ""
                    }

                </span>


                <span class="gc-notification-arrow">
                    →
                </span>

            </button>

        `;

    }


    // =================================================
    // TIPO
    // =================================================

    obtenerEtiquetaTipo(
        tipo
    ) {

        const etiquetas = {

            trabajo:
                "TRABAJOS",

            incidencia:
                "INCIDENCIAS",

            maquinaria:
                "MAQUINARIA",

            facturacion:
                "COBROS",

            gasto:
                "PAGOS"

        };


        return (
            etiquetas[
                tipo
            ]
            ||
            "AVISO"
        );

    }


    // =================================================
    // ESTILOS
    // =================================================

    insertarEstilos() {

        if (
            document.getElementById(
                "gc-notifications-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "gc-notifications-styles";


        style.textContent = `

            /* =============================================
               CAMPANA
            ============================================= */

            .gc-notifications-trigger {

                position:
                    relative
                    !important;

                overflow:
                    visible
                    !important;

                cursor:
                    pointer
                    !important;

                pointer-events:
                    auto
                    !important;

            }


            .gc-notifications-floating {

                position:
                    fixed
                    !important;

                top:
                    18px;

                right:
                    80px;

                z-index:
                    8900;

                display:
                    grid;

                place-items:
                    center;

                width:
                    38px;

                height:
                    38px;

                padding:
                    0;

                border:
                    1px solid
                    rgba(
                        25,
                        74,
                        53,
                        0.14
                    );

                border-radius:
                    50%;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.96
                    );

                color:
                    #214a38;

                font-size:
                    16px;

                cursor:
                    pointer;

                box-shadow:
                    0 5px 16px
                    rgba(
                        20,
                        60,
                        40,
                        0.08
                    );

            }


            .gc-notifications-badge {

                position:
                    absolute;

                top:
                    -6px;

                right:
                    -7px;

                z-index:
                    4;

                display:
                    grid;

                place-items:
                    center;

                min-width:
                    18px;

                height:
                    18px;

                box-sizing:
                    border-box;

                padding:
                    0 4px;

                border:
                    2px solid
                    #f7f8f5;

                border-radius:
                    999px;

                background:
                    #c74638;

                color:
                    #ffffff;

                font-family:
                    Arial,
                    sans-serif;

                font-size:
                    8px;

                font-weight:
                    800;

                line-height:
                    1;

                pointer-events:
                    none;

            }


            /* =============================================
               PANEL
            ============================================= */

            .gc-notifications-panel {

                position:
                    fixed;

                top:
                    76px;

                right:
                    24px;

                z-index:
                    10000;

                width:
                    min(
                        390px,
                        calc(
                            100vw - 32px
                        )
                    );

                max-height:
                    calc(
                        100vh - 100px
                    );

                display:
                    flex;

                flex-direction:
                    column;

                box-sizing:
                    border-box;

                border:
                    1px solid
                    rgba(
                        27,
                        73,
                        52,
                        0.13
                    );

                border-radius:
                    20px;

                background:
                    #fbfcf9;

                box-shadow:
                    0 24px 65px
                    rgba(
                        15,
                        47,
                        33,
                        0.22
                    );

                overflow:
                    hidden;

                opacity:
                    0;

                visibility:
                    hidden;

                pointer-events:
                    none;

                transform:
                    translateY(
                        -10px
                    );

                transition:
                    opacity 0.18s ease,
                    transform 0.18s ease,
                    visibility 0.18s ease;

            }


            .gc-notifications-panel.open {

                opacity:
                    1;

                visibility:
                    visible;

                pointer-events:
                    auto;

                transform:
                    translateY(
                        0
                    );

            }


            /* =============================================
               CABECERA
            ============================================= */

            .gc-notifications-header {

                display:
                    flex;

                align-items:
                    flex-start;

                justify-content:
                    space-between;

                gap:
                    16px;

                padding:
                    20px;

                border-bottom:
                    1px solid
                    #e5ece7;

                background:
                    #ffffff;

            }


            .gc-notifications-header > div {

                min-width:
                    0;

            }


            .gc-notifications-header > div > span {

                display:
                    block;

                margin-bottom:
                    4px;

                color:
                    #267250;

                font-size:
                    8px;

                font-weight:
                    800;

                letter-spacing:
                    0.1em;

            }


            .gc-notifications-header h3 {

                margin:
                    0;

                color:
                    #173d2c;

                font-family:
                    Georgia,
                    "Times New Roman",
                    serif;

                font-size:
                    25px;

                line-height:
                    1.05;

            }


            .gc-notifications-header p {

                margin:
                    5px 0 0;

                color:
                    #718078;

                font-size:
                    10px;

            }


            .gc-notifications-close {

                display:
                    grid;

                place-items:
                    center;

                width:
                    32px;

                height:
                    32px;

                flex:
                    0 0 32px;

                padding:
                    0;

                border:
                    1px solid
                    #dfe7e2;

                border-radius:
                    50%;

                background:
                    #f5f8f6;

                color:
                    #335543;

                font-size:
                    20px;

                cursor:
                    pointer;

            }


            /* =============================================
               RESUMEN
            ============================================= */

            .gc-notifications-summary {

                display:
                    flex;

                align-items:
                    center;

                gap:
                    11px;

                margin:
                    13px 14px 4px;

                padding:
                    11px 12px;

                border-radius:
                    13px;

                background:
                    #eaf4ee;

            }


            .gc-notifications-summary > span {

                display:
                    grid;

                place-items:
                    center;

                width:
                    36px;

                height:
                    36px;

                flex:
                    0 0 36px;

                border-radius:
                    10px;

                background:
                    #d9ede2;

                color:
                    #176443;

                font-family:
                    Georgia,
                    serif;

                font-size:
                    17px;

                font-weight:
                    700;

            }


            .gc-notifications-summary strong,
            .gc-notifications-summary small {

                display:
                    block;

            }


            .gc-notifications-summary strong {

                color:
                    #1a4834;

                font-size:
                    11px;

            }


            .gc-notifications-summary small {

                margin-top:
                    2px;

                color:
                    #6d7c74;

                font-size:
                    9px;

            }


            /* =============================================
               LISTA
            ============================================= */

            .gc-notifications-list {

                display:
                    grid;

                gap:
                    7px;

                padding:
                    9px 14px 14px;

                overflow-y:
                    auto;

                overscroll-behavior:
                    contain;

            }


            .gc-notification-item {

                display:
                    grid;

                grid-template-columns:
                    40px
                    minmax(
                        0,
                        1fr
                    )
                    20px;

                align-items:
                    center;

                gap:
                    10px;

                width:
                    100%;

                box-sizing:
                    border-box;

                padding:
                    11px;

                border:
                    1px solid
                    #e1e9e4;

                border-radius:
                    13px;

                background:
                    #ffffff;

                color:
                    inherit;

                text-align:
                    left;

                cursor:
                    pointer;

                appearance:
                    none;

                -webkit-appearance:
                    none;

            }


            .gc-notification-icon {

                display:
                    grid;

                place-items:
                    center;

                width:
                    40px;

                height:
                    40px;

                border-radius:
                    11px;

                background:
                    #edf5f0;

                font-size:
                    17px;

            }


            .gc-notification-alta
            .gc-notification-icon {

                background:
                    #fff0dd;

            }


            .gc-notification-critica {

                border-color:
                    #efd0ca;

                background:
                    #fffafa;

            }


            .gc-notification-critica
            .gc-notification-icon {

                background:
                    #fce7e3;

            }


            .gc-notification-content {

                display:
                    block;

                min-width:
                    0;

            }


            .gc-notification-kicker {

                display:
                    block;

                margin-bottom:
                    2px;

                color:
                    #628071;

                font-size:
                    7px;

                font-weight:
                    800;

                letter-spacing:
                    0.09em;

            }


            .gc-notification-content strong {

                display:
                    block;

                overflow:
                    hidden;

                color:
                    #183b2d;

                font-size:
                    11px;

                text-overflow:
                    ellipsis;

                white-space:
                    nowrap;

            }


            .gc-notification-description {

                display:
                    block;

                margin-top:
                    3px;

                overflow:
                    hidden;

                color:
                    #596c62;

                font-size:
                    9px;

                text-overflow:
                    ellipsis;

                white-space:
                    nowrap;

            }


            .gc-notification-content small {

                display:
                    block;

                margin-top:
                    3px;

                color:
                    #8a968f;

                font-size:
                    8px;

            }


            .gc-notification-arrow {

                color:
                    #5c806d;

                font-size:
                    14px;

            }


            /* =============================================
               VACÍO
            ============================================= */

            .gc-notifications-empty {

                padding:
                    30px 18px;

                text-align:
                    center;

            }


            .gc-notifications-empty > span {

                display:
                    grid;

                place-items:
                    center;

                width:
                    46px;

                height:
                    46px;

                margin:
                    0 auto 10px;

                border-radius:
                    50%;

                background:
                    #e5f4eb;

                color:
                    #258452;

                font-size:
                    18px;

                font-weight:
                    800;

            }


            .gc-notifications-empty strong {

                display:
                    block;

                color:
                    #173f2e;

                font-size:
                    13px;

            }


            .gc-notifications-empty p {

                max-width:
                    240px;

                margin:
                    5px auto 0;

                color:
                    #75827b;

                font-size:
                    10px;

                line-height:
                    1.45;

            }


            /* =============================================
               MÓVIL
            ============================================= */

            @media (
                max-width:
                760px
            ) {

                .gc-notifications-floating {

                    top:
                        calc(
                            14px
                            +
                            env(
                                safe-area-inset-top,
                                0px
                            )
                        );

                    right:
                        14px;

                }


                .gc-notifications-panel {

                    top:
                        auto;

                    right:
                        8px;

                    bottom:
                        calc(
                            8px
                            +
                            env(
                                safe-area-inset-bottom,
                                0px
                            )
                        );

                    left:
                        8px;

                    width:
                        auto;

                    max-height:
                        76vh;

                    border-radius:
                        20px;

                    transform:
                        translateY(
                            18px
                        );

                }


                .gc-notifications-panel.open {

                    transform:
                        translateY(
                            0
                        );

                }


                .gc-notifications-header {

                    padding:
                        17px;

                }


                .gc-notifications-header h3 {

                    font-size:
                        22px;

                }


                .gc-notification-item {

                    min-height:
                        64px;

                }

            }


            @media (
                max-width:
                360px
            ) {

                .gc-notifications-panel {

                    right:
                        5px;

                    left:
                        5px;

                    bottom:
                        calc(
                            5px
                            +
                            env(
                                safe-area-inset-bottom,
                                0px
                            )
                        );

                }


                .gc-notifications-header {

                    padding:
                        15px;

                }


                .gc-notifications-summary {

                    margin:
                        10px 11px 4px;

                }


                .gc-notifications-list {

                    padding:
                        8px 11px 11px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}