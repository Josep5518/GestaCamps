// =====================================================
// GESTACAMPS
// VISTA DE TRABAJOS Y TAREAS
// =====================================================

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


        this.vistaActual =
            "lista";


        const hoy =
            new Date();


        this.fechaCalendario =
            new Date(
                hoy.getFullYear(),
                hoy.getMonth(),
                1
            );

    }


    // =====================================================
    // UTILIDADES DE IDS
    // =====================================================

    mismoId(
        idA,
        idB
    ) {

        if (
            idA ===
            null
            ||
            idA ===
            undefined
            ||
            idB ===
            null
            ||
            idB ===
            undefined
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

            const trabajadores =
                this.trabajadorService
                    .obtenerTodos();


            return Array.isArray(
                trabajadores
            )
                ? trabajadores
                : [];

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

            const maquinaria =
                this.maquinariaService
                    .obtenerTodos();


            return Array.isArray(
                maquinaria
            )
                ? maquinaria
                : [];

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
            id ===
            null
            ||
            id ===
            undefined
            ||
            id ===
            ""
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

            return (
                this.trabajadorService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return (
            this.obtenerTrabajadores()
                .find(
                    trabajador =>
                        this.mismoId(
                            trabajador.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // MAQUINARIA POR ID
    // =====================================================

    obtenerMaquinariaPorId(
        id
    ) {

        if (
            id ===
            null
            ||
            id ===
            undefined
            ||
            id ===
            ""
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

            return (
                this.maquinariaService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return (
            this.obtenerMaquinaria()
                .find(
                    maquina =>
                        this.mismoId(
                            maquina.id,
                            id
                        )
                )
            ||
            null
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


        return (
            [
                trabajador.nombre,
                trabajador.apellidos
            ]
                .filter(
                    Boolean
                )
                .join(
                    " "
                )
                .trim()
            ||
            `Trabajador ${trabajador.id || ""}`
        );

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


        return (
            maquina.nombre
            ||
            [
                maquina.marca,
                maquina.modelo
            ]
                .filter(
                    Boolean
                )
                .join(
                    " · "
                )
            ||
            `Maquinaria ${maquina.id || ""}`
        );

    }


    // =====================================================
    // NOMBRES TRABAJADORES DE TAREA
    // =====================================================

    obtenerNombresTrabajo(
        trabajo
    ) {

        if (
            Array.isArray(
                trabajo.trabajadorNombres
            )
            &&
            trabajo.trabajadorNombres.length >
            0
        ) {

            return trabajo
                .trabajadorNombres
                .join(
                    ", "
                );

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
            trabajos
                .filter(
                    trabajo =>
                        trabajo.estado ===
                        "Pendiente"
                )
                .length;


        const enCurso =
            trabajos
                .filter(
                    trabajo =>
                        trabajo.estado ===
                        "En curso"
                )
                .length;


        const completadas =
            trabajos
                .filter(
                    trabajo =>
                        trabajo.estado ===
                        "Completada"
                )
                .length;


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


            <!-- ==========================================
                 CAMBIO LISTA / CALENDARIO
            =========================================== -->

            <div
                style="
                    display:flex;
                    gap:8px;
                    margin:20px 0 14px;
                    padding:5px;
                    background:#eef3ef;
                    border-radius:12px;
                    width:max-content;
                    max-width:100%;
                "
            >

                <button
                    id="vistaListaTrabajos"
                    type="button"
                    style="
                        border:0;
                        border-radius:9px;
                        padding:9px 14px;
                        cursor:pointer;
                        font-weight:600;
                        background:${
                            this.vistaActual ===
                            "lista"
                                ? "#1f7659"
                                : "transparent"
                        };
                        color:${
                            this.vistaActual ===
                            "lista"
                                ? "#ffffff"
                                : "#365247"
                        };
                    "
                >
                    📋 Lista
                </button>


                <button
                    id="vistaCalendarioTrabajos"
                    type="button"
                    style="
                        border:0;
                        border-radius:9px;
                        padding:9px 14px;
                        cursor:pointer;
                        font-weight:600;
                        background:${
                            this.vistaActual ===
                            "calendario"
                                ? "#1f7659"
                                : "transparent"
                        };
                        color:${
                            this.vistaActual ===
                            "calendario"
                                ? "#ffffff"
                                : "#365247"
                        };
                    "
                >
                    📅 Calendario
                </button>

            </div>


            <div id="contenidoTrabajos"></div>

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


        document
            .getElementById(
                "vistaListaTrabajos"
            )
            .addEventListener(
                "click",
                () => {

                    this.vistaActual =
                        "lista";

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "vistaCalendarioTrabajos"
            )
            .addEventListener(
                "click",
                () => {

                    this.vistaActual =
                        "calendario";

                    this.mostrar();

                }
            );


        if (
            this.vistaActual ===
            "calendario"
        ) {

            this.mostrarCalendario();

        }

        else {

            this.mostrarLista();

        }

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
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.fecha
                            ||
                            0
                        )
                        -
                        new Date(
                            a.fecha
                            ||
                            0
                        )
                );


        const contenedor =
            document.getElementById(
                "contenidoTrabajos"
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

                ${trabajos
                    .map(
                        trabajo =>
                            this.crearTarjetaTrabajo(
                                trabajo
                            )
                    )
                    .join(
                        ""
                    )}

            </div>

        `;


        this.configurarEventosLista();

    }


    // =====================================================
    // TARJETA TRABAJO
    // =====================================================

    crearTarjetaTrabajo(
        trabajo
    ) {

        const idSeguro =
            this.escapar(
                trabajo.id
            );


        return `

            <div class="trabajo-card">

                <div class="trabajo-card-header">

                    <span class="trabajo-icon">
                        🚜
                    </span>


                    <div class="trabajo-actions">

                        <button
                            type="button"
                            class="
                                secondary-button
                                editar-trabajo
                            "
                            data-id="${idSeguro}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="
                                delete-button
                                eliminar-trabajo
                            "
                            data-id="${idSeguro}"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <h3>
                    ${this.escapar(
                        trabajo.titulo
                        ||
                        "Trabajo"
                    )}
                </h3>


                <strong class="trabajo-tipo">

                    ${this.escapar(
                        trabajo.tipo
                        ||
                        trabajo.titulo
                        ||
                        "Trabajo"
                    )}

                </strong>


                <p class="trabajo-linea">

                    📍
                    ${this.escapar(
                        trabajo.fincaNombre
                        ||
                        "Sin finca"
                    )}

                    ${
                        trabajo.parcela

                            ? ` · ${this.escapar(
                                trabajo.parcela
                            )}`

                            : ""
                    }

                </p>


                ${
                    trabajo.cultivo

                        ? `

                            <p class="trabajo-linea">
                                🌱
                                ${this.escapar(
                                    trabajo.cultivo
                                )}
                            </p>

                        `

                        : ""
                }


                ${
                    trabajo.campaniaNombre

                        ? `

                            <p class="trabajo-campania">
                                📅
                                ${this.escapar(
                                    trabajo.campaniaNombre
                                )}
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
                            ${this.escapar(
                                trabajo.estado
                                ||
                                "Pendiente"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Prioridad
                        </span>

                        <strong>
                            ${this.escapar(
                                trabajo.prioridad
                                ||
                                "Media"
                            )}
                        </strong>

                    </div>

                </div>


                <p class="trabajo-linea">

                    🗓️
                    ${this.formatearFecha(
                        trabajo.fecha
                    )}

                </p>


                <p class="trabajo-linea">

                    👷
                    ${this.escapar(
                        this.obtenerNombresTrabajo(
                            trabajo
                        )
                    )}

                </p>


                <p class="trabajo-linea">

                    🚜
                    ${this.escapar(
                        trabajo.maquinariaNombre
                        ||
                        "Sin maquinaria asignada"
                    )}

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
                                    ${this.escapar(
                                        trabajo.notas
                                    )}
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
                                    data-id="${idSeguro}"
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
                                    data-id="${idSeguro}"
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
                                    data-id="${idSeguro}"
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
                                    data-id="${idSeguro}"
                                    data-estado="En curso"
                                >
                                    ↩ Reabrir
                                </button>

                            `

                            : ""
                    }

                </div>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS LISTA
    // =====================================================

    configurarEventosLista() {

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
                                boton.dataset.id
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
                                boton.dataset.id;


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
                                        boton.dataset.id,
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
    // CALENDARIO
    // =====================================================

    mostrarCalendario() {

        const contenedor =
            document.getElementById(
                "contenidoTrabajos"
            );


        if (
            !contenedor
        ) {

            return;

        }


        const trabajos =
            this.trabajoService
                .obtenerTodos();


        const anio =
            this.fechaCalendario
                .getFullYear();


        const mes =
            this.fechaCalendario
                .getMonth();


        const primerDiaMes =
            new Date(
                anio,
                mes,
                1
            );


        const ultimoDiaMes =
            new Date(
                anio,
                mes + 1,
                0
            );


        const diasMes =
            ultimoDiaMes
                .getDate();


        // JavaScript:
        // Domingo = 0
        // Lunes = 1
        //
        // Nuestro calendario:
        // Lunes = 0
        // Domingo = 6

        const desplazamiento =
            (
                primerDiaMes
                    .getDay()
                +
                6
            )
            %
            7;


        const nombreMes =
            this.fechaCalendario
                .toLocaleDateString(
                    "es-ES",
                    {
                        month:
                            "long",

                        year:
                            "numeric"
                    }
                );


        const cabeceraDias =
            [
                "Lun",
                "Mar",
                "Mié",
                "Jue",
                "Vie",
                "Sáb",
                "Dom"
            ];


        let celdas =
            "";


        for (
            let i = 0;
            i < desplazamiento;
            i++
        ) {

            celdas += `

                <div
                    style="
                        min-height:105px;
                        border:1px solid #edf1ee;
                        background:#fafcfb;
                        border-radius:10px;
                    "
                ></div>

            `;

        }


        for (
            let dia = 1;
            dia <= diasMes;
            dia++
        ) {

            const fecha =
                this.crearFechaISO(
                    anio,
                    mes,
                    dia
                );


            const tareasDia =
                trabajos
                    .filter(
                        trabajo =>
                            trabajo.fecha ===
                            fecha
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            this.obtenerOrdenPrioridad(
                                a.prioridad
                            )
                            -
                            this.obtenerOrdenPrioridad(
                                b.prioridad
                            )
                    );


            const esHoy =
                fecha ===
                this.obtenerFechaHoy();


            celdas += `

                <div
                    class="calendario-dia"
                    data-fecha="${fecha}"
                    style="
                        min-height:105px;
                        border:${
                            esHoy
                                ? "2px solid #2b8767"
                                : "1px solid #e4ebe6"
                        };
                        background:${
                            esHoy
                                ? "#f0faf5"
                                : "#ffffff"
                        };
                        border-radius:10px;
                        padding:7px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-bottom:6px;
                        "
                    >

                        <strong
                            style="
                                font-size:13px;
                                color:${
                                    esHoy
                                        ? "#176044"
                                        : "#273b33"
                                };
                            "
                        >
                            ${dia}
                        </strong>


                        ${
                            esHoy

                                ? `

                                    <span
                                        style="
                                            font-size:9px;
                                            background:#dff4e8;
                                            color:#176044;
                                            border-radius:999px;
                                            padding:2px 5px;
                                        "
                                    >
                                        Hoy
                                    </span>

                                `

                                : ""
                        }

                    </div>


                    <div
                        style="
                            display:grid;
                            gap:4px;
                        "
                    >

                        ${tareasDia
                            .map(
                                trabajo =>
                                    this.crearEventoCalendario(
                                        trabajo
                                    )
                            )
                            .join(
                                ""
                            )}

                    </div>

                </div>

            `;

        }


        contenedor.innerHTML = `

            <section
                style="
                    background:#ffffff;
                    border-radius:14px;
                    padding:16px;
                    box-shadow:0 4px 14px rgba(20,60,40,.05);
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:10px;
                        flex-wrap:wrap;
                        margin-bottom:14px;
                    "
                >

                    <div>

                        <h3
                            style="
                                margin:0;
                                text-transform:capitalize;
                            "
                        >
                            ${this.escapar(
                                nombreMes
                            )}
                        </h3>

                        <p
                            style="
                                margin:4px 0 0;
                                color:#78837d;
                                font-size:13px;
                            "
                        >
                            Calendario real de trabajos
                        </p>

                    </div>


                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:6px;
                        "
                    >

                        <button
                            id="mesAnterior"
                            type="button"
                            class="secondary-button"
                            title="Mes anterior"
                        >
                            ←
                        </button>


                        <button
                            id="irHoy"
                            type="button"
                            class="secondary-button"
                        >
                            Hoy
                        </button>


                        <button
                            id="mesSiguiente"
                            type="button"
                            class="secondary-button"
                            title="Mes siguiente"
                        >
                            →
                        </button>

                    </div>

                </div>


                <div
                    style="
                        overflow-x:auto;
                        padding-bottom:4px;
                    "
                >

                    <div
                        style="
                            min-width:0;
                            display:grid;
                            grid-template-columns:repeat(7, minmax(0, 1fr));
                            gap:5px;
                        "
                    >

                        ${cabeceraDias
                            .map(
                                dia => `

                                    <div
                                        style="
                                            text-align:center;
                                            font-size:11px;
                                            font-weight:700;
                                            color:#66756e;
                                            padding:5px 2px;
                                        "
                                    >
                                        ${dia}
                                    </div>

                                `
                            )
                            .join(
                                ""
                            )}


                        ${celdas}

                    </div>

                </div>


                <div
                    style="
                        margin-top:14px;
                        display:flex;
                        gap:8px;
                        flex-wrap:wrap;
                        font-size:11px;
                        color:#66756e;
                    "
                >

                    <span>
                        🟡 Pendiente
                    </span>

                    <span>
                        🔵 En curso
                    </span>

                    <span>
                        🟢 Completada
                    </span>

                </div>

            </section>

        `;


        document
            .getElementById(
                "mesAnterior"
            )
            .addEventListener(
                "click",
                () => {

                    this.fechaCalendario =
                        new Date(
                            anio,
                            mes - 1,
                            1
                        );


                    this.mostrarCalendario();

                }
            );


        document
            .getElementById(
                "mesSiguiente"
            )
            .addEventListener(
                "click",
                () => {

                    this.fechaCalendario =
                        new Date(
                            anio,
                            mes + 1,
                            1
                        );


                    this.mostrarCalendario();

                }
            );


        document
            .getElementById(
                "irHoy"
            )
            .addEventListener(
                "click",
                () => {

                    const hoy =
                        new Date();


                    this.fechaCalendario =
                        new Date(
                            hoy.getFullYear(),
                            hoy.getMonth(),
                            1
                        );


                    this.mostrarCalendario();

                }
            );


        document
            .querySelectorAll(
                ".evento-calendario"
            )
            .forEach(
                evento => {

                    evento.addEventListener(
                        "click",
                        e => {

                            e.preventDefault();

                            e.stopPropagation();


                            this.mostrarFormulario(
                                evento.dataset.id
                            );

                        }
                    );

                }
            );

    }


    // =====================================================
    // EVENTO DE CALENDARIO
    // =====================================================

    crearEventoCalendario(
        trabajo
    ) {

        const estado =
            trabajo.estado
            ||
            "Pendiente";


        const estilo =
            this.obtenerEstiloEstadoCalendario(
                estado
            );


        return `

            <button
                type="button"
                class="evento-calendario"
                data-id="${this.escapar(
                    trabajo.id
                )}"
                title="${this.escapar(
                    trabajo.titulo
                    ||
                    "Trabajo"
                )}"
                style="
                    width:100%;
                    border:0;
                    border-left:3px solid ${estilo.borde};
                    border-radius:6px;
                    padding:5px;
                    background:${estilo.fondo};
                    color:${estilo.texto};
                    cursor:pointer;
                    text-align:left;
                    min-width:0;
                    overflow:hidden;
                "
            >

                <strong
                    style="
                        display:block;
                        font-size:10px;
                        line-height:1.2;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    "
                >
                    ${this.escapar(
                        trabajo.titulo
                        ||
                        "Trabajo"
                    )}
                </strong>


                <span
                    style="
                        display:block;
                        margin-top:2px;
                        font-size:8px;
                        opacity:.85;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    "
                >
                    ${this.escapar(
                        trabajo.prioridad
                        ||
                        "Media"
                    )}
                </span>

            </button>

        `;

    }


    // =====================================================
    // ESTILO ESTADO CALENDARIO
    // =====================================================

    obtenerEstiloEstadoCalendario(
        estado
    ) {

        if (
            estado ===
            "Completada"
        ) {

            return {

                fondo:
                    "#e5f7ec",

                borde:
                    "#2f9d68",

                texto:
                    "#176044"

            };

        }


        if (
            estado ===
            "En curso"
        ) {

            return {

                fondo:
                    "#e8f0fb",

                borde:
                    "#4c78b7",

                texto:
                    "#31598b"

            };

        }


        return {

            fondo:
                "#fff4dc",

            borde:
                "#d79a18",

            texto:
                "#785400"

        };

    }


    // =====================================================
    // ORDEN PRIORIDAD
    // =====================================================

    obtenerOrdenPrioridad(
        prioridad
    ) {

        const orden = {

            Urgente:
                0,

            Alta:
                1,

            Media:
                2,

            Baja:
                3

        };


        return (
            orden[
                prioridad
            ]
            ??
            99
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
                        id
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
                    .map(
                        item =>
                            String(
                                item
                            )
                    )

                : trabajo?.trabajadorId

                    ? [
                        String(
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
                        value="${this.escapar(
                            trabajo?.titulo
                            ||
                            ""
                        )}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Tipo de trabajo *
                    </label>

                    <select id="tipoTrabajo">

                        ${this.crearOpcionesTipo(
                            trabajo?.tipo
                            ||
                            trabajo?.titulo
                            ||
                            ""
                        )}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Finca *
                    </label>

                    <select id="fincaTrabajo">

                        ${fincas
                            .map(
                                finca => `

                                    <option
                                        value="${this.escapar(
                                            finca.id
                                        )}"

                                        ${
                                            this.mismoId(
                                                trabajo?.fincaId,
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
                            .join(
                                ""
                            )}

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
                        value="${this.escapar(
                            trabajo?.parcela
                            ||
                            ""
                        )}"
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
                        value="${this.escapar(
                            trabajo?.cultivo
                            ||
                            ""
                        )}"
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

                        ${[
                            "Baja",
                            "Media",
                            "Alta",
                            "Urgente"
                        ]
                            .map(
                                prioridad => `

                                    <option
                                        value="${prioridad}"

                                        ${
                                            (
                                                trabajo?.prioridad
                                                ||
                                                "Media"
                                            )
                                            ===
                                            prioridad

                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${prioridad}
                                    </option>

                                `
                            )
                            .join(
                                ""
                            )}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select id="estadoTrabajo">

                        ${[
                            "Pendiente",
                            "En curso",
                            "Completada"
                        ]
                            .map(
                                estado => `

                                    <option
                                        value="${estado}"

                                        ${
                                            (
                                                trabajo?.estado
                                                ||
                                                "Pendiente"
                                            )
                                            ===
                                            estado

                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${estado}
                                    </option>

                                `
                            )
                            .join(
                                ""
                            )}

                    </select>

                </div>


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
                                        color:#78837d;
                                        margin:8px 0;
                                    "
                                >
                                    No hay trabajadores creados.
                                </p>

                            `

                            : `

                                <div
                                    style="
                                        display:grid;
                                        gap:10px;
                                        margin-top:10px;
                                    "
                                >

                                    ${trabajadores
                                        .map(
                                            trabajador => `

                                                <label
                                                    style="
                                                        display:flex;
                                                        align-items:center;
                                                        gap:10px;
                                                        padding:10px 12px;
                                                        border:1px solid #dfe7e1;
                                                        border-radius:10px;
                                                        cursor:pointer;
                                                    "
                                                >

                                                    <input
                                                        type="checkbox"
                                                        class="trabajador-tarea-checkbox"
                                                        value="${this.escapar(
                                                            trabajador.id
                                                        )}"

                                                        ${
                                                            trabajadorIdsActuales
                                                                .includes(
                                                                    String(
                                                                        trabajador.id
                                                                    )
                                                                )

                                                                    ? "checked"
                                                                    : ""
                                                        }
                                                    >


                                                    <span>

                                                        <strong>
                                                            ${this.escapar(
                                                                this.obtenerNombreTrabajador(
                                                                    trabajador
                                                                )
                                                            )}
                                                        </strong>


                                                        ${
                                                            trabajador.puesto

                                                                ? `

                                                                    <small
                                                                        style="
                                                                            display:block;
                                                                            color:#78837d;
                                                                            margin-top:2px;
                                                                        "
                                                                    >
                                                                        ${this.escapar(
                                                                            trabajador.puesto
                                                                        )}
                                                                    </small>

                                                                `

                                                                : ""
                                                        }

                                                    </span>

                                                </label>

                                            `
                                        )
                                        .join(
                                            ""
                                        )}

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


                        ${maquinaria
                            .map(
                                maquina => `

                                    <option
                                        value="${this.escapar(
                                            maquina.id
                                        )}"

                                        ${
                                            this.mismoId(
                                                trabajo?.maquinariaId,
                                                maquina.id
                                            )

                                                ? "selected"
                                                : ""
                                        }
                                    >

                                        ${this.escapar(
                                            this.obtenerNombreMaquinaria(
                                                maquina
                                            )
                                        )}

                                    </option>

                                `
                            )
                            .join(
                                ""
                            )}

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
                    >${this.escapar(
                        trabajo?.notas
                        ||
                        ""
                    )}</textarea>

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
                    fincaSelect.value;


                const campanyas =
                    this.campaniaService
                        .obtenerTodas()
                        .filter(
                            campania =>
                                this.mismoId(
                                    campania.fincaId,
                                    fincaId
                                )
                        );


                campaniaSelect.innerHTML = `

                    <option value="">
                        Sin campanya
                    </option>


                    ${campanyas
                        .map(
                            campania => `

                                <option
                                    value="${this.escapar(
                                        campania.id
                                    )}"
                                >
                                    ${this.escapar(
                                        campania.nombre
                                    )}
                                    ·
                                    ${this.escapar(
                                        campania.estado
                                    )}
                                </option>

                            `
                        )
                        .join(
                            ""
                        )}

                `;


                if (
                    trabajo?.campaniaId
                    &&
                    campanyas.some(
                        campania =>
                            this.mismoId(
                                campania.id,
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


        fincaSelect
            .addEventListener(
                "change",
                cargarCampanyas
            );


        cargarCampanyas();


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
                ||
                null;


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
                        checkbox.value
                );


        const trabajadoresSeleccionados =
            trabajadorIds
                .map(
                    trabajadorId =>
                        this.obtenerTrabajadorPorId(
                            trabajadorId
                        )
                )
                .filter(
                    Boolean
                );


        const trabajadorNombres =
            trabajadoresSeleccionados
                .map(
                    trabajador =>
                        this.obtenerNombreTrabajador(
                            trabajador
                        )
                );


        const fincaId =
            document
                .getElementById(
                    "fincaTrabajo"
                )
                .value;


        const campaniaId =
            document
                .getElementById(
                    "campaniaTrabajo"
                )
                .value
            ||
            null;


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
                fincaId,

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
                campaniaId,

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
                        id,
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
                        value="${this.escapar(
                            tipo
                        )}"

                        ${
                            seleccionado ===
                            tipo
                                ? "selected"
                                : ""
                        }
                    >
                        ${this.escapar(
                            tipo
                        )}
                    </option>

                `
            )
            .join(
                ""
            );

    }


    // =====================================================
    // CREAR FECHA ISO
    // =====================================================

    crearFechaISO(
        anio,
        mes,
        dia
    ) {

        return (
            `${anio}-${String(
                mes + 1
            ).padStart(
                2,
                "0"
            )}-${String(
                dia
            ).padStart(
                2,
                "0"
            )}`
        );

    }


    // =====================================================
    // FECHA HOY
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        return this.crearFechaISO(
            fecha.getFullYear(),
            fecha.getMonth(),
            fecha.getDate()
        );

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

            return this.escapar(
                fecha
            );

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

            return this.escapar(
                valor
            );

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