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


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        ⚠️
                    </span>

                    <div>

                        <p>
                            Abiertas
                        </p>

                        <h3>
                            ${abiertas}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🔎
                    </span>

                    <div>

                        <p>
                            En revisión
                        </p>

                        <h3>
                            ${revision}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ✅
                    </span>

                    <div>

                        <p>
                            Resueltas
                        </p>

                        <h3>
                            ${resueltas}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🚨
                    </span>

                    <div>

                        <p>
                            Urgentes
                        </p>

                        <h3>
                            ${urgentes}
                        </h3>

                    </div>

                </div>

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

                            <div class="trabajos-grid">

                                ${incidencias.map(
                                    incidencia =>
                                        this.crearTarjeta(
                                            incidencia
                                        )
                                ).join("")}

                            </div>

                        `
                }

            </div>

        `;


        document
            .getElementById(
                "nuevaIncidencia"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        this.configurarEventos();

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

            <div class="trabajo-card">

                <div class="trabajo-card-header">

                    <span class="trabajo-icon">
                        ⚠️
                    </span>


                    <div class="trabajo-actions">

                        ${
                            incidencia.estado !==
                            "Resuelta"

                                ? `

                                    <button
                                        class="secondary-button incidencia-revision"
                                        data-id="${incidencia.id}"
                                        type="button"
                                    >
                                        En revisión
                                    </button>


                                    <button
                                        class="primary-button incidencia-resolver"
                                        data-id="${incidencia.id}"
                                        type="button"
                                    >
                                        Resolver
                                    </button>

                                `

                                : `

                                    <button
                                        class="secondary-button incidencia-reabrir"
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


                <p class="trabajo-linea">

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


                <p class="trabajo-linea">

                    📌 Estado:
                    <strong>
                        ${incidencia.estado}
                    </strong>

                </p>


                ${
                    incidencia.fincaNombre

                        ? `

                            <p class="trabajo-linea">
                                📍 ${incidencia.fincaNombre}
                            </p>

                        `

                        : ""
                }


                ${
                    incidencia.trabajoNombre

                        ? `

                            <p class="trabajo-linea">
                                📋 ${incidencia.trabajoNombre}
                            </p>

                        `

                        : ""
                }


                ${
                    incidencia.trabajadorNombre

                        ? `

                            <p class="trabajo-linea">
                                👷 ${incidencia.trabajadorNombre}
                            </p>

                        `

                        : ""
                }


                <p class="trabajo-linea">

                    🕒
                    ${this.formatearFechaHora(
                        incidencia.fechaCreacion
                    )}

                </p>


                <div
                    style="
                        margin-top: 14px;
                        padding: 12px;
                        background: #f6f8f6;
                        border-radius: 10px;
                    "
                >

                    <strong>
                        Descripción
                    </strong>

                    <p
                        style="
                            margin: 6px 0 0;
                        "
                    >
                        ${incidencia.descripcion}
                    </p>

                </div>


                ${
                    incidencia.estado ===
                    "Resuelta"

                        ? `

                            <div
                                style="
                                    margin-top: 12px;
                                    padding: 12px;
                                    background: #edf6f1;
                                    border-radius: 10px;
                                "
                            >

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

                                            <p>
                                                ${incidencia.observacionesResolucion}
                                            </p>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }

            </div>

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
                                Number(
                                    boton.dataset.id
                                ),
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
                                Number(
                                    boton.dataset.id
                                ),
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
                                Number(
                                    boton.dataset.id
                                ),
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


            <div class="form-panel">

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

                        ${fincas.map(
                            finca => `

                                <option value="${finca.id}">
                                    ${finca.nombre}
                                </option>

                            `
                        ).join("")}

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

                        ${trabajos.map(
                            trabajo => `

                                <option value="${trabajo.id}">
                                    ${trabajo.titulo}
                                </option>

                            `
                        ).join("")}

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

                        ${trabajadores.map(
                            trabajador => `

                                <option value="${trabajador.id}">
                                    ${this.trabajadorService.obtenerNombreCompleto(
                                        trabajador
                                    )}
                                </option>

                            `
                        ).join("")}

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
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarIncidencia"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarIncidencia"
            )
            .addEventListener(
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


        return new Date(
            valor
        )
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