import { StorageService } from "./storage.js";


export class InicioView {

    constructor(
        mainContent,
        fincaService,
        trabajoService,
        produccionService,
        explotacionService
    ) {

        this.mainContent = mainContent;
        this.fincaService = fincaService;
        this.trabajoService = trabajoService;
        this.produccionService = produccionService;
        this.explotacionService = explotacionService;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const fincas =
            this.obtenerLista(
                this.fincaService
            );


        const trabajos =
            this.obtenerLista(
                this.trabajoService
            );


        const producciones =
            this.obtenerLista(
                this.produccionService
            );


        const facturas =
            this.obtenerFacturas();


        const gastos =
            this.obtenerGastos();


        const movimientos =
            this.obtenerMovimientos();


        const albaranes =
            this.obtenerAlbaranes();


        const explotacion =
            this.obtenerExplotacion();


        // =================================================
        // USUARIO / EXPLOTACIÓN
        // =================================================

        const usuario =
            explotacion.nombreUsuario
            ||
            explotacion.usuario
            ||
            "Usuario";


        const nombreExplotacion =
            explotacion.nombre
            ||
            explotacion.nombreExplotacion
            ||
            "Mi explotación";


        const inicialUsuario =
            String(usuario)
                .trim()
                .charAt(0)
                .toUpperCase()
            ||
            "U";


        // =================================================
        // TRABAJOS
        // =================================================

        const pendientes =
            trabajos.filter(
                trabajo => {

                    const estado =
                        this.normalizar(
                            trabajo.estado
                        );

                    return (
                        estado !== "completada"
                        &&
                        estado !== "completado"
                    );

                }
            );


        const trabajosHoy =
            this.obtenerTrabajosHoy(
                trabajos
            );


        // =================================================
        // PRODUCCIÓN
        // =================================================

        const producido =
            this.obtenerProduccionTotal(
                producciones
            );


        const reservado =
            this.obtenerProduccionReservada(
                albaranes
            );


        const entregado =
            this.obtenerProduccionEntregada(
                albaranes
            );


        const disponible =
            Math.max(
                0,
                producido
                -
                reservado
                -
                entregado
            );


        // =================================================
        // FACTURACIÓN
        // =================================================

        const facturasActivas =
            facturas.filter(
                factura =>
                    this.normalizar(
                        factura.estado
                    )
                    !==
                    "anulada"
            );


        const facturasParciales =
            facturasActivas.filter(
                factura =>
                    this.normalizar(
                        factura.estado
                    )
                    ===
                    "parcialmente cobrada"
            );


        const facturasPendientes =
            facturasActivas.filter(
                factura =>
                    this.normalizar(
                        factura.estado
                    )
                    ===
                    "pendiente"
            );


        const totalFacturado =
            facturasActivas.reduce(
                (
                    total,
                    factura
                ) =>
                    total
                    +
                    this.obtenerTotalFactura(
                        factura
                    ),
                0
            );


        // =================================================
        // COBROS
        // =================================================

        const totalCobrado =
            movimientos
                .filter(
                    movimiento =>
                        this.normalizar(
                            movimiento.tipo
                        )
                        ===
                        "cobro"
                )
                .reduce(
                    (
                        total,
                        movimiento
                    ) =>
                        total
                        +
                        Number(
                            movimiento.importe
                            ||
                            0
                        ),
                    0
                );


        const pendienteCobro =
            Math.max(
                0,
                totalFacturado
                -
                totalCobrado
            );


        // =================================================
        // PAGOS
        // =================================================

        const totalGastos =
            gastos.reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    Number(
                        gasto.importe
                        ||
                        0
                    ),
                0
            );


        const totalPagado =
            movimientos
                .filter(
                    movimiento =>
                        this.normalizar(
                            movimiento.tipo
                        )
                        ===
                        "pago"
                )
                .reduce(
                    (
                        total,
                        movimiento
                    ) =>
                        total
                        +
                        Number(
                            movimiento.importe
                            ||
                            0
                        ),
                    0
                );


        const pendientePago =
            Math.max(
                0,
                totalGastos
                -
                totalPagado
            );


        const cajaReal =
            totalCobrado
            -
            totalPagado;


        // =================================================
        // ACTIVIDAD
        // =================================================

        const actividad =
            this.obtenerActividadReciente(
                trabajos,
                movimientos,
                facturas,
                gastos
            );


        // =================================================
        // HTML
        // =================================================

        this.mainContent.innerHTML = `

            <div class="inicio-page">

                <!-- ==========================================
                     CABECERA SUPERIOR
                =========================================== -->

                <div class="inicio-toolbar">

                    <div class="inicio-search">

                        <span class="inicio-search-icon">
                            ⌕
                        </span>

                        <input
                            id="inicioBuscadorRapido"
                            type="text"
                            placeholder="Buscar en GestaCamps..."
                            autocomplete="off"
                        >

                    </div>


                    <div class="inicio-toolbar-actions">

                        <button
                            class="inicio-toolbar-icon"
                            type="button"
                            aria-label="Notificaciones"
                        >
                            🔔
                            <span class="inicio-notification-dot"></span>
                        </button>

                        <button
                            class="inicio-toolbar-icon"
                            type="button"
                            aria-label="Ayuda"
                        >
                            ?
                        </button>

                        <div class="inicio-user-pill">

                            <span class="inicio-user-avatar">
                                ${this.escapar(
                                    inicialUsuario
                                )}
                            </span>

                            <strong>
                                ${this.escapar(
                                    usuario
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="inicio-hero-layout">

                    <div class="inicio-welcome">

                        <p class="inicio-eyebrow">
                            ${this.obtenerSaludo()}, ${this.escapar(usuario)} 👋
                        </p>

                        <h1>
                            Tu campo
                            <span>en tus manos.</span>
                        </h1>

                        <p class="inicio-welcome-text">
                            Gestiona, produce y haz crecer
                            ${this.escapar(nombreExplotacion)}
                            con GestaCamps.
                        </p>

                    </div>


                    <div class="inicio-hero-photo">

                        <div class="inicio-campaign-pill">
                            🌿 ${this.escapar(nombreExplotacion)}
                        </div>

                        <div class="inicio-hero-overlay">

                            <span>
                                Gestión agrícola inteligente
                            </span>

                            <strong>
                                Tu campo,<br>
                                nuestro compromiso
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs PRINCIPALES
                =========================================== -->

                <section class="inicio-main-kpis">

                    ${this.crearKpiPrincipal(
                        "🌿",
                        "Fincas activas",
                        this.formatearNumero(
                            fincas.length
                        ),
                        "+0%",
                        "green",
                        "65,72 78,68 91,70 104,53 117,58 130,42"
                    )}


                    ${this.crearKpiPrincipal(
                        "🚜",
                        "Tareas pendientes",
                        this.formatearNumero(
                            pendientes.length
                        ),
                        pendientes.length > 0
                            ? "Pendientes"
                            : "Al día",
                        pendientes.length > 0
                            ? "orange"
                            : "green",
                        "65,70 78,63 91,66 104,55 117,59 130,46"
                    )}


                    ${this.crearKpiPrincipal(
                        "📦",
                        "Producción disponible",
                        `${this.formatearNumero(
                            disponible
                        )} kg`,
                        "+0%",
                        "orange",
                        "65,72 78,67 91,72 104,60 117,64 130,50"
                    )}


                    ${this.crearKpiPrincipal(
                        "🏦",
                        "Caja real",
                        this.formatearDinero(
                            cajaReal
                        ),
                        "+0%",
                        "purple",
                        "65,72 78,68 91,72 104,56 117,60 130,45"
                    )}

                </section>


                <!-- ==========================================
                     RESUMEN CENTRAL
                =========================================== -->

                <section class="inicio-summary-grid">


                    <!-- FINANZAS -->

                    <article class="inicio-summary-card">

                        <div class="inicio-card-heading">

                            <div>

                                <h2>
                                    Situación financiera
                                </h2>

                                <p>
                                    Cobros y pagos reales de la explotación
                                </p>

                            </div>

                            <span class="inicio-details-link">
                                Resumen
                                →
                            </span>

                        </div>


                        <div class="inicio-mini-grid">

                            ${this.crearMiniKpi(
                                "📥",
                                "Cobrado",
                                this.formatearDinero(
                                    totalCobrado
                                ),
                                "green"
                            )}

                            ${this.crearMiniKpi(
                                "🕒",
                                "Pendiente de cobro",
                                this.formatearDinero(
                                    pendienteCobro
                                ),
                                "orange"
                            )}

                            ${this.crearMiniKpi(
                                "📤",
                                "Pagado",
                                this.formatearDinero(
                                    totalPagado
                                ),
                                "rose"
                            )}

                            ${this.crearMiniKpi(
                                "⌛",
                                "Pendiente de pago",
                                this.formatearDinero(
                                    pendientePago
                                ),
                                "blue"
                            )}

                        </div>

                    </article>


                    <!-- PRODUCCIÓN -->

                    <article class="inicio-summary-card">

                        <div class="inicio-card-heading">

                            <div>

                                <h2>
                                    Producción
                                </h2>

                                <p>
                                    Estado actual del producto registrado
                                </p>

                            </div>

                            <span class="inicio-details-link">
                                Resumen
                                →
                            </span>

                        </div>


                        <div class="inicio-mini-grid">

                            ${this.crearMiniKpi(
                                "🍎",
                                "Producido",
                                `${this.formatearNumero(
                                    producido
                                )} kg`,
                                "green"
                            )}

                            ${this.crearMiniKpi(
                                "🕒",
                                "Reservado",
                                `${this.formatearNumero(
                                    reservado
                                )} kg`,
                                "blue"
                            )}

                            ${this.crearMiniKpi(
                                "🚚",
                                "Entregado",
                                `${this.formatearNumero(
                                    entregado
                                )} kg`,
                                "orange"
                            )}

                            ${this.crearMiniKpi(
                                "📦",
                                "Disponible",
                                `${this.formatearNumero(
                                    disponible
                                )} kg`,
                                "green"
                            )}

                        </div>

                    </article>

                </section>


                <!-- ==========================================
                     AVISOS
                =========================================== -->

                <section class="inicio-alert-section">

                    <div class="inicio-section-heading">

                        <h2>
                            Avisos
                        </h2>

                        <p>
                            Información que puede necesitar tu atención
                        </p>

                    </div>


                    <div class="inicio-alerts">

                        ${this.crearAlertas({

                            facturasParciales,
                            facturasPendientes,
                            pendienteCobro,
                            pendientePago,
                            disponible,
                            pendientes

                        })}

                    </div>

                </section>


                <!-- ==========================================
                     PARTE INFERIOR
                =========================================== -->

                <section class="inicio-bottom-grid">


                    <!-- TAREAS -->

                    <article class="inicio-bottom-card">

                        <div class="inicio-card-heading">

                            <div>

                                <h2>
                                    Tareas de hoy
                                </h2>

                                <p>
                                    Planificación diaria
                                </p>

                            </div>

                        </div>


                        ${
                            trabajosHoy.length === 0

                                ? this.crearEstadoTareasVacio()

                                : `

                                    <div class="inicio-task-list">

                                        ${trabajosHoy
                                            .slice(
                                                0,
                                                5
                                            )
                                            .map(
                                                trabajo =>
                                                    this.crearTrabajoHoy(
                                                        trabajo
                                                    )
                                            )
                                            .join("")}

                                    </div>

                                `
                        }

                    </article>


                    <!-- ACTIVIDAD -->

                    <article class="inicio-bottom-card">

                        <div class="inicio-card-heading">

                            <div>

                                <h2>
                                    Actividad reciente
                                </h2>

                                <p>
                                    Últimos movimientos en GestaCamps
                                </p>

                            </div>

                            <span class="inicio-details-link">
                                Últimos
                                →
                            </span>

                        </div>


                        ${
                            actividad.length === 0

                                ? `

                                    <div class="inicio-empty-simple">

                                        <span>
                                            🌱
                                        </span>

                                        <p>
                                            Todavía no hay actividad reciente.
                                        </p>

                                    </div>

                                `

                                : `

                                    <div class="inicio-activity-list">

                                        ${actividad
                                            .slice(
                                                0,
                                                5
                                            )
                                            .map(
                                                item =>
                                                    this.crearActividad(
                                                        item
                                                    )
                                            )
                                            .join("")}

                                    </div>

                                `
                        }

                    </article>

                </section>

            </div>

        `;


        this.configurarBuscadorRapido();

    }


    // =====================================================
    // BUSCADOR SUPERIOR
    // =====================================================

    configurarBuscadorRapido() {

        const input =
            document.getElementById(
                "inicioBuscadorRapido"
            );


        if (
            !input
        ) {

            return;

        }


        input.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key !== "Enter"
                ) {

                    return;

                }


                const termino =
                    input.value.trim();


                if (
                    termino.length < 2
                ) {

                    return;

                }


                const enlace =
                    document.querySelector(
                        '[data-view="buscadorGlobal"], [data-view="buscador-global"]'
                    );


                if (
                    enlace
                ) {

                    enlace.click();

                }

            }
        );

    }


    // =====================================================
    // KPI PRINCIPAL
    // =====================================================

    crearKpiPrincipal(
        icono,
        titulo,
        valor,
        tendencia,
        tono,
        puntos
    ) {

        return `

            <article class="inicio-kpi inicio-kpi-${tono}">

                <div class="inicio-kpi-top">

                    <span class="inicio-kpi-icon">
                        ${icono}
                    </span>

                    <span class="inicio-kpi-trend">
                        ↗ ${this.escapar(
                            tendencia
                        )}
                    </span>

                </div>


                <div class="inicio-kpi-content">

                    <span>
                        ${this.escapar(
                            titulo
                        )}
                    </span>

                    <strong>
                        ${this.escapar(
                            valor
                        )}
                    </strong>

                </div>


                <svg
                    class="inicio-sparkline"
                    viewBox="0 0 140 82"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >

                    <defs>

                        <linearGradient
                            id="spark-${tono}"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="0%"
                                stop-color="currentColor"
                                stop-opacity=".22"
                            />

                            <stop
                                offset="100%"
                                stop-color="currentColor"
                                stop-opacity="0"
                            />

                        </linearGradient>

                    </defs>


                    <polygon
                        points="0,82 ${puntos} 140,82"
                        fill="url(#spark-${tono})"
                    />

                    <polyline
                        points="${puntos}"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />

                </svg>

            </article>

        `;

    }


    // =====================================================
    // KPI PEQUEÑO
    // =====================================================

    crearMiniKpi(
        icono,
        titulo,
        valor,
        tono
    ) {

        return `

            <div class="inicio-mini-kpi inicio-mini-${tono}">

                <div class="inicio-mini-header">

                    <span class="inicio-mini-icon">
                        ${icono}
                    </span>

                    <span>
                        ${this.escapar(
                            titulo
                        )}
                    </span>

                </div>

                <strong>
                    ${this.escapar(
                        valor
                    )}
                </strong>

                <div class="inicio-mini-wave"></div>

            </div>

        `;

    }


    // =====================================================
    // ALERTAS
    // =====================================================

    crearAlertas(
        datos
    ) {

        const alertas = [];


        if (
            datos.facturasParciales.length > 0
        ) {

            alertas.push(

                this.crearAlerta(

                    "◐",

                    `Tienes ${
                        datos.facturasParciales.length
                    } ${
                        datos.facturasParciales.length === 1
                            ? "factura parcialmente cobrada"
                            : "facturas parcialmente cobradas"
                    }.`,

                    "info"

                )

            );

        }


        if (
            datos.facturasPendientes.length > 0
        ) {

            alertas.push(

                this.crearAlerta(

                    "🕒",

                    `Tienes ${
                        datos.facturasPendientes.length
                    } ${
                        datos.facturasPendientes.length === 1
                            ? "factura pendiente de cobro"
                            : "facturas pendientes de cobro"
                    }.`,

                    "warning"

                )

            );

        }


        if (
            datos.pendienteCobro > 0
        ) {

            alertas.push(

                this.crearAlerta(

                    "📥",

                    `Quedan ${this.formatearDinero(
                        datos.pendienteCobro
                    )} pendientes de cobrar.`,

                    "warning"

                )

            );

        }


        if (
            datos.pendientePago > 0
        ) {

            alertas.push(

                this.crearAlerta(

                    "📤",

                    `Quedan ${this.formatearDinero(
                        datos.pendientePago
                    )} pendientes de pagar.`,

                    "warning"

                )

            );

        }


        if (
            datos.pendientes.length > 0
        ) {

            alertas.push(

                this.crearAlerta(

                    "🚜",

                    `Hay ${
                        datos.pendientes.length
                    } ${
                        datos.pendientes.length === 1
                            ? "tarea pendiente"
                            : "tareas pendientes"
                    }.`,

                    "neutral"

                )

            );

        }


        if (
            datos.disponible > 0
        ) {

            alertas.push(

                this.crearAlerta(

                    "📦",

                    `Tienes ${this.formatearNumero(
                        datos.disponible
                    )} kg disponibles.`,

                    "success"

                )

            );

        }


        if (
            alertas.length === 0
        ) {

            return this.crearAlerta(

                "✅",

                "No hay avisos importantes en este momento.",

                "success"

            );

        }


        return alertas.join("");

    }


    crearAlerta(
        icono,
        texto,
        tipo
    ) {

        return `

            <div class="inicio-alert inicio-alert-${tipo}">

                <span class="inicio-alert-icon">
                    ${icono}
                </span>

                <span>
                    ${this.escapar(
                        texto
                    )}
                </span>

            </div>

        `;

    }


    // =====================================================
    // ESTADO VACÍO TAREAS
    // =====================================================

    crearEstadoTareasVacio() {

        return `

            <div class="inicio-task-empty">

                <div class="inicio-task-empty-illustration">

                    <span class="inicio-empty-clipboard">
                        📋
                    </span>

                    <span class="inicio-empty-leaf">
                        🌿
                    </span>

                </div>


                <strong>
                    No hay tareas programadas
                </strong>


                <p>
                    Cuando tengas tareas asignadas para hoy,
                    aparecerán aquí.
                </p>


                <div class="inicio-landscape">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        `;

    }


    // =====================================================
    // TAREA HOY
    // =====================================================

    crearTrabajoHoy(
        trabajo
    ) {

        return `

            <div class="inicio-task">

                <span class="inicio-task-icon">
                    🚜
                </span>


                <div class="inicio-task-content">

                    <strong>
                        ${this.escapar(
                            trabajo.titulo
                            ||
                            trabajo.nombre
                            ||
                            "Trabajo"
                        )}
                    </strong>

                    <p>

                        ${this.escapar(
                            trabajo.fincaNombre
                            ||
                            "Sin finca"
                        )}

                        ${
                            trabajo.parcelaNombre

                                ? ` · ${this.escapar(
                                    trabajo.parcelaNombre
                                )}`

                                : ""
                        }

                    </p>

                </div>


                <span
                    class="
                        inicio-task-status
                        ${this.obtenerClaseEstado(
                            trabajo.estado
                        )}
                    "
                >

                    ${this.escapar(
                        trabajo.estado
                        ||
                        "Pendiente"
                    )}

                </span>

            </div>

        `;

    }


    // =====================================================
    // ACTIVIDAD
    // =====================================================

    obtenerActividadReciente(
        trabajos,
        movimientos,
        facturas,
        gastos
    ) {

        const actividad = [];


        trabajos.forEach(
            trabajo => {

                actividad.push({

                    icono:
                        "🚜",

                    titulo:
                        trabajo.titulo
                        ||
                        trabajo.nombre
                        ||
                        "Trabajo",

                    detalle:
                        trabajo.estado
                        ||
                        "Pendiente",

                    fecha:
                        trabajo.fechaCreacion
                        ||
                        trabajo.fecha
                        ||
                        trabajo.fechaTrabajo
                        ||
                        trabajo.fechaInicio
                        ||
                        ""

                });

            }
        );


        movimientos.forEach(
            movimiento => {

                actividad.push({

                    icono:
                        this.normalizar(
                            movimiento.tipo
                        )
                        ===
                        "cobro"

                            ? "💰"

                            : "💸",

                    titulo:
                        `${movimiento.tipo || "Movimiento"} · ${
                            movimiento.referencia
                            ||
                            "Movimiento"
                        }`,

                    detalle:
                        `${this.formatearDinero(
                            movimiento.importe
                        )}${
                            movimiento.tercero
                                ? ` · ${movimiento.tercero}`
                                : ""
                        }`,

                    fecha:
                        movimiento.fechaCreacion
                        ||
                        movimiento.fecha
                        ||
                        ""

                });

            }
        );


        facturas.forEach(
            factura => {

                actividad.push({

                    icono:
                        "🧾",

                    titulo:
                        factura.numero
                        ||
                        "Factura",

                    detalle:
                        `${
                            factura.estado
                            ||
                            "Pendiente"
                        } · ${this.formatearDinero(
                            this.obtenerTotalFactura(
                                factura
                            )
                        )}`,

                    fecha:
                        factura.fechaCreacion
                        ||
                        factura.fecha
                        ||
                        ""

                });

            }
        );


        gastos.forEach(
            gasto => {

                actividad.push({

                    icono:
                        "💸",

                    titulo:
                        gasto.concepto
                        ||
                        "Gasto",

                    detalle:
                        `${
                            gasto.estado
                            ||
                            "Pendiente"
                        } · ${this.formatearDinero(
                            gasto.importe
                        )}`,

                    fecha:
                        gasto.fechaCreacion
                        ||
                        gasto.fecha
                        ||
                        ""

                });

            }
        );


        return actividad.sort(
            (
                a,
                b
            ) =>
                this.obtenerTimestamp(
                    b.fecha
                )
                -
                this.obtenerTimestamp(
                    a.fecha
                )
        );

    }


    crearActividad(
        item
    ) {

        return `

            <div class="inicio-activity">

                <span class="inicio-activity-icon">
                    ${item.icono}
                </span>


                <div class="inicio-activity-content">

                    <strong>
                        ${this.escapar(
                            item.titulo
                        )}
                    </strong>

                    <p>
                        ${this.escapar(
                            item.detalle
                        )}
                    </p>

                </div>


                <span class="inicio-activity-time">
                    ${this.formatearFechaActividad(
                        item.fecha
                    )}
                </span>

            </div>

        `;

    }


    // =====================================================
    // STORAGE
    // =====================================================

    obtenerFacturas() {

        try {

            const datos =
                StorageService
                    .obtenerFacturas();

            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch {

            return [];

        }

    }


    obtenerGastos() {

        try {

            const datos =
                StorageService
                    .obtenerGastos();

            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch {

            return [];

        }

    }


    obtenerMovimientos() {

        try {

            const datos =
                StorageService
                    .obtenerCobrosPagos();

            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch {

            return [];

        }

    }


    obtenerAlbaranes() {

        try {

            const datos =
                StorageService
                    .obtenerAlbaranes();

            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch {

            return [];

        }

    }


    // =====================================================
    // PRODUCCIÓN RESERVADA
    // =====================================================

    obtenerProduccionReservada(
        albaranes
    ) {

        let total = 0;


        albaranes
            .filter(
                albaran =>
                    this.normalizar(
                        albaran.estado
                    )
                    ===
                    "pendiente"
            )
            .forEach(
                albaran => {

                    this.obtenerLineasAlbaran(
                        albaran
                    )
                        .forEach(
                            linea => {

                                if (
                                    String(
                                        linea.unidad
                                        ||
                                        "kg"
                                    )
                                    .toLowerCase()
                                    ===
                                    "kg"
                                ) {

                                    total +=
                                        Number(
                                            linea.cantidad
                                            ||
                                            0
                                        );

                                }

                            }
                        );

                }
            );


        return total;

    }


    // =====================================================
    // PRODUCCIÓN ENTREGADA
    // =====================================================

    obtenerProduccionEntregada(
        albaranes
    ) {

        let total = 0;


        albaranes
            .filter(
                albaran => {

                    const estado =
                        this.normalizar(
                            albaran.estado
                        );


                    return (
                        estado === "entregado"
                        ||
                        estado === "facturado"
                        ||
                        albaran.facturado === true
                    );

                }
            )
            .forEach(
                albaran => {

                    this.obtenerLineasAlbaran(
                        albaran
                    )
                        .forEach(
                            linea => {

                                if (
                                    String(
                                        linea.unidad
                                        ||
                                        "kg"
                                    )
                                    .toLowerCase()
                                    ===
                                    "kg"
                                ) {

                                    total +=
                                        Number(
                                            linea.cantidad
                                            ||
                                            0
                                        );

                                }

                            }
                        );

                }
            );


        return total;

    }


    obtenerLineasAlbaran(
        albaran
    ) {

        if (
            Array.isArray(
                albaran?.lineas
            )
            &&
            albaran.lineas.length > 0
        ) {

            return albaran.lineas;

        }


        if (
            albaran?.produccionId
        ) {

            return [

                {

                    produccionId:
                        albaran.produccionId,

                    cantidad:
                        albaran.cantidad,

                    unidad:
                        albaran.unidad

                }

            ];

        }


        return [];

    }


    // =====================================================
    // TOTAL FACTURA
    // =====================================================

    obtenerTotalFactura(
        factura
    ) {

        if (
            factura.total !== undefined
        ) {

            return Number(
                factura.total
                ||
                0
            );

        }


        if (
            factura.totalFactura !== undefined
        ) {

            return Number(
                factura.totalFactura
                ||
                0
            );

        }


        const base =
            Number(
                factura.baseImponible
                ??
                factura.subtotal
                ??
                factura.base
                ??
                0
            );


        const iva =
            Number(
                factura.importeIva
                ||
                0
            );


        return (
            base
            +
            iva
        );

    }


    // =====================================================
    // LISTAS DE SERVICIOS
    // =====================================================

    obtenerLista(
        servicio
    ) {

        if (
            !servicio
        ) {

            return [];

        }


        if (
            typeof servicio.obtenerTodos
            ===
            "function"
        ) {

            const datos =
                servicio.obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof servicio.obtenerTodas
            ===
            "function"
        ) {

            const datos =
                servicio.obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // EXPLOTACIÓN
    // =====================================================

    obtenerExplotacion() {

        if (
            !this.explotacionService
        ) {

            return {};

        }


        if (
            typeof this.explotacionService.obtener
            ===
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
            typeof this.explotacionService.obtenerDatos
            ===
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
    // TRABAJOS HOY
    // =====================================================

    obtenerTrabajosHoy(
        trabajos
    ) {

        if (
            this.trabajoService
            &&
            typeof this.trabajoService.obtenerDeHoy
            ===
            "function"
        ) {

            const resultado =
                this.trabajoService
                    .obtenerDeHoy();


            if (
                Array.isArray(
                    resultado
                )
            ) {

                return resultado;

            }

        }


        const fechaHoy =
            this.obtenerFechaHoy();


        return trabajos.filter(
            trabajo => {

                const fecha =
                    trabajo.fecha
                    ||
                    trabajo.fechaTrabajo
                    ||
                    trabajo.fechaInicio
                    ||
                    "";


                return (
                    String(
                        fecha
                    )
                        .substring(
                            0,
                            10
                        )
                    ===
                    fechaHoy
                );

            }
        );

    }


    // =====================================================
    // PRODUCCIÓN TOTAL
    // =====================================================

    obtenerProduccionTotal(
        producciones
    ) {

        return producciones.reduce(
            (
                total,
                produccion
            ) => {

                const cantidad =
                    Number(
                        produccion.kilos
                        ??
                        produccion.kg
                        ??
                        produccion.cantidad
                        ??
                        0
                    );


                return (
                    total
                    +
                    (
                        Number.isFinite(
                            cantidad
                        )
                            ? cantidad
                            : 0
                    )
                );

            },
            0
        );

    }


    // =====================================================
    // SALUDO
    // =====================================================

    obtenerSaludo() {

        const hora =
            new Date()
                .getHours();


        if (
            hora < 12
        ) {

            return "Buenos días";

        }


        if (
            hora < 20
        ) {

            return "Buenas tardes";

        }


        return "Buenas noches";

    }


    // =====================================================
    // FECHAS
    // =====================================================

    obtenerFechaHoy() {

        const hoy =
            new Date();


        const yyyy =
            hoy.getFullYear();


        const mm =
            String(
                hoy.getMonth()
                +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const dd =
            String(
                hoy.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return `${yyyy}-${mm}-${dd}`;

    }


    obtenerTimestamp(
        valor
    ) {

        if (
            !valor
        ) {

            return 0;

        }


        const fecha =
            new Date(
                valor
            );


        if (
            Number.isNaN(
                fecha.getTime()
            )
        ) {

            return 0;

        }


        return fecha.getTime();

    }


    formatearFechaActividad(
        valor
    ) {

        const timestamp =
            this.obtenerTimestamp(
                valor
            );


        if (
            !timestamp
        ) {

            return "";

        }


        const diferencia =
            Date.now()
            -
            timestamp;


        const minutos =
            Math.floor(
                diferencia
                /
                60000
            );


        if (
            minutos < 1
        ) {

            return "Ahora";

        }


        if (
            minutos < 60
        ) {

            return `Hace ${minutos} min`;

        }


        const horas =
            Math.floor(
                minutos
                /
                60
            );


        if (
            horas < 24
        ) {

            return `Hace ${horas} h`;

        }


        const dias =
            Math.floor(
                horas
                /
                24
            );


        if (
            dias === 1
        ) {

            return "Hace 1 día";

        }


        if (
            dias < 7
        ) {

            return `Hace ${dias} días`;

        }


        return new Date(
            timestamp
        )
            .toLocaleDateString(
                "es-ES"
            );

    }


    // =====================================================
    // ESTADO TRABAJO
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        const estadoNormalizado =
            this.normalizar(
                estado
            );


        if (
            estadoNormalizado ===
            "completada"
            ||
            estadoNormalizado ===
            "completado"
        ) {

            return "completed";

        }


        if (
            estadoNormalizado ===
            "en curso"
        ) {

            return "progress";

        }


        return "pending";

    }


    // =====================================================
    // FORMATOS
    // =====================================================

    formatearNumero(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    maximumFractionDigits: 2
                }
            );

    }


    formatearDinero(
        numero
    ) {

        return (
            Number(
                numero
                ||
                0
            )
                .toLocaleString(
                    "es-ES",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )
            +
            " €"
        );

    }


    normalizar(
        texto
    ) {

        return String(
            texto
            ||
            ""
        )
            .trim()
            .toLowerCase();

    }


    // =====================================================
    // ESCAPAR
    // =====================================================

    escapar(
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

}