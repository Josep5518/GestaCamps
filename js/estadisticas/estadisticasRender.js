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
                    minimumFractionDigits:
                        1,

                    maximumFractionDigits:
                        1
                }
            )
        +
        " %"
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
// BARRAS
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

        return `

            <p class="estadistica-vacio">
                Sin datos.
            </p>

        `;

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


    return datos
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


                const textoValor =
                    tipo ===
                    "kg"

                        ? `${formatearNumero(
                            valor
                        )} kg`

                        : formatearDinero(
                            valor
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
                                ${textoValor}
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
        .join("");

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