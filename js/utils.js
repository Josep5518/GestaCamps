// =====================================================
// GESTACAMPS
// UTILIDADES GENERALES
// =====================================================


// =====================================================
// ESCAPAR HTML
// =====================================================

export function escaparHTML(
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


// =====================================================
// NORMALIZAR TEXTO
// =====================================================

export function normalizarTexto(
    valor
) {

    return String(
        valor
        ??
        ""
    )
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


// =====================================================
// COMPARAR IDS
// =====================================================

export function mismoId(
    idA,
    idB
) {

    if (
        idA === null
        ||
        idA === undefined
        ||
        idB === null
        ||
        idB === undefined
    ) {

        return false;

    }


    return (
        String(
            idA
        )
        ===
        String(
            idB
        )
    );

}


// =====================================================
// NÚMERO SEGURO
// =====================================================

export function numeroSeguro(
    valor,
    valorDefecto = 0
) {

    const numero =
        Number(
            valor
        );


    return Number.isFinite(
        numero
    )
        ? numero
        : valorDefecto;

}


// =====================================================
// FORMATEAR NÚMERO
// =====================================================

export function formatearNumero(
    numero,
    decimales = 2
) {

    return numeroSeguro(
        numero
    )
        .toLocaleString(
            "es-ES",
            {
                maximumFractionDigits:
                    decimales
            }
        );

}


// =====================================================
// FORMATEAR DINERO
// =====================================================

export function formatearDinero(
    numero
) {

    return (
        numeroSeguro(
            numero
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
        " €"
    );

}


// =====================================================
// FECHA HOY YYYY-MM-DD
// =====================================================

export function obtenerFechaHoy() {

    const fecha =
        new Date();


    const year =
        fecha.getFullYear();


    const month =
        String(
            fecha.getMonth()
            +
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


// =====================================================
// FORMATEAR FECHA YYYY-MM-DD -> DD/MM/YYYY
// =====================================================

export function formatearFecha(
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

        return String(
            fecha
        );

    }


    return (
        `${partes[2]}/${partes[1]}/${partes[0]}`
    );

}


// =====================================================
// FORMATEAR FECHA Y HORA
// =====================================================

export function formatearFechaHora(
    valor
) {

    if (
        !valor
    ) {

        return "—";

    }


    const fecha =
        valor instanceof Date
            ? valor
            : new Date(
                valor
            );


    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {

        return String(
            valor
        );

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


// =====================================================
// HORA ACTUAL HH:MM
// =====================================================

export function obtenerHoraActual() {

    return new Date()
        .toLocaleTimeString(
            "es-ES",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );

}


// =====================================================
// GENERAR ID
// =====================================================

export function generarId() {

    if (
        typeof crypto !==
        "undefined"
        &&
        typeof crypto.randomUUID ===
        "function"
    ) {

        return crypto.randomUUID();

    }


    return (
        `${Date.now()}-${Math.floor(
            Math.random()
            *
            1000000
        )}`
    );

}