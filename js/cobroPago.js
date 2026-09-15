import { StorageService } from "./storage.js";

export class CobroPagoService {

    constructor(
        facturaService,
        gastoService
    ) {

        this.facturaService =
            facturaService;

        this.gastoService =
            gastoService;

        this.movimientos =
            StorageService.obtenerCobrosPagos();


        if (
            !Array.isArray(
                this.movimientos
            )
        ) {

            this.movimientos = [];

        }


        this.sincronizarEstadosFacturas();

        this.sincronizarEstadosGastos();

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtenerTodos() {

        return this.movimientos;

    }


    obtenerTodas() {

        return this.movimientos;

    }


    obtenerPorId(id) {

        return (
            this.movimientos.find(
                movimiento =>
                    Number(
                        movimiento.id
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


    obtenerCobros() {

        return this.movimientos.filter(
            movimiento =>
                movimiento.tipo ===
                "Cobro"
        );

    }


    obtenerPagos() {

        return this.movimientos.filter(
            movimiento =>
                movimiento.tipo ===
                "Pago"
        );

    }


    // =====================================================
    // FACTURAS
    // =====================================================

    obtenerFacturas() {

        if (
            this.facturaService
            &&
            typeof
            this.facturaService
                .obtenerTodos ===
            "function"
        ) {

            const datos =
                this.facturaService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            this.facturaService
            &&
            typeof
            this.facturaService
                .obtenerTodas ===
            "function"
        ) {

            const datos =
                this.facturaService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    obtenerFacturaPorId(id) {

        if (
            this.facturaService
            &&
            typeof
            this.facturaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.facturaService
                    .obtenerPorId(
                        Number(
                            id
                        )
                    )
                ||
                null
            );

        }


        return (
            this.obtenerFacturas()
                .find(
                    factura =>
                        Number(
                            factura.id
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


    obtenerTotalFactura(
        factura
    ) {

        if (
            !factura
        ) {

            return 0;

        }


        if (
            factura.total !==
            undefined
        ) {

            return Number(
                factura.total
                ||
                0
            );

        }


        if (
            factura.totalFactura !==
            undefined
        ) {

            return Number(
                factura.totalFactura
                ||
                0
            );

        }


        const base =
            Number(
                factura.baseImponible
                ??
                factura.subtotal
                ??
                factura.base
                ??
                0
            );


        const iva =
            Number(
                factura.importeIva
                ??
                0
            );


        return (
            base +
            iva
        );

    }


    // =====================================================
    // GASTOS
    // =====================================================

    obtenerGastos() {

        if (
            this.gastoService
            &&
            typeof
            this.gastoService
                .obtenerTodos ===
            "function"
        ) {

            const datos =
                this.gastoService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            this.gastoService
            &&
            typeof
            this.gastoService
                .obtenerTodas ===
            "function"
        ) {

            const datos =
                this.gastoService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    obtenerGastoPorId(id) {

        if (
            this.gastoService
            &&
            typeof
            this.gastoService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.gastoService
                    .obtenerPorId(
                        Number(
                            id
                        )
                    )
                ||
                null
            );

        }


        return (
            this.obtenerGastos()
                .find(
                    gasto =>
                        Number(
                            gasto.id
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


    // =====================================================
    // COBROS DE FACTURA
    // =====================================================

    obtenerCobrosDeFactura(
        facturaId
    ) {

        return this.movimientos.filter(
            movimiento =>
                movimiento.tipo ===
                "Cobro"
                &&
                Number(
                    movimiento.facturaId
                )
                ===
                Number(
                    facturaId
                )
        );

    }


    obtenerCobradoFactura(
        facturaId
    ) {

        return this.obtenerCobrosDeFactura(
            facturaId
        )
            .reduce(
                (
                    total,
                    movimiento
                ) =>
                    total
                    +
                    Number(
                        movimiento.importe
                        ||
                        0
                    ),
                0
            );

    }


    obtenerPendienteFactura(
        facturaId
    ) {

        const factura =
            this.obtenerFacturaPorId(
                facturaId
            );


        if (
            !factura
        ) {

            return 0;

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return 0;

        }


        const total =
            this.obtenerTotalFactura(
                factura
            );


        const cobrado =
            this.obtenerCobradoFactura(
                facturaId
            );


        return Number(
            Math.max(
                0,
                total -
                cobrado
            )
                .toFixed(
                    2
                )
        );

    }


    obtenerEstadoCobroFactura(
        facturaId
    ) {

        const factura =
            this.obtenerFacturaPorId(
                facturaId
            );


        if (
            !factura
        ) {

            return "Pendiente";

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return "Anulada";

        }


        const total =
            this.obtenerTotalFactura(
                factura
            );


        const cobrado =
            this.obtenerCobradoFactura(
                facturaId
            );


        if (
            cobrado <=
            0.001
        ) {

            return "Pendiente";

        }


        if (
            cobrado >=
            total -
            0.001
        ) {

            return "Cobrada";

        }


        return "Parcialmente cobrada";

    }


    // =====================================================
    // PAGOS DE GASTO
    // =====================================================

    obtenerPagosDeGasto(
        gastoId
    ) {

        return this.movimientos.filter(
            movimiento =>
                movimiento.tipo ===
                "Pago"
                &&
                Number(
                    movimiento.gastoId
                )
                ===
                Number(
                    gastoId
                )
        );

    }


    obtenerPagadoGasto(
        gastoId
    ) {

        return Number(
            this.obtenerPagosDeGasto(
                gastoId
            )
                .reduce(
                    (
                        total,
                        movimiento
                    ) =>
                        total
                        +
                        Number(
                            movimiento.importe
                            ||
                            0
                        ),
                    0
                )
                .toFixed(
                    2
                )
        );

    }


    obtenerPendienteGasto(
        gastoId
    ) {

        const gasto =
            this.obtenerGastoPorId(
                gastoId
            );


        if (
            !gasto
        ) {

            return 0;

        }


        const pagado =
            this.obtenerPagadoGasto(
                gastoId
            );


        return Number(
            Math.max(
                0,
                Number(
                    gasto.importe
                    ||
                    0
                )
                -
                pagado
            )
                .toFixed(
                    2
                )
        );

    }


    obtenerEstadoPagoGasto(
        gastoId
    ) {

        const gasto =
            this.obtenerGastoPorId(
                gastoId
            );


        if (
            !gasto
        ) {

            return "Pendiente";

        }


        const total =
            Number(
                gasto.importe
                ||
                0
            );


        const pagado =
            this.obtenerPagadoGasto(
                gastoId
            );


        if (
            pagado <=
            0.001
        ) {

            return "Pendiente";

        }


        if (
            pagado >=
            total -
            0.001
        ) {

            return "Pagado";

        }


        return "Parcialmente pagado";

    }


    // =====================================================
    // REGISTRAR COBRO
    // =====================================================

    registrarCobro(datos) {

        const factura =
            this.obtenerFacturaPorId(
                datos.facturaId
            );


        if (
            !factura
        ) {

            return {
                ok: false,

                mensaje:
                    "La factura seleccionada no existe."
            };

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes registrar cobros sobre una factura anulada."
            };

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce la fecha del cobro."
            };

        }


        const pendiente =
            this.obtenerPendienteFactura(
                factura.id
            );


        if (
            pendiente <=
            0.001
        ) {

            return {
                ok: false,

                mensaje:
                    "Esta factura ya está completamente cobrada."
            };

        }


        const importe =
            Number(
                datos.importe
            );


        if (
            !Number.isFinite(
                importe
            )
            ||
            importe <=
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce un importe válido."
            };

        }


        if (
            importe >
            pendiente +
            0.001
        ) {

            return {
                ok: false,

                mensaje:
                    `No puedes cobrar ${this.formatearDinero(
                        importe
                    )}. El importe pendiente es ${this.formatearDinero(
                        pendiente
                    )}.`
            };

        }


        const movimiento = {

            id:
                Date.now(),

            tipo:
                "Cobro",

            facturaId:
                factura.id,

            gastoId:
                null,

            referencia:
                factura.numero,

            tercero:
                factura.clienteNombre
                ||
                factura.cliente
                ||
                "Cliente",

            fecha:
                datos.fecha,

            importe:
                Number(
                    importe.toFixed(
                        2
                    )
                ),

            metodo:
                datos.metodo
                ||
                "Transferencia",

            referenciaPago:
                String(
                    datos.referenciaPago
                    ||
                    ""
                )
                    .trim(),

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


        this.movimientos.push(
            movimiento
        );


        this.guardar();


        this.actualizarEstadoFactura(
            factura.id
        );


        return {
            ok: true,

            movimiento:
                movimiento
        };

    }


    // =====================================================
    // REGISTRAR PAGO
    // =====================================================

    registrarPago(datos) {

        const gasto =
            this.obtenerGastoPorId(
                datos.gastoId
            );


        if (
            !gasto
        ) {

            return {
                ok: false,

                mensaje:
                    "El gasto seleccionado no existe."
            };

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce la fecha del pago."
            };

        }


        const pendiente =
            this.obtenerPendienteGasto(
                gasto.id
            );


        if (
            pendiente <=
            0.001
        ) {

            return {
                ok: false,

                mensaje:
                    "Este gasto ya está completamente pagado."
            };

        }


        const importe =
            Number(
                datos.importe
            );


        if (
            !Number.isFinite(
                importe
            )
            ||
            importe <=
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce un importe válido."
            };

        }


        if (
            importe >
            pendiente +
            0.001
        ) {

            return {
                ok: false,

                mensaje:
                    `No puedes pagar ${this.formatearDinero(
                        importe
                    )}. El importe pendiente es ${this.formatearDinero(
                        pendiente
                    )}.`
            };

        }


        const movimiento = {

            id:
                Date.now(),

            tipo:
                "Pago",

            facturaId:
                null,

            gastoId:
                gasto.id,

            referencia:
                gasto.concepto
                ||
                "Gasto",

            tercero:
                gasto.proveedorNombre
                ||
                gasto.proveedor
                ||
                "Sin proveedor",

            fecha:
                datos.fecha,

            importe:
                Number(
                    importe.toFixed(
                        2
                    )
                ),

            metodo:
                datos.metodo
                ||
                "Transferencia",

            referenciaPago:
                String(
                    datos.referenciaPago
                    ||
                    ""
                )
                    .trim(),

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


        this.movimientos.push(
            movimiento
        );


        this.guardar();


        this.actualizarEstadoGasto(
            gasto.id
        );


        return {
            ok: true,

            movimiento:
                movimiento
        };

    }


    // =====================================================
    // ELIMINAR MOVIMIENTO
    // =====================================================

    eliminar(id) {

        const movimiento =
            this.obtenerPorId(
                id
            );


        if (
            !movimiento
        ) {

            return {
                ok: false,

                mensaje:
                    "El movimiento no existe."
            };

        }


        this.movimientos =
            this.movimientos.filter(
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


        if (
            movimiento.tipo ===
            "Cobro"
        ) {

            this.actualizarEstadoFactura(
                movimiento.facturaId
            );

        }


        if (
            movimiento.tipo ===
            "Pago"
        ) {

            this.actualizarEstadoGasto(
                movimiento.gastoId
            );

        }


        return {
            ok: true
        };

    }


    // =====================================================
    // ACTUALIZAR FACTURA
    // =====================================================

    actualizarEstadoFactura(
        facturaId
    ) {

        const factura =
            this.obtenerFacturaPorId(
                facturaId
            );


        if (
            !factura
        ) {

            return;

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return;

        }


        factura.estado =
            this.obtenerEstadoCobroFactura(
                facturaId
            );


        if (
            typeof
            this.facturaService
                ?.guardar ===
            "function"
        ) {

            this.facturaService
                .guardar();

        }

    }


    // =====================================================
    // ACTUALIZAR GASTO
    // =====================================================

    actualizarEstadoGasto(
        gastoId
    ) {

        const gasto =
            this.obtenerGastoPorId(
                gastoId
            );


        if (
            !gasto
        ) {

            return;

        }


        const pagado =
            this.obtenerPagadoGasto(
                gastoId
            );


        const pendiente =
            this.obtenerPendienteGasto(
                gastoId
            );


        /*
         * USAMOS LA FUNCIÓN NUEVA DE gasto.js.
         */

        if (
            this.gastoService
            &&
            typeof
            this.gastoService
                .actualizarEstadoFinanciero ===
            "function"
        ) {

            this.gastoService
                .actualizarEstadoFinanciero(
                    gastoId,
                    pagado,
                    pendiente
                );


            return;

        }


        /*
         * RESPALDO
         */

        gasto.pagadoAcumulado =
            pagado;


        gasto.pendientePago =
            pendiente;


        gasto.estado =
            this.obtenerEstadoPagoGasto(
                gastoId
            );


        if (
            typeof
            this.gastoService
                ?.guardar ===
            "function"
        ) {

            this.gastoService
                .guardar();

        }

    }


    // =====================================================
    // SINCRONIZAR FACTURAS
    // =====================================================

    sincronizarEstadosFacturas() {

        this.obtenerFacturas()
            .forEach(
                factura => {

                    if (
                        factura.estado !==
                        "Anulada"
                    ) {

                        this.actualizarEstadoFactura(
                            factura.id
                        );

                    }

                }
            );

    }


    // =====================================================
    // SINCRONIZAR GASTOS
    // =====================================================

    sincronizarEstadosGastos() {

        this.obtenerGastos()
            .forEach(
                gasto => {

                    this.actualizarEstadoGasto(
                        gasto.id
                    );

                }
            );

    }


    // =====================================================
    // TOTALES
    // =====================================================

    obtenerTotalCobrado() {

        return this.obtenerCobros()
            .reduce(
                (
                    total,
                    movimiento
                ) =>
                    total
                    +
                    Number(
                        movimiento.importe
                        ||
                        0
                    ),
                0
            );

    }


    obtenerTotalPagado() {

        return this.obtenerPagos()
            .reduce(
                (
                    total,
                    movimiento
                ) =>
                    total
                    +
                    Number(
                        movimiento.importe
                        ||
                        0
                    ),
                0
            );

    }


    obtenerTotalPendienteCobro() {

        return this.obtenerFacturas()
            .filter(
                factura =>
                    factura.estado !==
                    "Anulada"
            )
            .reduce(
                (
                    total,
                    factura
                ) =>
                    total
                    +
                    this.obtenerPendienteFactura(
                        factura.id
                    ),
                0
            );

    }


    obtenerTotalPendientePago() {

        return this.obtenerGastos()
            .reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    this.obtenerPendienteGasto(
                        gasto.id
                    ),
                0
            );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarCobrosPagos(
                this.movimientos
            );

    }


    // =====================================================
    // FORMATO
    // =====================================================

    formatearDinero(numero) {

        return Number(
            numero
            ||
            0
        )
            .toLocaleString(
                "es-ES",
                {
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )
            +
            " €";

    }

}