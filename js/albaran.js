import { StorageService } from "./storage.js";

export class AlbaranService {

    constructor(
        fincaService,
        produccionService,
        clienteProveedorService
    ) {

        this.fincaService =
            fincaService;

        this.produccionService =
            produccionService;

        this.clienteProveedorService =
            clienteProveedorService;

        this.albaranes =
            StorageService.obtenerAlbaranes();


        if (
            !Array.isArray(
                this.albaranes
            )
        ) {

            this.albaranes = [];

        }


        this.migrarAlbaranesAntiguos();

    }


    // =====================================================
    // ESTADOS
    // =====================================================

    obtenerEstados() {

        return [
            "Borrador",
            "Pendiente",
            "Entregado",
            "Facturado",
            "Cancelado"
        ];

    }


    estadoOcupaStock(
        estado,
        facturado = false
    ) {

        if (
            facturado === true
        ) {

            return true;

        }


        return (
            estado === "Pendiente"
            ||
            estado === "Entregado"
            ||
            estado === "Facturado"
        );

    }


    estadoReservaStock(
        estado
    ) {

        return (
            estado === "Pendiente"
        );

    }


    estadoConsumeStock(
        estado,
        facturado = false
    ) {

        return (
            facturado === true
            ||
            estado === "Entregado"
            ||
            estado === "Facturado"
        );

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtenerTodos() {

        return this.albaranes;

    }


    obtenerTodas() {

        return this.albaranes;

    }


    obtenerPorId(id) {

        return (
            this.albaranes.find(
                albaran =>
                    Number(
                        albaran.id
                    )
                    ===
                    Number(
                        id
                    )
            )
            ||
            null
        );

    }


    obtenerBorradores() {

        return this.albaranes.filter(
            albaran =>
                albaran.estado ===
                "Borrador"
        );

    }


    obtenerPendientes() {

        return this.albaranes.filter(
            albaran =>
                albaran.estado ===
                "Pendiente"
        );

    }


    obtenerEntregados() {

        return this.albaranes.filter(
            albaran =>
                albaran.estado ===
                "Entregado"
                &&
                albaran.facturado !==
                true
        );

    }


    obtenerFacturados() {

        return this.albaranes.filter(
            albaran =>
                albaran.facturado ===
                true
                ||
                albaran.estado ===
                "Facturado"
        );

    }


    obtenerCancelados() {

        return this.albaranes.filter(
            albaran =>
                albaran.estado ===
                "Cancelado"
        );

    }


    // =====================================================
    // PRODUCCIONES
    // =====================================================

    obtenerProducciones() {

        if (
            this.produccionService
            &&
            typeof
            this.produccionService
                .obtenerTodos ===
            "function"
        ) {

            const datos =
                this.produccionService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            this.produccionService
            &&
            typeof
            this.produccionService
                .obtenerTodas ===
            "function"
        ) {

            const datos =
                this.produccionService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    obtenerProduccionPorId(id) {

        if (
            id === undefined
            ||
            id === null
            ||
            id === ""
        ) {

            return null;

        }


        if (
            this.produccionService
            &&
            typeof
            this.produccionService
                .obtenerPorId ===
            "function"
        ) {

            const produccion =
                this.produccionService
                    .obtenerPorId(
                        Number(
                            id
                        )
                    );


            if (
                produccion
            ) {

                return produccion;

            }

        }


        return (
            this.obtenerProducciones()
                .find(
                    produccion =>
                        Number(
                            produccion.id
                        )
                        ===
                        Number(
                            id
                        )
                )
            ||
            null
        );

    }


    obtenerCantidadProduccion(
        produccion
    ) {

        if (
            !produccion
        ) {

            return 0;

        }


        const cantidad =
            Number(
                produccion.cantidad
                ??
                produccion.kilos
                ??
                produccion.kg
                ??
                0
            );


        return Number.isFinite(
            cantidad
        )
            ? cantidad
            : 0;

    }


    obtenerUnidadProduccion(
        produccion
    ) {

        return (
            produccion?.unidad
            ||
            "kg"
        );

    }


    // =====================================================
    // CLIENTES
    // =====================================================

    obtenerContactos() {

        if (
            this.clienteProveedorService
            &&
            typeof
            this.clienteProveedorService
                .obtenerTodos ===
            "function"
        ) {

            const datos =
                this.clienteProveedorService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            this.clienteProveedorService
            &&
            typeof
            this.clienteProveedorService
                .obtenerTodas ===
            "function"
        ) {

            const datos =
                this.clienteProveedorService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    obtenerClientes() {

        return this.obtenerContactos()
            .filter(
                contacto => {

                    const tipo =
                        String(
                            contacto.tipo
                            ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    return (
                        tipo === "cliente"
                        ||
                        tipo ===
                        "cliente y proveedor"
                    );

                }
            );

    }


    obtenerClientePorId(id) {

        if (
            id === undefined
            ||
            id === null
            ||
            id === ""
        ) {

            return null;

        }


        if (
            this.clienteProveedorService
            &&
            typeof
            this.clienteProveedorService
                .obtenerPorId ===
            "function"
        ) {

            const cliente =
                this.clienteProveedorService
                    .obtenerPorId(
                        Number(
                            id
                        )
                    );


            if (
                cliente
            ) {

                return cliente;

            }

        }


        return (
            this.obtenerClientes()
                .find(
                    cliente =>
                        String(
                            cliente.id
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


    obtenerNombreCliente(
        cliente
    ) {

        if (
            !cliente
        ) {

            return "";

        }


        return (
            cliente.nombre
            ||
            cliente.razonSocial
            ||
            cliente.nombreFiscal
            ||
            ""
        );

    }


    // =====================================================
    // OBTENER LÍNEAS
    // =====================================================

    obtenerLineasAlbaran(
        albaran
    ) {

        if (
            Array.isArray(
                albaran?.lineas
            )
            &&
            albaran.lineas.length >
            0
        ) {

            return albaran.lineas;

        }


        if (
            albaran?.produccionId
        ) {

            return [
                {
                    id:
                        Date.now(),

                    produccionId:
                        albaran.produccionId,

                    fincaId:
                        albaran.fincaId,

                    fincaNombre:
                        albaran.fincaNombre
                        ||
                        "",

                    parcela:
                        albaran.parcela
                        ||
                        "",

                    producto:
                        albaran.producto
                        ||
                        "",

                    variedad:
                        albaran.variedad
                        ||
                        "",

                    campaniaId:
                        albaran.campaniaId
                        ||
                        null,

                    campaniaNombre:
                        albaran.campaniaNombre
                        ||
                        "",

                    cantidad:
                        Number(
                            albaran.cantidad
                            ||
                            0
                        ),

                    unidad:
                        albaran.unidad
                        ||
                        "kg",

                    precio:
                        Number(
                            albaran.precio
                            ||
                            0
                        ),

                    total:
                        Number(
                            albaran.total
                            ||
                            0
                        )
                }
            ];

        }


        return [];

    }


    // =====================================================
    // STOCK RESERVADO
    // =====================================================

    obtenerCantidadReservada(
        produccionId,
        excluirAlbaranId = null
    ) {

        let total =
            0;


        this.albaranes.forEach(
            albaran => {

                if (
                    excluirAlbaranId !==
                    null
                    &&
                    Number(
                        albaran.id
                    )
                    ===
                    Number(
                        excluirAlbaranId
                    )
                ) {

                    return;

                }


                if (
                    !this.estadoReservaStock(
                        albaran.estado
                    )
                ) {

                    return;

                }


                this.obtenerLineasAlbaran(
                    albaran
                )
                    .forEach(
                        linea => {

                            if (
                                Number(
                                    linea.produccionId
                                )
                                ===
                                Number(
                                    produccionId
                                )
                            ) {

                                total +=
                                    Number(
                                        linea.cantidad
                                        ||
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
    // STOCK ENTREGADO / CONSUMIDO
    // =====================================================

    obtenerCantidadConsumida(
        produccionId,
        excluirAlbaranId = null
    ) {

        let total =
            0;


        this.albaranes.forEach(
            albaran => {

                if (
                    excluirAlbaranId !==
                    null
                    &&
                    Number(
                        albaran.id
                    )
                    ===
                    Number(
                        excluirAlbaranId
                    )
                ) {

                    return;

                }


                if (
                    !this.estadoConsumeStock(
                        albaran.estado,
                        albaran.facturado
                    )
                ) {

                    return;

                }


                this.obtenerLineasAlbaran(
                    albaran
                )
                    .forEach(
                        linea => {

                            if (
                                Number(
                                    linea.produccionId
                                )
                                ===
                                Number(
                                    produccionId
                                )
                            ) {

                                total +=
                                    Number(
                                        linea.cantidad
                                        ||
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
    // TOTAL OCUPADO
    // =====================================================

    obtenerCantidadUtilizada(
        produccionId,
        excluirAlbaranId = null
    ) {

        const reservada =
            this.obtenerCantidadReservada(
                produccionId,
                excluirAlbaranId
            );


        const consumida =
            this.obtenerCantidadConsumida(
                produccionId,
                excluirAlbaranId
            );


        return Number(
            (
                reservada
                +
                consumida
            )
                .toFixed(
                    2
                )
        );

    }


    // =====================================================
    // DISPONIBLE
    // =====================================================

    obtenerCantidadDisponible(
        produccionId,
        excluirAlbaranId = null
    ) {

        const produccion =
            this.obtenerProduccionPorId(
                produccionId
            );


        if (
            !produccion
        ) {

            return 0;

        }


        const producido =
            this.obtenerCantidadProduccion(
                produccion
            );


        const ocupado =
            this.obtenerCantidadUtilizada(
                produccionId,
                excluirAlbaranId
            );


        return Number(
            Math.max(
                0,
                producido -
                ocupado
            )
                .toFixed(
                    2
                )
        );

    }


    obtenerDisponibilidadProduccion(
        produccionId,
        excluirAlbaranId = null
    ) {

        const produccion =
            this.obtenerProduccionPorId(
                produccionId
            );


        if (
            !produccion
        ) {

            return {
                producido: 0,
                reservado: 0,
                consumido: 0,
                utilizado: 0,
                disponible: 0,
                unidad: "kg"
            };

        }


        const producido =
            this.obtenerCantidadProduccion(
                produccion
            );


        const reservado =
            this.obtenerCantidadReservada(
                produccionId,
                excluirAlbaranId
            );


        const consumido =
            this.obtenerCantidadConsumida(
                produccionId,
                excluirAlbaranId
            );


        const utilizado =
            reservado
            +
            consumido;


        const disponible =
            Math.max(
                0,
                producido -
                utilizado
            );


        return {

            producido:
                Number(
                    producido.toFixed(
                        2
                    )
                ),

            reservado:
                Number(
                    reservado.toFixed(
                        2
                    )
                ),

            consumido:
                Number(
                    consumido.toFixed(
                        2
                    )
                ),

            utilizado:
                Number(
                    utilizado.toFixed(
                        2
                    )
                ),

            disponible:
                Number(
                    disponible.toFixed(
                        2
                    )
                ),

            unidad:
                this.obtenerUnidadProduccion(
                    produccion
                )

        };

    }


    // =====================================================
    // NORMALIZAR LÍNEA
    // =====================================================

    normalizarLinea(
        linea,
        albaran = null
    ) {

        if (
            !linea
        ) {

            return null;

        }


        const produccion =
            this.obtenerProduccionPorId(
                linea.produccionId
            );


        const cantidad =
            Number(
                linea.cantidad
                ??
                0
            );


        let precio =
            Number(
                linea.precio
                ??
                linea.precioUnidad
                ??
                0
            );


        let total =
            Number(
                linea.total
                ??
                0
            );


        if (
            precio <= 0
            &&
            cantidad > 0
            &&
            total > 0
        ) {

            precio =
                total /
                cantidad;

        }


        if (
            total <= 0
            &&
            cantidad > 0
            &&
            precio >= 0
        ) {

            total =
                cantidad *
                precio;

        }


        let producto =
            linea.producto
            ||
            produccion?.producto
            ||
            produccion?.productoNombre
            ||
            albaran?.producto
            ||
            "";


        let variedad =
            linea.variedad
            ||
            produccion?.variedad
            ||
            produccion?.variedadNombre
            ||
            albaran?.variedad
            ||
            "";


        if (
            producto
            &&
            variedad
            &&
            this.normalizarTexto(
                producto
            )
            ===
            this.normalizarTexto(
                variedad
            )
        ) {

            variedad =
                "";

        }


        return {

            id:
                linea.id
                ||
                Date.now()
                +
                Math.floor(
                    Math.random() *
                    100000
                ),

            produccionId:
                linea.produccionId
                ||
                produccion?.id
                ||
                null,

            fincaId:
                linea.fincaId
                ||
                produccion?.fincaId
                ||
                albaran?.fincaId
                ||
                null,

            fincaNombre:
                linea.fincaNombre
                ||
                produccion?.fincaNombre
                ||
                produccion?.finca
                ||
                albaran?.fincaNombre
                ||
                "",

            parcela:
                linea.parcela
                ||
                produccion?.parcela
                ||
                albaran?.parcela
                ||
                "",

            producto:
                producto,

            variedad:
                variedad,

            campaniaId:
                linea.campaniaId
                ||
                produccion?.campaniaId
                ||
                albaran?.campaniaId
                ||
                null,

            campaniaNombre:
                linea.campaniaNombre
                ||
                produccion?.campaniaNombre
                ||
                albaran?.campaniaNombre
                ||
                "",

            cantidad:
                Number.isFinite(
                    cantidad
                )
                    ? cantidad
                    : 0,

            unidad:
                produccion?.unidad
                ||
                linea.unidad
                ||
                albaran?.unidad
                ||
                "kg",

            precio:
                Number.isFinite(
                    precio
                )
                    ? Number(
                        precio.toFixed(
                            4
                        )
                    )
                    : 0,

            total:
                Number.isFinite(
                    total
                )
                    ? Number(
                        total.toFixed(
                            2
                        )
                    )
                    : 0

        };

    }


    // =====================================================
    // RESUMEN ALBARÁN
    // =====================================================

    sincronizarResumenAlbaran(
        albaran
    ) {

        const lineas =
            Array.isArray(
                albaran.lineas
            )
                ? albaran.lineas
                : [];


        if (
            lineas.length ===
            0
        ) {

            albaran.cantidad =
                0;

            albaran.precio =
                0;

            albaran.total =
                0;

            return;

        }


        const total =
            lineas.reduce(
                (
                    suma,
                    linea
                ) =>
                    suma
                    +
                    Number(
                        linea.total
                        ??
                        0
                    ),
                0
            );


        const mismaUnidad =
            lineas.every(
                linea =>
                    String(
                        linea.unidad
                        ||
                        "kg"
                    )
                    ===
                    String(
                        lineas[0]
                            .unidad
                        ||
                        "kg"
                    )
            );


        const cantidadTotal =
            mismaUnidad

                ? lineas.reduce(
                    (
                        suma,
                        linea
                    ) =>
                        suma
                        +
                        Number(
                            linea.cantidad
                            ||
                            0
                        ),
                    0
                )

                : 0;


        albaran.total =
            Number(
                total.toFixed(
                    2
                )
            );


        albaran.cantidad =
            Number(
                cantidadTotal.toFixed(
                    2
                )
            );


        albaran.unidad =
            mismaUnidad

                ? (
                    lineas[0].unidad
                    ||
                    "kg"
                )

                : "varias";


        if (
            lineas.length ===
            1
        ) {

            const linea =
                lineas[0];


            albaran.produccionId =
                linea.produccionId;

            albaran.fincaId =
                linea.fincaId;

            albaran.fincaNombre =
                linea.fincaNombre;

            albaran.parcela =
                linea.parcela;

            albaran.producto =
                linea.producto;

            albaran.variedad =
                linea.variedad;

            albaran.campaniaId =
                linea.campaniaId;

            albaran.campaniaNombre =
                linea.campaniaNombre;

            albaran.precio =
                Number(
                    linea.precio
                    ||
                    0
                );

            return;

        }


        const fincaIds =
            new Set(
                lineas
                    .map(
                        linea =>
                            linea.fincaId
                    )
                    .filter(Boolean)
                    .map(Number)
            );


        const campaniaIds =
            new Set(
                lineas
                    .map(
                        linea =>
                            linea.campaniaId
                    )
                    .filter(Boolean)
                    .map(Number)
            );


        albaran.produccionId =
            null;


        albaran.fincaId =
            fincaIds.size ===
            1

                ? lineas[0]
                    .fincaId

                : null;


        albaran.fincaNombre =
            fincaIds.size ===
            1

                ? lineas[0]
                    .fincaNombre

                : "Varias fincas";


        albaran.parcela =
            "";


        albaran.campaniaId =
            campaniaIds.size ===
            1

                ? lineas[0]
                    .campaniaId

                : null;


        albaran.campaniaNombre =
            campaniaIds.size ===
            1

                ? lineas[0]
                    .campaniaNombre

                : "Varias campanyas";


        albaran.producto =
            `${lineas.length} líneas`;


        albaran.variedad =
            "";


        albaran.precio =
            cantidadTotal >
            0

                ? Number(
                    (
                        total /
                        cantidadTotal
                    )
                        .toFixed(
                            4
                        )
                )

                : 0;

    }


    // =====================================================
    // MIGRACIÓN
    // =====================================================

    migrarAlbaranesAntiguos() {

        let cambios =
            false;


        this.albaranes.forEach(
            albaran => {

                // ESTADO

                if (
                    albaran.facturado ===
                    true
                ) {

                    if (
                        albaran.estado !==
                        "Facturado"
                    ) {

                        albaran.estado =
                            "Facturado";

                        cambios =
                            true;

                    }

                }

                else if (
                    !this.obtenerEstados()
                        .includes(
                            albaran.estado
                        )
                ) {

                    albaran.estado =
                        "Pendiente";

                    cambios =
                        true;

                }


                // CLIENTE

                if (
                    !albaran.clienteNombre
                ) {

                    const cliente =
                        this.obtenerClientePorId(
                            albaran.clienteId
                        );


                    if (
                        cliente
                    ) {

                        albaran.clienteNombre =
                            this.obtenerNombreCliente(
                                cliente
                            );

                        cambios =
                            true;

                    }

                }


                // MULTILÍNEA

                if (
                    Array.isArray(
                        albaran.lineas
                    )
                    &&
                    albaran.lineas.length >
                    0
                ) {

                    albaran.lineas =
                        albaran.lineas
                            .map(
                                linea =>
                                    this.normalizarLinea(
                                        linea,
                                        albaran
                                    )
                            )
                            .filter(Boolean);


                    this.sincronizarResumenAlbaran(
                        albaran
                    );


                    cambios =
                        true;

                    return;

                }


                if (
                    albaran.produccionId
                ) {

                    const linea =
                        this.normalizarLinea(
                            {
                                produccionId:
                                    albaran.produccionId,

                                fincaId:
                                    albaran.fincaId,

                                fincaNombre:
                                    albaran.fincaNombre,

                                parcela:
                                    albaran.parcela,

                                producto:
                                    albaran.producto,

                                variedad:
                                    albaran.variedad,

                                campaniaId:
                                    albaran.campaniaId,

                                campaniaNombre:
                                    albaran.campaniaNombre,

                                cantidad:
                                    albaran.cantidad,

                                unidad:
                                    albaran.unidad,

                                precio:
                                    albaran.precio,

                                total:
                                    albaran.total
                            },
                            albaran
                        );


                    if (
                        linea
                    ) {

                        albaran.lineas =
                            [linea];


                        this.sincronizarResumenAlbaran(
                            albaran
                        );


                        cambios =
                            true;

                    }

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
    // CONSTRUIR LÍNEAS
    // =====================================================

    construirLineas(
        datos
    ) {

        const entradas =
            Array.isArray(
                datos.lineas
            )
                ? datos.lineas
                : [];


        if (
            entradas.length ===
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Añade al menos una línea al albarán."
            };

        }


        const lineas =
            [];


        for (
            let i = 0;
            i < entradas.length;
            i++
        ) {

            const entrada =
                entradas[i];


            const produccion =
                this.obtenerProduccionPorId(
                    entrada.produccionId
                );


            if (
                !produccion
            ) {

                return {
                    ok: false,

                    mensaje:
                        `Selecciona una producción válida en la línea ${i + 1}.`
                };

            }


            const cantidad =
                Number(
                    entrada.cantidad
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
                    ok: false,

                    mensaje:
                        `Introduce una cantidad válida en la línea ${i + 1}.`
                };

            }


            const precio =
                Number(
                    entrada.precio
                );


            if (
                !Number.isFinite(
                    precio
                )
                ||
                precio <
                0
            ) {

                return {
                    ok: false,

                    mensaje:
                        `Introduce un precio válido en la línea ${i + 1}.`
                };

            }


            lineas.push(
                this.normalizarLinea(
                    {
                        id:
                            entrada.id
                            ||
                            Date.now()
                            +
                            i
                            +
                            Math.floor(
                                Math.random() *
                                10000
                            ),

                        produccionId:
                            produccion.id,

                        fincaId:
                            produccion.fincaId
                            ||
                            null,

                        fincaNombre:
                            produccion.fincaNombre
                            ||
                            produccion.finca
                            ||
                            "",

                        parcela:
                            produccion.parcela
                            ||
                            "",

                        producto:
                            produccion.producto
                            ||
                            produccion.productoNombre
                            ||
                            "",

                        variedad:
                            produccion.variedad
                            ||
                            produccion.variedadNombre
                            ||
                            "",

                        campaniaId:
                            produccion.campaniaId
                            ||
                            null,

                        campaniaNombre:
                            produccion.campaniaNombre
                            ||
                            "",

                        cantidad:
                            cantidad,

                        unidad:
                            produccion.unidad
                            ||
                            "kg",

                        precio:
                            precio,

                        total:
                            cantidad *
                            precio
                    }
                )
            );

        }


        return {
            ok: true,
            lineas:
                lineas
        };

    }


    // =====================================================
    // VALIDAR STOCK
    // =====================================================

    validarDisponibilidadLineas(
        lineas,
        excluirAlbaranId = null
    ) {

        const solicitado =
            new Map();


        lineas.forEach(
            linea => {

                const id =
                    Number(
                        linea.produccionId
                    );


                solicitado.set(
                    id,
                    (
                        solicitado.get(
                            id
                        )
                        ||
                        0
                    )
                    +
                    Number(
                        linea.cantidad
                        ||
                        0
                    )
                );

            }
        );


        for (
            const [
                produccionId,
                cantidadSolicitada
            ]
            of
            solicitado
        ) {

            const produccion =
                this.obtenerProduccionPorId(
                    produccionId
                );


            if (
                !produccion
            ) {

                return {
                    ok: false,

                    mensaje:
                        "Una producción seleccionada ya no existe."
                };

            }


            const disponibilidad =
                this.obtenerDisponibilidadProduccion(
                    produccionId,
                    excluirAlbaranId
                );


            if (
                cantidadSolicitada >
                disponibilidad.disponible
                +
                0.000001
            ) {

                const nombre =
                    [
                        produccion.producto
                        ||
                        produccion.productoNombre
                        ||
                        "Producción",

                        produccion.variedad
                    ]
                        .filter(Boolean)
                        .join(
                            " · "
                        );


                return {

                    ok: false,

                    mensaje:
                        `No hay suficiente producción disponible de ${nombre}. `
                        +
                        `Disponible: ${this.formatearNumero(
                            disponibilidad.disponible
                        )} ${disponibilidad.unidad}. `
                        +
                        `Solicitado: ${this.formatearNumero(
                            cantidadSolicitada
                        )} ${disponibilidad.unidad}.`

                };

            }

        }


        return {
            ok: true
        };

    }


    // =====================================================
    // VALIDAR ESTADO
    // =====================================================

    validarEstado(
        estado
    ) {

        if (
            !this.obtenerEstados()
                .includes(
                    estado
                )
        ) {

            return {
                ok: false,

                mensaje:
                    "El estado del albarán no es válido."
            };

        }


        return {
            ok: true
        };

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(datos) {

        const cliente =
            this.obtenerClientePorId(
                datos.clienteId
            );


        if (
            !cliente
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona un cliente válido."
            };

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce una fecha."
            };

        }


        const estado =
            datos.estado
            ||
            "Borrador";


        const validacionEstado =
            this.validarEstado(
                estado
            );


        if (
            !validacionEstado.ok
        ) {

            return validacionEstado;

        }


        if (
            estado ===
            "Facturado"
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes crear directamente un albarán como facturado."
            };

        }


        const resultadoLineas =
            this.construirLineas(
                datos
            );


        if (
            !resultadoLineas.ok
        ) {

            return resultadoLineas;

        }


        if (
            this.estadoOcupaStock(
                estado
            )
        ) {

            const stock =
                this.validarDisponibilidadLineas(
                    resultadoLineas.lineas
                );


            if (
                !stock.ok
            ) {

                return stock;

            }

        }


        const nuevoAlbaran = {

            id:
                Date.now(),

            numero:
                this.generarNumero(),

            fecha:
                datos.fecha,

            clienteId:
                cliente.id,

            clienteNombre:
                this.obtenerNombreCliente(
                    cliente
                ),

            lineas:
                resultadoLineas.lineas,

            estado:
                estado,

            facturado:
                false,

            facturaId:
                null,

            observaciones:
                String(
                    datos.observaciones
                    ||
                    ""
                )
                    .trim(),

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        this.sincronizarResumenAlbaran(
            nuevoAlbaran
        );


        this.albaranes.push(
            nuevoAlbaran
        );


        this.guardar();


        return {
            ok: true,

            albaran:
                nuevoAlbaran
        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const albaran =
            this.obtenerPorId(
                id
            );


        if (
            !albaran
        ) {

            return {
                ok: false,

                mensaje:
                    "El albarán no existe."
            };

        }


        if (
            albaran.facturado ===
            true
            ||
            albaran.estado ===
            "Facturado"
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes modificar un albarán facturado."
            };

        }


        const cliente =
            this.obtenerClientePorId(
                datos.clienteId
            );


        if (
            !cliente
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona un cliente válido."
            };

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce una fecha."
            };

        }


        const estado =
            datos.estado
            ||
            "Borrador";


        const validacionEstado =
            this.validarEstado(
                estado
            );


        if (
            !validacionEstado.ok
        ) {

            return validacionEstado;

        }


        if (
            estado ===
            "Facturado"
        ) {

            return {
                ok: false,

                mensaje:
                    "El estado Facturado solo se asigna al generar una factura."
            };

        }


        const resultadoLineas =
            this.construirLineas(
                datos
            );


        if (
            !resultadoLineas.ok
        ) {

            return resultadoLineas;

        }


        if (
            this.estadoOcupaStock(
                estado
            )
        ) {

            const stock =
                this.validarDisponibilidadLineas(
                    resultadoLineas.lineas,
                    id
                );


            if (
                !stock.ok
            ) {

                return stock;

            }

        }


        albaran.fecha =
            datos.fecha;


        albaran.clienteId =
            cliente.id;


        albaran.clienteNombre =
            this.obtenerNombreCliente(
                cliente
            );


        albaran.lineas =
            resultadoLineas.lineas;


        albaran.estado =
            estado;


        albaran.observaciones =
            String(
                datos.observaciones
                ||
                ""
            )
                .trim();


        this.sincronizarResumenAlbaran(
            albaran
        );


        this.guardar();


        return {
            ok: true,

            albaran:
                albaran
        };

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        nuevoEstado
    ) {

        const albaran =
            this.obtenerPorId(
                id
            );


        if (
            !albaran
        ) {

            return {
                ok: false,

                mensaje:
                    "El albarán no existe."
            };

        }


        if (
            albaran.facturado ===
            true
            ||
            albaran.estado ===
            "Facturado"
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes cambiar el estado de un albarán facturado."
            };

        }


        if (
            nuevoEstado ===
            "Facturado"
        ) {

            return {
                ok: false,

                mensaje:
                    "El estado Facturado se asigna automáticamente desde Facturación."
            };

        }


        const validacion =
            this.validarEstado(
                nuevoEstado
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        /*
         * Si pasa a un estado que reserva o consume
         * stock comprobamos la disponibilidad.
         *
         * Excluimos el propio albarán para que pueda
         * pasar de Pendiente a Entregado sin descontarse
         * dos veces.
         */

        if (
            this.estadoOcupaStock(
                nuevoEstado
            )
        ) {

            const stock =
                this.validarDisponibilidadLineas(
                    this.obtenerLineasAlbaran(
                        albaran
                    ),
                    id
                );


            if (
                !stock.ok
            ) {

                return stock;

            }

        }


        albaran.estado =
            nuevoEstado;


        this.guardar();


        return {
            ok: true,

            albaran:
                albaran
        };

    }


    // =====================================================
    // MARCAR FACTURADO
    // =====================================================

    marcarFacturado(
        id,
        facturaId = null
    ) {

        const albaran =
            this.obtenerPorId(
                id
            );


        if (
            !albaran
        ) {

            return {
                ok: false,

                mensaje:
                    "El albarán no existe."
            };

        }


        /*
         * Facturación debería seleccionar únicamente
         * albaranes Entregados.
         */

        if (
            albaran.estado !==
            "Entregado"
            &&
            albaran.facturado !==
            true
        ) {

            return {
                ok: false,

                mensaje:
                    "Solo puedes facturar albaranes entregados."
            };

        }


        albaran.facturado =
            true;


        albaran.estado =
            "Facturado";


        albaran.facturaId =
            facturaId;


        this.guardar();


        return {
            ok: true,

            albaran:
                albaran
        };

    }


    // =====================================================
    // DESMARCAR FACTURADO
    // =====================================================

    desmarcarFacturado(id) {

        const albaran =
            this.obtenerPorId(
                id
            );


        if (
            !albaran
        ) {

            return {
                ok: false
            };

        }


        albaran.facturado =
            false;


        albaran.facturaId =
            null;


        albaran.estado =
            "Entregado";


        this.guardar();


        return {
            ok: true,

            albaran:
                albaran
        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(id) {

        const albaran =
            this.obtenerPorId(
                id
            );


        if (
            !albaran
        ) {

            return {
                ok: false,

                mensaje:
                    "El albarán no existe."
            };

        }


        if (
            albaran.facturado ===
            true
            ||
            albaran.estado ===
            "Facturado"
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes eliminar un albarán facturado."
            };

        }


        this.albaranes =
            this.albaranes.filter(
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
            ok: true
        };

    }


    // =====================================================
    // NÚMERO
    // =====================================================

    generarNumero() {

        const year =
            new Date()
                .getFullYear();


        let maximo =
            0;


        this.albaranes.forEach(
            albaran => {

                const coincidencia =
                    String(
                        albaran.numero
                        ||
                        ""
                    )
                        .match(
                            /(\d+)$/
                        );


                if (
                    coincidencia
                ) {

                    const numero =
                        Number(
                            coincidencia[1]
                        );


                    if (
                        numero >
                        maximo
                    ) {

                        maximo =
                            numero;

                    }

                }

            }
        );


        return (
            `ALB-${year}-${String(
                maximo + 1
            ).padStart(
                4,
                "0"
            )}`
        );

    }


    // =====================================================
    // FORMATOS
    // =====================================================

    formatearNumero(
        numero
    ) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    maximumFractionDigits:
                        2
                }
            );

    }


    normalizarTexto(
        texto
    ) {

        return String(
            texto
            ||
            ""
        )
            .trim()
            .toLowerCase();

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarAlbaranes(
                this.albaranes
            );

    }

}