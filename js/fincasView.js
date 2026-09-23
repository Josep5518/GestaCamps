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


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Fincas y parcelas
                    </h2>

                    <p>
                        Gestiona las fincas de tu explotación
                    </p>

                </div>


                <button
                    id="nuevaFinca"
                    class="primary-button"
                    type="button"
                >
                    + Nueva finca
                </button>

            </header>


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

            </section>


            <div id="listaFincas"></div>

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

                <div class="empty-state">

                    <div class="empty-icon">
                        🌾
                    </div>

                    <h3>
                        Todavía no tienes ninguna finca
                    </h3>

                    <p>
                        Crea tu primera finca para empezar.
                    </p>

                </div>

            `;


            return;

        }


        contenedor.innerHTML = `

            <div class="fincas-grid">

                ${fincas
                    .map(
                        finca =>
                            this.crearTarjetaFinca(
                                finca
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
        finca
    ) {

        const parcelas =
            this.obtenerParcelas(
                finca
            );


        return `

            <article class="finca-card finca-card-premium">

                <div class="finca-card-top">

                    <span class="finca-icon">
                        🌾
                    </span>


                    <button
                        class="delete-button eliminar-finca"
                        data-id="${escaparHTML(
                            finca.id
                        )}"
                        type="button"
                        aria-label="Eliminar finca"
                    >
                        ×
                    </button>

                </div>


                <div class="finca-card-main">

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


                ${
                    finca.notas

                        ? `

                            <p class="finca-card-note">

                                ${escaparHTML(
                                    finca.notas
                                )}

                            </p>

                        `

                        : ""
                }


                <button
                    class="secondary-button ver-finca finca-view-button"
                    data-id="${escaparHTML(
                        finca.id
                    )}"
                    type="button"
                >
                    Ver finca
                    <span>→</span>
                </button>

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

            <header class="topbar">

                <div>

                    <button
                        id="cancelarFincaSuperior"
                        class="back-button"
                        type="button"
                    >
                        ← Volver
                    </button>

                    <h2>
                        Nueva finca
                    </h2>

                    <p>
                        Añade una finca a GestaCamps
                    </p>

                </div>

            </header>


            <div class="form-panel">

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


                <section class="finca-detail-hero">

                    <div class="finca-detail-hero-main">

                        <span class="finca-detail-icon">
                            🌾
                        </span>


                        <div>

                            <span class="finca-detail-kicker">
                                Finca
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


                    <button
                        id="nuevaParcela"
                        class="primary-button"
                        type="button"
                    >
                        + Nueva parcela
                    </button>

                </section>


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
                                width:${porcentajeUtilizado}%;
                            "
                        ></div>

                    </div>

                </section>


                ${
                    finca.notas

                        ? `

                            <section class="finca-detail-notes">

                                <span>
                                    Notas
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


                <div class="section-header finca-parcelas-header">

                    <div>

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

                <div class="empty-state finca-empty-parcelas">

                    <div class="empty-icon">
                        🗺️
                    </div>

                    <h3>
                        No hay parcelas
                    </h3>

                    <p>
                        Añade la primera parcela de esta finca.
                    </p>

                </div>

            `;


            return;

        }


        contenedor.innerHTML = `

            <div class="parcelas-grid">

                ${parcelas
                    .map(
                        parcela =>
                            this.crearTarjetaParcela(
                                parcela
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
        parcela
    ) {

        return `

            <article class="parcela-card parcela-card-premium">

                <div class="parcela-header">

                    <div class="parcela-title-group">

                        <span class="parcela-icon">
                            🗺️
                        </span>

                        <div>

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
                        class="delete-button eliminar-parcela"
                        data-id="${escaparHTML(
                            parcela.id
                        )}"
                        type="button"
                        aria-label="Eliminar parcela"
                    >
                        ×
                    </button>

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

            <header class="topbar">

                <div>

                    <button
                        id="cancelarParcelaSuperior"
                        class="back-button"
                        type="button"
                    >
                        ← Volver
                    </button>

                    <h2>
                        Nueva parcela
                    </h2>

                    <p>
                        ${escaparHTML(
                            finca.nombre
                        )}
                    </p>

                </div>

            </header>


            <div class="form-panel">

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