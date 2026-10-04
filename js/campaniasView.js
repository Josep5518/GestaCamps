import { StorageService } from "./storage.js";

export class CampaniasView {

    constructor(
        mainContent,
        campaniaService,
        fincaService
    ) {

        this.mainContent =
            mainContent;

        this.campaniaService =
            campaniaService;

        this.fincaService =
            fincaService;

    }


    // =====================================================
    // COMPARAR IDS
    // =====================================================

    mismoId(
        idA,
        idB
    ) {

        if (
            idA === null
            ||
            idA === undefined
            ||
            idB === null
            ||
            idB === undefined
        ) {

            return false;

        }


        return (
            String(
                idA
            )
            ===
            String(
                idB
            )
        );

    }


    // =====================================================
    // OBTENER CAMPAÑA POR ID
    // =====================================================

    obtenerCampaniaPorId(
        id
    ) {

        const campanias =
            typeof
            this.campaniaService
                .obtenerTodas ===
            "function"

                ? this.campaniaService
                    .obtenerTodas()

                : [];


        return (
            campanias.find(
                campania =>
                    this.mismoId(
                        campania.id,
                        id
                    )
            )
            ||
            null
        );

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const campanias =
            this.campaniaService
                .obtenerTodas();


        const activas =
            this.campaniaService
                .obtenerActivas()
                .length;


        const cerradas =
            this.campaniaService
                .obtenerCerradas()
                .length;


        const fincasConCampania =
            new Set(
                campanias
                    .map(
                        campania =>
                            campania.fincaId
                    )
                    .filter(Boolean)
            ).size;


        const produccionTotal =
            campanias.reduce(
                (
                    total,
                    campania
                ) => {

                    const resumen =
                        this.obtenerResumenCampania(
                            campania
                        );


                    return (
                        total
                        +
                        Number(
                            resumen.producido
                            ||
                            0
                        )
                    );

                },
                0
            );


        this.mainContent.innerHTML = `

            <div class="campanias-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="campanias-hero">

                    <div class="campanias-hero-content">

                        <span class="campanias-eyebrow">
                            🌾 GESTIÓN AGRÍCOLA
                        </span>


                        <h1>
                            Cada campaña,
                            <span>
                                bajo control.
                            </span>
                        </h1>


                        <p>
                            Organiza cada ciclo agrícola, controla su
                            producción y conoce su rentabilidad desde
                            un único lugar.
                        </p>


                        <button
                            id="nuevaCampania"
                            class="
                                primary-button
                                campanias-hero-button
                            "
                            type="button"
                        >
                            + Nueva campaña
                        </button>

                    </div>


                    <div class="campanias-hero-image">

                        <div class="campanias-hero-badge">

                            <span>
                                Campañas activas
                            </span>

                            <strong>
                                ${activas}
                            </strong>

                        </div>


                        <div class="campanias-hero-copy">

                            <small>
                                PLANIFICA · PRODUCE · ANALIZA
                            </small>

                            <strong>
                                Una visión completa<br>
                                de cada cosecha
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats campanias-stats">

                    ${this.crearTarjeta(
                        "📅",
                        "Campañas",
                        campanias.length
                    )}

                    ${this.crearTarjeta(
                        "✅",
                        "Activas",
                        activas
                    )}

                    ${this.crearTarjeta(
                        "🍎",
                        "Producción",
                        `${this.formatearNumero(
                            produccionTotal
                        )} kg`
                    )}

                    ${this.crearTarjeta(
                        "🌾",
                        "Fincas vinculadas",
                        fincasConCampania
                    )}

                </section>


                <!-- ==========================================
                     CABECERA LISTA
                =========================================== -->

                <div class="campanias-list-header">

                    <div>

                        <span class="campanias-list-eyebrow">
                            CAMPAÑAS
                        </span>

                        <h2>
                            Ciclos agrícolas
                        </h2>

                        <p>
                            Consulta producción, resultados y actividad
                            de cada campaña.
                        </p>

                    </div>


                    <div class="campanias-list-summary">

                        <span>
                            ${activas} activas
                        </span>

                        <span>
                            ${cerradas} cerradas
                        </span>

                    </div>

                </div>


                <div id="listaCampanias"></div>

            </div>

        `;


        document
            .getElementById(
                "nuevaCampania"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrarFormulario();

                }
            );


        this.mostrarLista();

    }


    // =====================================================
    // TARJETA KPI
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
    // LISTA
    // =====================================================

    mostrarLista() {

        const campanias =
            this.campaniaService
                .obtenerTodas()
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.fechaInicio
                        )
                        -
                        new Date(
                            a.fechaInicio
                        )
                );


        const contenedor =
            document.getElementById(
                "listaCampanias"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            campanias.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="campanias-empty">

                    <div class="campanias-empty-illustration">

                        <div class="campanias-empty-sun"></div>

                        <div class="campanias-empty-hill campanias-empty-hill-1"></div>

                        <div class="campanias-empty-hill campanias-empty-hill-2"></div>

                        <div class="campanias-empty-calendar">
                            📅
                        </div>

                    </div>


                    <h3>
                        Todavía no tienes campañas
                    </h3>


                    <p>
                        Crea tu primera campaña agrícola para comenzar
                        a organizar la producción de tu explotación.
                    </p>


                    <button
                        id="crearPrimeraCampania"
                        class="primary-button"
                        type="button"
                    >
                        + Crear primera campaña
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimeraCampania"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        this.mostrarFormulario();

                    }
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="campanias-grid">

                ${campanias
                    .map(
                        (
                            campania,
                            index
                        ) => {

                            const resumen =
                                this.obtenerResumenCampania(
                                    campania
                                );


                            const progreso =
                                this.calcularProgresoCampania(
                                    campania
                                );


                            const numeroImagen =
                                (
                                    index %
                                    3
                                )
                                +
                                1;


                            return `

                                <article class="campania-card">

                                    <!-- ==================================
                                         FOTO
                                    =================================== -->

                                    <div
                                        class="
                                            campania-cover
                                            campania-cover-${numeroImagen}
                                        "
                                    >

                                        <div class="campania-cover-overlay"></div>


                                        <div class="campania-cover-top">

                                            <span
                                                class="
                                                    campania-status
                                                    ${
                                                        campania.estado ===
                                                        "Activa"

                                                            ? "campania-activa"

                                                            : "campania-cerrada"
                                                    }
                                                "
                                            >

                                                ${
                                                    campania.estado ===
                                                    "Activa"

                                                        ? "● Activa"

                                                        : "🔒 Cerrada"
                                                }

                                            </span>


                                            <div class="campania-actions">

                                                <button
                                                    class="
                                                        campania-action-button
                                                        editar-campania
                                                    "
                                                    data-id="${campania.id}"
                                                    type="button"
                                                    title="Editar campaña"
                                                >
                                                    ✎
                                                </button>


                                                <button
                                                    class="
                                                        campania-action-button
                                                        campania-action-delete
                                                        eliminar-campania
                                                    "
                                                    data-id="${campania.id}"
                                                    type="button"
                                                    title="Eliminar campaña"
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        </div>


                                        <div class="campania-cover-copy">

                                            <span>
                                                ${
                                                    this.escapar(
                                                        campania.fincaNombre
                                                        ||
                                                        "Explotación"
                                                    )
                                                }
                                            </span>


                                            <strong>
                                                ${this.escapar(
                                                    campania.nombre
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    <!-- ==================================
                                         CUERPO
                                    =================================== -->

                                    <div class="campania-card-body">

                                        <div class="campania-card-title">

                                            <span class="campania-card-kicker">
                                                CAMPAÑA AGRÍCOLA
                                            </span>


                                            <h3>
                                                ${this.escapar(
                                                    campania.nombre
                                                )}
                                            </h3>


                                            <p class="campania-finca">

                                                🌾
                                                ${this.escapar(
                                                    campania.fincaNombre
                                                )}

                                            </p>

                                        </div>


                                        <!-- ==============================
                                             FECHAS
                                        =============================== -->

                                        <div class="campania-info-grid">

                                            <div>

                                                <span>
                                                    Inicio
                                                </span>

                                                <strong>
                                                    ${this.formatearFecha(
                                                        campania.fechaInicio
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Fin previsto
                                                </span>

                                                <strong>

                                                    ${
                                                        campania.fechaFin

                                                            ? this.formatearFecha(
                                                                campania.fechaFin
                                                            )

                                                            : "Sin definir"
                                                    }

                                                </strong>

                                            </div>

                                        </div>


                                        <!-- ==============================
                                             PROGRESO
                                        =============================== -->

                                        <div class="campania-progress">

                                            <div class="campania-progress-head">

                                                <span>
                                                    Progreso temporal
                                                </span>

                                                <strong>
                                                    ${progreso} %
                                                </strong>

                                            </div>


                                            <div class="campania-progress-track">

                                                <span
                                                    style="
                                                        width:
                                                        ${progreso}%;
                                                    "
                                                ></span>

                                            </div>

                                        </div>


                                        <!-- ==============================
                                             MÉTRICAS
                                        =============================== -->

                                        <div class="campania-mini-grid">

                                            ${this.crearMiniDato(
                                                "Producción",
                                                `${this.formatearNumero(
                                                    resumen.producido
                                                )} kg`
                                            )}

                                            ${this.crearMiniDato(
                                                "Ingresos",
                                                this.formatearDinero(
                                                    resumen.ingresos
                                                )
                                            )}

                                            ${this.crearMiniDato(
                                                "Beneficio",
                                                this.formatearDinero(
                                                    resumen.beneficio
                                                )
                                            )}

                                        </div>


                                        <!-- ==============================
                                             ACCIONES
                                        =============================== -->

                                        <div class="campania-bottom">

                                            <button
                                                class="
                                                    campania-view-button
                                                    ver-campania
                                                "
                                                data-id="${campania.id}"
                                                type="button"
                                            >
                                                Ver campaña

                                                <span>
                                                    →
                                                </span>

                                            </button>


                                            ${
                                                campania.estado ===
                                                "Activa"

                                                    ? `
                                                        <button
                                                            class="
                                                                campania-state-button
                                                                cerrar-campania
                                                            "
                                                            data-id="${campania.id}"
                                                            type="button"
                                                        >
                                                            Cerrar
                                                        </button>
                                                    `

                                                    : `
                                                        <button
                                                            class="
                                                                campania-state-button
                                                                reabrir-campania
                                                            "
                                                            data-id="${campania.id}"
                                                            type="button"
                                                        >
                                                            Reabrir
                                                        </button>
                                                    `
                                            }

                                        </div>


                                        ${
                                            campania.notas

                                                ? `
                                                    <p class="campania-notas">

                                                        <span>
                                                            Nota
                                                        </span>

                                                        ${this.escapar(
                                                            campania.notas
                                                        )}

                                                    </p>
                                                `

                                                : ""
                                        }

                                    </div>

                                </article>

                            `;

                        }
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // MINI DATO
    // =====================================================

    crearMiniDato(
        titulo,
        valor
    ) {

        return `

            <div class="campania-mini-dato">

                <span class="campania-mini-label">
                    ${titulo}
                </span>

                <strong class="campania-mini-value">
                    ${valor}
                </strong>

            </div>

        `;

    }


    // =====================================================
    // PROGRESO TEMPORAL
    // =====================================================

    calcularProgresoCampania(
        campania
    ) {

        if (
            !campania?.fechaInicio
        ) {

            return 0;

        }


        const inicio =
            new Date(
                `${campania.fechaInicio}T00:00:00`
            );


        if (
            Number.isNaN(
                inicio.getTime()
            )
        ) {

            return 0;

        }


        if (
            campania.estado ===
            "Cerrada"
        ) {

            return 100;

        }


        const hoy =
            new Date();


        hoy.setHours(
            0,
            0,
            0,
            0
        );


        if (
            hoy <
            inicio
        ) {

            return 0;

        }


        if (
            !campania.fechaFin
        ) {

            return 50;

        }


        const fin =
            new Date(
                `${campania.fechaFin}T00:00:00`
            );


        if (
            Number.isNaN(
                fin.getTime()
            )
        ) {

            return 0;

        }


        if (
            hoy >=
            fin
        ) {

            return 100;

        }


        const duracion =
            fin.getTime()
            -
            inicio.getTime();


        if (
            duracion <=
            0
        ) {

            return 100;

        }


        const transcurrido =
            hoy.getTime()
            -
            inicio.getTime();


        return Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    (
                        transcurrido
                        /
                        duracion
                    )
                    *
                    100
                )
            )
        );

    }


    // =====================================================
    // EVENTOS LISTA
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".ver-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.mostrarDetalle(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".editar-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormulario(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".cerrar-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const campania =
                                this.obtenerCampaniaPorId(
                                    button.dataset.id
                                );


                            if (
                                !campania
                            ) {

                                alert(
                                    "No se ha podido encontrar la campaña."
                                );

                                return;

                            }


                            const resultado =
                                this.campaniaService
                                    .cambiarEstado(
                                        campania.id,
                                        "Cerrada"
                                    );


                            if (
                                !resultado.ok
                            ) {

                                alert(
                                    resultado.mensaje
                                );

                                return;

                            }


                            this.mostrar();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".reabrir-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const campania =
                                this.obtenerCampaniaPorId(
                                    button.dataset.id
                                );


                            if (
                                !campania
                            ) {

                                alert(
                                    "No se ha podido encontrar la campaña."
                                );

                                return;

                            }


                            const resultado =
                                this.campaniaService
                                    .cambiarEstado(
                                        campania.id,
                                        "Activa"
                                    );


                            if (
                                !resultado.ok
                            ) {

                                alert(
                                    resultado.mensaje
                                );

                                return;

                            }


                            this.mostrar();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                button.dataset.id;


                            const campania =
                                this.obtenerCampaniaPorId(
                                    id
                                );


                            if (
                                !campania
                            ) {

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar la campaña "${campania.nombre}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.campaniaService
                                    .eliminar(
                                        campania.id
                                    );


                            if (
                                !resultado.ok
                            ) {

                                alert(
                                    resultado.mensaje
                                );

                                return;

                            }


                            this.mostrar();

                        }
                    );

                }
            );

    }


    // =====================================================
    // DETALLE CAMPAÑA
    // =====================================================

    mostrarDetalle(
        id
    ) {

        const campania =
            this.obtenerCampaniaPorId(
                id
            );


        if (
            !campania
        ) {

            return;

        }


        const resumen =
            this.obtenerResumenCampania(
                campania
            );


        const progreso =
            this.calcularProgresoCampania(
                campania
            );


        this.mainContent.innerHTML = `

            <div class="campania-detail-page">

                <button
                    id="volverDetalleCampania"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <!-- ==========================================
                     HERO DETALLE
                =========================================== -->

                <section class="campania-detail-hero">

                    <div class="campania-detail-hero-overlay"></div>


                    <div class="campania-detail-hero-content">

                        <span class="campania-detail-kicker">
                            CAMPAÑA AGRÍCOLA
                        </span>


                        <h1>
                            ${this.escapar(
                                campania.nombre
                            )}
                        </h1>


                        <p>

                            🌾
                            ${this.escapar(
                                campania.fincaNombre
                            )}

                            ·

                            ${this.formatearFecha(
                                campania.fechaInicio
                            )}

                            ${
                                campania.fechaFin

                                    ? ` → ${this.formatearFecha(
                                        campania.fechaFin
                                    )}`

                                    : ""
                            }

                        </p>

                    </div>


                    <div class="campania-detail-hero-side">

                        <span
                            class="
                                campania-status
                                ${
                                    campania.estado ===
                                    "Activa"

                                        ? "campania-activa"

                                        : "campania-cerrada"
                                }
                            "
                        >
                            ${
                                campania.estado ===
                                "Activa"

                                    ? "● Activa"

                                    : "🔒 Cerrada"
                            }
                        </span>


                        <div class="campania-detail-progress">

                            <span>
                                Progreso
                            </span>

                            <strong>
                                ${progreso} %
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     PRODUCCIÓN
                =========================================== -->

                <div
                    class="
                        campania-detail-heading
                        campania-detail-heading-first
                    "
                >

                    <span class="campania-detail-section-kicker">
                        PRODUCCIÓN
                    </span>

                    <h3>
                        Estado productivo
                    </h3>

                    <p class="campania-detail-subtitle">
                        Situación de la producción asociada a esta campaña.
                    </p>

                </div>


                <section class="stats campania-detail-stats">

                    ${this.crearTarjeta(
                        "🍎",
                        "Producido",
                        `${this.formatearNumero(
                            resumen.producido
                        )} kg`
                    )}

                    ${this.crearTarjeta(
                        "🕒",
                        "Reservado",
                        `${this.formatearNumero(
                            resumen.reservado
                        )} kg`
                    )}

                    ${this.crearTarjeta(
                        "🚚",
                        "Entregado",
                        `${this.formatearNumero(
                            resumen.entregado
                        )} kg`
                    )}

                    ${this.crearTarjeta(
                        "📦",
                        "Disponible",
                        `${this.formatearNumero(
                            resumen.disponible
                        )} kg`
                    )}

                </section>


                <!-- ==========================================
                     RENTABILIDAD
                =========================================== -->

                <div class="campania-detail-heading">

                    <span class="campania-detail-section-kicker">
                        ECONOMÍA
                    </span>

                    <h3>
                        Rentabilidad
                    </h3>

                    <p class="campania-detail-subtitle">
                        Resultado económico de la campaña.
                    </p>

                </div>


                <section class="stats campania-detail-stats">

                    ${this.crearTarjeta(
                        "💰",
                        "Ingresos sin IVA",
                        this.formatearDinero(
                            resumen.ingresos
                        )
                    )}

                    ${this.crearTarjeta(
                        "💸",
                        "Gastos",
                        this.formatearDinero(
                            resumen.gastos
                        )
                    )}

                    ${this.crearTarjeta(
                        "📈",
                        "Beneficio",
                        this.formatearDinero(
                            resumen.beneficio
                        )
                    )}

                    ${this.crearTarjeta(
                        "📊",
                        "Margen",
                        `${this.formatearNumero(
                            resumen.margen
                        )} %`
                    )}

                </section>


                <!-- ==========================================
                     ACTIVIDAD
                =========================================== -->

                <div class="campania-detail-heading">

                    <span class="campania-detail-section-kicker">
                        ACTIVIDAD
                    </span>

                    <h3>
                        Actividad de la campaña
                    </h3>

                    <p class="campania-detail-subtitle">
                        Elementos asociados durante el ciclo agrícola.
                    </p>

                </div>


                <section class="stats campania-detail-stats">

                    ${this.crearTarjeta(
                        "🌱",
                        "Cultivos",
                        resumen.cultivos.length
                    )}

                    ${this.crearTarjeta(
                        "🚜",
                        "Trabajos",
                        resumen.trabajos.length
                    )}

                    ${this.crearTarjeta(
                        "📄",
                        "Albaranes",
                        resumen.albaranes.length
                    )}

                    ${this.crearTarjeta(
                        "💶",
                        "Facturas",
                        resumen.facturas.length
                    )}

                </section>


                <!-- ==========================================
                     LISTAS
                =========================================== -->

                <section
                    class="
                        dashboard-grid
                        campania-detail-grid
                    "
                >

                    <div class="panel">

                        <div class="panel-header">

                            <div>

                                <span class="campania-panel-kicker">
                                    CAMPO
                                </span>

                                <h3>
                                    🌱 Cultivos
                                </h3>

                            </div>

                        </div>


                        ${this.crearListaCultivos(
                            resumen.cultivos
                        )}

                    </div>


                    <div class="panel">

                        <div class="panel-header">

                            <div>

                                <span class="campania-panel-kicker">
                                    OPERACIONES
                                </span>

                                <h3>
                                    🚜 Trabajos
                                </h3>

                            </div>

                        </div>


                        ${this.crearListaTrabajos(
                            resumen.trabajos
                        )}

                    </div>


                    <div class="panel">

                        <div class="panel-header">

                            <div>

                                <span class="campania-panel-kicker">
                                    VENTAS
                                </span>

                                <h3>
                                    📄 Albaranes
                                </h3>

                            </div>

                        </div>


                        ${this.crearListaAlbaranes(
                            resumen.albaranes
                        )}

                    </div>


                    <div class="panel">

                        <div class="panel-header">

                            <div>

                                <span class="campania-panel-kicker">
                                    FACTURACIÓN
                                </span>

                                <h3>
                                    💶 Facturas
                                </h3>

                            </div>

                        </div>


                        ${this.crearListaFacturas(
                            resumen.facturas
                        )}

                    </div>

                </section>


                ${
                    campania.notas

                        ? `
                            <section
                                class="
                                    panel
                                    campania-notas-panel
                                "
                            >

                                <div class="panel-header">

                                    <div>

                                        <span class="campania-panel-kicker">
                                            INFORMACIÓN
                                        </span>

                                        <h3>
                                            Notas
                                        </h3>

                                    </div>

                                </div>


                                <p>
                                    ${this.escapar(
                                        campania.notas
                                    )}
                                </p>

                            </section>
                        `

                        : ""
                }

            </div>

        `;


        document
            .getElementById(
                "volverDetalleCampania"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );

    }


    // =====================================================
    // RESUMEN CAMPAÑA
    // =====================================================

    obtenerResumenCampania(
        campania
    ) {

        const cultivos =
            this.obtenerStorage(
                "obtenerCultivos"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const produccion =
            this.obtenerStorage(
                "obtenerProduccion"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const trabajos =
            this.obtenerStorage(
                "obtenerTrabajos"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const gastos =
            this.obtenerStorage(
                "obtenerGastos"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const todosAlbaranes =
            this.obtenerStorage(
                "obtenerAlbaranes"
            );


        const facturas =
            this.obtenerStorage(
                "obtenerFacturas"
            );


        const producido =
            produccion.reduce(
                (
                    total,
                    registro
                ) =>
                    total
                    +
                    Number(
                        registro.cantidad
                        ||
                        0
                    ),
                0
            );


        let reservado =
            0;


        let entregado =
            0;


        const albaranesCampania =
            [];


        todosAlbaranes.forEach(
            albaran => {

                const lineas =
                    this.obtenerLineasAlbaran(
                        albaran
                    );


                const lineasCampania =
                    lineas.filter(
                        linea =>
                            this.perteneceCampania(
                                linea,
                                campania
                            )
                    );


                if (
                    lineasCampania.length ===
                    0
                ) {

                    return;

                }


                albaranesCampania.push(
                    albaran
                );


                lineasCampania.forEach(
                    linea => {

                        if (
                            String(
                                linea.unidad
                                ||
                                "kg"
                            )
                            !==
                            "kg"
                        ) {

                            return;

                        }


                        if (
                            albaran.estado ===
                            "Pendiente"
                        ) {

                            reservado +=
                                Number(
                                    linea.cantidad
                                    ||
                                    0
                                );

                        }


                        if (
                            albaran.estado ===
                            "Entregado"
                            ||
                            albaran.estado ===
                            "Facturado"
                            ||
                            albaran.facturado ===
                            true
                        ) {

                            entregado +=
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


        const disponible =
            Math.max(
                0,
                producido
                -
                reservado
                -
                entregado
            );


        const gastosTotal =
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


        let ingresos =
            0;


        const idsAlbaranesCampania =
            new Set(
                albaranesCampania.map(
                    albaran =>
                        String(
                            albaran.id
                        )
                )
            );


        const facturasCampania =
            facturas.filter(
                factura => {

                    if (
                        factura.estado ===
                        "Anulada"
                    ) {

                        return false;

                    }


                    const ids =
                        Array.isArray(
                            factura.albaranesIds
                        )

                            ? factura.albaranesIds

                            : [];


                    return ids.some(
                        id =>
                            idsAlbaranesCampania
                                .has(
                                    String(
                                        id
                                    )
                                )
                    );

                }
            );


        facturasCampania.forEach(
            factura => {

                const ids =
                    Array.isArray(
                        factura.albaranesIds
                    )

                        ? factura.albaranesIds

                        : [];


                const albaranesFactura =
                    ids
                        .map(
                            id =>
                                todosAlbaranes.find(
                                    albaran =>
                                        this.mismoId(
                                            albaran.id,
                                            id
                                        )
                                )
                        )
                        .filter(Boolean);


                const totalAlbaranes =
                    albaranesFactura.reduce(
                        (
                            total,
                            albaran
                        ) =>
                            total
                            +
                            Number(
                                albaran.total
                                ||
                                0
                            ),
                        0
                    );


                if (
                    totalAlbaranes <=
                    0
                ) {

                    return;

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


                albaranesFactura.forEach(
                    albaran => {

                        const lineas =
                            this.obtenerLineasAlbaran(
                                albaran
                            );


                        const totalLineas =
                            lineas.reduce(
                                (
                                    total,
                                    linea
                                ) =>
                                    total
                                    +
                                    this.obtenerImporteLinea(
                                        linea
                                    ),
                                0
                            );


                        if (
                            totalLineas <=
                            0
                        ) {

                            return;

                        }


                        const baseAlbaran =
                            base
                            *
                            (
                                Number(
                                    albaran.total
                                    ||
                                    0
                                )
                                /
                                totalAlbaranes
                            );


                        lineas.forEach(
                            linea => {

                                if (
                                    !this.perteneceCampania(
                                        linea,
                                        campania
                                    )
                                ) {

                                    return;

                                }


                                ingresos +=
                                    baseAlbaran
                                    *
                                    (
                                        this.obtenerImporteLinea(
                                            linea
                                        )
                                        /
                                        totalLineas
                                    );

                            }
                        );

                    }
                );

            }
        );


        const beneficio =
            ingresos
            -
            gastosTotal;


        const margen =
            ingresos >
            0

                ? (
                    beneficio
                    /
                    ingresos
                )
                *
                100

                : 0;


        return {

            cultivos:
                cultivos,

            produccion:
                produccion,

            trabajos:
                trabajos,

            gastosLista:
                gastos,

            albaranes:
                albaranesCampania,

            facturas:
                facturasCampania,

            producido:
                producido,

            reservado:
                reservado,

            entregado:
                entregado,

            disponible:
                disponible,

            ingresos:
                ingresos,

            gastos:
                gastosTotal,

            beneficio:
                beneficio,

            margen:
                margen

        };

    }


    // =====================================================
    // LISTA CULTIVOS
    // =====================================================

    crearListaCultivos(
        cultivos
    ) {

        if (
            cultivos.length ===
            0
        ) {

            return `

                <div class="campania-list-empty">

                    <span>
                        🌱
                    </span>

                    <p>
                        No hay cultivos en esta campaña.
                    </p>

                </div>

            `;

        }


        return cultivos
            .map(
                cultivo => `

                    <div class="task">

                        <div>

                            <strong>

                                ${this.escapar(
                                    [
                                        cultivo.tipo,
                                        cultivo.variedad
                                    ]
                                        .filter(Boolean)
                                        .join(
                                            " · "
                                        )
                                )}

                            </strong>


                            <p>

                                ${this.escapar(
                                    cultivo.parcela
                                    ||
                                    cultivo.fincaNombre
                                    ||
                                    ""
                                )}

                            </p>

                        </div>

                    </div>

                `
            )
            .join("");

    }


    // =====================================================
    // LISTA TRABAJOS
    // =====================================================

    crearListaTrabajos(
        trabajos
    ) {

        if (
            trabajos.length ===
            0
        ) {

            return `

                <div class="campania-list-empty">

                    <span>
                        🚜
                    </span>

                    <p>
                        No hay trabajos en esta campaña.
                    </p>

                </div>

            `;

        }


        return trabajos
            .map(
                trabajo => `

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
                                    trabajo.estado
                                    ||
                                    "Pendiente"
                                )}

                            </p>

                        </div>

                    </div>

                `
            )
            .join("");

    }


    // =====================================================
    // LISTA ALBARANES
    // =====================================================

    crearListaAlbaranes(
        albaranes
    ) {

        if (
            albaranes.length ===
            0
        ) {

            return `

                <div class="campania-list-empty">

                    <span>
                        📄
                    </span>

                    <p>
                        No hay albaranes relacionados.
                    </p>

                </div>

            `;

        }


        return albaranes
            .map(
                albaran => `

                    <div class="task">

                        <div>

                            <strong>
                                ${this.escapar(
                                    albaran.numero
                                )}
                            </strong>


                            <p>

                                ${this.escapar(
                                    albaran.clienteNombre
                                    ||
                                    albaran.cliente
                                    ||
                                    "Sin cliente"
                                )}

                                ·

                                ${this.escapar(
                                    albaran.estado
                                )}

                            </p>

                        </div>


                        <strong>
                            ${this.formatearDinero(
                                albaran.total
                            )}
                        </strong>

                    </div>

                `
            )
            .join("");

    }


    // =====================================================
    // LISTA FACTURAS
    // =====================================================

    crearListaFacturas(
        facturas
    ) {

        if (
            facturas.length ===
            0
        ) {

            return `

                <div class="campania-list-empty">

                    <span>
                        💶
                    </span>

                    <p>
                        No hay facturas activas relacionadas.
                    </p>

                </div>

            `;

        }


        return facturas
            .map(
                factura => `

                    <div class="task">

                        <div>

                            <strong>
                                ${this.escapar(
                                    factura.numero
                                )}
                            </strong>


                            <p>
                                ${this.escapar(
                                    factura.estado
                                    ||
                                    "Pendiente"
                                )}
                            </p>

                        </div>


                        <strong>
                            ${this.formatearDinero(
                                factura.total
                            )}
                        </strong>

                    </div>

                `
            )
            .join("");

    }


    // =====================================================
    // PERTENECE A CAMPAÑA
    // =====================================================

    perteneceCampania(
        registro,
        campania
    ) {

        if (
            !registro
            ||
            !campania
        ) {

            return false;

        }


        if (
            registro.campaniaId !==
            undefined
            &&
            registro.campaniaId !==
            null
            &&
            registro.campaniaId !==
            ""
        ) {

            return this.mismoId(
                registro.campaniaId,
                campania.id
            );

        }


        if (
            registro.campaniaNombre
            &&
            String(
                registro.campaniaNombre
            )
            ===
            String(
                campania.nombre
            )
        ) {

            return true;

        }


        return false;

    }


    // =====================================================
    // ALBARÁN
    // =====================================================

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
            albaran
        ) {

            return [
                albaran
            ];

        }


        return [];

    }


    obtenerImporteLinea(
        linea
    ) {

        if (
            linea.total !==
            undefined
        ) {

            return Number(
                linea.total
                ||
                0
            );

        }


        return (
            Number(
                linea.cantidad
                ||
                0
            )
            *
            Number(
                linea.precio
                ||
                0
            )
        );

    }


    // =====================================================
    // STORAGE
    // =====================================================

    obtenerStorage(
        metodo
    ) {

        try {

            if (
                typeof
                StorageService[
                    metodo
                ]
                !==
                "function"
            ) {

                return [];

            }


            const datos =
                StorageService[
                    metodo
                ]();


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
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        id = null
    ) {

        const editando =
            id !==
            null;


        const campania =
            editando

                ? this.obtenerCampaniaPorId(
                    id
                )

                : null;


        if (
            editando
            &&
            !campania
        ) {

            alert(
                "No se ha podido encontrar la campaña que quieres editar."
            );

            this.mostrar();

            return;

        }


        const fincas =
            this.obtenerFincas();


        if (
            fincas.length ===
            0
        ) {

            alert(
                "Primero debes crear una finca."
            );

            return;

        }


        this.mainContent.innerHTML = `

            <div class="campania-form-page">

                <button
                    id="volverCampanias"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="campania-form-header">

                    <span class="campania-form-eyebrow">
                        🌾 GESTIÓN AGRÍCOLA
                    </span>


                    <h1>

                        ${
                            editando

                                ? "Editar campaña"

                                : "Nueva campaña"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Modifica la planificación y los datos principales de la campaña agrícola."

                                : "Crea un nuevo ciclo agrícola y vincúlalo a una de tus fincas."
                        }

                    </p>

                </header>


                <div class="campania-form-layout">

                    <div class="form-panel campania-form-panel">

                        <div class="campania-form-section-title">

                            <span class="campania-form-section-icon">
                                📅
                            </span>


                            <div>

                                <h3>
                                    Información de campaña
                                </h3>

                                <p>
                                    Define el ciclo agrícola y su periodo.
                                </p>

                            </div>

                        </div>


                        <div class="form-group">

                            <label>
                                Nombre de la campaña *
                            </label>


                            <input
                                id="nombreCampania"
                                type="text"
                                placeholder="Ej. Campaña 2027"
                                value="${this.escapar(
                                    campania?.nombre
                                    ||
                                    ""
                                )}"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Finca *
                            </label>


                            <select id="fincaCampania">

                                ${fincas
                                    .map(
                                        finca => `

                                            <option
                                                value="${finca.id}"

                                                ${
                                                    this.mismoId(
                                                        campania?.fincaId,
                                                        finca.id
                                                    )

                                                        ? "selected"

                                                        : ""
                                                }
                                            >
                                                ${this.escapar(
                                                    finca.nombre
                                                )}
                                            </option>

                                        `
                                    )
                                    .join("")}

                            </select>

                        </div>


                        <div class="campania-form-row">

                            <div class="form-group">

                                <label>
                                    Fecha de inicio *
                                </label>


                                <input
                                    id="inicioCampania"
                                    type="date"
                                    value="${
                                        campania?.fechaInicio
                                        ||
                                        this.obtenerFechaHoy()
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Fecha de fin
                                </label>


                                <input
                                    id="finCampania"
                                    type="date"
                                    value="${
                                        campania?.fechaFin
                                        ||
                                        ""
                                    }"
                                >

                            </div>

                        </div>


                        <div class="form-group">

                            <label>
                                Estado
                            </label>


                            <select id="estadoCampania">

                                <option
                                    value="Activa"

                                    ${
                                        !campania
                                        ||
                                        campania.estado ===
                                        "Activa"

                                            ? "selected"

                                            : ""
                                    }
                                >
                                    Activa
                                </option>


                                <option
                                    value="Cerrada"

                                    ${
                                        campania?.estado ===
                                        "Cerrada"

                                            ? "selected"

                                            : ""
                                    }
                                >
                                    Cerrada
                                </option>

                            </select>

                        </div>


                        <div class="form-group">

                            <label>
                                Notas
                            </label>


                            <textarea
                                id="notasCampania"
                                rows="5"
                                placeholder="Observaciones de la campaña..."
                            >${this.escapar(
                                campania?.notas
                                ||
                                ""
                            )}</textarea>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarCampania"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarCampania"
                                class="primary-button"
                                type="button"
                            >

                                ${
                                    editando

                                        ? "Guardar cambios"

                                        : "Crear campaña"
                                }

                            </button>

                        </div>

                    </div>


                    <aside class="campania-form-aside">

                        <div class="campania-form-aside-image">

                            <div>

                                <span>
                                    GESTACAMPS
                                </span>

                                <strong>
                                    Cada campaña cuenta
                                    una historia diferente.
                                </strong>

                            </div>

                        </div>


                        <div class="campania-form-tip">

                            <span class="campania-form-tip-icon">
                                🌿
                            </span>


                            <div>

                                <strong>
                                    Un ciclo, todos los datos
                                </strong>

                                <p>
                                    Producción, trabajos, gastos,
                                    albaranes y rentabilidad quedarán
                                    relacionados con esta campaña.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverCampanias"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarCampania"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "guardarCampania"
            )
            ?.addEventListener(
                "click",
                () => {

                    const datos = {

                        nombre:
                            document
                                .getElementById(
                                    "nombreCampania"
                                )
                                .value,

                        fincaId:
                            document
                                .getElementById(
                                    "fincaCampania"
                                )
                                .value,

                        fechaInicio:
                            document
                                .getElementById(
                                    "inicioCampania"
                                )
                                .value,

                        fechaFin:
                            document
                                .getElementById(
                                    "finCampania"
                                )
                                .value,

                        estado:
                            document
                                .getElementById(
                                    "estadoCampania"
                                )
                                .value,

                        notas:
                            document
                                .getElementById(
                                    "notasCampania"
                                )
                                .value

                    };


                    const resultado =
                        editando

                            ? this.campaniaService
                                .editar(
                                    campania.id,
                                    datos
                                )

                            : this.campaniaService
                                .crear(
                                    datos
                                );


                    if (
                        !resultado.ok
                    ) {

                        alert(
                            resultado.mensaje
                        );

                        return;

                    }


                    this.mostrar();

                }
            );

    }


    // =====================================================
    // FINCAS
    // =====================================================

    obtenerFincas() {

        if (
            typeof
            this.fincaService
                .obtenerTodas ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerTodas()
                ||
                []
            );

        }


        if (
            typeof
            this.fincaService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // FECHA
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        const year =
            fecha.getFullYear();


        const month =
            String(
                fecha.getMonth() +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const day =
            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${year}-${month}-${day}`
        );

    }


    formatearFecha(
        fecha
    ) {

        if (
            !fecha
        ) {

            return "—";

        }


        const partes =
            String(
                fecha
            )
                .split(
                    "-"
                );


        if (
            partes.length !==
            3
        ) {

            return fecha;

        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );

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


    // =====================================================
    // ESCAPAR HTML
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