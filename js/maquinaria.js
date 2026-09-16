import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";


export class MaquinariaService {

    constructor() {

        this.maquinas =
            StorageService
                .obtenerMaquinaria();


        if (
            !Array.isArray(
                this.maquinas
            )
        ) {

            this.maquinas =
                [];

        }

    }


    // =====================================================
    // OBTENER TODAS
    // =====================================================

    obtenerTodas() {

        return this.maquinas;

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.maquinas;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.maquinas
                .find(
                    maquina =>
                        mismoId(
                            maquina.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // OBTENER ACTIVAS
    // =====================================================

    obtenerActivas() {

        return this.maquinas
            .filter(
                maquina =>
                    maquina.estado ===
                    "Activa"
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
                    "Los datos de la máquina no son válidos."

            };

        }


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
                    "El nombre de la máquina es obligatorio."

            };

        }


        const horasUso =
            numeroSeguro(
                datos.horasUso,
                0
            );


        if (
            horasUso <
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Las horas de uso no pueden ser negativas."

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

            tipo:
                String(
                    datos.tipo
                    ??
                    ""
                )
                    .trim(),

            marca:
                String(
                    datos.marca
                    ??
                    ""
                )
                    .trim(),

            modelo:
                String(
                    datos.modelo
                    ??
                    ""
                )
                    .trim(),

            matricula:
                String(
                    datos.matricula
                    ??
                    ""
                )
                    .trim(),

            estado:
                String(
                    datos.estado
                    ??
                    "Activa"
                )
                    .trim()
                ||
                "Activa",

            horasUso:
                numeroSeguro(
                    datos.horasUso,
                    0
                ),

            proximaRevision:
                String(
                    datos.proximaRevision
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


        const nuevaMaquina = {

            id:
                generarId(),

            ...this.normalizarDatos(
                datos
            )

        };


        this.maquinas.push(
            nuevaMaquina
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.maquinas =
                this.maquinas
                    .filter(
                        maquina =>
                            !mismoId(
                                maquina.id,
                                nuevaMaquina.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar la máquina."

            };

        }


        return {

            ok:
                true,

            maquina:
                nuevaMaquina

        };

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar(
        id,
        datos
    ) {

        const maquina =
            this.obtenerPorId(
                id
            );


        if (
            !maquina
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La máquina no existe."

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


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    maquina
                )
            );


        Object.assign(
            maquina,
            this.normalizarDatos(
                datos
            )
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            Object.assign(
                maquina,
                estadoAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios de la máquina."

            };

        }


        return {

            ok:
                true,

            maquina:
                maquina

        };

    }


    // =====================================================
    // VÍNCULOS
    // =====================================================

    obtenerVinculos(
        maquinariaId
    ) {

        const cuaderno =
            this.obtenerStorageSeguro(
                "obtenerCuadernoCampo"
            );


        const tratamientos =
            this.obtenerStorageSeguro(
                "obtenerTratamientos"
            );


        const trabajos =
            this.obtenerStorageSeguro(
                "obtenerTrabajos"
            );


        const gastos =
            this.obtenerStorageSeguro(
                "obtenerGastos"
            );


        const cuadernoVinculado =
            cuaderno
                .filter(
                    registro =>
                        mismoId(
                            registro.maquinariaId,
                            maquinariaId
                        )
                )
                .length;


        const tratamientosVinculados =
            tratamientos
                .filter(
                    tratamiento =>
                        mismoId(
                            tratamiento.maquinariaId,
                            maquinariaId
                        )
                )
                .length;


        const trabajosVinculados =
            trabajos
                .filter(
                    trabajo =>
                        this.elementoTieneMaquinaria(
                            trabajo,
                            maquinariaId
                        )
                )
                .length;


        const gastosVinculados =
            gastos
                .filter(
                    gasto =>
                        this.elementoTieneMaquinaria(
                            gasto,
                            maquinariaId
                        )
                )
                .length;


        return {

            cuaderno:
                cuadernoVinculado,

            tratamientos:
                tratamientosVinculados,

            trabajos:
                trabajosVinculados,

            gastos:
                gastosVinculados,

            total:
                cuadernoVinculado
                +
                tratamientosVinculados
                +
                trabajosVinculados
                +
                gastosVinculados

        };

    }


    // =====================================================
    // ELEMENTO TIENE MAQUINARIA
    // =====================================================

    elementoTieneMaquinaria(
        elemento,
        maquinariaId
    ) {

        if (
            !elemento
        ) {

            return false;

        }


        if (
            mismoId(
                elemento.maquinariaId,
                maquinariaId
            )
        ) {

            return true;

        }


        if (
            Array.isArray(
                elemento.maquinariaIds
            )
            &&
            elemento.maquinariaIds
                .some(
                    id =>
                        mismoId(
                            id,
                            maquinariaId
                        )
                )
        ) {

            return true;

        }


        return false;

    }


    // =====================================================
    // FORMATEAR VÍNCULOS
    // =====================================================

    formatearVinculos(
        vinculos
    ) {

        const partes =
            [];


        if (
            vinculos.cuaderno >
            0
        ) {

            partes.push(
                `${vinculos.cuaderno} registro${
                    vinculos.cuaderno === 1
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
                    vinculos.tratamientos === 1
                        ? ""
                        : "s"
                }`
            );

        }


        if (
            vinculos.trabajos >
            0
        ) {

            partes.push(
                `${vinculos.trabajos} trabajo${
                    vinculos.trabajos === 1
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
                    vinculos.gastos === 1
                        ? ""
                        : "s"
                }`
            );

        }


        return partes.join(
            ", "
        );

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
                `Error comprobando vínculos de maquinaria mediante ${metodo}:`,
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

        const maquina =
            this.obtenerPorId(
                id
            );


        if (
            !maquina
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La máquina no existe."

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

            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar la máquina "${maquina.nombre}" porque tiene información vinculada: ${this.formatearVinculos(
                        vinculos
                    )}.`

            };

        }


        const maquinasAnteriores =
            [
                ...this.maquinas
            ];


        this.maquinas =
            this.maquinas
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

            this.maquinas =
                maquinasAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar la máquina."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // NOMBRE COMPLETO
    // =====================================================

    obtenerNombreCompleto(
        maquina
    ) {

        if (
            !maquina
        ) {

            return "";

        }


        return [
            maquina.nombre,
            maquina.marca,
            maquina.modelo
        ]
            .filter(
                Boolean
            )
            .join(
                " · "
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarMaquinaria(
                this.maquinas
            );

    }

}