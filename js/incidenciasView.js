import {
    EvidenciasService
} from "./evidenciasService.js";


export class IncidenciasView {

    constructor(
        mainContent,
        incidenciaService,
        fincaService,
        trabajoService,
        trabajadorService
    ) {

        this.mainContent =
            mainContent;

        this.incidenciaService =
            incidenciaService;

        this.fincaService =
            fincaService;

        this.trabajoService =
            trabajoService;

        this.trabajadorService =
            trabajadorService;

        this.archivosPendientes =
            [];

        this.subiendoEvidencias =
            false;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        this.insertarEstilosEvidencias();


        const incidencias =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerTodas()
            );


        const abiertas =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerAbiertas()
            )
                .length;


        const revision =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerEnRevision()
            )
                .length;


        const resueltas =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerResueltas()
            )
                .length;


        const urgentes =
            this.obtenerListaSegura(
                () =>
                    this.incidenciaService
                        .obtenerUrgentesActivas()
            )
                .length;


        this.mainContent.innerHTML = `

            <div class="incidencias-page">

                <section class="incidencias-hero">

                    <div class="incidencias-hero-content">

                        <span class="incidencias-eyebrow">
                            ⚠️ PERSONAL
                        </span>

                        <h1>
                            Detecta el problema,
                            <span>
                                actúa a tiempo.
                            </span>
                        </h1>

                        <p>
                            Registra averías, problemas en cultivo,
                            incidencias de seguridad y cualquier aviso
                            que requiera atención en la explotación.
                        </p>

                        <button
                            id="nuevaIncidencia"
                            class="primary-button incidencias-hero-button"
                            type="button"
                        >
                            + Nueva incidencia
                        </button>

                    </div>


                    <div class="incidencias-hero-image">

                        <div class="incidencias-hero-badge">

                            <span>
                                Incidencias activas
                            </span>

                            <strong>
                                ${abiertas + revision}
                            </strong>

                        </div>


                        <div class="incidencias-hero-copy">

                            <small>
                                DETECTA · COMUNICA · RESUELVE
                            </small>

                            <strong>
                                Ningún problema<br>
                                pasa desapercibido
                            </strong>

                        </div>

                    </div>

                </section>


                <section class="stats incidencias-stats">

                    ${this.crearStat(
                        "⚠️",
                        "Abiertas",
                        abiertas
                    )}

                    ${this.crearStat(
                        "🔎",
                        "En revisión",
                        revision
                    )}

                    ${this.crearStat(
                        "✅",
                        "Resueltas",
                        resueltas
                    )}

                    ${this.crearStat(
                        "🚨",
                        "Urgentes",
                        urgentes
                    )}

                </section>


                <div class="incidencias-section-header">

                    <div>

                        <span class="incidencias-section-eyebrow">
                            CONTROL DE INCIDENCIAS
                        </span>

                        <h2>
                            Avisos de la explotación
                        </h2>

                        <p>
                            Consulta el estado, prioridad, evidencias y origen
                            de cada incidencia registrada.
                        </p>

                    </div>


                    <span class="incidencias-count">

                        ${incidencias.length}

                        ${
                            incidencias.length === 1
                                ? "incidencia"
                                : "incidencias"
                        }

                    </span>

                </div>


                <div
                    id="listaIncidencias"
                    class="incidencias-grid"
                >

                    ${
                        incidencias.length === 0
                            ? this.crearVacio()
                            : incidencias
                                .map(
                                    incidencia =>
                                        this.crearTarjeta(
                                            incidencia
                                        )
                                )
                                .join("")
                    }

                </div>

            </div>

        `;


        document
            .getElementById(
                "nuevaIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
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

            <article class="card">

                <span class="card-icon">
                    ${icono}
                </span>

                <div>

                    <p>
                        ${this.escapar(
                            titulo
                        )}
                    </p>

                    <h3>
                        ${valor}
                    </h3>

                </div>

            </article>

        `;

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        incidencia
    ) {

        const prioridad =
            incidencia.prioridad
            ||
            "Media";


        const estado =
            incidencia.estado
            ||
            "Abierta";


        const icono =
            this.obtenerIconoTipo(
                incidencia.tipo
            );


        const evidencias =
            Array.isArray(
                incidencia.evidencias
            )
                ? incidencia.evidencias
                : [];


        return `

            <article class="incidencia-card">

                <div class="incidencia-card-top">

                    <div class="incidencia-card-main">

                        <span class="incidencia-card-icon">
                            ${icono}
                        </span>

                        <div>

                            <span class="incidencia-card-kicker">
                                INCIDENCIA
                            </span>

                            <h3>
                                ${this.escapar(
                                    incidencia.tipo
                                    ||
                                    "Incidencia"
                                )}
                            </h3>

                            <p>
                                ${
                                    incidencia.fincaNombre
                                        ? `📍 ${this.escapar(
                                            incidencia.fincaNombre
                                        )}`
                                        : "Sin finca concreta"
                                }
                            </p>

                        </div>

                    </div>


                    <span
                        class="incidencia-priority ${this.obtenerClasePrioridad(
                            prioridad
                        )}"
                    >
                        ${this.escapar(
                            prioridad
                        )}
                    </span>

                </div>


                <div class="incidencia-status-row">

                    <span
                        class="incidencia-status ${this.obtenerClaseEstado(
                            estado
                        )}"
                    >
                        ● ${this.escapar(
                            estado
                        )}
                    </span>


                    <span class="incidencia-date">

                        🕒
                        ${this.formatearFechaHora(
                            incidencia.fechaCreacion
                        )}

                    </span>

                </div>


                ${
                    incidencia.trabajoNombre
                    ||
                    incidencia.trabajadorNombre

                        ? `

                            <div class="incidencia-relations">

                                ${
                                    incidencia.trabajoNombre

                                        ? `

                                            <div>

                                                <span>
                                                    📋
                                                </span>

                                                <div>

                                                    <small>
                                                        Tarea
                                                    </small>

                                                    <strong>
                                                        ${this.escapar(
                                                            incidencia.trabajoNombre
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                        `

                                        : ""
                                }


                                ${
                                    incidencia.trabajadorNombre

                                        ? `

                                            <div>

                                                <span>
                                                    👷
                                                </span>

                                                <div>

                                                    <small>
                                                        Comunicada por
                                                    </small>

                                                    <strong>
                                                        ${this.escapar(
                                                            incidencia.trabajadorNombre
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


                <div class="incidencia-description">

                    <span>
                        DESCRIPCIÓN
                    </span>

                    <p>
                        ${this.escapar(
                            incidencia.descripcion
                            ||
                            "Sin descripción."
                        )}
                    </p>

                </div>


                <div class="gc-evidence-summary">

                    <div>

                        <span class="gc-evidence-summary-icon">
                            📎
                        </span>

                        <div>

                            <small>
                                EVIDENCIAS
                            </small>

                            <strong>

                                ${evidencias.length}

                                ${
                                    evidencias.length === 1
                                        ? "archivo"
                                        : "archivos"
                                }

                            </strong>

                        </div>

                    </div>


                    <button
                        class="secondary-button incidencia-evidencias"
                        data-id="${this.escapar(
                            incidencia.id
                        )}"
                        type="button"
                    >
                        📷 Ver / añadir
                    </button>

                </div>


                ${
                    estado ===
                    "Resuelta"

                        ? `

                            <div class="incidencia-resolution">

                                <div>

                                    <span>
                                        ✅
                                    </span>

                                    <div>

                                        <strong>
                                            Incidencia resuelta
                                        </strong>

                                        <p>
                                            ${this.formatearFechaHora(
                                                incidencia.fechaResolucion
                                            )}
                                        </p>

                                    </div>

                                </div>


                                ${
                                    incidencia.observacionesResolucion

                                        ? `

                                            <p class="incidencia-resolution-notes">

                                                ${this.escapar(
                                                    incidencia.observacionesResolucion
                                                )}

                                            </p>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }


                <div class="incidencia-actions">

                    ${
                        estado !==
                        "Resuelta"

                            ? `

                                ${
                                    estado !==
                                    "En revisión"

                                        ? `

                                            <button
                                                class="secondary-button incidencia-revision"
                                                data-id="${this.escapar(
                                                    incidencia.id
                                                )}"
                                                type="button"
                                            >
                                                🔎 En revisión
                                            </button>

                                        `

                                        : ""
                                }


                                <button
                                    class="primary-button incidencia-resolver"
                                    data-id="${this.escapar(
                                        incidencia.id
                                    )}"
                                    type="button"
                                >
                                    ✓ Resolver
                                </button>

                            `

                            : `

                                <button
                                    class="secondary-button incidencia-reabrir"
                                    data-id="${this.escapar(
                                        incidencia.id
                                    )}"
                                    type="button"
                                >
                                    ↩ Reabrir incidencia
                                </button>

                            `
                    }

                </div>

            </article>

        `;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .getElementById(
                "crearPrimeraIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        document
            .querySelectorAll(
                ".incidencia-evidencias"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.mostrarEvidencias(
                                boton.dataset.id
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".incidencia-revision"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.cambiarEstado(
                                boton.dataset.id,
                                "En revisión"
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".incidencia-resolver"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const observaciones =
                                prompt(
                                    "¿Cómo se ha resuelto la incidencia? Puedes dejarlo vacío."
                                )
                                ||
                                "";


                            this.cambiarEstado(
                                boton.dataset.id,
                                "Resuelta",
                                observaciones
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".incidencia-reabrir"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.cambiarEstado(
                                boton.dataset.id,
                                "Abierta"
                            )
                    );

                }
            );

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        estado,
        observaciones = ""
    ) {

        const resultado =
            this.incidenciaService
                .cambiarEstado(
                    id,
                    estado,
                    observaciones
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido actualizar la incidencia."
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario() {

        this.insertarEstilosEvidencias();


        this.archivosPendientes =
            [];


        const fincas =
            this.obtenerListaSegura(
                () =>
                    this.fincaService
                        .obtenerTodas()
            );


        const trabajos =
            this.obtenerListaSegura(
                () =>
                    this.trabajoService
                        .obtenerTodos()
            );


        const trabajadores =
            this.obtenerListaSegura(
                () =>
                    this.trabajadorService
                        .obtenerTodos()
            );


        this.mainContent.innerHTML = `

            <div class="incidencia-form-page">

                <button
                    id="volverIncidencias"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="incidencia-form-header">

                    <span>
                        ⚠️ PERSONAL
                    </span>

                    <h1>
                        Nueva incidencia
                    </h1>

                    <p>
                        Registra un problema o aviso relacionado
                        con la explotación y añade fotografías o documentos.
                    </p>

                </header>


                <div class="incidencia-form-layout">

                    <section class="form-panel incidencia-form-panel">

                        <div class="incidencia-form-section">

                            <span>
                                ⚠️
                            </span>

                            <div>

                                <h3>
                                    Datos de la incidencia
                                </h3>

                                <p>
                                    Describe qué ha ocurrido
                                    y dónde se ha detectado.
                                </p>

                            </div>

                        </div>


                        <div class="incidencia-form-grid">

                            <div class="form-group">

                                <label for="tipoIncidencia">
                                    Tipo *
                                </label>

                                <select id="tipoIncidencia">

                                    <option value="Avería">
                                        Avería
                                    </option>

                                    <option value="Falta de material">
                                        Falta de material
                                    </option>

                                    <option value="Problema en cultivo">
                                        Problema en cultivo
                                    </option>

                                    <option value="Plaga / enfermedad">
                                        Plaga / enfermedad
                                    </option>

                                    <option value="Riego">
                                        Riego
                                    </option>

                                    <option value="Maquinaria">
                                        Maquinaria
                                    </option>

                                    <option value="Seguridad">
                                        Seguridad
                                    </option>

                                    <option value="Otro">
                                        Otro
                                    </option>

                                </select>

                            </div>


                            <div class="form-group">

                                <label for="prioridadIncidencia">
                                    Prioridad
                                </label>

                                <select id="prioridadIncidencia">

                                    <option value="Baja">
                                        Baja
                                    </option>

                                    <option
                                        value="Media"
                                        selected
                                    >
                                        Media
                                    </option>

                                    <option value="Alta">
                                        Alta
                                    </option>

                                    <option value="Urgente">
                                        Urgente
                                    </option>

                                </select>

                            </div>


                            <div class="form-group">

                                <label for="fincaIncidencia">
                                    Finca
                                </label>

                                <select id="fincaIncidencia">

                                    <option value="">
                                        Sin finca concreta
                                    </option>

                                    ${fincas
                                        .map(
                                            finca => `

                                                <option
                                                    value="${this.escapar(
                                                        finca.id
                                                    )}"
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


                            <div class="form-group">

                                <label for="trabajoIncidencia">
                                    Tarea relacionada
                                </label>

                                <select id="trabajoIncidencia">

                                    <option value="">
                                        Sin tarea relacionada
                                    </option>

                                    ${trabajos
                                        .map(
                                            trabajo => `

                                                <option
                                                    value="${this.escapar(
                                                        trabajo.id
                                                    )}"
                                                >
                                                    ${this.escapar(
                                                        trabajo.titulo
                                                        ||
                                                        trabajo.nombre
                                                        ||
                                                        "Tarea"
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group incidencia-form-wide">

                                <label for="trabajadorIncidencia">
                                    Trabajador que comunica
                                </label>

                                <select id="trabajadorIncidencia">

                                    <option value="">
                                        Administración
                                    </option>

                                    ${trabajadores
                                        .map(
                                            trabajador => `

                                                <option
                                                    value="${this.escapar(
                                                        trabajador.id
                                                    )}"
                                                >
                                                    ${this.escapar(
                                                        this.obtenerNombreTrabajador(
                                                            trabajador
                                                        )
                                                    )}
                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </div>


                            <div class="form-group incidencia-form-wide">

                                <label for="descripcionIncidencia">
                                    Descripción *
                                </label>

                                <textarea
                                    id="descripcionIncidencia"
                                    rows="6"
                                    placeholder="Explica qué ha ocurrido..."
                                ></textarea>

                            </div>


                            <div class="form-group incidencia-form-wide">

                                <label>
                                    Evidencias
                                </label>

                                <div class="gc-evidence-picker">

                                    <div class="gc-evidence-picker-copy">

                                        <span>
                                            📷
                                        </span>

                                        <div>

                                            <strong>
                                                Fotos y documentos
                                            </strong>

                                            <p>
                                                JPG, PNG, WEBP o PDF · máximo 10 MB por archivo.
                                            </p>

                                        </div>

                                    </div>


                                    <div class="gc-evidence-picker-actions">

                                        <label
                                            class="secondary-button gc-evidence-file-button"
                                            for="evidenciasIncidencia"
                                        >
                                            📎 Elegir archivos
                                        </label>

                                        <input
                                            id="evidenciasIncidencia"
                                            class="gc-evidence-input"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,application/pdf"
                                            multiple
                                        >


                                        <label
                                            class="primary-button gc-evidence-file-button"
                                            for="fotoIncidencia"
                                        >
                                            📷 Hacer foto
                                        </label>

                                        <input
                                            id="fotoIncidencia"
                                            class="gc-evidence-input"
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                        >

                                    </div>

                                </div>


                                <div
                                    id="evidenciasPendientes"
                                    class="gc-evidence-pending"
                                ></div>

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarIncidencia"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarIncidencia"
                                class="primary-button"
                                type="button"
                            >
                                Guardar incidencia
                            </button>

                        </div>

                    </section>


                    <aside class="incidencia-form-aside">

                        <div class="incidencia-form-photo">

                            <div>

                                <span>
                                    DETECCIÓN TEMPRANA
                                </span>

                                <strong>
                                    Ver el problema
                                    es empezar a resolverlo.
                                </strong>

                            </div>

                        </div>


                        <div class="incidencia-form-tip">

                            <span>
                                ⚡
                            </span>

                            <div>

                                <strong>
                                    Prioriza correctamente
                                </strong>

                                <p>
                                    Usa prioridad urgente solo para
                                    incidencias que necesitan atención
                                    inmediata.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverIncidencias"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarIncidencia"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.guardarFormulario()
            );


        document
            .getElementById(
                "evidenciasIncidencia"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.agregarArchivosPendientes(
                        event.target.files
                    )
            );


        document
            .getElementById(
                "fotoIncidencia"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.agregarArchivosPendientes(
                        event.target.files
                    )
            );

    }


    // =====================================================
    // ARCHIVOS PENDIENTES
    // =====================================================

    agregarArchivosPendientes(
        fileList
    ) {

        const nuevos =
            Array.from(
                fileList
                ||
                []
            );


        nuevos.forEach(
            archivo => {

                const repetido =
                    this.archivosPendientes
                        .some(
                            actual =>
                                actual.name ===
                                archivo.name
                                &&
                                actual.size ===
                                archivo.size
                                &&
                                actual.lastModified ===
                                archivo.lastModified
                        );


                if (
                    !repetido
                ) {

                    this.archivosPendientes.push(
                        archivo
                    );

                }

            }
        );


        this.pintarArchivosPendientes();

    }


    // =====================================================
    // PINTAR PENDIENTES
    // =====================================================

    pintarArchivosPendientes() {

        const contenedor =
            document.getElementById(
                "evidenciasPendientes"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            this.archivosPendientes.length ===
            0
        ) {

            contenedor.innerHTML =
                "";

            return;

        }


        contenedor.innerHTML =
            this.archivosPendientes
                .map(
                    (
                        archivo,
                        indice
                    ) => `

                        <div class="gc-evidence-pending-item">

                            <span>

                                ${
                                    archivo.type ===
                                    "application/pdf"

                                        ? "📄"

                                        : "🖼️"
                                }

                            </span>

                            <div>

                                <strong>
                                    ${this.escapar(
                                        archivo.name
                                    )}
                                </strong>

                                <small>
                                    ${EvidenciasService.formatearTamano(
                                        archivo.size
                                    )}
                                </small>

                            </div>

                            <button
                                class="gc-evidence-remove-pending"
                                data-index="${indice}"
                                type="button"
                                aria-label="Quitar archivo"
                            >
                                ×
                            </button>

                        </div>

                    `
                )
                .join("");


        contenedor
            .querySelectorAll(
                ".gc-evidence-remove-pending"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const indice =
                                Number(
                                    boton.dataset.index
                                );


                            this.archivosPendientes.splice(
                                indice,
                                1
                            );


                            this.pintarArchivosPendientes();

                        }
                    );

                }
            );

    }


    // =====================================================
    // GUARDAR FORMULARIO
    // =====================================================

    async guardarFormulario() {

        if (
            this.subiendoEvidencias
        ) {

            return;

        }


        const descripcion =
            document
                .getElementById(
                    "descripcionIncidencia"
                )
                ?.value
                .trim()
            ||
            "";


        if (
            !descripcion
        ) {

            alert(
                "Escribe una descripción de la incidencia."
            );

            return;

        }


        const botonGuardar =
            document.getElementById(
                "guardarIncidencia"
            );


        const resultado =
            this.incidenciaService
                .crear(
                    {

                        tipo:
                            document
                                .getElementById(
                                    "tipoIncidencia"
                                )
                                ?.value,

                        prioridad:
                            document
                                .getElementById(
                                    "prioridadIncidencia"
                                )
                                ?.value,

                        fincaId:
                            document
                                .getElementById(
                                    "fincaIncidencia"
                                )
                                ?.value
                            ||
                            null,

                        trabajoId:
                            document
                                .getElementById(
                                    "trabajoIncidencia"
                                )
                                ?.value
                            ||
                            null,

                        trabajadorId:
                            document
                                .getElementById(
                                    "trabajadorIncidencia"
                                )
                                ?.value
                            ||
                            null,

                        descripcion,

                        origen:
                            "Administración"

                    }
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido registrar la incidencia."
            );

            return;

        }


        const incidencia =
            resultado.incidencia;


        if (
            this.archivosPendientes.length ===
            0
        ) {

            this.mostrar();

            return;

        }


        this.subiendoEvidencias =
            true;


        if (
            botonGuardar
        ) {

            botonGuardar.disabled =
                true;

            botonGuardar.textContent =
                "Subiendo evidencias…";

        }


        let fallos =
            0;


        for (
            const archivo
            of this.archivosPendientes
        ) {

            const subida =
                await EvidenciasService
                    .subir(
                        "incidencias",
                        incidencia.id,
                        archivo
                    );


            if (
                !subida?.ok
            ) {

                fallos++;

                continue;

            }


            const asociada =
                this.incidenciaService
                    .agregarEvidencia(
                        incidencia.id,
                        subida.evidencia
                    );


            if (
                !asociada?.ok
            ) {

                fallos++;


                await EvidenciasService
                    .eliminar(
                        subida.evidencia.ruta
                    );

            }

        }


        this.subiendoEvidencias =
            false;


        this.archivosPendientes =
            [];


        if (
            fallos > 0
        ) {

            alert(
                `La incidencia se ha guardado, pero ${fallos} archivo(s) no se pudieron subir.`
            );

        }


        this.mostrar();

    }


    // =====================================================
    // EVIDENCIAS
    // =====================================================

    mostrarEvidencias(
        incidenciaId
    ) {

        this.insertarEstilosEvidencias();


        const incidencia =
            this.incidenciaService
                .obtenerPorId(
                    incidenciaId
                );


        if (
            !incidencia
        ) {

            alert(
                "La incidencia no existe."
            );


            this.mostrar();

            return;

        }


        const evidencias =
            this.incidenciaService
                .obtenerEvidencias(
                    incidencia.id
                );


        this.mainContent.innerHTML = `

            <div class="incidencia-form-page">

                <button
                    id="volverDesdeEvidencias"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="incidencia-form-header">

                    <span>
                        📎 EVIDENCIAS
                    </span>

                    <h1>
                        ${this.escapar(
                            incidencia.tipo
                            ||
                            "Incidencia"
                        )}
                    </h1>

                    <p>
                        ${this.escapar(
                            incidencia.descripcion
                            ||
                            ""
                        )}
                    </p>

                </header>


                <section class="form-panel gc-evidence-manager">

                    <div class="gc-evidence-manager-head">

                        <div>

                            <span class="incidencias-section-eyebrow">
                                ARCHIVOS DE LA INCIDENCIA
                            </span>

                            <h2>
                                Fotos y documentos
                            </h2>

                            <p>
                                Los archivos están guardados de forma privada en la nube.
                            </p>

                        </div>


                        <span class="incidencias-count">

                            ${evidencias.length}

                            ${
                                evidencias.length === 1
                                    ? "archivo"
                                    : "archivos"
                            }

                        </span>

                    </div>


                    <div class="gc-evidence-manager-upload">

                        <label
                            class="secondary-button gc-evidence-file-button"
                            for="anadirEvidencias"
                        >
                            📎 Elegir archivos
                        </label>

                        <input
                            id="anadirEvidencias"
                            class="gc-evidence-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            multiple
                        >


                        <label
                            class="primary-button gc-evidence-file-button"
                            for="anadirFoto"
                        >
                            📷 Hacer foto
                        </label>

                        <input
                            id="anadirFoto"
                            class="gc-evidence-input"
                            type="file"
                            accept="image/*"
                            capture="environment"
                        >

                    </div>


                    <div class="gc-evidence-grid">

                        ${
                            evidencias.length === 0

                                ? `

                                    <div class="gc-evidence-empty">

                                        <span>
                                            📷
                                        </span>

                                        <strong>
                                            Sin evidencias todavía
                                        </strong>

                                        <p>
                                            Añade una foto o un PDF para documentar la incidencia.
                                        </p>

                                    </div>

                                `

                                : evidencias
                                    .map(
                                        evidencia =>
                                            this.crearTarjetaEvidencia(
                                                incidencia,
                                                evidencia
                                            )
                                    )
                                    .join("")
                        }

                    </div>

                </section>

            </div>

        `;


        document
            .getElementById(
                "volverDesdeEvidencias"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "anadirEvidencias"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.subirArchivosAIncidencia(
                        incidencia.id,
                        event.target.files
                    )
            );


        document
            .getElementById(
                "anadirFoto"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.subirArchivosAIncidencia(
                        incidencia.id,
                        event.target.files
                    )
            );


        document
            .querySelectorAll(
                ".gc-evidence-open"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.abrirEvidencia(
                                boton.dataset.ruta
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".gc-evidence-delete"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.eliminarEvidencia(
                                incidencia.id,
                                boton.dataset.evidenciaId,
                                boton.dataset.ruta
                            )
                    );

                }
            );

    }


    // =====================================================
    // TARJETA EVIDENCIA
    // =====================================================

    crearTarjetaEvidencia(
        incidencia,
        evidencia
    ) {

        const imagen =
            EvidenciasService
                .esImagen(
                    evidencia
                );


        return `

            <article class="gc-evidence-card">

                <div class="gc-evidence-card-icon">

                    ${
                        imagen
                            ? "🖼️"
                            : "📄"
                    }

                </div>


                <div class="gc-evidence-card-body">

                    <strong
                        title="${this.escapar(
                            evidencia.nombre
                            ||
                            "Archivo"
                        )}"
                    >
                        ${this.escapar(
                            evidencia.nombre
                            ||
                            "Archivo"
                        )}
                    </strong>

                    <span>

                        ${EvidenciasService.formatearTamano(
                            evidencia.tamano
                        )}

                        ·

                        ${this.formatearFechaHora(
                            evidencia.fecha
                        )}

                    </span>

                </div>


                <div class="gc-evidence-card-actions">

                    <button
                        class="secondary-button gc-evidence-open"
                        data-ruta="${this.escapar(
                            evidencia.ruta
                        )}"
                        type="button"
                    >
                        Abrir
                    </button>


                    <button
                        class="gc-evidence-delete"
                        data-evidencia-id="${this.escapar(
                            evidencia.id
                        )}"
                        data-ruta="${this.escapar(
                            evidencia.ruta
                        )}"
                        type="button"
                        aria-label="Eliminar evidencia"
                    >
                        🗑️
                    </button>

                </div>

            </article>

        `;

    }


    // =====================================================
    // SUBIR ARCHIVOS
    // =====================================================

    async subirArchivosAIncidencia(
        incidenciaId,
        fileList
    ) {

        if (
            this.subiendoEvidencias
        ) {

            return;

        }


        const archivos =
            Array.from(
                fileList
                ||
                []
            );


        if (
            archivos.length ===
            0
        ) {

            return;

        }


        this.subiendoEvidencias =
            true;


        let fallos =
            0;


        for (
            const archivo
            of archivos
        ) {

            const subida =
                await EvidenciasService
                    .subir(
                        "incidencias",
                        incidenciaId,
                        archivo
                    );


            if (
                !subida?.ok
            ) {

                fallos++;

                continue;

            }


            const asociada =
                this.incidenciaService
                    .agregarEvidencia(
                        incidenciaId,
                        subida.evidencia
                    );


            if (
                !asociada?.ok
            ) {

                fallos++;


                await EvidenciasService
                    .eliminar(
                        subida.evidencia.ruta
                    );

            }

        }


        this.subiendoEvidencias =
            false;


        if (
            fallos > 0
        ) {

            alert(
                `${fallos} archivo(s) no se pudieron subir.`
            );

        }


        this.mostrarEvidencias(
            incidenciaId
        );

    }


    // =====================================================
    // ABRIR EVIDENCIA
    // =====================================================

    async abrirEvidencia(
        ruta
    ) {

        /*
         * Abrimos la pestaña antes del await para evitar
         * que Safari/iOS bloquee la apertura.
         */

        const ventana =
            window.open(
                "",
                "_blank"
            );


        const resultado =
            await EvidenciasService
                .obtenerUrl(
                    ruta,
                    3600
                );


        if (
            !resultado?.ok
            ||
            !resultado.url
        ) {

            ventana?.close();


            alert(
                resultado?.mensaje
                ||
                "No se ha podido abrir el archivo."
            );

            return;

        }


        if (
            ventana
        ) {

            ventana.opener =
                null;


            ventana.location.href =
                resultado.url;


            return;

        }


        window.location.href =
            resultado.url;

    }


    // =====================================================
    // ELIMINAR EVIDENCIA
    // =====================================================

    async eliminarEvidencia(
        incidenciaId,
        evidenciaId,
        ruta
    ) {

        if (
            !window.confirm(
                "¿Quieres eliminar esta evidencia?"
            )
        ) {

            return;

        }


        const borrado =
            await EvidenciasService
                .eliminar(
                    ruta
                );


        if (
            !borrado?.ok
        ) {

            alert(
                borrado?.mensaje
                ||
                "No se ha podido eliminar el archivo."
            );

            return;

        }


        const quitada =
            this.incidenciaService
                .quitarEvidencia(
                    incidenciaId,
                    evidenciaId
                );


        if (
            !quitada?.ok
        ) {

            alert(
                quitada?.mensaje
                ||
                "El archivo se eliminó de la nube, pero no se pudo actualizar la incidencia."
            );

            return;

        }


        this.mostrarEvidencias(
            incidenciaId
        );

    }


    // =====================================================
    // ICONO
    // =====================================================

    obtenerIconoTipo(
        tipo
    ) {

        const iconos = {

            "Avería":
                "🔧",

            "Falta de material":
                "📦",

            "Problema en cultivo":
                "🌱",

            "Plaga / enfermedad":
                "🐛",

            "Riego":
                "💧",

            "Maquinaria":
                "🚜",

            "Seguridad":
                "🦺",

            "Otro":
                "⚠️"

        };


        return (
            iconos[
                tipo
            ]
            ||
            "⚠️"
        );

    }


    // =====================================================
    // PRIORIDAD
    // =====================================================

    obtenerClasePrioridad(
        prioridad
    ) {

        const clases = {

            Baja:
                "prioridad-baja",

            Media:
                "prioridad-media",

            Alta:
                "prioridad-alta",

            Urgente:
                "prioridad-urgente"

        };


        return (
            clases[
                prioridad
            ]
            ||
            "prioridad-media"
        );

    }


    // =====================================================
    // ESTADO
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        const clases = {

            Abierta:
                "estado-abierta",

            "En revisión":
                "estado-revision",

            Resuelta:
                "estado-resuelta"

        };


        return (
            clases[
                estado
            ]
            ||
            "estado-abierta"
        );

    }


    // =====================================================
    // NOMBRE TRABAJADOR
    // =====================================================

    obtenerNombreTrabajador(
        trabajador
    ) {

        if (
            !trabajador
        ) {

            return "";

        }


        if (
            typeof this.trabajadorService
                ?.obtenerNombreCompleto ===
            "function"
        ) {

            return (
                this.trabajadorService
                    .obtenerNombreCompleto(
                        trabajador
                    )
                ||
                ""
            );

        }


        return [
            trabajador.nombre,
            trabajador.apellidos
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            );

    }


    // =====================================================
    // LISTA SEGURA
    // =====================================================

    obtenerListaSegura(
        callback
    ) {

        try {

            const resultado =
                callback();


            return Array.isArray(
                resultado
            )
                ? resultado
                : [];

        }

        catch (
            error
        ) {

            console.error(
                "Error obteniendo datos de incidencias:",
                error
            );


            return [];

        }

    }


    // =====================================================
    // VACÍO
    // =====================================================

    crearVacio() {

        return `

            <div class="empty-state incidencias-empty">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    No hay incidencias registradas
                </h3>

                <p>
                    Cuando se detecte un problema en la explotación,
                    regístralo para poder hacer seguimiento.
                </p>

                <button
                    id="crearPrimeraIncidencia"
                    class="primary-button"
                    type="button"
                >
                    + Nueva incidencia
                </button>

            </div>

        `;

    }


    // =====================================================
    // FECHA
    // =====================================================

    formatearFechaHora(
        valor
    ) {

        if (
            !valor
        ) {

            return "—";

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

            return "—";

        }


        return fecha
            .toLocaleString(
                "es-ES",
                {

                    day:
                        "2-digit",

                    month:
                        "2-digit",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"

                }
            );

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


    // =====================================================
    // ESTILOS EVIDENCIAS
    // =====================================================

    insertarEstilosEvidencias() {

        if (
            document.getElementById(
                "gc-evidence-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "gc-evidence-styles";


        style.textContent = `

            .gc-evidence-summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-top: 14px;
                padding: 11px 12px;
                border: 1px solid #e1e9e4;
                border-radius: 12px;
                background: #f8fbf9;
            }

            .gc-evidence-summary > div {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 0;
            }

            .gc-evidence-summary-icon {
                display: grid;
                place-items: center;
                width: 34px;
                height: 34px;
                flex: 0 0 34px;
                border-radius: 10px;
                background: #eaf4ee;
            }

            .gc-evidence-summary small,
            .gc-evidence-summary strong {
                display: block;
            }

            .gc-evidence-summary small {
                color: #6d7d74;
                font-size: 8px;
                font-weight: 800;
                letter-spacing: .08em;
            }

            .gc-evidence-summary strong {
                margin-top: 2px;
                color: #183d2d;
                font-size: 12px;
            }

            .gc-evidence-picker {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 14px;
                padding: 14px;
                border: 1px dashed #b9cdc1;
                border-radius: 14px;
                background: #f8fbf9;
            }

            .gc-evidence-picker-copy {
                display: flex;
                align-items: center;
                gap: 11px;
                min-width: 0;
            }

            .gc-evidence-picker-copy > span {
                display: grid;
                place-items: center;
                width: 40px;
                height: 40px;
                flex: 0 0 40px;
                border-radius: 12px;
                background: #e8f3ec;
                font-size: 18px;
            }

            .gc-evidence-picker-copy strong,
            .gc-evidence-picker-copy p {
                display: block;
                margin: 0;
            }

            .gc-evidence-picker-copy strong {
                color: #193d2e;
                font-size: 13px;
            }

            .gc-evidence-picker-copy p {
                margin-top: 3px;
                color: #708078;
                font-size: 11px;
            }

            .gc-evidence-picker-actions,
            .gc-evidence-manager-upload {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
            }

            .gc-evidence-input {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }

            .gc-evidence-file-button {
                margin: 0;
                cursor: pointer;
            }

            .gc-evidence-pending {
                display: grid;
                gap: 8px;
                margin-top: 10px;
            }

            .gc-evidence-pending-item {
                display: grid;
                grid-template-columns: 32px minmax(0, 1fr) 30px;
                align-items: center;
                gap: 9px;
                padding: 9px 10px;
                border: 1px solid #e1e9e4;
                border-radius: 10px;
                background: white;
            }

            .gc-evidence-pending-item strong,
            .gc-evidence-pending-item small {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .gc-evidence-pending-item strong {
                color: #213c30;
                font-size: 11px;
            }

            .gc-evidence-pending-item small {
                margin-top: 2px;
                color: #78857f;
                font-size: 9px;
            }

            .gc-evidence-remove-pending,
            .gc-evidence-delete {
                display: grid;
                place-items: center;
                width: 30px;
                height: 30px;
                padding: 0;
                border: 1px solid #ecd9d9;
                border-radius: 8px;
                background: #fff8f8;
                color: #9b3636;
                cursor: pointer;
            }

            .gc-evidence-manager {
                margin-top: 14px;
            }

            .gc-evidence-manager-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 14px;
                margin-bottom: 16px;
            }

            .gc-evidence-manager-head h2 {
                margin: 3px 0 4px;
                color: #192a22;
                font-family: Georgia, "Times New Roman", serif;
                font-size: 25px;
            }

            .gc-evidence-manager-head p {
                margin: 0;
                color: #6d7b73;
                font-size: 11px;
            }

            .gc-evidence-manager-upload {
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid #e4eae6;
            }

            .gc-evidence-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
            }

            .gc-evidence-card {
                display: grid;
                grid-template-columns: 42px minmax(0, 1fr) auto;
                align-items: center;
                gap: 10px;
                padding: 12px;
                border: 1px solid #e0e8e3;
                border-radius: 13px;
                background: #fff;
            }

            .gc-evidence-card-icon {
                display: grid;
                place-items: center;
                width: 42px;
                height: 42px;
                border-radius: 11px;
                background: #edf5f0;
                font-size: 19px;
            }

            .gc-evidence-card-body {
                min-width: 0;
            }

            .gc-evidence-card-body strong,
            .gc-evidence-card-body span {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .gc-evidence-card-body strong {
                color: #18392b;
                font-size: 11px;
            }

            .gc-evidence-card-body span {
                margin-top: 3px;
                color: #758078;
                font-size: 9px;
            }

            .gc-evidence-card-actions {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .gc-evidence-empty {
                grid-column: 1 / -1;
                padding: 34px 20px;
                border: 1px dashed #cad8d0;
                border-radius: 14px;
                text-align: center;
                background: #fafcfb;
            }

            .gc-evidence-empty > span {
                display: block;
                margin-bottom: 7px;
                font-size: 28px;
            }

            .gc-evidence-empty strong {
                display: block;
                color: #1a3f2f;
                font-size: 13px;
            }

            .gc-evidence-empty p {
                max-width: 360px;
                margin: 5px auto 0;
                color: #718078;
                font-size: 11px;
                line-height: 1.5;
            }


            @media (max-width: 760px) {

                .gc-evidence-summary,
                .gc-evidence-picker,
                .gc-evidence-manager-head {
                    align-items: stretch;
                    flex-direction: column;
                }

                .gc-evidence-summary .incidencia-evidencias {
                    width: 100%;
                }

                .gc-evidence-picker-actions,
                .gc-evidence-manager-upload {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    width: 100%;
                }

                .gc-evidence-file-button {
                    width: 100%;
                    min-height: 40px;
                }

                .gc-evidence-grid {
                    grid-template-columns: 1fr;
                }

                .gc-evidence-card {
                    grid-template-columns: 38px minmax(0, 1fr);
                }

                .gc-evidence-card-actions {
                    grid-column: 1 / -1;
                    display: grid;
                    grid-template-columns: 1fr 42px;
                }

                .gc-evidence-card-actions .secondary-button {
                    width: 100%;
                }

            }


            @media (max-width: 420px) {

                .gc-evidence-picker-actions,
                .gc-evidence-manager-upload {
                    grid-template-columns: 1fr;
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}