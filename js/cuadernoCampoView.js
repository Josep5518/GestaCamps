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
    obtenerNombreMaquinaria,
    obtenerNombreProducto
} from "./entityHelpers.js";


export class CuadernoCampoView {

    constructor(
        mainContent,
        cuadernoCampoService
    ) {

        this.mainContent =
            mainContent;

        this.cuadernoCampoService =
            cuadernoCampoService;

        this.filtroFinca =
            "";

        this.filtroTipo =
            "";

        this.busqueda =
            "";

    }


    // =====================================================
    // MOSTRAR
    // =====================================================

    mostrar() {

        const registros =
            this.obtenerRegistrosFiltrados();


        const todos =
            this.cuadernoCampoService
                .obtenerTodos();


        const hoy =
            this.obtenerRegistrosHoy(
                todos
            );


        const fincas =
            StorageService
                .obtenerFincas();


        const tipos =
            this.cuadernoCampoService
                .obtenerTiposActuacion();


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Cuaderno de campo
                    </h2>

                    <p>
                        Registro de actuaciones agrícolas de la explotación
                    </p>

                </div>


                <button
                    id="nuevoRegistroCuaderno"
                    class="primary-button"
                    type="button"
                >
                    + Nueva actuación
                </button>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        📖
                    </span>

                    <div>

                        <p>
                            Registros
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
                            ${hoy.length}
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
                                            registro =>
                                                registro.fincaId
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
                        🚜
                    </span>

                    <div>

                        <p>
                            Actuaciones
                        </p>

                        <h3>
                            ${
                                new Set(
                                    todos
                                        .map(
                                            registro =>
                                                registro.tipoActuacion
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
                class="panel"
                style="
                    margin-bottom: 22px;
                "
            >

                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            minmax(220px, 1fr)
                            minmax(180px, 260px)
                            minmax(180px, 260px);
                        gap: 12px;
                    "
                >

                    <div class="form-group">

                        <label>
                            Buscar
                        </label>

                        <input
                            id="buscarCuaderno"
                            type="search"
                            placeholder="Finca, actuación, cultivo..."
                            value="${escaparHTML(this.busqueda)}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Finca
                        </label>

                        <select
                            id="filtroFincaCuaderno"
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


                    <div class="form-group">

                        <label>
                            Actuación
                        </label>

                        <select
                            id="filtroTipoCuaderno"
                        >

                            <option value="">
                                Todas
                            </option>

                            ${tipos.map(
                                tipo => `

                                    <option
                                        value="${escaparHTML(tipo)}"
                                        ${
                                            this.filtroTipo ===
                                            tipo
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(tipo)}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>

                </div>

            </section>


            <section>

                <div
                    id="listaCuadernoCampo"
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(320px, 1fr)
                            );
                        gap: 18px;
                    "
                >

                    ${
                        registros.length
                            ?
                            registros
                                .map(
                                    registro =>
                                        this.crearTarjeta(
                                            registro
                                        )
                                )
                                .join("")
                            :
                            this.crearVacio()
                    }

                </div>

            </section>

        `;


        document
            .getElementById(
                "nuevoRegistroCuaderno"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormulario()
            );


        document
            .getElementById(
                "buscarCuaderno"
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
                "filtroFincaCuaderno"
            )
            .addEventListener(
                "change",
                event => {

                    this.filtroFinca =
                        event.target.value;


                    this.mostrar();

                }
            );


        document
            .getElementById(
                "filtroTipoCuaderno"
            )
            .addEventListener(
                "change",
                event => {

                    this.filtroTipo =
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
        registro
    ) {

        return `

            <article
                class="panel"
                style="
                    margin: 0;
                "
            >

                <div
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
                            ${this.obtenerIcono(registro.tipoActuacion)}
                        </div>


                        <h3
                            style="
                                margin-bottom: 5px;
                            "
                        >
                            ${escaparHTML(registro.tipoActuacion)}
                        </h3>


                        <strong
                            style="
                                color: #247354;
                            "
                        >
                            ${escaparHTML(registro.fincaNombre)}
                        </strong>

                    </div>


                    <div
                        style="
                            display: flex;
                            gap: 7px;
                        "
                    >

                        <button
                            type="button"
                            class="secondary-button editar-cuaderno"
                            data-id="${registro.id}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="secondary-button eliminar-cuaderno"
                            data-id="${registro.id}"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <div
                    style="
                        margin-top: 16px;
                        display: grid;
                        gap: 8px;
                    "
                >

                    <p>
                        📅 ${formatearFecha(registro.fecha)}
                        ${
                            registro.hora
                                ? ` · ${escaparHTML(registro.hora)}`
                                : ""
                        }
                    </p>


                    ${
                        registro.campaniaNombre
                            ? `
                                <p>
                                    🗓️ ${escaparHTML(registro.campaniaNombre)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        registro.cultivoNombre
                            ? `
                                <p>
                                    🌱 ${escaparHTML(registro.cultivoNombre)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        registro.trabajadorNombres?.length
                            ? `
                                <p>
                                    👷 ${registro.trabajadorNombres
                                        .map(
                                            nombre =>
                                                escaparHTML(nombre)
                                        )
                                        .join(", ")}
                                </p>
                            `
                            : ""
                    }


                    ${
                        registro.maquinariaNombre
                            ? `
                                <p>
                                    🚜 ${escaparHTML(registro.maquinariaNombre)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        registro.productoNombre
                            ? `
                                <p>
                                    📦 ${escaparHTML(registro.productoNombre)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        registro.cantidad !==
                        null
                        &&
                        registro.cantidad !==
                        undefined
                            ? `
                                <p>
                                    ⚖️ ${registro.cantidad}
                                    ${escaparHTML(registro.unidad || "")}
                                </p>
                            `
                            : ""
                    }


                    ${
                        registro.dosis
                            ? `
                                <p>
                                    🧪 Dosis:
                                    ${escaparHTML(registro.dosis)}
                                </p>
                            `
                            : ""
                    }

                </div>


                ${
                    registro.descripcion
                        ? `

                            <div
                                style="
                                    margin-top: 15px;
                                    padding: 13px;
                                    background: #f5f7f5;
                                    border-radius: 10px;
                                "
                            >

                                <strong>
                                    Descripción
                                </strong>

                                <p
                                    style="
                                        margin: 5px 0 0;
                                    "
                                >
                                    ${escaparHTML(registro.descripcion)}
                                </p>

                            </div>

                        `
                        : ""
                }


                ${
                    registro.observaciones
                        ? `

                            <div
                                style="
                                    margin-top: 10px;
                                    padding: 13px;
                                    background: #f5f7f5;
                                    border-radius: 10px;
                                "
                            >

                                <strong>
                                    Observaciones
                                </strong>

                                <p
                                    style="
                                        margin: 5px 0 0;
                                    "
                                >
                                    ${escaparHTML(registro.observaciones)}
                                </p>

                            </div>

                        `
                        : ""
                }


                <p
                    style="
                        margin:
                            14px 0 0;
                        color: #78837d;
                        font-size: 12px;
                    "
                >
                    Registrado por
                    ${escaparHTML(
                        registro.creadoPorNombre
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
        registroId = null
    ) {

        const registro =
            registroId
                ? this.cuadernoCampoService
                    .obtenerPorId(
                        registroId
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
                .obtenerInventario();


        const tipos =
            this.cuadernoCampoService
                .obtenerTiposActuacion();


        const ahora =
            new Date();


        const fechaHoy =
            StorageService
                .obtenerFechaLocal(
                    ahora
                );


        const horaAhora =
            obtenerHoraActual();


        this.mainContent.innerHTML = `

            <button
                id="volverCuaderno"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        ${
                            registro
                                ? "Editar actuación"
                                : "Nueva actuación"
                        }
                    </h2>

                    <p>
                        Cuaderno de campo
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
                            id="cuadernoFecha"
                            type="date"
                            value="${
                                registro?.fecha
                                ||
                                fechaHoy
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Hora
                        </label>

                        <input
                            id="cuadernoHora"
                            type="time"
                            value="${
                                registro?.hora
                                ||
                                horaAhora
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Tipo de actuación *
                        </label>

                        <select
                            id="cuadernoTipo"
                        >

                            <option value="">
                                Selecciona...
                            </option>

                            ${tipos.map(
                                tipo => `

                                    <option
                                        value="${escaparHTML(tipo)}"
                                        ${
                                            registro?.tipoActuacion ===
                                            tipo
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(tipo)}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Finca *
                        </label>

                        <select
                            id="cuadernoFinca"
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
                                                registro?.fincaId
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
                            id="cuadernoCampania"
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
                                                registro?.campaniaId
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
                            id="cuadernoCultivo"
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
                                                registro?.cultivoId
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
                            Maquinaria
                        </label>

                        <select
                            id="cuadernoMaquinaria"
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
                                                registro?.maquinariaId
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


                    <div class="form-group">

                        <label>
                            Producto / material
                        </label>

                        <select
                            id="cuadernoProducto"
                        >

                            <option value="">
                                Sin producto
                            </option>

                            ${inventario.map(
                                producto => `

                                    <option
                                        value="${producto.id}"
                                        ${
                                            Number(
                                                registro?.productoInventarioId
                                            )
                                            ===
                                            Number(
                                                producto.id
                                            )
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escaparHTML(
                                            obtenerNombreProducto(
                                                producto
                                            )
                                        )}
                                    </option>

                                `
                            ).join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Cantidad
                        </label>

                        <input
                            id="cuadernoCantidad"
                            type="number"
                            min="0"
                            step="0.01"
                            value="${
                                registro?.cantidad
                                ??
                                ""
                            }"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Unidad
                        </label>

                        <select
                            id="cuadernoUnidad"
                        >

                            ${[
                                "",
                                "kg",
                                "g",
                                "L",
                                "ml",
                                "ud",
                                "ha",
                                "h"
                            ]
                                .map(
                                    unidad => `

                                        <option
                                            value="${unidad}"
                                            ${
                                                registro?.unidad ===
                                                unidad
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            ${
                                                unidad
                                                ||
                                                "Sin unidad"
                                            }
                                        </option>

                                    `
                                )
                                .join("")}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Dosis
                        </label>

                        <input
                            id="cuadernoDosis"
                            type="text"
                            placeholder="Ej. 2 L/ha"
                            value="${escaparHTML(registro?.dosis || "")}"
                        >

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Trabajadores
                    </label>

                    <div
                        style="
                            display: grid;
                            grid-template-columns:
                                repeat(
                                    auto-fit,
                                    minmax(190px, 1fr)
                                );
                            gap: 8px;
                        "
                    >

                        ${
                            trabajadores.length

                                ? trabajadores.map(
                                    trabajador => {

                                        const marcado =
                                            registro?.trabajadorIds
                                                ?.some(
                                                    id =>
                                                        Number(id)
                                                        ===
                                                        Number(
                                                            trabajador.id
                                                        )
                                                );


                                        return `

                                            <label
                                                style="
                                                    display: flex;
                                                    gap: 8px;
                                                    align-items: center;
                                                    padding: 10px;
                                                    border: 1px solid #e1e8e3;
                                                    border-radius: 9px;
                                                "
                                            >

                                                <input
                                                    type="checkbox"
                                                    class="cuaderno-trabajador"
                                                    value="${trabajador.id}"
                                                    ${
                                                        marcado
                                                            ? "checked"
                                                            : ""
                                                    }
                                                >

                                                ${escaparHTML(
                                                    obtenerNombreTrabajador(
                                                        trabajador
                                                    )
                                                )}

                                            </label>

                                        `;

                                    }
                                ).join("")

                                : `

                                    <p>
                                        No hay trabajadores activos.
                                    </p>

                                `
                        }

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Descripción
                    </label>

                    <textarea
                        id="cuadernoDescripcion"
                        rows="4"
                        placeholder="Describe el trabajo realizado..."
                    >${escaparHTML(registro?.descripcion || "")}</textarea>

                </div>


                <div class="form-group">

                    <label>
                        Observaciones
                    </label>

                    <textarea
                        id="cuadernoObservaciones"
                        rows="3"
                        placeholder="Observaciones adicionales..."
                    >${escaparHTML(registro?.observaciones || "")}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarCuaderno"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarCuaderno"
                        class="primary-button"
                        type="button"
                    >
                        ${
                            registro
                                ? "Guardar cambios"
                                : "Registrar actuación"
                        }
                    </button>

                </div>

            </section>

        `;


        document
            .getElementById(
                "volverCuaderno"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cancelarCuaderno"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrar()
            );


        document
            .getElementById(
                "cuadernoFinca"
            )
            .addEventListener(
                "change",
                () =>
                    this.actualizarRelacionesFormulario()
            );


        document
            .getElementById(
                "guardarCuaderno"
            )
            .addEventListener(
                "click",
                () =>
                    this.guardarFormulario(
                        registro
                    )
            );


        this.actualizarRelacionesFormulario();

    }


    // =====================================================
    // GUARDAR FORMULARIO
    // =====================================================

    guardarFormulario(
        registro
    ) {

        const trabajadorIds =
            [
                ...document
                    .querySelectorAll(
                        ".cuaderno-trabajador:checked"
                    )
            ]
                .map(
                    checkbox =>
                        Number(
                            checkbox.value
                        )
                );


        const datos = {

            fecha:
                document
                    .getElementById(
                        "cuadernoFecha"
                    )
                    .value,

            hora:
                document
                    .getElementById(
                        "cuadernoHora"
                    )
                    .value,

            tipoActuacion:
                document
                    .getElementById(
                        "cuadernoTipo"
                    )
                    .value,

            fincaId:
                document
                    .getElementById(
                        "cuadernoFinca"
                    )
                    .value,

            campaniaId:
                document
                    .getElementById(
                        "cuadernoCampania"
                    )
                    .value,

            cultivoId:
                document
                    .getElementById(
                        "cuadernoCultivo"
                    )
                    .value,

            trabajadorIds:
                trabajadorIds,

            maquinariaId:
                document
                    .getElementById(
                        "cuadernoMaquinaria"
                    )
                    .value,

            productoInventarioId:
                document
                    .getElementById(
                        "cuadernoProducto"
                    )
                    .value,

            cantidad:
                document
                    .getElementById(
                        "cuadernoCantidad"
                    )
                    .value,

            unidad:
                document
                    .getElementById(
                        "cuadernoUnidad"
                    )
                    .value,

            dosis:
                document
                    .getElementById(
                        "cuadernoDosis"
                    )
                    .value,

            descripcion:
                document
                    .getElementById(
                        "cuadernoDescripcion"
                    )
                    .value,

            observaciones:
                document
                    .getElementById(
                        "cuadernoObservaciones"
                    )
                    .value

        };


        const resultado =
            registro
                ? this.cuadernoCampoService
                    .editar(
                        registro.id,
                        datos
                    )
                : this.cuadernoCampoService
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
    // FILTRAR CAMPANYA / CULTIVO
    // =====================================================

    actualizarRelacionesFormulario() {

        const finca =
            document
                .getElementById(
                    "cuadernoFinca"
                );


        const campania =
            document
                .getElementById(
                    "cuadernoCampania"
                );


        const cultivo =
            document
                .getElementById(
                    "cuadernoCultivo"
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


                    const fincaCultivo =
                        opcion.dataset.fincaId;


                    opcion.hidden =
                        fincaId
                        &&
                        fincaCultivo
                        &&
                        String(
                            fincaCultivo
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
                ".editar-cuaderno"
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
                ".eliminar-cuaderno"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const confirmar =
                                window.confirm(
                                    "¿Quieres eliminar este registro del cuaderno de campo?"
                                );


                            if (
                                !confirmar
                            ) {

                                return;

                            }


                            const resultado =
                                this.cuadernoCampoService
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
    // FILTROS
    // =====================================================

    obtenerRegistrosFiltrados() {

        let registros =
            this.cuadernoCampoService
                .obtenerTodos();


        if (
            this.filtroFinca
        ) {

            registros =
                registros.filter(
                    registro =>
                        Number(
                            registro.fincaId
                        )
                        ===
                        Number(
                            this.filtroFinca
                        )
                );

        }


        if (
            this.filtroTipo
        ) {

            registros =
                registros.filter(
                    registro =>
                        registro.tipoActuacion ===
                        this.filtroTipo
                );

        }


        const busqueda =
            normalizarTexto(
                this.busqueda
            );


        if (
            busqueda
        ) {

            registros =
                registros.filter(
                    registro => {

                        const texto =
                            normalizarTexto(
                                [
                                    registro.tipoActuacion,
                                    registro.fincaNombre,
                                    registro.campaniaNombre,
                                    registro.cultivoNombre,
                                    ...(registro.trabajadorNombres || []),
                                    registro.maquinariaNombre,
                                    registro.productoNombre,
                                    registro.descripcion,
                                    registro.observaciones
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


        return registros;

    }


    obtenerRegistrosHoy(
        registros
    ) {

        const hoy =
            StorageService
                .obtenerFechaLocal(
                    new Date()
                );


        return registros.filter(
            registro =>
                registro.fecha ===
                hoy
        );

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
                    📖
                </div>

                <h3>
                    No hay actuaciones registradas
                </h3>

                <p>
                    Las actuaciones realizadas en tus fincas aparecerán aquí.
                </p>

            </div>

        `;

    }


    // =====================================================
    // ICONOS
    // =====================================================

    obtenerIcono(
        tipo
    ) {

        const iconos = {

            "Riego":
                "💧",

            "Poda":
                "✂️",

            "Abonado":
                "🧪",

            "Tratamiento fitosanitario":
                "🛡️",

            "Recolección":
                "🍎",

            "Laboreo":
                "🚜",

            "Siembra / plantación":
                "🌱",

            "Mantenimiento":
                "🔧",

            "Otro":
                "📝"

        };


        return iconos[tipo]
            ||
            "📖";

    }

}