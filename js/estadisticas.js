export class EstadisticasService {

    constructor(
        facturaService,
        gastoService,
        produccionService,
        fincaService,
        albaranService,
        cobroPagoService,
        campaniaService
    ) {

        this.facturaService =
            facturaService;

        this.gastoService =
            gastoService;

        this.produccionService =
            produccionService;

        this.fincaService =
            fincaService;

        this.albaranService =
            albaranService;

        this.cobroPagoService =
            cobroPagoService;

        this.campaniaService =
            campaniaService;

    }


    // =====================================================
    // UTILIDADES
    // =====================================================

    obtenerLista(servicio) {

        if (!servicio) {

            return [];

        }


        if (
            typeof servicio.obtenerTodos ===
            "function"
        ) {

            const datos =
                servicio.obtenerTodos();


            return Array.isArray(datos)
                ? datos
                : [];

        }


        if (
            typeof servicio.obtenerTodas ===
            "function"
        ) {

            const datos =
                servicio.obtenerTodas();


            return Array.isArray(datos)
                ? datos
                : [];

        }


        return [];

    }


    numero(valor) {

        const numero =
            Number(valor);


        return Number.isFinite(numero)
            ? numero
            : 0;

    }


    normalizar(texto) {

        return String(
            texto
            ||
            ""
        )
            .trim()
            .toLowerCase();

    }


    // =====================================================
    // DATOS
    // =====================================================

    obtenerFacturas() {

        return this.obtenerLista(
            this.facturaService
        );

    }


    obtenerFacturasActivas() {

        return this.obtenerFacturas()
            .filter(
                factura =>
                    factura.estado !==
                    "Anulada"
            );

    }


    obtenerGastos() {

        return this.obtenerLista(
            this.gastoService
        );

    }


    obtenerProduccion() {

        return this.obtenerLista(
            this.produccionService
        );

    }


    obtenerFincas() {

        return this.obtenerLista(
            this.fincaService
        );

    }


    obtenerAlbaranes() {

        return this.obtenerLista(
            this.albaranService
        );

    }


    obtenerMovimientos() {

        return this.obtenerLista(
            this.cobroPagoService
        );

    }


    obtenerCampanias() {

        return this.obtenerLista(
            this.campaniaService
        );

    }


    // =====================================================
    // FACTURAS
    // =====================================================

    obtenerBaseFactura(factura) {

        if (!factura) {

            return 0;

        }


        if (
            factura.baseImponible !==
            undefined
        ) {

            return this.numero(
                factura.baseImponible
            );

        }


        if (
            factura.subtotal !==
            undefined
        ) {

            return this.numero(
                factura.subtotal
            );

        }


        if (
            factura.base !==
            undefined
        ) {

            return this.numero(
                factura.base
            );

        }


        const total =
            this.obtenerTotalFactura(
                factura
            );


        const porcentajeIva =
            this.obtenerPorcentajeIva(
                factura
            );


        if (
            total >
            0
        ) {

            return (
                total /
                (
                    1 +
                    (
                        porcentajeIva /
                        100
                    )
                )
            );

        }


        return 0;

    }


    obtenerPorcentajeIva(factura) {

        if (!factura) {

            return 21;

        }


        if (
            factura.porcentajeIva !==
            undefined
        ) {

            return this.numero(
                factura.porcentajeIva
            );

        }


        const iva =
            this.numero(
                factura.iva
            );


        /*
         * En las facturas actuales el campo
         * iva guarda el porcentaje.
         */

        if (
            iva >= 0
            &&
            iva <= 100
        ) {

            return iva;

        }


        return 21;

    }


    obtenerImporteIvaFactura(factura) {

        if (!factura) {

            return 0;

        }


        if (
            factura.importeIva !==
            undefined
        ) {

            return this.numero(
                factura.importeIva
            );

        }


        return (
            this.obtenerBaseFactura(
                factura
            )
            *
            (
                this.obtenerPorcentajeIva(
                    factura
                )
                /
                100
            )
        );

    }


    obtenerTotalFactura(factura) {

        if (!factura) {

            return 0;

        }


        if (
            factura.total !==
            undefined
        ) {

            return this.numero(
                factura.total
            );

        }


        if (
            factura.totalFactura !==
            undefined
        ) {

            return this.numero(
                factura.totalFactura
            );

        }


        if (
            factura.importeTotal !==
            undefined
        ) {

            return this.numero(
                factura.importeTotal
            );

        }


        const base =
            this.numero(
                factura.baseImponible
                ??
                factura.subtotal
                ??
                factura.base
            );


        return (
            base
            +
            (
                base
                *
                (
                    this.obtenerPorcentajeIva(
                        factura
                    )
                    /
                    100
                )
            )
        );

    }


    obtenerTotalFacturado() {

        return this.obtenerFacturasActivas()
            .reduce(
                (
                    total,
                    factura
                ) =>
                    total
                    +
                    this.obtenerTotalFactura(
                        factura
                    ),
                0
            );

    }


    // =====================================================
    // INGRESOS / RENTABILIDAD
    // =====================================================

    obtenerIngresos() {

        /*
         * Para rentabilidad usamos BASE IMPONIBLE.
         * El IVA no es un ingreso real de la explotación.
         */

        const facturas =
            this.obtenerFacturasActivas();


        if (
            facturas.length >
            0
        ) {

            return facturas.reduce(
                (
                    total,
                    factura
                ) =>
                    total
                    +
                    this.obtenerBaseFactura(
                        factura
                    ),
                0
            );

        }


        /*
         * Compatibilidad si todavía no existen facturas.
         */

        return this.obtenerAlbaranes()
            .filter(
                albaran =>
                    albaran.estado ===
                    "Entregado"
                    ||
                    albaran.estado ===
                    "Facturado"
                    ||
                    albaran.facturado ===
                    true
            )
            .reduce(
                (
                    total,
                    albaran
                ) =>
                    total
                    +
                    this.obtenerImporteAlbaran(
                        albaran
                    ),
                0
            );

    }


    obtenerTotalGastos() {

        return this.obtenerGastos()
            .reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    this.numero(
                        gasto.importe
                    ),
                0
            );

    }


    obtenerBeneficio() {

        return (
            this.obtenerIngresos()
            -
            this.obtenerTotalGastos()
        );

    }


    obtenerMargen() {

        const ingresos =
            this.obtenerIngresos();


        if (
            ingresos <=
            0
        ) {

            return 0;

        }


        return (
            this.obtenerBeneficio()
            /
            ingresos
        )
        *
        100;

    }


    // =====================================================
    // ALBARANES
    // =====================================================

    obtenerImporteAlbaran(albaran) {

        if (!albaran) {

            return 0;

        }


        if (
            albaran.total !==
            undefined
        ) {

            return this.numero(
                albaran.total
            );

        }


        if (
            albaran.importe !==
            undefined
        ) {

            return this.numero(
                albaran.importe
            );

        }


        if (
            Array.isArray(
                albaran.lineas
            )
        ) {

            return albaran.lineas
                .reduce(
                    (
                        total,
                        linea
                    ) =>
                        total
                        +
                        (
                            this.numero(
                                linea.total
                            )
                            ||
                            (
                                this.numero(
                                    linea.cantidad
                                )
                                *
                                this.numero(
                                    linea.precio
                                )
                            )
                        ),
                    0
                );

        }


        return (
            this.numero(
                albaran.cantidad
            )
            *
            this.numero(
                albaran.precio
                ??
                albaran.precioUnidad
            )
        );

    }


    obtenerLineasAlbaran(albaran) {

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
                    produccionId:
                        albaran.produccionId,

                    fincaId:
                        albaran.fincaId,

                    fincaNombre:
                        albaran.fincaNombre,

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
                }
            ];

        }


        return [];

    }


    // =====================================================
    // PRODUCCIÓN
    // =====================================================

    obtenerProduccionTotal() {

        return this.obtenerProduccion()
            .reduce(
                (
                    total,
                    registro
                ) =>
                    total
                    +
                    this.numero(
                        registro.cantidad
                    ),
                0
            );

    }


    obtenerProduccionReservada() {

        return this.obtenerProduccion()
            .reduce(
                (
                    total,
                    registro
                ) => {

                    if (
                        this.albaranService
                        &&
                        typeof
                        this.albaranService
                            .obtenerCantidadReservada ===
                        "function"
                    ) {

                        return (
                            total
                            +
                            this.numero(
                                this.albaranService
                                    .obtenerCantidadReservada(
                                        registro.id
                                    )
                            )
                        );

                    }


                    return total;

                },
                0
            );

    }


    obtenerProduccionEntregada() {

        return this.obtenerProduccion()
            .reduce(
                (
                    total,
                    registro
                ) => {

                    if (
                        this.albaranService
                        &&
                        typeof
                        this.albaranService
                            .obtenerCantidadConsumida ===
                        "function"
                    ) {

                        return (
                            total
                            +
                            this.numero(
                                this.albaranService
                                    .obtenerCantidadConsumida(
                                        registro.id
                                    )
                            )
                        );

                    }


                    return total;

                },
                0
            );

    }


    obtenerProduccionDisponible() {

        return Math.max(
            0,
            this.obtenerProduccionTotal()
            -
            this.obtenerProduccionReservada()
            -
            this.obtenerProduccionEntregada()
        );

    }


    obtenerPrecioMedio() {

        /*
         * Precio medio real sobre kilos vendidos/entregados,
         * no sobre toda la producción registrada.
         */

        let kilosVendidos =
            0;


        this.obtenerAlbaranes()
            .filter(
                albaran =>
                    albaran.estado ===
                    "Entregado"
                    ||
                    albaran.estado ===
                    "Facturado"
                    ||
                    albaran.facturado ===
                    true
            )
            .forEach(
                albaran => {

                    this.obtenerLineasAlbaran(
                        albaran
                    )
                    .forEach(
                        linea => {

                            if (
                                String(
                                    linea.unidad
                                    ||
                                    "kg"
                                )
                                ===
                                "kg"
                            ) {

                                kilosVendidos +=
                                    this.numero(
                                        linea.cantidad
                                    );

                            }

                        }
                    );

                }
            );


        if (
            kilosVendidos <=
            0
        ) {

            return 0;

        }


        return (
            this.obtenerIngresos()
            /
            kilosVendidos
        );

    }


    obtenerCostePorKg() {

        const kilos =
            this.obtenerProduccionTotal();


        if (
            kilos <=
            0
        ) {

            return 0;

        }


        return (
            this.obtenerTotalGastos()
            /
            kilos
        );

    }


    // =====================================================
    // TESORERÍA
    // =====================================================

    esCobro(movimiento) {

        return (
            this.normalizar(
                movimiento?.tipo
            )
            ===
            "cobro"
        );

    }


    esPago(movimiento) {

        return (
            this.normalizar(
                movimiento?.tipo
            )
            ===
            "pago"
        );

    }


    obtenerTotalCobrado() {

        if (
            this.cobroPagoService
            &&
            typeof
            this.cobroPagoService
                .obtenerTotalCobrado ===
            "function"
        ) {

            return this.numero(
                this.cobroPagoService
                    .obtenerTotalCobrado()
            );

        }


        return this.obtenerMovimientos()
            .filter(
                movimiento =>
                    this.esCobro(
                        movimiento
                    )
            )
            .reduce(
                (
                    total,
                    movimiento
                ) =>
                    total
                    +
                    this.numero(
                        movimiento.importe
                    ),
                0
            );

    }


    obtenerTotalPagadoReal() {

        if (
            this.cobroPagoService
            &&
            typeof
            this.cobroPagoService
                .obtenerTotalPagado ===
            "function"
        ) {

            return this.numero(
                this.cobroPagoService
                    .obtenerTotalPagado()
            );

        }


        return this.obtenerMovimientos()
            .filter(
                movimiento =>
                    this.esPago(
                        movimiento
                    )
            )
            .reduce(
                (
                    total,
                    movimiento
                ) =>
                    total
                    +
                    this.numero(
                        movimiento.importe
                    ),
                0
            );

    }


    obtenerPendienteCobro() {

        if (
            this.cobroPagoService
            &&
            typeof
            this.cobroPagoService
                .obtenerTotalPendienteCobro ===
            "function"
        ) {

            return this.numero(
                this.cobroPagoService
                    .obtenerTotalPendienteCobro()
            );

        }


        return this.obtenerFacturasActivas()
            .reduce(
                (
                    total,
                    factura
                ) =>
                    total
                    +
                    Math.max(
                        0,
                        this.obtenerTotalFactura(
                            factura
                        )
                        -
                        this.obtenerCobradoFactura(
                            factura.id
                        )
                    ),
                0
            );

    }


    obtenerPendientePago() {

        /*
         * IMPORTANTE:
         * incluye también gastos parcialmente pagados.
         */

        if (
            this.cobroPagoService
            &&
            typeof
            this.cobroPagoService
                .obtenerTotalPendientePago ===
            "function"
        ) {

            return this.numero(
                this.cobroPagoService
                    .obtenerTotalPendientePago()
            );

        }


        return this.obtenerGastos()
            .reduce(
                (
                    total,
                    gasto
                ) => {

                    const pendiente =
                        gasto.pendientePago !==
                        undefined

                            ? this.numero(
                                gasto.pendientePago
                            )

                            : Math.max(
                                0,
                                this.numero(
                                    gasto.importe
                                )
                                -
                                this.numero(
                                    gasto.pagadoAcumulado
                                )
                            );


                    return (
                        total
                        +
                        pendiente
                    );

                },
                0
            );

    }


    obtenerCajaReal() {

        return (
            this.obtenerTotalCobrado()
            -
            this.obtenerTotalPagadoReal()
        );

    }


    obtenerCobradoFactura(
        facturaId
    ) {

        if (
            this.cobroPagoService
            &&
            typeof
            this.cobroPagoService
                .obtenerCobradoFactura ===
            "function"
        ) {

            return this.numero(
                this.cobroPagoService
                    .obtenerCobradoFactura(
                        facturaId
                    )
            );

        }


        return this.obtenerMovimientos()
            .filter(
                movimiento =>
                    this.esCobro(
                        movimiento
                    )
                    &&
                    Number(
                        movimiento.facturaId
                    )
                    ===
                    Number(
                        facturaId
                    )
            )
            .reduce(
                (
                    total,
                    movimiento
                ) =>
                    total
                    +
                    this.numero(
                        movimiento.importe
                    ),
                0
            );

    }


    // =====================================================
    // GASTOS POR CATEGORÍA
    // =====================================================

    obtenerGastosPorCategoria() {

        const resultado = {};


        this.obtenerGastos()
            .forEach(
                gasto => {

                    const categoria =
                        gasto.categoria
                        ||
                        "Otros";


                    if (
                        !resultado[
                            categoria
                        ]
                    ) {

                        resultado[
                            categoria
                        ] =
                            0;

                    }


                    resultado[
                        categoria
                    ]
                    +=
                        this.numero(
                            gasto.importe
                        );

                }
            );


        return Object.entries(
            resultado
        )
        .map(
            ([
                categoria,
                total
            ]) => ({

                categoria:
                    categoria,

                total:
                    total

            })
        )
        .sort(
            (a, b) =>
                b.total -
                a.total
        );

    }


    // =====================================================
    // PRODUCCIÓN POR FINCA
    // =====================================================

    obtenerProduccionPorFinca() {

        const resultado = {};


        this.obtenerProduccion()
            .forEach(
                registro => {

                    const finca =
                        registro.fincaNombre
                        ||
                        registro.finca
                        ||
                        "Sin finca";


                    if (
                        !resultado[
                            finca
                        ]
                    ) {

                        resultado[
                            finca
                        ] =
                            0;

                    }


                    resultado[
                        finca
                    ]
                    +=
                        this.numero(
                            registro.cantidad
                        );

                }
            );


        return Object.entries(
            resultado
        )
        .map(
            ([
                finca,
                total
            ]) => ({

                finca:
                    finca,

                total:
                    total

            })
        )
        .sort(
            (a, b) =>
                b.total -
                a.total
        );

    }


    // =====================================================
    // PRODUCCIÓN POR PASADA
    // =====================================================

    obtenerProduccionPorPasada() {

        const orden = [
            "1ª",
            "2ª",
            "3ª",
            "R"
        ];


        const resultado = {

            "1ª":
                0,

            "2ª":
                0,

            "3ª":
                0,

            "R":
                0

        };


        this.obtenerProduccion()
            .forEach(
                registro => {

                    const texto =
                        String(
                            registro.pasada
                            ??
                            "1ª"
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
                            "R"

                    };


                    const pasada =
                        equivalencias[
                            texto
                        ]
                        ||
                        "1ª";


                    resultado[
                        pasada
                    ]
                    +=
                        this.numero(
                            registro.cantidad
                        );

                }
            );


        return orden
            .map(
                pasada => ({

                    pasada:
                        pasada,

                    total:
                        resultado[
                            pasada
                        ]

                })
            );

    }


    // =====================================================
    // FACTURACIÓN POR CLIENTE
    // =====================================================

    obtenerFacturacionPorCliente() {

        const resultado = {};


        this.obtenerFacturasActivas()
            .forEach(
                factura => {

                    const cliente =
                        factura.clienteNombre
                        ||
                        factura.cliente
                        ||
                        "Sin cliente";


                    if (
                        !resultado[
                            cliente
                        ]
                    ) {

                        resultado[
                            cliente
                        ] =
                            0;

                    }


                    resultado[
                        cliente
                    ]
                    +=
                        this.obtenerBaseFactura(
                            factura
                        );

                }
            );


        return Object.entries(
            resultado
        )
        .map(
            ([
                cliente,
                total
            ]) => ({

                cliente:
                    cliente,

                total:
                    total

            })
        )
        .sort(
            (a, b) =>
                b.total -
                a.total
        );

    }


    // =====================================================
    // COBRADO POR CLIENTE
    // =====================================================

    obtenerCobradoPorCliente() {

        const resultado = {};


        this.obtenerMovimientos()
            .filter(
                movimiento =>
                    this.esCobro(
                        movimiento
                    )
            )
            .forEach(
                movimiento => {

                    let cliente =
                        movimiento.tercero
                        ||
                        movimiento.clienteNombre
                        ||
                        movimiento.cliente
                        ||
                        "";


                    /*
                     * Si tenemos facturaId, usamos
                     * el cliente oficial de la factura.
                     */

                    if (
                        movimiento.facturaId
                    ) {

                        const factura =
                            this.obtenerFacturas()
                                .find(
                                    item =>
                                        Number(
                                            item.id
                                        )
                                        ===
                                        Number(
                                            movimiento.facturaId
                                        )
                                );


                        if (
                            factura
                        ) {

                            cliente =
                                factura.clienteNombre
                                ||
                                factura.cliente
                                ||
                                cliente;

                        }

                    }


                    cliente =
                        cliente
                        ||
                        "Sin cliente";


                    if (
                        !resultado[
                            cliente
                        ]
                    ) {

                        resultado[
                            cliente
                        ] =
                            0;

                    }


                    resultado[
                        cliente
                    ]
                    +=
                        this.numero(
                            movimiento.importe
                        );

                }
            );


        return Object.entries(
            resultado
        )
        .map(
            ([
                cliente,
                total
            ]) => ({

                cliente:
                    cliente,

                total:
                    total

            })
        )
        .sort(
            (a, b) =>
                b.total -
                a.total
        );

    }


    // =====================================================
    // FACTURA -> ALBARANES
    // =====================================================

    obtenerAlbaranesFactura(factura) {

        if (
            !factura
        ) {

            return [];

        }


        const ids =
            Array.isArray(
                factura.albaranesIds
            )

                ? factura.albaranesIds

                : [];


        const albaranes =
            this.obtenerAlbaranes();


        return ids
            .map(
                id =>
                    albaranes.find(
                        albaran =>
                            Number(
                                albaran.id
                            )
                            ===
                            Number(
                                id
                            )
                    )
            )
            .filter(Boolean);

    }


    // =====================================================
    // VENTAS POR FINCA
    // =====================================================

    obtenerVentasPorFinca(finca) {

        let total =
            0;


        /*
         * Usamos FACTURAS activas.
         * Así una factura anulada deja de contar.
         *
         * Repartimos la base entre sus albaranes
         * proporcionalmente al importe de cada albarán.
         */

        this.obtenerFacturasActivas()
            .forEach(
                factura => {

                    const albaranes =
                        this.obtenerAlbaranesFactura(
                            factura
                        );


                    const totalAlbaranes =
                        albaranes.reduce(
                            (
                                suma,
                                albaran
                            ) =>
                                suma
                                +
                                this.obtenerImporteAlbaran(
                                    albaran
                                ),
                            0
                        );


                    if (
                        totalAlbaranes <=
                        0
                    ) {

                        return;

                    }


                    albaranes.forEach(
                        albaran => {

                            const importeAlbaran =
                                this.obtenerImporteAlbaran(
                                    albaran
                                );


                            const baseAsignada =
                                this.obtenerBaseFactura(
                                    factura
                                )
                                *
                                (
                                    importeAlbaran
                                    /
                                    totalAlbaranes
                                );


                            const lineas =
                                this.obtenerLineasAlbaran(
                                    albaran
                                );


                            const totalLineas =
                                lineas.reduce(
                                    (
                                        suma,
                                        linea
                                    ) =>
                                        suma
                                        +
                                        (
                                            this.numero(
                                                linea.total
                                            )
                                            ||
                                            (
                                                this.numero(
                                                    linea.cantidad
                                                )
                                                *
                                                this.numero(
                                                    linea.precio
                                                )
                                            )
                                        ),
                                    0
                                );


                            if (
                                totalLineas <=
                                0
                            ) {

                                if (
                                    Number(
                                        albaran.fincaId
                                    )
                                    ===
                                    Number(
                                        finca.id
                                    )
                                ) {

                                    total +=
                                        baseAsignada;

                                }


                                return;

                            }


                            lineas.forEach(
                                linea => {

                                    if (
                                        Number(
                                            linea.fincaId
                                        )
                                        !==
                                        Number(
                                            finca.id
                                        )
                                    ) {

                                        return;

                                    }


                                    const importeLinea =
                                        this.numero(
                                            linea.total
                                        )
                                        ||
                                        (
                                            this.numero(
                                                linea.cantidad
                                            )
                                            *
                                            this.numero(
                                                linea.precio
                                            )
                                        );


                                    total +=
                                        baseAsignada
                                        *
                                        (
                                            importeLinea
                                            /
                                            totalLineas
                                        );

                                }
                            );

                        }
                    );

                }
            );


        return total;

    }


    // =====================================================
    // RENTABILIDAD FINCA
    // =====================================================

    obtenerRentabilidadPorFinca() {

        return this.obtenerFincas()
            .map(
                finca => {

                    const fincaId =
                        Number(
                            finca.id
                        );


                    const produccion =
                        this.obtenerProduccion()
                            .filter(
                                registro =>
                                    Number(
                                        registro.fincaId
                                    )
                                    ===
                                    fincaId
                            )
                            .reduce(
                                (
                                    total,
                                    registro
                                ) =>
                                    total
                                    +
                                    this.numero(
                                        registro.cantidad
                                    ),
                                0
                            );


                    const gastos =
                        this.obtenerGastos()
                            .filter(
                                gasto =>
                                    Number(
                                        gasto.fincaId
                                    )
                                    ===
                                    fincaId
                            )
                            .reduce(
                                (
                                    total,
                                    gasto
                                ) =>
                                    total
                                    +
                                    this.numero(
                                        gasto.importe
                                    ),
                                0
                            );


                    const ventas =
                        this.obtenerVentasPorFinca(
                            finca
                        );


                    const resultado =
                        ventas -
                        gastos;


                    const margen =
                        ventas >
                        0

                            ? (
                                resultado
                                /
                                ventas
                            )
                            *
                            100

                            : 0;


                    return {

                        fincaId:
                            finca.id,

                        fincaNombre:
                            finca.nombre,

                        produccion:
                            produccion,

                        ventas:
                            ventas,

                        gastos:
                            gastos,

                        resultado:
                            resultado,

                        margen:
                            margen

                    };

                }
            );

    }


    // =====================================================
    // CAMPANYAS
    // =====================================================

    perteneceACampania(
        registro,
        campania
    ) {

        if (
            !registro
            ||
            !campania
        ) {

            return false;

        }


        if (
            registro.campaniaId !==
            undefined
            &&
            registro.campaniaId !==
            null
            &&
            registro.campaniaId !==
            ""
        ) {

            return (
                Number(
                    registro.campaniaId
                )
                ===
                Number(
                    campania.id
                )
            );

        }


        if (
            registro.campaniaNombre
            &&
            campania.nombre
            &&
            registro.campaniaNombre ===
            campania.nombre
        ) {

            return true;

        }


        const mismaFinca =
            (
                registro.fincaId !==
                undefined
                &&
                registro.fincaId !==
                null
                &&
                Number(
                    registro.fincaId
                )
                ===
                Number(
                    campania.fincaId
                )
            )
            ||
            (
                registro.fincaNombre
                &&
                campania.fincaNombre
                &&
                registro.fincaNombre ===
                campania.fincaNombre
            );


        if (
            !mismaFinca
        ) {

            return false;

        }


        const campaniasFinca =
            this.obtenerCampanias()
                .filter(
                    item =>
                        Number(
                            item.fincaId
                        )
                        ===
                        Number(
                            campania.fincaId
                        )
                );


        if (
            campaniasFinca.length ===
            1
        ) {

            return true;

        }


        const fecha =
            registro.fecha;


        if (
            !fecha
        ) {

            return false;

        }


        if (
            campania.fechaInicio
            &&
            fecha <
            campania.fechaInicio
        ) {

            return false;

        }


        if (
            campania.fechaFin
            &&
            fecha >
            campania.fechaFin
        ) {

            return false;

        }


        return true;

    }


    // =====================================================
    // INGRESOS CAMPANYA
    // =====================================================

    obtenerIngresosCampania(
        campania
    ) {

        let total =
            0;


        this.obtenerFacturasActivas()
            .forEach(
                factura => {

                    const albaranes =
                        this.obtenerAlbaranesFactura(
                            factura
                        );


                    const totalAlbaranes =
                        albaranes.reduce(
                            (
                                suma,
                                albaran
                            ) =>
                                suma
                                +
                                this.obtenerImporteAlbaran(
                                    albaran
                                ),
                            0
                        );


                    if (
                        totalAlbaranes <=
                        0
                    ) {

                        return;

                    }


                    albaranes.forEach(
                        albaran => {

                            const lineas =
                                this.obtenerLineasAlbaran(
                                    albaran
                                );


                            const totalLineas =
                                lineas.reduce(
                                    (
                                        suma,
                                        linea
                                    ) =>
                                        suma
                                        +
                                        (
                                            this.numero(
                                                linea.total
                                            )
                                            ||
                                            (
                                                this.numero(
                                                    linea.cantidad
                                                )
                                                *
                                                this.numero(
                                                    linea.precio
                                                )
                                            )
                                        ),
                                    0
                                );


                            const importeAlbaran =
                                this.obtenerImporteAlbaran(
                                    albaran
                                );


                            const baseAlbaran =
                                this.obtenerBaseFactura(
                                    factura
                                )
                                *
                                (
                                    importeAlbaran
                                    /
                                    totalAlbaranes
                                );


                            if (
                                totalLineas <=
                                0
                            ) {

                                if (
                                    this.perteneceACampania(
                                        albaran,
                                        campania
                                    )
                                ) {

                                    total +=
                                        baseAlbaran;

                                }


                                return;

                            }


                            lineas.forEach(
                                linea => {

                                    if (
                                        !this.perteneceACampania(
                                            linea,
                                            campania
                                        )
                                    ) {

                                        return;

                                    }


                                    const importeLinea =
                                        this.numero(
                                            linea.total
                                        )
                                        ||
                                        (
                                            this.numero(
                                                linea.cantidad
                                            )
                                            *
                                            this.numero(
                                                linea.precio
                                            )
                                        );


                                    total +=
                                        baseAlbaran
                                        *
                                        (
                                            importeLinea
                                            /
                                            totalLineas
                                        );

                                }
                            );

                        }
                    );

                }
            );


        return total;

    }


    // =====================================================
    // RENTABILIDAD CAMPANYA
    // =====================================================

    obtenerRentabilidadPorCampania() {

        return this.obtenerCampanias()
            .map(
                campania => {

                    const produccion =
                        this.obtenerProduccion()
                            .filter(
                                registro =>
                                    this.perteneceACampania(
                                        registro,
                                        campania
                                    )
                            )
                            .reduce(
                                (
                                    total,
                                    registro
                                ) =>
                                    total
                                    +
                                    this.numero(
                                        registro.cantidad
                                    ),
                                0
                            );


                    const gastos =
                        this.obtenerGastos()
                            .filter(
                                gasto =>
                                    this.perteneceACampania(
                                        gasto,
                                        campania
                                    )
                            )
                            .reduce(
                                (
                                    total,
                                    gasto
                                ) =>
                                    total
                                    +
                                    this.numero(
                                        gasto.importe
                                    ),
                                0
                            );


                    const ingresos =
                        this.obtenerIngresosCampania(
                            campania
                        );


                    const beneficio =
                        ingresos -
                        gastos;


                    const margen =
                        ingresos >
                        0

                            ? (
                                beneficio
                                /
                                ingresos
                            )
                            *
                            100

                            : 0;


                    return {

                        campaniaId:
                            campania.id,

                        nombre:
                            campania.nombre,

                        estado:
                            campania.estado,

                        fincaId:
                            campania.fincaId,

                        fincaNombre:
                            campania.fincaNombre
                            ||
                            this.obtenerNombreFinca(
                                campania.fincaId
                            ),

                        fechaInicio:
                            campania.fechaInicio,

                        fechaFin:
                            campania.fechaFin,

                        produccion:
                            produccion,

                        ingresos:
                            ingresos,

                        gastos:
                            gastos,

                        beneficio:
                            beneficio,

                        margen:
                            margen

                    };

                }
            );

    }


    obtenerNombreFinca(
        fincaId
    ) {

        const finca =
            this.obtenerFincas()
                .find(
                    item =>
                        Number(
                            item.id
                        )
                        ===
                        Number(
                            fincaId
                        )
                );


        return finca
            ? finca.nombre
            : "Sin finca";

    }

}