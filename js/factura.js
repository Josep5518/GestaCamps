import { StorageService } from "./storage.js";

import {
    mismoId
} from "./utils.js";


export class FacturaService {

    constructor(
        albaranService
    ) {

        this.albaranService =
            albaranService;

        this.facturas =
            StorageService
                .obtenerFacturas();


        if (
            !Array.isArray(
                this.facturas
            )
        ) {

            this.facturas = [];

        }


        this.migrarFacturas();

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtenerTodos() {

        return this.facturas;

    }


    obtenerTodas() {

        return this.facturas;

    }


    obtenerPorId(
        id
    ) {

        return (
            this.facturas.find(
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


    obtenerPendientes() {

        return this.facturas.filter(
            factura =>
                factura.estado ===
                "Pendiente"
        );

    }


    obtenerCobradas() {

        return this.facturas.filter(
            factura =>
                factura.estado ===
                "Cobrada"
        );

    }


    obtenerAnuladas() {

        return this.facturas.filter(
            factura =>
                factura.estado ===
                "Anulada"
        );

    }


    // =====================================================
    // LIMPIAR / NORMALIZAR IDS
    // =====================================================

    limpiarIds(
        ids
    ) {

        if (
            !Array.isArray(
                ids
            )
        ) {

            return [];

        }


        const resultado = [];


        ids.forEach(
            id => {

                if (
                    id === undefined
                    ||
                    id === null
                    ||
                    id === ""
                ) {

                    return;

                }


                const existe =
                    resultado.some(
                        existente =>
                            mismoId(
                                existente,
                                id
                            )
                    );


                if (
                    !existe
                ) {

                    resultado.push(
                        id
                    );

                }

            }
        );


        return resultado;

    }


    // =====================================================
    // MIGRACIÓN
    // =====================================================

    migrarFacturas() {

        let cambios =
            false;


        this.facturas.forEach(
            factura => {

                // -----------------------------------------
                // ALBARANES IDS
                // -----------------------------------------

                if (
                    !Array.isArray(
                        factura.albaranesIds
                    )
                ) {

                    if (
                        Array.isArray(
                            factura.albaranIds
                        )
                    ) {

                        factura.albaranesIds =
                            this.limpiarIds(
                                factura.albaranIds
                            );

                    }

                    else if (
                        Array.isArray(
                            factura.idsAlbaranes
                        )
                    ) {

                        factura.albaranesIds =
                            this.limpiarIds(
                                factura.idsAlbaranes
                            );

                    }

                    else {

                        factura.albaranesIds =
                            [];

                    }


                    cambios =
                        true;

                }

                else {

                    const idsLimpios =
                        this.limpiarIds(
                            factura.albaranesIds
                        );


                    if (
                        idsLimpios.length !==
                        factura.albaranesIds.length
                    ) {

                        factura.albaranesIds =
                            idsLimpios;

                        cambios =
                            true;

                    }

                }


                // -----------------------------------------
                // ESTADO
                // -----------------------------------------

                if (
                    !factura.estado
                ) {

                    factura.estado =
                        "Pendiente";

                    cambios =
                        true;

                }


                // -----------------------------------------
                // BASE IMPONIBLE
                // -----------------------------------------

                if (
                    factura.baseImponible ===
                    undefined
                ) {

                    factura.baseImponible =
                        Number(
                            factura.subtotal
                            ??
                            factura.base
                            ??
                            0
                        );

                    cambios =
                        true;

                }


                // -----------------------------------------
                // PORCENTAJE IVA
                // -----------------------------------------

                if (
                    factura.porcentajeIva ===
                    undefined
                ) {

                    const posiblePorcentaje =
                        Number(
                            factura.iva
                            ??
                            21
                        );


                    factura.porcentajeIva =
                        Number.isFinite(
                            posiblePorcentaje
                        )
                        &&
                        posiblePorcentaje >=
                        0
                        &&
                        posiblePorcentaje <=
                        100

                            ? posiblePorcentaje

                            : 21;


                    cambios =
                        true;

                }


                // -----------------------------------------
                // IMPORTE IVA
                // -----------------------------------------

                if (
                    factura.importeIva ===
                    undefined
                ) {

                    factura.importeIva =
                        Number(
                            factura.baseImponible
                            ||
                            0
                        )
                        *
                        (
                            Number(
                                factura.porcentajeIva
                                ||
                                0
                            )
                            /
                            100
                        );


                    cambios =
                        true;

                }


                // -----------------------------------------
                // TOTAL
                // -----------------------------------------

                if (
                    factura.total ===
                    undefined
                ) {

                    factura.total =
                        Number(
                            factura.baseImponible
                            ||
                            0
                        )
                        +
                        Number(
                            factura.importeIva
                            ||
                            0
                        );


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
    // GENERAR NÚMERO
    // =====================================================

    generarNumero() {

        const year =
            new Date()
                .getFullYear();


        let maximo =
            0;


        this.facturas.forEach(
            factura => {

                const numero =
                    String(
                        factura.numero
                        ||
                        ""
                    );


                if (
                    !numero.startsWith(
                        `FAC-${year}-`
                    )
                ) {

                    return;

                }


                const partes =
                    numero.split(
                        "-"
                    );


                const correlativo =
                    Number(
                        partes[
                            partes.length -
                            1
                        ]
                    );


                if (
                    Number.isFinite(
                        correlativo
                    )
                    &&
                    correlativo >
                    maximo
                ) {

                    maximo =
                        correlativo;

                }

            }
        );


        return (
            `FAC-${year}-${String(
                maximo + 1
            ).padStart(
                4,
                "0"
            )}`
        );

    }


    // =====================================================
    // COMPROBAR SI UN ALBARÁN YA ESTÁ FACTURADO
    // =====================================================

    albaranYaEstaEnFactura(
        albaranId,
        excluirFacturaId = null
    ) {

        return this.facturas.some(
            factura => {

                if (
                    excluirFacturaId !==
                    null
                    &&
                    mismoId(
                        factura.id,
                        excluirFacturaId
                    )
                ) {

                    return false;

                }


                if (
                    factura.estado ===
                    "Anulada"
                ) {

                    return false;

                }


                if (
                    !Array.isArray(
                        factura.albaranesIds
                    )
                ) {

                    return false;

                }


                return factura
                    .albaranesIds
                    .some(
                        id =>
                            mismoId(
                                id,
                                albaranId
                            )
                    );

            }
        );

    }


    // =====================================================
    // VALIDAR ALBARANES
    // =====================================================

    validarAlbaranes(
        albaranesIds
    ) {

        const ids =
            this.limpiarIds(
                albaranesIds
            );


        if (
            ids.length ===
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona al menos un albarán."
            };

        }


        // -----------------------------------------
        // YA ESTÁN EN OTRA FACTURA
        // -----------------------------------------

        const repetidos =
            ids.filter(
                id =>
                    this.albaranYaEstaEnFactura(
                        id
                    )
            );


        if (
            repetidos.length >
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Uno de los albaranes seleccionados ya pertenece a una factura activa."
            };

        }


        // -----------------------------------------
        // RECUPERAR ALBARANES
        // -----------------------------------------

        const albaranes =
            ids
                .map(
                    id =>
                        this.albaranService
                            .obtenerPorId(
                                id
                            )
                )
                .filter(
                    Boolean
                );


        if (
            albaranes.length !==
            ids.length
        ) {

            return {
                ok: false,

                mensaje:
                    "Alguno de los albaranes seleccionados ya no existe."
            };

        }


        // -----------------------------------------
        // DEBEN ESTAR ENTREGADOS
        // -----------------------------------------

        const noEntregados =
            albaranes.filter(
                albaran =>
                    albaran.estado !==
                    "Entregado"
            );


        if (
            noEntregados.length >
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Solo puedes facturar albaranes con estado Entregado."
            };

        }


        // -----------------------------------------
        // NO DEBEN ESTAR FACTURADOS
        // -----------------------------------------

        const yaFacturados =
            albaranes.filter(
                albaran =>
                    albaran.facturado ===
                    true
            );


        if (
            yaFacturados.length >
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Uno de los albaranes seleccionados ya está facturado."
            };

        }


        // -----------------------------------------
        // MISMO CLIENTE
        // -----------------------------------------

        const clientes =
            [];


        albaranes.forEach(
            albaran => {

                const cliente =
                    albaran.clienteId
                    ??
                    albaran.clienteNombre
                    ??
                    albaran.cliente
                    ??
                    "";


                const existe =
                    clientes.some(
                        actual =>
                            mismoId(
                                actual,
                                cliente
                            )
                    );


                if (
                    !existe
                ) {

                    clientes.push(
                        cliente
                    );

                }

            }
        );


        if (
            clientes.length >
            1
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes agrupar albaranes de clientes distintos en una misma factura."
            };

        }


        return {
            ok: true,

            ids:
                ids,

            albaranes:
                albaranes
        };

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        datos
    ) {

        if (
            !datos
            ||
            typeof datos !==
            "object"
        ) {

            return {
                ok: false,

                mensaje:
                    "Los datos de la factura no son válidos."
            };

        }


        if (
            !Array.isArray(
                datos.albaranesIds
            )
            ||
            datos.albaranesIds.length ===
            0
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona al menos un albarán."
            };

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce la fecha de la factura."
            };

        }


        const validacion =
            this.validarAlbaranes(
                datos.albaranesIds
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const albaranes =
            validacion.albaranes;


        const ids =
            validacion.ids;


        // -----------------------------------------
        // BASE IMPONIBLE
        // -----------------------------------------

        const baseImponible =
            albaranes.reduce(
                (
                    suma,
                    albaran
                ) => {

                    const importe =
                        Number(
                            albaran.total
                            ??
                            albaran.subtotal
                            ??
                            0
                        );


                    return (
                        suma
                        +
                        (
                            Number.isFinite(
                                importe
                            )
                                ? importe
                                : 0
                        )
                    );

                },
                0
            );


        // -----------------------------------------
        // IVA
        // -----------------------------------------

        const porcentajeIva =
            Number(
                datos.iva
                ??
                datos.porcentajeIva
                ??
                21
            );


        if (
            !Number.isFinite(
                porcentajeIva
            )
            ||
            porcentajeIva <
            0
            ||
            porcentajeIva >
            100
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce un IVA válido."
            };

        }


        const importeIva =
            baseImponible
            *
            (
                porcentajeIva /
                100
            );


        const total =
            baseImponible
            +
            importeIva;


        const primerAlbaran =
            albaranes[0];


        // -----------------------------------------
        // NUEVA FACTURA
        // -----------------------------------------

        const nuevaFactura = {

            id:
                Date.now(),

            numero:
                this.generarNumero(),

            fecha:
                datos.fecha,

            clienteId:
                primerAlbaran.clienteId
                ??
                null,

            clienteNombre:
                primerAlbaran.clienteNombre
                ||
                primerAlbaran.cliente
                ||
                "",

            cliente:
                primerAlbaran.clienteNombre
                ||
                primerAlbaran.cliente
                ||
                "",

            albaranesIds:
                [
                    ...ids
                ],

            baseImponible:
                Number(
                    baseImponible
                        .toFixed(
                            2
                        )
                ),

            subtotal:
                Number(
                    baseImponible
                        .toFixed(
                            2
                        )
                ),

            porcentajeIva:
                porcentajeIva,

            iva:
                porcentajeIva,

            importeIva:
                Number(
                    importeIva
                        .toFixed(
                            2
                        )
                ),

            total:
                Number(
                    total
                        .toFixed(
                            2
                        )
                ),

            estado:
                "Pendiente",

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


        // =================================================
        // MARCAR ALBARANES COMO FACTURADOS
        // =================================================

        const marcados =
            [];


        for (
            const albaran
            of
            albaranes
        ) {

            const resultado =
                this.albaranService
                    .marcarFacturado(
                        albaran.id,
                        nuevaFactura.id
                    );


            if (
                !resultado
                ||
                resultado.ok ===
                false
            ) {

                marcados.forEach(
                    albaranId => {

                        this.albaranService
                            .desmarcarFacturado(
                                albaranId
                            );

                    }
                );


                return {
                    ok: false,

                    mensaje:
                        resultado?.mensaje
                        ||
                        "No se han podido bloquear los albaranes de la factura."
                };

            }


            marcados.push(
                albaran.id
            );

        }


        // -----------------------------------------
        // GUARDAR FACTURA
        // -----------------------------------------

        this.facturas.push(
            nuevaFactura
        );


        this.guardar();


        return {
            ok: true,

            factura:
                nuevaFactura
        };

    }


    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================

    cambiarEstado(
        id,
        nuevoEstado
    ) {

        const factura =
            this.obtenerPorId(
                id
            );


        if (
            !factura
        ) {

            return {
                ok: false,

                mensaje:
                    "La factura no existe."
            };

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return {
                ok: false,

                mensaje:
                    "Una factura anulada no puede modificarse."
            };

        }


        if (
            nuevoEstado ===
            "Anulada"
        ) {

            return this.anular(
                id
            );

        }


        if (
            ![
                "Pendiente",
                "Cobrada"
            ].includes(
                nuevoEstado
            )
        ) {

            return {
                ok: false,

                mensaje:
                    "El estado de la factura no es válido."
            };

        }


        factura.estado =
            nuevoEstado;


        this.guardar();


        return {
            ok: true,

            factura:
                factura
        };

    }


    // =====================================================
    // DEVOLVER ALBARANES A ENTREGADO
    // =====================================================

    liberarAlbaranesFactura(
        factura
    ) {

        if (
            !factura
            ||
            !Array.isArray(
                factura.albaranesIds
            )
        ) {

            return;

        }


        factura.albaranesIds
            .forEach(
                albaranId => {

                    const usadoEnOtraFactura =
                        this.facturas.some(
                            otraFactura => {

                                if (
                                    mismoId(
                                        otraFactura.id,
                                        factura.id
                                    )
                                ) {

                                    return false;

                                }


                                if (
                                    otraFactura.estado ===
                                    "Anulada"
                                ) {

                                    return false;

                                }


                                if (
                                    !Array.isArray(
                                        otraFactura.albaranesIds
                                    )
                                ) {

                                    return false;

                                }


                                return otraFactura
                                    .albaranesIds
                                    .some(
                                        id =>
                                            mismoId(
                                                id,
                                                albaranId
                                            )
                                    );

                            }
                        );


                    if (
                        usadoEnOtraFactura
                    ) {

                        return;

                    }


                    // -------------------------------------
                    // MÉTODO PRINCIPAL
                    // -------------------------------------

                    if (
                        typeof
                        this.albaranService
                            .desmarcarFacturado ===
                        "function"
                    ) {

                        this.albaranService
                            .desmarcarFacturado(
                                albaranId
                            );

                        return;

                    }


                    // -------------------------------------
                    // RESPALDO
                    // -------------------------------------

                    const albaran =
                        this.albaranService
                            .obtenerPorId(
                                albaranId
                            );


                    if (
                        albaran
                    ) {

                        albaran.facturado =
                            false;

                        albaran.facturaId =
                            null;

                        albaran.estado =
                            "Entregado";

                    }

                }
            );


        if (
            typeof
            this.albaranService
                .guardar ===
            "function"
        ) {

            this.albaranService
                .guardar();

        }

    }


    // =====================================================
    // COBROS VINCULADOS
    // =====================================================

    obtenerCobrosVinculados(
        facturaId
    ) {

        try {

            if (
                typeof
                StorageService
                    .obtenerCobrosPagos !==
                "function"
            ) {

                return [];

            }


            const movimientos =
                StorageService
                    .obtenerCobrosPagos();


            if (
                !Array.isArray(
                    movimientos
                )
            ) {

                return [];

            }


            return movimientos.filter(
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

        catch {

            return [];

        }

    }


    obtenerTotalCobrado(
        facturaId
    ) {

        return this.obtenerCobrosVinculados(
            facturaId
        )
            .reduce(
                (
                    total,
                    movimiento
                ) => {

                    const importe =
                        Number(
                            movimiento.importe
                            ||
                            0
                        );


                    return (
                        total
                        +
                        (
                            Number.isFinite(
                                importe
                            )
                                ? importe
                                : 0
                        )
                    );

                },
                0
            );

    }


    tieneCobros(
        facturaId
    ) {

        return (
            this.obtenerCobrosVinculados(
                facturaId
            ).length >
            0
        );

    }


    // =====================================================
    // ANULAR
    // =====================================================

    anular(
        id
    ) {

        const factura =
            this.obtenerPorId(
                id
            );


        if (
            !factura
        ) {

            return {
                ok: false,

                mensaje:
                    "La factura no existe."
            };

        }


        if (
            factura.estado ===
            "Anulada"
        ) {

            return {
                ok: false,

                mensaje:
                    "La factura ya está anulada."
            };

        }


        if (
            this.tieneCobros(
                factura.id
            )
        ) {

            return {
                ok: false,

                mensaje:
                    `No puedes anular esta factura porque tiene ${this.formatearDinero(
                        this.obtenerTotalCobrado(
                            factura.id
                        )
                    )} cobrados. Elimina primero sus cobros desde Cobros y pagos.`
            };

        }


        // -----------------------------------------
        // LIBERAR ALBARANES
        // -----------------------------------------

        this.liberarAlbaranesFactura(
            factura
        );


        factura.estado =
            "Anulada";


        factura.fechaAnulacion =
            new Date()
                .toISOString();


        this.guardar();


        return {
            ok: true,

            factura:
                factura
        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const factura =
            this.obtenerPorId(
                id
            );


        if (
            !factura
        ) {

            return {
                ok: false,

                mensaje:
                    "La factura no existe."
            };

        }


        if (
            this.tieneCobros(
                factura.id
            )
        ) {

            return {
                ok: false,

                mensaje:
                    `No puedes eliminar esta factura porque tiene ${this.formatearDinero(
                        this.obtenerTotalCobrado(
                            factura.id
                        )
                    )} cobrados. Elimina primero sus cobros desde Cobros y pagos.`
            };

        }


        // -----------------------------------------
        // LIBERAR ALBARANES
        // -----------------------------------------

        this.liberarAlbaranesFactura(
            factura
        );


        this.facturas =
            this.facturas.filter(
                item =>
                    !mismoId(
                        item.id,
                        id
                    )
            );


        this.guardar();


        return {
            ok: true
        };

    }


    // =====================================================
    // TOTALES
    // =====================================================

    obtenerTotalFacturado() {

        return this.facturas
            .filter(
                factura =>
                    factura.estado !==
                    "Anulada"
            )
            .reduce(
                (
                    total,
                    factura
                ) => {

                    const importe =
                        Number(
                            factura.total
                            ||
                            0
                        );


                    return (
                        total
                        +
                        (
                            Number.isFinite(
                                importe
                            )
                                ? importe
                                : 0
                        )
                    );

                },
                0
            );

    }


    // =====================================================
    // FORMATO
    // =====================================================

    formatearDinero(
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
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )
            +
            " €";

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarFacturas(
                this.facturas
            );

    }

}