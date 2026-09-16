import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";


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
            StorageService
                .obtenerCobrosPagos();


        if (
            !Array.isArray(
                this.movimientos
            )
        ) {

            this.movimientos =
                [];

        }


        /*
         * IMPORTANTE
         *
         * Ya NO sincronizamos automáticamente facturas
         * y gastos en el constructor.
         *
         * Abrir GestaCamps no debe provocar escrituras
         * ni entradas nuevas en Historial.
         */

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


    obtenerPorId(
        id
    ) {

        return (
            this.movimientos
                .find(
                    movimiento =>
                        mismoId(
                            movimiento.id,
                            id
                        )
                )
            ||
            null
        );

    }


    obtenerCobros() {

        return this.movimientos
            .filter(
                movimiento =>
                    movimiento.tipo ===
                    "Cobro"
            );

    }


    obtenerPagos() {

        return this.movimientos
            .filter(
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
            typeof this.facturaService
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
            typeof this.facturaService
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


    obtenerFacturaPorId(
        id
    ) {

        if (
            this.facturaService
            &&
            typeof this.facturaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.facturaService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return (
            this.obtenerFacturas()
                .find(
                    factura =>
                        mismoId(
                            factura.id,
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

            return numeroSeguro(
                factura.total,
                0
            );

        }


        if (
            factura.totalFactura !==
            undefined
        ) {

            return numeroSeguro(
                factura.totalFactura,
                0
            );

        }


        const base =
            numeroSeguro(
                factura.baseImponible
                ??
                factura.subtotal
                ??
                factura.base,
                0
            );


        const iva =
            numeroSeguro(
                factura.importeIva,
                0
            );


        return Number(
            (
                base
                +
                iva
            )
                .toFixed(
                    2
                )
        );

    }


    // =====================================================
    // GASTOS
    // =====================================================

    obtenerGastos() {

        if (
            this.gastoService
            &&
            typeof this.gastoService
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
            typeof this.gastoService
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


    obtenerGastoPorId(
        id
    ) {

        if (
            this.gastoService
            &&
            typeof this.gastoService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.gastoService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return (
            this.obtenerGastos()
                .find(
                    gasto =>
                        mismoId(
                            gasto.id,
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

        return this.movimientos
            .filter(
                movimiento =>
                    movimiento.tipo ===
                    "Cobro"
                    &&
                    mismoId(
                        movimiento.facturaId,
                        facturaId
                    )
            );

    }


    obtenerCobradoFactura(
        facturaId
    ) {

        return Number(
            this.obtenerCobrosDeFactura(
                facturaId
            )
                .reduce(
                    (
                        total,
                        movimiento
                    ) =>
                        total
                        +
                        numeroSeguro(
                            movimiento.importe,
                            0
                        ),
                    0
                )
                .toFixed(
                    2
                )
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
                total
                -
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

        return this.movimientos
            .filter(
                movimiento =>
                    movimiento.tipo ===
                    "Pago"
                    &&
                    mismoId(
                        movimiento.gastoId,
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
                        numeroSeguro(
                            movimiento.importe,
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
                numeroSeguro(
                    gasto.importe,
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
            numeroSeguro(
                gasto.importe,
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

    registrarCobro(
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
                    "Los datos del cobro no son válidos."

            };

        }


        const factura =
            this.obtenerFacturaPorId(
                datos.facturaId
            );


        if (
            !factura
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La factura seleccionada no existe."

            };

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "No puedes registrar cobros sobre una factura anulada."

            };

        }


        if (
            !datos.fecha
        ) {

            return {

                ok:
                    false,

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

                ok:
                    false,

                mensaje:
                    "Esta factura ya está completamente cobrada."

            };

        }


        const importe =
            numeroSeguro(
                datos.importe,
                NaN
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

                ok:
                    false,

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

                ok:
                    false,

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
                generarId(),

            tipo:
                "Cobro",

            facturaId:
                factura.id,

            gastoId:
                null,

            referencia:
                factura.numero
                ||
                "",

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
                String(
                    datos.metodo
                    ??
                    "Transferencia"
                )
                    .trim()
                ||
                "Transferencia",

            referenciaPago:
                String(
                    datos.referenciaPago
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
                    .trim(),

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        this.movimientos.push(
            movimiento
        );


        const guardadoMovimiento =
            this.guardar();


        if (
            !guardadoMovimiento
        ) {

            this.movimientos =
                this.movimientos
                    .filter(
                        item =>
                            !mismoId(
                                item.id,
                                movimiento.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el cobro."

            };

        }


        const resultadoFactura =
            this.actualizarEstadoFactura(
                factura.id
            );


        if (
            !resultadoFactura.ok
        ) {

            /*
             * Rollback del movimiento.
             */

            this.movimientos =
                this.movimientos
                    .filter(
                        item =>
                            !mismoId(
                                item.id,
                                movimiento.id
                            )
                    );


            this.guardar();


            return {

                ok:
                    false,

                mensaje:
                    resultadoFactura.mensaje
                    ||
                    "No se ha podido actualizar la factura. El cobro no se ha registrado."

            };

        }


        return {

            ok:
                true,

            movimiento:
                movimiento

        };

    }


    // =====================================================
    // REGISTRAR PAGO
    // =====================================================

    registrarPago(
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
                    "Los datos del pago no son válidos."

            };

        }


        const gasto =
            this.obtenerGastoPorId(
                datos.gastoId
            );


        if (
            !gasto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El gasto seleccionado no existe."

            };

        }


        if (
            !datos.fecha
        ) {

            return {

                ok:
                    false,

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

                ok:
                    false,

                mensaje:
                    "Este gasto ya está completamente pagado."

            };

        }


        const importe =
            numeroSeguro(
                datos.importe,
                NaN
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

                ok:
                    false,

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

                ok:
                    false,

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
                generarId(),

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
                String(
                    datos.metodo
                    ??
                    "Transferencia"
                )
                    .trim()
                ||
                "Transferencia",

            referenciaPago:
                String(
                    datos.referenciaPago
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
                    .trim(),

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        this.movimientos.push(
            movimiento
        );


        const guardadoMovimiento =
            this.guardar();


        if (
            !guardadoMovimiento
        ) {

            this.movimientos =
                this.movimientos
                    .filter(
                        item =>
                            !mismoId(
                                item.id,
                                movimiento.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el pago."

            };

        }


        const resultadoGasto =
            this.actualizarEstadoGasto(
                gasto.id
            );


        if (
            !resultadoGasto.ok
        ) {

            /*
             * Rollback del movimiento.
             */

            this.movimientos =
                this.movimientos
                    .filter(
                        item =>
                            !mismoId(
                                item.id,
                                movimiento.id
                            )
                    );


            this.guardar();


            return {

                ok:
                    false,

                mensaje:
                    resultadoGasto.mensaje
                    ||
                    "No se ha podido actualizar el gasto. El pago no se ha registrado."

            };

        }


        return {

            ok:
                true,

            movimiento:
                movimiento

        };

    }


    // =====================================================
    // ELIMINAR MOVIMIENTO
    // =====================================================

    eliminar(
        id
    ) {

        const movimiento =
            this.obtenerPorId(
                id
            );


        if (
            !movimiento
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El movimiento no existe."

            };

        }


        const movimientosAnteriores =
            [
                ...this.movimientos
            ];


        this.movimientos =
            this.movimientos
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

            this.movimientos =
                movimientosAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el movimiento."

            };

        }


        let resultadoRelacionado = {

            ok:
                true

        };


        if (
            movimiento.tipo ===
            "Cobro"
        ) {

            resultadoRelacionado =
                this.actualizarEstadoFactura(
                    movimiento.facturaId
                );

        }


        if (
            movimiento.tipo ===
            "Pago"
        ) {

            resultadoRelacionado =
                this.actualizarEstadoGasto(
                    movimiento.gastoId
                );

        }


        if (
            !resultadoRelacionado.ok
        ) {

            /*
             * Si falla la actualización del documento
             * relacionado, restauramos el movimiento.
             */

            this.movimientos =
                movimientosAnteriores;


            this.guardar();


            return {

                ok:
                    false,

                mensaje:
                    resultadoRelacionado.mensaje
                    ||
                    "No se ha podido eliminar el movimiento porque no se pudo actualizar su documento relacionado."

            };

        }


        return {

            ok:
                true

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

            return {

                ok:
                    false,

                mensaje:
                    "La factura relacionada no existe."

            };

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return {

                ok:
                    true,

                factura:
                    factura

            };

        }


        const estadoAnterior =
            factura.estado;


        const nuevoEstado =
            this.obtenerEstadoCobroFactura(
                facturaId
            );


        factura.estado =
            nuevoEstado;


        if (
            typeof this.facturaService
                ?.guardar !==
            "function"
        ) {

            factura.estado =
                estadoAnterior;


            return {

                ok:
                    false,

                mensaje:
                    "No se puede guardar el estado de la factura."

            };

        }


        const resultadoGuardado =
            this.facturaService
                .guardar();


        /*
         * Compatibilidad temporal:
         *
         * El factura.js antiguo no devolvía nada.
         * Cuando lo refactoricemos devolverá true/false.
         *
         * Solo consideramos fallo un false explícito.
         */
        if (
            resultadoGuardado ===
            false
        ) {

            factura.estado =
                estadoAnterior;


            this.facturaService
                .guardar();


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido actualizar el estado de la factura."

            };

        }


        return {

            ok:
                true,

            factura:
                factura

        };

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

            return {

                ok:
                    false,

                mensaje:
                    "El gasto relacionado no existe."

            };

        }


        const pagado =
            this.obtenerPagadoGasto(
                gastoId
            );


        const pendiente =
            this.obtenerPendienteGasto(
                gastoId
            );


        if (
            this.gastoService
            &&
            typeof this.gastoService
                .actualizarEstadoFinanciero ===
            "function"
        ) {

            const resultado =
                this.gastoService
                    .actualizarEstadoFinanciero(
                        gastoId,
                        pagado,
                        pendiente
                    );


            if (
                resultado
                &&
                resultado.ok ===
                false
            ) {

                return resultado;

            }


            return {

                ok:
                    true,

                gasto:
                    gasto

            };

        }


        /*
         * RESPALDO PARA COMPATIBILIDAD.
         */

        const estadoAnterior = {

            pagadoAcumulado:
                gasto.pagadoAcumulado,

            pendientePago:
                gasto.pendientePago,

            estado:
                gasto.estado

        };


        gasto.pagadoAcumulado =
            pagado;


        gasto.pendientePago =
            pendiente;


        gasto.estado =
            this.obtenerEstadoPagoGasto(
                gastoId
            );


        if (
            typeof this.gastoService
                ?.guardar !==
            "function"
        ) {

            gasto.pagadoAcumulado =
                estadoAnterior.pagadoAcumulado;

            gasto.pendientePago =
                estadoAnterior.pendientePago;

            gasto.estado =
                estadoAnterior.estado;


            return {

                ok:
                    false,

                mensaje:
                    "No se puede guardar el estado financiero del gasto."

            };

        }


        const resultadoGuardado =
            this.gastoService
                .guardar();


        if (
            resultadoGuardado ===
            false
        ) {

            gasto.pagadoAcumulado =
                estadoAnterior.pagadoAcumulado;

            gasto.pendientePago =
                estadoAnterior.pendientePago;

            gasto.estado =
                estadoAnterior.estado;


            this.gastoService
                .guardar();


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido actualizar el estado financiero del gasto."

            };

        }


        return {

            ok:
                true,

            gasto:
                gasto

        };

    }


    // =====================================================
    // SINCRONIZAR FACTURAS
    // =====================================================

    sincronizarEstadosFacturas() {

        let actualizadas =
            0;


        for (
            const factura
            of
            this.obtenerFacturas()
        ) {

            if (
                factura.estado ===
                "Anulada"
            ) {

                continue;

            }


            const estadoCorrecto =
                this.obtenerEstadoCobroFactura(
                    factura.id
                );


            if (
                factura.estado ===
                estadoCorrecto
            ) {

                continue;

            }


            const resultado =
                this.actualizarEstadoFactura(
                    factura.id
                );


            if (
                resultado.ok
            ) {

                actualizadas++;

            }

        }


        return {

            ok:
                true,

            actualizadas:
                actualizadas

        };

    }


    // =====================================================
    // SINCRONIZAR GASTOS
    // =====================================================

    sincronizarEstadosGastos() {

        let actualizados =
            0;


        for (
            const gasto
            of
            this.obtenerGastos()
        ) {

            const pagadoCorrecto =
                this.obtenerPagadoGasto(
                    gasto.id
                );


            const pendienteCorrecto =
                this.obtenerPendienteGasto(
                    gasto.id
                );


            const estadoCorrecto =
                this.obtenerEstadoPagoGasto(
                    gasto.id
                );


            const coincide =
                Math.abs(
                    numeroSeguro(
                        gasto.pagadoAcumulado,
                        0
                    )
                    -
                    pagadoCorrecto
                )
                <=
                0.001
                &&
                Math.abs(
                    numeroSeguro(
                        gasto.pendientePago,
                        0
                    )
                    -
                    pendienteCorrecto
                )
                <=
                0.001
                &&
                gasto.estado ===
                estadoCorrecto;


            if (
                coincide
            ) {

                continue;

            }


            const resultado =
                this.actualizarEstadoGasto(
                    gasto.id
                );


            if (
                resultado.ok
            ) {

                actualizados++;

            }

        }


        return {

            ok:
                true,

            actualizados:
                actualizados

        };

    }


    // =====================================================
    // TOTALES
    // =====================================================

    obtenerTotalCobrado() {

        return Number(
            this.obtenerCobros()
                .reduce(
                    (
                        total,
                        movimiento
                    ) =>
                        total
                        +
                        numeroSeguro(
                            movimiento.importe,
                            0
                        ),
                    0
                )
                .toFixed(
                    2
                )
        );

    }


    obtenerTotalPagado() {

        return Number(
            this.obtenerPagos()
                .reduce(
                    (
                        total,
                        movimiento
                    ) =>
                        total
                        +
                        numeroSeguro(
                            movimiento.importe,
                            0
                        ),
                    0
                )
                .toFixed(
                    2
                )
        );

    }


    obtenerTotalPendienteCobro() {

        return Number(
            this.obtenerFacturas()
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
                )
                .toFixed(
                    2
                )
        );

    }


    obtenerTotalPendientePago() {

        return Number(
            this.obtenerGastos()
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
                )
                .toFixed(
                    2
                )
        );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarCobrosPagos(
                this.movimientos
            );

    }


    // =====================================================
    // FORMATO
    // =====================================================

    formatearDinero(
        numero
    ) {

        return numeroSeguro(
            numero,
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