// =====================================================
// GESTACAMPS
// HELPERS DE ENTIDADES
// =====================================================


// =====================================================
// TRABAJADOR
// =====================================================

export function obtenerNombreTrabajador(
    trabajador
) {

    if (
        !trabajador
    ) {

        return "";

    }


    const nombre =
        [
            trabajador.nombre,
            trabajador.apellidos
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            );


    return (
        nombre
        ||
        `Trabajador ${trabajador.id || ""}`
    );

}


// =====================================================
// CULTIVO
// =====================================================

export function obtenerNombreCultivo(
    cultivo
) {

    if (
        !cultivo
    ) {

        return "";

    }


    return (
        cultivo.nombre
        ||
        [
            cultivo.tipo,
            cultivo.variedad
        ]
            .filter(
                Boolean
            )
            .join(
                " · "
            )
        ||
        `Cultivo ${cultivo.id || ""}`
    );

}


// =====================================================
// MAQUINARIA
// =====================================================

export function obtenerNombreMaquinaria(
    maquina
) {

    if (
        !maquina
    ) {

        return "";

    }


    return (
        maquina.nombre
        ||
        [
            maquina.marca,
            maquina.modelo
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            )
        ||
        `Maquinaria ${maquina.id || ""}`
    );

}


// =====================================================
// PRODUCTO
// =====================================================

export function obtenerNombreProducto(
    producto
) {

    if (
        !producto
    ) {

        return "";

    }


    return (
        producto.nombre
        ||
        producto.producto
        ||
        producto.descripcion
        ||
        `Producto ${producto.id || ""}`
    );

}


// =====================================================
// FINCA
// =====================================================

export function obtenerNombreFinca(
    finca
) {

    if (
        !finca
    ) {

        return "";

    }


    return (
        finca.nombre
        ||
        `Finca ${finca.id || ""}`
    );

}


// =====================================================
// CAMPANYA
// =====================================================

export function obtenerNombreCampania(
    campania
) {

    if (
        !campania
    ) {

        return "";

    }


    return (
        campania.nombre
        ||
        `Campanya ${campania.id || ""}`
    );

}