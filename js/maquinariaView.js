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
            this.maquinariaService
                .obtenerTodas();


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


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Maquinaria
                    </h2>

                    <p>
                        Gestiona vehículos y maquinaria de la explotación
                    </p>

                </div>


                <button
                    id="nuevaMaquina"
                    class="primary-button"
                    type="button"
                >
                    + Nueva máquina
                </button>

            </header>


            <section class="stats maquinaria-stats">

                ${this.crearStat(
                    "🚜",
                    "Maquinaria",
                    maquinas.length
                )}


                ${this.crearStat(
                    "✅",
                    "Activa",
                    activas
                )}


                ${this.crearStat(
                    "🔧",
                    "Mantenimiento",
                    mantenimiento
                )}


                ${this.crearStat(
                    "⛔",
                    "Inactiva",
                    inactivas
                )}

            </section>


            <div id="listaMaquinaria"></div>

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
    // LISTA
    // =====================================================

    mostrarLista() {

        const maquinas =
            this.maquinariaService
                .obtenerTodas();


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

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🚜
                    </div>

                    <h3>
                        Todavía no tienes maquinaria
                    </h3>

                    <p>
                        Añade tu primera máquina o vehículo.
                    </p>

                </div>

            `;


            return;
        }


        contenedor.innerHTML = `

            <div class="maquinaria-grid">

                ${maquinas
                    .map(
                        maquina =>
                            this.crearTarjetaMaquina(
                                maquina
                            )
                    )
                    .join("")}

            </div>

        `;


        // =================================================
        // EDITAR
        // =================================================

        contenedor
            .querySelectorAll(
                ".editar-maquina"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            /*
                             * IMPORTANTE:
                             * El ID puede ser UUID.
                             * No usar Number().
                             */

                            this.mostrarFormularioEditar(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        // =================================================
        // ELIMINAR
        // =================================================

        contenedor
            .querySelectorAll(
                ".eliminar-maquina"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            /*
                             * Mantener el ID original.
                             */

                            const id =
                                button.dataset.id;


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
    // TARJETA
    // =====================================================

    crearTarjetaMaquina(
        maquina
    ) {

        return `

            <article class="maquina-card">

                <div class="maquina-card-header">

                    <span class="maquina-icon">

                        ${this.obtenerIconoTipo(
                            maquina.tipo
                        )}

                    </span>


                    <div class="maquina-actions">

                        <button
                            class="
                                secondary-button
                                editar-maquina
                            "
                            data-id="${maquina.id}"
                            type="button"
                        >
                            Editar
                        </button>


                        <button
                            class="
                                delete-button
                                eliminar-maquina
                            "
                            data-id="${maquina.id}"
                            type="button"
                            aria-label="Eliminar máquina"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <h3>
                    ${maquina.nombre}
                </h3>


                ${
                    maquina.tipo

                        ? `

                            <p class="maquina-tipo">
                                ${maquina.tipo}
                            </p>

                        `

                        : ""
                }


                ${
                    maquina.marca
                    ||
                    maquina.modelo

                        ? `

                            <p class="maquina-modelo">

                                ${maquina.marca || ""}

                                ${
                                    maquina.modelo

                                        ? ` · ${maquina.modelo}`

                                        : ""
                                }

                            </p>

                        `

                        : ""
                }


                <div class="maquina-info">

                    <div>

                        <span>
                            Estado
                        </span>

                        <strong>
                            ${maquina.estado}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Horas
                        </span>

                        <strong>
                            ${maquina.horasUso} h
                        </strong>

                    </div>

                </div>


                ${
                    maquina.matricula

                        ? `

                            <p>
                                🪪 ${maquina.matricula}
                            </p>

                        `

                        : ""
                }


                ${
                    maquina.proximaRevision

                        ? `

                            <p>

                                🔧 Próxima revisión:

                                ${this.formatearFecha(
                                    maquina.proximaRevision
                                )}

                            </p>

                        `

                        : ""
                }


                ${
                    maquina.notas

                        ? `

                            <div class="maquina-notas">

                                <span>
                                    Notas
                                </span>

                                <p>
                                    ${maquina.notas}
                                </p>

                            </div>

                        `

                        : ""
                }

            </article>

        `;
    }


    // =====================================================
    // FORMULARIO CREAR
    // =====================================================

    mostrarFormularioCrear() {

        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Nueva máquina
                    </h2>

                    <p>
                        Añade maquinaria a GestaCamps
                    </p>

                </div>

            </header>


            ${this.crearFormulario(
                null
            )}

        `;


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
                () =>
                    this.guardarNueva()
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


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Editar maquinaria
                    </h2>

                    <p>
                        Modifica los datos de la máquina
                    </p>

                </div>

            </header>


            ${this.crearFormulario(
                maquina
            )}

        `;


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
                        !resultado.ok
                    ) {

                        alert(
                            resultado.mensaje
                            ||
                            "No se ha podido actualizar la máquina."
                        );

                        return;
                    }


                    this.mostrar();

                }
            );
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
            !resultado.ok
        ) {

            alert(
                resultado.mensaje
                ||
                "No se ha podido crear la máquina."
            );

            return;
        }


        this.mostrar();
    }


    // =====================================================
    // CREAR FORMULARIO
    // =====================================================

    crearFormulario(
        maquina
    ) {

        return `

            <div class="form-panel maquina-form-panel">

                <div class="form-group">

                    <label>
                        Nombre *
                    </label>

                    <input
                        id="nombreMaquina"
                        type="text"
                        placeholder="Ej. Tractor principal"
                        value="${maquina?.nombre || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Tipo
                    </label>

                    <select
                        id="tipoMaquina"
                    >

                        ${this.crearOpcionesTipo(
                            maquina?.tipo
                        )}

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
                        value="${maquina?.marca || ""}"
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
                        value="${maquina?.modelo || ""}"
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
                        value="${maquina?.matricula || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select
                        id="estadoMaquina"
                    >

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
                        Horas de uso
                    </label>

                    <input
                        id="horasMaquina"
                        type="number"
                        min="0"
                        step="0.1"
                        value="${maquina?.horasUso ?? 0}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Próxima revisión
                    </label>

                    <input
                        id="revisionMaquina"
                        type="date"
                        value="${maquina?.proximaRevision || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasMaquina"
                        rows="5"
                    >${maquina?.notas || ""}</textarea>

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

            </div>

        `;
    }


    // =====================================================
    // OBTENER DATOS FORMULARIO
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


        const horas =
            Number(
                document
                    .getElementById(
                        "horasMaquina"
                    )
                    ?.value
                ||
                0
            );


        if (
            Number.isNaN(
                horas
            )
            ||
            horas <
            0
        ) {

            alert(
                "Las horas de uso deben ser un número válido."
            );

            return null;
        }


        return {

            nombre,

            tipo:
                document
                    .getElementById(
                        "tipoMaquina"
                    )
                    ?.value
                ||
                "Tractor",

            marca:
                document
                    .getElementById(
                        "marcaMaquina"
                    )
                    ?.value
                    .trim()
                ||
                "",

            modelo:
                document
                    .getElementById(
                        "modeloMaquina"
                    )
                    ?.value
                    .trim()
                ||
                "",

            matricula:
                document
                    .getElementById(
                        "matriculaMaquina"
                    )
                    ?.value
                    .trim()
                ||
                "",

            estado:
                document
                    .getElementById(
                        "estadoMaquina"
                    )
                    ?.value
                ||
                "Activa",

            /*
             * Aquí Number() sí es correcto,
             * porque son horas, no un ID.
             */
            horasUso:
                horas,

            proximaRevision:
                document
                    .getElementById(
                        "revisionMaquina"
                    )
                    ?.value
                ||
                "",

            notas:
                document
                    .getElementById(
                        "notasMaquina"
                    )
                    ?.value
                    .trim()
                ||
                ""

        };
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
                        value="${tipo}"
                        ${
                            tipo ===
                            tipoActual

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
                return "💦";

            case "Cosechadora":
                return "🌾";

            case "Desbrozadora":
                return "🌿";

            case "Carretilla elevadora":
                return "🏗️";

            case "Vehículo":
                return "🚙";

            case "Implemento":
                return "⚙️";

            default:
                return "⚙️";
        }
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

            return "";
        }


        const partes =
            fecha.split(
                "-"
            );


        if (
            partes.length !==
            3
        ) {

            return fecha;
        }


        return (
            partes[2]
            +
            "/"
            +
            partes[1]
            +
            "/"
            +
            partes[0]
        );
    }
}