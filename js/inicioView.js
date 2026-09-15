import { StorageService } from "./storage.js";

export class InicioView {

    constructor(
        mainContent,
        fincaService,
        trabajoService,
        produccionService,
        explotacionService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.trabajoService =
            trabajoService;

        this.produccionService =
            produccionService;

        this.explotacionService =
            explotacionService;

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
            "Usuario";


        const nombreExplotacion =
            explotacion.nombre
            ||
            explotacion.nombreExplotacion
            ||
            "Resumen general de tu explotación";


        // =================================================
        // TRABAJOS
        // =================================================

        const pendientes =
            trabajos.filter(
                trabajo =>
                    trabajo.estado !==
                    "Completada"
                    &&
                    trabajo.estado !==
                    "Completado"
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
        // FACTURAS
        // =================================================

        const facturasActivas =
            facturas.filter(
                factura =>
                    factura.estado !==
                    "Anulada"
            );


        const facturasParciales =
            facturasActivas.filter(
                factura =>
                    factura.estado ===
                    "Parcialmente cobrada"
            );


        const facturasPendientes =
            facturasActivas.filter(
                factura =>
                    factura.estado ===
                    "Pendiente"
            );


        // =================================================
        // COBROS
        // =================================================

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


        // =================================================
        // CAJA
        // =================================================

        const cajaReal =
            totalCobrado
            -
            totalPagado;


        // =================================================
        // ACTIVIDAD RECIENTE
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

            <header class="topbar">

                <div class="home-title-block">

                    <h2>
                        Inicio
                    </h2>

                    <p class="home-farm-name">
                        ${this.escapar(
                            nombreExplotacion
                        )}
                    </p>

                </div>


                <div class="user">
                    👤
                    ${this.escapar(
                        usuario
                    )}
                </div>

            </header>


            <!-- ==========================================
                 BIENVENIDA
            =========================================== -->

            <section class="welcome">

                <h2>
                    ${this.obtenerSaludo()} 👋
                </h2>

                <p>
                    Aquí tienes el estado actual de tu explotación.
                </p>

            </section>


            <!-- ==========================================
                 RESUMEN PRINCIPAL
            =========================================== -->

            <section class="stats">

                ${this.crearTarjeta(
                    "🌾",
                    "Fincas activas",
                    fincas.length
                )}


                ${this.crearTarjeta(
                    "🚜",
                    "Tareas pendientes",
                    pendientes.length
                )}


                ${this.crearTarjeta(
                    "📦",
                    "Producción disponible",
                    `${this.formatearNumero(
                        disponible
                    )} kg`
                )}


                ${this.crearTarjeta(
                    "🏦",
                    "Caja real",
                    this.formatearDinero(
                        cajaReal
                    )
                )}

            </section>


            <!-- ==========================================
                 FINANZAS
            =========================================== -->

            <div
                style="
                    margin-top:22px;
                    margin-bottom:10px;
                "
            >

                <h3
                    style="
                        margin:0;
                    "
                >
                    Situación financiera
                </h3>

                <p
                    style="
                        margin:4px 0 0;
                        color:#78837d;
                        font-size:13px;
                    "
                >
                    Cobros y pagos reales de la explotación
                </p>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "📥",
                    "Cobrado",
                    this.formatearDinero(
                        totalCobrado
                    )
                )}


                ${this.crearTarjeta(
                    "🕒",
                    "Pendiente de cobro",
                    this.formatearDinero(
                        pendienteCobro
                    )
                )}


                ${this.crearTarjeta(
                    "📤",
                    "Pagado",
                    this.formatearDinero(
                        totalPagado
                    )
                )}


                ${this.crearTarjeta(
                    "⏳",
                    "Pendiente de pago",
                    this.formatearDinero(
                        pendientePago
                    )
                )}

            </section>


            <!-- ==========================================
                 PRODUCCIÓN
            =========================================== -->

            <div
                style="
                    margin-top:22px;
                    margin-bottom:10px;
                "
            >

                <h3
                    style="
                        margin:0;
                    "
                >
                    Producción
                </h3>

                <p
                    style="
                        margin:4px 0 0;
                        color:#78837d;
                        font-size:13px;
                    "
                >
                    Estado actual del producto registrado
                </p>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "🍎",
                    "Producido",
                    `${this.formatearNumero(
                        producido
                    )} kg`
                )}


                ${this.crearTarjeta(
                    "🕒",
                    "Reservado",
                    `${this.formatearNumero(
                        reservado
                    )} kg`
                )}


                ${this.crearTarjeta(
                    "🚚",
                    "Entregado",
                    `${this.formatearNumero(
                        entregado
                    )} kg`
                )}


                ${this.crearTarjeta(
                    "📦",
                    "Disponible",
                    `${this.formatearNumero(
                        disponible
                    )} kg`
                )}

            </section>


            <!-- ==========================================
                 ALERTAS
            =========================================== -->

            <div
                style="
                    margin-top:22px;
                    margin-bottom:10px;
                "
            >

                <h3
                    style="
                        margin:0;
                    "
                >
                    Avisos
                </h3>

                <p
                    style="
                        margin:4px 0 0;
                        color:#78837d;
                        font-size:13px;
                    "
                >
                    Información que puede necesitar tu atención
                </p>

            </div>


            <section
                style="
                    display:grid;
                    gap:10px;
                    margin-bottom:22px;
                "
            >

                ${this.crearAlertas({
                    facturasParciales,
                    facturasPendientes,
                    pendienteCobro,
                    pendientePago,
                    disponible,
                    pendientes
                })}

            </section>


            <!-- ==========================================
                 DASHBOARD INFERIOR
            =========================================== -->

            <section class="dashboard-grid">


                <!-- TAREAS DE HOY -->

                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            Tareas de hoy
                        </h3>

                    </div>


                    ${
                        trabajosHoy.length ===
                        0

                            ? `
                                <p class="text-muted">
                                    Todavía no hay tareas para hoy.
                                </p>
                            `

                            : trabajosHoy
                                .map(
                                    trabajo =>
                                        this.crearTrabajoHoy(
                                            trabajo
                                        )
                                )
                                .join("")
                    }

                </div>


                <!-- ACTIVIDAD RECIENTE -->

                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            Actividad reciente
                        </h3>

                    </div>


                    ${
                        actividad.length ===
                        0

                            ? `
                                <p class="text-muted">
                                    Todavía no hay actividad.
                                </p>
                            `

                            : actividad
                                .slice(
                                    0,
                                    6
                                )
                                .map(
                                    item =>
                                        this.crearActividad(
                                            item
                                        )
                                )
                                .join("")
                    }

                </div>

            </section>

        `;

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        icono,
        titulo,
        valor
    ) {

        return `

            <div class="card">

                <span class="card-icon">
                    ${icono}
                </span>


                <div>

                    <p>
                        ${titulo}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // ALERTAS
    // =====================================================

    crearAlertas(datos) {

        const alertas = [];


        if (
            datos.facturasParciales.length >
            0
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
                    "#eaf1fb",
                    "#3d5d91"
                )
            );

        }


        if (
            datos.facturasPendientes.length >
            0
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
                    "#fff4dc",
                    "#855d00"
                )
            );

        }


        if (
            datos.pendienteCobro >
            0
        ) {

            alertas.push(
                this.crearAlerta(
                    "📥",
                    `Quedan ${this.formatearDinero(
                        datos.pendienteCobro
                    )} pendientes de cobrar.`,
                    "#fff4dc",
                    "#855d00"
                )
            );

        }


        if (
            datos.pendientePago >
            0
        ) {

            alertas.push(
                this.crearAlerta(
                    "📤",
                    `Quedan ${this.formatearDinero(
                        datos.pendientePago
                    )} pendientes de pagar.`,
                    "#fff4dc",
                    "#855d00"
                )
            );

        }


        if (
            datos.pendientes.length >
            0
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
                    "#edf6f1",
                    "#315f4d"
                )
            );

        }


        if (
            datos.disponible >
            0
        ) {

            alertas.push(
                this.crearAlerta(
                    "📦",
                    `Tienes ${this.formatearNumero(
                        datos.disponible
                    )} kg disponibles.`,
                    "#e8f5ed",
                    "#176044"
                )
            );

        }


        if (
            alertas.length ===
            0
        ) {

            return this.crearAlerta(
                "✅",
                "No hay avisos importantes en este momento.",
                "#e8f5ed",
                "#176044"
            );

        }


        return alertas.join("");

    }


    crearAlerta(
        icono,
        texto,
        fondo,
        color
    ) {

        return `

            <div
                style="
                    padding:12px 15px;
                    border-radius:10px;
                    background:${fondo};
                    color:${color};
                    font-size:13px;
                    font-weight:500;
                "
            >
                ${icono}
                ${this.escapar(
                    texto
                )}
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

            <div class="task">

                <div>

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
                    class="status ${this.obtenerClaseEstado(
                        trabajo.estado
                    )}"
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
                        movimiento.tipo ===
                        "Cobro"
                            ? "💰"
                            : "💸",

                    titulo:
                        `${movimiento.tipo} · ${
                            movimiento.referencia
                            ||
                            "Movimiento"
                        }`,

                    detalle:
                        `${this.formatearDinero(
                            movimiento.importe
                        )} · ${
                            movimiento.tercero
                            ||
                            ""
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
                        `${factura.estado || "Pendiente"} · ${this.formatearDinero(
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
                        `${gasto.estado || "Pendiente"} · ${this.formatearDinero(
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


        return actividad
            .sort(
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

            <div class="activity">

                <span>
                    ${item.icono}
                </span>


                <div>

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

        let total =
            0;


        albaranes
            .filter(
                albaran =>
                    albaran.estado ===
                    "Pendiente"
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

        let total =
            0;


        albaranes
            .filter(
                albaran =>
                    albaran.estado ===
                    "Entregado"
                    ||
                    albaran.estado ===
                    "Facturado"
                    ||
                    albaran.facturado ===
                    true
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
            albaran.lineas.length >
            0
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
            factura.total !==
            undefined
        ) {

            return Number(
                factura.total
                ||
                0
            );

        }


        if (
            factura.totalFactura !==
            undefined
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
            base +
            iva
        );

    }


    // =====================================================
    // OBTENER LISTA SERVICIO
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
            typeof
            servicio.obtenerTodos ===
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
            typeof
            servicio.obtenerTodas ===
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


    // =====================================================
    // TRABAJOS HOY
    // =====================================================

    obtenerTrabajosHoy(
        trabajos
    ) {

        if (
            this.trabajoService
            &&
            typeof
            this.trabajoService
                .obtenerDeHoy ===
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
            hora <
            12
        ) {

            return "Buenos días";

        }


        if (
            hora <
            20
        ) {

            return "Buenas tardes";

        }


        return "Buenas noches";

    }


    // =====================================================
    // FECHA HOY
    // =====================================================

    obtenerFechaHoy() {

        const hoy =
            new Date();


        const yyyy =
            hoy.getFullYear();


        const mm =
            String(
                hoy.getMonth() +
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


        return (
            `${yyyy}-${mm}-${dd}`
        );

    }


    // =====================================================
    // TIMESTAMP
    // =====================================================

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


    // =====================================================
    // ESTADO TRABAJO
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        const estadoNormalizado =
            String(
                estado
                ||
                ""
            )
                .toLowerCase()
                .trim();


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
                    maximumFractionDigits:
                        2
                }
            );

    }


    formatearDinero(
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
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )
            +
            " €";

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