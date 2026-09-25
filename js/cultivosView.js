export class CultivosView {

    constructor(
        mainContent,
        fincaService,
        cultivoService,
        campaniaService
    ) {

        this.mainContent =
            mainContent;

        this.fincaService =
            fincaService;

        this.cultivoService =
            cultivoService;

        this.campaniaService =
            campaniaService;

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const cultivos =
            this.cultivoService
                .obtenerTodos();


        const activos =
            this.cultivoService
                .obtenerActivos()
                .length;


        const superficieTotal =
            cultivos.reduce(
                (
                    total,
                    cultivo
                ) =>
                    total +
                    Number(
                        cultivo.superficie
                        ||
                        0
                    ),
                0
            );


        const campanyasUsadas =
            new Set(
                cultivos
                    .filter(
                        cultivo =>
                            cultivo.campaniaId
                    )
                    .map(
                        cultivo =>
                            String(
                                cultivo.campaniaId
                            )
                    )
            ).size;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Cultivos
                    </h2>

                    <p>
                        Gestiona los cultivos de tus parcelas
                    </p>

                </div>


                <button
                    id="nuevoCultivo"
                    class="primary-button"
                >
                    + Nuevo cultivo
                </button>

            </header>


            <section class="stats">


                <div class="card">

                    <span class="card-icon">
                        🌱
                    </span>

                    <div>

                        <p>
                            Cultivos
                        </p>

                        <h3>
                            ${cultivos.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ✅
                    </span>

                    <div>

                        <p>
                            Activos
                        </p>

                        <h3>
                            ${activos}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        📐
                    </span>

                    <div>

                        <p>
                            Superficie cultivada
                        </p>

                        <h3>
                            ${this.formatearNumero(
                                superficieTotal
                            )}
                            ha
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        📅
                    </span>

                    <div>

                        <p>
                            Campanyas
                        </p>

                        <h3>
                            ${campanyasUsadas}
                        </h3>

                    </div>

                </div>


            </section>


            <div
                id="listaCultivos"
            ></div>

        `;


        document
            .getElementById(
                "nuevoCultivo"
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
    // MOSTRAR LISTA
    // =====================================================

    mostrarLista() {

        const cultivos =
            this.cultivoService
                .obtenerTodos();


        const contenedor =
            document.getElementById(
                "listaCultivos"
            );


        if (
            cultivos.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🌱
                    </div>

                    <h3>
                        Todavía no tienes cultivos
                    </h3>

                    <p>
                        Crea tu primer cultivo para comenzar a gestionar la producción.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="cultivos-grid">

                ${cultivos.map(
                    cultivo => `

                        <div class="cultivo-card">

                            <div class="cultivo-card-header">

                                <span class="cultivo-icon">
                                    🌱
                                </span>


                                <div class="cultivo-actions">

                                    <button
                                        class="secondary-button editar-cultivo"
                                        data-id="${cultivo.id}"
                                    >
                                        Editar
                                    </button>


                                    <button
                                        class="delete-button eliminar-cultivo"
                                        data-id="${cultivo.id}"
                                    >
                                        ×
                                    </button>

                                </div>

                            </div>


                            <h3>

                                ${cultivo.tipo}
                                ·
                                ${cultivo.variedad}

                            </h3>


                            <p class="cultivo-location">

                                📍
                                ${cultivo.fincaNombre}

                                ${
                                    cultivo.parcela

                                        ? ` · ${cultivo.parcela}`

                                        : ""
                                }

                            </p>


                            ${
                                cultivo.campaniaNombre

                                    ? `

                                        <p class="cultivo-campania">

                                            📅
                                            ${cultivo.campaniaNombre}

                                        </p>

                                    `

                                    : `

                                        <p class="cultivo-campania cultivo-sin-campania">

                                            📅
                                            Sin campanya asignada

                                        </p>

                                    `
                            }


                            <div class="cultivo-info-grid">

                                <div>

                                    <span>
                                        Superficie
                                    </span>

                                    <strong>

                                        ${this.formatearNumero(
                                            cultivo.superficie
                                        )}
                                        ha

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Estado
                                    </span>

                                    <strong>
                                        ${cultivo.estado}
                                    </strong>

                                </div>

                            </div>


                            ${
                                cultivo.fechaInicio

                                    ? `

                                        <p class="cultivo-date">

                                            📅 Inicio:
                                            ${this.formatearFecha(
                                                cultivo.fechaInicio
                                            )}

                                        </p>

                                    `

                                    : ""
                            }


                            ${
                                cultivo.notas

                                    ? `

                                        <p class="cultivo-notas">
                                            ${cultivo.notas}
                                        </p>

                                    `

                                    : ""
                            }

                        </div>

                    `
                ).join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // EVENTOS LISTADO
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-cultivo"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            /*
                             * MUY IMPORTANTE:
                             *
                             * NO convertir el ID con Number().
                             *
                             * Los cultivos nuevos utilizan
                             * IDs UUID/texto.
                             */

                            this.mostrarFormulario(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-cultivo"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            /*
                             * Conservamos el ID exactamente
                             * como está almacenado.
                             */

                            const id =
                                button.dataset.id;


                            const cultivo =
                                this.cultivoService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !cultivo
                            ) {

                                alert(
                                    "El cultivo no existe."
                                );

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar el cultivo "${cultivo.tipo} · ${cultivo.variedad}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.cultivoService
                                    .eliminar(
                                        id
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


        /*
         * Primero intentamos obtenerlo mediante
         * CultivoService.
         */

        let cultivo =
            editando

                ? this.cultivoService
                    .obtenerPorId(
                        id
                    )

                : null;


        /*
         * Fallback de seguridad.
         *
         * Si por cualquier motivo el servicio no
         * lo encuentra, buscamos comparando los IDs
         * como String.
         */

        if (
            editando
            &&
            !cultivo
        ) {

            cultivo =
                this.cultivoService
                    .obtenerTodos()
                    .find(
                        item =>
                            String(
                                item.id
                            )
                            ===
                            String(
                                id
                            )
                    )
                ||
                null;

        }


        /*
         * Si estamos editando y aun así no existe,
         * NO mostramos un formulario vacío.
         */

        if (
            editando
            &&
            !cultivo
        ) {

            console.error(
                "No se ha encontrado el cultivo.",
                {
                    idRecibido:
                        id,

                    cultivos:
                        this.cultivoService
                            .obtenerTodos()
                }
            );


            alert(
                "No se ha podido cargar el cultivo para editar."
            );


            this.mostrar();

            return;

        }


        const fincas =
            this.fincaService
                .obtenerTodas();


        const campanyas =
            this.campaniaService
                .obtenerTodas();


        if (
            fincas.length ===
            0
        ) {

            alert(
                "Primero debes crear una finca."
            );

            return;

        }


        this.mainContent.innerHTML = `

            <button
                id="volverCultivos"
                class="back-button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>

                        ${
                            editando
                                ? "Editar cultivo"
                                : "Nuevo cultivo"
                        }

                    </h2>


                    <p>

                        ${
                            editando
                                ? "Modifica los datos del cultivo"
                                : "Registra un nuevo cultivo en la explotación"
                        }

                    </p>

                </div>

            </header>


            <div class="form-panel">


                <div class="form-group">

                    <label>
                        Tipo de cultivo *
                    </label>

                    <input
                        id="tipoCultivo"
                        type="text"
                        placeholder="Ej. Nectarina"
                        value="${cultivo?.tipo || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Variedad *
                    </label>

                    <input
                        id="variedadCultivo"
                        type="text"
                        placeholder="Ej. Nectalam"
                        value="${cultivo?.variedad || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Finca *
                    </label>

                    <select
                        id="fincaCultivo"
                    >

                        ${fincas.map(
                            finca => `

                                <option
                                    value="${finca.id}"

                                    ${
                                        cultivo
                                        &&
                                        String(
                                            cultivo.fincaId
                                        )
                                        ===
                                        String(
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
                        id="parcelaCultivo"
                        type="text"
                        placeholder="Ej. Parcela Norte"
                        value="${cultivo?.parcela || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Campanya
                    </label>

                    <select
                        id="campaniaCultivo"
                    >

                        <option
                            value=""
                        >
                            Sin campanya
                        </option>


                        ${campanyas.map(
                            campania => `

                                <option
                                    value="${campania.id}"

                                    data-finca-id="${campania.fincaId}"

                                    ${
                                        cultivo
                                        &&
                                        cultivo.campaniaId
                                        &&
                                        String(
                                            cultivo.campaniaId
                                        )
                                        ===
                                        String(
                                            campania.id
                                        )

                                            ? "selected"

                                            : ""
                                    }
                                >

                                    ${campania.nombre}
                                    ·
                                    ${campania.fincaNombre}
                                    ·
                                    ${campania.estado}

                                </option>

                            `
                        ).join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Superficie (ha)
                    </label>

                    <input
                        id="superficieCultivo"
                        type="number"
                        min="0"
                        step="0.01"
                        value="${cultivo?.superficie ?? ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Fecha de inicio
                    </label>

                    <input
                        id="fechaCultivo"
                        type="date"
                        value="${cultivo?.fechaInicio || ""}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select
                        id="estadoCultivo"
                    >

                        <option
                            value="Activo"

                            ${
                                !cultivo
                                ||
                                cultivo.estado ===
                                "Activo"

                                    ? "selected"

                                    : ""
                            }
                        >
                            Activo
                        </option>


                        <option
                            value="Inactivo"

                            ${
                                cultivo?.estado ===
                                "Inactivo"

                                    ? "selected"

                                    : ""
                            }
                        >
                            Inactivo
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasCultivo"
                        rows="5"
                        placeholder="Observaciones..."
                    >${cultivo?.notas || ""}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarCultivo"
                        class="secondary-button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarCultivo"
                        class="primary-button"
                    >

                        ${
                            editando
                                ? "Guardar cambios"
                                : "Crear cultivo"
                        }

                    </button>

                </div>

            </div>

        `;


        // =================================================
        // VOLVER
        // =================================================

        document
            .getElementById(
                "volverCultivos"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        // =================================================
        // CANCELAR
        // =================================================

        document
            .getElementById(
                "cancelarCultivo"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        // =================================================
        // CAMBIO DE FINCA
        // =================================================

        document
            .getElementById(
                "fincaCultivo"
            )
            .addEventListener(
                "change",
                () => {

                    this.actualizarCampanyasPorFinca();

                }
            );


        /*
         * Filtramos nada más abrir el formulario.
         */

        this.actualizarCampanyasPorFinca();


        // =================================================
        // GUARDAR
        // =================================================

        document
            .getElementById(
                "guardarCultivo"
            )
            .addEventListener(
                "click",
                () => {

                    const datos = {

                        tipo:
                            document
                                .getElementById(
                                    "tipoCultivo"
                                )
                                .value,

                        variedad:
                            document
                                .getElementById(
                                    "variedadCultivo"
                                )
                                .value,


                        /*
                         * IMPORTANTE:
                         *
                         * NO usar Number().
                         *
                         * El ID puede ser UUID.
                         */

                        fincaId:
                            document
                                .getElementById(
                                    "fincaCultivo"
                                )
                                .value,


                        parcela:
                            document
                                .getElementById(
                                    "parcelaCultivo"
                                )
                                .value,


                        campaniaId:
                            document
                                .getElementById(
                                    "campaniaCultivo"
                                )
                                .value
                            ||
                            null,


                        superficie:
                            Number(
                                document
                                    .getElementById(
                                        "superficieCultivo"
                                    )
                                    .value
                                ||
                                0
                            ),


                        fechaInicio:
                            document
                                .getElementById(
                                    "fechaCultivo"
                                )
                                .value,


                        estado:
                            document
                                .getElementById(
                                    "estadoCultivo"
                                )
                                .value,


                        notas:
                            document
                                .getElementById(
                                    "notasCultivo"
                                )
                                .value

                    };


                    const resultado =
                        editando

                            ? this.cultivoService
                                .editar(
                                    id,
                                    datos
                                )

                            : this.cultivoService
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
            );

    }


    // =====================================================
    // FILTRAR CAMPANYAS SEGÚN FINCA
    // =====================================================

    actualizarCampanyasPorFinca() {

        const fincaSelect =
            document
                .getElementById(
                    "fincaCultivo"
                );


        const campaniaSelect =
            document
                .getElementById(
                    "campaniaCultivo"
                );


        if (
            !fincaSelect
            ||
            !campaniaSelect
        ) {

            return;

        }


        const fincaId =
            String(
                fincaSelect.value
                ||
                ""
            );


        const opciones =
            [
                ...campaniaSelect.options
            ];


        opciones.forEach(
            opcion => {

                /*
                 * "Sin campanya"
                 */

                if (
                    !opcion.value
                ) {

                    opcion.hidden =
                        false;

                    opcion.disabled =
                        false;

                    return;

                }


                const fincaCampania =
                    String(
                        opcion.dataset.fincaId
                        ||
                        ""
                    );


                const pertenece =
                    fincaCampania ===
                    fincaId;


                opcion.hidden =
                    !pertenece;

                opcion.disabled =
                    !pertenece;

            }
        );


        /*
         * Si está seleccionada una campaña
         * de otra finca, la quitamos.
         */

        const seleccionada =
            campaniaSelect
                .selectedOptions[0];


        if (
            seleccionada
            &&
            seleccionada.value
            &&
            seleccionada.disabled
        ) {

            campaniaSelect.value =
                "";

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

            return fecha;

        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );

    }


    // =====================================================
    // FORMATEAR NÚMERO
    // =====================================================

    formatearNumero(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    maximumFractionDigits:
                        2
                }
            );

    }

}