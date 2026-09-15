import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";


export class InventarioService {

    constructor() {

        this.productos =
            StorageService
                .obtenerInventario();

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.productos;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.productos
                .find(
                    producto =>
                        mismoId(
                            producto.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        datos
    ) {

        const validacion =
            this.validar(
                datos
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const nuevoProducto = {

            id:
                generarId(),

            ...this.normalizarDatos(
                datos
            )

        };


        this.productos.push(
            nuevoProducto
        );


        this.guardar();


        return {

            ok:
                true,

            producto:
                nuevoProducto

        };

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar(
        id,
        datos
    ) {

        const producto =
            this.obtenerPorId(
                id
            );


        if (
            !producto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El producto no existe."

            };

        }


        const validacion =
            this.validar(
                datos
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        Object.assign(
            producto,
            this.normalizarDatos(
                datos
            )
        );


        this.guardar();


        return {

            ok:
                true,

            producto:
                producto

        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const producto =
            this.obtenerPorId(
                id
            );


        if (
            !producto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El producto no existe."

            };

        }


        this.productos =
            this.productos
                .filter(
                    item =>
                        !mismoId(
                            item.id,
                            id
                        )
                );


        this.guardar();


        return {

            ok:
                true

        };

    }


    // =====================================================
    // VALIDAR
    // =====================================================

    validar(
        datos
    ) {

        const nombre =
            String(
                datos.nombre
                ??
                ""
            )
                .trim();


        if (
            !nombre
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El nombre del producto es obligatorio."

            };

        }


        const cantidad =
            numeroSeguro(
                datos.cantidad,
                0
            );


        if (
            cantidad <
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La cantidad no puede ser negativa."

            };

        }


        const stockMinimo =
            numeroSeguro(
                datos.stockMinimo,
                0
            );


        if (
            stockMinimo <
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El stock mínimo no puede ser negativo."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // NORMALIZAR DATOS
    // =====================================================

    normalizarDatos(
        datos
    ) {

        return {

            nombre:
                String(
                    datos.nombre
                    ??
                    ""
                )
                    .trim(),

            categoria:
                String(
                    datos.categoria
                    ??
                    "Otros"
                )
                    .trim()
                ||
                "Otros",

            cantidad:
                numeroSeguro(
                    datos.cantidad,
                    0
                ),

            unidad:
                String(
                    datos.unidad
                    ??
                    "ud"
                )
                    .trim()
                ||
                "ud",

            stockMinimo:
                numeroSeguro(
                    datos.stockMinimo,
                    0
                ),

            proveedor:
                String(
                    datos.proveedor
                    ??
                    ""
                )
                    .trim(),

            ubicacion:
                String(
                    datos.ubicacion
                    ??
                    ""
                )
                    .trim(),

            notas:
                String(
                    datos.notas
                    ??
                    ""
                )
                    .trim()

        };

    }


    // =====================================================
    // STOCK BAJO
    // =====================================================

    obtenerStockBajo() {

        return this.productos
            .filter(
                producto =>
                    Number(
                        producto.cantidad
                    )
                    >
                    0
                    &&
                    Number(
                        producto.cantidad
                    )
                    <=
                    Number(
                        producto.stockMinimo
                    )
            );

    }


    // =====================================================
    // ESTADO DEL STOCK
    // =====================================================

    obtenerEstadoStock(
        producto
    ) {

        const cantidad =
            Number(
                producto.cantidad
                ||
                0
            );


        const minimo =
            Number(
                producto.stockMinimo
                ||
                0
            );


        if (
            cantidad <=
            0
        ) {

            return "Sin stock";

        }


        if (
            cantidad <=
            minimo
        ) {

            return "Stock bajo";

        }


        return "Correcto";

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarInventario(
                this.productos
            );

    }

}