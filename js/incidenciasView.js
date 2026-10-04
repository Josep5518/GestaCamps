export class IncidenciasView {

    constructor(
        mainContent,
        incidenciaService,
        fincaService,
        trabajoService,
        trabajadorService
    ) {
        this.mainContent = mainContent;
        this.incidenciaService = incidenciaService;
        this.fincaService = fincaService;
        this.trabajoService = trabajoService;
        this.trabajadorService = trabajadorService;
    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const incidencias =
            this.incidenciaService
                .obtenerTodas();


        const abiertas =
            this.incidenciaService
                .obtenerAbiertas()
                .length;


        const revision =
            this.incidenciaService
                .obtenerEnRevision()
                .length;


        const resueltas =
            this.incidenciaService
                .obtenerResueltas()
                .length;


        const urgentes =
            this.incidenciaService
                .obtenerUrgentesActivas()
                .length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Incidencias
                    </h2>

                    <p>
                        Controla problemas y avisos de la explotación
                    </p>

                </div>


                <button
                    id="nuevaIncidencia"
                    class="primary-button"
                    type="button"
                >
                    + Nueva incidencia
                </button>

            </header>


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


            <div id="listaIncidencias">

                ${
                    incidencias.length ===
                    0

                        ? `

                            <div class="empty-state">

                                <div class="empty-icon">
                                    ⚠️
                                </div>

                                <h3>
                                    No hay incidencias
                                </h3>

                                <p>
                                    Cuando se registre una incidencia aparecerá aquí.
                                </p>

                            </div>

                        `

                        : `

                            <div class="incidencias-grid">

                                ${incidencias
                                    .map(
                                        incidencia =>
                                            this.crearTarjeta(
                                                incidencia
                                            )
                                    )
                                    .join("")}

                            </div>

                        `
                }

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
                        ${titulo}
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

        const iconoPrioridad = {

            Baja:
                "🟢",

            Media:
                "🟡",

            Alta:
                "🟠",

            Urgente:
                "🔴"

        };


        return `

            <article class="incidencia-card">

                <div class="incidencia-card-header">

                    <span class="incidencia-icon">
                        ⚠️
                    </span>


                    <div class="incidencia-actions">

                        ${
                            incidencia.estado !==
                            "Resuelta"

                                ? `

                                    <button
                                        class="
                                            secondary-button
                                            incidencia-revision
                                        "
                                        data-id="${incidencia.id}"
                                        type="button"
                                    >
                                        En revisión
                                    </button>


                                    <button
                                        class="
                                            primary-button
                                            incidencia-resolver
                                        "
                                        data-id="${incidencia.id}"
                                        type="button"
                                    >
                                        Resolver
                                    </button>

                                `

                                : `

                                    <button
                                        class="
                                            secondary-button
                                            incidencia-reabrir
                                        "
                                        data-id="${incidencia.id}"
                                        type="button"
                                    >
                                        Reabrir
                                    </button>

                                `
                        }

                    </div>

                </div>


                <h3>
                    ${incidencia.tipo}
                </h3>


                <div class="incidencia-meta">

                    <p>

                        ${
                            iconoPrioridad[
                                incidencia.prioridad
                            ]
                            ||
                            "🟡"
                        }

                        Prioridad:

                        <strong>
                            ${incidencia.prioridad}
                        </strong>

                    </p>


                    <p>

                        📌 Estado:

                        <strong>
                            ${incidencia.estado}
                        </strong>

                    </p>


                    ${
                        incidencia.fincaNombre

                            ? `

                                <p>
                                    📍 ${incidencia.fincaNombre}
                                </p>

                            `

                            : ""
                    }


                    ${
                        incidencia.trabajoNombre

                            ? `

                                <p>
                                    📋 ${incidencia.trabajoNombre}
                                </p>

                            `

                            : ""
                    }


                    ${
                        incidencia.trabajadorNombre

                            ? `

                                <p>
                                    👷 ${incidencia.trabajadorNombre}
                                </p>

                            `

                            : ""
                    }


                    <p>
                        🕒
                        ${this.formatearFechaHora(
                            incidencia.fechaCreacion
                        )}
                    </p>

                </div>


                <div class="incidencia-descripcion">

                    <strong>
                        Descripción
                    </strong>

                    <p>
                        ${incidencia.descripcion}
                    </p>

                </div>


                ${
                    incidencia.estado ===
                    "Resuelta"

                        ? `

                            <div class="incidencia-resuelta">

                                <strong>
                                    ✅ Resuelta
                                </strong>

                                <p>
                                    ${this.formatearFechaHora(
                                        incidencia.fechaResolucion
                                    )}
                                </p>


                                ${
                                    incidencia.observacionesResolucion

                                        ? `

                                            <p class="incidencia-resuelta-notas">
                                                ${incidencia.observacionesResolucion}
                                            </p>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }

            </article>

        `;
    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".incidencia-revision"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstado(
                                boton.dataset.id,
                                "En revisión"
                            );

                        }
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
                        () => {

                            this.cambiarEstado(
                                boton.dataset.id,
                                "Abierta"
                            );

                        }
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
    // FORMULARIO
    // =====================================================

    mostrarFormulario() {

        const fincas =
            this.fincaService
                .obtenerTodas();


        const trabajos =
            this.trabajoService
                .obtenerTodos();


        const trabajadores =
            this.trabajadorService
                .obtenerTodos();


        this.mainContent.innerHTML = `

            <button
                id="volverIncidencias"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        Nueva incidencia
                    </h2>

                    <p>
                        Registra un problema o aviso
                    </p>

                </div>

            </header>


            <div class="form-panel incidencia-form-panel">

                <div class="form-group">

                    <label>
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

                    <label>
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

                    <label>
                        Finca
                    </label>

                    <select id="fincaIncidencia">

                        <option value="">
                            Sin finca concreta
                        </option>


                        ${fincas
                            .map(
                                finca => `

                                    <option value="${finca.id}">
                                        ${finca.nombre}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Tarea relacionada
                    </label>

                    <select id="trabajoIncidencia">

                        <option value="">
                            Sin tarea relacionada
                        </option>


                        ${trabajos
                            .map(
                                trabajo => `

                                    <option value="${trabajo.id}">
                                        ${trabajo.titulo}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Trabajador que comunica
                    </label>

                    <select id="trabajadorIncidencia">

                        <option value="">
                            Administración
                        </option>


                        ${trabajadores
                            .map(
                                trabajador => `

                                    <option value="${trabajador.id}">

                                        ${this.trabajadorService
                                            .obtenerNombreCompleto(
                                                trabajador
                                            )}

                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Descripción *
                    </label>

                    <textarea
                        id="descripcionIncidencia"
                        rows="6"
                        placeholder="Explica qué ha ocurrido..."
                    ></textarea>

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
    }


    // =====================================================
    // GUARDAR FORMULARIO
    // =====================================================

    guardarFormulario() {

        const resultado =
            this.incidenciaService
                .crear(
                    {

                        tipo:
                            document
                                .getElementById(
                                    "tipoIncidencia"
                                )
                                .value,

                        prioridad:
                            document
                                .getElementById(
                                    "prioridadIncidencia"
                                )
                                .value,

                        fincaId:
                            document
                                .getElementById(
                                    "fincaIncidencia"
                                )
                                .value
                            ||
                            null,

                        trabajoId:
                            document
                                .getElementById(
                                    "trabajoIncidencia"
                                )
                                .value
                            ||
                            null,

                        trabajadorId:
                            document
                                .getElementById(
                                    "trabajadorIncidencia"
                                )
                                .value
                            ||
                            null,

                        descripcion:
                            document
                                .getElementById(
                                    "descripcionIncidencia"
                                )
                                .value,

                        origen:
                            "Administración"

                    }
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
    // FORMATEAR FECHA
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
            return valor;
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
}