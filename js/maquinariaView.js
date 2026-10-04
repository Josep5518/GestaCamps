export class MaquinariaView {

    constructor(
        mainContent,
        maquinariaService
    ) {

        this.mainContent =
            mainContent;

        this.maquinariaService =
            maquinariaService;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const maquinas =
            this.obtenerMaquinas();


        const activas =
            maquinas.filter(
                maquina =>
                    maquina.estado ===
                    "Activa"
            ).length;


        const mantenimiento =
            maquinas.filter(
                maquina =>
                    maquina.estado ===
                    "Mantenimiento"
            ).length;


        const inactivas =
            maquinas.filter(
                maquina =>
                    maquina.estado ===
                    "Inactiva"
            ).length;


        const horasTotales =
            maquinas.reduce(
                (
                    total,
                    maquina
                ) =>
                    total
                    +
                    Number(
                        maquina.horasUso
                        ||
                        0
                    ),
                0
            );


        this.mainContent.innerHTML = `

            <div class="maquinaria-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="maquinaria-hero">

                    <div class="maquinaria-hero-content">

                        <span class="maquinaria-eyebrow">
                            🚜 RECURSOS Y PRODUCCIÓN
                        </span>


                        <h1>
                            La fuerza del campo,
                            <span>
                                siempre preparada.
                            </span>
                        </h1>


                        <p>
                            Gestiona tractores, vehículos y equipos,
                            controla sus horas de uso y mantén
                            las revisiones siempre al día.
                        </p>


                        <button
                            id="nuevaMaquina"
                            class="
                                primary-button
                                maquinaria-hero-button
                            "
                            type="button"
                        >
                            + Nueva máquina
                        </button>

                    </div>


                    <div class="maquinaria-hero-image">

                        <div class="maquinaria-hero-badge">

                            <span>
                                Máquinas activas
                            </span>

                            <strong>
                                ${activas}
                            </strong>

                        </div>


                        <div class="maquinaria-hero-copy">

                            <small>
                                POTENCIA · CONTROL · MANTENIMIENTO
                            </small>


                            <strong>
                                Tu maquinaria,<br>
                                lista para trabajar
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats maquinaria-stats">

                    ${this.crearStat(
                        "🚜",
                        "Maquinaria",
                        maquinas.length
                    )}


                    ${this.crearStat(
                        "✅",
                        "Activas",
                        activas
                    )}


                    ${this.crearStat(
                        "🔧",
                        "Mantenimiento",
                        mantenimiento
                    )}


                    ${this.crearStat(
                        "⏱️",
                        "Horas registradas",
                        `${this.formatearNumero(
                            horasTotales
                        )} h`
                    )}

                </section>


                <!-- ==========================================
                     CABECERA
                =========================================== -->

                <div class="maquinaria-section-header">

                    <div>

                        <span class="maquinaria-section-eyebrow">
                            PARQUE DE MAQUINARIA
                        </span>


                        <h2>
                            Vehículos y equipos
                        </h2>


                        <p>
                            Consulta el estado, uso y mantenimiento
                            de todos los recursos de la explotación.
                        </p>

                    </div>


                    <div class="maquinaria-summary">

                        <span>
                            ${activas} activas
                        </span>


                        ${
                            mantenimiento >
                            0

                                ? `

                                    <span class="warning">
                                        ${mantenimiento} en mantenimiento
                                    </span>

                                `

                                : ""
                        }


                        ${
                            inactivas >
                            0

                                ? `

                                    <span>
                                        ${inactivas} inactivas
                                    </span>

                                `

                                : ""
                        }

                    </div>

                </div>


                <!-- ==========================================
                     LISTA
                =========================================== -->

                <div
                    id="listaMaquinaria"
                    class="maquinaria-list"
                ></div>

            </div>

        `;


        document
            .getElementById(
                "nuevaMaquina"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrarFormularioCrear()
            );


        this.mostrarLista();

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
                        ${this.escapar(
                            valor
                        )}
                    </h3>

                </div>

            </article>

        `;

    }


    // =====================================================
    // LISTA
    // =====================================================

    mostrarLista() {

        const maquinas =
            this.obtenerMaquinas();


        const contenedor =
            document
                .getElementById(
                    "listaMaquinaria"
                );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            maquinas.length ===
            0
        ) {

            contenedor.innerHTML =
                this.crearVacio();


            document
                .getElementById(
                    "crearPrimeraMaquina"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormularioCrear()
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="maquinaria-grid">

                ${maquinas
                    .map(
                        (
                            maquina,
                            index
                        ) =>
                            this.crearTarjeta(
                                maquina,
                                index
                            )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        maquina,
        index
    ) {

        const imagen =
            (
                index %
                3
            )
            +
            1;


        const estado =
            maquina.estado
            ||
            "Activa";


        const revision =
            this.obtenerEstadoRevision(
                maquina.proximaRevision
            );


        return `

            <article class="maquina-card">

                <!-- ==================================
                     FOTO
                =================================== -->

                <div
                    class="
                        maquina-cover
                        maquina-cover-${imagen}
                    "
                >

                    <div class="maquina-cover-overlay"></div>


                    <div class="maquina-cover-top">

                        <span
                            class="
                                maquina-status
                                ${this.obtenerClaseEstado(
                                    estado
                                )}
                            "
                        >

                            ●
                            ${this.escapar(
                                estado
                            )}

                        </span>


                        <div class="maquina-cover-actions">

                            <button
                                class="
                                    maquina-icon-button
                                    editar-maquina
                                "
                                data-id="${this.escapar(
                                    maquina.id
                                )}"
                                type="button"
                                title="Editar máquina"
                            >
                                ✎
                            </button>


                            <button
                                class="
                                    maquina-icon-button
                                    maquina-delete
                                    eliminar-maquina
                                "
                                data-id="${this.escapar(
                                    maquina.id
                                )}"
                                type="button"
                                title="Eliminar máquina"
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    <div class="maquina-cover-copy">

                        <span>
                            ${this.obtenerIconoTipo(
                                maquina.tipo
                            )}

                            ${this.escapar(
                                maquina.tipo
                                ||
                                "MAQUINARIA"
                            )}
                        </span>


                        <strong>
                            ${this.escapar(
                                maquina.nombre
                                ||
                                "Máquina"
                            )}
                        </strong>


                        ${
                            maquina.marca
                            ||
                            maquina.modelo

                                ? `

                                    <p>

                                        ${this.escapar(
                                            [
                                                maquina.marca,
                                                maquina.modelo
                                            ]
                                                .filter(Boolean)
                                                .join(" · ")
                                        )}

                                    </p>

                                `

                                : ""
                        }

                    </div>

                </div>


                <!-- ==================================
                     CUERPO
                =================================== -->

                <div class="maquina-card-body">

                    <div class="maquina-title-row">

                        <div>

                            <span class="maquina-kicker">
                                RECURSO AGRÍCOLA
                            </span>


                            <h3>
                                ${this.escapar(
                                    maquina.nombre
                                    ||
                                    "Máquina"
                                )}
                            </h3>

                        </div>


                        <span class="maquina-type-chip">

                            ${this.obtenerIconoTipo(
                                maquina.tipo
                            )}

                            ${this.escapar(
                                maquina.tipo
                                ||
                                "Otro"
                            )}

                        </span>

                    </div>


                    ${
                        maquina.marca
                        ||
                        maquina.modelo

                            ? `

                                <p class="maquina-modelo">

                                    ${this.escapar(
                                        [
                                            maquina.marca,
                                            maquina.modelo
                                        ]
                                            .filter(Boolean)
                                            .join(" · ")
                                    )}

                                </p>

                            `

                            : ""
                    }


                    <div class="maquina-info-grid">

                        <div>

                            <span>
                                Estado
                            </span>


                            <strong>
                                ${this.escapar(
                                    estado
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Horas de uso
                            </span>


                            <strong>

                                ${this.formatearNumero(
                                    maquina.horasUso
                                    ||
                                    0
                                )} h

                            </strong>

                        </div>

                    </div>


                    ${
                        maquina.matricula

                            ? `

                                <div class="maquina-detail-row">

                                    <span>
                                        🪪
                                    </span>


                                    <div>

                                        <small>
                                            Matrícula / identificador
                                        </small>


                                        <strong>
                                            ${this.escapar(
                                                maquina.matricula
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    ${
                        maquina.proximaRevision

                            ? `

                                <div
                                    class="
                                        maquina-revision
                                        ${revision.clase}
                                    "
                                >

                                    <span>
                                        🔧
                                    </span>


                                    <div>

                                        <small>
                                            Próxima revisión
                                        </small>


                                        <strong>

                                            ${this.formatearFecha(
                                                maquina.proximaRevision
                                            )}

                                        </strong>


                                        <p>
                                            ${revision.texto}
                                        </p>

                                    </div>

                                </div>

                            `

                            : `

                                <div class="maquina-revision neutral">

                                    <span>
                                        🔧
                                    </span>


                                    <div>

                                        <small>
                                            Próxima revisión
                                        </small>


                                        <strong>
                                            Sin programar
                                        </strong>

                                    </div>

                                </div>

                            `
                    }


                    ${
                        maquina.notas

                            ? `

                                <div class="maquina-notas">

                                    <span>
                                        NOTAS
                                    </span>


                                    <p>
                                        ${this.escapar(
                                            maquina.notas
                                        )}
                                    </p>

                                </div>

                            `

                            : ""
                    }


                    <button
                        class="
                            maquina-main-action
                            editar-maquina
                        "
                        data-id="${this.escapar(
                            maquina.id
                        )}"
                        type="button"
                    >

                        Ver y editar máquina

                        <span>
                            →
                        </span>

                    </button>

                </div>

            </article>

        `;

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-maquina"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormularioEditar(
                                boton.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-maquina"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                boton.dataset.id;


                            const maquina =
                                this.maquinariaService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !maquina
                            ) {

                                alert(
                                    "La máquina no existe."
                                );

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar "${maquina.nombre}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.maquinariaService
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
                                    ||
                                    "No se ha podido eliminar la máquina."
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
    // FORMULARIO CREAR
    // =====================================================

    mostrarFormularioCrear() {

        this.mostrarFormulario(
            null
        );

    }


    // =====================================================
    // FORMULARIO EDITAR
    // =====================================================

    mostrarFormularioEditar(
        id
    ) {

        const maquina =
            this.maquinariaService
                .obtenerPorId(
                    id
                );


        if (
            !maquina
        ) {

            alert(
                "La máquina no existe."
            );

            return;

        }


        this.mostrarFormulario(
            maquina
        );

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        maquina
    ) {

        const editando =
            !!maquina;


        this.mainContent.innerHTML = `

            <div class="maquinaria-form-page">

                <button
                    id="volverMaquinaria"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="maquinaria-form-header">

                    <span>
                        🚜 RECURSOS Y PRODUCCIÓN
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar maquinaria"
                                : "Nueva máquina"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza los datos, uso y mantenimiento del equipo."

                                : "Añade un nuevo vehículo o equipo a la explotación."
                        }

                    </p>

                </header>


                <div class="maquinaria-form-layout">

                    ${this.crearFormulario(
                        maquina
                    )}


                    <aside class="maquinaria-form-aside">

                        <div class="maquinaria-form-photo">

                            <div>

                                <span>
                                    RECURSOS DE CAMPO
                                </span>


                                <strong>
                                    Cuidar la máquina
                                    es cuidar la campaña.
                                </strong>

                            </div>

                        </div>


                        <div class="maquinaria-form-tip">

                            <span>
                                🔧
                            </span>


                            <div>

                                <strong>
                                    Mantenimiento preventivo
                                </strong>


                                <p>
                                    Registra las horas de uso y la próxima
                                    revisión para anticiparte a averías
                                    durante la campaña.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverMaquinaria"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarMaquina"
            )
            ?.addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "guardarMaquina"
            )
            ?.addEventListener(
                "click",
                () => {

                    if (
                        editando
                    ) {

                        this.guardarCambios(
                            maquina.id
                        );

                    }

                    else {

                        this.guardarNueva();

                    }

                }
            );

    }


    // =====================================================
    // CREAR FORMULARIO
    // =====================================================

    crearFormulario(
        maquina
    ) {

        return `

            <section
                class="
                    form-panel
                    maquinaria-form-panel
                "
            >

                <div class="maquinaria-form-section">

                    <span>
                        ${this.obtenerIconoTipo(
                            maquina?.tipo
                            ||
                            "Tractor"
                        )}
                    </span>


                    <div>

                        <h3>
                            Datos de la máquina
                        </h3>


                        <p>
                            Información, estado y mantenimiento.
                        </p>

                    </div>

                </div>


                <div class="maquinaria-form-grid">

                    <div
                        class="
                            form-group
                            maquinaria-form-wide
                        "
                    >

                        <label>
                            Nombre *
                        </label>


                        <input
                            id="nombreMaquina"
                            type="text"
                            placeholder="Ej. Tractor principal"
                            value="${this.escapar(
                                maquina?.nombre
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Tipo
                        </label>


                        <select id="tipoMaquina">

                            ${this.crearOpcionesTipo(
                                maquina?.tipo
                            )}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Estado
                        </label>


                        <select id="estadoMaquina">

                            <option
                                value="Activa"
                                ${
                                    !maquina
                                    ||
                                    maquina.estado ===
                                    "Activa"

                                        ? "selected"

                                        : ""
                                }
                            >
                                Activa
                            </option>


                            <option
                                value="Mantenimiento"
                                ${
                                    maquina?.estado ===
                                    "Mantenimiento"

                                        ? "selected"

                                        : ""
                                }
                            >
                                Mantenimiento
                            </option>


                            <option
                                value="Inactiva"
                                ${
                                    maquina?.estado ===
                                    "Inactiva"

                                        ? "selected"

                                        : ""
                                }
                            >
                                Inactiva
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Marca
                        </label>


                        <input
                            id="marcaMaquina"
                            type="text"
                            placeholder="Ej. John Deere"
                            value="${this.escapar(
                                maquina?.marca
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Modelo
                        </label>


                        <input
                            id="modeloMaquina"
                            type="text"
                            placeholder="Ej. 6155R"
                            value="${this.escapar(
                                maquina?.modelo
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Matrícula / identificador
                        </label>


                        <input
                            id="matriculaMaquina"
                            type="text"
                            placeholder="Ej. E-1234-BBB"
                            value="${this.escapar(
                                maquina?.matricula
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Horas de uso
                        </label>


                        <input
                            id="horasMaquina"
                            type="number"
                            min="0"
                            step="0.1"
                            value="${
                                Number(
                                    maquina?.horasUso
                                    ??
                                    0
                                )
                            }"
                        >

                    </div>


                    <div
                        class="
                            form-group
                            maquinaria-form-wide
                        "
                    >

                        <label>
                            Próxima revisión
                        </label>


                        <input
                            id="revisionMaquina"
                            type="date"
                            value="${this.escapar(
                                maquina?.proximaRevision
                                ||
                                ""
                            )}"
                        >

                    </div>


                    <div
                        class="
                            form-group
                            maquinaria-form-wide
                        "
                    >

                        <label>
                            Notas
                        </label>


                        <textarea
                            id="notasMaquina"
                            rows="5"
                            placeholder="Mantenimiento, averías, observaciones..."
                        >${this.escapar(
                            maquina?.notas
                            ||
                            ""
                        )}</textarea>

                    </div>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarMaquina"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarMaquina"
                        class="primary-button"
                        type="button"
                    >

                        ${
                            maquina
                                ? "Guardar cambios"
                                : "Guardar máquina"
                        }

                    </button>

                </div>

            </section>

        `;

    }


    // =====================================================
    // GUARDAR NUEVA
    // =====================================================

    guardarNueva() {

        const datos =
            this.obtenerDatosFormulario();


        if (
            !datos
        ) {

            return;

        }


        const resultado =
            this.maquinariaService
                .crear(
                    datos
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido crear la máquina."
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // GUARDAR CAMBIOS
    // =====================================================

    guardarCambios(
        id
    ) {

        const datos =
            this.obtenerDatosFormulario();


        if (
            !datos
        ) {

            return;

        }


        const resultado =
            this.maquinariaService
                .actualizar(
                    id,
                    datos
                );


        if (
            !resultado?.ok
        ) {

            alert(
                resultado?.mensaje
                ||
                "No se ha podido actualizar la máquina."
            );

            return;

        }


        this.mostrar();

    }


    // =====================================================
    // DATOS FORMULARIO
    // =====================================================

    obtenerDatosFormulario() {

        const nombre =
            document
                .getElementById(
                    "nombreMaquina"
                )
                ?.value
                .trim()
            ||
            "";


        if (
            !nombre
        ) {

            alert(
                "Introduce un nombre para la máquina."
            );

            return null;

        }


        return {

            nombre,

            tipo:
                this.obtenerValor(
                    "tipoMaquina"
                ),

            marca:
                this.obtenerValor(
                    "marcaMaquina"
                ),

            modelo:
                this.obtenerValor(
                    "modeloMaquina"
                ),

            matricula:
                this.obtenerValor(
                    "matriculaMaquina"
                ),

            estado:
                this.obtenerValor(
                    "estadoMaquina"
                )
                ||
                "Activa",

            horasUso:
                Number(
                    this.obtenerValor(
                        "horasMaquina"
                    )
                    ||
                    0
                ),

            proximaRevision:
                this.obtenerValor(
                    "revisionMaquina"
                ),

            notas:
                this.obtenerValor(
                    "notasMaquina"
                )

        };

    }


    // =====================================================
    // VALOR
    // =====================================================

    obtenerValor(
        id
    ) {

        return (
            document
                .getElementById(
                    id
                )
                ?.value
                ?.trim()
            ||
            ""
        );

    }


    // =====================================================
    // DATOS
    // =====================================================

    obtenerMaquinas() {

        if (
            typeof this.maquinariaService
                ?.obtenerTodas !==
            "function"
        ) {

            return [];

        }


        const maquinas =
            this.maquinariaService
                .obtenerTodas();


        return Array.isArray(
            maquinas
        )
            ? maquinas
            : [];

    }


    // =====================================================
    // TIPOS
    // =====================================================

    crearOpcionesTipo(
        tipoActual
    ) {

        const tipos = [

            "Tractor",
            "Remolque",
            "Atomizador",
            "Pulverizador",
            "Cosechadora",
            "Desbrozadora",
            "Carretilla elevadora",
            "Vehículo",
            "Implemento",
            "Otro"

        ];


        return tipos
            .map(
                tipo => `

                    <option
                        value="${this.escapar(
                            tipo
                        )}"
                        ${
                            tipo ===
                            tipoActual

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
            .join("");

    }


    // =====================================================
    // ICONO
    // =====================================================

    obtenerIconoTipo(
        tipo
    ) {

        switch (
            tipo
        ) {

            case "Tractor":
                return "🚜";

            case "Remolque":
                return "🛻";

            case "Atomizador":
                return "💨";

            case "Pulverizador":
                return "💧";

            case "Cosechadora":
                return "🌾";

            case "Desbrozadora":
                return "🌿";

            case "Vehículo":
                return "🚙";

            case "Carretilla elevadora":
                return "🏗️";

            case "Implemento":
                return "⚙️";

            default:
                return "⚙️";

        }

    }


    // =====================================================
    // ESTADO
    // =====================================================

    obtenerClaseEstado(
        estado
    ) {

        if (
            estado ===
            "Mantenimiento"
        ) {

            return "mantenimiento";

        }


        if (
            estado ===
            "Inactiva"
        ) {

            return "inactiva";

        }


        return "activa";

    }


    // =====================================================
    // ESTADO REVISIÓN
    // =====================================================

    obtenerEstadoRevision(
        fechaRevision
    ) {

        if (
            !fechaRevision
        ) {

            return {

                clase:
                    "neutral",

                texto:
                    "Sin revisión programada"

            };

        }


        const revision =
            new Date(
                `${fechaRevision}T00:00:00`
            );


        const hoy =
            new Date();


        hoy.setHours(
            0,
            0,
            0,
            0
        );


        if (
            Number.isNaN(
                revision.getTime()
            )
        ) {

            return {

                clase:
                    "neutral",

                texto:
                    ""

            };

        }


        const diferencia =
            Math.ceil(
                (
                    revision
                    -
                    hoy
                )
                /
                86400000
            );


        if (
            diferencia <
            0
        ) {

            return {

                clase:
                    "overdue",

                texto:
                    "Revisión vencida"

            };

        }


        if (
            diferencia ===
            0
        ) {

            return {

                clase:
                    "soon",

                texto:
                    "Revisión hoy"

            };

        }


        if (
            diferencia <=
            30
        ) {

            return {

                clase:
                    "soon",

                texto:
                    `Dentro de ${diferencia} días`

            };

        }


        return {

            clase:
                "ok",

            texto:
                "Revisión programada"

        };

    }


    // =====================================================
    // FECHA
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
                .split("-");


        if (
            partes.length !==
            3
        ) {

            return String(
                fecha
            );

        }


        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    // =====================================================
    // NÚMERO
    // =====================================================

    formatearNumero(
        valor
    ) {

        const numero =
            Number(
                valor
                ||
                0
            );


        return numero
            .toLocaleString(
                "es-ES",
                {

                    maximumFractionDigits:
                        1

                }
            );

    }


    // =====================================================
    // VACÍO
    // =====================================================

    crearVacio() {

        return `

            <div class="maquinaria-empty">

                <div class="maquinaria-empty-icon">
                    🚜
                </div>


                <h3>
                    Todavía no tienes maquinaria
                </h3>


                <p>
                    Añade tu primer tractor, vehículo
                    o equipo agrícola.
                </p>


                <button
                    id="crearPrimeraMaquina"
                    class="primary-button"
                    type="button"
                >
                    + Añadir maquinaria
                </button>

            </div>

        `;

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

}