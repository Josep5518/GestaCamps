import { StorageService } from "./storage.js";

export class CampaniasView {

    constructor(
        mainContent,
        campaniaService,
        fincaService
    ) {

        this.mainContent =
            mainContent;

        this.campaniaService =
            campaniaService;

        this.fincaService =
            fincaService;

    }


    // =====================================================
    // PRINCIPAL
    // =====================================================

    mostrar() {

        const campanias =
            this.campaniaService
                .obtenerTodas();


        const activas =
            this.campaniaService
                .obtenerActivas()
                .length;


        const cerradas =
            this.campaniaService
                .obtenerCerradas()
                .length;


        const fincasConCampania =
            new Set(
                campanias.map(
                    campania =>
                        campania.fincaId
                )
            ).size;


        this.mainContent.innerHTML = `

            <header class="topbar">

                <div>

                    <h2>
                        Campanya
                    </h2>

                    <p>
                        Organiza y analiza toda la actividad de cada campanya agrícola
                    </p>

                </div>


                <button
                    id="nuevaCampania"
                    class="primary-button"
                    type="button"
                >
                    + Nueva campanya
                </button>

            </header>


            <section class="stats">

                ${this.crearTarjeta(
                    "📅",
                    "Campanyas",
                    campanias.length
                )}

                ${this.crearTarjeta(
                    "✅",
                    "Activas",
                    activas
                )}

                ${this.crearTarjeta(
                    "🔒",
                    "Cerradas",
                    cerradas
                )}

                ${this.crearTarjeta(
                    "🌾",
                    "Fincas con campanya",
                    fincasConCampania
                )}

            </section>


            <div id="listaCampanias"></div>

        `;


        document
            .getElementById(
                "nuevaCampania"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrarFormulario();

                }
            );


        this.mostrarLista();

    }


    crearTarjeta(
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
    // LISTA
    // =====================================================

    mostrarLista() {

        const campanias =
            this.campaniaService
                .obtenerTodas()
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            b.fechaInicio
                        )
                        -
                        new Date(
                            a.fechaInicio
                        )
                );


        const contenedor =
            document.getElementById(
                "listaCampanias"
            );


        if (
            !contenedor
        ) {

            return;

        }


        if (
            campanias.length ===
            0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📅
                    </div>

                    <h3>
                        Todavía no tienes campanyas
                    </h3>

                    <p>
                        Crea tu primera campanya agrícola para comenzar a organizar la explotación.
                    </p>

                </div>

            `;

            return;

        }


        contenedor.innerHTML = `

            <div class="campanias-grid">

                ${campanias
                    .map(
                        campania => {

                            const resumen =
                                this.obtenerResumenCampania(
                                    campania
                                );


                            return `

                                <div class="campania-card">

                                    <div class="campania-card-header">

                                        <span class="campania-icon">
                                            📅
                                        </span>


                                        <div class="campania-actions">

                                            <button
                                                class="
                                                    secondary-button
                                                    editar-campania
                                                "
                                                data-id="${campania.id}"
                                                type="button"
                                            >
                                                Editar
                                            </button>


                                            <button
                                                class="
                                                    delete-button
                                                    eliminar-campania
                                                "
                                                data-id="${campania.id}"
                                                type="button"
                                            >
                                                ×
                                            </button>

                                        </div>

                                    </div>


                                    <h3>
                                        ${this.escapar(
                                            campania.nombre
                                        )}
                                    </h3>


                                    <p class="campania-finca">

                                        🌾
                                        ${this.escapar(
                                            campania.fincaNombre
                                        )}

                                    </p>


                                    <div class="campania-info-grid">

                                        <div>

                                            <span>
                                                Inicio
                                            </span>

                                            <strong>
                                                ${this.formatearFecha(
                                                    campania.fechaInicio
                                                )}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Fin
                                            </span>

                                            <strong>
                                                ${
                                                    campania.fechaFin

                                                        ? this.formatearFecha(
                                                            campania.fechaFin
                                                        )

                                                        : "Sin definir"
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            display:grid;
                                            grid-template-columns:
                                                repeat(3,minmax(0,1fr));
                                            gap:8px;
                                            margin-top:12px;
                                        "
                                    >

                                        ${this.crearMiniDato(
                                            "Producción",
                                            `${this.formatearNumero(
                                                resumen.producido
                                            )} kg`
                                        )}

                                        ${this.crearMiniDato(
                                            "Ingresos",
                                            this.formatearDinero(
                                                resumen.ingresos
                                            )
                                        )}

                                        ${this.crearMiniDato(
                                            "Beneficio",
                                            this.formatearDinero(
                                                resumen.beneficio
                                            )
                                        )}

                                    </div>


                                    <div class="campania-bottom">

                                        <span
                                            class="
                                                campania-status
                                                ${
                                                    campania.estado ===
                                                    "Activa"

                                                        ? "campania-activa"

                                                        : "campania-cerrada"
                                                }
                                            "
                                        >
                                            ${this.escapar(
                                                campania.estado
                                            )}
                                        </span>


                                        <div
                                            style="
                                                display:flex;
                                                gap:8px;
                                                flex-wrap:wrap;
                                            "
                                        >

                                            <button
                                                class="
                                                    primary-button
                                                    ver-campania
                                                "
                                                data-id="${campania.id}"
                                                type="button"
                                            >
                                                Ver campanya
                                            </button>


                                            ${
                                                campania.estado ===
                                                "Activa"

                                                    ? `
                                                        <button
                                                            class="
                                                                task-state-button
                                                                cerrar-campania
                                                            "
                                                            data-id="${campania.id}"
                                                            type="button"
                                                        >
                                                            Cerrar
                                                        </button>
                                                    `

                                                    : `
                                                        <button
                                                            class="
                                                                task-state-button
                                                                reabrir-campania
                                                            "
                                                            data-id="${campania.id}"
                                                            type="button"
                                                        >
                                                            Reabrir
                                                        </button>
                                                    `
                                            }

                                        </div>

                                    </div>


                                    ${
                                        campania.notas

                                            ? `
                                                <p class="campania-notas">
                                                    ${this.escapar(
                                                        campania.notas
                                                    )}
                                                </p>
                                            `

                                            : ""
                                    }

                                </div>

                            `;

                        }
                    )
                    .join("")}

            </div>

        `;


        this.configurarEventos();

    }


    crearMiniDato(
        titulo,
        valor,
        fondo = "#f5f7f5"
    ) {

        return `

            <div
                style="
                    background:${fondo};
                    padding:10px;
                    border-radius:9px;
                "
            >

                <span
                    style="
                        display:block;
                        font-size:10px;
                        color:#78837d;
                    "
                >
                    ${titulo}
                </span>

                <strong
                    style="
                        display:block;
                        margin-top:3px;
                    "
                >
                    ${valor}
                </strong>

            </div>

        `;

    }


    // =====================================================
    // EVENTOS LISTA
    // =====================================================

    configurarEventos() {

        document
            .querySelectorAll(
                ".ver-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.mostrarDetalle(
                                Number(
                                    button.dataset.id
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".editar-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.mostrarFormulario(
                                Number(
                                    button.dataset.id
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".cerrar-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const resultado =
                                this.campaniaService
                                    .cambiarEstado(
                                        Number(
                                            button.dataset.id
                                        ),
                                        "Cerrada"
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


        document
            .querySelectorAll(
                ".reabrir-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const resultado =
                                this.campaniaService
                                    .cambiarEstado(
                                        Number(
                                            button.dataset.id
                                        ),
                                        "Activa"
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


        document
            .querySelectorAll(
                ".eliminar-campania"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                Number(
                                    button.dataset.id
                                );


                            const campania =
                                this.campaniaService
                                    .obtenerPorId(
                                        id
                                    );


                            if (
                                !campania
                            ) {

                                return;

                            }


                            if (
                                !confirm(
                                    `¿Quieres eliminar la campanya "${campania.nombre}"?`
                                )
                            ) {

                                return;

                            }


                            const resultado =
                                this.campaniaService
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
    // DETALLE CAMPANYA
    // =====================================================

    mostrarDetalle(
        id
    ) {

        const campania =
            this.campaniaService
                .obtenerPorId(
                    id
                );


        if (
            !campania
        ) {

            return;

        }


        const resumen =
            this.obtenerResumenCampania(
                campania
            );


        this.mainContent.innerHTML = `

            <button
                id="volverDetalleCampania"
                class="back-button"
                type="button"
            >
                ← Volver
            </button>


            <header class="topbar">

                <div>

                    <h2>
                        ${this.escapar(
                            campania.nombre
                        )}
                    </h2>

                    <p>
                        🌾
                        ${this.escapar(
                            campania.fincaNombre
                        )}
                        ·
                        ${this.formatearFecha(
                            campania.fechaInicio
                        )}
                        ${
                            campania.fechaFin

                                ? ` → ${this.formatearFecha(
                                    campania.fechaFin
                                )}`

                                : ""
                        }
                    </p>

                </div>


                <span
                    class="
                        campania-status
                        ${
                            campania.estado ===
                            "Activa"

                                ? "campania-activa"

                                : "campania-cerrada"
                        }
                    "
                >
                    ${this.escapar(
                        campania.estado
                    )}
                </span>

            </header>


            <!-- PRODUCCIÓN -->

            <div
                style="
                    margin-top:14px;
                    margin-bottom:10px;
                "
            >

                <h3>
                    Producción
                </h3>

                <p
                    style="
                        color:#78837d;
                        font-size:13px;
                        margin:3px 0 0;
                    "
                >
                    Situación de la producción asociada a esta campanya
                </p>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "🍎",
                    "Producido",
                    `${this.formatearNumero(
                        resumen.producido
                    )} kg`
                )}

                ${this.crearTarjeta(
                    "🕒",
                    "Reservado",
                    `${this.formatearNumero(
                        resumen.reservado
                    )} kg`
                )}

                ${this.crearTarjeta(
                    "🚚",
                    "Entregado",
                    `${this.formatearNumero(
                        resumen.entregado
                    )} kg`
                )}

                ${this.crearTarjeta(
                    "📦",
                    "Disponible",
                    `${this.formatearNumero(
                        resumen.disponible
                    )} kg`
                )}

            </section>


            <!-- ECONOMÍA -->

            <div
                style="
                    margin-top:22px;
                    margin-bottom:10px;
                "
            >

                <h3>
                    Rentabilidad
                </h3>

                <p
                    style="
                        color:#78837d;
                        font-size:13px;
                        margin:3px 0 0;
                    "
                >
                    Resultado económico de la campanya
                </p>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "💰",
                    "Ingresos sin IVA",
                    this.formatearDinero(
                        resumen.ingresos
                    )
                )}

                ${this.crearTarjeta(
                    "💸",
                    "Gastos",
                    this.formatearDinero(
                        resumen.gastos
                    )
                )}

                ${this.crearTarjeta(
                    "📈",
                    "Beneficio",
                    this.formatearDinero(
                        resumen.beneficio
                    )
                )}

                ${this.crearTarjeta(
                    "📊",
                    "Margen",
                    `${this.formatearNumero(
                        resumen.margen
                    )} %`
                )}

            </section>


            <!-- ACTIVIDAD -->

            <div
                style="
                    margin-top:22px;
                    margin-bottom:10px;
                "
            >

                <h3>
                    Actividad de la campanya
                </h3>

            </div>


            <section class="stats">

                ${this.crearTarjeta(
                    "🌱",
                    "Cultivos",
                    resumen.cultivos.length
                )}

                ${this.crearTarjeta(
                    "🚜",
                    "Trabajos",
                    resumen.trabajos.length
                )}

                ${this.crearTarjeta(
                    "📄",
                    "Albaranes",
                    resumen.albaranes.length
                )}

                ${this.crearTarjeta(
                    "💶",
                    "Facturas",
                    resumen.facturas.length
                )}

            </section>


            <!-- DETALLE -->

            <section
                class="dashboard-grid"
                style="
                    margin-top:22px;
                "
            >

                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            🌱 Cultivos
                        </h3>

                    </div>


                    ${this.crearListaCultivos(
                        resumen.cultivos
                    )}

                </div>


                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            🚜 Trabajos
                        </h3>

                    </div>


                    ${this.crearListaTrabajos(
                        resumen.trabajos
                    )}

                </div>


                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            📄 Albaranes
                        </h3>

                    </div>


                    ${this.crearListaAlbaranes(
                        resumen.albaranes
                    )}

                </div>


                <div class="panel">

                    <div class="panel-header">

                        <h3>
                            💶 Facturas
                        </h3>

                    </div>


                    ${this.crearListaFacturas(
                        resumen.facturas
                    )}

                </div>

            </section>


            ${
                campania.notas

                    ? `
                        <section
                            class="panel"
                            style="
                                margin-top:20px;
                            "
                        >

                            <div class="panel-header">

                                <h3>
                                    Notas
                                </h3>

                            </div>

                            <p>
                                ${this.escapar(
                                    campania.notas
                                )}
                            </p>

                        </section>
                    `

                    : ""
            }

        `;


        document
            .getElementById(
                "volverDetalleCampania"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );

    }


    // =====================================================
    // RESUMEN CAMPANYA
    // =====================================================

    obtenerResumenCampania(
        campania
    ) {

        const cultivos =
            this.obtenerStorage(
                "obtenerCultivos"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const produccion =
            this.obtenerStorage(
                "obtenerProduccion"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const trabajos =
            this.obtenerStorage(
                "obtenerTrabajos"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const gastos =
            this.obtenerStorage(
                "obtenerGastos"
            )
                .filter(
                    registro =>
                        this.perteneceCampania(
                            registro,
                            campania
                        )
                );


        const todosAlbaranes =
            this.obtenerStorage(
                "obtenerAlbaranes"
            );


        const facturas =
            this.obtenerStorage(
                "obtenerFacturas"
            );


        const producido =
            produccion.reduce(
                (
                    total,
                    registro
                ) =>
                    total
                    +
                    Number(
                        registro.cantidad
                        ||
                        0
                    ),
                0
            );


        let reservado =
            0;


        let entregado =
            0;


        const albaranesCampania =
            [];


        todosAlbaranes.forEach(
            albaran => {

                const lineas =
                    this.obtenerLineasAlbaran(
                        albaran
                    );


                const lineasCampania =
                    lineas.filter(
                        linea =>
                            this.perteneceCampania(
                                linea,
                                campania
                            )
                    );


                if (
                    lineasCampania.length ===
                    0
                ) {

                    return;

                }


                albaranesCampania.push(
                    albaran
                );


                lineasCampania.forEach(
                    linea => {

                        if (
                            String(
                                linea.unidad
                                ||
                                "kg"
                            )
                            !==
                            "kg"
                        ) {

                            return;

                        }


                        if (
                            albaran.estado ===
                            "Pendiente"
                        ) {

                            reservado +=
                                Number(
                                    linea.cantidad
                                    ||
                                    0
                                );

                        }


                        if (
                            albaran.estado ===
                            "Entregado"
                            ||
                            albaran.estado ===
                            "Facturado"
                            ||
                            albaran.facturado ===
                            true
                        ) {

                            entregado +=
                                Number(
                                    linea.cantidad
                                    ||
                                    0
                                );

                        }

                    }
                );

            }
        );


        const disponible =
            Math.max(
                0,
                producido
                -
                reservado
                -
                entregado
            );


        const gastosTotal =
            gastos.reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    Number(
                        gasto.importe
                        ||
                        0
                    ),
                0
            );


        let ingresos =
            0;


        const idsAlbaranesCampania =
            new Set(
                albaranesCampania.map(
                    albaran =>
                        Number(
                            albaran.id
                        )
                )
            );


        const facturasCampania =
            facturas.filter(
                factura => {

                    if (
                        factura.estado ===
                        "Anulada"
                    ) {

                        return false;

                    }


                    const ids =
                        Array.isArray(
                            factura.albaranesIds
                        )

                            ? factura.albaranesIds

                            : [];


                    return ids.some(
                        id =>
                            idsAlbaranesCampania
                                .has(
                                    Number(
                                        id
                                    )
                                )
                    );

                }
            );


        facturasCampania.forEach(
            factura => {

                const ids =
                    Array.isArray(
                        factura.albaranesIds
                    )

                        ? factura.albaranesIds

                        : [];


                const albaranesFactura =
                    ids
                        .map(
                            id =>
                                todosAlbaranes.find(
                                    albaran =>
                                        Number(
                                            albaran.id
                                        )
                                        ===
                                        Number(
                                            id
                                        )
                                )
                        )
                        .filter(Boolean);


                const totalAlbaranes =
                    albaranesFactura.reduce(
                        (
                            total,
                            albaran
                        ) =>
                            total
                            +
                            Number(
                                albaran.total
                                ||
                                0
                            ),
                        0
                    );


                if (
                    totalAlbaranes <=
                    0
                ) {

                    return;

                }


                const base =
                    Number(
                        factura.baseImponible
                        ??
                        factura.subtotal
                        ??
                        factura.base
                        ??
                        0
                    );


                albaranesFactura.forEach(
                    albaran => {

                        const lineas =
                            this.obtenerLineasAlbaran(
                                albaran
                            );


                        const totalLineas =
                            lineas.reduce(
                                (
                                    total,
                                    linea
                                ) =>
                                    total
                                    +
                                    this.obtenerImporteLinea(
                                        linea
                                    ),
                                0
                            );


                        if (
                            totalLineas <=
                            0
                        ) {

                            return;

                        }


                        const baseAlbaran =
                            base
                            *
                            (
                                Number(
                                    albaran.total
                                    ||
                                    0
                                )
                                /
                                totalAlbaranes
                            );


                        lineas.forEach(
                            linea => {

                                if (
                                    !this.perteneceCampania(
                                        linea,
                                        campania
                                    )
                                ) {

                                    return;

                                }


                                ingresos +=
                                    baseAlbaran
                                    *
                                    (
                                        this.obtenerImporteLinea(
                                            linea
                                        )
                                        /
                                        totalLineas
                                    );

                            }
                        );

                    }
                );

            }
        );


        const beneficio =
            ingresos
            -
            gastosTotal;


        const margen =
            ingresos >
            0

                ? (
                    beneficio
                    /
                    ingresos
                )
                *
                100

                : 0;


        return {

            cultivos:
                cultivos,

            produccion:
                produccion,

            trabajos:
                trabajos,

            gastosLista:
                gastos,

            albaranes:
                albaranesCampania,

            facturas:
                facturasCampania,

            producido:
                producido,

            reservado:
                reservado,

            entregado:
                entregado,

            disponible:
                disponible,

            ingresos:
                ingresos,

            gastos:
                gastosTotal,

            beneficio:
                beneficio,

            margen:
                margen

        };

    }


    // =====================================================
    // LISTAS DETALLE
    // =====================================================

    crearListaCultivos(
        cultivos
    ) {

        if (
            cultivos.length ===
            0
        ) {

            return `
                <p class="text-muted">
                    No hay cultivos en esta campanya.
                </p>
            `;

        }


        return cultivos
            .map(
                cultivo => `

                    <div class="task">

                        <div>

                            <strong>
                                ${this.escapar(
                                    [
                                        cultivo.tipo,
                                        cultivo.variedad
                                    ]
                                        .filter(Boolean)
                                        .join(
                                            " · "
                                        )
                                )}
                            </strong>

                            <p>
                                ${this.escapar(
                                    cultivo.parcela
                                    ||
                                    cultivo.fincaNombre
                                    ||
                                    ""
                                )}
                            </p>

                        </div>

                    </div>

                `
            )
            .join("");

    }


    crearListaTrabajos(
        trabajos
    ) {

        if (
            trabajos.length ===
            0
        ) {

            return `
                <p class="text-muted">
                    No hay trabajos en esta campanya.
                </p>
            `;

        }


        return trabajos
            .map(
                trabajo => `

                    <div class="task">

                        <div>

                            <strong>
                                ${this.escapar(
                                    trabajo.titulo
                                    ||
                                    trabajo.nombre
                                    ||
                                    "Trabajo"
                                )}
                            </strong>

                            <p>
                                ${this.escapar(
                                    trabajo.estado
                                    ||
                                    "Pendiente"
                                )}
                            </p>

                        </div>

                    </div>

                `
            )
            .join("");

    }


    crearListaAlbaranes(
        albaranes
    ) {

        if (
            albaranes.length ===
            0
        ) {

            return `
                <p class="text-muted">
                    No hay albaranes relacionados.
                </p>
            `;

        }


        return albaranes
            .map(
                albaran => `

                    <div class="task">

                        <div>

                            <strong>
                                ${this.escapar(
                                    albaran.numero
                                )}
                            </strong>

                            <p>
                                ${this.escapar(
                                    albaran.clienteNombre
                                    ||
                                    albaran.cliente
                                    ||
                                    "Sin cliente"
                                )}
                                ·
                                ${this.escapar(
                                    albaran.estado
                                )}
                            </p>

                        </div>


                        <strong>
                            ${this.formatearDinero(
                                albaran.total
                            )}
                        </strong>

                    </div>

                `
            )
            .join("");

    }


    crearListaFacturas(
        facturas
    ) {

        if (
            facturas.length ===
            0
        ) {

            return `
                <p class="text-muted">
                    No hay facturas activas relacionadas.
                </p>
            `;

        }


        return facturas
            .map(
                factura => `

                    <div class="task">

                        <div>

                            <strong>
                                ${this.escapar(
                                    factura.numero
                                )}
                            </strong>

                            <p>
                                ${this.escapar(
                                    factura.estado
                                    ||
                                    "Pendiente"
                                )}
                            </p>

                        </div>


                        <strong>
                            ${this.formatearDinero(
                                factura.total
                            )}
                        </strong>

                    </div>

                `
            )
            .join("");

    }


    // =====================================================
    // PERTENECE CAMPANYA
    // =====================================================

    perteneceCampania(
        registro,
        campania
    ) {

        if (
            !registro
            ||
            !campania
        ) {

            return false;

        }


        if (
            registro.campaniaId !==
            undefined
            &&
            registro.campaniaId !==
            null
            &&
            registro.campaniaId !==
            ""
        ) {

            return (
                Number(
                    registro.campaniaId
                )
                ===
                Number(
                    campania.id
                )
            );

        }


        if (
            registro.campaniaNombre
            &&
            String(
                registro.campaniaNombre
            )
            ===
            String(
                campania.nombre
            )
        ) {

            return true;

        }


        return false;

    }


    // =====================================================
    // ALBARÁN
    // =====================================================

    obtenerLineasAlbaran(
        albaran
    ) {

        if (
            Array.isArray(
                albaran?.lineas
            )
            &&
            albaran.lineas.length >
            0
        ) {

            return albaran.lineas;

        }


        if (
            albaran
        ) {

            return [
                albaran
            ];

        }


        return [];

    }


    obtenerImporteLinea(
        linea
    ) {

        if (
            linea.total !==
            undefined
        ) {

            return Number(
                linea.total
                ||
                0
            );

        }


        return (
            Number(
                linea.cantidad
                ||
                0
            )
            *
            Number(
                linea.precio
                ||
                0
            )
        );

    }


    // =====================================================
    // STORAGE
    // =====================================================

    obtenerStorage(
        metodo
    ) {

        try {

            if (
                typeof
                StorageService[
                    metodo
                ]
                !==
                "function"
            ) {

                return [];

            }


            const datos =
                StorageService[
                    metodo
                ]();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch {

            return [];

        }

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


        const campania =
            editando

                ? this.campaniaService
                    .obtenerPorId(
                        id
                    )

                : null;


        const fincas =
            this.obtenerFincas();


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
                id="volverCampanias"
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
                                ? "Editar campanya"
                                : "Nueva campanya"
                        }
                    </h2>

                    <p>
                        ${
                            editando
                                ? "Modifica los datos de la campanya agrícola"
                                : "Crea una nueva campanya para tu explotación"
                        }
                    </p>

                </div>

            </header>


            <div class="form-panel">

                <div class="form-group">

                    <label>
                        Nombre de la campanya *
                    </label>

                    <input
                        id="nombreCampania"
                        type="text"
                        placeholder="Ej. Campanya 2027"
                        value="${this.escapar(
                            campania?.nombre
                            ||
                            ""
                        )}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Finca *
                    </label>

                    <select id="fincaCampania">

                        ${fincas
                            .map(
                                finca => `

                                    <option
                                        value="${finca.id}"

                                        ${
                                            Number(
                                                campania?.fincaId
                                            )
                                            ===
                                            Number(
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
                            .join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Fecha de inicio *
                    </label>

                    <input
                        id="inicioCampania"
                        type="date"
                        value="${
                            campania?.fechaInicio
                            ||
                            this.obtenerFechaHoy()
                        }"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Fecha de fin
                    </label>

                    <input
                        id="finCampania"
                        type="date"
                        value="${
                            campania?.fechaFin
                            ||
                            ""
                        }"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Estado
                    </label>

                    <select id="estadoCampania">

                        <option
                            value="Activa"
                            ${
                                !campania
                                ||
                                campania.estado ===
                                "Activa"

                                    ? "selected"

                                    : ""
                            }
                        >
                            Activa
                        </option>


                        <option
                            value="Cerrada"
                            ${
                                campania?.estado ===
                                "Cerrada"

                                    ? "selected"

                                    : ""
                            }
                        >
                            Cerrada
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Notas
                    </label>

                    <textarea
                        id="notasCampania"
                        rows="5"
                        placeholder="Observaciones de la campanya..."
                    >${this.escapar(
                        campania?.notas
                        ||
                        ""
                    )}</textarea>

                </div>


                <div class="form-actions">

                    <button
                        id="cancelarCampania"
                        class="secondary-button"
                        type="button"
                    >
                        Cancelar
                    </button>


                    <button
                        id="guardarCampania"
                        class="primary-button"
                        type="button"
                    >
                        ${
                            editando
                                ? "Guardar cambios"
                                : "Crear campanya"
                        }
                    </button>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverCampanias"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "cancelarCampania"
            )
            .addEventListener(
                "click",
                () => {

                    this.mostrar();

                }
            );


        document
            .getElementById(
                "guardarCampania"
            )
            .addEventListener(
                "click",
                () => {

                    const datos = {

                        nombre:
                            document
                                .getElementById(
                                    "nombreCampania"
                                )
                                .value,

                        fincaId:
                            Number(
                                document
                                    .getElementById(
                                        "fincaCampania"
                                    )
                                    .value
                            ),

                        fechaInicio:
                            document
                                .getElementById(
                                    "inicioCampania"
                                )
                                .value,

                        fechaFin:
                            document
                                .getElementById(
                                    "finCampania"
                                )
                                .value,

                        estado:
                            document
                                .getElementById(
                                    "estadoCampania"
                                )
                                .value,

                        notas:
                            document
                                .getElementById(
                                    "notasCampania"
                                )
                                .value

                    };


                    const resultado =
                        editando

                            ? this.campaniaService
                                .editar(
                                    id,
                                    datos
                                )

                            : this.campaniaService
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
    // FINCAS
    // =====================================================

    obtenerFincas() {

        if (
            typeof
            this.fincaService
                .obtenerTodas ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerTodas()
                ||
                []
            );

        }


        if (
            typeof
            this.fincaService
                .obtenerTodos ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerTodos()
                ||
                []
            );

        }


        return [];

    }


    // =====================================================
    // FECHA
    // =====================================================

    obtenerFechaHoy() {

        const fecha =
            new Date();


        const year =
            fecha.getFullYear();


        const month =
            String(
                fecha.getMonth() +
                1
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


        return (
            `${year}-${month}-${day}`
        );

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
    // FORMATOS
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


    formatearDinero(
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
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )
            +
            " €";

    }


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