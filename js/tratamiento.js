import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId
} from "./utils.js";

import {
    obtenerNombreTrabajador,
    obtenerNombreCultivo,
    obtenerNombreMaquinaria
} from "./entityHelpers.js";


export class TratamientoService {

    constructor(
        inventarioService,
        cuadernoCampoService
    ) {

        this.inventarioService =
            inventarioService;

        this.cuadernoCampoService =
            cuadernoCampoService;

        this.tratamientos =
            StorageService
                .obtenerTratamientos();

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return [
            ...this.tratamientos
        ]
            .sort(
                (
                    a,
                    b
                ) => {

                    const fechaA =
                        this.crearFechaTratamiento(
                            a
                        );


                    const fechaB =
                        this.crearFechaTratamiento(
                            b
                        );


                    return (
                        fechaB
                        -
                        fechaA
                    );

                }
            );

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.tratamientos
                .find(
                    tratamiento =>
                        mismoId(
                            tratamiento.id,
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

        const preparacion =
            this.prepararDatos(
                datos
            );


        if (
            !preparacion.ok
        ) {

            return preparacion;

        }


        const {
            relaciones,
            cantidadUsada
        } =
            preparacion;


        const producto =
            relaciones.producto;


        const comprobacionStock =
            this.comprobarStockCreacion(
                producto,
                cantidadUsada
            );


        if (
            !comprobacionStock.ok
        ) {

            return comprobacionStock;

        }


        const tratamiento =
            this.crearObjetoTratamiento(
                datos,
                relaciones,
                cantidadUsada
            );


        // =================================================
        // DESCONTAR INVENTARIO
        // =================================================

        const resultadoStock =
            this.ajustarStock(
                producto.id,
                -cantidadUsada
            );


        if (
            !resultadoStock.ok
        ) {

            return resultadoStock;

        }


        // =================================================
        // CREAR REGISTRO EN CUADERNO
        // =================================================

        const resultadoCuaderno =
            this.cuadernoCampoService
                .crear(
                    this.crearDatosCuaderno(
                        tratamiento
                    )
                );


        if (
            !resultadoCuaderno.ok
        ) {

            this.ajustarStock(
                producto.id,
                cantidadUsada
            );


            return {

                ok:
                    false,

                mensaje:
                    resultadoCuaderno.mensaje
                    ||
                    "No se ha podido crear el registro en el cuaderno de campo."

            };

        }


        tratamiento.cuadernoRegistroId =
            resultadoCuaderno
                .registro
                .id;


        this.tratamientos.push(
            tratamiento
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.tratamientos =
                this.tratamientos
                    .filter(
                        item =>
                            !mismoId(
                                item.id,
                                tratamiento.id
                            )
                    );


            this.cuadernoCampoService
                .eliminar(
                    tratamiento.cuadernoRegistroId
                );


            this.ajustarStock(
                producto.id,
                cantidadUsada
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el tratamiento."

            };

        }


        return {

            ok:
                true,

            tratamiento:
                tratamiento

        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const tratamiento =
            this.obtenerPorId(
                id
            );


        if (
            !tratamiento
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El tratamiento no existe."

            };

        }


        const preparacion =
            this.prepararDatos(
                datos
            );


        if (
            !preparacion.ok
        ) {

            return preparacion;

        }


        const {
            relaciones,
            cantidadUsada:
                cantidadNueva
        } =
            preparacion;


        const productoAnteriorId =
            tratamiento.productoId;


        const cantidadAnterior =
            Number(
                tratamiento.cantidadUsada
                ||
                0
            );


        const productoNuevo =
            relaciones.producto;


        const comprobacionStock =
            this.comprobarStockEdicion(
                productoAnteriorId,
                cantidadAnterior,
                productoNuevo,
                cantidadNueva
            );


        if (
            !comprobacionStock.ok
        ) {

            return comprobacionStock;

        }


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    tratamiento
                )
            );


        // =================================================
        // AJUSTAR STOCK
        // =================================================

        const resultadoStock =
            this.actualizarStockEdicion(
                productoAnteriorId,
                cantidadAnterior,
                productoNuevo,
                cantidadNueva
            );


        if (
            !resultadoStock.ok
        ) {

            return resultadoStock;

        }


        // =================================================
        // ACTUALIZAR TRATAMIENTO EN MEMORIA
        // =================================================

        this.aplicarDatosTratamiento(
            tratamiento,
            datos,
            relaciones,
            cantidadNueva
        );


        // =================================================
        // ACTUALIZAR CUADERNO
        // =================================================

        if (
            tratamiento.cuadernoRegistroId
        ) {

            const resultadoCuaderno =
                this.cuadernoCampoService
                    .editar(
                        tratamiento.cuadernoRegistroId,
                        this.crearDatosCuaderno(
                            tratamiento
                        )
                    );


            if (
                !resultadoCuaderno.ok
            ) {

                this.revertirStockEdicion(
                    productoAnteriorId,
                    cantidadAnterior,
                    productoNuevo.id,
                    cantidadNueva
                );


                Object.assign(
                    tratamiento,
                    estadoAnterior
                );


                return resultadoCuaderno;

            }

        }


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.revertirStockEdicion(
                productoAnteriorId,
                cantidadAnterior,
                productoNuevo.id,
                cantidadNueva
            );


            Object.assign(
                tratamiento,
                estadoAnterior
            );


            if (
                estadoAnterior.cuadernoRegistroId
            ) {

                this.cuadernoCampoService
                    .editar(
                        estadoAnterior.cuadernoRegistroId,
                        this.crearDatosCuaderno(
                            estadoAnterior
                        )
                    );

            }


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios del tratamiento."

            };

        }


        return {

            ok:
                true,

            tratamiento:
                tratamiento

        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const tratamiento =
            this.obtenerPorId(
                id
            );


        if (
            !tratamiento
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El tratamiento no existe."

            };

        }


        const tratamientosAnteriores =
            [
                ...this.tratamientos
            ];


        const cantidadUsada =
            Number(
                tratamiento.cantidadUsada
                ||
                0
            );


        // =================================================
        // RESTAURAR STOCK
        // =================================================

        const resultadoStock =
            this.ajustarStock(
                tratamiento.productoId,
                cantidadUsada
            );


        if (
            !resultadoStock.ok
        ) {

            return resultadoStock;

        }


        // =================================================
        // ELIMINAR REGISTRO DEL CUADERNO
        // =================================================

        if (
            tratamiento.cuadernoRegistroId
        ) {

            const resultadoCuaderno =
                this.cuadernoCampoService
                    .eliminar(
                        tratamiento.cuadernoRegistroId
                    );


            if (
                resultadoCuaderno
                &&
                resultadoCuaderno.ok ===
                false
            ) {

                this.ajustarStock(
                    tratamiento.productoId,
                    -cantidadUsada
                );


                return resultadoCuaderno;

            }

        }


        this.tratamientos =
            this.tratamientos
                .filter(
                    item =>
                        !mismoId(
                            item.id,
                            id
                        )
                );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.tratamientos =
                tratamientosAnteriores;


            this.ajustarStock(
                tratamiento.productoId,
                -cantidadUsada
            );


            /*
             * Si se había eliminado el registro del cuaderno,
             * intentamos recrearlo para no dejar el tratamiento
             * y el cuaderno desincronizados.
             */

            if (
                tratamiento.cuadernoRegistroId
            ) {

                const recreado =
                    this.cuadernoCampoService
                        .crear(
                            this.crearDatosCuaderno(
                                tratamiento
                            )
                        );


                if (
                    recreado.ok
                ) {

                    tratamiento.cuadernoRegistroId =
                        recreado.registro.id;

                }

            }


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el tratamiento."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // PREPARAR DATOS
    // =====================================================

    prepararDatos(
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


        const relaciones =
            this.obtenerRelaciones(
                datos
            );


        if (
            !relaciones.ok
        ) {

            return relaciones;

        }


        return {

            ok:
                true,

            relaciones:
                relaciones,

            cantidadUsada:
                Number(
                    datos.cantidadUsada
                )

        };

    }


    // =====================================================
    // CREAR OBJETO TRATAMIENTO
    // =====================================================

    crearObjetoTratamiento(
        datos,
        relaciones,
        cantidadUsada
    ) {

        const ahora =
            new Date();


        const usuario =
            StorageService
                .obtenerUsuarioActual();


        return {

            id:
                generarId(),

            fecha:
                datos.fecha,

            hora:
                datos.hora
                ||
                "",

            fincaId:
                relaciones.finca.id,

            fincaNombre:
                relaciones.finca.nombre,

            campaniaId:
                relaciones.campania
                    ? relaciones.campania.id
                    : null,

            campaniaNombre:
                relaciones.campania
                    ? relaciones.campania.nombre
                    : "",

            cultivoId:
                relaciones.cultivo
                    ? relaciones.cultivo.id
                    : null,

            cultivoNombre:
                relaciones.cultivo
                    ? obtenerNombreCultivo(
                        relaciones.cultivo
                    )
                    : "",

            productoId:
                relaciones.producto.id,

            productoNombre:
                relaciones.producto.nombre,

            productoUnidad:
                relaciones.producto.unidad,

            cantidadUsada:
                cantidadUsada,

            dosis:
                datos.dosis.trim(),

            superficieTratada:
                this.obtenerNumeroOpcional(
                    datos.superficieTratada
                ),

            unidadSuperficie:
                "ha",

            trabajadorId:
                relaciones.trabajador
                    ? relaciones.trabajador.id
                    : null,

            trabajadorNombre:
                relaciones.trabajador
                    ? obtenerNombreTrabajador(
                        relaciones.trabajador
                    )
                    : "",

            maquinariaId:
                relaciones.maquinaria
                    ? relaciones.maquinaria.id
                    : null,

            maquinariaNombre:
                relaciones.maquinaria
                    ? obtenerNombreMaquinaria(
                        relaciones.maquinaria
                    )
                    : "",

            plagaObjetivo:
                datos.plagaObjetivo
                    ?.trim()
                ||
                "",

            observaciones:
                datos.observaciones
                    ?.trim()
                ||
                "",

            creadoPorTipo:
                usuario.tipo,

            creadoPorId:
                usuario.id,

            creadoPorNombre:
                usuario.nombre,

            fechaCreacion:
                ahora.toISOString(),

            fechaModificacion:
                ahora.toISOString(),

            cuadernoRegistroId:
                null

        };

    }


    // =====================================================
    // APLICAR DATOS
    // =====================================================

    aplicarDatosTratamiento(
        tratamiento,
        datos,
        relaciones,
        cantidadUsada
    ) {

        tratamiento.fecha =
            datos.fecha;


        tratamiento.hora =
            datos.hora
            ||
            "";


        tratamiento.fincaId =
            relaciones.finca.id;


        tratamiento.fincaNombre =
            relaciones.finca.nombre;


        tratamiento.campaniaId =
            relaciones.campania
                ? relaciones.campania.id
                : null;


        tratamiento.campaniaNombre =
            relaciones.campania
                ? relaciones.campania.nombre
                : "";


        tratamiento.cultivoId =
            relaciones.cultivo
                ? relaciones.cultivo.id
                : null;


        tratamiento.cultivoNombre =
            relaciones.cultivo
                ? obtenerNombreCultivo(
                    relaciones.cultivo
                )
                : "";


        tratamiento.productoId =
            relaciones.producto.id;


        tratamiento.productoNombre =
            relaciones.producto.nombre;


        tratamiento.productoUnidad =
            relaciones.producto.unidad;


        tratamiento.cantidadUsada =
            cantidadUsada;


        tratamiento.dosis =
            datos.dosis.trim();


        tratamiento.superficieTratada =
            this.obtenerNumeroOpcional(
                datos.superficieTratada
            );


        tratamiento.trabajadorId =
            relaciones.trabajador
                ? relaciones.trabajador.id
                : null;


        tratamiento.trabajadorNombre =
            relaciones.trabajador
                ? obtenerNombreTrabajador(
                    relaciones.trabajador
                )
                : "";


        tratamiento.maquinariaId =
            relaciones.maquinaria
                ? relaciones.maquinaria.id
                : null;


        tratamiento.maquinariaNombre =
            relaciones.maquinaria
                ? obtenerNombreMaquinaria(
                    relaciones.maquinaria
                )
                : "";


        tratamiento.plagaObjetivo =
            datos.plagaObjetivo
                ?.trim()
            ||
            "";


        tratamiento.observaciones =
            datos.observaciones
                ?.trim()
            ||
            "";


        tratamiento.fechaModificacion =
            new Date()
                .toISOString();

    }


    // =====================================================
    // DATOS PARA CUADERNO
    // =====================================================

    crearDatosCuaderno(
        tratamiento
    ) {

        return {

            fecha:
                tratamiento.fecha,

            hora:
                tratamiento.hora,

            tipoActuacion:
                "Tratamiento fitosanitario",

            fincaId:
                tratamiento.fincaId,

            campaniaId:
                tratamiento.campaniaId
                ||
                "",

            cultivoId:
                tratamiento.cultivoId
                ||
                "",

            trabajadorIds:
                tratamiento.trabajadorId
                    ? [
                        tratamiento.trabajadorId
                    ]
                    : [],

            maquinariaId:
                tratamiento.maquinariaId
                ||
                "",

            productoInventarioId:
                tratamiento.productoId,

            cantidad:
                tratamiento.cantidadUsada,

            unidad:
                tratamiento.productoUnidad,

            dosis:
                tratamiento.dosis,

            descripcion:
                tratamiento.plagaObjetivo
                    ? `Tratamiento contra ${tratamiento.plagaObjetivo}`
                    : "Tratamiento fitosanitario",

            observaciones:
                tratamiento.observaciones

        };

    }


    // =====================================================
    // COMPROBAR STOCK CREACIÓN
    // =====================================================

    comprobarStockCreacion(
        producto,
        cantidad
    ) {

        if (
            cantidad >
            Number(
                producto.cantidad
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No hay suficiente stock de ${producto.nombre}. Disponible: ${producto.cantidad} ${producto.unidad}.`

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // COMPROBAR STOCK EDICIÓN
    // =====================================================

    comprobarStockEdicion(
        productoAnteriorId,
        cantidadAnterior,
        productoNuevo,
        cantidadNueva
    ) {

        if (
            mismoId(
                productoAnteriorId,
                productoNuevo.id
            )
        ) {

            const diferencia =
                cantidadNueva
                -
                cantidadAnterior;


            if (
                diferencia >
                0
                &&
                diferencia >
                Number(
                    productoNuevo.cantidad
                )
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        `No hay suficiente stock. Disponible adicional: ${productoNuevo.cantidad} ${productoNuevo.unidad}.`

                };

            }


            return {

                ok:
                    true

            };

        }


        if (
            cantidadNueva >
            Number(
                productoNuevo.cantidad
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No hay suficiente stock de ${productoNuevo.nombre}. Disponible: ${productoNuevo.cantidad} ${productoNuevo.unidad}.`

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // ACTUALIZAR STOCK EN EDICIÓN
    // =====================================================

    actualizarStockEdicion(
        productoAnteriorId,
        cantidadAnterior,
        productoNuevo,
        cantidadNueva
    ) {

        if (
            mismoId(
                productoAnteriorId,
                productoNuevo.id
            )
        ) {

            const diferencia =
                cantidadNueva
                -
                cantidadAnterior;


            if (
                diferencia ===
                0
            ) {

                return {

                    ok:
                        true

                };

            }


            return this.ajustarStock(
                productoNuevo.id,
                -diferencia
            );

        }


        const restaurarAnterior =
            this.ajustarStock(
                productoAnteriorId,
                cantidadAnterior
            );


        if (
            !restaurarAnterior.ok
        ) {

            return restaurarAnterior;

        }


        const descontarNuevo =
            this.ajustarStock(
                productoNuevo.id,
                -cantidadNueva
            );


        if (
            !descontarNuevo.ok
        ) {

            this.ajustarStock(
                productoAnteriorId,
                -cantidadAnterior
            );


            return descontarNuevo;

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // REVERTIR STOCK DE EDICIÓN
    // =====================================================

    revertirStockEdicion(
        productoAnteriorId,
        cantidadAnterior,
        productoNuevoId,
        cantidadNueva
    ) {

        if (
            mismoId(
                productoAnteriorId,
                productoNuevoId
            )
        ) {

            const diferencia =
                cantidadNueva
                -
                cantidadAnterior;


            if (
                diferencia !==
                0
            ) {

                this.ajustarStock(
                    productoAnteriorId,
                    diferencia
                );

            }


            return;

        }


        this.ajustarStock(
            productoNuevoId,
            cantidadNueva
        );


        this.ajustarStock(
            productoAnteriorId,
            -cantidadAnterior
        );

    }


    // =====================================================
    // VALIDAR
    // =====================================================

    validar(
        datos
    ) {

        if (
            !datos
            ||
            typeof datos !==
            "object"
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Los datos del tratamiento no son válidos."

            };

        }


        if (
            !datos.fecha
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce la fecha del tratamiento."

            };

        }


        if (
            !datos.fincaId
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona una finca."

            };

        }


        if (
            !datos.productoId
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona el producto utilizado."

            };

        }


        const cantidad =
            Number(
                datos.cantidadUsada
            );


        if (
            !datos.cantidadUsada
            ||
            Number.isNaN(
                cantidad
            )
            ||
            cantidad <=
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce una cantidad utilizada válida."

            };

        }


        if (
            !datos.dosis
            ||
            !datos.dosis.trim()
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce la dosis aplicada."

            };

        }


        if (
            datos.superficieTratada !==
            ""
            &&
            datos.superficieTratada !==
            null
            &&
            datos.superficieTratada !==
            undefined
        ) {

            const superficie =
                Number(
                    datos.superficieTratada
                );


            if (
                Number.isNaN(
                    superficie
                )
                ||
                superficie <=
                0
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La superficie tratada no es válida."

                };

            }

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // RELACIONES
    // =====================================================

    obtenerRelaciones(
        datos
    ) {

        const finca =
            this.buscarPorId(
                StorageService
                    .obtenerFincas(),
                datos.fincaId
            );


        if (
            !finca
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La finca seleccionada no existe."

            };

        }


        const campaniaResultado =
            this.obtenerRelacionOpcional(
                StorageService
                    .obtenerCampanias(),
                datos.campaniaId,
                "La Campanya seleccionada no existe."
            );


        if (
            !campaniaResultado.ok
        ) {

            return campaniaResultado;

        }


        const campania =
            campaniaResultado.valor;


        if (
            campania
            &&
            !mismoId(
                campania.fincaId,
                finca.id
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La Campanya no pertenece a la finca seleccionada."

            };

        }


        const cultivoResultado =
            this.obtenerRelacionOpcional(
                StorageService
                    .obtenerCultivos(),
                datos.cultivoId,
                "El cultivo seleccionado no existe."
            );


        if (
            !cultivoResultado.ok
        ) {

            return cultivoResultado;

        }


        const cultivo =
            cultivoResultado.valor;


        if (
            cultivo
            &&
            cultivo.fincaId
            &&
            !mismoId(
                cultivo.fincaId,
                finca.id
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El cultivo seleccionado no pertenece a la finca indicada."

            };

        }


        const producto =
            this.buscarPorId(
                this.inventarioService
                    .obtenerTodos(),
                datos.productoId
            );


        if (
            !producto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El producto seleccionado no existe en el inventario."

            };

        }


        let trabajador =
            null;


        if (
            datos.trabajadorId
        ) {

            trabajador =
                this.buscarPorId(
                    StorageService
                        .obtenerTrabajadores(),
                    datos.trabajadorId
                );


            if (
                !trabajador
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "El trabajador seleccionado no existe."

                };

            }

        }


        let maquinaria =
            null;


        if (
            datos.maquinariaId
        ) {

            maquinaria =
                this.buscarPorId(
                    StorageService
                        .obtenerMaquinaria(),
                    datos.maquinariaId
                );


            if (
                !maquinaria
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La maquinaria seleccionada no existe."

                };

            }

        }


        return {

            ok:
                true,

            finca:
                finca,

            campania:
                campania,

            cultivo:
                cultivo,

            producto:
                producto,

            trabajador:
                trabajador,

            maquinaria:
                maquinaria

        };

    }


    // =====================================================
    // RELACIÓN OPCIONAL
    // =====================================================

    obtenerRelacionOpcional(
        coleccion,
        id,
        mensajeError
    ) {

        if (
            !id
        ) {

            return {

                ok:
                    true,

                valor:
                    null

            };

        }


        const valor =
            this.buscarPorId(
                coleccion,
                id
            );


        if (
            !valor
        ) {

            return {

                ok:
                    false,

                mensaje:
                    mensajeError

            };

        }


        return {

            ok:
                true,

            valor:
                valor

        };

    }


    // =====================================================
    // BUSCAR POR ID
    // =====================================================

    buscarPorId(
        coleccion,
        id
    ) {

        if (
            !Array.isArray(
                coleccion
            )
        ) {

            return null;

        }


        return (
            coleccion.find(
                elemento =>
                    mismoId(
                        elemento.id,
                        id
                    )
            )
            ||
            null
        );

    }


    // =====================================================
    // AJUSTAR STOCK
    // =====================================================

    ajustarStock(
        productoId,
        diferencia
    ) {

        const producto =
            this.buscarPorId(
                this.inventarioService
                    .obtenerTodos(),
                productoId
            );


        if (
            !producto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "No se ha encontrado el producto en inventario."

            };

        }


        const nuevaCantidad =
            Number(
                producto.cantidad
                ||
                0
            )
            +
            Number(
                diferencia
            );


        if (
            nuevaCantidad <
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `Stock insuficiente de ${producto.nombre}.`

            };

        }


        const resultado =
            this.inventarioService
                .actualizar(
                    producto.id,
                    {

                        nombre:
                            producto.nombre,

                        categoria:
                            producto.categoria,

                        cantidad:
                            nuevaCantidad,

                        unidad:
                            producto.unidad,

                        stockMinimo:
                            producto.stockMinimo,

                        proveedor:
                            producto.proveedor,

                        ubicacion:
                            producto.ubicacion,

                        notas:
                            producto.notas

                    }
                );


        if (
            resultado
            &&
            resultado.ok ===
            false
        ) {

            return resultado;

        }


        return {

            ok:
                true,

            producto:
                resultado?.producto
                ||
                producto

        };

    }


    // =====================================================
    // NÚMERO OPCIONAL
    // =====================================================

    obtenerNumeroOpcional(
        valor
    ) {

        if (
            valor ===
            ""
            ||
            valor ===
            null
            ||
            valor ===
            undefined
        ) {

            return null;

        }


        return Number(
            valor
        );

    }


    // =====================================================
    // FECHA PARA ORDENACIÓN
    // =====================================================

    crearFechaTratamiento(
        tratamiento
    ) {

        const fecha =
            new Date(
                `${tratamiento.fecha}T${tratamiento.hora || "00:00"}`
            );


        if (
            Number.isNaN(
                fecha.getTime()
            )
        ) {

            return new Date(
                0
            );

        }


        return fecha;

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarTratamientos(
                this.tratamientos
            );

    }

}