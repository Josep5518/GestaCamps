import { StorageService } from "./storage.js";
import { mismoId } from "./utils.js";


export class CuadernoCampoService {

    constructor() {

        this.registros =
            StorageService
                .obtenerCuadernoCampo();

    }


    // =====================================================
    // TODOS
    // =====================================================

    obtenerTodos() {

        return [...this.registros]
            .sort(
                (a, b) => {

                    const fechaA =
                        new Date(
                            `${a.fecha}T${a.hora || "00:00"}`
                        );


                    const fechaB =
                        new Date(
                            `${b.fecha}T${b.hora || "00:00"}`
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
    // POR ID
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

        return this
            .obtenerTodos()
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

        return this
            .obtenerTodos()
            .filter(
                registro =>
                    mismoId(
                        registro.campaniaId,
                        campaniaId
                    )
            );

    }


    // =====================================================
    // POR TIPO
    // =====================================================

    obtenerPorTipo(
        tipoActuacion
    ) {

        return this
            .obtenerTodos()
            .filter(
                registro =>
                    registro.tipoActuacion ===
                    tipoActuacion
            );

    }


    // =====================================================
    // TIPOS DE ACTUACIÓN
    // =====================================================

    obtenerTiposActuacion() {

        return [

            "Riego",

            "Poda",

            "Abonado",

            "Tratamiento fitosanitario",

            "Recolección",

            "Laboreo",

            "Siembra / plantación",

            "Mantenimiento",

            "Otro"

        ];

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
            new Date();


        const usuario =
            StorageService
                .obtenerUsuarioActual();


        const registro = {

            id:
                StorageService
                    .generarId(),

            fecha:
                datos.fecha,

            hora:
                datos.hora
                ||
                "",

            tipoActuacion:
                datos.tipoActuacion
                    .trim(),

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
                    ? this.obtenerNombreCultivo(
                        relaciones.cultivo
                    )
                    : "",

            trabajadorIds:
                relaciones.trabajadores
                    .map(
                        trabajador =>
                            trabajador.id
                    ),

            trabajadorNombres:
                relaciones.trabajadores
                    .map(
                        trabajador =>
                            this.obtenerNombreTrabajador(
                                trabajador
                            )
                    ),

            maquinariaId:
                relaciones.maquinaria
                    ? relaciones.maquinaria.id
                    : null,

            maquinariaNombre:
                relaciones.maquinaria
                    ? this.obtenerNombreMaquinaria(
                        relaciones.maquinaria
                    )
                    : "",

            productoInventarioId:
                relaciones.producto
                    ? relaciones.producto.id
                    : null,

            productoNombre:
                relaciones.producto
                    ? this.obtenerNombreProducto(
                        relaciones.producto
                    )
                    : "",

            cantidad:
                datos.cantidad !==
                ""
                    ? Number(
                        datos.cantidad
                    )
                    : null,

            unidad:
                datos.unidad
                ||
                "",

            dosis:
                datos.dosis
                    ?.trim()
                ||
                "",

            descripcion:
                datos.descripcion
                    ?.trim()
                ||
                "",

            observaciones:
                datos.observaciones
                    ?.trim()
                ||
                "",

            creadoPorTipo:
                usuario?.tipo
                ||
                "admin",

            creadoPorId:
                usuario?.id
                ??
                null,

            creadoPorNombre:
                usuario?.nombre
                ||
                "Administrador",

            fechaCreacion:
                ahora.toISOString(),

            fechaModificacion:
                ahora.toISOString()

        };


        this.registros.push(
            registro
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.registros =
                this.registros
                    .filter(
                        item =>
                            !mismoId(
                                item.id,
                                registro.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar la actuación."

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
                    "El registro del cuaderno no existe."

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


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    registro
                )
            );


        registro.fecha =
            datos.fecha;


        registro.hora =
            datos.hora
            ||
            "";


        registro.tipoActuacion =
            datos.tipoActuacion
                .trim();


        registro.fincaId =
            relaciones.finca.id;


        registro.fincaNombre =
            relaciones.finca.nombre;


        registro.campaniaId =
            relaciones.campania
                ? relaciones.campania.id
                : null;


        registro.campaniaNombre =
            relaciones.campania
                ? relaciones.campania.nombre
                : "";


        registro.cultivoId =
            relaciones.cultivo
                ? relaciones.cultivo.id
                : null;


        registro.cultivoNombre =
            relaciones.cultivo
                ? this.obtenerNombreCultivo(
                    relaciones.cultivo
                )
                : "";


        registro.trabajadorIds =
            relaciones.trabajadores
                .map(
                    trabajador =>
                        trabajador.id
                );


        registro.trabajadorNombres =
            relaciones.trabajadores
                .map(
                    trabajador =>
                        this.obtenerNombreTrabajador(
                            trabajador
                        )
                );


        registro.maquinariaId =
            relaciones.maquinaria
                ? relaciones.maquinaria.id
                : null;


        registro.maquinariaNombre =
            relaciones.maquinaria
                ? this.obtenerNombreMaquinaria(
                    relaciones.maquinaria
                )
                : "";


        registro.productoInventarioId =
            relaciones.producto
                ? relaciones.producto.id
                : null;


        registro.productoNombre =
            relaciones.producto
                ? this.obtenerNombreProducto(
                    relaciones.producto
                )
                : "";


        registro.cantidad =
            datos.cantidad !==
            ""
                ? Number(
                    datos.cantidad
                )
                : null;


        registro.unidad =
            datos.unidad
            ||
            "";


        registro.dosis =
            datos.dosis
                ?.trim()
            ||
            "";


        registro.descripcion =
            datos.descripcion
                ?.trim()
            ||
            "";


        registro.observaciones =
            datos.observaciones
                ?.trim()
            ||
            "";


        registro.fechaModificacion =
            new Date()
                .toISOString();


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
                    "No se han podido guardar los cambios."

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
                    "El registro del cuaderno no existe."

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
                    "No se ha podido eliminar la actuación."

            };

        }


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
                    "Los datos de la actuación no son válidos."

            };

        }


        if (
            !datos.fecha
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce la fecha de la actuación."

            };

        }


        if (
            !datos.tipoActuacion
            ||
            !datos.tipoActuacion.trim()
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona el tipo de actuación."

            };

        }


        if (
            !this.obtenerTiposActuacion()
                .includes(
                    datos.tipoActuacion.trim()
                )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El tipo de actuación no es válido."

            };

        }


        if (
            datos.fincaId ===
            null
            ||
            datos.fincaId ===
            undefined
            ||
            String(
                datos.fincaId
            ).trim() ===
            ""
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona una finca."

            };

        }


        if (
            datos.cantidad !==
            ""
            &&
            datos.cantidad !==
            null
            &&
            datos.cantidad !==
            undefined
            &&
            (
                Number.isNaN(
                    Number(
                        datos.cantidad
                    )
                )
                ||
                Number(
                    datos.cantidad
                )
                <
                0
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La cantidad no es válida."

            };

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

        const fincas =
            StorageService
                .obtenerFincas();


        const campanias =
            StorageService
                .obtenerCampanias();


        const cultivos =
            StorageService
                .obtenerCultivos();


        const trabajadores =
            StorageService
                .obtenerTrabajadores();


        const maquinaria =
            StorageService
                .obtenerMaquinaria();


        const inventario =
            StorageService
                .obtenerInventario();


        // =================================================
        // FINCA
        // =================================================

        const finca =
            fincas.find(
                item =>
                    mismoId(
                        item.id,
                        datos.fincaId
                    )
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


        // =================================================
        // CAMPANYA
        // =================================================

        let campania =
            null;


        if (
            datos.campaniaId !==
            null
            &&
            datos.campaniaId !==
            undefined
            &&
            String(
                datos.campaniaId
            ).trim() !==
            ""
        ) {

            campania =
                campanias.find(
                    item =>
                        mismoId(
                            item.id,
                            datos.campaniaId
                        )
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
                        "La campanya no pertenece a la finca seleccionada."

                };

            }

        }


        // =================================================
        // CULTIVO
        // =================================================

        let cultivo =
            null;


        if (
            datos.cultivoId !==
            null
            &&
            datos.cultivoId !==
            undefined
            &&
            String(
                datos.cultivoId
            ).trim() !==
            ""
        ) {

            cultivo =
                cultivos.find(
                    item =>
                        mismoId(
                            item.id,
                            datos.cultivoId
                        )
                );


            if (
                !cultivo
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "El cultivo seleccionado no existe."

                };

            }


            if (
                cultivo.fincaId !==
                null
                &&
                cultivo.fincaId !==
                undefined
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
                        "El cultivo no pertenece a la finca seleccionada."

                };

            }

        }


        // =================================================
        // TRABAJADORES
        // =================================================

        const trabajadorIds =
            Array.isArray(
                datos.trabajadorIds
            )
                ? [
                    ...new Set(
                        datos.trabajadorIds
                            .filter(
                                id =>
                                    id !==
                                    null
                                    &&
                                    id !==
                                    undefined
                                    &&
                                    String(
                                        id
                                    ).trim() !==
                                    ""
                            )
                            .map(
                                id =>
                                    String(
                                        id
                                    )
                            )
                    )
                ]
                : [];


        const trabajadoresSeleccionados =
            trabajadorIds
                .map(
                    id =>
                        trabajadores.find(
                            trabajador =>
                                mismoId(
                                    trabajador.id,
                                    id
                                )
                        )
                        ||
                        null
                )
                .filter(
                    Boolean
                );


        if (
            trabajadoresSeleccionados.length !==
            trabajadorIds.length
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Uno o varios trabajadores seleccionados ya no existen."

            };

        }


        // =================================================
        // MAQUINARIA
        // =================================================

        let maquina =
            null;


        if (
            datos.maquinariaId !==
            null
            &&
            datos.maquinariaId !==
            undefined
            &&
            String(
                datos.maquinariaId
            ).trim() !==
            ""
        ) {

            maquina =
                maquinaria.find(
                    item =>
                        mismoId(
                            item.id,
                            datos.maquinariaId
                        )
                )
                ||
                null;


            if (
                !maquina
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "La maquinaria seleccionada no existe."

                };

            }

        }


        // =================================================
        // PRODUCTO / MATERIAL
        // =================================================

        let producto =
            null;


        if (
            datos.productoInventarioId !==
            null
            &&
            datos.productoInventarioId !==
            undefined
            &&
            String(
                datos.productoInventarioId
            ).trim() !==
            ""
        ) {

            producto =
                inventario.find(
                    item =>
                        mismoId(
                            item.id,
                            datos.productoInventarioId
                        )
                )
                ||
                null;


            if (
                !producto
            ) {

                return {

                    ok:
                        false,

                    mensaje:
                        "El producto o material seleccionado no existe en el inventario."

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

            trabajadores:
                trabajadoresSeleccionados,

            maquinaria:
                maquina,

            producto:
                producto

        };

    }


    // =====================================================
    // NOMBRES
    // =====================================================

    obtenerNombreTrabajador(
        trabajador
    ) {

        return [
            trabajador.nombre,
            trabajador.apellidos
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            );

    }


    obtenerNombreCultivo(
        cultivo
    ) {

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
            `Cultivo ${cultivo.id}`
        );

    }


    obtenerNombreMaquinaria(
        maquinaria
    ) {

        return (
            maquinaria.nombre
            ||
            [
                maquinaria.marca,
                maquinaria.modelo
            ]
                .filter(
                    Boolean
                )
                .join(
                    " "
                )
            ||
            `Maquinaria ${maquinaria.id}`
        );

    }


    obtenerNombreProducto(
        producto
    ) {

        return (
            producto.nombre
            ||
            producto.producto
            ||
            producto.descripcion
            ||
            `Producto ${producto.id}`
        );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        try {

            return StorageService
                .guardarCuadernoCampo(
                    this.registros
                );

        }

        catch (
            error
        ) {

            console.error(
                "Error guardando el cuaderno de campo:",
                error
            );


            return false;

        }

    }

}