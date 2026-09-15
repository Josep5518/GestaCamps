import { StorageService } from "./storage.js";

export class ClienteProveedorService {

    constructor() {

        this.contactos =
            StorageService.obtenerClientesProveedores();


        if (
            !Array.isArray(
                this.contactos
            )
        ) {

            this.contactos = [];

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

    obtenerPorId(id) {

        if (
            id === undefined
            ||
            id === null
            ||
            id === ""
        ) {

            return null;

        }


        return (
            this.contactos.find(
                contacto =>
                    String(
                        contacto.id
                    )
                    ===
                    String(
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

    obtenerPorNombre(nombre) {

        const nombreBuscado =
            this.normalizarTexto(
                nombre
            );


        if (
            !nombreBuscado
        ) {

            return null;

        }


        return (
            this.contactos.find(
                contacto =>
                    this.normalizarTexto(
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

        return this.contactos.filter(
            contacto =>
                contacto.tipo ===
                "Cliente"
                ||
                contacto.tipo ===
                "Cliente y proveedor"
        );

    }


    obtenerClientesActivos() {

        return this.contactos.filter(
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

        return this.contactos.filter(
            contacto =>
                contacto.tipo ===
                "Proveedor"
                ||
                contacto.tipo ===
                "Cliente y proveedor"
        );

    }


    obtenerProveedoresActivos() {

        return this.contactos.filter(
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

    obtenerNif(id) {

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


    obtenerNifPorNombre(nombre) {

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
    // CREAR
    // =====================================================

    crear(datos) {

        const nombre =
            String(
                datos.nombre
                ||
                ""
            )
                .trim();


        if (
            !nombre
        ) {

            return {
                ok: false,
                mensaje:
                    "El nombre o razón social es obligatorio."
            };

        }


        const nuevoContacto = {

            id:
                Date.now(),

            tipo:
                datos.tipo
                ||
                "Cliente",

            nombre:
                nombre,

            nif:
                String(
                    datos.nif
                    ||
                    datos.nifCif
                    ||
                    ""
                )
                    .trim(),

            telefono:
                String(
                    datos.telefono
                    ||
                    ""
                )
                    .trim(),

            email:
                String(
                    datos.email
                    ||
                    ""
                )
                    .trim(),

            direccion:
                String(
                    datos.direccion
                    ||
                    ""
                )
                    .trim(),

            localidad:
                String(
                    datos.localidad
                    ||
                    ""
                )
                    .trim(),

            provincia:
                String(
                    datos.provincia
                    ||
                    ""
                )
                    .trim(),

            codigoPostal:
                String(
                    datos.codigoPostal
                    ||
                    ""
                )
                    .trim(),

            pais:
                String(
                    datos.pais
                    ||
                    "España"
                )
                    .trim(),

            activo:
                datos.activo !==
                false,

            notas:
                String(
                    datos.notas
                    ||
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


        this.guardar();


        return {
            ok: true,
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
                ok: false,
                mensaje:
                    "El cliente o proveedor no existe."
            };

        }


        const nombre =
            String(
                datos.nombre
                ||
                ""
            )
                .trim();


        if (
            !nombre
        ) {

            return {
                ok: false,
                mensaje:
                    "El nombre o razón social es obligatorio."
            };

        }


        contacto.tipo =
            datos.tipo
            ||
            contacto.tipo
            ||
            "Cliente";


        contacto.nombre =
            nombre;


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
                ||
                "España"
            )
                .trim();


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


        this.guardar();


        return {
            ok: true,
            contacto:
                contacto
        };

    }


    // =====================================================
    // VÍNCULOS
    // =====================================================

    obtenerVinculos(id) {

        const contacto =
            this.obtenerPorId(
                id
            );


        if (
            !contacto
        ) {

            return {
                albaranes: 0,
                facturas: 0,
                gastos: 0,
                total: 0
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


        const idContacto =
            String(
                contacto.id
            );


        const nombreContacto =
            this.normalizarTexto(
                contacto.nombre
            );


        const albaranesVinculados =
            albaranes.filter(
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

                        return (
                            String(
                                albaran.clienteId
                            )
                            ===
                            idContacto
                        );

                    }


                    const nombre =
                        this.normalizarTexto(
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
            facturas.filter(
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

                        return (
                            String(
                                factura.clienteId
                            )
                            ===
                            idContacto
                        );

                    }


                    const nombre =
                        this.normalizarTexto(
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
            gastos.filter(
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

                        return (
                            String(
                                gasto.proveedorId
                            )
                            ===
                            idContacto
                        );

                    }


                    const nombre =
                        this.normalizarTexto(
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


    obtenerStorageSeguro(
        metodo
    ) {

        try {

            if (
                typeof
                StorageService[
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

        catch {

            return [];

        }

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(id) {

        const contacto =
            this.obtenerPorId(
                id
            );


        if (
            !contacto
        ) {

            return {
                ok: false,
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
                        vinculos.albaranes === 1
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
                        vinculos.facturas === 1
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


            return {
                ok: false,

                mensaje:
                    `No puedes eliminar "${contacto.nombre}" porque tiene información vinculada: ${partes.join(
                        ", "
                    )}.`
            };

        }


        this.contactos =
            this.contactos.filter(
                item =>
                    String(
                        item.id
                    )
                    !==
                    String(
                        id
                    )
            );


        this.guardar();


        return {
            ok: true
        };

    }


    // =====================================================
    // MIGRAR DATOS ANTIGUOS
    // =====================================================

    migrarDatosAntiguos() {

        let cambios =
            false;


        this.contactos.forEach(
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

                    contacto.nif = "";

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
    // NORMALIZAR TEXTO
    // =====================================================

    normalizarTexto(texto) {

        return String(
            texto
            ||
            ""
        )
            .trim()
            .toLowerCase()
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarClientesProveedores(
                this.contactos
            );

    }

}