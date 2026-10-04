import { StorageService } from "./storage.js";

import {
    escaparHTML,
    normalizarTexto,
    formatearFecha,
    obtenerHoraActual,
    mismoId
} from "./utils.js";

import {
    obtenerNombreTrabajador,
    obtenerNombreCultivo,
    obtenerNombreMaquinaria
} from "./entityHelpers.js";


export class TratamientosView {

    constructor(
        mainContent,
        tratamientoService
    ) {

        this.mainContent =
            mainContent;

        this.tratamientoService =
            tratamientoService;

        this.filtroFinca =
            "";

        this.busqueda =
            "";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const todos =
            this.tratamientoService
                .obtenerTodos();


        const tratamientos =
            this.obtenerFiltrados();


        const hoy =
            StorageService
                .obtenerFechaLocal(
                    new Date()
                );


        const tratamientosHoy =
            todos.filter(
                tratamiento =>
                    tratamiento.fecha ===
                    hoy
            );


        const fincas =
            StorageService
                .obtenerFincas();


        const fincasUtilizadas =
            new Set(
                todos
                    .map(
                        tratamiento =>
                            tratamiento.fincaId
                    )
                    .filter(Boolean)
                    .map(String)
            ).size;


        const productosUtilizados =
            new Set(
                todos
                    .map(
                        tratamiento =>
                            tratamiento.productoId
                    )
                    .filter(Boolean)
                    .map(String)
            ).size;


        this.mainContent.innerHTML = `

            <div class="tratamientos-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="tratamientos-hero">

                    <div class="tratamientos-hero-content">

                        <span class="tratamientos-eyebrow">
                            🧪 GESTIÓN AGRÍCOLA
                        </span>


                        <h1>
                            Protege tu campo
                            <span>con cada decisión.</span>
                        </h1>


                        <p>
                            Registra los tratamientos agrícolas,
                            controla los productos utilizados y mantén
                            toda la trazabilidad de cada aplicación.
                        </p>


                        <button
                            id="nuevoTratamiento"
                            class="
                                primary-button
                                tratamientos-hero-button
                            "
                            type="button"
                        >
                            + Nuevo tratamiento
                        </button>

                    </div>


                    <div class="tratamientos-hero-image">

                        <div class="tratamientos-hero-badge">

                            <span>
                                Tratamientos
                            </span>

                            <strong>
                                ${todos.length}
                            </strong>

                        </div>


                        <div class="tratamientos-hero-copy">

                            <small>
                                CONTROL · SEGURIDAD · TRAZABILIDAD
                            </small>

                            <strong>
                                Cada aplicación,<br>
                                bajo control
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats tratamientos-stats">

                    ${this.crearStat(
                        "🧪",
                        "Tratamientos",
                        todos.length
                    )}


                    ${this.crearStat(
                        "📅",
                        "Hoy",
                        tratamientosHoy.length
                    )}


                    ${this.crearStat(
                        "🌾",
                        "Fincas",
                        fincasUtilizadas
                    )}


                    ${this.crearStat(
                        "📦",
                        "Productos utilizados",
                        productosUtilizados
                    )}

                </section>


                <!-- ==========================================
                     CABECERA LISTADO
                =========================================== -->

                <div class="tratamientos-section-header">

                    <div>

                        <span class="tratamientos-section-eyebrow">
                            APLICACIONES AGRÍCOLAS
                        </span>


                        <h2>
                            Historial de tratamientos
                        </h2>


                        <p>
                            Consulta aplicaciones, productos,
                            dosis y superficies tratadas.
                        </p>

                    </div>


                    <span class="tratamientos-results-count">

                        ${tratamientos.length}

                        ${
                            tratamientos.length === 1
                                ? "tratamiento"
                                : "tratamientos"
                        }

                    </span>

                </div>


                <!-- ==========================================
                     FILTROS
                =========================================== -->

                <section class="tratamientos-filtros-panel">

                    <div class="tratamientos-search-wrap">

                        <span>
                            🔎
                        </span>


                        <input
                            id="buscarTratamiento"
                            type="search"
                            placeholder="Buscar producto, finca, cultivo..."
                            value="${escaparHTML(
                                this.busqueda
                            )}"
                        >

                    </div>


                    <div class="tratamientos-filter-wrap">

                        <label>
                            Finca
                        </label>


                        <select
                            id="filtroFincaTratamiento"
                        >

                            <option value="">
                                Todas las fincas
                            </option>


                            ${fincas
                                .map(
                                    finca => `

                                        <option
                                            value="${finca.id}"

                                            ${
                                                mismoId(
                                                    this.filtroFinca,
                                                    finca.id
                                                )

                                                    ? "selected"

                                                    : ""
                                            }
                                        >
                                            ${escaparHTML(
                                                finca.nombre
                                            )}
                                        </option>

                                    `
                                )
                                .join("")}

                        </select>

                    </div>

                </section>


                <!-- ==========================================
                     LISTA
                =========================================== -->

                <div
                    id="listaTratamientos"
                    class="tratamientos-grid"
                >

                    ${
                        tratamientos.length

                            ? tratamientos
                                .map(
                                    tratamiento =>
                                        this.crearTarjeta(
                                            tratamiento
                                        )
                                )
                                .join("")

                            : this.crearVacio()
                    }

                </div>

            </div>

        `;


        document
            .getElementById(
                "nuevoTratamiento"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        document
            .getElementById(
                "buscarTratamiento"
            )
            ?.addEventListener(
                "input",
                event => {

                    this.busqueda =
                        event.target.value;

                    this.actualizarLista();

                }
            );


        document
            .getElementById(
                "filtroFincaTratamiento"
            )
            ?.addEventListener(
                "change",
                event => {

                    this.filtroFinca =
                        event.target.value;

                    this.actualizarLista();

                }
            );


        this.configurarEventos();

    }


    // =====================================================
    // STAT
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
    // ACTUALIZAR LISTA
    // =====================================================

    actualizarLista() {

        const contenedor =
            document
                .getElementById(
                    "listaTratamientos"
                );


        if (
            !contenedor
        ) {

            return;

        }


        const tratamientos =
            this.obtenerFiltrados();


        contenedor.innerHTML =

            tratamientos.length

                ? tratamientos
                    .map(
                        tratamiento =>
                            this.crearTarjeta(
                                tratamiento
                            )
                    )
                    .join("")

                : this.crearVacio();


        const contador =
            document
                .querySelector(
                    ".tratamientos-results-count"
                );


        if (
            contador
        ) {

            contador.textContent =
                `${tratamientos.length} ${
                    tratamientos.length === 1
                        ? "tratamiento"
                        : "tratamientos"
                }`;

        }


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        tratamiento
    ) {

        return `

            <article class="tratamiento-card">

                <div class="tratamiento-card-top">

                    <div class="tratamiento-card-main">

                        <span class="tratamiento-card-icon">
                            🧪
                        </span>


                        <div>

                            <span class="tratamiento-card-kicker">
                                TRATAMIENTO AGRÍCOLA
                            </span>


                            <h3>
                                ${escaparHTML(
                                    tratamiento.productoNombre
                                    ||
                                    "Producto"
                                )}
                            </h3>


                            <p>
                                📍
                                ${escaparHTML(
                                    tratamiento.fincaNombre
                                    ||
                                    "Sin finca"
                                )}
                            </p>

                        </div>

                    </div>


                    <div class="tratamiento-card-actions">

                        <button
                            class="
                                tratamiento-action-button
                                editar-tratamiento
                            "
                            type="button"
                            data-id="${tratamiento.id}"
                            title="Editar"
                        >
                            ✎
                        </button>


                        <button
                            class="
                                tratamiento-action-button
                                tratamiento-delete
                                eliminar-tratamiento
                            "
                            type="button"
                            data-id="${tratamiento.id}"
                            title="Eliminar"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <div class="tratamiento-card-date">

                    <div>

                        <span>
                            Fecha
                        </span>

                        <strong>
                            ${formatearFecha(
                                tratamiento.fecha
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Hora
                        </span>

                        <strong>
                            ${escaparHTML(
                                tratamiento.hora
                                ||
                                "—"
                            )}
                        </strong>

                    </div>

                </div>


                <div class="tratamiento-tags">

                    ${
                        tratamiento.campaniaNombre

                            ? `

                                <span>
                                    🗓️
                                    ${escaparHTML(
                                        tratamiento.campaniaNombre
                                    )}
                                </span>

                            `

                            : ""
                    }


                    ${
                        tratamiento.cultivoNombre

                            ? `

                                <span>
                                    🌱
                                    ${escaparHTML(
                                        tratamiento.cultivoNombre
                                    )}
                                </span>

                            `

                            : ""
                    }

                </div>


                <div class="tratamiento-data-grid">

                    <div>

                        <span>
                            Cantidad
                        </span>

                        <strong>

                            ${escaparHTML(
                                tratamiento.cantidadUsada
                                ??
                                "—"
                            )}

                            ${escaparHTML(
                                tratamiento.productoUnidad
                                ||
                                ""
                            )}

                        </strong>

                    </div>


                    <div>

                        <span>
                            Dosis
                        </span>

                        <strong>
                            ${escaparHTML(
                                tratamiento.dosis
                                ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Superficie
                        </span>

                        <strong>

                            ${
                                tratamiento.superficieTratada

                                    ? `${escaparHTML(
                                        tratamiento.superficieTratada
                                    )} ha`

                                    : "—"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>
                            Objetivo
                        </span>

                        <strong>
                            ${escaparHTML(
                                tratamiento.plagaObjetivo
                                ||
                                "Sin especificar"
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    tratamiento.trabajadorNombre
                    ||
                    tratamiento.maquinariaNombre

                        ? `

                            <div class="tratamiento-resources">

                                ${
                                    tratamiento.trabajadorNombre

                                        ? `

                                            <div>

                                                <span>
                                                    👷
                                                </span>

                                                <div>

                                                    <small>
                                                        Aplicador
                                                    </small>

                                                    <strong>
                                                        ${escaparHTML(
                                                            tratamiento.trabajadorNombre
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                        `

                                        : ""
                                }


                                ${
                                    tratamiento.maquinariaNombre

                                        ? `

                                            <div>

                                                <span>
                                                    🚜
                                                </span>

                                                <div>

                                                    <small>
                                                        Maquinaria
                                                    </small>

                                                    <strong>
                                                        ${escaparHTML(
                                                            tratamiento.maquinariaNombre
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }


                ${
                    tratamiento.observaciones

                        ? `

                            <div class="tratamiento-observaciones">

                                <span>
                                    OBSERVACIONES
                                </span>

                                <p>
                                    ${escaparHTML(
                                        tratamiento.observaciones
                                    )}
                                </p>

                            </div>

                        `

                        : ""
                }


                <footer class="tratamiento-card-footer">

                    <span>
                        Registrado por
                    </span>

                    <strong>
                        ${escaparHTML(
                            tratamiento.creadoPorNombre
                            ||
                            "Administración"
                        )}
                    </strong>

                </footer>

            </article>

        `;

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        tratamientoId = null
    ) {

        const editando =
            tratamientoId !==
            null;


        const tratamiento =
            editando

                ? this.tratamientoService
                    .obtenerPorId(
                        tratamientoId
                    )

                : null;


        if (
            editando
            &&
            !tratamiento
        ) {

            alert(
                "El tratamiento no existe."
            );

            this.mostrar();

            return;

        }


        const fincas =
            StorageService
                .obtenerFincas();


        const campanias =
            StorageService
                .obtenerCampanias();


        const cultivos =
            StorageService
                .obtenerCultivos();


        const trabajadores =
            StorageService
                .obtenerTrabajadores()
                .filter(
                    trabajador =>
                        trabajador.estado ===
                        "Activo"
                );


        const maquinaria =
            StorageService
                .obtenerMaquinaria();


        const inventario =
            StorageService
                .obtenerInventario()
                .filter(
                    producto =>
                        Number(
                            producto.cantidad
                        ) > 0
                        ||
                        mismoId(
                            producto.id,
                            tratamiento?.productoId
                        )
                );


        const fechaHoy =
            StorageService
                .obtenerFechaLocal(
                    new Date()
                );


        const horaActual =
            obtenerHoraActual();


        this.mainContent.innerHTML = `

            <div class="tratamiento-form-page">

                <button
                    id="volverTratamientos"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="tratamiento-form-header">

                    <span class="tratamiento-form-eyebrow">
                        🧪 TRATAMIENTOS
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar tratamiento"
                                : "Nuevo tratamiento"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza los datos de esta aplicación agrícola."

                                : "Registra una nueva aplicación y mantén el control de producto, dosis y superficie."
                        }

                    </p>

                </header>


                <div class="tratamiento-form-layout">

                    <section
                        class="
                            form-panel
                            tratamiento-form-panel
                        "
                    >

                        <div class="tratamiento-form-section">

                            <span>
                                🧪
                            </span>

                            <div>

                                <h3>
                                    Datos del tratamiento
                                </h3>

                                <p>
                                    Información principal de la aplicación.
                                </p>

                            </div>

                        </div>


                        <div class="tratamiento-form-grid">

                            <div class="form-group">

                                <label>
                                    Fecha *
                                </label>

                                <input
                                    id="tratamientoFecha"
                                    type="date"
                                    value="${
                                        tratamiento?.fecha
                                        ||
                                        fechaHoy
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Hora
                                </label>

                                <input
                                    id="tratamientoHora"
                                    type="time"
                                    value="${
                                        tratamiento?.hora
                                        ||
                                        horaActual
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Finca *
                                </label>

                                <select
                                    id="tratamientoFinca"
                                >

                                    <option value="">
                                        Selecciona finca...
                                    </option>


                                    ${fincas
                                        .map(
                                            finca => `

                                                <option
                                                    value="${finca.id}"

                                                    ${
                                                        mismoId(
                                                            tratamiento?.fincaId,
                                                            finca.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >
                                                    ${escaparHTML(
                                                        finca.nombre
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Campaña
                                </label>

                                <select
                                    id="tratamientoCampania"
                                >

                                    <option value="">
                                        Sin campaña
                                    </option>


                                    ${campanias
                                        .map(
                                            campania => `

                                                <option
                                                    value="${campania.id}"

                                                    data-finca-id="${campania.fincaId}"

                                                    ${
                                                        mismoId(
                                                            tratamiento?.campaniaId,
                                                            campania.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >
                                                    ${escaparHTML(
                                                        campania.nombre
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Cultivo
                                </label>

                                <select
                                    id="tratamientoCultivo"
                                >

                                    <option value="">
                                        Sin cultivo
                                    </option>


                                    ${cultivos
                                        .map(
                                            cultivo => `

                                                <option
                                                    value="${cultivo.id}"

                                                    data-finca-id="${cultivo.fincaId}"

                                                    ${
                                                        mismoId(
                                                            tratamiento?.cultivoId,
                                                            cultivo.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >

                                                    ${escaparHTML(
                                                        obtenerNombreCultivo(
                                                            cultivo
                                                        )
                                                    )}

                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Producto *
                                </label>

                                <select
                                    id="tratamientoProducto"
                                >

                                    <option value="">
                                        Selecciona producto...
                                    </option>


                                    ${inventario
                                        .map(
                                            producto => `

                                                <option
                                                    value="${producto.id}"

                                                    ${
                                                        mismoId(
                                                            tratamiento?.productoId,
                                                            producto.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >

                                                    ${escaparHTML(
                                                        producto.nombre
                                                        ||
                                                        "Producto"
                                                    )}

                                                    ·
                                                    ${producto.cantidad}

                                                    ${escaparHTML(
                                                        producto.unidad
                                                        ||
                                                        ""
                                                    )}

                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Cantidad utilizada *
                                </label>

                                <input
                                    id="tratamientoCantidad"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value="${
                                        tratamiento?.cantidadUsada
                                        ??
                                        ""
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Dosis *
                                </label>

                                <input
                                    id="tratamientoDosis"
                                    type="text"
                                    placeholder="Ej. 2 L/ha"
                                    value="${escaparHTML(
                                        tratamiento?.dosis
                                        ||
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Superficie tratada (ha)
                                </label>

                                <input
                                    id="tratamientoSuperficie"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value="${
                                        tratamiento?.superficieTratada
                                        ??
                                        ""
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Problema / objetivo
                                </label>

                                <input
                                    id="tratamientoObjetivo"
                                    type="text"
                                    placeholder="Ej. Oídio, pulgón..."
                                    value="${escaparHTML(
                                        tratamiento?.plagaObjetivo
                                        ||
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Aplicador
                                </label>

                                <select
                                    id="tratamientoTrabajador"
                                >

                                    <option value="">
                                        Sin trabajador
                                    </option>


                                    ${trabajadores
                                        .map(
                                            trabajador => `

                                                <option
                                                    value="${trabajador.id}"

                                                    ${
                                                        mismoId(
                                                            tratamiento?.trabajadorId,
                                                            trabajador.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >

                                                    ${escaparHTML(
                                                        obtenerNombreTrabajador(
                                                            trabajador
                                                        )
                                                    )}

                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Maquinaria
                                </label>

                                <select
                                    id="tratamientoMaquinaria"
                                >

                                    <option value="">
                                        Sin maquinaria
                                    </option>


                                    ${maquinaria
                                        .map(
                                            maquina => `

                                                <option
                                                    value="${maquina.id}"

                                                    ${
                                                        mismoId(
                                                            tratamiento?.maquinariaId,
                                                            maquina.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >

                                                    ${escaparHTML(
                                                        obtenerNombreMaquinaria(
                                                            maquina
                                                        )
                                                    )}

                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group tratamiento-form-wide">

                                <label>
                                    Observaciones
                                </label>

                                <textarea
                                    id="tratamientoObservaciones"
                                    rows="4"
                                    placeholder="Observaciones del tratamiento..."
                                >${escaparHTML(
                                    tratamiento?.observaciones
                                    ||
                                    ""
                                )}</textarea>

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarTratamiento"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarTratamiento"
                                class="primary-button"
                                type="button"
                            >

                                ${
                                    editando
                                        ? "Guardar cambios"
                                        : "Registrar tratamiento"
                                }

                            </button>

                        </div>

                    </section>


                    <aside class="tratamiento-form-aside">

                        <div class="tratamiento-form-photo">

                            <div>

                                <span>
                                    GESTIÓN RESPONSABLE
                                </span>

                                <strong>
                                    Aplicar bien,
                                    registrar mejor.
                                </strong>

                            </div>

                        </div>


                        <div class="tratamiento-form-tip">

                            <span>
                                🛡️
                            </span>

                            <div>

                                <strong>
                                    Control de producto
                                </strong>

                                <p>
                                    Cada tratamiento queda vinculado
                                    al producto utilizado, finca, cultivo,
                                    trabajador y maquinaria.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverTratamientos"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarTratamiento"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "tratamientoFinca"
            )
            ?.addEventListener(
                "change",
                () =>
                    this.actualizarRelaciones()
            );


        document
            .getElementById(
                "guardarTratamiento"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarFormulario(
                        tratamiento
                    )
            );


        this.actualizarRelaciones();

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardarFormulario(
        tratamiento
    ) {

        const datos = {

            fecha:
                document
                    .getElementById(
                        "tratamientoFecha"
                    )
                    .value,

            hora:
                document
                    .getElementById(
                        "tratamientoHora"
                    )
                    .value,

            fincaId:
                document
                    .getElementById(
                        "tratamientoFinca"
                    )
                    .value,

            campaniaId:
                document
                    .getElementById(
                        "tratamientoCampania"
                    )
                    .value,

            cultivoId:
                document
                    .getElementById(
                        "tratamientoCultivo"
                    )
                    .value,

            productoId:
                document
                    .getElementById(
                        "tratamientoProducto"
                    )
                    .value,

            cantidadUsada:
                document
                    .getElementById(
                        "tratamientoCantidad"
                    )
                    .value,

            dosis:
                document
                    .getElementById(
                        "tratamientoDosis"
                    )
                    .value,

            superficieTratada:
                document
                    .getElementById(
                        "tratamientoSuperficie"
                    )
                    .value,

            plagaObjetivo:
                document
                    .getElementById(
                        "tratamientoObjetivo"
                    )
                    .value,

            trabajadorId:
                document
                    .getElementById(
                        "tratamientoTrabajador"
                    )
                    .value,

            maquinariaId:
                document
                    .getElementById(
                        "tratamientoMaquinaria"
                    )
                    .value,

            observaciones:
                document
                    .getElementById(
                        "tratamientoObservaciones"
                    )
                    .value

        };


        const resultado =
            tratamiento

                ? this.tratamientoService
                    .editar(
                        tratamiento.id,
                        datos
                    )

                : this.tratamientoService
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


    // =====================================================
    // RELACIONES
    // =====================================================

    actualizarRelaciones() {

        const finca =
            document
                .getElementById(
                    "tratamientoFinca"
                );


        const campania =
            document
                .getElementById(
                    "tratamientoCampania"
                );


        const cultivo =
            document
                .getElementById(
                    "tratamientoCultivo"
                );


        if (
            !finca
            ||
            !campania
            ||
            !cultivo
        ) {

            return;

        }


        const fincaId =
            finca.value;


        [
            ...campania.options
        ]
            .forEach(
                opcion => {

                    if (
                        !opcion.value
                    ) {

                        opcion.hidden =
                            false;

                        opcion.disabled =
                            false;

                        return;

                    }


                    const pertenece =
                        !!fincaId
                        &&
                        mismoId(
                            opcion.dataset.fincaId,
                            fincaId
                        );


                    opcion.hidden =
                        !pertenece;

                    opcion.disabled =
                        !pertenece;

                }
            );


        [
            ...cultivo.options
        ]
            .forEach(
                opcion => {

                    if (
                        !opcion.value
                    ) {

                        opcion.hidden =
                            false;

                        opcion.disabled =
                            false;

                        return;

                    }


                    const pertenece =
                        !!fincaId
                        &&
                        mismoId(
                            opcion.dataset.fincaId,
                            fincaId
                        );


                    opcion.hidden =
                        !pertenece;

                    opcion.disabled =
                        !pertenece;

                }
            );


        const campaniaSeleccionada =
            campania
                .selectedOptions[0];


        if (
            campaniaSeleccionada
            &&
            campaniaSeleccionada.value
            &&
            campaniaSeleccionada.disabled
        ) {

            campania.value =
                "";

        }


        const cultivoSeleccionado =
            cultivo
                .selectedOptions[0];


        if (
            cultivoSeleccionado
            &&
            cultivoSeleccionado.value
            &&
            cultivoSeleccionado.disabled
        ) {

            cultivo.value =
                "";

        }

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-tratamiento"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.mostrarFormulario(
                                boton.dataset.id
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-tratamiento"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const confirmar =
                                window.confirm(
                                    "¿Quieres eliminar este tratamiento?"
                                );


                            if (
                                !confirmar
                            ) {

                                return;

                            }


                            const resultado =
                                this.tratamientoService
                                    .eliminar(
                                        boton.dataset.id
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
    // FILTROS
    // =====================================================

    obtenerFiltrados() {

        let tratamientos =
            this.tratamientoService
                .obtenerTodos();


        if (
            this.filtroFinca
        ) {

            tratamientos =
                tratamientos.filter(
                    tratamiento =>
                        mismoId(
                            tratamiento.fincaId,
                            this.filtroFinca
                        )
                );

        }


        const busqueda =
            normalizarTexto(
                this.busqueda
            );


        if (
            busqueda
        ) {

            tratamientos =
                tratamientos.filter(
                    tratamiento => {

                        const texto =
                            normalizarTexto(
                                [
                                    tratamiento.productoNombre,
                                    tratamiento.fincaNombre,
                                    tratamiento.campaniaNombre,
                                    tratamiento.cultivoNombre,
                                    tratamiento.plagaObjetivo,
                                    tratamiento.trabajadorNombre,
                                    tratamiento.maquinariaNombre,
                                    tratamiento.dosis,
                                    tratamiento.observaciones
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                            );


                        return texto.includes(
                            busqueda
                        );

                    }
                );

        }


        return tratamientos
            .slice()
            .sort(
                (
                    a,
                    b
                ) => {

                    const fechaA =
                        `${a.fecha || ""} ${a.hora || ""}`;

                    const fechaB =
                        `${b.fecha || ""} ${b.hora || ""}`;


                    return fechaB.localeCompare(
                        fechaA
                    );

                }
            );

    }


    // =====================================================
    // VACÍO
    // =====================================================

    crearVacio() {

        return `

            <div class="tratamientos-empty">

                <div class="tratamientos-empty-icon">
                    🧪
                </div>


                <h3>
                    No hay tratamientos registrados
                </h3>


                <p>
                    Los tratamientos agrícolas registrados
                    aparecerán aquí.
                </p>

            </div>

        `;

    }

}