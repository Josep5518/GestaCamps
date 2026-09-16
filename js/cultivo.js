import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";


export class CultivoService {

    constructor(
        fincaService,
        campaniaService
    ) {

        this.fincaService =
            fincaService;

        this.campaniaService =
            campaniaService;

        this.cultivos =
            StorageService
                .obtenerCultivos();


        if (
            !Array.isArray(
                this.cultivos
            )
        ) {

            this.cultivos =
                [];

        }

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.cultivos;

    }


    obtenerTodas() {

        return this.cultivos;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.cultivos
                .find(
                    cultivo =>
                        mismoId(
                            cultivo.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // ACTIVOS
    // =====================================================

    obtenerActivos() {

        return this.cultivos
            .filter(
                cultivo =>
                    cultivo.estado ===
                    "Activo"
            );

    }


    // =====================================================
    // POR FINCA
    // =====================================================

    obtenerPorFinca(
        fincaId
    ) {

        return this.cultivos
            .filter(
                cultivo =>
                    mismoId(
                        cultivo.fincaId,
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

        return this.cultivos
            .filter(
                cultivo =>
                    mismoId(
                        cultivo.campaniaId,
                        campaniaId
                    )
            );

    }


    // =====================================================
    // VALIDAR CAMPANYA / FINCA
    // =====================================================

    validarCampaniaFinca(
        campania,
        finca
    ) {

        if (
            !campania
        ) {

            return {
                ok:
                    true
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
                    "La campanya seleccionada no pertenece a la finca seleccionada."

            };

        }


        return {
            ok:
                true
        };

    }


    // =====================================================
    // VALIDAR DATOS
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
                    "Los datos del cultivo no son válidos."

            };

        }


        if (
            !datos.tipo
            ||
            !String(
                datos.tipo
            )
                .trim()
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce el tipo de cultivo."

            };

        }


        if (
            !datos.variedad
            ||
            !String(
                datos.variedad
            )
                .trim()
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce la variedad."

            };

        }


        const superficie =
            numeroSeguro(
                datos.superficie,
                0
            );


        if (
            superficie <
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La superficie no puede ser negativa."

            };

        }


        const estado =
            String(
                datos.estado
                ??
                "Activo"
            )
                .trim();


        if (
            ![
                "Activo",
                "Inactivo"
            ].includes(
                estado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El estado del cultivo no es válido."

            };

        }


        return {
            ok:
                true
        };

    }


    // =====================================================
    // OBTENER RELACIONES
    // =====================================================

    obtenerRelaciones(
        datos
    ) {

        const finca =
            this.fincaService
                .obtenerPorId(
                    datos.fincaId
                );


        if (
            !finca
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona una finca válida."

            };

        }


        let campania =
            null;


        if (
            datos.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        datos.campaniaId
                    );


            if (
                !campania
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La campanya seleccionada no existe."

                };

            }


            const validacion =
                this.validarCampaniaFinca(
                    campania,
                    finca
                );


            if (
                !validacion.ok
            ) {

                return validacion;

            }

        }


        return {

            ok:
                true,

            finca:
                finca,

            campania:
                campania

        };

    }


    // =====================================================
    // NORMALIZAR DATOS
    // =====================================================

    normalizarDatos(
        datos,
        finca,
        campania
    ) {

        return {

            tipo:
                String(
                    datos.tipo
                    ??
                    ""
                )
                    .trim(),

            variedad:
                String(
                    datos.variedad
                    ??
                    ""
                )
                    .trim(),

            fincaId:
                finca.id,

            fincaNombre:
                finca.nombre,

            parcela:
                String(
                    datos.parcela
                    ??
                    ""
                )
                    .trim(),

            superficie:
                numeroSeguro(
                    datos.superficie,
                    0
                ),

            estado:
                String(
                    datos.estado
                    ??
                    "Activo"
                )
                    .trim()
                ||
                "Activo",

            fechaInicio:
                String(
                    datos.fechaInicio
                    ??
                    ""
                )
                    .trim(),

            campaniaId:
                campania
                    ? campania.id
                    : null,

            campaniaNombre:
                campania
                    ? campania.nombre
                    : "",

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


        const relaciones =
            this.obtenerRelaciones(
                datos
            );


        if (
            !relaciones.ok
        ) {

            return relaciones;

        }


        const ahora =
            new Date()
                .toISOString();


        const nuevoCultivo = {

            id:
                generarId(),

            ...this.normalizarDatos(
                datos,
                relaciones.finca,
                relaciones.campania
            ),

            fechaCreacion:
                ahora,

            fechaModificacion:
                ahora

        };


        this.cultivos.push(
            nuevoCultivo
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.cultivos =
                this.cultivos
                    .filter(
                        cultivo =>
                            !mismoId(
                                cultivo.id,
                                nuevoCultivo.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el cultivo."

            };

        }


        return {

            ok:
                true,

            cultivo:
                nuevoCultivo

        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const cultivo =
            this.obtenerPorId(
                id
            );


        if (
            !cultivo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El cultivo no existe."

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


        const relaciones =
            this.obtenerRelaciones(
                datos
            );


        if (
            !relaciones.ok
        ) {

            return relaciones;

        }


        const finca =
            relaciones.finca;


        const campania =
            relaciones.campania;


        const fincaCambia =
            !mismoId(
                cultivo.fincaId,
                finca.id
            );


        const campaniaCambia =
            (
                cultivo.campaniaId ===
                null
                &&
                campania !==
                null
            )
            ||
            (
                cultivo.campaniaId !==
                null
                &&
                campania ===
                null
            )
            ||
            (
                cultivo.campaniaId !==
                null
                &&
                campania !==
                null
                &&
                !mismoId(
                    cultivo.campaniaId,
                    campania.id
                )
            );


        if (
            fincaCambia
            ||
            campaniaCambia
        ) {

            const vinculos =
                this.obtenerVinculos(
                    cultivo.id
                );


            if (
                vinculos.total >
                0
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        `No puedes cambiar la finca ni la campanya de este cultivo porque tiene información vinculada: ${this.formatearVinculos(
                            vinculos
                        )}.`

                };

            }

        }


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    cultivo
                )
            );


        Object.assign(
            cultivo,
            this.normalizarDatos(
                datos,
                finca,
                campania
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
                cultivo,
                estadoAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios del cultivo."

            };

        }


        return {

            ok:
                true,

            cultivo:
                cultivo

        };

    }


    // =====================================================
    // VÍNCULOS / TRAZABILIDAD
    // =====================================================

    obtenerVinculos(
        cultivoId
    ) {

        const produccion =
            this.obtenerStorageSeguro(
                "obtenerProduccion"
            );


        const trabajos =
            this.obtenerStorageSeguro(
                "obtenerTrabajos"
            );


        const cuaderno =
            this.obtenerStorageSeguro(
                "obtenerCuadernoCampo"
            );


        const tratamientos =
            this.obtenerStorageSeguro(
                "obtenerTratamientos"
            );


        const produccionVinculada =
            produccion
                .filter(
                    registro =>
                        mismoId(
                            registro.cultivoId,
                            cultivoId
                        )
                )
                .length;


        const trabajosVinculados =
            trabajos
                .filter(
                    trabajo =>
                        mismoId(
                            trabajo.cultivoId,
                            cultivoId
                        )
                )
                .length;


        const cuadernoVinculado =
            cuaderno
                .filter(
                    registro =>
                        mismoId(
                            registro.cultivoId,
                            cultivoId
                        )
                )
                .length;


        const tratamientosVinculados =
            tratamientos
                .filter(
                    tratamiento =>
                        mismoId(
                            tratamiento.cultivoId,
                            cultivoId
                        )
                )
                .length;


        return {

            produccion:
                produccionVinculada,

            trabajos:
                trabajosVinculados,

            cuaderno:
                cuadernoVinculado,

            tratamientos:
                tratamientosVinculados,

            total:
                produccionVinculada
                +
                trabajosVinculados
                +
                cuadernoVinculado
                +
                tratamientosVinculados

        };

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
                `Error obteniendo vínculos del cultivo mediante ${metodo}:`,
                error
            );


            return [];

        }

    }


    // =====================================================
    // PRODUCCIÓN VINCULADA
    // =====================================================

    obtenerProduccionVinculada(
        cultivoId
    ) {

        return this.obtenerStorageSeguro(
            "obtenerProduccion"
        )
            .filter(
                registro =>
                    mismoId(
                        registro.cultivoId,
                        cultivoId
                    )
            );

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const cultivo =
            this.obtenerPorId(
                id
            );


        if (
            !cultivo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El cultivo no existe."

            };

        }


        const vinculos =
            this.obtenerVinculos(
                cultivo.id
            );


        if (
            vinculos.total >
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar este cultivo porque tiene información vinculada: ${this.formatearVinculos(
                        vinculos
                    )}. Puedes marcarlo como inactivo para conservar la trazabilidad.`

            };

        }


        const cultivosAnteriores =
            [
                ...this.cultivos
            ];


        this.cultivos =
            this.cultivos
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

            this.cultivos =
                cultivosAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el cultivo."

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
            .guardarCultivos(
                this.cultivos
            );

    }

}