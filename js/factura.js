import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
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

            this.facturas =
                [];

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


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.facturas
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


    // =====================================================
    // ESTADOS
    // =====================================================

    obtenerPendientes() {

        return this.facturas
            .filter(
                factura =>
                    factura.estado ===
                    "Pendiente"
            );

    }


    obtenerCobradas() {

        return this.facturas
            .filter(
                factura =>
                    factura.estado ===
                    "Cobrada"
            );

    }


    obtenerAnuladas() {

        return this.facturas
            .filter(
                factura =>
                    factura.estado ===
                    "Anulada"
            );

    }


    // =====================================================
    // MIGRACIÓN
    // =====================================================

    migrarFacturas() {

        let cambios =
            false;


        this.facturas
            .forEach(
                factura => {

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
                                factura.albaranIds
                                    .filter(
                                        id =>
                                            id !==
                                            null
                                            &&
                                            id !==
                                            undefined
                                            &&
                                            id !==
                                            ""
                                    );

                        }

                        else if (
                            Array.isArray(
                                factura.idsAlbaranes
                            )
                        ) {

                            factura.albaranesIds =
                                factura.idsAlbaranes
                                    .filter(
                                        id =>
                                            id !==
                                            null
                                            &&
                                            id !==
                                            undefined
                                            &&
                                            id !==
                                            ""
                                    );

                        }

                        else {

                            factura.albaranesIds =
                                [];

                        }


                        cambios =
                            true;

                    }


                    if (
                        !factura.estado
                    ) {

                        factura.estado =
                            "Pendiente";

                        cambios =
                            true;

                    }


                    if (
                        factura.baseImponible ===
                        undefined
                    ) {

                        factura.baseImponible =
                            numeroSeguro(
                                factura.subtotal
                                ??
                                factura.base,
                                0
                            );

                        cambios =
                            true;

                    }


                    if (
                        factura.porcentajeIva ===
                        undefined
                    ) {

                        const posiblePorcentaje =
                            numeroSeguro(
                                factura.iva,
                                21
                            );


                        factura.porcentajeIva =
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


                    if (
                        factura.importeIva ===
                        undefined
                    ) {

                        factura.importeIva =
                            Number(
                                (
                                    numeroSeguro(
                                        factura.baseImponible,
                                        0
                                    )
                                    *
                                    (
                                        numeroSeguro(
                                            factura.porcentajeIva,
                                            0
                                        )
                                        /
                                        100
                                    )
                                )
                                    .toFixed(
                                        2
                                    )
                            );


                        cambios =
                            true;

                    }


                    if (
                        factura.total ===
                        undefined
                    ) {

                        factura.total =
                            Number(
                                (
                                    numeroSeguro(
                                        factura.baseImponible,
                                        0
                                    )
                                    +
                                    numeroSeguro(
                                        factura.importeIva,
                                        0
                                    )
                                )
                                    .toFixed(
                                        2
                                    )
                            );


                        cambios =
                            true;

                    }

                }
            );


        /*
         * Solo escribimos cuando realmente existen
         * datos antiguos que requieren migración.
         */
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


        this.facturas
            .forEach(
                factura => {

                    const numero =
                        String(
                            factura.numero
                            ??
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
                maximo +
                1
            ).padStart(
                4,
                "0"
            )}`
        );

    }


    // =====================================================
    // COMPROBAR ALBARÁN EN FACTURA
    // =====================================================

    albaranYaEstaEnFactura(
        albaranId,
        excluirFacturaId = null
    ) {

        return this.facturas
            .some(
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


                    return factura.albaranesIds
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

        if (
            !Array.isArray(
                albaranesIds
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona al menos un albarán."

            };

        }


        const ids =
            [];


        albaranesIds
            .forEach(
                id => {

                    if (
                        id ===
                        null
                        ||
                        id ===
                        undefined
                        ||
                        id ===
                        ""
                    ) {

                        return;

                    }


                    const existe =
                        ids.some(
                            existente =>
                                mismoId(
                                    existente,
                                    id
                                )
                        );


                    if (
                        !existe
                    ) {

                        ids.push(
                            id
                        );

                    }

                }
            );


        if (
            ids.length ===
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona al menos un albarán."

            };

        }


        const repetidos =
            ids
                .filter(
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

                ok:
                    false,

                mensaje:
                    "Uno de los albaranes seleccionados ya pertenece a una factura activa."

            };

        }


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

                ok:
                    false,

                mensaje:
                    "Alguno de los albaranes seleccionados ya no existe."

            };

        }


        const noEntregados =
            albaranes
                .filter(
                    albaran =>
                        albaran.estado !==
                        "Entregado"
                );


        if (
            noEntregados.length >
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Solo puedes facturar albaranes con estado Entregado."

            };

        }


        const yaFacturados =
            albaranes
                .filter(
                    albaran =>
                        albaran.facturado ===
                        true
                );


        if (
            yaFacturados.length >
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Uno de los albaranes seleccionados ya está facturado."

            };

        }


        const clienteReferencia =
            albaranes[0]
                ?.clienteId
            ??
            albaranes[0]
                ?.clienteNombre
            ??
            albaranes[0]
                ?.cliente
            ??
            "";


        const clientesDistintos =
            albaranes
                .some(
                    albaran => {

                        const clienteActual =
                            albaran.clienteId
                            ??
                            albaran.clienteNombre
                            ??
                            albaran.cliente
                            ??
                            "";


                        return !mismoId(
                            clienteActual,
                            clienteReferencia
                        );

                    }
                );


        if (
            clientesDistintos
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "No puedes agrupar albaranes de clientes distintos en una misma factura."

            };

        }


        return {

            ok:
                true,

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

                ok:
                    false,

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

                ok:
                    false,

                mensaje:
                    "Selecciona al menos un albarán."

            };

        }


        if (
            !datos.fecha
        ) {

            return {

                ok:
                    false,

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


        const baseImponible =
            albaranes
                .reduce(
                    (
                        suma,
                        albaran
                    ) =>
                        suma
                        +
                        numeroSeguro(
                            albaran.total,
                            0
                        ),
                    0
                );


        const porcentajeIva =
            numeroSeguro(
                datos.iva
                ??
                datos.porcentajeIva,
                21
            );


        if (
            porcentajeIva <
            0
            ||
            porcentajeIva >
            100
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce un IVA válido."

            };

        }


        const importeIva =
            baseImponible
            *
            (
                porcentajeIva
                /
                100
            );


        const total =
            baseImponible
            +
            importeIva;


        const primerAlbaran =
            albaranes[0];


        const nuevaFactura = {

            id:
                generarId(),

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
                ids,

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
                    ??
                    ""
                )
                    .trim(),

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        const estadosAlbaranes =
            this.capturarEstadoAlbaranes(
                albaranes
            );


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
                !this.operacionCorrecta(
                    resultado
                )
            ) {

                this.restaurarEstadoAlbaranes(
                    estadosAlbaranes
                );


                return {

                    ok:
                        false,

                    mensaje:
                        resultado?.mensaje
                        ||
                        "No se han podido bloquear los albaranes de la factura."

                };

            }

        }


        this.facturas.push(
            nuevaFactura
        );


        const guardado =
            this.guardar();


        if (
            !this.guardadoCorrecto(
                guardado
            )
        ) {

            this.facturas =
                this.facturas
                    .filter(
                        factura =>
                            !mismoId(
                                factura.id,
                                nuevaFactura.id
                            )
                    );


            this.restaurarEstadoAlbaranes(
                estadosAlbaranes
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar la factura."

            };

        }


        return {

            ok:
                true,

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

                ok:
                    false,

                mensaje:
                    "La factura no existe."

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
                "Parcialmente cobrada",
                "Cobrada"
            ].includes(
                nuevoEstado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El estado de la factura no es válido."

            };

        }


        const estadoAnterior =
            factura.estado;


        factura.estado =
            nuevoEstado;


        const guardado =
            this.guardar();


        if (
            !this.guardadoCorrecto(
                guardado
            )
        ) {

            factura.estado =
                estadoAnterior;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el estado de la factura."

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
    // CAPTURAR ESTADO DE ALBARANES
    // =====================================================

    capturarEstadoAlbaranes(
        albaranes
    ) {

        return albaranes
            .map(
                albaran => ({

                    id:
                        albaran.id,

                    estado:
                        albaran.estado,

                    facturado:
                        albaran.facturado,

                    facturaId:
                        albaran.facturaId

                })
            );

    }


    // =====================================================
    // RESTAURAR ESTADO DE ALBARANES
    // =====================================================

    restaurarEstadoAlbaranes(
        estados
    ) {

        estados
            .forEach(
                estadoAnterior => {

                    const albaran =
                        this.albaranService
                            .obtenerPorId(
                                estadoAnterior.id
                            );


                    if (
                        !albaran
                    ) {

                        return;

                    }


                    albaran.estado =
                        estadoAnterior.estado;

                    albaran.facturado =
                        estadoAnterior.facturado;

                    albaran.facturaId =
                        estadoAnterior.facturaId;

                }
            );


        if (
            typeof this.albaranService
                ?.guardar ===
            "function"
        ) {

            this.albaranService
                .guardar();

        }

    }


    // =====================================================
    // LIBERAR ALBARANES
    // =====================================================

    liberarAlbaranesFactura(
        factura
    ) {

        if (
            !Array.isArray(
                factura.albaranesIds
            )
        ) {

            return {

                ok:
                    true

            };

        }


        const albaranes =
            factura.albaranesIds
                .map(
                    albaranId =>
                        this.albaranService
                            .obtenerPorId(
                                albaranId
                            )
                )
                .filter(
                    Boolean
                );


        const estadosAnteriores =
            this.capturarEstadoAlbaranes(
                albaranes
            );


        for (
            const albaranId
            of
            factura.albaranesIds
        ) {

            const usadoEnOtraFactura =
                this.facturas
                    .some(
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


                            return otraFactura.albaranesIds
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

                continue;

            }


            let resultado;


            if (
                typeof this.albaranService
                    ?.desmarcarFacturado ===
                "function"
            ) {

                resultado =
                    this.albaranService
                        .desmarcarFacturado(
                            albaranId
                        );

            }

            else {

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


                resultado = {

                    ok:
                        true

                };

            }


            if (
                !this.operacionCorrecta(
                    resultado
                )
            ) {

                this.restaurarEstadoAlbaranes(
                    estadosAnteriores
                );


                return {

                    ok:
                        false,

                    mensaje:
                        resultado?.mensaje
                        ||
                        "No se han podido liberar los albaranes de la factura."

                };

            }

        }


        if (
            typeof this.albaranService
                ?.guardar ===
            "function"
        ) {

            const guardado =
                this.albaranService
                    .guardar();


            if (
                guardado ===
                false
            ) {

                this.restaurarEstadoAlbaranes(
                    estadosAnteriores
                );


                return {

                    ok:
                        false,

                    mensaje:
                        "No se han podido guardar los cambios de los albaranes."

                };

            }

        }


        return {

            ok:
                true,

            estadosAnteriores:
                estadosAnteriores

        };

    }


    // =====================================================
    // COBROS VINCULADOS
    // =====================================================

    obtenerCobrosVinculados(
        facturaId
    ) {

        try {

            if (
                typeof StorageService
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


            return movimientos
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

        catch (
            error
        ) {

            console.error(
                "Error obteniendo cobros vinculados a la factura:",
                error
            );


            return [];

        }

    }


    // =====================================================
    // TOTAL COBRADO
    // =====================================================

    obtenerTotalCobrado(
        facturaId
    ) {

        return Number(
            this.obtenerCobrosVinculados(
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


    // =====================================================
    // TIENE COBROS
    // =====================================================

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

                ok:
                    false,

                mensaje:
                    "La factura no existe."

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
                    "La factura ya está anulada."

            };

        }


        if (
            this.tieneCobros(
                factura.id
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes anular esta factura porque tiene ${this.formatearDinero(
                        this.obtenerTotalCobrado(
                            factura.id
                        )
                    )} cobrados. Elimina primero sus cobros desde Cobros y pagos.`

            };

        }


        const facturaAnterior =
            JSON.parse(
                JSON.stringify(
                    factura
                )
            );


        const resultadoLiberacion =
            this.liberarAlbaranesFactura(
                factura
            );


        if (
            !resultadoLiberacion.ok
        ) {

            return resultadoLiberacion;

        }


        factura.estado =
            "Anulada";


        factura.fechaAnulacion =
            new Date()
                .toISOString();


        const guardado =
            this.guardar();


        if (
            !this.guardadoCorrecto(
                guardado
            )
        ) {

            Object.assign(
                factura,
                facturaAnterior
            );


            this.restaurarEstadoAlbaranes(
                resultadoLiberacion
                    .estadosAnteriores
                ||
                []
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido anular la factura."

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

                ok:
                    false,

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

                ok:
                    false,

                mensaje:
                    `No puedes eliminar esta factura porque tiene ${this.formatearDinero(
                        this.obtenerTotalCobrado(
                            factura.id
                        )
                    )} cobrados. Elimina primero sus cobros desde Cobros y pagos.`

            };

        }


        const facturasAnteriores =
            [
                ...this.facturas
            ];


        const resultadoLiberacion =
            this.liberarAlbaranesFactura(
                factura
            );


        if (
            !resultadoLiberacion.ok
        ) {

            return resultadoLiberacion;

        }


        this.facturas =
            this.facturas
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

            this.facturas =
                facturasAnteriores;


            this.restaurarEstadoAlbaranes(
                resultadoLiberacion
                    .estadosAnteriores
                ||
                []
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar la factura."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // TOTAL FACTURADO
    // =====================================================

    obtenerTotalFacturado() {

        return Number(
            this.facturas
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
                        numeroSeguro(
                            factura.total,
                            0
                        ),
                    0
                )
                .toFixed(
                    2
                )
        );

    }


    // =====================================================
    // OPERACIÓN CORRECTA
    // =====================================================

    operacionCorrecta(
        resultado
    ) {

        if (
            resultado ===
            false
        ) {

            return false;

        }


        if (
            resultado
            &&
            resultado.ok ===
            false
        ) {

            return false;

        }


        return true;

    }


    // =====================================================
    // GUARDADO CORRECTO
    // =====================================================

    guardadoCorrecto(
        resultado
    ) {

        /*
         * Compatibilidad temporal con servicios antiguos
         * que todavía no devolvían true.
         *
         * Solo consideramos fallo un false explícito.
         */

        return resultado !==
            false;

    }


    // =====================================================
    // FORMATO DINERO
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


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarFacturas(
                this.facturas
            );

    }

}