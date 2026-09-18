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


        const registrosGuardados =
            StorageService
                .obtenerProduccion();


        this.registros =
            Array.isArray(
                registrosGuardados
            )
                ? registrosGuardados
                    .map(
                        registro =>
                            this.normalizarRegistroExistente(
                                registro
                            )
                    )
                : [];

    }


    // =====================================================
    // PASADAS PERMITIDAS
    // =====================================================

    obtenerPasadasPermitidas() {

        return [
            "1ª",
            "2ª",
            "3ª",
            "R"
        ];

    }


    // =====================================================
    // NORMALIZAR PASADA
    // =====================================================

    normalizarPasada(
        pasada
    ) {

        const texto =
            String(
                pasada
                ??
                ""
            )
                .trim()
                .toUpperCase();


        const equivalencias = {

            "1":
                "1ª",

            "1A":
                "1ª",

            "1ª":
                "1ª",

            "PRIMERA":
                "1ª",


            "2":
                "2ª",

            "2A":
                "2ª",

            "2ª":
                "2ª",

            "SEGUNDA":
                "2ª",


            "3":
                "3ª",

            "3A":
                "3ª",

            "3ª":
                "3ª",

            "TERCERA":
                "3ª",


            "R":
                "R",

            "REPASO":
                "R",

            "RECOLECCION":
                "R",

            "RECOLECCIÓN":
                "R"

        };


        return (
            equivalencias[
                texto
            ]
            ||
            ""
        );

    }


    // =====================================================
    // NORMALIZAR REGISTROS ANTIGUOS
    // =====================================================

    normalizarRegistroExistente(
        registro
    ) {

        if (
            !registro
            ||
            typeof registro !==
            "object"
        ) {

            return registro;

        }


        const pasadaNormalizada =
            this.normalizarPasada(
                registro.pasada
            );


        const cantidadAnterior =
            numeroSeguro(
                registro.cantidad,
                0
            );


        const pesoBrutoGuardado =
            numeroSeguro(
                registro.pesoBruto,
                NaN
            );


        const taraGuardada =
            numeroSeguro(
                registro.tara,
                NaN
            );


        const pesoNetoGuardado =
            numeroSeguro(
                registro.pesoNeto,
                NaN
            );


        const pesoBruto =
            Number.isFinite(
                pesoBrutoGuardado
            )

                ? pesoBrutoGuardado

                : cantidadAnterior;


        const tara =
            Number.isFinite(
                taraGuardada
            )

                ? Math.max(
                    0,
                    taraGuardada
                )

                : 0;


        const pesoNetoCalculado =
            Math.max(
                0,
                pesoBruto -
                tara
            );


        const pesoNeto =
            Number.isFinite(
                pesoNetoGuardado
            )

                ? Math.max(
                    0,
                    pesoNetoGuardado
                )

                : pesoNetoCalculado;


        return {

            ...registro,

            pasada:
                pasadaNormalizada
                ||
                "1ª",

            pesoBruto:
                pesoBruto,

            tara:
                tara,

            pesoNeto:
                pesoNeto,

            cantidad:
                pesoNeto

        };

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
    // POR PASADA
    // =====================================================

    obtenerPorPasada(
        pasada
    ) {

        const pasadaNormalizada =
            this.normalizarPasada(
                pasada
            );


        if (
            !pasadaNormalizada
        ) {

            return [];

        }


        return this.registros
            .filter(
                registro =>
                    this.normalizarPasada(
                        registro.pasada
                    )
                    ===
                    pasadaNormalizada
            );

    }


    // =====================================================
    // TOTAL POR PASADA
    // =====================================================

    obtenerTotalPorPasada(
        pasada
    ) {

        return this.obtenerPorPasada(
            pasada
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


        const pesoBruto =
            numeroSeguro(
                datos.pesoBruto
                ??
                datos.cantidad,
                NaN
            );


        const tara =
            numeroSeguro(
                datos.tara
                ??
                0,
                NaN
            );


        if (
            !Number.isFinite(
                pesoBruto
            )
            ||
            pesoBruto <=
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce un peso bruto válido."

            };

        }


        if (
            !Number.isFinite(
                tara
            )
            ||
            tara <
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce una tara válida."

            };

        }


        if (
            tara >=
            pesoBruto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La tara debe ser menor que el peso bruto."

            };

        }


        const pesoNeto =
            Number(
                (
                    pesoBruto -
                    tara
                )
                    .toFixed(
                        2
                    )
            );


        if (
            !Number.isFinite(
                pesoNeto
            )
            ||
            pesoNeto <=
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El peso neto debe ser mayor que 0."

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


        const pasada =
            this.normalizarPasada(
                datos.pasada
            );


        if (
            !pasada
            ||
            !this.obtenerPasadasPermitidas()
                .includes(
                    pasada
                )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona una pasada válida: 1ª, 2ª, 3ª o R."

            };

        }


        return {

            ok:
                true,

            cultivo:
                cultivo,

            finca:
                finca,

            campania:
                campania,

            pesoBruto:
                Number(
                    pesoBruto.toFixed(
                        2
                    )
                ),

            tara:
                Number(
                    tara.toFixed(
                        2
                    )
                ),

            pesoNeto:
                pesoNeto,

            cantidad:
                pesoNeto,

            unidad:
                unidad,

            pasada:
                pasada

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

            pasada:
                relaciones.pasada,

            pesoBruto:
                relaciones.pesoBruto,

            tara:
                relaciones.tara,

            pesoNeto:
                relaciones.pesoNeto,

            cantidad:
                relaciones.pesoNeto,

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
    // DUPLICADOS
    // =====================================================

    buscarDuplicado(
        preparacion,
        datos,
        excluirId = null
    ) {

        return (
            this.registros
                .find(
                    registro => {

                        if (
                            excluirId !==
                            null
                            &&
                            mismoId(
                                registro.id,
                                excluirId
                            )
                        ) {

                            return false;

                        }


                        const registroNormalizado =
                            this.normalizarRegistroExistente(
                                registro
                            );


                        return (
                            mismoId(
                                registroNormalizado.cultivoId,
                                preparacion.cultivo.id
                            )
                            &&
                            String(
                                registroNormalizado.fecha
                                ??
                                ""
                            )
                            ===
                            String(
                                datos.fecha
                                ??
                                ""
                            )
                            &&
                            this.normalizarPasada(
                                registroNormalizado.pasada
                            )
                            ===
                            preparacion.pasada
                            &&
                            String(
                                registroNormalizado.unidad
                                ??
                                "kg"
                            )
                            ===
                            String(
                                preparacion.unidad
                            )
                            &&
                            Math.abs(
                                numeroSeguro(
                                    registroNormalizado.pesoBruto,
                                    registroNormalizado.cantidad
                                )
                                -
                                preparacion.pesoBruto
                            )
                            <
                            0.000001
                            &&
                            Math.abs(
                                numeroSeguro(
                                    registroNormalizado.tara,
                                    0
                                )
                                -
                                preparacion.tara
                            )
                            <
                            0.000001
                            &&
                            Math.abs(
                                numeroSeguro(
                                    registroNormalizado.pesoNeto,
                                    registroNormalizado.cantidad
                                )
                                -
                                preparacion.pesoNeto
                            )
                            <
                            0.000001
                        );

                    }
                )
            ||
            null
        );

    }


    crearResultadoDuplicado(
        duplicado
    ) {

        return {

            ok:
                false,

            duplicado:
                true,

            registroDuplicado:
                duplicado,

            mensaje:
                "Parece un registro duplicado: coincide la fecha, el cultivo, la campanya, la pasada, el peso bruto, la tara y el peso neto. Confirma si realmente corresponde a otra pesada distinta."

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


        const duplicado =
            this.buscarDuplicado(
                preparacion,
                datos
            );


        if (
            duplicado
            &&
            datos.confirmarDuplicado !==
            true
        ) {

            return this.crearResultadoDuplicado(
                duplicado
            );

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


        const albaranesVinculados =
            this.obtenerAlbaranesVinculados(
                registro.id
            );


        const tieneAlbaranesVinculados =
            albaranesVinculados.length >
            0;


        if (
            tieneAlbaranesVinculados
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
                        "No puedes cambiar el cultivo de esta producción porque ya está vinculada a uno o varios albaranes."

                };

            }


            if (
                String(
                    registro.unidad
                    ??
                    "kg"
                )
                !==
                String(
                    preparacion.unidad
                )
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "No puedes cambiar la unidad de esta producción porque ya está vinculada a uno o varios albaranes."

                };

            }


            if (
                this.normalizarPasada(
                    registro.pasada
                )
                !==
                preparacion.pasada
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "No puedes cambiar la pasada de esta producción porque ya está vinculada a uno o varios albaranes."

                };

            }

        }


        const cantidadAlbaranada =
            this.obtenerCantidadAlbaranada(
                registro.id
            );


        if (
            preparacion.cantidad <
            cantidadAlbaranada
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes reducir el peso neto a ${preparacion.cantidad} ${preparacion.unidad} porque ya hay ${cantidadAlbaranada} ${registro.unidad || "kg"} reservados o entregados en albaranes.`

            };

        }


        const duplicado =
            this.buscarDuplicado(
                preparacion,
                datos,
                registro.id
            );


        if (
            duplicado
            &&
            datos.confirmarDuplicado !==
            true
        ) {

            return this.crearResultadoDuplicado(
                duplicado
            );

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

                const ocupaStock =
                    albaran?.facturado ===
                    true
                    ||
                    albaran?.estado ===
                    "Pendiente"
                    ||
                    albaran?.estado ===
                    "Entregado"
                    ||
                    albaran?.estado ===
                    "Facturado";


                if (
                    !ocupaStock
                ) {

                    return;

                }


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


        return Number(
            total.toFixed(
                2
            )
        );

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
                        albaranes.length ===
                        1
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