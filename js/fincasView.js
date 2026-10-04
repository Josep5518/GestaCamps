import {
    escaparHTML,
    formatearNumero
} from "./utils.js";


export class FincasView {

    constructor(
        mainContent,
        fincaService,
        parcelaService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.parcelaService =
            parcelaService;

    }


    // =====================================================
    // VOLVER A FINCAS
    // =====================================================

    volverAFincas() {

        const enlaceFincas =
            document.querySelector(
                'a[data-page="fincas"]'
            );


        if (
            enlaceFincas
        ) {

            enlaceFincas.click();

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // LISTADO PRINCIPAL
    // =====================================================

    mostrar() {

        const fincas =
            this.obtenerFincas();


        const superficieTotal =
            fincas.reduce(
                (
                    total,
                    finca
                ) =>
                    total
                    +
                    Number(
                        finca.superficie
                        ||
                        0
                    ),
                0
            );


        const parcelasTotales =
            fincas.reduce(
                (
                    total,
                    finca
                ) =>
                    total
                    +
                    this.obtenerParcelas(
                        finca
                    ).length,
                0
            );


        const superficieParcelada =
            fincas.reduce(
                (
                    total,
                    finca
                ) => {

                    const parcelas =
                        this.obtenerParcelas(
                            finca
                        );


                    return (
                        total
                        +
                        parcelas.reduce(
                            (
                                subtotal,
                                parcela
                            ) =>
                                subtotal
                                +
                                Number(
                                    parcela.superficie
                                    ||
                                    0
                                ),
                            0
                        )
                    );

                },
                0
            );


        const porcentajeUtilizado =
            superficieTotal >
            0

                ? Math.min(
                    100,
                    (
                        superficieParcelada
                        /
                        superficieTotal
                    )
                    *
                    100
                )

                : 0;


        this.mainContent.innerHTML = `

            <div class="fincas-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="fincas-hero">

                    <div class="fincas-hero-content">

                        <span class="fincas-eyebrow">
                            🌾 GESTIÓN AGRÍCOLA
                        </span>


                        <h1>
                            Tu tierra,
                            <span>
                                bien organizada.
                            </span>
                        </h1>


                        <p>
                            Gestiona tus fincas y parcelas desde una
                            visión clara de la superficie disponible,
                            el terreno utilizado y toda tu explotación.
                        </p>


                        <button
                            id="nuevaFinca"
                            class="
                                primary-button
                                fincas-hero-button
                            "
                            type="button"
                        >
                            + Nueva finca
                        </button>

                    </div>


                    <div class="fincas-hero-image">

                        <div class="fincas-hero-badge">

                            <span>
                                Superficie total
                            </span>

                            <strong>
                                ${formatearNumero(
                                    superficieTotal
                                )} ha
                            </strong>

                        </div>


                        <div class="fincas-hero-copy">

                            <small>
                                FINCAS · PARCELAS · PRODUCCIÓN
                            </small>

                            <strong>
                                Conoce cada rincón<br>
                                de tu explotación
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats finca-stats">

                    ${this.crearStat(
                        "🌾",
                        "Fincas",
                        fincas.length
                    )}

                    ${this.crearStat(
                        "🗺️",
                        "Parcelas",
                        parcelasTotales
                    )}

                    ${this.crearStat(
                        "📐",
                        "Superficie total",
                        `${formatearNumero(
                            superficieTotal
                        )} ha`
                    )}

                    ${this.crearStat(
                        "🌱",
                        "Terreno utilizado",
                        `${Math.round(
                            porcentajeUtilizado
                        )} %`
                    )}

                </section>


                <!-- ==========================================
                     CABECERA LISTADO
                =========================================== -->

                <div class="fincas-list-header">

                    <div>

                        <span class="fincas-list-eyebrow">
                            EXPLOTACIÓN
                        </span>

                        <h2>
                            Tus fincas
                        </h2>

                        <p>
                            Consulta superficie, parcelas y datos
                            principales de cada finca.
                        </p>

                    </div>


                    <div class="fincas-list-summary">

                        <span>
                            ${fincas.length} fincas
                        </span>

                        <span>
                            ${parcelasTotales} parcelas
                        </span>

                    </div>

                </div>


                <div id="listaFincas"></div>

            </div>

        `;


        document
            .getElementById(
                "nuevaFinca"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        this.mostrarLista();

    }


    // =====================================================
    // TARJETA STAT
    // =====================================================

    crearStat(
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
                        ${escaparHTML(
                            titulo
                        )}
                    </p>


                    <h3>
                        ${valor}
                    </h3>

                </div>

            </div>

        `;

    }


    // =====================================================
    // LISTA DE FINCAS
    // =====================================================

    mostrarLista() {

        const contenedor =
            document.getElementById(
                "listaFincas"
            );


        if (
            !contenedor
        ) {

            return;

        }


        const fincas =
            this.obtenerFincas();


        if (
            fincas.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="fincas-empty">

                    <div class="fincas-empty-visual">

                        <div class="fincas-empty-sun"></div>

                        <div
                            class="
                                fincas-empty-hill
                                fincas-empty-hill-1
                            "
                        ></div>

                        <div
                            class="
                                fincas-empty-hill
                                fincas-empty-hill-2
                            "
                        ></div>

                        <div class="fincas-empty-icon">
                            🌾
                        </div>

                    </div>


                    <h3>
                        Todavía no tienes ninguna finca
                    </h3>


                    <p>
                        Añade la primera finca de tu explotación
                        para comenzar a organizar sus parcelas.
                    </p>


                    <button
                        id="crearPrimeraFinca"
                        class="primary-button"
                        type="button"
                    >
                        + Crear primera finca
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimeraFinca"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormulario()
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="fincas-grid">

                ${fincas
                    .map(
                        (
                            finca,
                            index
                        ) =>
                            this.crearTarjetaFinca(
                                finca,
                                index
                            )
                    )
                    .join("")}

            </div>

        `;


        contenedor
            .querySelectorAll(
                ".ver-finca"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarDetalle(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        contenedor
            .querySelectorAll(
                ".eliminar-finca"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarFinca(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // TARJETA FINCA
    // =====================================================

    crearTarjetaFinca(
        finca,
        index = 0
    ) {

        const parcelas =
            this.obtenerParcelas(
                finca
            );


        const superficieParcelada =
            parcelas.reduce(
                (
                    total,
                    parcela
                ) =>
                    total
                    +
                    Number(
                        parcela.superficie
                        ||
                        0
                    ),
                0
            );


        const superficieTotal =
            Number(
                finca.superficie
                ||
                0
            );


        const porcentaje =
            superficieTotal >
            0

                ? Math.min(
                    100,
                    Math.round(
                        (
                            superficieParcelada
                            /
                            superficieTotal
                        )
                        *
                        100
                    )
                )

                : 0;


        const numeroImagen =
            (
                index %
                3
            )
            +
            1;


        return `

            <article
                class="
                    finca-card
                    finca-card-premium
                "
            >

                <!-- ==================================
                     FOTO
                =================================== -->

                <div
                    class="
                        finca-card-cover
                        finca-card-cover-${numeroImagen}
                    "
                >

                    <div class="finca-card-cover-overlay"></div>


                    <div class="finca-card-cover-top">

                        <span class="finca-card-status">
                            ● Activa
                        </span>


                        <button
                            class="
                                finca-card-delete
                                eliminar-finca
                            "
                            data-id="${escaparHTML(
                                finca.id
                            )}"
                            type="button"
                            aria-label="Eliminar finca"
                            title="Eliminar finca"
                        >
                            ×
                        </button>

                    </div>


                    <div class="finca-card-cover-copy">

                        <span>
                            FINCA
                        </span>


                        <strong>
                            ${escaparHTML(
                                finca.nombre
                            )}
                        </strong>


                        <p>
                            📍
                            ${escaparHTML(
                                finca.ubicacion
                                ||
                                "Sin ubicación"
                            )}
                        </p>

                    </div>

                </div>


                <!-- ==================================
                     CUERPO
                =================================== -->

                <div class="finca-card-body">

                    <div class="finca-card-main">

                        <span class="finca-card-kicker">
                            EXPLOTACIÓN AGRÍCOLA
                        </span>


                        <h3>
                            ${escaparHTML(
                                finca.nombre
                            )}
                        </h3>


                        <p class="finca-location">

                            📍
                            ${escaparHTML(
                                finca.ubicacion
                                ||
                                "Sin ubicación"
                            )}

                        </p>

                    </div>


                    <div class="finca-info">

                        <div>

                            <span>
                                Superficie
                            </span>

                            <strong>
                                ${formatearNumero(
                                    finca.superficie
                                )} ha
                            </strong>

                        </div>


                        <div>

                            <span>
                                Parcelas
                            </span>

                            <strong>
                                ${parcelas.length}
                            </strong>

                        </div>

                    </div>


                    <div class="finca-card-usage">

                        <div class="finca-card-usage-head">

                            <span>
                                Superficie utilizada
                            </span>

                            <strong>
                                ${porcentaje} %
                            </strong>

                        </div>


                        <div class="finca-card-usage-track">

                            <span
                                style="
                                    width:
                                    ${porcentaje}%;
                                "
                            ></span>

                        </div>

                    </div>


                    ${
                        finca.notas

                            ? `

                                <p class="finca-card-note">

                                    <span>
                                        Nota
                                    </span>

                                    ${escaparHTML(
                                        finca.notas
                                    )}

                                </p>

                            `

                            : ""
                    }


                    <button
                        class="
                            ver-finca
                            finca-view-button
                        "
                        data-id="${escaparHTML(
                            finca.id
                        )}"
                        type="button"
                    >

                        Ver finca

                        <span>
                            →
                        </span>

                    </button>

                </div>

            </article>

        `;

    }


    // =====================================================
    // ELIMINAR FINCA
    // =====================================================

    eliminarFinca(
        fincaId
    ) {

        if (
            !confirm(
                "¿Quieres eliminar esta finca?"
            )
        ) {

            return;

        }


        const resultado =
            this.fincaService
                .eliminar(
                    fincaId
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
                "No se ha podido eliminar la finca."
            );


            return;

        }


        this.mostrar();

    }


    // =====================================================
    // FORMULARIO NUEVA FINCA
    // =====================================================

    mostrarFormulario() {

        this.mainContent.innerHTML = `

            <div class="finca-form-page">

                <button
                    id="cancelarFincaSuperior"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="finca-form-header">

                    <span class="finca-form-eyebrow">
                        🌾 GESTIÓN AGRÍCOLA
                    </span>


                    <h1>
                        Nueva finca
                    </h1>


                    <p>
                        Añade una nueva finca a tu explotación
                        y comienza a organizar sus parcelas.
                    </p>

                </header>


                <div class="finca-form-layout">

                    <div
                        class="
                            form-panel
                            finca-form-panel
                        "
                    >

                        <div class="finca-form-section-title">

                            <span class="finca-form-section-icon">
                                🌾
                            </span>


                            <div>

                                <h3>
                                    Información de la finca
                                </h3>

                                <p>
                                    Introduce los datos principales
                                    de la explotación.
                                </p>

                            </div>

                        </div>


                        <div class="form-group">

                            <label>
                                Nombre de la finca *
                            </label>


                            <input
                                id="nombreFinca"
                                type="text"
                                autocomplete="off"
                                placeholder="Ej. Can Rovira"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Ubicación
                            </label>


                            <input
                                id="ubicacionFinca"
                                type="text"
                                autocomplete="off"
                                placeholder="Municipio o zona"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Superficie total (ha) *
                            </label>


                            <input
                                id="superficieFinca"
                                type="number"
                                min="0"
                                step="0.01"
                                inputmode="decimal"
                                placeholder="0,00"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Notas
                            </label>


                            <textarea
                                id="notasFinca"
                                rows="5"
                                placeholder="Información adicional..."
                            ></textarea>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarFinca"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarFinca"
                                class="primary-button"
                                type="button"
                            >
                                Guardar finca
                            </button>

                        </div>

                    </div>


                    <aside class="finca-form-aside">

                        <div class="finca-form-aside-image">

                            <div>

                                <span>
                                    GESTACAMPS
                                </span>

                                <strong>
                                    Cada finca empieza
                                    con una buena visión.
                                </strong>

                            </div>

                        </div>


                        <div class="finca-form-tip">

                            <span>
                                🗺️
                            </span>


                            <div>

                                <strong>
                                    Organiza el terreno
                                </strong>

                                <p>
                                    Después podrás dividir la finca
                                    en parcelas y controlar la
                                    superficie utilizada.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "cancelarFincaSuperior"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.volverAFincas()
            );


        document
            .getElementById(
                "cancelarFinca"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.volverAFincas()
            );


        document
            .getElementById(
                "guardarFinca"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarFinca()
            );

    }


    // =====================================================
    // GUARDAR FINCA
    // =====================================================

    guardarFinca() {

        const nombre =
            document
                .getElementById(
                    "nombreFinca"
                )
                ?.value
                .trim()
            ||
            "";


        const ubicacion =
            document
                .getElementById(
                    "ubicacionFinca"
                )
                ?.value
                .trim()
            ||
            "";


        const superficie =
            Number(
                document
                    .getElementById(
                        "superficieFinca"
                    )
                    ?.value
                ||
                0
            );


        const notas =
            document
                .getElementById(
                    "notasFinca"
                )
                ?.value
                .trim()
            ||
            "";


        if (
            !nombre
        ) {

            alert(
                "Introduce el nombre de la finca."
            );

            return;

        }


        if (
            superficie <=
            0
        ) {

            alert(
                "Introduce una superficie válida."
            );

            return;

        }


        this.fincaService
            .crear(
                nombre,
                ubicacion,
                superficie,
                notas
            );


        this.volverAFincas();

    }


    // =====================================================
    // DETALLE DE FINCA
    // =====================================================

    mostrarDetalle(
        fincaId
    ) {

        const finca =
            this.fincaService
                .obtenerPorId(
                    fincaId
                );


        if (
            !finca
        ) {

            return;

        }


        const parcelas =
            this.obtenerParcelas(
                finca
            );


        const superficieParcelas =
            parcelas.reduce(
                (
                    total,
                    parcela
                ) =>
                    total
                    +
                    Number(
                        parcela.superficie
                        ||
                        0
                    ),
                0
            );


        const superficieLibre =
            Math.max(
                0,
                Number(
                    finca.superficie
                    ||
                    0
                )
                -
                superficieParcelas
            );


        const superficieTotal =
            Number(
                finca.superficie
                ||
                0
            );


        const porcentajeUtilizado =
            superficieTotal >
            0

                ? Math.min(
                    100,
                    (
                        superficieParcelas
                        /
                        superficieTotal
                    )
                    *
                    100
                )

                : 0;


        this.mainContent.innerHTML = `

            <div class="finca-detail">

                <div class="detail-header">

                    <button
                        id="volverFincas"
                        class="back-button"
                        type="button"
                    >
                        ← Volver
                    </button>

                </div>


                <!-- ==========================================
                     HERO DETALLE
                =========================================== -->

                <section class="finca-detail-hero">

                    <div class="finca-detail-overlay"></div>


                    <div class="finca-detail-hero-main">

                        <div>

                            <span class="finca-detail-kicker">
                                FINCA
                            </span>


                            <h2>
                                ${escaparHTML(
                                    finca.nombre
                                )}
                            </h2>


                            <p>

                                📍
                                ${escaparHTML(
                                    finca.ubicacion
                                    ||
                                    "Sin ubicación"
                                )}

                            </p>

                        </div>

                    </div>


                    <div class="finca-detail-hero-actions">

                        <div class="finca-detail-hero-data">

                            <small>
                                Superficie
                            </small>

                            <strong>
                                ${formatearNumero(
                                    superficieTotal
                                )} ha
                            </strong>

                        </div>


                        <button
                            id="nuevaParcela"
                            class="primary-button"
                            type="button"
                        >
                            + Nueva parcela
                        </button>

                    </div>

                </section>


                <!-- ==========================================
                     RESUMEN
                =========================================== -->

                <section class="finca-detail-summary">

                    ${this.crearMiniDato(
                        "📐",
                        "Superficie total",
                        `${formatearNumero(
                            superficieTotal
                        )} ha`
                    )}

                    ${this.crearMiniDato(
                        "🗺️",
                        "Parcelas",
                        parcelas.length
                    )}

                    ${this.crearMiniDato(
                        "🌱",
                        "Superficie parcelada",
                        `${formatearNumero(
                            superficieParcelas
                        )} ha`
                    )}

                    ${this.crearMiniDato(
                        "📦",
                        "Superficie libre",
                        `${formatearNumero(
                            superficieLibre
                        )} ha`
                    )}

                </section>


                <!-- ==========================================
                     USO DE SUPERFICIE
                =========================================== -->

                <section class="finca-usage-card">

                    <div class="finca-usage-header">

                        <div>

                            <span>
                                Uso de superficie
                            </span>


                            <strong>

                                ${formatearNumero(
                                    superficieParcelas
                                )}

                                /

                                ${formatearNumero(
                                    superficieTotal
                                )}

                                ha

                            </strong>

                        </div>


                        <strong class="finca-usage-percentage">

                            ${Math.round(
                                porcentajeUtilizado
                            )}%

                        </strong>

                    </div>


                    <div class="finca-usage-track">

                        <div
                            class="finca-usage-bar"
                            style="
                                width:
                                ${porcentajeUtilizado}%;
                            "
                        ></div>

                    </div>

                </section>


                ${
                    finca.notas

                        ? `

                            <section class="finca-detail-notes">

                                <span>
                                    NOTAS
                                </span>


                                <p>
                                    ${escaparHTML(
                                        finca.notas
                                    )}
                                </p>

                            </section>

                        `

                        : ""
                }


                <!-- ==========================================
                     PARCELAS
                =========================================== -->

                <div
                    class="
                        section-header
                        finca-parcelas-header
                    "
                >

                    <div>

                        <span class="finca-parcelas-eyebrow">
                            ORGANIZACIÓN DEL TERRENO
                        </span>


                        <h2>
                            Parcelas
                        </h2>


                        <p>
                            Parcelas pertenecientes a esta finca.
                        </p>

                    </div>


                    <span class="finca-parcelas-count">
                        ${parcelas.length}
                    </span>

                </div>


                <div id="listaParcelas"></div>

            </div>

        `;


        document
            .getElementById(
                "volverFincas"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.volverAFincas()
            );


        document
            .getElementById(
                "nuevaParcela"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormularioParcela(
                        finca.id
                    )
            );


        this.mostrarParcelas(
            finca
        );

    }


    // =====================================================
    // MINI DATO
    // =====================================================

    crearMiniDato(
        icono,
        titulo,
        valor
    ) {

        return `

            <article class="finca-detail-stat">

                <span>
                    ${icono}
                </span>


                <div>

                    <small>
                        ${escaparHTML(
                            titulo
                        )}
                    </small>


                    <strong>
                        ${valor}
                    </strong>

                </div>

            </article>

        `;

    }


    // =====================================================
    // LISTADO DE PARCELAS
    // =====================================================

    mostrarParcelas(
        finca
    ) {

        const contenedor =
            document.getElementById(
                "listaParcelas"
            );


        if (
            !contenedor
        ) {

            return;

        }


        const parcelas =
            this.obtenerParcelas(
                finca
            );


        if (
            parcelas.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div
                    class="
                        fincas-empty
                        finca-empty-parcelas
                    "
                >

                    <div class="parcelas-empty-icon">
                        🗺️
                    </div>


                    <h3>
                        Todavía no hay parcelas
                    </h3>


                    <p>
                        Divide la finca en parcelas para controlar
                        mejor cada zona de cultivo.
                    </p>


                    <button
                        id="crearPrimeraParcela"
                        class="primary-button"
                        type="button"
                    >
                        + Crear primera parcela
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimeraParcela"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormularioParcela(
                            finca.id
                        )
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="parcelas-grid">

                ${parcelas
                    .map(
                        (
                            parcela,
                            index
                        ) =>
                            this.crearTarjetaParcela(
                                parcela,
                                index
                            )
                    )
                    .join("")}

            </div>

        `;


        contenedor
            .querySelectorAll(
                ".eliminar-parcela"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.eliminarParcela(
                                finca,
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // TARJETA PARCELA
    // =====================================================

    crearTarjetaParcela(
        parcela,
        index = 0
    ) {

        const numeroColor =
            (
                index %
                3
            )
            +
            1;


        return `

            <article
                class="
                    parcela-card
                    parcela-card-premium
                    parcela-card-${numeroColor}
                "
            >

                <div class="parcela-header">

                    <div class="parcela-title-group">

                        <span class="parcela-icon">
                            🗺️
                        </span>


                        <div>

                            <span class="parcela-kicker">
                                PARCELA
                            </span>


                            <h3>
                                ${escaparHTML(
                                    parcela.nombre
                                )}
                            </h3>


                            <p>
                                ${formatearNumero(
                                    parcela.superficie
                                )} ha
                            </p>

                        </div>

                    </div>


                    <button
                        class="
                            parcela-delete
                            eliminar-parcela
                        "
                        data-id="${escaparHTML(
                            parcela.id
                        )}"
                        type="button"
                        aria-label="Eliminar parcela"
                    >
                        ×
                    </button>

                </div>


                <div class="parcela-surface">

                    <span
                        style="
                            width:
                            ${Math.min(
                                100,
                                Math.max(
                                    15,
                                    Number(
                                        parcela.superficie
                                        ||
                                        0
                                    )
                                    *
                                    10
                                )
                            )}%;
                        "
                    ></span>

                </div>


                <div class="parcela-info-grid">

                    <div>

                        <span>
                            Cultivo
                        </span>


                        <strong>

                            ${escaparHTML(
                                parcela.cultivo
                                ||
                                "Sin cultivo asignado"
                            )}

                        </strong>

                    </div>


                    <div>

                        <span>
                            SIGPAC
                        </span>


                        <strong>

                            ${escaparHTML(
                                parcela.sigpac
                                ||
                                parcela.referenciaSigpac
                                ||
                                "Sin referencia"
                            )}

                        </strong>

                    </div>

                </div>


                ${
                    parcela.notas

                        ? `

                            <p class="parcela-note">

                                <span>
                                    Nota
                                </span>

                                ${escaparHTML(
                                    parcela.notas
                                )}

                            </p>

                        `

                        : ""
                }

            </article>

        `;

    }


    // =====================================================
    // ELIMINAR PARCELA
    // =====================================================

    eliminarParcela(
        finca,
        parcelaId
    ) {

        if (
            !confirm(
                "¿Quieres eliminar esta parcela?"
            )
        ) {

            return;

        }


        const resultado =
            this.parcelaService
                .eliminar(
                    finca.id,
                    parcelaId
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
                "No se ha podido eliminar la parcela."
            );


            return;

        }


        this.mostrarDetalle(
            finca.id
        );

    }


    // =====================================================
    // FORMULARIO NUEVA PARCELA
    // =====================================================

    mostrarFormularioParcela(
        fincaId
    ) {

        const finca =
            this.fincaService
                .obtenerPorId(
                    fincaId
                );


        if (
            !finca
        ) {

            return;

        }


        this.mainContent.innerHTML = `

            <div class="finca-form-page">

                <button
                    id="cancelarParcelaSuperior"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="finca-form-header">

                    <span class="finca-form-eyebrow">
                        🗺️ FINCAS Y PARCELAS
                    </span>


                    <h1>
                        Nueva parcela
                    </h1>


                    <p>
                        Añade una parcela a
                        <strong>
                            ${escaparHTML(
                                finca.nombre
                            )}
                        </strong>
                    </p>

                </header>


                <div class="finca-form-layout">

                    <div
                        class="
                            form-panel
                            finca-form-panel
                        "
                    >

                        <div class="finca-form-section-title">

                            <span class="finca-form-section-icon">
                                🗺️
                            </span>


                            <div>

                                <h3>
                                    Información de la parcela
                                </h3>

                                <p>
                                    Define su superficie y referencia.
                                </p>

                            </div>

                        </div>


                        <div class="form-group">

                            <label>
                                Nombre *
                            </label>


                            <input
                                id="nombreParcela"
                                type="text"
                                autocomplete="off"
                                placeholder="Ej. Parcela 1A"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Superficie (ha) *
                            </label>


                            <input
                                id="superficieParcela"
                                type="number"
                                min="0"
                                step="0.01"
                                inputmode="decimal"
                                placeholder="0,00"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Referencia SIGPAC
                            </label>


                            <input
                                id="sigpacParcela"
                                type="text"
                                autocomplete="off"
                                placeholder="Referencia SIGPAC"
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Notas
                            </label>


                            <textarea
                                id="notasParcela"
                                rows="5"
                                placeholder="Información adicional..."
                            ></textarea>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarParcela"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarParcela"
                                class="primary-button"
                                type="button"
                            >
                                Guardar parcela
                            </button>

                        </div>

                    </div>


                    <aside class="finca-form-aside">

                        <div
                            class="
                                finca-form-aside-image
                                finca-form-aside-parcela
                            "
                        >

                            <div>

                                <span>
                                    ${escaparHTML(
                                        finca.nombre
                                    )}
                                </span>

                                <strong>
                                    Organiza cada zona
                                    de tu terreno.
                                </strong>

                            </div>

                        </div>


                        <div class="finca-form-tip">

                            <span>
                                🌱
                            </span>


                            <div>

                                <strong>
                                    Superficie controlada
                                </strong>

                                <p>
                                    GestaCamps calculará automáticamente
                                    cuánto terreno está parcelado y
                                    cuánto queda disponible.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        const volver =
            () =>
                this.mostrarDetalle(
                    finca.id
                );


        document
            .getElementById(
                "cancelarParcelaSuperior"
            )
            ?.addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "cancelarParcela"
            )
            ?.addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "guardarParcela"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarParcela(
                        finca.id
                    )
            );

    }


    // =====================================================
    // GUARDAR PARCELA
    // =====================================================

    guardarParcela(
        fincaId
    ) {

        const nombre =
            document
                .getElementById(
                    "nombreParcela"
                )
                ?.value
                .trim()
            ||
            "";


        const superficie =
            Number(
                document
                    .getElementById(
                        "superficieParcela"
                    )
                    ?.value
                ||
                0
            );


        const sigpac =
            document
                .getElementById(
                    "sigpacParcela"
                )
                ?.value
                .trim()
            ||
            "";


        const notas =
            document
                .getElementById(
                    "notasParcela"
                )
                ?.value
                .trim()
            ||
            "";


        if (
            !nombre
            ||
            superficie <=
            0
        ) {

            alert(
                "Introduce nombre y superficie válidos."
            );

            return;

        }


        const resultado =
            this.parcelaService
                .crear(
                    fincaId,
                    nombre,
                    superficie,
                    sigpac,
                    notas
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
                "No se ha podido crear la parcela."
            );


            return;

        }


        this.mostrarDetalle(
            fincaId
        );

    }


    // =====================================================
    // DATOS
    // =====================================================

    obtenerFincas() {

        const fincas =
            this.fincaService
                .obtenerTodas();


        return Array.isArray(
            fincas
        )

            ? fincas

            : [];

    }


    obtenerParcelas(
        finca
    ) {

        return Array.isArray(
            finca?.parcelas
        )

            ? finca.parcelas

            : [];

    }

}