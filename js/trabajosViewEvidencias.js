import {
    TrabajosView
} from "./trabajosView.js";

import {
    EvidenciasService
} from "./evidenciasService.js";

import {
    escaparHTML
} from "./utils.js";


export class TrabajosViewEvidencias extends TrabajosView {

    constructor(
        mainContent,
        fincaService,
        trabajoService,
        trabajadorService,
        maquinariaService,
        campaniaService
    ) {

        super(
            mainContent,
            fincaService,
            trabajoService,
            trabajadorService,
            maquinariaService,
            campaniaService
        );


        this.archivosPendientesTrabajo =
            [];

        this.subiendoEvidenciasTrabajo =
            false;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        this.insertarEstilosEvidenciasTrabajo();

        super.mostrar();

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        trabajo,
        index
    ) {

        const html =
            super.crearTarjeta(
                trabajo,
                index
            );


        const evidencias =
            Array.isArray(
                trabajo.evidencias
            )
                ? trabajo.evidencias
                : [];


        const bloque = `

            <div class="gc-work-evidence-summary">

                <div>

                    <span class="gc-work-evidence-summary-icon">
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
                    class="secondary-button trabajo-evidencias"
                    data-id="${escaparHTML(
                        trabajo.id
                    )}"
                    type="button"
                >
                    📷 Ver / añadir
                </button>

            </div>

        `;


        const marcador =
            '<div class="trabajo-state-actions">';


        if (
            html.includes(
                marcador
            )
        ) {

            return html.replace(
                marcador,
                `${bloque}${marcador}`
            );

        }


        return html;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        super.configurarEventos();


        document
            .querySelectorAll(
                ".trabajo-evidencias"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();
                            event.stopPropagation();

                            this.mostrarEvidenciasTrabajo(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        id = null
    ) {

        this.insertarEstilosEvidenciasTrabajo();

        this.archivosPendientesTrabajo =
            [];


        super.mostrarFormulario(
            id
        );


        const trabajo =
            id !== null
                ? this.trabajoService
                    .obtenerPorId(
                        id
                    )
                : null;


        const grid =
            document.querySelector(
                ".trabajo-form-grid"
            );


        if (
            !grid
        ) {

            return;

        }


        const evidenciasExistentes =
            Array.isArray(
                trabajo?.evidencias
            )
                ? trabajo.evidencias
                : [];


        grid.insertAdjacentHTML(
            "beforeend",
            `

                <div class="form-group trabajo-form-wide">

                    <label>
                        Evidencias
                    </label>

                    <div class="gc-work-evidence-picker">

                        <div class="gc-work-evidence-picker-copy">

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

                        <div class="gc-work-evidence-picker-actions">

                            <label
                                class="secondary-button gc-work-evidence-button"
                                for="evidenciasTrabajo"
                            >
                                <span>📎</span>
                                <span>Elegir archivos</span>
                            </label>

                            <input
                                id="evidenciasTrabajo"
                                class="gc-work-evidence-input"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                multiple
                            >

                            <label
                                class="primary-button gc-work-evidence-button"
                                for="fotoTrabajo"
                            >
                                <span>📷</span>
                                <span>Hacer foto</span>
                            </label>

                            <input
                                id="fotoTrabajo"
                                class="gc-work-evidence-input"
                                type="file"
                                accept="image/*"
                                capture="environment"
                            >

                        </div>

                    </div>

                    ${
                        evidenciasExistentes.length > 0
                            ? `
                                <button
                                    id="gestionarEvidenciasTrabajo"
                                    class="secondary-button gc-work-evidence-manage"
                                    type="button"
                                >
                                    📎 Gestionar ${evidenciasExistentes.length}
                                    ${
                                        evidenciasExistentes.length === 1
                                            ? "evidencia existente"
                                            : "evidencias existentes"
                                    }
                                </button>
                            `
                            : ""
                    }

                    <div
                        id="evidenciasPendientesTrabajo"
                        class="gc-work-evidence-pending"
                    ></div>

                </div>

            `
        );


        document
            .getElementById(
                "evidenciasTrabajo"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.agregarArchivosPendientesTrabajo(
                        event.target.files
                    )
            );


        document
            .getElementById(
                "fotoTrabajo"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.agregarArchivosPendientesTrabajo(
                        event.target.files
                    )
            );


        document
            .getElementById(
                "gestionarEvidenciasTrabajo"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarEvidenciasTrabajo(
                        trabajo.id
                    )
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    async guardarTrabajo(
        trabajo,
        id
    ) {

        if (
            this.subiendoEvidenciasTrabajo
        ) {

            return;

        }


        const trabajadorIds =
            [
                ...document
                    .querySelectorAll(
                        ".trabajador-tarea-checkbox:checked"
                    )
            ]
                .map(
                    checkbox =>
                        checkbox.value
                );


        const trabajadorNombres =
            trabajadorIds
                .map(
                    trabajadorId => {

                        const trabajador =
                            this.obtenerTrabajadorPorId(
                                trabajadorId
                            );


                        return this.obtenerNombreTrabajador(
                            trabajador
                        );

                    }
                )
                .filter(Boolean);


        const maquinariaId =
            document
                .getElementById(
                    "maquinariaTrabajo"
                )
                ?.value
            ||
            "";


        const maquina =
            this.obtenerMaquinariaPorId(
                maquinariaId
            );


        const datos = {

            titulo:
                document
                    .getElementById(
                        "tituloTrabajo"
                    )
                    ?.value
                ||
                "",

            tipo:
                document
                    .getElementById(
                        "tipoTrabajo"
                    )
                    ?.value
                ||
                "",

            fincaId:
                document
                    .getElementById(
                        "fincaTrabajo"
                    )
                    ?.value
                ||
                "",

            parcela:
                document
                    .getElementById(
                        "parcelaTrabajo"
                    )
                    ?.value
                ||
                "",

            cultivo:
                document
                    .getElementById(
                        "cultivoTrabajo"
                    )
                    ?.value
                ||
                "",

            campaniaId:
                document
                    .getElementById(
                        "campaniaTrabajo"
                    )
                    ?.value
                ||
                null,

            fecha:
                document
                    .getElementById(
                        "fechaTrabajo"
                    )
                    ?.value
                ||
                "",

            prioridad:
                document
                    .getElementById(
                        "prioridadTrabajo"
                    )
                    ?.value
                ||
                "Media",

            estado:
                document
                    .getElementById(
                        "estadoTrabajo"
                    )
                    ?.value
                ||
                "Pendiente",

            trabajadorIds,

            trabajadorNombres,

            maquinariaId:
                maquinariaId
                ||
                null,

            maquinariaNombre:
                this.obtenerNombreMaquinaria(
                    maquina
                ),

            notas:
                document
                    .getElementById(
                        "notasTrabajo"
                    )
                    ?.value
                ||
                ""

        };


        const resultado =
            trabajo
                ? this.trabajoService
                    .editar(
                        id,
                        datos
                    )
                : this.trabajoService
                    .crear(
                        datos
                    );


        if (
            resultado
            &&
            resultado.ok ===
            false
        ) {

            alert(
                resultado.mensaje
            );

            return;

        }


        const trabajoGuardado =
            resultado?.trabajo
            ||
            trabajo;


        if (
            trabajoGuardado
            &&
            this.archivosPendientesTrabajo.length > 0
        ) {

            const botonGuardar =
                document.getElementById(
                    "guardarTrabajo"
                );


            this.subiendoEvidenciasTrabajo =
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
                of this.archivosPendientesTrabajo
            ) {

                const subida =
                    await EvidenciasService
                        .subir(
                            "trabajos",
                            trabajoGuardado.id,
                            archivo
                        );


                if (
                    !subida?.ok
                ) {

                    fallos++;
                    continue;

                }


                const asociada =
                    this.trabajoService
                        .agregarEvidencia(
                            trabajoGuardado.id,
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


            this.subiendoEvidenciasTrabajo =
                false;

            this.archivosPendientesTrabajo =
                [];


            if (
                fallos > 0
            ) {

                alert(
                    `La tarea se ha guardado, pero ${fallos} archivo(s) no se pudieron subir.`
                );

            }

        }


        this.mostrar();

    }


    // =====================================================
    // PENDIENTES
    // =====================================================

    agregarArchivosPendientesTrabajo(
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
                    this.archivosPendientesTrabajo
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

                    this.archivosPendientesTrabajo.push(
                        archivo
                    );

                }

            }
        );


        this.pintarArchivosPendientesTrabajo();

    }


    pintarArchivosPendientesTrabajo() {

        const contenedor =
            document.getElementById(
                "evidenciasPendientesTrabajo"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            this.archivosPendientesTrabajo.length ===
            0
        ) {

            contenedor.innerHTML =
                "";

            return;

        }


        contenedor.innerHTML =
            this.archivosPendientesTrabajo
                .map(
                    (
                        archivo,
                        indice
                    ) => `

                        <div class="gc-work-evidence-pending-item">

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
                                    ${escaparHTML(
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
                                class="gc-work-evidence-remove-pending"
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
                ".gc-work-evidence-remove-pending"
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


                            this.archivosPendientesTrabajo.splice(
                                indice,
                                1
                            );


                            this.pintarArchivosPendientesTrabajo();

                        }
                    );

                }
            );

    }


    // =====================================================
    // GESTOR DE EVIDENCIAS
    // =====================================================

    mostrarEvidenciasTrabajo(
        trabajoId
    ) {

        this.insertarEstilosEvidenciasTrabajo();


        const trabajo =
            this.trabajoService
                .obtenerPorId(
                    trabajoId
                );


        if (
            !trabajo
        ) {

            alert(
                "La tarea no existe."
            );

            this.mostrar();
            return;

        }


        const evidencias =
            this.trabajoService
                .obtenerEvidencias(
                    trabajo.id
                );


        this.mainContent.innerHTML = `

            <div class="trabajo-form-page gc-work-evidence-page">

                <button
                    id="volverDesdeEvidenciasTrabajo"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>

                <header class="trabajo-form-header">

                    <span>
                        📎 EVIDENCIAS
                    </span>

                    <h1>
                        ${escaparHTML(
                            trabajo.titulo
                            ||
                            "Trabajo"
                        )}
                    </h1>

                    <p>
                        ${escaparHTML(
                            trabajo.fincaNombre
                            ||
                            "Sin finca"
                        )}
                        ·
                        ${this.formatearFecha(
                            trabajo.fecha
                        )}
                    </p>

                </header>

                <section class="form-panel gc-work-evidence-manager">

                    <div class="gc-work-evidence-manager-head">

                        <div>

                            <span class="trabajos-section-eyebrow">
                                ARCHIVOS DEL TRABAJO
                            </span>

                            <h2>
                                Fotos y documentos
                            </h2>

                            <p>
                                Los archivos están guardados de forma privada en la nube.
                            </p>

                        </div>

                        <span class="gc-work-evidence-count">
                            ${evidencias.length}
                            ${
                                evidencias.length === 1
                                    ? "archivo"
                                    : "archivos"
                            }
                        </span>

                    </div>

                    <div class="gc-work-evidence-manager-upload">

                        <label
                            class="secondary-button gc-work-evidence-button"
                            for="anadirEvidenciasTrabajo"
                        >
                            <span>📎</span>
                            <span>Elegir archivos</span>
                        </label>

                        <input
                            id="anadirEvidenciasTrabajo"
                            class="gc-work-evidence-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            multiple
                        >

                        <label
                            class="primary-button gc-work-evidence-button"
                            for="anadirFotoTrabajo"
                        >
                            <span>📷</span>
                            <span>Hacer foto</span>
                        </label>

                        <input
                            id="anadirFotoTrabajo"
                            class="gc-work-evidence-input"
                            type="file"
                            accept="image/*"
                            capture="environment"
                        >

                    </div>

                    <div class="gc-work-evidence-grid">

                        ${
                            evidencias.length === 0
                                ? `
                                    <div class="gc-work-evidence-empty">

                                        <span>
                                            📷
                                        </span>

                                        <strong>
                                            Sin evidencias todavía
                                        </strong>

                                        <p>
                                            Añade una foto o un PDF para documentar este trabajo.
                                        </p>

                                    </div>
                                `
                                : evidencias
                                    .map(
                                        evidencia =>
                                            this.crearTarjetaEvidenciaTrabajo(
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
                "volverDesdeEvidenciasTrabajo"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "anadirEvidenciasTrabajo"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.subirArchivosATrabajo(
                        trabajo.id,
                        event.target.files
                    )
            );


        document
            .getElementById(
                "anadirFotoTrabajo"
            )
            ?.addEventListener(
                "change",
                event =>
                    this.subirArchivosATrabajo(
                        trabajo.id,
                        event.target.files
                    )
            );


        document
            .querySelectorAll(
                ".gc-work-evidence-open"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.abrirEvidenciaTrabajo(
                                boton.dataset.ruta
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".gc-work-evidence-delete"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.eliminarEvidenciaTrabajo(
                                trabajo.id,
                                boton.dataset.evidenciaId,
                                boton.dataset.ruta
                            )
                    );

                }
            );

    }


    crearTarjetaEvidenciaTrabajo(
        evidencia
    ) {

        return `

            <article class="gc-work-evidence-card">

                <div class="gc-work-evidence-card-icon">

                    ${
                        EvidenciasService.esImagen(
                            evidencia
                        )
                            ? "🖼️"
                            : "📄"
                    }

                </div>

                <div class="gc-work-evidence-card-body">

                    <strong>
                        ${escaparHTML(
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

                <div class="gc-work-evidence-card-actions">

                    <button
                        class="secondary-button gc-work-evidence-open"
                        data-ruta="${escaparHTML(
                            evidencia.ruta
                        )}"
                        type="button"
                    >
                        Abrir
                    </button>

                    <button
                        class="gc-work-evidence-delete"
                        data-evidencia-id="${escaparHTML(
                            evidencia.id
                        )}"
                        data-ruta="${escaparHTML(
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


    async subirArchivosATrabajo(
        trabajoId,
        fileList
    ) {

        if (
            this.subiendoEvidenciasTrabajo
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


        this.subiendoEvidenciasTrabajo =
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
                        "trabajos",
                        trabajoId,
                        archivo
                    );


            if (
                !subida?.ok
            ) {

                fallos++;
                continue;

            }


            const asociada =
                this.trabajoService
                    .agregarEvidencia(
                        trabajoId,
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


        this.subiendoEvidenciasTrabajo =
            false;


        if (
            fallos > 0
        ) {

            alert(
                `${fallos} archivo(s) no se pudieron subir.`
            );

        }


        this.mostrarEvidenciasTrabajo(
            trabajoId
        );

    }


    async abrirEvidenciaTrabajo(
        ruta
    ) {

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


    async eliminarEvidenciaTrabajo(
        trabajoId,
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
            this.trabajoService
                .quitarEvidencia(
                    trabajoId,
                    evidenciaId
                );


        if (
            !quitada?.ok
        ) {

            alert(
                quitada?.mensaje
                ||
                "El archivo se eliminó de la nube, pero no se pudo actualizar la tarea."
            );

            return;

        }


        this.mostrarEvidenciasTrabajo(
            trabajoId
        );

    }


    // =====================================================
    // ESTILOS
    // =====================================================

    insertarEstilosEvidenciasTrabajo() {

        if (
            document.getElementById(
                "gc-work-evidence-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "gc-work-evidence-styles";


        style.textContent = `

            .gc-work-evidence-summary {

                display: flex;
                align-items: center;
                justify-content: space-between;

                gap: 10px;

                margin-top: 12px;

                padding: 10px 11px;

                border:
                    1px
                    solid
                    #e1e9e4;

                border-radius: 12px;

                background: #f8fbf9;

            }


            .gc-work-evidence-summary > div {

                display: flex;
                align-items: center;

                gap: 9px;

                min-width: 0;

            }


            .gc-work-evidence-summary-icon {

                display: grid;

                place-items: center;

                width: 34px;
                height: 34px;

                flex: 0 0 34px;

                border-radius: 10px;

                background: #eaf4ee;

            }


            .gc-work-evidence-summary small,
            .gc-work-evidence-summary strong {

                display: block;

            }


            .gc-work-evidence-summary small {

                color: #6d7d74;

                font-size: 8px;

                font-weight: 800;

                letter-spacing: .08em;

            }


            .gc-work-evidence-summary strong {

                margin-top: 2px;

                color: #183d2d;

                font-size: 12px;

            }


            .gc-work-evidence-picker {

                display: flex;

                align-items: center;

                justify-content: space-between;

                gap: 14px;

                width: 100%;

                box-sizing: border-box;

                padding: 14px;

                border:
                    1px
                    dashed
                    #b9cdc1;

                border-radius: 14px;

                background: #f8fbf9;

            }


            .gc-work-evidence-picker-copy {

                display: flex;

                align-items: center;

                gap: 11px;

                min-width: 0;

            }


            .gc-work-evidence-picker-copy > span {

                display: grid;

                place-items: center;

                width: 40px;
                height: 40px;

                flex: 0 0 40px;

                border-radius: 12px;

                background: #e8f3ec;

            }


            .gc-work-evidence-picker-copy strong,
            .gc-work-evidence-picker-copy p {

                display: block;

                margin: 0;

            }


            .gc-work-evidence-picker-copy strong {

                color: #193d2e;

                font-size: 13px;

            }


            .gc-work-evidence-picker-copy p {

                margin-top: 3px;

                color: #708078;

                font-size: 11px;

                line-height: 1.35;

            }


            .gc-work-evidence-picker-actions,
            .gc-work-evidence-manager-upload {

                display: flex;

                align-items: center;

                justify-content: center;

                flex-wrap: wrap;

                gap: 8px;

            }


            .gc-work-evidence-input {

                position:
                    absolute
                    !important;

                width:
                    1px
                    !important;

                height:
                    1px
                    !important;

                padding:
                    0
                    !important;

                margin:
                    -1px
                    !important;

                overflow:
                    hidden
                    !important;

                clip:
                    rect(
                        0,
                        0,
                        0,
                        0
                    )
                    !important;

                white-space:
                    nowrap
                    !important;

                border:
                    0
                    !important;

            }


            .gc-work-evidence-button {

                display:
                    inline-flex
                    !important;

                align-items:
                    center
                    !important;

                justify-content:
                    center
                    !important;

                gap:
                    6px
                    !important;

                min-height:
                    40px;

                box-sizing:
                    border-box;

                margin:
                    0
                    !important;

                padding:
                    0
                    14px
                    !important;

                line-height:
                    1
                    !important;

                text-align:
                    center
                    !important;

                white-space:
                    nowrap;

                cursor:
                    pointer;

            }


            .gc-work-evidence-manage {

                width: 100%;

                margin-top: 8px;

            }


            .gc-work-evidence-pending {

                display: grid;

                gap: 8px;

                margin-top: 10px;

            }


            .gc-work-evidence-pending-item {

                display: grid;

                grid-template-columns:
                    32px
                    minmax(
                        0,
                        1fr
                    )
                    30px;

                align-items: center;

                gap: 9px;

                padding: 9px 10px;

                border:
                    1px
                    solid
                    #e1e9e4;

                border-radius: 10px;

                background: #ffffff;

            }


            .gc-work-evidence-pending-item strong,
            .gc-work-evidence-pending-item small {

                display: block;

                overflow: hidden;

                text-overflow: ellipsis;

                white-space: nowrap;

            }


            .gc-work-evidence-pending-item strong {

                color: #213c30;

                font-size: 11px;

            }


            .gc-work-evidence-pending-item small {

                margin-top: 2px;

                color: #78857f;

                font-size: 9px;

            }


            .gc-work-evidence-remove-pending,
            .gc-work-evidence-delete {

                display: grid;

                place-items: center;

                width: 30px;
                height: 30px;

                padding: 0;

                border:
                    1px
                    solid
                    #ecd9d9;

                border-radius: 8px;

                background: #fff8f8;

                color: #9b3636;

                cursor: pointer;

            }


            .gc-work-evidence-manager {

                margin-top: 14px;

            }


            .gc-work-evidence-manager-head {

                display: flex;

                align-items: flex-start;

                justify-content: space-between;

                gap: 14px;

                margin-bottom: 16px;

            }


            .gc-work-evidence-manager-head h2 {

                margin:
                    3px
                    0
                    4px;

                color: #192a22;

                font-family:
                    Georgia,
                    "Times New Roman",
                    serif;

                font-size: 25px;

            }


            .gc-work-evidence-manager-head p {

                margin: 0;

                color: #6d7b73;

                font-size: 11px;

            }


            .gc-work-evidence-count {

                padding: 6px 10px;

                border-radius: 999px;

                background: #eaf4ee;

                color: #1f5b3f;

                font-size: 10px;

                font-weight: 700;

                white-space: nowrap;

            }


            .gc-work-evidence-manager-upload {

                justify-content: flex-start;

                margin-bottom: 16px;

                padding-bottom: 16px;

                border-bottom:
                    1px
                    solid
                    #e4eae6;

            }


            .gc-work-evidence-grid {

                display: grid;

                grid-template-columns:
                    repeat(
                        2,
                        minmax(
                            0,
                            1fr
                        )
                    );

                gap: 10px;

            }


            .gc-work-evidence-card {

                display: grid;

                grid-template-columns:
                    42px
                    minmax(
                        0,
                        1fr
                    )
                    auto;

                align-items: center;

                gap: 10px;

                padding: 12px;

                border:
                    1px
                    solid
                    #e0e8e3;

                border-radius: 13px;

                background: #ffffff;

            }


            .gc-work-evidence-card-icon {

                display: grid;

                place-items: center;

                width: 42px;
                height: 42px;

                border-radius: 11px;

                background: #edf5f0;

            }


            .gc-work-evidence-card-body {

                min-width: 0;

            }


            .gc-work-evidence-card-body strong,
            .gc-work-evidence-card-body span {

                display: block;

                overflow: hidden;

                text-overflow: ellipsis;

                white-space: nowrap;

            }


            .gc-work-evidence-card-body strong {

                color: #18392b;

                font-size: 11px;

            }


            .gc-work-evidence-card-body span {

                margin-top: 3px;

                color: #758078;

                font-size: 9px;

            }


            .gc-work-evidence-card-actions {

                display: flex;

                align-items: center;

                gap: 6px;

            }


            .gc-work-evidence-empty {

                grid-column:
                    1
                    /
                    -1;

                padding: 34px 20px;

                border:
                    1px
                    dashed
                    #cad8d0;

                border-radius: 14px;

                text-align: center;

                background: #fafcfb;

            }


            .gc-work-evidence-empty > span {

                display: block;

                margin-bottom: 7px;

                font-size: 28px;

            }


            .gc-work-evidence-empty strong {

                display: block;

                color: #1a3f2f;

                font-size: 13px;

            }


            .gc-work-evidence-empty p {

                margin:
                    5px
                    auto
                    0;

                color: #718078;

                font-size: 11px;

                line-height: 1.5;

            }


            @media (
                max-width:
                760px
            ) {

                .gc-work-evidence-summary,
                .gc-work-evidence-picker,
                .gc-work-evidence-manager-head {

                    align-items: stretch;

                    flex-direction: column;

                }


                .gc-work-evidence-summary
                .trabajo-evidencias {

                    width: 100%;

                }


                .gc-work-evidence-picker-actions,
                .gc-work-evidence-manager-upload {

                    display: grid;

                    grid-template-columns:
                        1fr
                        1fr;

                    width: 100%;

                }


                .gc-work-evidence-button {

                    display:
                        flex
                        !important;

                    align-items:
                        center
                        !important;

                    justify-content:
                        center
                        !important;

                    width:
                        100%
                        !important;

                    height: 42px;

                    min-height: 42px;

                    margin:
                        0
                        !important;

                    padding:
                        0
                        10px
                        !important;

                    text-align:
                        center
                        !important;

                }


                .gc-work-evidence-grid {

                    grid-template-columns: 1fr;

                }


                .gc-work-evidence-card {

                    grid-template-columns:
                        38px
                        minmax(
                            0,
                            1fr
                        );

                }


                .gc-work-evidence-card-actions {

                    grid-column:
                        1
                        /
                        -1;

                    display: grid;

                    grid-template-columns:
                        1fr
                        42px;

                }


                .gc-work-evidence-card-actions
                .secondary-button {

                    width: 100%;

                }

            }


            @media (
                max-width:
                420px
            ) {

                .gc-work-evidence-picker-actions,
                .gc-work-evidence-manager-upload {

                    grid-template-columns: 1fr;

                }


                .gc-work-evidence-button {

                    width:
                        100%
                        !important;

                    min-height: 42px;

                    padding:
                        0
                        12px
                        !important;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }

}