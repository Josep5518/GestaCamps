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
    obtenerNombreMaquinaria,
    obtenerNombreProducto
} from "./entityHelpers.js";


export class CuadernoCampoView {

    constructor(
        mainContent,
        cuadernoCampoService
    ) {

        this.mainContent =
            mainContent;

        this.cuadernoCampoService =
            cuadernoCampoService;

        this.filtroFinca =
            "";

        this.filtroTipo =
            "";

        this.busqueda =
            "";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const todos =
            this.cuadernoCampoService
                .obtenerTodos();


        const registros =
            this.obtenerRegistrosFiltrados();


        const hoy =
            this.obtenerRegistrosHoy(
                todos
            );


        const fincas =
            StorageService
                .obtenerFincas();


        const tipos =
            this.cuadernoCampoService
                .obtenerTiposActuacion();


        const fincasUtilizadas =
            new Set(
                todos
                    .map(
                        registro =>
                            registro.fincaId
                    )
                    .filter(Boolean)
                    .map(String)
            ).size;


        const actuacionesDiferentes =
            new Set(
                todos
                    .map(
                        registro =>
                            registro.tipoActuacion
                    )
                    .filter(Boolean)
            ).size;


        this.mainContent.innerHTML = `

            <div class="cuaderno-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="cuaderno-hero">

                    <div class="cuaderno-hero-content">

                        <span class="cuaderno-eyebrow">
                            📖 GESTIÓN AGRÍCOLA
                        </span>


                        <h1>
                            Todo lo que pasa
                            <span>en tu campo.</span>
                        </h1>


                        <p>
                            Registra cada actuación agrícola y conserva
                            un historial claro de los trabajos realizados
                            en tu explotación.
                        </p>


                        <button
                            id="nuevoRegistroCuaderno"
                            class="
                                primary-button
                                cuaderno-hero-button
                            "
                            type="button"
                        >
                            + Nueva actuación
                        </button>

                    </div>


                    <div class="cuaderno-hero-image">

                        <div class="cuaderno-hero-badge">

                            <span>
                                Registros
                            </span>

                            <strong>
                                ${todos.length}
                            </strong>

                        </div>


                        <div class="cuaderno-hero-copy">

                            <small>
                                REGISTRA · CONTROLA · CONSULTA
                            </small>

                            <strong>
                                La memoria de<br>
                                tu explotación
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats cuaderno-stats">

                    ${this.crearStat(
                        "📖",
                        "Registros",
                        todos.length
                    )}


                    ${this.crearStat(
                        "📅",
                        "Actuaciones hoy",
                        hoy.length
                    )}


                    ${this.crearStat(
                        "🌾",
                        "Fincas",
                        fincasUtilizadas
                    )}


                    ${this.crearStat(
                        "🚜",
                        "Tipos de actuación",
                        actuacionesDiferentes
                    )}

                </section>


                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <div class="cuaderno-section-header">

                    <div>

                        <span class="cuaderno-section-eyebrow">
                            HISTORIAL AGRÍCOLA
                        </span>


                        <h2>
                            Actuaciones registradas
                        </h2>


                        <p>
                            Consulta y filtra toda la actividad
                            realizada en el campo.
                        </p>

                    </div>


                    <span class="cuaderno-results-count">

                        ${registros.length}

                        ${
                            registros.length === 1
                                ? "registro"
                                : "registros"
                        }

                    </span>

                </div>


                <!-- ==========================================
                     FILTROS
                =========================================== -->

                <section class="cuaderno-filtros-panel">

                    <div class="cuaderno-search-wrap">

                        <span>
                            🔎
                        </span>


                        <input
                            id="buscarCuaderno"
                            type="search"
                            placeholder="Buscar finca, actuación, cultivo..."
                            value="${escaparHTML(
                                this.busqueda
                            )}"
                        >

                    </div>


                    <div class="cuaderno-filter-wrap">

                        <label>
                            Finca
                        </label>


                        <select
                            id="filtroFincaCuaderno"
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


                    <div class="cuaderno-filter-wrap">

                        <label>
                            Actuación
                        </label>


                        <select
                            id="filtroTipoCuaderno"
                        >

                            <option value="">
                                Todas las actuaciones
                            </option>


                            ${tipos
                                .map(
                                    tipo => `

                                        <option
                                            value="${escaparHTML(
                                                tipo
                                            )}"

                                            ${
                                                this.filtroTipo ===
                                                tipo

                                                    ? "selected"

                                                    : ""
                                            }
                                        >
                                            ${escaparHTML(
                                                tipo
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
                    id="listaCuadernoCampo"
                    class="cuaderno-grid"
                >

                    ${
                        registros.length

                            ? registros
                                .map(
                                    registro =>
                                        this.crearTarjeta(
                                            registro
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
                "nuevoRegistroCuaderno"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        document
            .getElementById(
                "buscarCuaderno"
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
                "filtroFincaCuaderno"
            )
            ?.addEventListener(
                "change",
                event => {

                    this.filtroFinca =
                        event.target.value;

                    this.actualizarLista();

                }
            );


        document
            .getElementById(
                "filtroTipoCuaderno"
            )
            ?.addEventListener(
                "change",
                event => {

                    this.filtroTipo =
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
    // ACTUALIZAR LISTADO
    // =====================================================

    actualizarLista() {

        const contenedor =
            document
                .getElementById(
                    "listaCuadernoCampo"
                );


        if (
            !contenedor
        ) {

            return;

        }


        const registros =
            this.obtenerRegistrosFiltrados();


        contenedor.innerHTML =

            registros.length

                ? registros
                    .map(
                        registro =>
                            this.crearTarjeta(
                                registro
                            )
                    )
                    .join("")

                : this.crearVacio();


        const contador =
            document
                .querySelector(
                    ".cuaderno-results-count"
                );


        if (
            contador
        ) {

            contador.textContent =
                `${registros.length} ${
                    registros.length === 1
                        ? "registro"
                        : "registros"
                }`;

        }


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        registro
    ) {

        return `

            <article class="cuaderno-card">

                <div class="cuaderno-card-top">

                    <div class="cuaderno-card-type">

                        <span class="cuaderno-card-icon">

                            ${this.obtenerIcono(
                                registro.tipoActuacion
                            )}

                        </span>


                        <div>

                            <span class="cuaderno-card-kicker">
                                ACTUACIÓN AGRÍCOLA
                            </span>


                            <h3>
                                ${escaparHTML(
                                    registro.tipoActuacion
                                    ||
                                    "Actuación"
                                )}
                            </h3>


                            <p class="cuaderno-card-finca">

                                📍
                                ${escaparHTML(
                                    registro.fincaNombre
                                    ||
                                    "Sin finca"
                                )}

                            </p>

                        </div>

                    </div>


                    <div class="cuaderno-card-actions">

                        <button
                            type="button"
                            class="
                                cuaderno-action-button
                                editar-cuaderno
                            "
                            data-id="${registro.id}"
                            title="Editar"
                        >
                            ✎
                        </button>


                        <button
                            type="button"
                            class="
                                cuaderno-action-button
                                cuaderno-delete
                                eliminar-cuaderno
                            "
                            data-id="${registro.id}"
                            title="Eliminar"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <div class="cuaderno-card-date">

                    <div>

                        <span>
                            Fecha
                        </span>


                        <strong>
                            ${formatearFecha(
                                registro.fecha
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Hora
                        </span>


                        <strong>
                            ${escaparHTML(
                                registro.hora
                                ||
                                "—"
                            )}
                        </strong>

                    </div>

                </div>


                <div class="cuaderno-card-tags">

                    ${
                        registro.campaniaNombre

                            ? `

                                <span>
                                    🗓️
                                    ${escaparHTML(
                                        registro.campaniaNombre
                                    )}
                                </span>

                            `

                            : ""
                    }


                    ${
                        registro.cultivoNombre

                            ? `

                                <span>
                                    🌱
                                    ${escaparHTML(
                                        registro.cultivoNombre
                                    )}
                                </span>

                            `

                            : ""
                    }

                </div>


                ${
                    registro.trabajadorNombres
                        ?.length

                        ? `

                            <div class="cuaderno-info-line">

                                <span>
                                    👷
                                </span>

                                <div>

                                    <small>
                                        Trabajadores
                                    </small>


                                    <strong>

                                        ${registro
                                            .trabajadorNombres
                                            .map(
                                                nombre =>
                                                    escaparHTML(
                                                        nombre
                                                    )
                                            )
                                            .join(", ")}

                                    </strong>

                                </div>

                            </div>

                        `

                        : ""
                }


                ${
                    registro.maquinariaNombre

                        ? `

                            <div class="cuaderno-info-line">

                                <span>
                                    🚜
                                </span>


                                <div>

                                    <small>
                                        Maquinaria
                                    </small>


                                    <strong>
                                        ${escaparHTML(
                                            registro.maquinariaNombre
                                        )}
                                    </strong>

                                </div>

                            </div>

                        `

                        : ""
                }


                ${
                    registro.productoNombre

                        ? `

                            <div class="cuaderno-info-line">

                                <span>
                                    📦
                                </span>


                                <div>

                                    <small>
                                        Producto
                                    </small>


                                    <strong>

                                        ${escaparHTML(
                                            registro.productoNombre
                                        )}

                                        ${
                                            registro.cantidad !==
                                            null
                                            &&
                                            registro.cantidad !==
                                            undefined
                                            &&
                                            registro.cantidad !== ""

                                                ? ` · ${escaparHTML(
                                                    registro.cantidad
                                                )} ${escaparHTML(
                                                    registro.unidad
                                                    ||
                                                    ""
                                                )}`

                                                : ""
                                        }

                                    </strong>

                                </div>

                            </div>

                        `

                        : ""
                }


                ${
                    registro.dosis

                        ? `

                            <div class="cuaderno-info-line">

                                <span>
                                    🧪
                                </span>


                                <div>

                                    <small>
                                        Dosis
                                    </small>


                                    <strong>
                                        ${escaparHTML(
                                            registro.dosis
                                        )}
                                    </strong>

                                </div>

                            </div>

                        `

                        : ""
                }


                ${
                    registro.descripcion

                        ? `

                            <div class="cuaderno-card-detail">

                                <span>
                                    DESCRIPCIÓN
                                </span>


                                <p>
                                    ${escaparHTML(
                                        registro.descripcion
                                    )}
                                </p>

                            </div>

                        `

                        : ""
                }


                ${
                    registro.observaciones

                        ? `

                            <div class="cuaderno-card-detail">

                                <span>
                                    OBSERVACIONES
                                </span>


                                <p>
                                    ${escaparHTML(
                                        registro.observaciones
                                    )}
                                </p>

                            </div>

                        `

                        : ""
                }


                <footer class="cuaderno-card-footer">

                    <span>
                        Registrado por
                    </span>


                    <strong>
                        ${escaparHTML(
                            registro.creadoPorNombre
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
        registroId = null
    ) {

        const editando =
            registroId !==
            null;


        const registro =
            editando

                ? this.cuadernoCampoService
                    .obtenerPorId(
                        registroId
                    )

                : null;


        if (
            editando
            &&
            !registro
        ) {

            alert(
                "El registro del cuaderno no existe."
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
                .obtenerInventario();


        const tipos =
            this.cuadernoCampoService
                .obtenerTiposActuacion();


        const ahora =
            new Date();


        const fechaHoy =
            StorageService
                .obtenerFechaLocal(
                    ahora
                );


        const horaAhora =
            obtenerHoraActual();


        this.mainContent.innerHTML = `

            <div class="cuaderno-form-page">

                <button
                    id="volverCuaderno"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="cuaderno-form-header">

                    <span class="cuaderno-form-eyebrow">
                        📖 CUADERNO DE CAMPO
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar actuación"
                                : "Nueva actuación"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza los datos de esta actuación agrícola."

                                : "Registra todo lo realizado en el campo para mantener una trazabilidad completa."
                        }

                    </p>

                </header>


                <div class="cuaderno-form-layout">

                    <section
                        class="
                            form-panel
                            cuaderno-form-panel
                        "
                    >

                        <div class="cuaderno-form-section">

                            <span>
                                📅
                            </span>


                            <div>

                                <h3>
                                    Datos de la actuación
                                </h3>

                                <p>
                                    Información principal del trabajo realizado.
                                </p>

                            </div>

                        </div>


                        <div class="cuaderno-form-grid">

                            <div class="form-group">

                                <label>
                                    Fecha *
                                </label>


                                <input
                                    id="cuadernoFecha"
                                    type="date"
                                    value="${
                                        registro?.fecha
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
                                    id="cuadernoHora"
                                    type="time"
                                    value="${
                                        registro?.hora
                                        ||
                                        horaAhora
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Tipo de actuación *
                                </label>


                                <select id="cuadernoTipo">

                                    <option value="">
                                        Selecciona...
                                    </option>


                                    ${tipos
                                        .map(
                                            tipo => `

                                                <option
                                                    value="${escaparHTML(
                                                        tipo
                                                    )}"

                                                    ${
                                                        registro?.tipoActuacion ===
                                                        tipo

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >
                                                    ${escaparHTML(
                                                        tipo
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group">

                                <label>
                                    Finca *
                                </label>


                                <select id="cuadernoFinca">

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
                                                            registro?.fincaId,
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


                                <select id="cuadernoCampania">

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
                                                            registro?.campaniaId,
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


                                <select id="cuadernoCultivo">

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
                                                            registro?.cultivoId,
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
                                    Maquinaria
                                </label>


                                <select id="cuadernoMaquinaria">

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
                                                            registro?.maquinariaId,
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


                            <div class="form-group">

                                <label>
                                    Producto
                                </label>


                                <select id="cuadernoProducto">

                                    <option value="">
                                        Sin producto
                                    </option>


                                    ${inventario
                                        .map(
                                            producto => `

                                                <option
                                                    value="${producto.id}"

                                                    ${
                                                        mismoId(
                                                            registro?.productoInventarioId,
                                                            producto.id
                                                        )

                                                            ? "selected"

                                                            : ""
                                                    }
                                                >

                                                    ${escaparHTML(
                                                        obtenerNombreProducto(
                                                            producto
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
                                    Cantidad
                                </label>


                                <input
                                    id="cuadernoCantidad"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value="${
                                        registro?.cantidad
                                        ??
                                        ""
                                    }"
                                >

                            </div>


                            <div class="form-group">

                                <label>
                                    Unidad
                                </label>


                                <input
                                    id="cuadernoUnidad"
                                    type="text"
                                    placeholder="kg, L, unidades..."
                                    value="${escaparHTML(
                                        registro?.unidad
                                        ||
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group cuaderno-form-wide">

                                <label>
                                    Dosis
                                </label>


                                <input
                                    id="cuadernoDosis"
                                    type="text"
                                    placeholder="Ej. 2 L/ha"
                                    value="${escaparHTML(
                                        registro?.dosis
                                        ||
                                        ""
                                    )}"
                                >

                            </div>


                            <div class="form-group cuaderno-form-wide">

                                <label>
                                    Trabajadores
                                </label>


                                <div class="cuaderno-trabajadores">

                                    ${
                                        trabajadores.length

                                            ? trabajadores
                                                .map(
                                                    trabajador => {

                                                        const marcado =
                                                            (
                                                                registro
                                                                    ?.trabajadorIds
                                                                ||
                                                                []
                                                            )
                                                                .some(
                                                                    id =>
                                                                        mismoId(
                                                                            id,
                                                                            trabajador.id
                                                                        )
                                                                );


                                                        return `

                                                            <label
                                                                class="
                                                                    cuaderno-trabajador-option
                                                                "
                                                            >

                                                                <input
                                                                    type="checkbox"
                                                                    class="cuaderno-trabajador"
                                                                    value="${trabajador.id}"

                                                                    ${
                                                                        marcado
                                                                            ? "checked"
                                                                            : ""
                                                                    }
                                                                >


                                                                <span>

                                                                    ${escaparHTML(
                                                                        obtenerNombreTrabajador(
                                                                            trabajador
                                                                        )
                                                                    )}

                                                                </span>

                                                            </label>

                                                        `;

                                                    }
                                                )
                                                .join("")

                                            : `

                                                <p class="cuaderno-no-workers">
                                                    No hay trabajadores activos.
                                                </p>

                                            `
                                    }

                                </div>

                            </div>


                            <div class="form-group cuaderno-form-wide">

                                <label>
                                    Descripción
                                </label>


                                <textarea
                                    id="cuadernoDescripcion"
                                    rows="4"
                                    placeholder="Describe el trabajo realizado..."
                                >${escaparHTML(
                                    registro?.descripcion
                                    ||
                                    ""
                                )}</textarea>

                            </div>


                            <div class="form-group cuaderno-form-wide">

                                <label>
                                    Observaciones
                                </label>


                                <textarea
                                    id="cuadernoObservaciones"
                                    rows="3"
                                    placeholder="Observaciones adicionales..."
                                >${escaparHTML(
                                    registro?.observaciones
                                    ||
                                    ""
                                )}</textarea>

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarCuaderno"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarCuaderno"
                                class="primary-button"
                                type="button"
                            >

                                ${
                                    editando
                                        ? "Guardar cambios"
                                        : "Registrar actuación"
                                }

                            </button>

                        </div>

                    </section>


                    <aside class="cuaderno-form-aside">

                        <div class="cuaderno-form-photo">

                            <div>

                                <span>
                                    TRAZABILIDAD AGRÍCOLA
                                </span>


                                <strong>
                                    Lo que registras hoy,
                                    te ayuda mañana.
                                </strong>

                            </div>

                        </div>


                        <div class="cuaderno-form-tip">

                            <span>
                                📖
                            </span>


                            <div>

                                <strong>
                                    Historial completo
                                </strong>


                                <p>
                                    Cada actuación queda relacionada con
                                    finca, campaña, cultivo, personal y
                                    recursos utilizados.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverCuaderno"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarCuaderno"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cuadernoFinca"
            )
            ?.addEventListener(
                "change",
                () =>
                    this.actualizarRelacionesFormulario()
            );


        document
            .getElementById(
                "guardarCuaderno"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarFormulario(
                        registro
                    )
            );


        this.actualizarRelacionesFormulario();

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardarFormulario(
        registro
    ) {

        const trabajadorIds =
            [
                ...document
                    .querySelectorAll(
                        ".cuaderno-trabajador:checked"
                    )
            ]
                .map(
                    checkbox =>
                        checkbox.value
                );


        const datos = {

            fecha:
                document
                    .getElementById(
                        "cuadernoFecha"
                    )
                    .value,

            hora:
                document
                    .getElementById(
                        "cuadernoHora"
                    )
                    .value,

            tipoActuacion:
                document
                    .getElementById(
                        "cuadernoTipo"
                    )
                    .value,

            fincaId:
                document
                    .getElementById(
                        "cuadernoFinca"
                    )
                    .value,

            campaniaId:
                document
                    .getElementById(
                        "cuadernoCampania"
                    )
                    .value,

            cultivoId:
                document
                    .getElementById(
                        "cuadernoCultivo"
                    )
                    .value,

            trabajadorIds,

            maquinariaId:
                document
                    .getElementById(
                        "cuadernoMaquinaria"
                    )
                    .value,

            productoInventarioId:
                document
                    .getElementById(
                        "cuadernoProducto"
                    )
                    .value,

            cantidad:
                document
                    .getElementById(
                        "cuadernoCantidad"
                    )
                    .value,

            unidad:
                document
                    .getElementById(
                        "cuadernoUnidad"
                    )
                    .value,

            dosis:
                document
                    .getElementById(
                        "cuadernoDosis"
                    )
                    .value,

            descripcion:
                document
                    .getElementById(
                        "cuadernoDescripcion"
                    )
                    .value,

            observaciones:
                document
                    .getElementById(
                        "cuadernoObservaciones"
                    )
                    .value

        };


        const resultado =
            registro

                ? this.cuadernoCampoService
                    .editar(
                        registro.id,
                        datos
                    )

                : this.cuadernoCampoService
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
    // FILTRAR CAMPAÑA / CULTIVO POR FINCA
    // =====================================================

    actualizarRelacionesFormulario() {

        const finca =
            document
                .getElementById(
                    "cuadernoFinca"
                );


        const campania =
            document
                .getElementById(
                    "cuadernoCampania"
                );


        const cultivo =
            document
                .getElementById(
                    "cuadernoCultivo"
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
                ".editar-cuaderno"
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
                ".eliminar-cuaderno"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const confirmar =
                                window.confirm(
                                    "¿Quieres eliminar este registro del cuaderno de campo?"
                                );


                            if (
                                !confirmar
                            ) {

                                return;

                            }


                            const resultado =
                                this.cuadernoCampoService
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

    obtenerRegistrosFiltrados() {

        let registros =
            this.cuadernoCampoService
                .obtenerTodos();


        if (
            this.filtroFinca
        ) {

            registros =
                registros.filter(
                    registro =>
                        mismoId(
                            registro.fincaId,
                            this.filtroFinca
                        )
                );

        }


        if (
            this.filtroTipo
        ) {

            registros =
                registros.filter(
                    registro =>
                        registro.tipoActuacion ===
                        this.filtroTipo
                );

        }


        const busqueda =
            normalizarTexto(
                this.busqueda
            );


        if (
            busqueda
        ) {

            registros =
                registros.filter(
                    registro => {

                        const texto =
                            normalizarTexto(
                                [
                                    registro.tipoActuacion,
                                    registro.fincaNombre,
                                    registro.campaniaNombre,
                                    registro.cultivoNombre,
                                    ...(
                                        registro.trabajadorNombres
                                        ||
                                        []
                                    ),
                                    registro.maquinariaNombre,
                                    registro.productoNombre,
                                    registro.descripcion,
                                    registro.observaciones
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


        return registros
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
    // HOY
    // =====================================================

    obtenerRegistrosHoy(
        registros
    ) {

        const hoy =
            StorageService
                .obtenerFechaLocal(
                    new Date()
                );


        return registros.filter(
            registro =>
                registro.fecha ===
                hoy
        );

    }


    // =====================================================
    // VACÍO
    // =====================================================

    crearVacio() {

        return `

            <div class="cuaderno-empty">

                <div class="cuaderno-empty-icon">
                    📖
                </div>


                <h3>
                    No hay actuaciones registradas
                </h3>


                <p>
                    Las actuaciones realizadas en tus fincas
                    aparecerán aquí.
                </p>

            </div>

        `;

    }


    // =====================================================
    // ICONO
    // =====================================================

    obtenerIcono(
        tipo
    ) {

        const iconos = {

            "Riego":
                "💧",

            "Poda":
                "✂️",

            "Abonado":
                "🧪",

            "Tratamiento fitosanitario":
                "🛡️",

            "Recolección":
                "🍎",

            "Laboreo":
                "🚜",

            "Siembra / plantación":
                "🌱",

            "Mantenimiento":
                "🔧",

            "Otro":
                "📝"

        };


        return (
            iconos[tipo]
            ||
            "📖"
        );

    }

}