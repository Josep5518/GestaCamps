import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";

import {
    obtenerNombreMaquinaria
} from "./entityHelpers.js";


export class GastoService {

    constructor(
        fincaService,
        maquinariaService,
        clienteProveedorService,
        campaniaService
    ) {

        this.fincaService =
            fincaService;

        this.maquinariaService =
            maquinariaService;

        this.clienteProveedorService =
            clienteProveedorService;

        this.campaniaService =
            campaniaService;

        this.gastos =
            StorageService
                .obtenerGastos();


        if (
            !Array.isArray(
                this.gastos
            )
        ) {

            this.gastos =
                [];

        }


        this.migrarGastosAntiguos();

    }


    // =====================================================
    // MIGRACIÓN
    // =====================================================

    migrarGastosAntiguos() {

        let cambios =
            false;


        this.gastos.forEach(
            gasto => {

                if (
                    !gasto.metodoPago
                    &&
                    gasto.pago
                ) {

                    gasto.metodoPago =
                        gasto.pago;

                    cambios =
                        true;

                }


                if (
                    !gasto.metodoPago
                    &&
                    gasto.metodo
                ) {

                    gasto.metodoPago =
                        gasto.metodo;

                    cambios =
                        true;

                }


                if (
                    gasto.proveedorNombre ===
                    undefined
                ) {

                    gasto.proveedorNombre =
                        gasto.proveedor
                        ||
                        "";

                    cambios =
                        true;

                }


                if (
                    gasto.fincaNombre ===
                    undefined
                ) {

                    gasto.fincaNombre =
                        gasto.finca
                        ||
                        "";

                    cambios =
                        true;

                }


                if (
                    gasto.maquinariaNombre ===
                    undefined
                ) {

                    gasto.maquinariaNombre =
                        gasto.maquinaria
                        ||
                        "";

                    cambios =
                        true;

                }


                if (
                    gasto.parcela ===
                    undefined
                ) {

                    gasto.parcela =
                        "";

                    cambios =
                        true;

                }


                if (
                    gasto.campaniaId ===
                    undefined
                ) {

                    gasto.campaniaId =
                        null;

                    cambios =
                        true;

                }


                if (
                    gasto.campaniaNombre ===
                    undefined
                ) {

                    gasto.campaniaNombre =
                        "";

                    cambios =
                        true;

                }


                if (
                    gasto.pagadoAcumulado ===
                    undefined
                ) {

                    gasto.pagadoAcumulado =
                        gasto.estado ===
                        "Pagado"

                            ? numeroSeguro(
                                gasto.importe,
                                0
                            )

                            : 0;

                    cambios =
                        true;

                }


                if (
                    gasto.pendientePago ===
                    undefined
                ) {

                    gasto.pendientePago =
                        Math.max(
                            0,
                            numeroSeguro(
                                gasto.importe,
                                0
                            )
                            -
                            numeroSeguro(
                                gasto.pagadoAcumulado,
                                0
                            )
                        );

                    cambios =
                        true;

                }


                if (
                    ![
                        "Pendiente",
                        "Parcialmente pagado",
                        "Pagado"
                    ].includes(
                        gasto.estado
                    )
                ) {

                    gasto.estado =
                        this.calcularEstadoFinanciero(
                            gasto.pagadoAcumulado,
                            gasto.pendientePago
                        );

                    cambios =
                        true;

                }

            }
        );


        /*
         * Esta escritura solo ocurre si realmente existen
         * datos antiguos que necesitan migrarse.
         */
        if (
            cambios
        ) {

            this.guardar();

        }

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtenerTodos() {

        return this.gastos;

    }


    obtenerTodas() {

        return this.gastos;

    }


    obtenerPorId(
        id
    ) {

        return (
            this.gastos
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


    obtenerPorCampania(
        campaniaId
    ) {

        return this.gastos
            .filter(
                gasto =>
                    mismoId(
                        gasto.campaniaId,
                        campaniaId
                    )
            );

    }


    // =====================================================
    // ESTADOS
    // =====================================================

    obtenerPendientes() {

        return this.gastos
            .filter(
                gasto =>
                    gasto.estado ===
                    "Pendiente"
            );

    }


    obtenerParcialmentePagados() {

        return this.gastos
            .filter(
                gasto =>
                    gasto.estado ===
                    "Parcialmente pagado"
            );

    }


    obtenerPagados() {

        return this.gastos
            .filter(
                gasto =>
                    gasto.estado ===
                    "Pagado"
            );

    }


    calcularEstadoFinanciero(
        pagado,
        pendiente
    ) {

        pagado =
            numeroSeguro(
                pagado,
                0
            );


        pendiente =
            numeroSeguro(
                pendiente,
                0
            );


        if (
            pagado <=
            0.001
        ) {

            return "Pendiente";

        }


        if (
            pendiente <=
            0.001
        ) {

            return "Pagado";

        }


        return "Parcialmente pagado";

    }


    cambiarEstado(
        id,
        estado
    ) {

        const gasto =
            this.obtenerPorId(
                id
            );


        if (
            !gasto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El gasto no existe."

            };

        }


        if (
            ![
                "Pendiente",
                "Parcialmente pagado",
                "Pagado"
            ].includes(
                estado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Estado no válido."

            };

        }


        const estadoAnterior =
            gasto.estado;


        gasto.estado =
            estado;


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            gasto.estado =
                estadoAnterior;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el estado del gasto."

            };

        }


        return {

            ok:
                true,

            gasto:
                gasto

        };

    }


    cambiarEstadoPago(
        id,
        estado
    ) {

        return this.cambiarEstado(
            id,
            estado
        );

    }


    // =====================================================
    // ACTUALIZAR ESTADO FINANCIERO
    // =====================================================

    actualizarEstadoFinanciero(
        id,
        pagado,
        pendiente
    ) {

        const gasto =
            this.obtenerPorId(
                id
            );


        if (
            !gasto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El gasto no existe."

            };

        }


        const estadoAnterior =
            {

                pagadoAcumulado:
                    gasto.pagadoAcumulado,

                pendientePago:
                    gasto.pendientePago,

                estado:
                    gasto.estado

            };


        pagado =
            numeroSeguro(
                pagado,
                0
            );


        pendiente =
            numeroSeguro(
                pendiente,
                0
            );


        gasto.pagadoAcumulado =
            Number(
                Math.max(
                    0,
                    pagado
                )
                    .toFixed(
                        2
                    )
            );


        gasto.pendientePago =
            Number(
                Math.max(
                    0,
                    pendiente
                )
                    .toFixed(
                        2
                    )
            );


        gasto.estado =
            this.calcularEstadoFinanciero(
                gasto.pagadoAcumulado,
                gasto.pendientePago
            );


        const guardado =
            this.guardar();


        if (
            !guardado
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
    // TOTALES
    // =====================================================

    obtenerTotal() {

        return this.gastos
            .reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    numeroSeguro(
                        gasto.importe,
                        0
                    ),
                0
            );

    }


    obtenerTotalPagado() {

        return this.gastos
            .reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    numeroSeguro(
                        gasto.pagadoAcumulado,
                        0
                    ),
                0
            );

    }


    obtenerTotalPendiente() {

        return this.gastos
            .reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    numeroSeguro(
                        gasto.pendientePago
                        ??
                        gasto.importe,
                        0
                    ),
                0
            );

    }


    obtenerTotalPorCampania(
        campaniaId
    ) {

        return this.obtenerPorCampania(
            campaniaId
        )
            .reduce(
                (
                    total,
                    gasto
                ) =>
                    total
                    +
                    numeroSeguro(
                        gasto.importe,
                        0
                    ),
                0
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
                    "Los datos del gasto no son válidos."

            };

        }


        const concepto =
            String(
                datos.concepto
                ??
                ""
            )
                .trim();


        if (
            !concepto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce el concepto del gasto."

            };

        }


        const categoria =
            String(
                datos.categoria
                ??
                ""
            )
                .trim();


        if (
            !categoria
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Selecciona una categoría."

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
            !datos.fecha
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce una fecha."

            };

        }


        const finca =
            this.obtenerFinca(
                datos.fincaId
            );


        if (
            datos.fincaId
            &&
            !finca
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La finca seleccionada no existe."

            };

        }


        const campania =
            this.obtenerCampania(
                datos.campaniaId
            );


        if (
            datos.campaniaId
            &&
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
            finca
            &&
            campania
            &&
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


        const maquina =
            this.obtenerMaquina(
                datos.maquinariaId
            );


        if (
            datos.maquinariaId
            &&
            !maquina
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La maquinaria seleccionada no existe."

            };

        }


        const proveedor =
            this.obtenerProveedor(
                datos.proveedorId
            );


        if (
            datos.proveedorId
            &&
            !proveedor
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El proveedor seleccionado no existe o no está registrado como proveedor."

            };

        }


        return {

            ok:
                true,

            concepto:
                concepto,

            categoria:
                categoria,

            importe:
                Number(
                    importe.toFixed(
                        2
                    )
                ),

            finca:
                finca,

            campania:
                campania,

            maquina:
                maquina,

            proveedor:
                proveedor

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


        const nuevoGasto = {

            id:
                generarId(),

            concepto:
                validacion.concepto,

            categoria:
                validacion.categoria,

            importe:
                validacion.importe,

            fecha:
                datos.fecha,

            estado:
                "Pendiente",

            metodoPago:
                "",

            pagadoAcumulado:
                0,

            pendientePago:
                validacion.importe,

            fincaId:
                validacion.finca
                    ? validacion.finca.id
                    : null,

            fincaNombre:
                validacion.finca
                    ? validacion.finca.nombre
                    : "",

            parcela:
                String(
                    datos.parcela
                    ??
                    ""
                )
                    .trim(),

            campaniaId:
                validacion.campania
                    ? validacion.campania.id
                    : null,

            campaniaNombre:
                validacion.campania
                    ? validacion.campania.nombre
                    : "",

            maquinariaId:
                validacion.maquina
                    ? validacion.maquina.id
                    : null,

            maquinariaNombre:
                validacion.maquina
                    ? obtenerNombreMaquinaria(
                        validacion.maquina
                    )
                    : "",

            proveedorId:
                validacion.proveedor
                    ? validacion.proveedor.id
                    : null,

            proveedorNombre:
                validacion.proveedor
                    ? (
                        validacion.proveedor.nombre
                        ||
                        validacion.proveedor.razonSocial
                        ||
                        ""
                    )
                    : "",

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


        this.gastos.push(
            nuevoGasto
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.gastos =
                this.gastos
                    .filter(
                        gasto =>
                            !mismoId(
                                gasto.id,
                                nuevoGasto.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el gasto."

            };

        }


        return {

            ok:
                true,

            gasto:
                nuevoGasto

        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const gasto =
            this.obtenerPorId(
                id
            );


        if (
            !gasto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El gasto no existe."

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


        /*
         * Utilizamos los movimientos reales como fuente
         * de verdad. Si no existen, mantenemos compatibilidad
         * con pagadoAcumulado.
         */
        const totalPagado =
            this.obtenerTotalPagadoReal(
                gasto.id
            );


        const pagado =
            totalPagado >
            0.001

                ? totalPagado

                : numeroSeguro(
                    gasto.pagadoAcumulado,
                    0
                );


        if (
            validacion.importe <
            pagado -
            0.001
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes reducir el gasto a ${this.formatearDinero(
                        validacion.importe
                    )} porque ya se han pagado ${this.formatearDinero(
                        pagado
                    )}.`

            };

        }


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    gasto
                )
            );


        gasto.concepto =
            validacion.concepto;


        gasto.categoria =
            validacion.categoria;


        gasto.importe =
            validacion.importe;


        gasto.fecha =
            datos.fecha;


        gasto.fincaId =
            validacion.finca
                ? validacion.finca.id
                : null;


        gasto.fincaNombre =
            validacion.finca
                ? validacion.finca.nombre
                : "";


        gasto.parcela =
            String(
                datos.parcela
                ??
                ""
            )
                .trim();


        gasto.campaniaId =
            validacion.campania
                ? validacion.campania.id
                : null;


        gasto.campaniaNombre =
            validacion.campania
                ? validacion.campania.nombre
                : "";


        gasto.maquinariaId =
            validacion.maquina
                ? validacion.maquina.id
                : null;


        gasto.maquinariaNombre =
            validacion.maquina
                ? obtenerNombreMaquinaria(
                    validacion.maquina
                )
                : "";


        gasto.proveedorId =
            validacion.proveedor
                ? validacion.proveedor.id
                : null;


        gasto.proveedorNombre =
            validacion.proveedor
                ? (
                    validacion.proveedor.nombre
                    ||
                    validacion.proveedor.razonSocial
                    ||
                    ""
                )
                : "";


        gasto.observaciones =
            String(
                datos.observaciones
                ??
                ""
            )
                .trim();


        gasto.pagadoAcumulado =
            Number(
                pagado.toFixed(
                    2
                )
            );


        gasto.pendientePago =
            Number(
                Math.max(
                    0,
                    gasto.importe
                    -
                    pagado
                )
                    .toFixed(
                        2
                    )
            );


        gasto.estado =
            this.calcularEstadoFinanciero(
                gasto.pagadoAcumulado,
                gasto.pendientePago
            );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            Object.assign(
                gasto,
                estadoAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios del gasto."

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
    // PAGOS REALES
    // =====================================================

    obtenerPagosVinculados(
        gastoId
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
                        "Pago"
                        &&
                        mismoId(
                            movimiento.gastoId,
                            gastoId
                        )
                );

        }

        catch (
            error
        ) {

            console.error(
                "Error obteniendo pagos vinculados al gasto:",
                error
            );


            return [];

        }

    }


    obtenerTotalPagadoReal(
        gastoId
    ) {

        return Number(
            this.obtenerPagosVinculados(
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


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const gasto =
            this.obtenerPorId(
                id
            );


        if (
            !gasto
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El gasto no existe."

            };

        }


        const pagos =
            this.obtenerPagosVinculados(
                gasto.id
            );


        if (
            pagos.length >
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar este gasto porque tiene ${pagos.length} pago${
                        pagos.length === 1
                            ? ""
                            : "s"
                    } registrado${
                        pagos.length === 1
                            ? ""
                            : "s"
                    }. Elimina primero sus pagos desde Cobros y pagos.`

            };

        }


        /*
         * Compatibilidad con posibles datos antiguos donde
         * exista pagadoAcumulado pero no el movimiento.
         */
        if (
            numeroSeguro(
                gasto.pagadoAcumulado,
                0
            )
            >
            0.001
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "No puedes eliminar un gasto que ya tiene pagos registrados. Elimina primero sus pagos desde Cobros y pagos."

            };

        }


        const gastosAnteriores =
            [
                ...this.gastos
            ];


        this.gastos =
            this.gastos
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

            this.gastos =
                gastosAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el gasto."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // FINCA
    // =====================================================

    obtenerFinca(
        id
    ) {

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

            return null;

        }


        if (
            this.fincaService
            &&
            typeof this.fincaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return null;

    }


    // =====================================================
    // CAMPANYA
    // =====================================================

    obtenerCampania(
        id
    ) {

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

            return null;

        }


        if (
            this.campaniaService
            &&
            typeof this.campaniaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.campaniaService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        return null;

    }


    // =====================================================
    // MAQUINARIA
    // =====================================================

    obtenerMaquina(
        id
    ) {

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

            return null;

        }


        if (
            this.maquinariaService
            &&
            typeof this.maquinariaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.maquinariaService
                    .obtenerPorId(
                        id
                    )
                ||
                null
            );

        }


        const maquinaria =
            this.maquinariaService
            &&
            typeof this.maquinariaService
                .obtenerTodos ===
            "function"

                ? this.maquinariaService
                    .obtenerTodos()

                : [];


        return (
            maquinaria
                .find(
                    maquina =>
                        mismoId(
                            maquina.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // PROVEEDOR
    // =====================================================

    obtenerProveedor(
        id
    ) {

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

            return null;

        }


        let proveedor =
            null;


        if (
            this.clienteProveedorService
            &&
            typeof this.clienteProveedorService
                .obtenerPorId ===
            "function"
        ) {

            proveedor =
                this.clienteProveedorService
                    .obtenerPorId(
                        id
                    )
                ||
                null;

        }


        if (
            !proveedor
        ) {

            const contactos =
                this.clienteProveedorService
                &&
                typeof this.clienteProveedorService
                    .obtenerTodos ===
                "function"

                    ? this.clienteProveedorService
                        .obtenerTodos()

                    : [];


            proveedor =
                contactos
                    .find(
                        contacto =>
                            mismoId(
                                contacto.id,
                                id
                            )
                    )
                ||
                null;

        }


        if (
            !proveedor
        ) {

            return null;

        }


        const tipo =
            String(
                proveedor.tipo
                ??
                ""
            )
                .trim()
                .toLowerCase();


        if (
            tipo !==
            "proveedor"
            &&
            tipo !==
            "cliente y proveedor"
        ) {

            return null;

        }


        return proveedor;

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


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarGastos(
                this.gastos
            );

    }

}