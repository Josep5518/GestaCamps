import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    normalizarTexto
} from "./utils.js";


export class ClienteProveedorService {

    constructor() {

        this.contactos =
            StorageService
                .obtenerClientesProveedores();


        if (
            !Array.isArray(
                this.contactos
            )
        ) {

            this.contactos =
                [];

        }


        this.migrarDatosAntiguos();

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.contactos;

    }


    obtenerTodas() {

        return this.contactos;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        if (
            id ===
            undefined
            ||
            id ===
            null
            ||
            id ===
            ""
        ) {

            return null;

        }


        return (
            this.contactos
                .find(
                    contacto =>
                        mismoId(
                            contacto.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // OBTENER POR NOMBRE
    // =====================================================

    obtenerPorNombre(
        nombre
    ) {

        const nombreBuscado =
            normalizarTexto(
                nombre
            );


        if (
            !nombreBuscado
        ) {

            return null;

        }


        return (
            this.contactos
                .find(
                    contacto =>
                        normalizarTexto(
                            contacto.nombre
                        )
                        ===
                        nombreBuscado
                )
            ||
            null
        );

    }


    // =====================================================
    // CLIENTES
    // =====================================================

    obtenerClientes() {

        return this.contactos
            .filter(
                contacto =>
                    contacto.tipo ===
                    "Cliente"
                    ||
                    contacto.tipo ===
                    "Cliente y proveedor"
            );

    }


    obtenerClientesActivos() {

        return this.contactos
            .filter(
                contacto =>
                    contacto.activo ===
                    true
                    &&
                    (
                        contacto.tipo ===
                        "Cliente"
                        ||
                        contacto.tipo ===
                        "Cliente y proveedor"
                    )
            );

    }


    // =====================================================
    // PROVEEDORES
    // =====================================================

    obtenerProveedores() {

        return this.contactos
            .filter(
                contacto =>
                    contacto.tipo ===
                    "Proveedor"
                    ||
                    contacto.tipo ===
                    "Cliente y proveedor"
            );

    }


    obtenerProveedoresActivos() {

        return this.contactos
            .filter(
                contacto =>
                    contacto.activo ===
                    true
                    &&
                    (
                        contacto.tipo ===
                        "Proveedor"
                        ||
                        contacto.tipo ===
                        "Cliente y proveedor"
                    )
            );

    }


    // =====================================================
    // OBTENER NIF / CIF
    // =====================================================

    obtenerNif(
        id
    ) {

        const contacto =
            this.obtenerPorId(
                id
            );


        if (
            !contacto
        ) {

            return "";

        }


        return (
            contacto.nif
            ||
            contacto.nifCif
            ||
            contacto.cif
            ||
            ""
        );

    }


    obtenerNifPorNombre(
        nombre
    ) {

        const contacto =
            this.obtenerPorNombre(
                nombre
            );


        if (
            !contacto
        ) {

            return "";

        }


        return (
            contacto.nif
            ||
            contacto.nifCif
            ||
            contacto.cif
            ||
            ""
        );

    }


    // =====================================================
    // VALIDAR DATOS
    // =====================================================

    validarDatos(
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
                    "Los datos del cliente o proveedor no son válidos."

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
                    "El nombre o razón social es obligatorio."

            };

        }


        const tipo =
            String(
                datos.tipo
                ??
                "Cliente"
            )
                .trim();


        if (
            ![
                "Cliente",
                "Proveedor",
                "Cliente y proveedor"
            ].includes(
                tipo
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El tipo de contacto no es válido."

            };

        }


        return {

            ok:
                true,

            nombre:
                nombre,

            tipo:
                tipo

        };

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        datos
    ) {

        const validacion =
            this.validarDatos(
                datos
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const nuevoContacto = {

            id:
                generarId(),

            tipo:
                validacion.tipo,

            nombre:
                validacion.nombre,

            nif:
                String(
                    datos.nif
                    ??
                    datos.nifCif
                    ??
                    ""
                )
                    .trim(),

            telefono:
                String(
                    datos.telefono
                    ??
                    ""
                )
                    .trim(),

            email:
                String(
                    datos.email
                    ??
                    ""
                )
                    .trim(),

            direccion:
                String(
                    datos.direccion
                    ??
                    ""
                )
                    .trim(),

            localidad:
                String(
                    datos.localidad
                    ??
                    ""
                )
                    .trim(),

            provincia:
                String(
                    datos.provincia
                    ??
                    ""
                )
                    .trim(),

            codigoPostal:
                String(
                    datos.codigoPostal
                    ??
                    ""
                )
                    .trim(),

            pais:
                String(
                    datos.pais
                    ??
                    "España"
                )
                    .trim()
                ||
                "España",

            activo:
                datos.activo !==
                false,

            notas:
                String(
                    datos.notas
                    ??
                    ""
                )
                    .trim(),

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        this.contactos.push(
            nuevoContacto
        );


        const guardado =
            this.guardar();


        if (
            !this.guardadoCorrecto(
                guardado
            )
        ) {

            this.contactos =
                this.contactos
                    .filter(
                        contacto =>
                            !mismoId(
                                contacto.id,
                                nuevoContacto.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el cliente o proveedor."

            };

        }


        return {

            ok:
                true,

            contacto:
                nuevoContacto

        };

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar(
        id,
        datos
    ) {

        const contacto =
            this.obtenerPorId(
                id
            );


        if (
            !contacto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El cliente o proveedor no existe."

            };

        }


        const validacion =
            this.validarDatos(
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
                    contacto
                )
            );


        contacto.tipo =
            validacion.tipo;


        contacto.nombre =
            validacion.nombre;


        contacto.nif =
            String(
                datos.nif
                ??
                datos.nifCif
                ??
                contacto.nif
                ??
                ""
            )
                .trim();


        contacto.telefono =
            String(
                datos.telefono
                ??
                ""
            )
                .trim();


        contacto.email =
            String(
                datos.email
                ??
                ""
            )
                .trim();


        contacto.direccion =
            String(
                datos.direccion
                ??
                ""
            )
                .trim();


        contacto.localidad =
            String(
                datos.localidad
                ??
                ""
            )
                .trim();


        contacto.provincia =
            String(
                datos.provincia
                ??
                ""
            )
                .trim();


        contacto.codigoPostal =
            String(
                datos.codigoPostal
                ??
                ""
            )
                .trim();


        contacto.pais =
            String(
                datos.pais
                ??
                "España"
            )
                .trim()
            ||
            "España";


        contacto.activo =
            datos.activo !==
            false;


        contacto.notas =
            String(
                datos.notas
                ??
                ""
            )
                .trim();


        const guardado =
            this.guardar();


        if (
            !this.guardadoCorrecto(
                guardado
            )
        ) {

            this.restaurarObjeto(
                contacto,
                estadoAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios del cliente o proveedor."

            };

        }


        return {

            ok:
                true,

            contacto:
                contacto

        };

    }


    // =====================================================
    // VÍNCULOS
    // =====================================================

    obtenerVinculos(
        id
    ) {

        const contacto =
            this.obtenerPorId(
                id
            );


        if (
            !contacto
        ) {

            return {

                albaranes:
                    0,

                facturas:
                    0,

                gastos:
                    0,

                total:
                    0

            };

        }


        const albaranes =
            this.obtenerStorageSeguro(
                "obtenerAlbaranes"
            );


        const facturas =
            this.obtenerStorageSeguro(
                "obtenerFacturas"
            );


        const gastos =
            this.obtenerStorageSeguro(
                "obtenerGastos"
            );


        const nombreContacto =
            normalizarTexto(
                contacto.nombre
            );


        const albaranesVinculados =
            albaranes
                .filter(
                    albaran => {

                        if (
                            albaran.clienteId !==
                            undefined
                            &&
                            albaran.clienteId !==
                            null
                            &&
                            albaran.clienteId !==
                            ""
                        ) {

                            return mismoId(
                                albaran.clienteId,
                                contacto.id
                            );

                        }


                        const nombre =
                            normalizarTexto(
                                albaran.clienteNombre
                                ||
                                albaran.cliente
                                ||
                                ""
                            );


                        return (
                            nombre
                            &&
                            nombre ===
                            nombreContacto
                        );

                    }
                )
                .length;


        const facturasVinculadas =
            facturas
                .filter(
                    factura => {

                        if (
                            factura.clienteId !==
                            undefined
                            &&
                            factura.clienteId !==
                            null
                            &&
                            factura.clienteId !==
                            ""
                        ) {

                            return mismoId(
                                factura.clienteId,
                                contacto.id
                            );

                        }


                        const nombre =
                            normalizarTexto(
                                factura.clienteNombre
                                ||
                                factura.cliente
                                ||
                                ""
                            );


                        return (
                            nombre
                            &&
                            nombre ===
                            nombreContacto
                        );

                    }
                )
                .length;


        const gastosVinculados =
            gastos
                .filter(
                    gasto => {

                        if (
                            gasto.proveedorId !==
                            undefined
                            &&
                            gasto.proveedorId !==
                            null
                            &&
                            gasto.proveedorId !==
                            ""
                        ) {

                            return mismoId(
                                gasto.proveedorId,
                                contacto.id
                            );

                        }


                        const nombre =
                            normalizarTexto(
                                gasto.proveedorNombre
                                ||
                                gasto.proveedor
                                ||
                                ""
                            );


                        return (
                            nombre
                            &&
                            nombre ===
                            nombreContacto
                        );

                    }
                )
                .length;


        return {

            albaranes:
                albaranesVinculados,

            facturas:
                facturasVinculadas,

            gastos:
                gastosVinculados,

            total:
                albaranesVinculados
                +
                facturasVinculadas
                +
                gastosVinculados

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
                ] !==
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

        catch {

            return [];

        }

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const contacto =
            this.obtenerPorId(
                id
            );


        if (
            !contacto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El cliente o proveedor no existe."

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
                vinculos.facturas >
                0
            ) {

                partes.push(
                    `${vinculos.facturas} factura${
                        vinculos.facturas ===
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


            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar "${contacto.nombre}" porque tiene información vinculada: ${partes.join(
                        ", "
                    )}.`

            };

        }


        const contactosAnteriores =
            [
                ...this.contactos
            ];


        this.contactos =
            this.contactos
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
            !this.guardadoCorrecto(
                guardado
            )
        ) {

            this.contactos =
                contactosAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el cliente o proveedor."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // MIGRAR DATOS ANTIGUOS
    // =====================================================

    migrarDatosAntiguos() {

        let cambios =
            false;


        this.contactos
            .forEach(
                contacto => {

                    if (
                        !contacto.nif
                        &&
                        contacto.nifCif
                    ) {

                        contacto.nif =
                            contacto.nifCif;

                        cambios =
                            true;

                    }


                    if (
                        !contacto.nif
                        &&
                        contacto.cif
                    ) {

                        contacto.nif =
                            contacto.cif;

                        cambios =
                            true;

                    }


                    if (
                        contacto.nif ===
                        undefined
                    ) {

                        contacto.nif =
                            "";

                        cambios =
                            true;

                    }


                    if (
                        contacto.activo ===
                        undefined
                    ) {

                        contacto.activo =
                            true;

                        cambios =
                            true;

                    }


                    if (
                        !contacto.tipo
                    ) {

                        contacto.tipo =
                            "Cliente";

                        cambios =
                            true;

                    }

                }
            );


        if (
            cambios
        ) {

            this.guardar();

        }

    }


    // =====================================================
    // RESTAURAR OBJETO
    // =====================================================

    restaurarObjeto(
        destino,
        origen
    ) {

        Object.keys(
            destino
        )
            .forEach(
                clave => {

                    if (
                        !Object.prototype
                            .hasOwnProperty
                            .call(
                                origen,
                                clave
                            )
                    ) {

                        delete destino[
                            clave
                        ];

                    }

                }
            );


        Object.assign(
            destino,
            origen
        );

    }


    // =====================================================
    // GUARDADO CORRECTO
    // =====================================================

    guardadoCorrecto(
        resultado
    ) {

        return resultado !==
            false;

    }


    // =====================================================
    // NORMALIZAR TEXTO
    // =====================================================

    normalizarTexto(
        texto
    ) {

        return normalizarTexto(
            texto
        );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarClientesProveedores(
                this.contactos
            );

    }

}