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
                    total
                    +
                    Number(
                        cultivo.superficie
                        ||
                        0
                    ),
                0
            );


        const campaniasUsadas =
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

            <div class="cultivos-page">

                <!-- ==========================================
                     HERO
                =========================================== -->

                <section class="cultivos-hero">

                    <div class="cultivos-hero-content">

                        <span class="cultivos-eyebrow">
                            🌱 GESTIÓN AGRÍCOLA
                        </span>


                        <h1>
                            Cultiva con
                            <span>
                                una visión clara.
                            </span>
                        </h1>


                        <p>
                            Organiza cada cultivo, controla su superficie
                            y mantenlo conectado con la finca y campaña
                            correspondiente.
                        </p>


                        <button
                            id="nuevoCultivo"
                            class="
                                primary-button
                                cultivos-hero-button
                            "
                            type="button"
                        >
                            + Nuevo cultivo
                        </button>

                    </div>


                    <div class="cultivos-hero-image">

                        <div class="cultivos-hero-badge">

                            <span>
                                Cultivos activos
                            </span>

                            <strong>
                                ${activos}
                            </strong>

                        </div>


                        <div class="cultivos-hero-copy">

                            <small>
                                CULTIVO · PRODUCCIÓN · TRAZABILIDAD
                            </small>

                            <strong>
                                Cada cultivo cuenta<br>
                                una parte de tu cosecha
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ==========================================
                     KPIs
                =========================================== -->

                <section class="stats cultivos-stats">

                    ${this.crearStat(
                        "🌱",
                        "Cultivos",
                        cultivos.length
                    )}


                    ${this.crearStat(
                        "✅",
                        "Activos",
                        activos
                    )}


                    ${this.crearStat(
                        "📐",
                        "Superficie cultivada",
                        `${this.formatearNumero(
                            superficieTotal
                        )} ha`
                    )}


                    ${this.crearStat(
                        "📅",
                        "Campañas vinculadas",
                        campaniasUsadas
                    )}

                </section>


                <!-- ==========================================
                     CABECERA LISTADO
                =========================================== -->

                <div class="cultivos-list-header">

                    <div>

                        <span class="cultivos-list-eyebrow">
                            PRODUCCIÓN AGRÍCOLA
                        </span>


                        <h2>
                            Tus cultivos
                        </h2>


                        <p>
                            Consulta variedades, superficies,
                            campañas y estado de cada cultivo.
                        </p>

                    </div>


                    <div class="cultivos-list-summary">

                        <span>
                            ${cultivos.length} cultivos
                        </span>

                        <span>
                            ${activos} activos
                        </span>

                    </div>

                </div>


                <div id="listaCultivos"></div>

            </div>

        `;


        document
            .getElementById(
                "nuevoCultivo"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.mostrarFormulario();

                }
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

            <div class="card">

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

            </div>

        `;

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
            !contenedor
        ) {

            return;

        }


        if (
            cultivos.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="cultivos-empty">

                    <div class="cultivos-empty-visual">

                        <span>
                            🌱
                        </span>

                    </div>


                    <h3>
                        Todavía no tienes cultivos
                    </h3>


                    <p>
                        Crea tu primer cultivo para comenzar
                        a gestionar la producción de la explotación.
                    </p>


                    <button
                        id="crearPrimerCultivo"
                        class="primary-button"
                        type="button"
                    >
                        + Crear primer cultivo
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "crearPrimerCultivo"
                )
                ?.addEventListener(
                    "click",
                    () =>
                        this.mostrarFormulario()
                );


            return;

        }


        contenedor.innerHTML = `

            <div class="cultivos-grid">

                ${cultivos
                    .map(
                        (
                            cultivo,
                            index
                        ) =>
                            this.crearTarjetaCultivo(
                                cultivo,
                                index
                            )
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA CULTIVO
    // =====================================================

    crearTarjetaCultivo(
        cultivo,
        index = 0
    ) {

        const imagen =
            (
                index %
                3
            )
            +
            1;


        const activo =
            String(
                cultivo.estado
                ||
                ""
            )
                .toLowerCase()
            ===
            "activo";


        return `

            <article class="cultivo-card">

                <!-- ==================================
                     FOTO
                =================================== -->

                <div
                    class="
                        cultivo-card-cover
                        cultivo-card-cover-${imagen}
                    "
                >

                    <div class="cultivo-card-overlay"></div>


                    <div class="cultivo-card-cover-top">

                        <span
                            class="
                                cultivo-status
                                ${
                                    activo
                                        ? "activo"
                                        : "inactivo"
                                }
                            "
                        >

                            ●
                            ${
                                cultivo.estado
                                ||
                                "Activo"
                            }

                        </span>


                        <div class="cultivo-actions">

                            <button
                                class="
                                    cultivo-action-button
                                    editar-cultivo
                                "
                                data-id="${cultivo.id}"
                                type="button"
                                title="Editar cultivo"
                            >
                                ✎
                            </button>


                            <button
                                class="
                                    cultivo-action-button
                                    cultivo-delete
                                    eliminar-cultivo
                                "
                                data-id="${cultivo.id}"
                                type="button"
                                title="Eliminar cultivo"
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    <div class="cultivo-card-cover-copy">

                        <span>
                            CULTIVO
                        </span>


                        <strong>
                            ${cultivo.tipo}
                        </strong>


                        <p>
                            ${cultivo.variedad}
                        </p>

                    </div>

                </div>


                <!-- ==================================
                     CUERPO
                =================================== -->

                <div class="cultivo-card-body">

                    <span class="cultivo-card-kicker">
                        PRODUCCIÓN AGRÍCOLA
                    </span>


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

                                <div class="cultivo-campania">

                                    <span>
                                        📅
                                    </span>

                                    <div>

                                        <small>
                                            Campaña
                                        </small>

                                        <strong>
                                            ${cultivo.campaniaNombre}
                                        </strong>

                                    </div>

                                </div>

                            `

                            : `

                                <div
                                    class="
                                        cultivo-campania
                                        cultivo-sin-campania
                                    "
                                >

                                    <span>
                                        📅
                                    </span>

                                    <div>

                                        <small>
                                            Campaña
                                        </small>

                                        <strong>
                                            Sin campaña asignada
                                        </strong>

                                    </div>

                                </div>

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
                                Inicio
                            </span>


                            <strong>

                                ${
                                    cultivo.fechaInicio

                                        ? this.formatearFecha(
                                            cultivo.fechaInicio
                                        )

                                        : "Sin definir"
                                }

                            </strong>

                        </div>

                    </div>


                    ${
                        cultivo.notas

                            ? `

                                <p class="cultivo-notas">

                                    <span>
                                        Nota
                                    </span>

                                    ${cultivo.notas}

                                </p>

                            `

                            : ""
                    }


                    <button
                        class="
                            cultivo-edit-main
                            editar-cultivo
                        "
                        data-id="${cultivo.id}"
                        type="button"
                    >

                        Editar cultivo

                        <span>
                            →
                        </span>

                    </button>

                </div>

            </article>

        `;

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


        const campanias =
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

            <div class="cultivo-form-page">

                <button
                    id="volverCultivos"
                    class="back-button"
                    type="button"
                >
                    ← Volver
                </button>


                <header class="cultivo-form-header">

                    <span class="cultivo-form-eyebrow">
                        🌱 GESTIÓN AGRÍCOLA
                    </span>


                    <h1>

                        ${
                            editando
                                ? "Editar cultivo"
                                : "Nuevo cultivo"
                        }

                    </h1>


                    <p>

                        ${
                            editando

                                ? "Actualiza los datos del cultivo y mantén toda la información al día."

                                : "Registra un nuevo cultivo y vincúlalo con su finca y campaña."

                        }

                    </p>

                </header>


                <div class="cultivo-form-layout">

                    <!-- ==================================
                         FORMULARIO
                    =================================== -->

                    <div
                        class="
                            form-panel
                            cultivo-form-panel
                        "
                    >

                        <div class="cultivo-form-section-title">

                            <span>
                                🌱
                            </span>


                            <div>

                                <h3>
                                    Información del cultivo
                                </h3>

                                <p>
                                    Datos principales de la plantación.
                                </p>

                            </div>

                        </div>


                        <div class="cultivo-form-grid">

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

                                    ${fincas
                                        .map(
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
                                        )
                                        .join("")}

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


                            <div class="form-group cultivo-form-wide">

                                <label>
                                    Campaña
                                </label>


                                <select
                                    id="campaniaCultivo"
                                >

                                    <option
                                        value=""
                                    >
                                        Sin campaña
                                    </option>


                                    ${campanias
                                        .map(
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
                                        )
                                        .join("")}

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


                            <div class="form-group cultivo-form-wide">

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


                            <div
                                class="
                                    form-group
                                    cultivo-form-wide
                                "
                            >

                                <label>
                                    Notas
                                </label>


                                <textarea
                                    id="notasCultivo"
                                    rows="5"
                                    placeholder="Observaciones..."
                                >${cultivo?.notas || ""}</textarea>

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                id="cancelarCultivo"
                                class="secondary-button"
                                type="button"
                            >
                                Cancelar
                            </button>


                            <button
                                id="guardarCultivo"
                                class="primary-button"
                                type="button"
                            >

                                ${
                                    editando
                                        ? "Guardar cambios"
                                        : "Crear cultivo"
                                }

                            </button>

                        </div>

                    </div>


                    <!-- ==================================
                         FOTO DERECHA
                    =================================== -->

                    <aside class="cultivo-form-aside">

                        <div class="cultivo-form-photo">

                            <div>

                                <span>
                                    GESTACAMPS
                                </span>


                                <strong>
                                    Cada variedad,
                                    una historia que cultivar.
                                </strong>

                            </div>

                        </div>


                        <div class="cultivo-form-tip">

                            <span>
                                🌾
                            </span>


                            <div>

                                <strong>
                                    Todo conectado
                                </strong>


                                <p>
                                    Vincula el cultivo a su finca y
                                    campaña para mantener toda la
                                    trazabilidad de la explotación.
                                </p>

                            </div>

                        </div>

                    </aside>

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
            ?.addEventListener(
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
            ?.addEventListener(
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
            ?.addEventListener(
                "change",
                () => {

                    this.actualizarCampaniasPorFinca();

                }
            );


        /*
         * Filtramos nada más abrir el formulario.
         */

        this.actualizarCampaniasPorFinca();


        // =================================================
        // GUARDAR
        // =================================================

        document
            .getElementById(
                "guardarCultivo"
            )
            ?.addEventListener(
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
    // FILTRAR CAMPAÑAS SEGÚN FINCA
    // =====================================================

    actualizarCampaniasPorFinca() {

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
                 * "Sin campaña"
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
    // COMPATIBILIDAD CON NOMBRE ANTERIOR
    // =====================================================

    actualizarCampanyasPorFinca() {

        this.actualizarCampaniasPorFinca();

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