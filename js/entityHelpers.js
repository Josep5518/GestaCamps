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
            )
            .trim();


    return (
        nombre
        ||
        `Trabajador ${String(
            trabajador.id
            ??
            ""
        )}`
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


    const descripcion =
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
            .trim();


    return (
        cultivo.nombre
        ||
        descripcion
        ||
        `Cultivo ${String(
            cultivo.id
            ??
            ""
        )}`
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


    const descripcion =
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
            .trim();


    return (
        maquina.nombre
        ||
        descripcion
        ||
        `Maquinaria ${String(
            maquina.id
            ??
            ""
        )}`
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
        `Producto ${String(
            producto.id
            ??
            ""
        )}`
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
        `Finca ${String(
            finca.id
            ??
            ""
        )}`
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
        `Campanya ${String(
            campania.id
            ??
            ""
        )}`
    );

}