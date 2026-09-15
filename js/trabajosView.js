export class TrabajosView {

    constructor(
        mainContent,
        fincaService,
        trabajoService,
        trabajadorService,
        maquinariaService,
        campaniaService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.trabajoService =
            trabajoService;

        this.trabajadorService =
            trabajadorService;

        this.maquinariaService =
            maquinariaService;

        this.campaniaService =
            campaniaService;

    }


    // =====================================================
    // TRABAJADORES
    // =====================================================

    obtenerTrabajadores() {

        if (
            this.trabajadorService
            &&
            typeof this.trabajadorService
                .obtenerTodos ===
                "function"
        ) {

            return this.trabajadorService
                .obtenerTodos();

        }


        return [];

    }


    // =====================================================
    // MAQUINARIA
    // =====================================================

    obtenerMaquinaria() {

        if (
            this.maquinariaService
            &&
            typeof this.maquinariaService
                .obtenerTodos ===
                "function"
        ) {

            return this.maquinariaService
                .obtenerTodos();

        }


        return [];

    }


    // =====================================================
    // TRABAJADOR POR ID
    // =====================================================

    obtenerTrabajadorPorId(
        id
    ) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.trabajadorService
            &&
            typeof this.trabajadorService
                .obtenerPorId ===
                "function"
        ) {

            return this.trabajadorService
                .obtenerPorId(
                    Number(id)
                );

        }


        return this
            .obtenerTrabajadores()
            .find(
                trabajador =>
                    Number(
                        trabajador.id
                    ) ===
                    Number(
                        id
                    )
            )
            ||
            null;

    }


    // =====================================================
    // MAQUINARIA POR ID
    // =====================================================

    obtenerMaquinariaPorId(
        id
    ) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.maquinariaService
            &&
            typeof this.maquinariaService
                .obtenerPorId ===
                "function"
        ) {

            return this.maquinariaService
                .obtenerPorId(
                    Number(id)
                );

        }


        return this
            .obtenerMaquinaria()
            .find(
                maquina =>
                    Number(
                        maquina.id
                    ) ===
                    Number(
                        id
                    )
            )
            ||
            null;

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


        return [
            trabajador.nombre,
            trabajador.apellidos
        ]
            .filter(Boolean)
            .join(" ");

    }


    // =====================================================
    // NOMBRE MAQUINARIA
    // =====================================================

    obtenerNombreMaquinaria(
        maquina
    ) {

        if (
            !maquina
        ) {

            return "";

        }


        return [
            maquina.nombre,
            maquina.marca,
            maquina.modelo
        ]
            .filter(Boolean)
            .join(" · ");

    }


    // =====================================================
    // NOMBRES DE TRABAJADORES DE UNA TAREA
    // =====================================================

    obtenerNombresTrabajo(
        trabajo
    ) {

        if (
            Array.isArray(
                trabajo.trabajadorNombres
            )
            &&
            trabajo.trabajadorNombres
                .length >
                0
        ) {

            return trabajo
                .trabajadorNombres
                .join(", ");

        }


        if (
            trabajo.trabajadorNombre
        ) {

            return trabajo
                .trabajadorNombre;

        }


        return "Sin trabajadores asignados";

    }


    // =====================================================
    // PANTALLA PRINCIPAL
    // =====================================================

    mostrar() {

        const trabajos =
            this.trabajoService
                .obtenerTodos();


        const pendientes =
            trabajos.filter(
                trabajo =>
                    trabajo.estado ===
                    "Pendiente"
            ).length;


        const enCurso =
            trabajos.filter(
                trabajo =>
                    trabajo.estado ===
                    "En curso"
            ).length;


        const completadas =
            trabajos.filter(
                trabajo =>
                    trabajo.estado ===
                    "Completada"
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Trabajos y tareas
                    </h2>

                    <p>
                        Organiza los trabajos de tu explotación
                    </p>

                </div>


                <button
                    id="nuevoTrabajo"
                    class="primary-button"
                    type="button"
                >
                    + Nueva tarea
                </button>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        📋
                    </span>

                    <div>

                        <p>
                            Total
                        </p>

                        <h3>
                            ${trabajos.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🕒
                    </span>

                    <div>

                        <p>
                            Pendientes
                        </p>

                        <h3>
                            ${pendientes}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🚜
                    </span>

                    <div>

                        <p>
                            En curso
                        </p>

                        <h3>
                            ${enCurso}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ✅
                    </span>

                    <div>

                        <p>
                            Completadas
                        </p>

                        <h3>
                            ${completadas}
                        </h3>

                    </div>

                </div>

            </section>


            <div id="listaTrabajos"></div>

        `;


        document
            .getElementById(
                "nuevoTrabajo"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrarFormulario();

                }
            );


        this.mostrarLista();

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const trabajos =
            this.trabajoService
                .obtenerTodos()
                .slice()
                .sort(
                    (a, b) =>
                        new Date(
                            b.fecha
                        )
                        -
                        new Date(
                            a.fecha
                        )
                );


        const contenedor =
            document.getElementById(
                "listaTrabajos"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            trabajos.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🚜
                    </div>

                    <h3>
                        Todavía no tienes tareas
                    </h3>

                    <p>
                        Crea tu primera tarea para organizar los trabajos.
                    </p>

                </div>

            `;


            return;

        }


        contenedor.innerHTML = `

            <div class="trabajos-grid">

                ${trabajos.map(
                    trabajo => `

                        <div class="trabajo-card">

                            <div class="trabajo-card-header">

                                <span class="trabajo-icon">
                                    🚜
                                </span>


                                <div class="trabajo-actions">

                                    <button
                                        type="button"
                                        class="secondary-button editar-trabajo"
                                        data-id="${trabajo.id}"
                                    >
                                        Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="delete-button eliminar-trabajo"
                                        data-id="${trabajo.id}"
                                    >
                                        ×
                                    </button>

                                </div>

                            </div>


                            <h3>
                                ${trabajo.titulo || "Trabajo"}
                            </h3>


                            <strong class="trabajo-tipo">

                                ${
                                    trabajo.tipo
                                    ||
                                    trabajo.titulo
                                    ||
                                    "Trabajo"
                                }

                            </strong>


                            <p class="trabajo-linea">

                                📍

                                ${
                                    trabajo.fincaNombre
                                    ||
                                    "Sin finca"
                                }

                                ${
                                    trabajo.parcela
                                        ? ` · ${trabajo.parcela}`
                                        : ""
                                }

                            </p>


                            ${
                                trabajo.cultivo

                                    ? `

                                        <p class="trabajo-linea">
                                            🌱 ${trabajo.cultivo}
                                        </p>

                                    `

                                    : ""
                            }


                            ${
                                trabajo.campaniaNombre

                                    ? `

                                        <p class="trabajo-campania">
                                            📅 ${trabajo.campaniaNombre}
                                        </p>

                                    `

                                    : `

                                        <p
                                            class="
                                                trabajo-campania
                                                trabajo-sin-campania
                                            "
                                        >
                                            📅 Sin campanya asignada
                                        </p>

                                    `
                            }


                            <div class="trabajo-info-grid">

                                <div>

                                    <span>
                                        Estado
                                    </span>

                                    <strong>
                                        ${trabajo.estado || "Pendiente"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Prioridad
                                    </span>

                                    <strong>
                                        ${trabajo.prioridad || "Media"}
                                    </strong>

                                </div>

                            </div>


                            <p class="trabajo-linea">

                                🗓️

                                ${
                                    this.formatearFecha(
                                        trabajo.fecha
                                    )
                                }

                            </p>


                            <p class="trabajo-linea">

                                👷

                                ${
                                    this.obtenerNombresTrabajo(
                                        trabajo
                                    )
                                }

                            </p>


                            <p class="trabajo-linea">

                                🚜

                                ${
                                    trabajo.maquinariaNombre
                                    ||
                                    "Sin maquinaria asignada"
                                }

                            </p>


                            ${
                                trabajo.fechaInicio

                                    ? `

                                        <p class="trabajo-linea">
                                            ▶️ Iniciada:
                                            ${this.formatearFechaHora(
                                                trabajo.fechaInicio
                                            )}
                                        </p>

                                    `

                                    : ""
                            }


                            ${
                                trabajo.fechaCompletada

                                    ? `

                                        <p class="trabajo-linea">
                                            ✅ Finalizada:
                                            ${this.formatearFechaHora(
                                                trabajo.fechaCompletada
                                            )}
                                        </p>

                                    `

                                    : ""
                            }


                            ${
                                trabajo.notas

                                    ? `

                                        <div class="trabajador-notas">

                                            <span>
                                                Notas
                                            </span>

                                            <p>
                                                ${trabajo.notas}
                                            </p>

                                        </div>

                                    `

                                    : ""
                            }


                            <div class="trabajo-state-actions">


                                ${
                                    trabajo.estado ===
                                    "Pendiente"

                                        ? `

                                            <button
                                                type="button"
                                                class="
                                                    task-state-button
                                                    estado-trabajo
                                                "
                                                data-id="${trabajo.id}"
                                                data-estado="En curso"
                                            >
                                                ▶️ Iniciar
                                            </button>

                                        `

                                        : ""
                                }


                                ${
                                    trabajo.estado ===
                                    "En curso"

                                        ? `

                                            <button
                                                type="button"
                                                class="
                                                    task-state-button
                                                    estado-trabajo
                                                "
                                                data-id="${trabajo.id}"
                                                data-estado="Pendiente"
                                            >
                                                ↩ Pendiente
                                            </button>


                                            <button
                                                type="button"
                                                class="
                                                    task-state-button
                                                    estado-trabajo
                                                "
                                                data-id="${trabajo.id}"
                                                data-estado="Completada"
                                            >
                                                ✅ Completar
                                            </button>

                                        `

                                        : ""
                                }


                                ${
                                    trabajo.estado ===
                                    "Completada"

                                        ? `

                                            <button
                                                type="button"
                                                class="
                                                    task-state-button
                                                    estado-trabajo
                                                "
                                                data-id="${trabajo.id}"
                                                data-estado="En curso"
                                            >
                                                ↩ Reabrir
                                            </button>

                                        `

                                        : ""
                                }

                            </div>

                        </div>

                    `
                ).join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // EVENTOS DE LAS TARJETAS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-trabajo"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            this.mostrarFormulario(
                                Number(
                                    boton.dataset.id
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-trabajo"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            const id =
                                Number(
                                    boton.dataset.id
                                );


                            const trabajo =
                                this.trabajoService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !trabajo
                            ) {

                                alert(
                                    "No se ha podido encontrar la tarea."
                                );

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar la tarea "${trabajo.titulo}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.trabajoService
                                    .eliminar(
                                        id
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


                            this.mostrar();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".estado-trabajo"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            const resultado =
                                this.trabajoService
                                    .cambiarEstado(
                                        Number(
                                            boton.dataset.id
                                        ),
                                        boton.dataset.estado
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
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        id = null
    ) {

        const editando =
            id !==
            null;


        const trabajo =
            editando
                ? this.trabajoService
                    .obtenerPorId(
                        Number(id)
                    )
                : null;


        if (
            editando
            &&
            !trabajo
        ) {

            alert(
                "No se ha podido encontrar la tarea."
            );

            return;

        }


        const fincas =
            this.fincaService
                .obtenerTodas();


        const trabajadores =
            this.obtenerTrabajadores();


        const maquinaria =
            this.obtenerMaquinaria();


        if (
            fincas.length ===
            0
        ) {

            alert(
                "Primero debes crear una finca."
            );

            return;

        }


        const trabajadorIdsActuales =
            Array.isArray(
                trabajo?.trabajadorIds
            )
                ? trabajo.trabajadorIds
                    .map(Number)

                : trabajo?.trabajadorId
                    ? [
                        Number(
                            trabajo.trabajadorId
                        )
                    ]
                    : [];


        this.mainContent.innerHTML = `

            <button
                id="volverTrabajos"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>

                        ${
                            editando
                                ? "Editar tarea"
                                : "Nueva tarea"
                        }

                    </h2>


                    <p>

                        ${
                            editando
                                ? "Modifica los datos del trabajo"
                                : "Crea un nuevo trabajo para la explotación"
                        }

                    </p>

                </div>

            </header>


            <div class="form-panel">


                <div class="form-group">

                    <label>
                        Nombre del trabajo *
                    </label>

                    <input
                        id="tituloTrabajo"
                        type="text"
                        placeholder="Ej. Desbroce"
                        value="${trabajo?.titulo || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Tipo de trabajo *
                    </label>

                    <select id="tipoTrabajo">

                        ${
                            this.crearOpcionesTipo(
                                trabajo?.tipo
                                ||
                                trabajo?.titulo
                                ||
                                ""
                            )
                        }

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Finca *
                    </label>

                    <select id="fincaTrabajo">

                        ${fincas.map(
                            finca => `

                                <option
                                    value="${finca.id}"

                                    ${
                                        Number(
                                            trabajo?.fincaId
                                        )
                                        ===
                                        Number(
                                            finca.id
                                        )
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${finca.nombre}
                                </option>

                            `
                        ).join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Parcela
                    </label>

                    <input
                        id="parcelaTrabajo"
                        type="text"
                        placeholder="Ej. Parcela 2"
                        value="${trabajo?.parcela || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Cultivo
                    </label>

                    <input
                        id="cultivoTrabajo"
                        type="text"
                        placeholder="Ej. Nectarina · Nectared 6"
                        value="${trabajo?.cultivo || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Campanya
                    </label>

                    <select
                        id="campaniaTrabajo"
                    ></select>

                </div>


                <div class="form-group">

                    <label>
                        Fecha prevista *
                    </label>

                    <input
                        id="fechaTrabajo"
                        type="date"
                        value="${
                            trabajo?.fecha
                            ||
                            this.obtenerFechaHoy()
                        }"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Prioridad
                    </label>

                    <select id="prioridadTrabajo">

                        <option
                            value="Baja"
                            ${
                                trabajo?.prioridad ===
                                "Baja"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Baja
                        </option>


                        <option
                            value="Media"
                            ${
                                !trabajo
                                ||
                                trabajo.prioridad ===
                                "Media"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Media
                        </option>


                        <option
                            value="Alta"
                            ${
                                trabajo?.prioridad ===
                                "Alta"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Alta
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select id="estadoTrabajo">

                        <option
                            value="Pendiente"
                            ${
                                !trabajo
                                ||
                                trabajo.estado ===
                                "Pendiente"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pendiente
                        </option>


                        <option
                            value="En curso"
                            ${
                                trabajo?.estado ===
                                "En curso"
                                    ? "selected"
                                    : ""
                            }
                        >
                            En curso
                        </option>


                        <option
                            value="Completada"
                            ${
                                trabajo?.estado ===
                                "Completada"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completada
                        </option>

                    </select>

                </div>


                <!-- ======================================
                     VARIOS TRABAJADORES
                ======================================= -->

                <div class="form-group">

                    <label>
                        Trabajadores asignados
                    </label>


                    ${
                        trabajadores.length ===
                        0

                            ? `

                                <p
                                    style="
                                        color: #78837d;
                                        margin: 8px 0;
                                    "
                                >
                                    No hay trabajadores creados.
                                </p>

                            `

                            : `

                                <div
                                    style="
                                        display: grid;
                                        gap: 10px;
                                        margin-top: 10px;
                                    "
                                >

                                    ${trabajadores.map(
                                        trabajador => `

                                            <label
                                                style="
                                                    display: flex;
                                                    align-items: center;
                                                    gap: 10px;
                                                    padding: 10px 12px;
                                                    border: 1px solid #dfe7e1;
                                                    border-radius: 10px;
                                                    cursor: pointer;
                                                "
                                            >

                                                <input
                                                    type="checkbox"
                                                    class="trabajador-tarea-checkbox"
                                                    value="${trabajador.id}"

                                                    ${
                                                        trabajadorIdsActuales
                                                            .includes(
                                                                Number(
                                                                    trabajador.id
                                                                )
                                                            )
                                                                ? "checked"
                                                                : ""
                                                    }
                                                >

                                                <span>

                                                    <strong>
                                                        ${this.obtenerNombreTrabajador(trabajador)}
                                                    </strong>

                                                    ${
                                                        trabajador.puesto

                                                            ? `

                                                                <small
                                                                    style="
                                                                        display: block;
                                                                        color: #78837d;
                                                                        margin-top: 2px;
                                                                    "
                                                                >
                                                                    ${trabajador.puesto}
                                                                </small>

                                                            `

                                                            : ""
                                                    }

                                                </span>

                                            </label>

                                        `
                                    ).join("")}

                                </div>

                            `
                    }

                </div>


                <div class="form-group">

                    <label>
                        Maquinaria
                    </label>

                    <select id="maquinariaTrabajo">

                        <option value="">
                            Sin maquinaria asignada
                        </option>


                        ${maquinaria.map(
                            maquina => `

                                <option
                                    value="${maquina.id}"

                                    ${
                                        Number(
                                            trabajo?.maquinariaId
                                        )
                                        ===
                                        Number(
                                            maquina.id
                                        )
                                            ? "selected"
                                            : ""
                                    }
                                >

                                    ${
                                        this.obtenerNombreMaquinaria(
                                            maquina
                                        )
                                    }

                                </option>

                            `
                        ).join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasTrabajo"
                        rows="5"
                        placeholder="Observaciones..."
                    >${trabajo?.notas || ""}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarTrabajo"
                        type="button"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarTrabajo"
                        type="button"
                        class="primary-button"
                    >

                        ${
                            editando
                                ? "Guardar cambios"
                                : "Crear tarea"
                        }

                    </button>

                </div>

            </div>

        `;


        // =================================================
        // CAMPANYAS SEGÚN FINCA
        // =================================================

        const fincaSelect =
            document.getElementById(
                "fincaTrabajo"
            );


        const campaniaSelect =
            document.getElementById(
                "campaniaTrabajo"
            );


        const cargarCampanyas =
            () => {

                const fincaId =
                    Number(
                        fincaSelect.value
                    );


                const campanyas =
                    this.campaniaService
                        .obtenerTodas()
                        .filter(
                            campania =>
                                Number(
                                    campania.fincaId
                                )
                                ===
                                fincaId
                        );


                campaniaSelect.innerHTML = `

                    <option value="">
                        Sin campanya
                    </option>


                    ${campanyas.map(
                        campania => `

                            <option
                                value="${campania.id}"
                            >
                                ${campania.nombre}
                                ·
                                ${campania.estado}
                            </option>

                        `
                    ).join("")}

                `;


                if (
                    trabajo?.campaniaId
                    &&
                    campanyas.some(
                        campania =>
                            Number(
                                campania.id
                            )
                            ===
                            Number(
                                trabajo.campaniaId
                            )
                    )
                ) {

                    campaniaSelect.value =
                        String(
                            trabajo.campaniaId
                        );

                    return;

                }


                if (
                    !editando
                    &&
                    campanyas.length ===
                    1
                ) {

                    campaniaSelect.value =
                        String(
                            campanyas[0].id
                        );

                }

            };


        fincaSelect.addEventListener(
            "change",
            cargarCampanyas
        );


        cargarCampanyas();


        // =================================================
        // VOLVER
        // =================================================

        document
            .getElementById(
                "volverTrabajos"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarTrabajo"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        // =================================================
        // GUARDAR
        // =================================================

        document
            .getElementById(
                "guardarTrabajo"
            )
            .addEventListener(
                "click",
                () => {

                    this.guardarFormulario(
                        id,
                        editando
                    );

                }
            );

    }


    // =====================================================
    // GUARDAR FORMULARIO
    // =====================================================

    guardarFormulario(
        id,
        editando
    ) {

        const maquinariaIdTexto =
            document
                .getElementById(
                    "maquinariaTrabajo"
                )
                .value;


        const maquinariaId =
            maquinariaIdTexto
                ? Number(
                    maquinariaIdTexto
                )
                : null;


        const maquina =
            this.obtenerMaquinariaPorId(
                maquinariaId
            );


        const trabajadorIds =
            Array.from(
                document.querySelectorAll(
                    ".trabajador-tarea-checkbox:checked"
                )
            )
                .map(
                    checkbox =>
                        Number(
                            checkbox.value
                        )
                );


        const trabajadoresSeleccionados =
            trabajadorIds
                .map(
                    trabajadorId =>
                        this.obtenerTrabajadorPorId(
                            trabajadorId
                        )
                )
                .filter(Boolean);


        const trabajadorNombres =
            trabajadoresSeleccionados
                .map(
                    trabajador =>
                        this.obtenerNombreTrabajador(
                            trabajador
                        )
                );


        const datos = {

            titulo:
                document
                    .getElementById(
                        "tituloTrabajo"
                    )
                    .value,

            tipo:
                document
                    .getElementById(
                        "tipoTrabajo"
                    )
                    .value,

            fincaId:
                Number(
                    document
                        .getElementById(
                            "fincaTrabajo"
                        )
                        .value
                ),

            parcela:
                document
                    .getElementById(
                        "parcelaTrabajo"
                    )
                    .value,

            cultivo:
                document
                    .getElementById(
                        "cultivoTrabajo"
                    )
                    .value,

            campaniaId:
                document
                    .getElementById(
                        "campaniaTrabajo"
                    )
                    .value
                ||
                null,

            fecha:
                document
                    .getElementById(
                        "fechaTrabajo"
                    )
                    .value,

            prioridad:
                document
                    .getElementById(
                        "prioridadTrabajo"
                    )
                    .value,

            estado:
                document
                    .getElementById(
                        "estadoTrabajo"
                    )
                    .value,

            trabajadorIds:
                trabajadorIds,

            trabajadorNombres:
                trabajadorNombres,

            maquinariaId:
                maquinariaId,

            maquinariaNombre:
                this.obtenerNombreMaquinaria(
                    maquina
                ),

            notas:
                document
                    .getElementById(
                        "notasTrabajo"
                    )
                    .value

        };


        let resultado;


        if (
            editando
        ) {

            resultado =
                this.trabajoService
                    .editar(
                        Number(id),
                        datos
                    );

        }

        else {

            resultado =
                this.trabajoService
                    .crear(
                        datos
                    );

        }


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


        this.mostrar();

    }


    // =====================================================
    // TIPOS
    // =====================================================

    crearOpcionesTipo(
        seleccionado = ""
    ) {

        const tipos = [

            "Desbroce",
            "Poda",
            "Riego",
            "Fertilización",
            "Tratamiento",
            "Siembra",
            "Plantación",
            "Cosecha",
            "Mantenimiento",
            "Preparación del terreno",
            "Otro"

        ];


        if (
            seleccionado
            &&
            !tipos.includes(
                seleccionado
            )
        ) {

            tipos.unshift(
                seleccionado
            );

        }


        return tipos
            .map(
                tipo => `

                    <option
                        value="${tipo}"

                        ${
                            seleccionado ===
                            tipo
                                ? "selected"
                                : ""
                        }
                    >
                        ${tipo}
                    </option>

                `
            )
            .join("");

    }


    // =====================================================
    // FECHA HOY
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        const year =
            fecha.getFullYear();


        const month =
            String(
                fecha.getMonth() + 1
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


        return `${year}-${month}-${day}`;

    }


    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

    formatearFecha(
        fecha
    ) {

        if (
            !fecha
        ) {

            return "—";

        }


        const partes =
            fecha.split("-");


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
    // FORMATEAR FECHA Y HORA
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