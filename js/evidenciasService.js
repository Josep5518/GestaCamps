// =====================================================
// GESTACAMPS
// EVIDENCIAS SERVICE
// SUPABASE STORAGE
// =====================================================
//
// Gestiona fotografías y documentos asociados
// a incidencias, trabajos y otros módulos.
//
// Los archivos se almacenan en:
//
// user_id/
//     modulo/
//         entidad_id/
//             archivo
//
// El bucket es privado.
// Para visualizar/descargar archivos se generan
// URLs firmadas temporales.
// =====================================================


// =====================================================
// CONFIGURACIÓN
// =====================================================

const SUPABASE_URL =
    "https://gqlbnxnjzsaowwthrlsz.supabase.co";


const SUPABASE_CLAVE_PUBLICA =
    "sb_publishable_Kl2_v1Y_gNN1bnmuUOvSKw_QVqtULB9";


const SUPABASE_LIBRERIA =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const BUCKET =
    "gestacamps-evidencias";


const TAMANO_MAXIMO =
    10 * 1024 * 1024;


// =====================================================
// TIPOS ADMITIDOS
// =====================================================

const TIPOS_ADMITIDOS = [

    "image/jpeg",

    "image/png",

    "image/webp",

    "application/pdf"

];


// =====================================================
// ESTADO
// =====================================================

let cliente =
    null;


// =====================================================
// OBTENER CLIENTE
// =====================================================

async function obtenerCliente() {

    if (
        cliente
    ) {

        return cliente;

    }


    const libreria =
        await import(
            SUPABASE_LIBRERIA
        );


    cliente =
        libreria.createClient(

            SUPABASE_URL,

            SUPABASE_CLAVE_PUBLICA

        );


    return cliente;

}


// =====================================================
// OBTENER USUARIO
// =====================================================

async function obtenerUsuario() {

    const supabase =
        await obtenerCliente();


    const {

        data,

        error

    } =
        await supabase
            .auth
            .getSession();


    if (
        error
    ) {

        throw error;

    }


    const usuario =
        data
            ?.session
            ?.user;


    if (
        !usuario
    ) {

        throw new Error(
            "No hay una sesión de nube activa."
        );

    }


    return usuario;

}


// =====================================================
// LIMPIAR NOMBRE
// =====================================================

function limpiarNombreArchivo(
    nombre
) {

    const texto =
        String(
            nombre
            ||
            "archivo"
        );


    return texto

        .normalize(
            "NFD"
        )

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
        )

        .replace(
            /-+/g,
            "-"
        )

        .replace(
            /^-+|-+$/g,
            ""

        )

        ||

        "archivo";

}


// =====================================================
// GENERAR ID
// =====================================================

function generarId() {

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

        Date.now()
            .toString(
                36
            )

        +

        "-"

        +

        Math.random()
            .toString(
                36
            )
            .slice(
                2,
                10
            )

    );

}


// =====================================================
// VALIDAR ARCHIVO
// =====================================================

function validarArchivo(
    archivo
) {

    if (
        !archivo
    ) {

        return {

            ok:
                false,

            mensaje:
                "No se ha seleccionado ningún archivo."

        };

    }


    if (

        !TIPOS_ADMITIDOS.includes(
            archivo.type
        )

    ) {

        return {

            ok:
                false,

            mensaje:
                "Formato no permitido. Usa JPG, PNG, WEBP o PDF."

        };

    }


    if (

        archivo.size >
        TAMANO_MAXIMO

    ) {

        return {

            ok:
                false,

            mensaje:
                "El archivo supera el límite de 10 MB."

        };

    }


    return {

        ok:
            true

    };

}


// =====================================================
// CREAR RUTA
// =====================================================

async function crearRuta(
    modulo,
    entidadId,
    archivo
) {

    const usuario =
        await obtenerUsuario();


    const nombre =
        limpiarNombreArchivo(
            archivo.name
        );


    const idArchivo =
        generarId();


    return (

        `${usuario.id}/`

        +

        `${limpiarNombreArchivo(
            modulo
        )}/`

        +

        `${limpiarNombreArchivo(
            entidadId
        )}/`

        +

        `${idArchivo}-${nombre}`

    );

}


// =====================================================
// SUBIR ARCHIVO
// =====================================================

async function subir(
    modulo,
    entidadId,
    archivo
) {

    const validacion =
        validarArchivo(
            archivo
        );


    if (
        !validacion.ok
    ) {

        return validacion;

    }


    try {

        const supabase =
            await obtenerCliente();


        const ruta =
            await crearRuta(

                modulo,

                entidadId,

                archivo

            );


        const {

            data,

            error

        } =
            await supabase
                .storage
                .from(
                    BUCKET
                )
                .upload(

                    ruta,

                    archivo,

                    {

                        cacheControl:
                            "3600",

                        upsert:
                            false,

                        contentType:
                            archivo.type

                    }

                );


        if (
            error
        ) {

            throw error;

        }


        const evidencia = {

            id:
                generarId(),

            nombre:
                archivo.name,

            tipo:
                archivo.type,

            tamano:
                archivo.size,

            ruta:
                data?.path
                ||
                ruta,

            modulo:
                modulo,

            entidadId:
                entidadId,

            fecha:
                new Date()
                    .toISOString()

        };


        return {

            ok:
                true,

            evidencia:
                evidencia

        };

    }

    catch (
        error
    ) {

        console.error(
            "GestaCamps Evidencias: error subiendo archivo:",
            error
        );


        return {

            ok:
                false,

            mensaje:
                error?.message
                ||
                "No se ha podido subir el archivo."

        };

    }

}


// =====================================================
// CREAR URL FIRMADA
// =====================================================

async function obtenerUrl(
    ruta,
    segundos = 3600
) {

    if (
        !ruta
    ) {

        return {

            ok:
                false,

            mensaje:
                "La evidencia no tiene una ruta válida."

        };

    }


    try {

        const supabase =
            await obtenerCliente();


        const {

            data,

            error

        } =
            await supabase
                .storage
                .from(
                    BUCKET
                )
                .createSignedUrl(

                    ruta,

                    segundos

                );


        if (
            error
        ) {

            throw error;

        }


        return {

            ok:
                true,

            url:
                data?.signedUrl
                ||
                ""

        };

    }

    catch (
        error
    ) {

        console.error(
            "GestaCamps Evidencias: error generando URL:",
            error
        );


        return {

            ok:
                false,

            mensaje:
                error?.message
                ||
                "No se ha podido abrir el archivo."

        };

    }

}


// =====================================================
// ELIMINAR ARCHIVO
// =====================================================

async function eliminar(
    ruta
) {

    if (
        !ruta
    ) {

        return {

            ok:
                false,

            mensaje:
                "La evidencia no tiene una ruta válida."

        };

    }


    try {

        const supabase =
            await obtenerCliente();


        const {

            error

        } =
            await supabase
                .storage
                .from(
                    BUCKET
                )
                .remove(
                    [
                        ruta
                    ]
                );


        if (
            error
        ) {

            throw error;

        }


        return {

            ok:
                true

        };

    }

    catch (
        error
    ) {

        console.error(
            "GestaCamps Evidencias: error eliminando archivo:",
            error
        );


        return {

            ok:
                false,

            mensaje:
                error?.message
                ||
                "No se ha podido eliminar el archivo."

        };

    }

}


// =====================================================
// ELIMINAR VARIAS
// =====================================================

async function eliminarVarias(
    evidencias
) {

    const lista =
        Array.isArray(
            evidencias
        )
            ? evidencias
            : [];


    const rutas =
        lista

            .map(
                evidencia =>
                    evidencia?.ruta
            )

            .filter(
                Boolean
            );


    if (
        rutas.length ===
        0
    ) {

        return {

            ok:
                true

        };

    }


    try {

        const supabase =
            await obtenerCliente();


        const {

            error

        } =
            await supabase
                .storage
                .from(
                    BUCKET
                )
                .remove(
                    rutas
                );


        if (
            error
        ) {

            throw error;

        }


        return {

            ok:
                true

        };

    }

    catch (
        error
    ) {

        console.error(
            "GestaCamps Evidencias: error eliminando archivos:",
            error
        );


        return {

            ok:
                false,

            mensaje:
                error?.message
                ||
                "No se han podido eliminar los archivos."

        };

    }

}


// =====================================================
// SABER SI ES IMAGEN
// =====================================================

function esImagen(
    evidencia
) {

    return Boolean(

        evidencia
            ?.tipo
            ?.startsWith(
                "image/"
            )

    );

}


// =====================================================
// SABER SI ES PDF
// =====================================================

function esPDF(
    evidencia
) {

    return (

        evidencia?.tipo ===
        "application/pdf"

    );

}


// =====================================================
// FORMATEAR TAMAÑO
// =====================================================

function formatearTamano(
    bytes
) {

    const cantidad =
        Number(
            bytes
        )
        ||
        0;


    if (
        cantidad <
        1024
    ) {

        return (
            `${cantidad} B`
        );

    }


    if (
        cantidad <
        1024 * 1024
    ) {

        return (

            `${(
                cantidad / 1024
            ).toFixed(
                1
            )} KB`

        );

    }


    return (

        `${(
            cantidad
            /
            (
                1024
                *
                1024
            )
        ).toFixed(
            1
        )} MB`

    );

}


// =====================================================
// SERVICE
// =====================================================

export const EvidenciasService = {

    subir,

    obtenerUrl,

    eliminar,

    eliminarVarias,

    esImagen,

    esPDF,

    formatearTamano

};