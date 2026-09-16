import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";


export class FincaService {

    constructor() {

        this.fincas =
            StorageService
                .obtenerFincas();


        if (
            !Array.isArray(
                this.fincas
            )
        ) {

            this.fincas =
                [];

        }

    }


    // =====================================================
    // OBTENER TODAS
    // =====================================================

    obtenerTodas() {

        return this.fincas;

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.fincas;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.fincas
                .find(
                    finca =>
                        mismoId(
                            finca.id,
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
        nombre,
        ubicacion,
        superficie,
        notas
    ) {

        const nombreLimpio =
            String(
                nombre
                ??
                ""
            )
                .trim();


        if (
            !nombreLimpio
        ) {

            return null;

        }


        const superficieNumerica =
            numeroSeguro(
                superficie,
                0
            );


        if (
            superficieNumerica <
            0
        ) {

            return null;

        }


        const nuevaFinca = {

            id:
                generarId(),

            nombre:
                nombreLimpio,

            ubicacion:
                String(
                    ubicacion
                    ??
                    ""
                )
                    .trim(),

            superficie:
                superficieNumerica,

            notas:
                String(
                    notas
                    ??
                    ""
                )
                    .trim(),

            parcelas:
                []

        };


        this.fincas.push(
            nuevaFinca
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.fincas =
                this.fincas
                    .filter(
                        finca =>
                            !mismoId(
                                finca.id,
                                nuevaFinca.id
                            )
                    );


            return null;

        }


        return nuevaFinca;

    }


    // =====================================================
    // VÍNCULOS / TRAZABILIDAD
    // =====================================================

    obtenerVinculos(
        id
    ) {

        const finca =
            this.obtenerPorId(
                id
            );


        if (
            !finca
        ) {

            return {

                campanias:
                    0,

                cultivos:
                    0,

                produccion:
                    0,

                trabajos:
                    0,

                gastos:
                    0,

                albaranes:
                    0,

                incidencias:
                    0,

                cuaderno:
                    0,

                tratamientos:
                    0,

                total:
                    0

            };

        }


        const campanias =
            this.obtenerStorageSeguro(
                "obtenerCampanias"
            );


        const cultivos =
            this.obtenerStorageSeguro(
                "obtenerCultivos"
            );


        const produccion =
            this.obtenerStorageSeguro(
                "obtenerProduccion"
            );


        const trabajos =
            this.obtenerStorageSeguro(
                "obtenerTrabajos"
            );


        const gastos =
            this.obtenerStorageSeguro(
                "obtenerGastos"
            );


        const albaranes =
            this.obtenerStorageSeguro(
                "obtenerAlbaranes"
            );


        const incidencias =
            this.obtenerStorageSeguro(
                "obtenerIncidencias"
            );


        const cuaderno =
            this.obtenerStorageSeguro(
                "obtenerCuadernoCampo"
            );


        const tratamientos =
            this.obtenerStorageSeguro(
                "obtenerTratamientos"
            );


        const campaniasVinculadas =
            campanias
                .filter(
                    campania =>
                        mismoId(
                            campania.fincaId,
                            finca.id
                        )
                )
                .length;


        const cultivosVinculados =
            cultivos
                .filter(
                    cultivo =>
                        mismoId(
                            cultivo.fincaId,
                            finca.id
                        )
                )
                .length;


        const produccionVinculada =
            produccion
                .filter(
                    registro =>
                        mismoId(
                            registro.fincaId,
                            finca.id
                        )
                )
                .length;


        const trabajosVinculados =
            trabajos
                .filter(
                    trabajo =>
                        mismoId(
                            trabajo.fincaId,
                            finca.id
                        )
                )
                .length;


        const gastosVinculados =
            gastos
                .filter(
                    gasto =>
                        mismoId(
                            gasto.fincaId,
                            finca.id
                        )
                )
                .length;


        const incidenciasVinculadas =
            incidencias
                .filter(
                    incidencia =>
                        mismoId(
                            incidencia.fincaId,
                            finca.id
                        )
                )
                .length;


        const cuadernoVinculado =
            cuaderno
                .filter(
                    registro =>
                        mismoId(
                            registro.fincaId,
                            finca.id
                        )
                )
                .length;


        const tratamientosVinculados =
            tratamientos
                .filter(
                    tratamiento =>
                        mismoId(
                            tratamiento.fincaId,
                            finca.id
                        )
                )
                .length;


        let albaranesVinculados =
            0;


        albaranes
            .forEach(
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


                    if (
                        lineas.some(
                            linea =>
                                mismoId(
                                    linea.fincaId,
                                    finca.id
                                )
                        )
                    ) {

                        albaranesVinculados++;

                    }

                }
            );


        return {

            campanias:
                campaniasVinculadas,

            cultivos:
                cultivosVinculados,

            produccion:
                produccionVinculada,

            trabajos:
                trabajosVinculados,

            gastos:
                gastosVinculados,

            albaranes:
                albaranesVinculados,

            incidencias:
                incidenciasVinculadas,

            cuaderno:
                cuadernoVinculado,

            tratamientos:
                tratamientosVinculados,

            total:
                campaniasVinculadas
                +
                cultivosVinculados
                +
                produccionVinculada
                +
                trabajosVinculados
                +
                gastosVinculados
                +
                albaranesVinculados
                +
                incidenciasVinculadas
                +
                cuadernoVinculado
                +
                tratamientosVinculados

        };

    }


    // =====================================================
    // STORAGE SEGURO
    // =====================================================

    obtenerStorageSeguro(
        metodo
    ) {

        try {

            if (
                typeof StorageService[
                    metodo
                ]
                !==
                "function"
            ) {

                return [];

            }


            const datos =
                StorageService[
                    metodo
                ]();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch (
            error
        ) {

            console.error(
                `Error obteniendo datos para comprobar vínculos de finca mediante ${metodo}:`,
                error
            );


            return [];

        }

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const finca =
            this.obtenerPorId(
                id
            );


        if (
            !finca
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La finca no existe."

            };

        }


        const vinculos =
            this.obtenerVinculos(
                id
            );


        if (
            vinculos.total >
            0
        ) {

            const partes =
                [];


            if (
                vinculos.campanias >
                0
            ) {

                partes.push(
                    `${vinculos.campanias} campanya${
                        vinculos.campanias ===
                        1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.cultivos >
                0
            ) {

                partes.push(
                    `${vinculos.cultivos} cultivo${
                        vinculos.cultivos ===
                        1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.produccion >
                0
            ) {

                partes.push(
                    `${vinculos.produccion} registro${
                        vinculos.produccion ===
                        1
                            ? ""
                            : "s"
                    } de producción`
                );

            }


            if (
                vinculos.trabajos >
                0
            ) {

                partes.push(
                    `${vinculos.trabajos} trabajo${
                        vinculos.trabajos ===
                        1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.gastos >
                0
            ) {

                partes.push(
                    `${vinculos.gastos} gasto${
                        vinculos.gastos ===
                        1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.albaranes >
                0
            ) {

                partes.push(
                    `${vinculos.albaranes} albarán${
                        vinculos.albaranes ===
                        1
                            ? ""
                            : "es"
                    }`
                );

            }


            if (
                vinculos.incidencias >
                0
            ) {

                partes.push(
                    `${vinculos.incidencias} incidencia${
                        vinculos.incidencias ===
                        1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.cuaderno >
                0
            ) {

                partes.push(
                    `${vinculos.cuaderno} registro${
                        vinculos.cuaderno ===
                        1
                            ? ""
                            : "s"
                    } del cuaderno de campo`
                );

            }


            if (
                vinculos.tratamientos >
                0
            ) {

                partes.push(
                    `${vinculos.tratamientos} tratamiento${
                        vinculos.tratamientos ===
                        1
                            ? ""
                            : "s"
                    }`
                );

            }


            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar la finca "${finca.nombre}" porque tiene información vinculada: ${partes.join(
                        ", "
                    )}.`

            };

        }


        const fincasAnteriores =
            [
                ...this.fincas
            ];


        this.fincas =
            this.fincas
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

            this.fincas =
                fincasAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar la finca."

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
            .guardarFincas(
                this.fincas
            );

    }

}