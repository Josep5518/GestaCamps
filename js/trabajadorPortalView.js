export class TrabajadorPortalView {

    constructor(
        mainContent,
        trabajadorService,
        trabajoService,
        incidenciaService,
        fincaService,
        fichajeService,
        onSalirPortal = null
    ) {

        this.mainContent =
            mainContent;

        this.trabajadorService =
            trabajadorService;

        this.trabajoService =
            trabajoService;

        this.incidenciaService =
            incidenciaService;

        this.fincaService =
            fincaService;

        this.fichajeService =
            fichajeService;

        this.onSalirPortal =
            onSalirPortal;


        this.claveSesion =
            "gestacamps_trabajador_sesion";


        this.claveModoCampo =
            "gestacamps_modo_campo";

    }


    mostrar() {

        const trabajador =
            this.obtenerTrabajadorSesion();


        if (
            trabajador
        ) {

            if (
                this.estaModoCampoActivo()
            ) {

                this.mostrarModoCampo(
                    trabajador
                );

            }

            else {

                this.mostrarPanel(
                    trabajador
                );

            }


            return;

        }


        this.mostrarAcceso();

    }


    mostrarAcceso() {

        this.mainContent.innerHTML = `

            <div
                style="
                    min-height: calc(100vh - 40px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                "
            >

                <div
                    class="panel"
                    style="
                        width: 100%;
                        max-width: 480px;
                        padding: 30px;
                    "
                >

                    <div
                        style="
                            text-align: center;
                            margin-bottom: 28px;
                        "
                    >

                        <div
                            style="
                                font-size: 48px;
                                margin-bottom: 12px;
                            "
                        >
                            👷
                        </div>


                        <h2>
                            Portal del trabajador
                        </h2>


                        <p
                            style="
                                color: #78837d;
                            "
                        >
                            Introduce tu PIN personal para acceder.
                        </p>

                    </div>


                    <div class="form-group">

                        <label>
                            PIN
                        </label>


                        <input
                            id="pinPortalTrabajador"
                            type="password"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            maxlength="4"
                            autocomplete="off"
                            placeholder="••••"
                            style="
                                text-align: center;
                                font-size: 24px;
                                letter-spacing: 8px;
                            "
                        >

                    </div>


                    <button
                        id="entrarPortalTrabajador"
                        class="primary-button"
                        type="button"
                        style="
                            width: 100%;
                            min-height: 50px;
                        "
                    >
                        Entrar
                    </button>


                    <button
                        id="volverAdministracionPortal"
                        class="secondary-button"
                        type="button"
                        style="
                            width: 100%;
                            min-height: 50px;
                            margin-top: 12px;
                        "
                    >
                        ← Volver a administración
                    </button>

                </div>

            </div>

        `;


        const input =
            document.getElementById(
                "pinPortalTrabajador"
            );


        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
                            0,
                            4
                        );

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    this.iniciarSesion();

                }

            }
        );


        document
            .getElementById(
                "entrarPortalTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.iniciarSesion()
            );


        document
            .getElementById(
                "volverAdministracionPortal"
            )
            .addEventListener(
                "click",
                () =>
                    this.volverAdministracion()
            );


        input.focus();

    }


    iniciarSesion() {

        const input =
            document.getElementById(
                "pinPortalTrabajador"
            );


        if (
            !input
        ) {

            return;

        }


        const pin =
            input.value.trim();


        if (
            !/^\d{4}$/.test(
                pin
            )
        ) {

            alert(
                "Introduce un PIN de 4 números."
            );

            return;

        }


        const trabajador =
            this.trabajadorService
                .obtenerPorPin(
                    pin
                );


        if (
            !trabajador
        ) {

            alert(
                "PIN incorrecto."
            );


            input.value =
                "";


            input.focus();


            return;

        }


        if (
            trabajador.estado !==
            "Activo"
        ) {

            alert(
                "Este trabajador está inactivo."
            );

            return;

        }


        sessionStorage.setItem(
            this.claveSesion,
            String(
                trabajador.id
            )
        );


        sessionStorage.removeItem(
            this.claveModoCampo
        );


        this.mostrarPanel(
            trabajador
        );

    }


    obtenerTrabajadorSesion() {

        const id =
            sessionStorage.getItem(
                this.claveSesion
            );


        if (
            !id
        ) {

            return null;

        }


        const trabajador =
            this.trabajadorService
                .obtenerPorId(
                    id
                );


        if (
            !trabajador
            ||
            trabajador.estado !==
            "Activo"
        ) {

            sessionStorage.removeItem(
                this.claveSesion
            );


            sessionStorage.removeItem(
                this.claveModoCampo
            );


            return null;

        }


        return trabajador;

    }


    cerrarSesion() {

        sessionStorage.removeItem(
            this.claveSesion
        );


        sessionStorage.removeItem(
            this.claveModoCampo
        );


        this.mostrarAcceso();

    }


    estaModoCampoActivo() {

        return (
            sessionStorage.getItem(
                this.claveModoCampo
            ) ===
            "true"
        );

    }


    activarModoCampo(
        trabajador
    ) {

        sessionStorage.setItem(
            this.claveModoCampo,
            "true"
        );


        this.mostrarModoCampo(
            trabajador
        );

    }


    desactivarModoCampo(
        trabajador
    ) {

        sessionStorage.removeItem(
            this.claveModoCampo
        );


        this.mostrarPanel(
            trabajador
        );

    }


    mostrarPanel(
        trabajador
    ) {

        const tareas =
            this.obtenerTareasTrabajador(
                trabajador.id
            );


        const pendientes =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "Pendiente"
            );


        const enCurso =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "En curso"
            );


        const completadas =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "Completada"
            );


        const incidencias =
            this.incidenciaService
                .obtenerPorTrabajador(
                    trabajador.id
                );


        const incidenciasActivas =
            incidencias.filter(
                incidencia =>
                    incidencia.estado !==
                    "Resuelta"
            );


        const fichajes =
            this.fichajeService
                ? this.fichajeService
                    .obtenerPorTrabajador(
                        trabajador.id
                    )
                    .slice(
                        0,
                        30
                    )
                : [];


        const correccionesPendientes =
            fichajes.filter(
                fichaje =>
                    fichaje.correccion
                    &&
                    fichaje.correccion.estado ===
                    "Pendiente"
            ).length;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <p
                        style="
                            margin-bottom: 3px;
                            color: #78837d;
                        "
                    >
                        Portal del trabajador
                    </p>


                    <h2>
                        Hola, ${this.obtenerNombreTrabajador(trabajador)}
                    </h2>


                    <p>
                        ${trabajador.puesto || "Trabajador"}
                    </p>

                </div>


                <div
                    style="
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                    "
                >

                    <button
                        id="activarModoCampo"
                        class="primary-button"
                        type="button"
                    >
                        🌾 Modo campo
                    </button>


                    <button
                        id="comunicarIncidencia"
                        class="primary-button"
                        type="button"
                    >
                        ⚠️ Comunicar incidencia
                    </button>


                    <button
                        id="cerrarSesionTrabajador"
                        class="secondary-button"
                        type="button"
                    >
                        Cerrar sesión
                    </button>

                </div>

            </header>


            <section class="stats">

                <div class="card">

                    <span class="card-icon">
                        📋
                    </span>

                    <div>

                        <p>
                            Mis tareas
                        </p>

                        <h3>
                            ${tareas.length}
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
                            ${pendientes.length}
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
                            ${enCurso.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ⚠️
                    </span>

                    <div>

                        <p>
                            Incidencias abiertas
                        </p>

                        <h3>
                            ${incidenciasActivas.length}
                        </h3>

                    </div>

                </div>


                <div class="card">

                    <span class="card-icon">
                        ✏️
                    </span>

                    <div>

                        <p>
                            Correcciones pendientes
                        </p>

                        <h3>
                            ${correccionesPendientes}
                        </h3>

                    </div>

                </div>

            </section>


            ${
                this.crearSeccionTareas(
                    "🚜 En curso",
                    enCurso,
                    "enCurso"
                )
            }


            ${
                this.crearSeccionTareas(
                    "🕒 Pendientes",
                    pendientes,
                    "pendientes"
                )
            }


            ${
                this.crearSeccionTareas(
                    "✅ Completadas",
                    completadas,
                    "completadas"
                )
            }


            ${
                this.crearSeccionFichajes(
                    fichajes
                )
            }


            ${
                this.crearSeccionIncidencias(
                    incidencias
                )
            }

        `;


        document
            .getElementById(
                "cerrarSesionTrabajador"
            )
            .addEventListener(
                "click",
                () =>
                    this.cerrarSesion()
            );


        document
            .getElementById(
                "activarModoCampo"
            )
            .addEventListener(
                "click",
                () =>
                    this.activarModoCampo(
                        trabajador
                    )
            );


        document
            .getElementById(
                "comunicarIncidencia"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormularioIncidencia(
                        trabajador
                    )
            );


        this.configurarEventosTareas(
            trabajador
        );


        this.configurarEventosFichajes(
            trabajador
        );

    }


    mostrarModoCampo(
        trabajador
    ) {

        const tareas =
            this.obtenerTareasTrabajador(
                trabajador.id
            );


        const pendientes =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "Pendiente"
            );


        const enCurso =
            tareas.filter(
                tarea =>
                    tarea.estado ===
                    "En curso"
            );


        const incidencias =
            this.incidenciaService
                .obtenerPorTrabajador(
                    trabajador.id
                );


        const incidenciasActivas =
            incidencias.filter(
                incidencia =>
                    incidencia.estado !==
                    "Resuelta"
            );


        const tareaActual =
            enCurso.length >
            0
                ? enCurso[0]
                : null;


        this.mainContent.innerHTML = `

            <div
                style="
                    max-width: 900px;
                    margin: 0 auto;
                    padding-bottom: 40px;
                "
            >

                <div
                    style="
                        background: #12372a;
                        color: white;
                        border-radius: 18px;
                        padding: 22px;
                        margin-bottom: 18px;
                    "
                >

                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            gap: 15px;
                            flex-wrap: wrap;
                        "
                    >

                        <div>

                            <p
                                style="
                                    margin: 0 0 5px;
                                    opacity: 0.8;
                                    font-size: 14px;
                                "
                            >
                                🌾 GestaCamps · Modo campo
                            </p>


                            <h2
                                style="
                                    margin: 0;
                                    color: white;
                                    font-size: 27px;
                                "
                            >
                                ${this.obtenerNombreTrabajador(trabajador)}
                            </h2>


                            <p
                                style="
                                    margin: 6px 0 0;
                                    opacity: 0.85;
                                "
                            >
                                ${trabajador.puesto || "Trabajador"}
                            </p>

                        </div>


                        <button
                            id="salirModoCampo"
                            type="button"
                            style="
                                border: 0;
                                border-radius: 12px;
                                min-height: 46px;
                                padding: 0 16px;
                                background: rgba(255,255,255,0.14);
                                color: white;
                                font-weight: 600;
                                cursor: pointer;
                            "
                        >
                            Vista completa
                        </button>

                    </div>

                </div>


                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(145px, 1fr)
                            );
                        gap: 12px;
                        margin-bottom: 18px;
                    "
                >

                    ${this.crearTarjetaCampoResumen(
                        "🚜",
                        "En curso",
                        enCurso.length
                    )}


                    ${this.crearTarjetaCampoResumen(
                        "🕒",
                        "Pendientes",
                        pendientes.length
                    )}


                    ${this.crearTarjetaCampoResumen(
                        "⚠️",
                        "Incidencias",
                        incidenciasActivas.length
                    )}

                </div>


                <section
                    style="
                        background: white;
                        border-radius: 18px;
                        padding: 20px;
                        box-shadow: 0 4px 18px rgba(0,0,0,0.06);
                        margin-bottom: 18px;
                    "
                >

                    <p
                        style="
                            margin: 0 0 12px;
                            color: #78837d;
                            font-size: 13px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: .4px;
                        "
                    >
                        Trabajo actual
                    </p>


                    ${
                        tareaActual

                            ? this.crearTareaActualCampo(
                                tareaActual
                            )

                            : `

                                <div
                                    style="
                                        text-align: center;
                                        padding: 20px 10px;
                                    "
                                >

                                    <div
                                        style="
                                            font-size: 40px;
                                            margin-bottom: 10px;
                                        "
                                    >
                                        🌱
                                    </div>


                                    <strong
                                        style="
                                            font-size: 18px;
                                        "
                                    >
                                        No tienes ninguna tarea en curso
                                    </strong>


                                    <p
                                        style="
                                            color: #78837d;
                                            margin-bottom: 0;
                                        "
                                    >
                                        Puedes iniciar una de tus tareas pendientes.
                                    </p>

                                </div>

                            `
                    }

                </section>


                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(220px, 1fr)
                            );
                        gap: 12px;
                        margin-bottom: 18px;
                    "
                >

                    <button
                        id="campoVerTareas"
                        type="button"
                        style="
                            min-height: 82px;
                            padding: 16px;
                            border: 0;
                            border-radius: 16px;
                            background: #1f7255;
                            color: white;
                            font-size: 17px;
                            font-weight: 700;
                            cursor: pointer;
                        "
                    >
                        📋 Mis tareas
                    </button>


                    <button
                        id="campoIncidencia"
                        type="button"
                        style="
                            min-height: 82px;
                            padding: 16px;
                            border: 0;
                            border-radius: 16px;
                            background: #fff4cf;
                            color: #6c5500;
                            font-size: 17px;
                            font-weight: 700;
                            cursor: pointer;
                        "
                    >
                        ⚠️ Comunicar incidencia
                    </button>

                </div>


                ${
                    pendientes.length >
                    0

                        ? `

                            <section
                                style="
                                    background: white;
                                    border-radius: 18px;
                                    padding: 20px;
                                    box-shadow: 0 4px 18px rgba(0,0,0,0.06);
                                    margin-bottom: 18px;
                                "
                            >

                                <h3
                                    style="
                                        margin-top: 0;
                                    "
                                >
                                    🕒 Próximas tareas
                                </h3>


                                <div
                                    style="
                                        display: grid;
                                        gap: 12px;
                                    "
                                >

                                    ${pendientes.map(
                                        tarea =>
                                            this.crearTarjetaPendienteCampo(
                                                tarea
                                            )
                                    ).join("")}

                                </div>

                            </section>

                        `

                        : ""
                }


                ${
                    incidenciasActivas.length >
                    0

                        ? `

                            <section
                                style="
                                    background: white;
                                    border-radius: 18px;
                                    padding: 20px;
                                    box-shadow: 0 4px 18px rgba(0,0,0,0.06);
                                    margin-bottom: 18px;
                                "
                            >

                                <h3
                                    style="
                                        margin-top: 0;
                                    "
                                >
                                    ⚠️ Mis incidencias activas
                                </h3>


                                ${incidenciasActivas.map(
                                    incidencia => `

                                        <div
                                            style="
                                                padding: 14px 0;
                                                border-bottom: 1px solid #edf0ed;
                                            "
                                        >

                                            <strong>
                                                ${incidencia.tipo}
                                            </strong>


                                            <p
                                                style="
                                                    margin: 5px 0;
                                                    color: #5f6d66;
                                                "
                                            >
                                                ${incidencia.descripcion}
                                            </p>


                                            <small
                                                style="
                                                    color: #78837d;
                                                "
                                            >
                                                ${incidencia.estado}
                                                ·
                                                ${incidencia.prioridad}
                                            </small>

                                        </div>

                                    `
                                ).join("")}

                            </section>

                        `

                        : ""
                }


                <button
                    id="campoCerrarSesion"
                    type="button"
                    style="
                        width: 100%;
                        min-height: 56px;
                        border: 1px solid #dce5df;
                        border-radius: 15px;
                        background: white;
                        color: #34483e;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    "
                >
                    Cerrar sesión
                </button>

            </div>

        `;


        document
            .getElementById(
                "salirModoCampo"
            )
            .addEventListener(
                "click",
                () =>
                    this.desactivarModoCampo(
                        trabajador
                    )
            );


        document
            .getElementById(
                "campoVerTareas"
            )
            .addEventListener(
                "click",
                () =>
                    this.desactivarModoCampo(
                        trabajador
                    )
            );


        document
            .getElementById(
                "campoIncidencia"
            )
            .addEventListener(
                "click",
                () =>
                    this.mostrarFormularioIncidencia(
                        trabajador,
                        true
                    )
            );


        document
            .getElementById(
                "campoCerrarSesion"
            )
            .addEventListener(
                "click",
                () =>
                    this.cerrarSesion()
            );


        document
            .querySelectorAll(
                ".campo-iniciar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstadoTareaCampo(
                                boton.dataset.id,
                                "En curso",
                                trabajador
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".campo-completar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.cambiarEstadoTareaCampo(
                                boton.dataset.id,
                                "Completada",
                                trabajador
                            );

                        }
                    );

                }
            );

    }


    crearTarjetaCampoResumen(
        icono,
        titulo,
        valor
    ) {

        return `

            <div
                style="
                    background: white;
                    border-radius: 16px;
                    padding: 16px;
                    box-shadow: 0 4px 18px rgba(0,0,0,0.05);
                "
            >

                <div
                    style="
                        font-size: 26px;
                        margin-bottom: 8px;
                    "
                >
                    ${icono}
                </div>


                <p
                    style="
                        margin: 0;
                        color: #78837d;
                        font-size: 13px;
                    "
                >
                    ${titulo}
                </p>


                <strong
                    style="
                        display: block;
                        font-size: 25px;
                        margin-top: 3px;
                    "
                >
                    ${valor}
                </strong>

            </div>

        `;

    }


    crearTareaActualCampo(
        tarea
    ) {

        return `

            <div>

                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 15px;
                        flex-wrap: wrap;
                    "
                >

                    <div>

                        <h2
                            style="
                                margin: 0 0 6px;
                                font-size: 24px;
                            "
                        >
                            ${tarea.titulo}
                        </h2>


                        <strong
                            style="
                                color: #247354;
                            "
                        >
                            ${tarea.tipo || "Trabajo"}
                        </strong>

                    </div>


                    <span
                        style="
                            padding: 7px 12px;
                            border-radius: 999px;
                            background: #e3f3eb;
                            color: #176044;
                            font-size: 13px;
                            font-weight: 600;
                        "
                    >
                        En curso
                    </span>

                </div>


                <div
                    style="
                        margin-top: 18px;
                        display: grid;
                        gap: 10px;
                        font-size: 16px;
                    "
                >

                    <div>
                        📍
                        <strong>
                            ${tarea.fincaNombre || "Sin finca"}
                        </strong>
                    </div>


                    ${
                        tarea.parcela

                            ? `

                                <div>
                                    🗺️ ${tarea.parcela}
                                </div>

                            `

                            : ""
                    }


                    ${
                        tarea.campaniaNombre

                            ? `

                                <div>
                                    🗓️ ${tarea.campaniaNombre}
                                </div>

                            `

                            : ""
                    }


                    ${
                        tarea.cultivo

                            ? `

                                <div>
                                    🌱 ${tarea.cultivo}
                                </div>

                            `

                            : ""
                    }


                    ${
                        tarea.maquinariaNombre

                            ? `

                                <div>
                                    🚜 ${tarea.maquinariaNombre}
                                </div>

                            `

                            : ""
                    }


                    <div>
                        ⚠️ Prioridad:
                        <strong>
                            ${tarea.prioridad || "Media"}
                        </strong>
                    </div>

                </div>


                ${
                    tarea.notas

                        ? `

                            <div
                                style="
                                    margin-top: 16px;
                                    padding: 14px;
                                    border-radius: 12px;
                                    background: #f5f7f5;
                                "
                            >

                                <strong>
                                    Notas
                                </strong>


                                <p
                                    style="
                                        margin: 6px 0 0;
                                    "
                                >
                                    ${tarea.notas}
                                </p>

                            </div>

                        `

                        : ""
                }


                <button
                    type="button"
                    class="campo-completar-tarea"
                    data-id="${tarea.id}"
                    style="
                        width: 100%;
                        min-height: 62px;
                        margin-top: 20px;
                        border: 0;
                        border-radius: 15px;
                        background: #1f7255;
                        color: white;
                        font-size: 18px;
                        font-weight: 700;
                        cursor: pointer;
                    "
                >
                    ✅ Completar tarea
                </button>

            </div>

        `;

    }


    crearTarjetaPendienteCampo(
        tarea
    ) {

        return `

            <div
                style="
                    border: 1px solid #e4eae6;
                    border-radius: 14px;
                    padding: 16px;
                "
            >

                <h3
                    style="
                        margin: 0 0 6px;
                    "
                >
                    ${tarea.titulo}
                </h3>


                <p
                    style="
                        margin: 5px 0;
                        color: #5f6d66;
                    "
                >
                    📍 ${tarea.fincaNombre || "Sin finca"}
                </p>


                ${
                    tarea.campaniaNombre

                        ? `

                            <p
                                style="
                                    margin: 5px 0;
                                    color: #5f6d66;
                                "
                            >
                                🗓️ ${tarea.campaniaNombre}
                            </p>

                        `

                        : ""
                }


                <p
                    style="
                        margin: 5px 0;
                        color: #5f6d66;
                    "
                >
                    📅 ${this.formatearFecha(tarea.fecha)}
                </p>


                <button
                    type="button"
                    class="campo-iniciar-tarea"
                    data-id="${tarea.id}"
                    style="
                        width: 100%;
                        min-height: 54px;
                        margin-top: 13px;
                        border: 0;
                        border-radius: 13px;
                        background: #1f7255;
                        color: white;
                        font-size: 16px;
                        font-weight: 700;
                        cursor: pointer;
                    "
                >
                    ▶️ Iniciar tarea
                </button>

            </div>

        `;

    }


    cambiarEstadoTareaCampo(
        tareaId,
        estado,
        trabajador
    ) {

        const resultado =
            this.cambiarEstadoTarea(
                tareaId,
                estado,
                trabajador,
                false
            );


        if (
            resultado
        ) {

            this.mostrarModoCampo(
                trabajador
            );

        }

    }


    obtenerTareasTrabajador(
        trabajadorId
    ) {

        return this.trabajoService
            .obtenerPorTrabajador(
                trabajadorId
            )
            .slice()
            .sort(
                (a, b) =>
                    new Date(
                        a.fecha
                    )
                    -
                    new Date(
                        b.fecha
                    )
            );

    }


    crearSeccionTareas(
        titulo,
        tareas,
        tipo
    ) {

        if (
            tareas.length ===
            0
        ) {

            return "";

        }


        return `

            <section
                class="panel"
                style="
                    margin-top: 24px;
                "
            >

                <div class="panel-header">

                    <h3>
                        ${titulo}
                    </h3>

                </div>


                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(280px, 1fr)
                            );
                        gap: 18px;
                    "
                >

                    ${tareas.map(
                        tarea =>
                            this.crearTarjetaTarea(
                                tarea,
                                tipo
                            )
                    ).join("")}

                </div>

            </section>

        `;

    }


    crearTarjetaTarea(
        tarea,
        tipo
    ) {

        return `

            <div
                style="
                    border: 1px solid #e1e8e3;
                    border-radius: 14px;
                    padding: 18px;
                    background: white;
                "
            >

                <h3>
                    ${tarea.titulo}
                </h3>


                <strong
                    style="
                        color: #247354;
                    "
                >
                    ${tarea.tipo || "Trabajo"}
                </strong>


                <p class="trabajo-linea">
                    📍 ${tarea.fincaNombre || "Sin finca"}
                </p>


                ${
                    tarea.parcela

                        ? `

                            <p class="trabajo-linea">
                                🗺️ ${tarea.parcela}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.cultivo

                        ? `

                            <p class="trabajo-linea">
                                🌱 ${tarea.cultivo}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.campaniaNombre

                        ? `

                            <p class="trabajo-linea">
                                🗓️ ${tarea.campaniaNombre}
                            </p>

                        `

                        : ""
                }


                <p class="trabajo-linea">
                    📅 ${this.formatearFecha(tarea.fecha)}
                </p>


                <p class="trabajo-linea">
                    ⚠️ Prioridad:
                    <strong>
                        ${tarea.prioridad || "Media"}
                    </strong>
                </p>


                ${
                    tarea.maquinariaNombre

                        ? `

                            <p class="trabajo-linea">
                                🚜 ${tarea.maquinariaNombre}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.fechaInicio

                        ? `

                            <p class="trabajo-linea">
                                ▶️ Iniciada:
                                ${this.formatearFechaHora(
                                    tarea.fechaInicio
                                )}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.fechaCompletada

                        ? `

                            <p class="trabajo-linea">
                                ✅ Finalizada:
                                ${this.formatearFechaHora(
                                    tarea.fechaCompletada
                                )}
                            </p>

                        `

                        : ""
                }


                ${
                    tarea.notas

                        ? `

                            <div
                                style="
                                    padding: 12px;
                                    margin-top: 12px;
                                    background: #f6f8f6;
                                    border-radius: 10px;
                                "
                            >
                                ${tarea.notas}
                            </div>

                        `

                        : ""
                }


                <div
                    class="form-actions"
                    style="
                        justify-content: flex-start;
                        flex-wrap: wrap;
                        margin-top: 16px;
                    "
                >

                    ${
                        tipo ===
                        "pendientes"

                            ? `

                                <button
                                    class="primary-button portal-iniciar-tarea"
                                    data-id="${tarea.id}"
                                    type="button"
                                >
                                    ▶️ Iniciar tarea
                                </button>

                            `

                            : ""
                    }


                    ${
                        tipo ===
                        "enCurso"

                            ? `

                                <button
                                    class="primary-button portal-completar-tarea"
                                    data-id="${tarea.id}"
                                    type="button"
                                >
                                    ✅ Completar
                                </button>

                            `

                            : ""
                    }

                </div>

            </div>

        `;

    }


    configurarEventosTareas(
        trabajador
    ) {

        document
            .querySelectorAll(
                ".portal-iniciar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.cambiarEstadoTarea(
                                boton.dataset.id,
                                "En curso",
                                trabajador
                            )
                    );

                }
            );


        document
            .querySelectorAll(
                ".portal-completar-tarea"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () =>
                            this.cambiarEstadoTarea(
                                boton.dataset.id,
                                "Completada",
                                trabajador
                            )
                    );

                }
            );

    }


    cambiarEstadoTarea(
        tareaId,
        estado,
        trabajador,
        repintar = true
    ) {

        const tarea =
            this.trabajoService
                .obtenerPorId(
                    tareaId
                );


        if (
            !tarea
        ) {

            alert(
                "La tarea no existe."
            );

            return false;

        }


        const asignado =
            Array.isArray(
                tarea.trabajadorIds
            )
            &&
            tarea.trabajadorIds
                .some(
                    id =>
                        String(id) ===
                        String(
                            trabajador.id
                        )
                );


        if (
            !asignado
        ) {

            alert(
                "Esta tarea no está asignada a este trabajador."
            );

            return false;

        }


        const resultado =
            this.trabajoService
                .cambiarEstado(
                    tareaId,
                    estado
                );


        if (
            !resultado.ok
        ) {

            alert(
                resultado.mensaje
            );

            return false;

        }


        if (
            repintar
        ) {

            this.mostrarPanel(
                trabajador
            );

        }


        return true;

    }


    crearSeccionFichajes(
        fichajes
    ) {

        return `

            <section
                class="panel"
                style="
                    margin-top: 24px;
                "
            >

                <div class="panel-header">

                    <h3>
                        🕒 Mis fichajes
                    </h3>

                    <p
                        style="
                            margin: 5px 0 0;
                            color: #78837d;
                        "
                    >
                        Consulta tus entradas y salidas y solicita una corrección si detectas una hora incorrecta.
                    </p>

                </div>


                ${
                    fichajes.length ===
                    0

                        ? `

                            <div class="empty-state">

                                <div class="empty-icon">
                                    🕒
                                </div>

                                <h3>
                                    Todavía no tienes fichajes
                                </h3>

                                <p>
                                    Tus entradas y salidas aparecerán aquí.
                                </p>

                            </div>

                        `

                        : fichajes
                            .map(
                                fichaje =>
                                    this.crearTarjetaFichaje(
                                        fichaje
                                    )
                            )
                            .join("")
                }

            </section>

        `;

    }


    crearTarjetaFichaje(
        fichaje
    ) {

        const correccion =
            fichaje.correccion
            ||
            null;


        const estadoCorreccion =
            correccion?.estado
            ||
            "";


        const puedeSolicitar =
            estadoCorreccion !==
            "Pendiente";


        const estiloEstado =
            this.obtenerEstiloCorreccion(
                estadoCorreccion
            );


        return `

            <div
                style="
                    padding: 14px 0;
                    border-bottom: 1px solid #edf0ed;
                "
            >

                <div
                    style="
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 12px;
                        flex-wrap: wrap;
                    "
                >

                    <div
                        style="
                            display: flex;
                            gap: 10px;
                            align-items: flex-start;
                        "
                    >

                        <span>
                            ${
                                fichaje.tipo ===
                                "Entrada"
                                    ? "🟢"
                                    : "🔴"
                            }
                        </span>


                        <div>

                            <strong>
                                ${fichaje.tipo}
                            </strong>

                            <p
                                style="
                                    margin: 4px 0 0;
                                    color: #65736c;
                                "
                            >
                                ${this.formatearFecha(
                                    fichaje.fecha
                                )}
                                ·
                                ${fichaje.hora}
                            </p>

                        </div>

                    </div>


                    ${
                        estadoCorreccion

                            ? `

                                <span
                                    style="
                                        display: inline-flex;
                                        align-items: center;
                                        padding: 5px 9px;
                                        border-radius: 999px;
                                        background: ${estiloEstado.fondo};
                                        color: ${estiloEstado.texto};
                                        font-size: 12px;
                                        font-weight: 700;
                                    "
                                >
                                    Corrección ${estadoCorreccion}
                                </span>

                            `

                            : ""
                    }

                </div>


                ${
                    correccion

                        ? `

                            <div
                                style="
                                    margin-top: 10px;
                                    padding: 11px;
                                    border-radius: 10px;
                                    background: #f7f9f7;
                                "
                            >

                                <p
                                    style="
                                        margin: 0;
                                    "
                                >
                                    <strong>
                                        Hora solicitada:
                                    </strong>
                                    ${correccion.nuevaHora || "—"}
                                </p>


                                <p
                                    style="
                                        margin: 5px 0 0;
                                        color: #65736c;
                                    "
                                >
                                    ${correccion.motivo || "Sin motivo"}
                                </p>


                                ${
                                    estadoCorreccion ===
                                    "Aprobada"

                                        ? `

                                            <p
                                                style="
                                                    margin: 5px 0 0;
                                                    color: #65736c;
                                                    font-size: 12px;
                                                "
                                            >
                                                Hora original:
                                                ${correccion.horaOriginal || "—"}
                                            </p>

                                        `

                                        : ""
                                }

                            </div>

                        `

                        : ""
                }


                ${
                    puedeSolicitar

                        ? `

                            <button
                                type="button"
                                class="secondary-button portal-corregir-fichaje"
                                data-id="${fichaje.id}"
                                style="
                                    margin-top: 10px;
                                "
                            >
                                ✏️ Solicitar corrección
                            </button>

                        `

                        : `

                            <p
                                style="
                                    margin: 10px 0 0;
                                    color: #8a6b00;
                                    font-size: 12px;
                                "
                            >
                                ⏳ Esta solicitud está pendiente de revisión.
                            </p>

                        `
                }

            </div>

        `;

    }


    obtenerEstiloCorreccion(
        estado
    ) {

        if (
            estado ===
            "Aprobada"
        ) {

            return {

                fondo:
                    "#def5e8",

                texto:
                    "#176044"

            };

        }


        if (
            estado ===
            "Rechazada"
        ) {

            return {

                fondo:
                    "#fde8e8",

                texto:
                    "#a42b2b"

            };

        }


        return {

            fondo:
                "#fff4d8",

            texto:
                "#745500"

        };

    }


    configurarEventosFichajes(
        trabajador
    ) {

        document
            .querySelectorAll(
                ".portal-corregir-fichaje"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormularioCorreccion(
                                trabajador,
                                boton.dataset.id
                            );

                        }
                    );

                }
            );

    }


    mostrarFormularioCorreccion(
        trabajador,
        fichajeId
    ) {

        const fichaje =
            this.fichajeService
                .obtenerPorId(
                    fichajeId
                );


        if (
            !fichaje
            ||
            String(
                fichaje.trabajadorId
            ) !==
            String(
                trabajador.id
            )
        ) {

            alert(
                "El fichaje seleccionado no existe o no pertenece a este trabajador."
            );


            this.mostrarPanel(
                trabajador
            );


            return;

        }


        if (
            fichaje.correccion
            &&
            fichaje.correccion.estado ===
            "Pendiente"
        ) {

            alert(
                "Este fichaje ya tiene una solicitud de corrección pendiente."
            );


            this.mostrarPanel(
                trabajador
            );


            return;

        }


        this.mainContent.innerHTML = `

            <button
                id="volverCorreccionFichaje"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        Solicitar corrección
                    </h2>

                    <p>
                        Solicita un cambio de hora para este fichaje.
                    </p>

                </div>

            </header>


            <div class="form-panel">

                <div
                    style="
                        padding: 14px;
                        margin-bottom: 18px;
                        border-radius: 12px;
                        background: #f5f8f6;
                    "
                >

                    <strong>
                        ${fichaje.tipo}
                    </strong>

                    <p
                        style="
                            margin: 6px 0 0;
                        "
                    >
                        ${this.formatearFecha(
                            fichaje.fecha
                        )}
                        ·
                        Hora actual:
                        <strong>
                            ${fichaje.hora}
                        </strong>
                    </p>

                </div>


                <div class="form-group">

                    <label>
                        Nueva hora *
                    </label>

                    <input
                        id="portalNuevaHoraFichaje"
                        type="time"
                        value="${String(
                            fichaje.hora
                            ||
                            ""
                        ).slice(0, 5)}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Motivo de la corrección *
                    </label>

                    <textarea
                        id="portalMotivoCorreccionFichaje"
                        rows="5"
                        placeholder="Ej. Olvidé fichar a la hora correcta..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarCorreccionFichaje"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="enviarCorreccionFichaje"
                        class="primary-button"
                        type="button"
                    >
                        Enviar solicitud
                    </button>

                </div>

            </div>

        `;


        const volver =
            () =>
                this.mostrarPanel(
                    trabajador
                );


        document
            .getElementById(
                "volverCorreccionFichaje"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "cancelarCorreccionFichaje"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "enviarCorreccionFichaje"
            )
            .addEventListener(
                "click",
                () => {

                    const nuevaHora =
                        document
                            .getElementById(
                                "portalNuevaHoraFichaje"
                            )
                            .value;


                    const motivo =
                        document
                            .getElementById(
                                "portalMotivoCorreccionFichaje"
                            )
                            .value;


                    const resultado =
                        this.fichajeService
                            .solicitarCorreccion(
                                trabajador.id,
                                fichaje.id,
                                nuevaHora,
                                motivo
                            );


                    if (
                        !resultado.ok
                    ) {

                        alert(
                            resultado.mensaje
                        );

                        return;

                    }


                    alert(
                        resultado.mensaje
                    );


                    this.mostrarPanel(
                        trabajador
                    );

                }
            );

    }


    crearSeccionIncidencias(
        incidencias
    ) {

        if (
            incidencias.length ===
            0
        ) {

            return "";

        }


        return `

            <section
                class="panel"
                style="
                    margin-top: 24px;
                "
            >

                <div class="panel-header">

                    <h3>
                        ⚠️ Mis incidencias
                    </h3>

                </div>


                ${incidencias.map(
                    incidencia => `

                        <div class="activity">

                            <span>

                                ${
                                    incidencia.estado ===
                                    "Resuelta"
                                        ? "✅"
                                        : "⚠️"
                                }

                            </span>


                            <div
                                style="
                                    flex: 1;
                                "
                            >

                                <strong>
                                    ${incidencia.tipo}
                                </strong>


                                <p>
                                    ${incidencia.descripcion}
                                </p>


                                <p>

                                    ${this.formatearFechaHora(
                                        incidencia.fechaCreacion
                                    )}

                                    ·

                                    ${incidencia.estado}

                                </p>

                            </div>

                        </div>

                    `
                ).join("")}

            </section>

        `;

    }


    mostrarFormularioIncidencia(
        trabajador,
        volverAModoCampo = false
    ) {

        const tareas =
            this.trabajoService
                .obtenerPorTrabajador(
                    trabajador.id
                );


        const fincas =
            this.fincaService
                .obtenerTodas();


        this.mainContent.innerHTML = `

            <button
                id="volverPortalIncidencia"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        Comunicar incidencia
                    </h2>

                    <p>
                        Explica el problema para que administración pueda revisarlo
                    </p>

                </div>

            </header>


            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Tipo *
                    </label>

                    <select id="portalTipoIncidencia">

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

                    <select id="portalPrioridadIncidencia">

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

                    <select id="portalFincaIncidencia">

                        <option value="">
                            Sin finca concreta
                        </option>

                        ${fincas.map(
                            finca => `

                                <option
                                    value="${finca.id}"
                                >
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

                    <select id="portalTrabajoIncidencia">

                        <option value="">
                            Sin tarea relacionada
                        </option>

                        ${tareas.map(
                            tarea => `

                                <option
                                    value="${tarea.id}"
                                >
                                    ${tarea.titulo}
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
                        id="portalDescripcionIncidencia"
                        rows="6"
                        placeholder="Explica qué ha ocurrido..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarPortalIncidencia"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarPortalIncidencia"
                        class="primary-button"
                        type="button"
                    >
                        Comunicar incidencia
                    </button>

                </div>

            </div>

        `;


        const volver =
            () => {

                if (
                    volverAModoCampo
                ) {

                    this.mostrarModoCampo(
                        trabajador
                    );

                }

                else {

                    this.mostrarPanel(
                        trabajador
                    );

                }

            };


        document
            .getElementById(
                "volverPortalIncidencia"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "cancelarPortalIncidencia"
            )
            .addEventListener(
                "click",
                volver
            );


        document
            .getElementById(
                "guardarPortalIncidencia"
            )
            .addEventListener(
                "click",
                () => {

                    const resultado =
                        this.incidenciaService
                            .crear(
                                {

                                    tipo:
                                        document
                                            .getElementById(
                                                "portalTipoIncidencia"
                                            )
                                            .value,

                                    prioridad:
                                        document
                                            .getElementById(
                                                "portalPrioridadIncidencia"
                                            )
                                            .value,

                                    fincaId:
                                        document
                                            .getElementById(
                                                "portalFincaIncidencia"
                                            )
                                            .value
                                        ||
                                        null,

                                    trabajoId:
                                        document
                                            .getElementById(
                                                "portalTrabajoIncidencia"
                                            )
                                            .value
                                        ||
                                        null,

                                    trabajadorId:
                                        trabajador.id,

                                    descripcion:
                                        document
                                            .getElementById(
                                                "portalDescripcionIncidencia"
                                            )
                                            .value,

                                    origen:
                                        "Portal trabajador"

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


                    alert(
                        "Incidencia comunicada correctamente."
                    );


                    volver();

                }
            );

    }


    volverAdministracion() {

        sessionStorage.removeItem(
            this.claveSesion
        );


        sessionStorage.removeItem(
            this.claveModoCampo
        );


        if (
            typeof this.onSalirPortal ===
            "function"
        ) {

            this.onSalirPortal();

        }

    }


    obtenerNombreTrabajador(
        trabajador
    ) {

        return [
            trabajador.nombre,
            trabajador.apellidos
        ]
            .filter(Boolean)
            .join(" ");

    }


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