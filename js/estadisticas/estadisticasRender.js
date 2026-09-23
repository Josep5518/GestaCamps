import {
    escaparHTML,
    formatearNumero,
    formatearDinero
} from "../utils.js";


// =====================================================
// PORCENTAJE
// =====================================================

function formatearPorcentaje(
    numero
) {

    return (
        Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                }
            )
        +
        " %"
    );

}


// =====================================================
// FORMATEAR VALOR DE GRÁFICO
// =====================================================

function formatearValorGrafico(
    valor,
    tipo
) {

    if (
        tipo ===
        "kg"
    ) {

        return `${formatearNumero(
            valor
        )} kg`;

    }


    return formatearDinero(
        valor
    );

}


// =====================================================
// TARJETA
// =====================================================

export function crearTarjetaEstadistica(
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
                    ${escaparHTML(
                        titulo
                    )}
                </p>

                <h3>
                    ${valor}
                </h3>

            </div>

        </div>

    `;

}


// =====================================================
// TARJETA MINI
// =====================================================

export function crearTarjetaMiniEstadistica(
    icono,
    titulo,
    valor
) {

    return crearTarjetaEstadistica(
        icono,
        titulo,
        valor
    );

}


// =====================================================
// BARRAS HORIZONTALES
// =====================================================

export function crearBarrasEstadistica(
    datos,
    propiedadNombre,
    propiedadValor,
    tipo
) {

    if (
        !Array.isArray(
            datos
        )
        ||
        datos.length ===
        0
    ) {

        return crearEstadoVacioGrafico();

    }


    const maximo =
        Math.max(
            ...datos.map(
                item =>
                    Math.abs(
                        Number(
                            item[
                                propiedadValor
                            ]
                            ||
                            0
                        )
                    )
            ),
            1
        );


    return `

        <div class="gc-chart-bars">

            ${datos
                .map(
                    item => {

                        const valor =
                            Number(
                                item[
                                    propiedadValor
                                ]
                                ||
                                0
                            );


                        const porcentaje =
                            Math.max(
                                2,
                                (
                                    Math.abs(
                                        valor
                                    )
                                    /
                                    maximo
                                )
                                *
                                100
                            );


                        return `

                            <div class="estadistica-barra-item">

                                <div class="estadistica-barra-cabecera">

                                    <strong>

                                        ${escaparHTML(
                                            item[
                                                propiedadNombre
                                            ]
                                        )}

                                    </strong>


                                    <span>

                                        ${formatearValorGrafico(
                                            valor,
                                            tipo
                                        )}

                                    </span>

                                </div>


                                <div class="estadistica-barra-fondo">

                                    <div
                                        class="estadistica-barra"
                                        style="
                                            width:${porcentaje}%;
                                        "
                                    ></div>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("")}

        </div>

    `;

}


// =====================================================
// GRÁFICO DE COLUMNAS
// =====================================================

export function crearGraficoColumnasEstadistica(
    datos,
    propiedadNombre,
    propiedadValor,
    tipo
) {

    if (
        !Array.isArray(
            datos
        )
        ||
        datos.length ===
        0
    ) {

        return crearEstadoVacioGrafico();

    }


    const maximo =
        Math.max(
            ...datos.map(
                item =>
                    Math.abs(
                        Number(
                            item[
                                propiedadValor
                            ]
                            ||
                            0
                        )
                    )
            ),
            1
        );


    return `

        <div class="gc-column-chart">

            <div class="gc-column-chart-grid">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>


            <div class="gc-column-chart-columns">

                ${datos
                    .map(
                        item => {

                            const valor =
                                Number(
                                    item[
                                        propiedadValor
                                    ]
                                    ||
                                    0
                                );


                            const altura =
                                Math.max(
                                    4,
                                    (
                                        Math.abs(
                                            valor
                                        )
                                        /
                                        maximo
                                    )
                                    *
                                    100
                                );


                            return `

                                <div class="gc-column-item">

                                    <div class="gc-column-value">

                                        ${formatearValorGrafico(
                                            valor,
                                            tipo
                                        )}

                                    </div>


                                    <div class="gc-column-track">

                                        <div
                                            class="gc-column-bar"
                                            style="
                                                height:${altura}%;
                                            "
                                        ></div>

                                    </div>


                                    <div
                                        class="gc-column-label"
                                        title="${escaparHTML(
                                            item[
                                                propiedadNombre
                                            ]
                                        )}"
                                    >

                                        ${escaparHTML(
                                            item[
                                                propiedadNombre
                                            ]
                                        )}

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("")}

            </div>

        </div>

    `;

}


// =====================================================
// GRÁFICO DONUT
// =====================================================

export function crearGraficoDonutEstadistica(
    datos,
    propiedadNombre,
    propiedadValor,
    tipo
) {

    if (
        !Array.isArray(
            datos
        )
        ||
        datos.length ===
        0
    ) {

        return crearEstadoVacioGrafico();

    }


    const datosValidos =
        datos
            .map(
                item => ({

                    nombre:
                        String(
                            item[
                                propiedadNombre
                            ]
                            ??
                            "Sin nombre"
                        ),

                    valor:
                        Math.max(
                            0,
                            Number(
                                item[
                                    propiedadValor
                                ]
                                ||
                                0
                            )
                        )

                })
            )
            .filter(
                item =>
                    item.valor >
                    0
            );


    if (
        datosValidos.length ===
        0
    ) {

        return crearEstadoVacioGrafico();

    }


    const total =
        datosValidos.reduce(
            (
                suma,
                item
            ) =>
                suma
                +
                item.valor,
            0
        );


    let acumulado =
        0;


    const segmentos =
        datosValidos
            .map(
                (
                    item,
                    indice
                ) => {

                    const inicio =
                        (
                            acumulado
                            /
                            total
                        )
                        *
                        100;


                    acumulado +=
                        item.valor;


                    const fin =
                        (
                            acumulado
                            /
                            total
                        )
                        *
                        100;


                    const tono =
                        obtenerColorGrafico(
                            indice
                        );


                    return `${tono} ${inicio}% ${fin}%`;

                }
            )
            .join(", ");


    return `

        <div class="gc-donut-layout">

            <div class="gc-donut-wrapper">

                <div
                    class="gc-donut"
                    style="
                        background:
                            conic-gradient(
                                ${segmentos}
                            );
                    "
                >

                    <div class="gc-donut-center">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${formatearValorGrafico(
                                total,
                                tipo
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="gc-donut-legend">

                ${datosValidos
                    .map(
                        (
                            item,
                            indice
                        ) => {

                            const porcentaje =
                                total >
                                0

                                    ? (
                                        item.valor
                                        /
                                        total
                                    )
                                    *
                                    100

                                    : 0;


                            return `

                                <div class="gc-donut-legend-item">

                                    <span
                                        class="gc-donut-dot"
                                        style="
                                            background:
                                                ${obtenerColorGrafico(
                                                    indice
                                                )};
                                        "
                                    ></span>


                                    <div>

                                        <strong>

                                            ${escaparHTML(
                                                item.nombre
                                            )}

                                        </strong>

                                        <small>

                                            ${formatearValorGrafico(
                                                item.valor,
                                                tipo
                                            )}

                                            ·

                                            ${formatearPorcentaje(
                                                porcentaje
                                            )}

                                        </small>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("")}

            </div>

        </div>

    `;

}


// =====================================================
// COMPARACIÓN DE DOS VALORES
// =====================================================

export function crearGraficoComparacionEstadistica({
    tituloA,
    valorA,
    tituloB,
    valorB,
    tipo = "dinero"
}) {

    const numeroA =
        Number(
            valorA
            ||
            0
        );


    const numeroB =
        Number(
            valorB
            ||
            0
        );


    const maximo =
        Math.max(
            Math.abs(
                numeroA
            ),
            Math.abs(
                numeroB
            ),
            1
        );


    const porcentajeA =
        Math.max(
            2,
            (
                Math.abs(
                    numeroA
                )
                /
                maximo
            )
            *
            100
        );


    const porcentajeB =
        Math.max(
            2,
            (
                Math.abs(
                    numeroB
                )
                /
                maximo
            )
            *
            100
        );


    return `

        <div class="gc-comparison-chart">

            ${crearFilaComparacion(
                tituloA,
                numeroA,
                porcentajeA,
                tipo,
                "principal"
            )}

            ${crearFilaComparacion(
                tituloB,
                numeroB,
                porcentajeB,
                tipo,
                "secundario"
            )}

        </div>

    `;

}


// =====================================================
// FILA COMPARACIÓN
// =====================================================

function crearFilaComparacion(
    titulo,
    valor,
    porcentaje,
    tipo,
    clase
) {

    return `

        <div class="gc-comparison-item">

            <div class="gc-comparison-header">

                <span>
                    ${escaparHTML(
                        titulo
                    )}
                </span>

                <strong>
                    ${formatearValorGrafico(
                        valor,
                        tipo
                    )}
                </strong>

            </div>


            <div class="gc-comparison-track">

                <div
                    class="
                        gc-comparison-bar
                        gc-comparison-${clase}
                    "
                    style="
                        width:${porcentaje}%;
                    "
                ></div>

            </div>

        </div>

    `;

}


// =====================================================
// ESTADO VACÍO GRÁFICO
// =====================================================

function crearEstadoVacioGrafico() {

    return `

        <div class="gc-chart-empty">

            <span>
                📊
            </span>

            <p>
                Todavía no hay datos suficientes.
            </p>

        </div>

    `;

}


// =====================================================
// COLORES DEL DONUT
// =====================================================

function obtenerColorGrafico(
    indice
) {

    const colores = [

        "#1f7a55",
        "#55a874",
        "#94bd62",
        "#d2b452",
        "#ca7854",
        "#8562a8",
        "#4d8f9b",
        "#93a1a1"

    ];


    return colores[
        indice
        %
        colores.length
    ];

}


// =====================================================
// FILA RESUMEN
// =====================================================

export function crearFilaResumenEstadistica(
    titulo,
    valor,
    destacado = false
) {

    return `

        <div
            class="
                estadistica-resumen-fila
                ${
                    destacado
                        ? "estadistica-resumen-destacado"
                        : ""
                }
            "
        >

            <span>
                ${escaparHTML(
                    titulo
                )}
            </span>

            <strong>
                ${formatearDinero(
                    valor
                )}
            </strong>

        </div>

    `;

}


// =====================================================
// FILA RESUMEN TEXTO
// =====================================================

export function crearFilaResumenTextoEstadistica(
    titulo,
    valor
) {

    return `

        <div class="estadistica-resumen-fila">

            <span>
                ${escaparHTML(
                    titulo
                )}
            </span>

            <strong>
                ${valor}
            </strong>

        </div>

    `;

}


// =====================================================
// TARJETA CAMPANYA
// =====================================================

export function crearTarjetaCampaniaEstadistica(
    campania
) {

    return `

        <article class="rentabilidad-card">

            <div class="rentabilidad-card-header">

                <span class="card-icon">
                    📅
                </span>


                <div>

                    <h3>
                        ${escaparHTML(
                            campania.nombre
                        )}
                    </h3>

                    <p>
                        ${escaparHTML(
                            campania.fincaNombre
                            ||
                            "Sin finca"
                        )}
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

                    ${escaparHTML(
                        campania.estado
                        ||
                        "Sin estado"
                    )}

                </span>

            </div>


            <div class="rentabilidad-card-grid">

                <div>

                    <span>
                        Producción
                    </span>

                    <strong>
                        ${formatearNumero(
                            campania.produccion
                        )}
                        kg
                    </strong>

                </div>


                <div>

                    <span>
                        Ingresos
                    </span>

                    <strong>
                        ${formatearDinero(
                            campania.ingresos
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Gastos
                    </span>

                    <strong>
                        ${formatearDinero(
                            campania.gastos
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Beneficio
                    </span>

                    <strong
                        class="${
                            Number(
                                campania.beneficio
                                ||
                                0
                            ) >=
                            0

                                ? "valor-positivo"
                                : "valor-negativo"
                        }"
                    >

                        ${formatearDinero(
                            campania.beneficio
                        )}

                    </strong>

                </div>

            </div>


            <div class="rentabilidad-footer">

                <span>
                    Margen
                </span>

                <strong>
                    ${formatearPorcentaje(
                        campania.margen
                    )}
                </strong>

            </div>

        </article>

    `;

}


// =====================================================
// TARJETA FINCA
// =====================================================

export function crearTarjetaFincaEstadistica(
    finca
) {

    return `

        <article class="rentabilidad-card">

            <div class="rentabilidad-card-header">

                <span class="card-icon">
                    🌾
                </span>


                <div>

                    <h3>
                        ${escaparHTML(
                            finca.fincaNombre
                        )}
                    </h3>

                </div>

            </div>


            <div class="rentabilidad-card-grid">

                <div>

                    <span>
                        Producción
                    </span>

                    <strong>
                        ${formatearNumero(
                            finca.produccion
                        )}
                        kg
                    </strong>

                </div>


                <div>

                    <span>
                        Ventas
                    </span>

                    <strong>
                        ${formatearDinero(
                            finca.ventas
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Gastos
                    </span>

                    <strong>
                        ${formatearDinero(
                            finca.gastos
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Resultado
                    </span>

                    <strong
                        class="${
                            Number(
                                finca.resultado
                                ||
                                0
                            ) >=
                            0

                                ? "valor-positivo"
                                : "valor-negativo"
                        }"
                    >

                        ${formatearDinero(
                            finca.resultado
                        )}

                    </strong>

                </div>

            </div>


            <div class="rentabilidad-footer">

                <span>
                    Margen
                </span>

                <strong>
                    ${formatearPorcentaje(
                        finca.margen
                    )}
                </strong>

            </div>

        </article>

    `;

}


// =====================================================
// EXPORT ESPECÍFICO
// =====================================================

export {
    formatearPorcentaje
};