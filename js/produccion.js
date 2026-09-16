import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";

import {
    obtenerNombreCultivo
} from "./entityHelpers.js";


export class ProduccionService {

    constructor(
        fincaService,
        campaniaService,
        cultivoService
    ) {

        this.fincaService =
            fincaService;

        this.campaniaService =
            campaniaService;

        this.cultivoService =
            cultivoService;

        this.registros =
            StorageService
                .obtenerProduccion();


        if (
            !Array.isArray(
                this.registros
            )
        ) {

            this.registros =
                [];

        }

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.registros;

    }


    obtenerTodas() {

        return this.registros;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.registros
                .find(
                    registro =>
                        mismoId(
                            registro.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // POR FINCA
    // =====================================================

    obtenerPorFinca(
        fincaId
    ) {

        return this.registros
            .filter(
                registro =>
                    mismoId(
                        registro.fincaId,
                        fincaId
                    )
            );

    }


    // =====================================================
    // POR CAMPANYA
    // =====================================================

    obtenerPorCampania(
        campaniaId
    ) {

        return this.registros
            .filter(
                registro =>
                    mismoId(
                        registro.campaniaId,
                        campaniaId
                    )
            );

    }


    // =====================================================
    // POR CULTIVO
    // =====================================================

    obtenerPorCultivo(
        cultivoId
    ) {

        return this.registros
            .filter(
                registro =>
                    mismoId(
                        registro.cultivoId,
                        cultivoId
                    )
            );

    }


    // =====================================================
    // TOTALES
    // =====================================================

    obtenerTotal() {

        return this.registros
            .reduce(
                (
                    total,
                    registro
                ) =>
                    total
                    +
                    numeroSeguro(
                        registro.cantidad,
                        0
                    ),
                0
            );

    }


    obtenerTotalKg() {

        return this.obtenerTotal();

    }


    obtenerTotalPorCampania(
        campaniaId
    ) {

        return this.obtenerPorCampania(
            campaniaId
        )
            .reduce(
                (
                    total,
                    registro
                ) =>
                    total
                    +
                    numeroSeguro(
                        registro.cantidad,
                        0
                    ),
                0
            );

    }


    // =====================================================
    // VALIDAR / RELACIONES
    // =====================================================

    prepararDatos(
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
                    "Los datos de producción no son válidos."

            };

        }


        const cultivo =
            this.cultivoService
                .obtenerPorId(
                    datos.cultivoId
                );


        if (
            !cultivo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona un cultivo válido."

            };

        }


        const finca =
            this.fincaService
                .obtenerPorId(
                    cultivo.fincaId
                );


        if (
            !finca
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La finca asociada al cultivo no existe."

            };

        }


        let campania =
            null;


        if (
            cultivo.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        cultivo.campaniaId
                    );


            if (
                !campania
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La campanya asociada al cultivo ya no existe."

                };

            }


            if (
                !mismoId(
                    campania.fincaId,
                    finca.id
                )
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La campanya del cultivo no pertenece a su finca."

                };

            }

        }


        const cantidad =
            numeroSeguro(
                datos.cantidad,
                NaN
            );


        if (
            !Number.isFinite(
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
                    "Introduce una cantidad válida."

            };

        }


        if (
            !datos.fecha
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce la fecha de producción."

            };

        }


        const unidad =
            String(
                datos.unidad
                ??
                "kg"
            )
                .trim()
            ||
            "kg";


        return {

            ok:
                true,

            cultivo:
                cultivo,

            finca:
                finca,

            campania:
                campania,

            cantidad:
                cantidad,

            unidad:
                unidad

        };

    }


    // =====================================================
    // NORMALIZAR DATOS
    // =====================================================

    normalizarDatos(
        datos,
        relaciones
    ) {

        const cultivo =
            relaciones.cultivo;


        return {

            cultivoId:
                cultivo.id,

            cultivoNombre:
                obtenerNombreCultivo(
                    cultivo
                ),

            fincaId:
                relaciones.finca.id,

            fincaNombre:
                relaciones.finca.nombre,

            parcela:
                String(
                    cultivo.parcela
                    ??
                    ""
                )
                    .trim(),

            producto:
                String(
                    cultivo.tipo
                    ??
                    ""
                )
                    .trim(),

            variedad:
                String(
                    cultivo.variedad
                    ??
                    ""
                )
                    .trim(),

            cantidad:
                relaciones.cantidad,

            unidad:
                relaciones.unidad,

            fecha:
                datos.fecha,

            campaniaId:
                relaciones.campania
                    ? relaciones.campania.id
                    : null,

            campaniaNombre:
                relaciones.campania
                    ? relaciones.campania.nombre
                    : "",

            observaciones:
                String(
                    datos.observaciones
                    ??
                    ""
                )
                    .trim()

        };

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


        const ahora =
            new Date()
                .toISOString();


        const nuevoRegistro = {

            id:
                generarId(),

            ...this.normalizarDatos(
                datos,
                preparacion
            ),

            fechaCreacion:
                ahora,

            fechaModificacion:
                ahora

        };


        this.registros.push(
            nuevoRegistro
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.registros =
                this.registros
                    .filter(
                        registro =>
                            !mismoId(
                                registro.id,
                                nuevoRegistro.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el registro de producción."

            };

        }


        return {

            ok:
                true,

            registro:
                nuevoRegistro

        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const registro =
            this.obtenerPorId(
                id
            );


        if (
            !registro
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El registro de producción no existe."

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


        const cantidadAlbaranada =
            this.obtenerCantidadAlbaranada(
                registro.id
            );


        if (
            cantidadAlbaranada >
            0
        ) {

            if (
                !mismoId(
                    registro.cultivoId,
                    preparacion.cultivo.id
                )
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "No puedes cambiar el cultivo de esta producción porque ya está utilizada en uno o varios albaranes."

                };

            }


            if (
                preparacion.cantidad <
                cantidadAlbaranada
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        `No puedes reducir la producción a ${preparacion.cantidad} ${preparacion.unidad} porque ya hay ${cantidadAlbaranada} ${registro.unidad || "kg"} utilizados en albaranes.`

                };

            }

        }


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    registro
                )
            );


        Object.assign(
            registro,
            this.normalizarDatos(
                datos,
                preparacion
            ),
            {

                fechaModificacion:
                    new Date()
                        .toISOString()

            }
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            Object.assign(
                registro,
                estadoAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios de producción."

            };

        }


        return {

            ok:
                true,

            registro:
                registro

        };

    }


    // =====================================================
    // CANTIDAD UTILIZADA EN ALBARANES
    // =====================================================

    obtenerCantidadAlbaranada(
        produccionId
    ) {

        const albaranes =
            StorageService
                .obtenerAlbaranes();


        let total =
            0;


        albaranes.forEach(
            albaran => {

                const lineas =
                    Array.isArray(
                        albaran.lineas
                    )
                    &&
                    albaran.lineas.length >
                    0

                        ? albaran.lineas

                        : [
                            albaran
                        ];


                lineas.forEach(
                    linea => {

                        if (
                            mismoId(
                                linea.produccionId,
                                produccionId
                            )
                        ) {

                            total +=
                                numeroSeguro(
                                    linea.cantidad,
                                    0
                                );

                        }

                    }
                );

            }
        );


        return total;

    }


    // =====================================================
    // ALBARANES VINCULADOS
    // =====================================================

    obtenerAlbaranesVinculados(
        produccionId
    ) {

        const albaranes =
            StorageService
                .obtenerAlbaranes();


        return albaranes
            .filter(
                albaran => {

                    const lineas =
                        Array.isArray(
                            albaran.lineas
                        )
                        &&
                        albaran.lineas.length >
                        0

                            ? albaran.lineas

                            : [
                                albaran
                            ];


                    return lineas.some(
                        linea =>
                            mismoId(
                                linea.produccionId,
                                produccionId
                            )
                    );

                }
            );

    }


    // =====================================================
    // DISPONIBLE
    // =====================================================

    obtenerCantidadDisponible(
        produccionId
    ) {

        const registro =
            this.obtenerPorId(
                produccionId
            );


        if (
            !registro
        ) {

            return 0;

        }


        const producido =
            numeroSeguro(
                registro.cantidad,
                0
            );


        const albaranado =
            this.obtenerCantidadAlbaranada(
                produccionId
            );


        return Math.max(
            0,
            producido
            -
            albaranado
        );

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const registro =
            this.obtenerPorId(
                id
            );


        if (
            !registro
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El registro de producción no existe."

            };

        }


        const albaranes =
            this.obtenerAlbaranesVinculados(
                id
            );


        if (
            albaranes.length >
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar este registro de producción porque está utilizado en ${albaranes.length} albarán${
                        albaranes.length === 1
                            ? ""
                            : "es"
                    }.`

            };

        }


        const registrosAnteriores =
            [
                ...this.registros
            ];


        this.registros =
            this.registros
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

            this.registros =
                registrosAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el registro de producción."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarProduccion(
                this.registros
            );

    }

}