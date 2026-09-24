import { StorageService } from "./storage.js";

import {
    escaparHTML,
    normalizarTexto,
    formatearFecha,
    obtenerHoraActual
} from "./utils.js";

import {
    obtenerNombreTrabajador,
    obtenerNombreCultivo,
    obtenerNombreMaquinaria
} from "./entityHelpers.js";


export class TratamientosView {

    constructor(
        mainContent,
        tratamientoService
    ) {

        this.mainContent =
            mainContent;

        this.tratamientoService =
            tratamientoService;

        this.filtroFinca =
            "";

        this.busqueda =
            "";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const todos =
            this.tratamientoService
                .obtenerTodos();


        const tratamientos =
            this.obtenerFiltrados();


        const hoy =
            StorageService
                .obtenerFechaLocal(
                    new Date()
                );


        const tratamientosHoy =
            todos.filter(
                tratamiento =>
                    tratamiento.fecha ===
                    hoy
            );


        const fincas =
            StorageService
                .obtenerFincas();


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Tratamientos
                    </h2>

                    <p>
                        Registro y control de tratamientos agrícolas
                    </p>

                </div>


                <button
                    id="nuevoTratamiento"
                    class="primary-button"
                    type="button"
                >
                    + Nuevo tratamiento
                </button>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        🧪
                    </span>

                    <div>

                        <p>
                            Tratamientos
                        </p>

                        <h3>
                            ${todos.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        📅
                    </span>

                    <div>

                        <p>
                            Hoy
                        </p>

                        <h3>
                            ${tratamientosHoy.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        🌾
                    </span>

                    <div>

                        <p>
                            Fincas
                        </p>

                        <h3>
                            ${
                                new Set(
                                    todos
                                        .map(
                                            tratamiento =>
                                                tratamiento.fincaId
                                        )
                                        .filter(Boolean)
                                )
                                    .size
                            }
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        📦
                    </span>

                    <div>

                        <p>
                            Productos
                        </p>

                        <h3>
                            ${
                                new Set(
                                    todos
                                        .map(
                                            tratamiento =>
                                                tratamiento.productoId
                                        )
                                        .filter(Boolean)
                                )
                                    .size
                            }
                        </h3>

                    </div>

                </div>

            </section>


            <section
                class="panel tratamientos-filtros-panel"
                style="
                    margin-bottom: 22px;
                "
            >

                <div
                    class="tratamientos-filtros-grid"
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(
                                    min(100%, 220px),
                                    1fr
                                )
                            );
                        gap: 12px;
                    "
                >

                    <div class="form-group">

                        <label>
                            Buscar
                        </label>

                        <input
                            id="buscarTratamiento"
                            type="search"
                            placeholder="Producto, finca, cultivo..."
                            value="${escaparHTML(this.busqueda)}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Finca
                        </label>

                        <select
                            id="filtroFincaTratamiento"
                        >

                            <option value="">
                                Todas las fincas
                            </option>

                            ${fincas.map(
                                finca => `

                                    <option
                                        value="${finca.id}"
                                        ${
                                            String(
                                                this.filtroFinca
                                            )
                                            ===
                                            String(
                                                finca.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(finca.nombre)}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>

                </div>

            </section>


            <section>

                <div
                    id="listaTratamientos"
                    class="tratamientos-grid"
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(
                                    min(100%, 340px),
                                    1fr
                                )
                            );
                        gap: 18px;
                    "
                >

                    ${
                        tratamientos.length

                            ? tratamientos
                                .map(
                                    tratamiento =>
                                        this.crearTarjeta(
                                            tratamiento
                                        )
                                )
                                .join("")

                            : this.crearVacio()
                    }

                </div>

            </section>

        `;


        document
            .getElementById(
                "nuevoTratamiento"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        document
            .getElementById(
                "buscarTratamiento"
            )
            .addEventListener(
                "input",
                event => {

                    this.busqueda =
                        event.target.value;


                    this.mostrar();

                }
            );


        document
            .getElementById(
                "filtroFincaTratamiento"
            )
            .addEventListener(
                "change",
                event => {

                    this.filtroFinca =
                        event.target.value;


                    this.mostrar();

                }
            );


        this.configurarEventos();

    }


    // =====================================================
    // TARJETA
    // =====================================================

    crearTarjeta(
        tratamiento
    ) {

        return `

            <article class="panel tratamiento-card">

                <div
                    class="tratamiento-card-header"
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 12px;
                    "
                >

                    <div>

                        <div
                            style="
                                font-size: 28px;
                                margin-bottom: 8px;
                            "
                        >
                            🧪
                        </div>

                        <h3>
                            ${escaparHTML(tratamiento.productoNombre)}
                        </h3>

                        <strong
                            style="
                                color: #247354;
                            "
                        >
                            ${escaparHTML(tratamiento.fincaNombre)}
                        </strong>

                    </div>


                    <div
                        class="tratamiento-actions"
                        style="
                            display: flex;
                            align-items: flex-start;
                            gap: 7px;
                        "
                    >

                        <button
                            class="secondary-button editar-tratamiento"
                            type="button"
                            data-id="${tratamiento.id}"
                        >
                            Editar
                        </button>

                        <button
                            class="secondary-button eliminar-tratamiento"
                            type="button"
                            data-id="${tratamiento.id}"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <div
                    class="tratamiento-detalles"
                    style="
                        margin-top: 16px;
                        display: grid;
                        gap: 8px;
                    "
                >

                    <p>
                        📅 ${formatearFecha(tratamiento.fecha)}
                        ${
                            tratamiento.hora
                                ? ` · ${escaparHTML(tratamiento.hora)}`
                                : ""
                        }
                    </p>

                    ${
                        tratamiento.campaniaNombre
                            ? `
                                <p>
                                    🗓️ ${escaparHTML(tratamiento.campaniaNombre)}
                                </p>
                            `
                            : ""
                    }

                    ${
                        tratamiento.cultivoNombre
                            ? `
                                <p>
                                    🌱 ${escaparHTML(tratamiento.cultivoNombre)}
                                </p>
                            `
                            : ""
                    }

                    <p>
                        📦 ${tratamiento.cantidadUsada}
                        ${escaparHTML(tratamiento.productoUnidad)}
                    </p>

                    <p>
                        🧪 Dosis:
                        ${escaparHTML(tratamiento.dosis)}
                    </p>

                    ${
                        tratamiento.superficieTratada
                            ? `
                                <p>
                                    📐 ${tratamiento.superficieTratada} ha
                                </p>
                            `
                            : ""
                    }

                    ${
                        tratamiento.plagaObjetivo
                            ? `
                                <p>
                                    🐛 ${escaparHTML(tratamiento.plagaObjetivo)}
                                </p>
                            `
                            : ""
                    }

                    ${
                        tratamiento.trabajadorNombre
                            ? `
                                <p>
                                    👷 ${escaparHTML(tratamiento.trabajadorNombre)}
                                </p>
                            `
                            : ""
                    }

                    ${
                        tratamiento.maquinariaNombre
                            ? `
                                <p>
                                    🚜 ${escaparHTML(tratamiento.maquinariaNombre)}
                                </p>
                            `
                            : ""
                    }

                </div>


                ${
                    tratamiento.observaciones
                        ? `

                            <div
                                style="
                                    margin-top: 14px;
                                    padding: 12px;
                                    border-radius: 10px;
                                    background: #f5f7f5;
                                "
                            >

                                <strong>
                                    Observaciones
                                </strong>

                                <p>
                                    ${escaparHTML(tratamiento.observaciones)}
                                </p>

                            </div>

                        `
                        : ""
                }


                <p
                    style="
                        margin-top: 14px;
                        font-size: 12px;
                        color: #78837d;
                    "
                >
                    Registrado por
                    ${escaparHTML(
                        tratamiento.creadoPorNombre
                        ||
                        "Administración"
                    )}
                </p>

            </article>

        `;

    }


    // =====================================================
    // FORMULARIO
    // =====================================================

    mostrarFormulario(
        tratamientoId = null
    ) {

        const tratamiento =
            tratamientoId
                ? this.tratamientoService
                    .obtenerPorId(
                        tratamientoId
                    )
                : null;


        const fincas =
            StorageService
                .obtenerFincas();


        const campanias =
            StorageService
                .obtenerCampanias();


        const cultivos =
            StorageService
                .obtenerCultivos();


        const trabajadores =
            StorageService
                .obtenerTrabajadores()
                .filter(
                    trabajador =>
                        trabajador.estado ===
                        "Activo"
                );


        const maquinaria =
            StorageService
                .obtenerMaquinaria();


        const inventario =
            StorageService
                .obtenerInventario()
                .filter(
                    producto =>
                        Number(
                            producto.cantidad
                        )
                        >
                        0
                        ||
                        Number(
                            producto.id
                        )
                        ===
                        Number(
                            tratamiento?.productoId
                        )
                );


        const fechaHoy =
            StorageService
                .obtenerFechaLocal(
                    new Date()
                );


        const horaActual =
            obtenerHoraActual();


        this.mainContent.innerHTML = `

            <button
                id="volverTratamientos"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        ${
                            tratamiento
                                ? "Editar tratamiento"
                                : "Nuevo tratamiento"
                        }
                    </h2>

                    <p>
                        Registro de aplicación agrícola
                    </p>

                </div>

            </header>


            <section class="form-panel">

                <div class="form-grid">

                    <div class="form-group">

                        <label>
                            Fecha *
                        </label>

                        <input
                            id="tratamientoFecha"
                            type="date"
                            value="${tratamiento?.fecha || fechaHoy}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Hora
                        </label>

                        <input
                            id="tratamientoHora"
                            type="time"
                            value="${tratamiento?.hora || horaActual}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Finca *
                        </label>

                        <select
                            id="tratamientoFinca"
                        >

                            <option value="">
                                Selecciona finca...
                            </option>

                            ${fincas.map(
                                finca => `

                                    <option
                                        value="${finca.id}"
                                        ${
                                            Number(
                                                tratamiento?.fincaId
                                            )
                                            ===
                                            Number(
                                                finca.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(finca.nombre)}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Campanya
                        </label>

                        <select
                            id="tratamientoCampania"
                        >

                            <option value="">
                                Sin Campanya
                            </option>

                            ${campanias.map(
                                campania => `

                                    <option
                                        value="${campania.id}"
                                        data-finca-id="${campania.fincaId}"
                                        ${
                                            Number(
                                                tratamiento?.campaniaId
                                            )
                                            ===
                                            Number(
                                                campania.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(campania.nombre)}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Cultivo
                        </label>

                        <select
                            id="tratamientoCultivo"
                        >

                            <option value="">
                                Sin cultivo concreto
                            </option>

                            ${cultivos.map(
                                cultivo => `

                                    <option
                                        value="${cultivo.id}"
                                        data-finca-id="${cultivo.fincaId || ""}"
                                        ${
                                            Number(
                                                tratamiento?.cultivoId
                                            )
                                            ===
                                            Number(
                                                cultivo.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(
                                            obtenerNombreCultivo(
                                                cultivo
                                            )
                                        )}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Producto *
                        </label>

                        <select
                            id="tratamientoProducto"
                        >

                            <option value="">
                                Selecciona producto...
                            </option>

                            ${inventario.map(
                                producto => `

                                    <option
                                        value="${producto.id}"
                                        ${
                                            Number(
                                                tratamiento?.productoId
                                            )
                                            ===
                                            Number(
                                                producto.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(producto.nombre)}
                                        · ${producto.cantidad}
                                        ${escaparHTML(producto.unidad)}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Cantidad utilizada *
                        </label>

                        <input
                            id="tratamientoCantidad"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value="${tratamiento?.cantidadUsada ?? ""}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Dosis *
                        </label>

                        <input
                            id="tratamientoDosis"
                            type="text"
                            placeholder="Ej. 2 L/ha"
                            value="${escaparHTML(tratamiento?.dosis || "")}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Superficie tratada (ha)
                        </label>

                        <input
                            id="tratamientoSuperficie"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value="${tratamiento?.superficieTratada ?? ""}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Problema / objetivo
                        </label>

                        <input
                            id="tratamientoObjetivo"
                            type="text"
                            placeholder="Ej. Oídio, pulgón..."
                            value="${escaparHTML(tratamiento?.plagaObjetivo || "")}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Aplicador
                        </label>

                        <select
                            id="tratamientoTrabajador"
                        >

                            <option value="">
                                Sin trabajador
                            </option>

                            ${trabajadores.map(
                                trabajador => `

                                    <option
                                        value="${trabajador.id}"
                                        ${
                                            Number(
                                                tratamiento?.trabajadorId
                                            )
                                            ===
                                            Number(
                                                trabajador.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(
                                            obtenerNombreTrabajador(
                                                trabajador
                                            )
                                        )}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Maquinaria
                        </label>

                        <select
                            id="tratamientoMaquinaria"
                        >

                            <option value="">
                                Sin maquinaria
                            </option>

                            ${maquinaria.map(
                                maquina => `

                                    <option
                                        value="${maquina.id}"
                                        ${
                                            Number(
                                                tratamiento?.maquinariaId
                                            )
                                            ===
                                            Number(
                                                maquina.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(
                                            obtenerNombreMaquinaria(
                                                maquina
                                            )
                                        )}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Observaciones
                    </label>

                    <textarea
                        id="tratamientoObservaciones"
                        rows="4"
                        placeholder="Observaciones del tratamiento..."
                    >${escaparHTML(tratamiento?.observaciones || "")}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarTratamiento"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarTratamiento"
                        class="primary-button"
                        type="button"
                    >
                        ${
                            tratamiento
                                ? "Guardar cambios"
                                : "Registrar tratamiento"
                        }
                    </button>

                </div>

            </section>

        `;


        document
            .getElementById(
                "volverTratamientos"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarTratamiento"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "tratamientoFinca"
            )
            .addEventListener(
                "change",
                () =>
                    this.actualizarRelaciones()
            );


        document
            .getElementById(
                "guardarTratamiento"
            )
            .addEventListener(
                "click",
                () =>
                    this.guardarFormulario(
                        tratamiento
                    )
            );


        this.actualizarRelaciones();

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardarFormulario(
        tratamiento
    ) {

        const datos = {

            fecha:
                document
                    .getElementById(
                        "tratamientoFecha"
                    )
                    .value,

            hora:
                document
                    .getElementById(
                        "tratamientoHora"
                    )
                    .value,

            fincaId:
                document
                    .getElementById(
                        "tratamientoFinca"
                    )
                    .value,

            campaniaId:
                document
                    .getElementById(
                        "tratamientoCampania"
                    )
                    .value,

            cultivoId:
                document
                    .getElementById(
                        "tratamientoCultivo"
                    )
                    .value,

            productoId:
                document
                    .getElementById(
                        "tratamientoProducto"
                    )
                    .value,

            cantidadUsada:
                document
                    .getElementById(
                        "tratamientoCantidad"
                    )
                    .value,

            dosis:
                document
                    .getElementById(
                        "tratamientoDosis"
                    )
                    .value,

            superficieTratada:
                document
                    .getElementById(
                        "tratamientoSuperficie"
                    )
                    .value,

            plagaObjetivo:
                document
                    .getElementById(
                        "tratamientoObjetivo"
                    )
                    .value,

            trabajadorId:
                document
                    .getElementById(
                        "tratamientoTrabajador"
                    )
                    .value,

            maquinariaId:
                document
                    .getElementById(
                        "tratamientoMaquinaria"
                    )
                    .value,

            observaciones:
                document
                    .getElementById(
                        "tratamientoObservaciones"
                    )
                    .value

        };


        const resultado =
            tratamiento
                ? this.tratamientoService
                    .editar(
                        tratamiento.id,
                        datos
                    )
                : this.tratamientoService
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


    // =====================================================
    // RELACIONES
    // =====================================================

    actualizarRelaciones() {

        const finca =
            document
                .getElementById(
                    "tratamientoFinca"
                );


        const campania =
            document
                .getElementById(
                    "tratamientoCampania"
                );


        const cultivo =
            document
                .getElementById(
                    "tratamientoCultivo"
                );


        if (
            !finca
            ||
            !campania
            ||
            !cultivo
        ) {

            return;

        }


        const fincaId =
            finca.value;


        [
            ...campania.options
        ]
            .forEach(
                opcion => {

                    if (
                        !opcion.value
                    ) {

                        opcion.hidden =
                            false;

                        return;

                    }


                    opcion.hidden =
                        fincaId
                        &&
                        String(
                            opcion.dataset.fincaId
                        )
                        !==
                        String(
                            fincaId
                        );

                }
            );


        [
            ...cultivo.options
        ]
            .forEach(
                opcion => {

                    if (
                        !opcion.value
                    ) {

                        opcion.hidden =
                            false;

                        return;

                    }


                    opcion.hidden =
                        fincaId
                        &&
                        opcion.dataset.fincaId
                        &&
                        String(
                            opcion.dataset.fincaId
                        )
                        !==
                        String(
                            fincaId
                        );

                }
            );


        if (
            campania.selectedOptions[0]
            ?.hidden
        ) {

            campania.value =
                "";

        }


        if (
            cultivo.selectedOptions[0]
            ?.hidden
        ) {

            cultivo.value =
                "";

        }

    }


    // =====================================================
    // EVENTOS
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".editar-tratamiento"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.mostrarFormulario(
                                Number(
                                    boton.dataset.id
                                )
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".eliminar-tratamiento"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const confirmar =
                                window.confirm(
                                    "¿Eliminar este tratamiento? El stock utilizado se devolverá automáticamente al inventario."
                                );


                            if (
                                !confirmar
                            ) {

                                return;

                            }


                            const resultado =
                                this.tratamientoService
                                    .eliminar(
                                        Number(
                                            boton.dataset.id
                                        )
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
    // FILTRADOS
    // =====================================================

    obtenerFiltrados() {

        let tratamientos =
            this.tratamientoService
                .obtenerTodos();


        if (
            this.filtroFinca
        ) {

            tratamientos =
                tratamientos.filter(
                    tratamiento =>
                        Number(
                            tratamiento.fincaId
                        )
                        ===
                        Number(
                            this.filtroFinca
                        )
                );

        }


        const busqueda =
            normalizarTexto(
                this.busqueda
            );


        if (
            busqueda
        ) {

            tratamientos =
                tratamientos.filter(
                    tratamiento => {

                        const texto =
                            normalizarTexto(
                                [
                                    tratamiento.productoNombre,
                                    tratamiento.fincaNombre,
                                    tratamiento.campaniaNombre,
                                    tratamiento.cultivoNombre,
                                    tratamiento.trabajadorNombre,
                                    tratamiento.maquinariaNombre,
                                    tratamiento.plagaObjetivo,
                                    tratamiento.dosis,
                                    tratamiento.observaciones
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                            );


                        return texto.includes(
                            busqueda
                        );

                    }
                );

        }


        return tratamientos;

    }


    // =====================================================
    // VACÍO
    // =====================================================

    crearVacio() {

        return `

            <div
                class="panel empty-state"
                style="
                    grid-column: 1 / -1;
                "
            >

                <div class="empty-icon">
                    🧪
                </div>

                <h3>
                    No hay tratamientos registrados
                </h3>

                <p>
                    Los tratamientos realizados aparecerán aquí.
                </p>

            </div>

        `;

    }

}