import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    normalizarTexto
} from "./utils.js";


export class CampaniaService {

    constructor(
        fincaService
    ) {

        this.fincaService =
            fincaService;

        this.campanias =
            StorageService
                .obtenerCampanias();


        if (
            !Array.isArray(
                this.campanias
            )
        ) {

            this.campanias =
                [];

        }

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtenerTodas() {

        return this.campanias;

    }


    obtenerTodos() {

        return this.campanias;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.campanias
                .find(
                    campania =>
                        mismoId(
                            campania.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // ACTIVAS
    // =====================================================

    obtenerActivas() {

        return this.campanias
            .filter(
                campania =>
                    campania.estado ===
                    "Activa"
            );

    }


    // =====================================================
    // CERRADAS
    // =====================================================

    obtenerCerradas() {

        return this.campanias
            .filter(
                campania =>
                    campania.estado ===
                    "Cerrada"
            );

    }


    // =====================================================
    // POR FINCA
    // =====================================================

    obtenerPorFinca(
        fincaId
    ) {

        return this.campanias
            .filter(
                campania =>
                    mismoId(
                        campania.fincaId,
                        fincaId
                    )
            );

    }


    // =====================================================
    // VALIDAR DATOS
    // =====================================================

    validar(
        datos,
        idIgnorado = null
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
                    "Los datos de la campanya no son válidos."

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
                    "Introduce el nombre de la campanya."

            };

        }


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


        if (
            !datos.fechaInicio
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce la fecha de inicio."

            };

        }


        if (
            datos.fechaFin
            &&
            datos.fechaFin <
            datos.fechaInicio
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La fecha de fin no puede ser anterior a la fecha de inicio."

            };

        }


        const estado =
            String(
                datos.estado
                ??
                "Activa"
            )
                .trim();


        if (
            ![
                "Activa",
                "Cerrada"
            ].includes(
                estado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El estado de la campanya no es válido."

            };

        }


        const nombreNormalizado =
            normalizarTexto(
                nombre
            );


        const duplicada =
            this.campanias
                .some(
                    campania => {

                        if (
                            idIgnorado !==
                            null
                            &&
                            mismoId(
                                campania.id,
                                idIgnorado
                            )
                        ) {

                            return false;

                        }


                        return (
                            mismoId(
                                campania.fincaId,
                                finca.id
                            )
                            &&
                            normalizarTexto(
                                campania.nombre
                            )
                            ===
                            nombreNormalizado
                        );

                    }
                );


        if (
            duplicada
        ) {

            return {

                ok:
                    false,

                mensaje:
                    idIgnorado !==
                    null
                        ? "Ya existe otra campanya con ese nombre en esta finca."
                        : "Ya existe una campanya con ese nombre en esta finca."

            };

        }


        return {

            ok:
                true,

            finca:
                finca,

            nombre:
                nombre,

            estado:
                estado

        };

    }


    // =====================================================
    // NORMALIZAR DATOS
    // =====================================================

    normalizarDatos(
        datos,
        finca,
        nombre,
        estado
    ) {

        let fechaFin =
            String(
                datos.fechaFin
                ??
                ""
            )
                .trim();


        if (
            estado ===
            "Cerrada"
            &&
            !fechaFin
        ) {

            fechaFin =
                this.obtenerFechaHoy();

        }


        return {

            nombre:
                nombre,

            fincaId:
                finca.id,

            fincaNombre:
                finca.nombre,

            fechaInicio:
                String(
                    datos.fechaInicio
                    ??
                    ""
                )
                    .trim(),

            fechaFin:
                fechaFin,

            estado:
                estado,

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


        const ahora =
            new Date()
                .toISOString();


        const nuevaCampania = {

            id:
                generarId(),

            ...this.normalizarDatos(
                datos,
                validacion.finca,
                validacion.nombre,
                validacion.estado
            ),

            fechaCreacion:
                ahora,

            fechaModificacion:
                ahora

        };


        this.campanias.push(
            nuevaCampania
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.campanias =
                this.campanias
                    .filter(
                        campania =>
                            !mismoId(
                                campania.id,
                                nuevaCampania.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar la campanya."

            };

        }


        return {

            ok:
                true,

            campania:
                nuevaCampania

        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La campanya no existe."

            };

        }


        const validacion =
            this.validar(
                datos,
                campania.id
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const fincaCambia =
            !mismoId(
                campania.fincaId,
                validacion.finca.id
            );


        if (
            fincaCambia
        ) {

            const vinculos =
                this.obtenerVinculos(
                    campania.id
                );


            if (
                vinculos.total >
                0
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        `No puedes cambiar la finca de esta campanya porque tiene información vinculada: ${this.formatearVinculos(
                            vinculos
                        )}.`

                };

            }

        }


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    campania
                )
            );


        Object.assign(
            campania,
            this.normalizarDatos(
                datos,
                validacion.finca,
                validacion.nombre,
                validacion.estado
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
                campania,
                estadoAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios de la campanya."

            };

        }


        return {

            ok:
                true,

            campania:
                campania

        };

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        estado
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La campanya no existe."

            };

        }


        if (
            ![
                "Activa",
                "Cerrada"
            ].includes(
                estado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El estado de la campanya no es válido."

            };

        }


        const estadoAnterior =
            {

                estado:
                    campania.estado,

                fechaFin:
                    campania.fechaFin,

                fechaModificacion:
                    campania.fechaModificacion

            };


        campania.estado =
            estado;


        if (
            estado ===
            "Cerrada"
            &&
            !campania.fechaFin
        ) {

            campania.fechaFin =
                this.obtenerFechaHoy();

        }


        /*
         * Al reabrir mantenemos fechaFin.
         * Así conservamos la información histórica.
         */

        campania.fechaModificacion =
            new Date()
                .toISOString();


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            campania.estado =
                estadoAnterior.estado;

            campania.fechaFin =
                estadoAnterior.fechaFin;

            campania.fechaModificacion =
                estadoAnterior.fechaModificacion;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido cambiar el estado de la campanya."

            };

        }


        return {

            ok:
                true,

            campania:
                campania

        };

    }


    // =====================================================
    // COMPROBAR VÍNCULOS
    // =====================================================

    obtenerVinculos(
        id
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {

                cultivos:
                    0,

                produccion:
                    0,

                trabajos:
                    0,

                gastos:
                    0,

                lineasAlbaran:
                    0,

                cuaderno:
                    0,

                tratamientos:
                    0,

                total:
                    0

            };

        }


        const cultivos =
            this.obtenerStorage(
                "obtenerCultivos"
            );


        const produccion =
            this.obtenerStorage(
                "obtenerProduccion"
            );


        const trabajos =
            this.obtenerStorage(
                "obtenerTrabajos"
            );


        const gastos =
            this.obtenerStorage(
                "obtenerGastos"
            );


        const albaranes =
            this.obtenerStorage(
                "obtenerAlbaranes"
            );


        const cuaderno =
            this.obtenerStorage(
                "obtenerCuadernoCampo"
            );


        const tratamientos =
            this.obtenerStorage(
                "obtenerTratamientos"
            );


        const coincide =
            registro => {

                if (
                    registro
                    &&
                    registro.campaniaId !==
                    null
                    &&
                    registro.campaniaId !==
                    undefined
                    &&
                    mismoId(
                        registro.campaniaId,
                        campania.id
                    )
                ) {

                    return true;

                }


                /*
                 * Compatibilidad con datos antiguos que
                 * pudieran guardar solo el nombre.
                 */

                return (
                    registro
                    &&
                    registro.campaniaNombre
                    &&
                    normalizarTexto(
                        registro.campaniaNombre
                    )
                    ===
                    normalizarTexto(
                        campania.nombre
                    )
                );

            };


        const cultivosVinculados =
            cultivos
                .filter(
                    coincide
                )
                .length;


        const produccionVinculada =
            produccion
                .filter(
                    coincide
                )
                .length;


        const trabajosVinculados =
            trabajos
                .filter(
                    coincide
                )
                .length;


        const gastosVinculados =
            gastos
                .filter(
                    coincide
                )
                .length;


        const cuadernoVinculado =
            cuaderno
                .filter(
                    coincide
                )
                .length;


        const tratamientosVinculados =
            tratamientos
                .filter(
                    coincide
                )
                .length;


        let lineasAlbaran =
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


                    lineas
                        .forEach(
                            linea => {

                                if (
                                    coincide(
                                        linea
                                    )
                                ) {

                                    lineasAlbaran++;

                                }

                            }
                        );

                }
            );


        return {

            cultivos:
                cultivosVinculados,

            produccion:
                produccionVinculada,

            trabajos:
                trabajosVinculados,

            gastos:
                gastosVinculados,

            lineasAlbaran:
                lineasAlbaran,

            cuaderno:
                cuadernoVinculado,

            tratamientos:
                tratamientosVinculados,

            total:
                cultivosVinculados
                +
                produccionVinculada
                +
                trabajosVinculados
                +
                gastosVinculados
                +
                lineasAlbaran
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
            vinculos.cultivos >
            0
        ) {

            partes.push(
                `${vinculos.cultivos} cultivo${
                    vinculos.cultivos === 1
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
                    vinculos.produccion === 1
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


        if (
            vinculos.lineasAlbaran >
            0
        ) {

            partes.push(
                `${vinculos.lineasAlbaran} línea${
                    vinculos.lineasAlbaran === 1
                        ? ""
                        : "s"
                } de albarán`
            );

        }


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


        return partes.join(
            ", "
        );

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const campania =
            this.obtenerPorId(
                id
            );


        if (
            !campania
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La campanya no existe."

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
                    `No puedes eliminar esta campanya porque tiene información vinculada: ${this.formatearVinculos(
                        vinculos
                    )}. Si ha terminado, ciérrala en lugar de eliminarla.`

            };

        }


        const campaniasAnteriores =
            [
                ...this.campanias
            ];


        this.campanias =
            this.campanias
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

            this.campanias =
                campaniasAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar la campanya."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // STORAGE SEGURO
    // =====================================================

    obtenerStorage(
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
                `Error obteniendo vínculos de Campanya mediante ${metodo}:`,
                error
            );


            return [];

        }

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarCampanias(
                this.campanias
            );

    }


    // =====================================================
    // FECHA
    // =====================================================

    obtenerFechaHoy() {

        return StorageService
            .obtenerFechaLocal(
                new Date()
            );

    }

}