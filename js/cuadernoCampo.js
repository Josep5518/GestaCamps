import { StorageService } from "./storage.js";


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

        return this.registros
            .find(
                registro =>
                    Number(
                        registro.id
                    )
                    ===
                    Number(
                        id
                    )
            )
            ||
            null;

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
                    Number(
                        registro.fincaId
                    )
                    ===
                    Number(
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
                    Number(
                        registro.campaniaId
                    )
                    ===
                    Number(
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
    // TIPOS
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
                Date.now(),

            fecha:
                datos.fecha,

            hora:
                datos.hora
                ||
                "",

            tipoActuacion:
                datos.tipoActuacion.trim(),

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
                datos.dosis?.trim()
                ||
                "",

            descripcion:
                datos.descripcion?.trim()
                ||
                "",

            observaciones:
                datos.observaciones?.trim()
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
                ahora.toISOString()

        };


        this.registros.push(
            registro
        );


        this.guardar();


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


        registro.fecha =
            datos.fecha;


        registro.hora =
            datos.hora
            ||
            "";


        registro.tipoActuacion =
            datos.tipoActuacion.trim();


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
            datos.dosis?.trim()
            ||
            "";


        registro.descripcion =
            datos.descripcion?.trim()
            ||
            "";


        registro.observaciones =
            datos.observaciones?.trim()
            ||
            "";


        registro.fechaModificacion =
            new Date()
                .toISOString();


        this.guardar();


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


        this.registros =
            this.registros
                .filter(
                    item =>
                        Number(
                            item.id
                        )
                        !==
                        Number(
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
            datos.cantidad !==
            ""
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


        const finca =
            fincas.find(
                item =>
                    Number(
                        item.id
                    )
                    ===
                    Number(
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


        let campania =
            null;


        if (
            datos.campaniaId
        ) {

            campania =
                campanias.find(
                    item =>
                        Number(
                            item.id
                        )
                        ===
                        Number(
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
                Number(
                    campania.fincaId
                )
                !==
                Number(
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


        let cultivo =
            null;


        if (
            datos.cultivoId
        ) {

            cultivo =
                cultivos.find(
                    item =>
                        Number(
                            item.id
                        )
                        ===
                        Number(
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
                cultivo.fincaId
                &&
                Number(
                    cultivo.fincaId
                )
                !==
                Number(
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


        const trabajadorIds =
            Array.isArray(
                datos.trabajadorIds
            )
                ? datos.trabajadorIds
                    .map(
                        Number
                    )
                : [];


        const trabajadoresSeleccionados =
            trabajadores.filter(
                trabajador =>
                    trabajadorIds.includes(
                        Number(
                            trabajador.id
                        )
                    )
            );


        let maquina =
            null;


        if (
            datos.maquinariaId
        ) {

            maquina =
                maquinaria.find(
                    item =>
                        Number(
                            item.id
                        )
                        ===
                        Number(
                            datos.maquinariaId
                        )
                )
                ||
                null;

        }


        let producto =
            null;


        if (
            datos.productoInventarioId
        ) {

            producto =
                inventario.find(
                    item =>
                        Number(
                            item.id
                        )
                        ===
                        Number(
                            datos.productoInventarioId
                        )
                )
                ||
                null;

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
            .filter(Boolean)
            .join(" ");

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
                .filter(Boolean)
                .join(" · ")
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
                .filter(Boolean)
                .join(" ")
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

        StorageService
            .guardarCuadernoCampo(
                this.registros
            );

    }

}