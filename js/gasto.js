import { StorageService } from "./storage.js";

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
            StorageService.obtenerGastos();


        if (
            !Array.isArray(
                this.gastos
            )
        ) {

            this.gastos = [];

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
                            ? Number(
                                gasto.importe
                                ||
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
                            Number(
                                gasto.importe
                                ||
                                0
                            )
                            -
                            Number(
                                gasto.pagadoAcumulado
                                ||
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
                        Number(
                            gasto.pagadoAcumulado
                            ||
                            0
                        ) >
                        0

                            ? (
                                Number(
                                    gasto.pendientePago
                                    ||
                                    0
                                ) <=
                                0
                                    ? "Pagado"
                                    : "Parcialmente pagado"
                            )

                            : "Pendiente";

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
    // OBTENER
    // =====================================================

    obtenerTodos() {

        return this.gastos;

    }


    obtenerTodas() {

        return this.gastos;

    }


    obtenerPorId(id) {

        return (
            this.gastos.find(
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


    obtenerPorCampania(
        campaniaId
    ) {

        return this.gastos.filter(
            gasto =>
                Number(
                    gasto.campaniaId
                )
                ===
                Number(
                    campaniaId
                )
        );

    }


    // =====================================================
    // ESTADOS
    // =====================================================

    obtenerPendientes() {

        return this.gastos.filter(
            gasto =>
                gasto.estado ===
                "Pendiente"
        );

    }


    obtenerParcialmentePagados() {

        return this.gastos.filter(
            gasto =>
                gasto.estado ===
                "Parcialmente pagado"
        );

    }


    obtenerPagados() {

        return this.gastos.filter(
            gasto =>
                gasto.estado ===
                "Pagado"
        );

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
                ok: false,
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
                ok: false,
                mensaje:
                    "Estado no válido."
            };

        }


        gasto.estado =
            estado;


        this.guardar();


        return {
            ok: true,
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
                ok: false,
                mensaje:
                    "El gasto no existe."
            };

        }


        pagado =
            Number(
                pagado
                ||
                0
            );


        pendiente =
            Number(
                pendiente
                ||
                0
            );


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
                    pendiente
                )
                    .toFixed(
                        2
                    )
            );


        if (
            gasto.pagadoAcumulado <=
            0.001
        ) {

            gasto.estado =
                "Pendiente";

        }

        else if (
            gasto.pendientePago <=
            0.001
        ) {

            gasto.estado =
                "Pagado";

        }

        else {

            gasto.estado =
                "Parcialmente pagado";

        }


        this.guardar();


        return {
            ok: true,
            gasto:
                gasto
        };

    }


    // =====================================================
    // TOTALES
    // =====================================================

    obtenerTotal() {

        return this.gastos.reduce(
            (
                total,
                gasto
            ) =>
                total
                +
                Number(
                    gasto.importe
                    ||
                    0
                ),
            0
        );

    }


    obtenerTotalPagado() {

        return this.gastos.reduce(
            (
                total,
                gasto
            ) =>
                total
                +
                Number(
                    gasto.pagadoAcumulado
                    ||
                    0
                ),
            0
        );

    }


    obtenerTotalPendiente() {

        return this.gastos.reduce(
            (
                total,
                gasto
            ) =>
                total
                +
                Number(
                    gasto.pendientePago
                    ??
                    gasto.importe
                    ??
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
                    Number(
                        gasto.importe
                        ||
                        0
                    ),
                0
            );

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(datos) {

        if (
            !datos.concepto
            ||
            !datos.concepto.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce el concepto del gasto."
            };

        }


        if (
            !datos.categoria
        ) {

            return {
                ok: false,
                mensaje:
                    "Selecciona una categoría."
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
            !datos.fecha
        ) {

            return {
                ok: false,
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
                ok: false,
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
                ok: false,
                mensaje:
                    "La campanya seleccionada no existe."
            };

        }


        if (
            finca
            &&
            campania
            &&
            Number(
                campania.fincaId
            )
            !==
            Number(
                finca.id
            )
        ) {

            return {
                ok: false,
                mensaje:
                    "La campanya no pertenece a la finca seleccionada."
            };

        }


        const maquina =
            this.obtenerMaquina(
                datos.maquinariaId
            );


        const proveedor =
            this.obtenerProveedor(
                datos.proveedorId
            );


        const nuevoGasto = {

            id:
                Date.now(),

            concepto:
                datos.concepto.trim(),

            categoria:
                datos.categoria,

            importe:
                Number(
                    importe.toFixed(
                        2
                    )
                ),

            fecha:
                datos.fecha,

            estado:
                "Pendiente",

            metodoPago:
                "",

            pagadoAcumulado:
                0,

            pendientePago:
                Number(
                    importe.toFixed(
                        2
                    )
                ),

            fincaId:
                finca
                    ? finca.id
                    : null,

            fincaNombre:
                finca
                    ? finca.nombre
                    : "",

            parcela:
                datos.parcela?.trim()
                ||
                "",

            campaniaId:
                campania
                    ? campania.id
                    : null,

            campaniaNombre:
                campania
                    ? campania.nombre
                    : "",

            maquinariaId:
                maquina
                    ? maquina.id
                    : null,

            maquinariaNombre:
                maquina
                    ? this.obtenerNombreMaquinaria(
                        maquina
                    )
                    : "",

            proveedorId:
                proveedor
                    ? proveedor.id
                    : null,

            proveedorNombre:
                proveedor
                    ? (
                        proveedor.nombre
                        ||
                        proveedor.razonSocial
                        ||
                        ""
                    )
                    : "",

            observaciones:
                datos.observaciones?.trim()
                ||
                "",

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        this.gastos.push(
            nuevoGasto
        );


        this.guardar();


        return {
            ok: true,
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
                ok: false,
                mensaje:
                    "El gasto no existe."
            };

        }


        if (
            !datos.concepto
            ||
            !datos.concepto.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce el concepto del gasto."
            };

        }


        if (
            !datos.categoria
        ) {

            return {
                ok: false,
                mensaje:
                    "Selecciona una categoría."
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


        const pagado =
            Number(
                gasto.pagadoAcumulado
                ||
                0
            );


        /*
         * No se puede reducir un gasto por debajo
         * de lo que ya se ha pagado.
         */

        if (
            importe <
            pagado -
            0.001
        ) {

            return {
                ok: false,

                mensaje:
                    `No puedes reducir el gasto a ${this.formatearDinero(
                        importe
                    )} porque ya se han pagado ${this.formatearDinero(
                        pagado
                    )}.`
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
                ok: false,
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
                ok: false,
                mensaje:
                    "La campanya seleccionada no existe."
            };

        }


        if (
            finca
            &&
            campania
            &&
            Number(
                campania.fincaId
            )
            !==
            Number(
                finca.id
            )
        ) {

            return {
                ok: false,
                mensaje:
                    "La campanya no pertenece a la finca seleccionada."
            };

        }


        const maquina =
            this.obtenerMaquina(
                datos.maquinariaId
            );


        const proveedor =
            this.obtenerProveedor(
                datos.proveedorId
            );


        gasto.concepto =
            datos.concepto.trim();


        gasto.categoria =
            datos.categoria;


        gasto.importe =
            Number(
                importe.toFixed(
                    2
                )
            );


        gasto.fecha =
            datos.fecha;


        gasto.fincaId =
            finca
                ? finca.id
                : null;


        gasto.fincaNombre =
            finca
                ? finca.nombre
                : "";


        gasto.parcela =
            datos.parcela?.trim()
            ||
            "";


        gasto.campaniaId =
            campania
                ? campania.id
                : null;


        gasto.campaniaNombre =
            campania
                ? campania.nombre
                : "";


        gasto.maquinariaId =
            maquina
                ? maquina.id
                : null;


        gasto.maquinariaNombre =
            maquina
                ? this.obtenerNombreMaquinaria(
                    maquina
                )
                : "";


        gasto.proveedorId =
            proveedor
                ? proveedor.id
                : null;


        gasto.proveedorNombre =
            proveedor
                ? (
                    proveedor.nombre
                    ||
                    proveedor.razonSocial
                    ||
                    ""
                )
                : "";


        gasto.observaciones =
            datos.observaciones?.trim()
            ||
            "";


        /*
         * Recalculamos pendiente después
         * de cambiar el importe.
         */

        gasto.pendientePago =
            Number(
                Math.max(
                    0,
                    gasto.importe -
                    pagado
                )
                    .toFixed(
                        2
                    )
            );


        if (
            pagado <=
            0.001
        ) {

            gasto.estado =
                "Pendiente";

        }

        else if (
            gasto.pendientePago <=
            0.001
        ) {

            gasto.estado =
                "Pagado";

        }

        else {

            gasto.estado =
                "Parcialmente pagado";

        }


        this.guardar();


        return {
            ok: true,
            gasto:
                gasto
        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(id) {

        const gasto =
            this.obtenerPorId(
                id
            );


        if (
            !gasto
        ) {

            return {
                ok: false,
                mensaje:
                    "El gasto no existe."
            };

        }


        if (
            Number(
                gasto.pagadoAcumulado
                ||
                0
            ) >
            0.001
        ) {

            return {
                ok: false,

                mensaje:
                    "No puedes eliminar un gasto que ya tiene pagos registrados. Elimina primero sus pagos desde Cobros y pagos."
            };

        }


        this.gastos =
            this.gastos.filter(
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
    // FINCA
    // =====================================================

    obtenerFinca(id) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.fincaService
            &&
            typeof
            this.fincaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.fincaService
                    .obtenerPorId(
                        Number(
                            id
                        )
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

    obtenerCampania(id) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.campaniaService
            &&
            typeof
            this.campaniaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.campaniaService
                    .obtenerPorId(
                        Number(
                            id
                        )
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

    obtenerMaquina(id) {

        if (
            !id
        ) {

            return null;

        }


        if (
            this.maquinariaService
            &&
            typeof
            this.maquinariaService
                .obtenerPorId ===
            "function"
        ) {

            return (
                this.maquinariaService
                    .obtenerPorId(
                        Number(
                            id
                        )
                    )
                ||
                null
            );

        }


        const maquinaria =
            this.maquinariaService
            &&
            typeof
            this.maquinariaService
                .obtenerTodos ===
            "function"

                ? this.maquinariaService
                    .obtenerTodos()

                : [];


        return (
            maquinaria.find(
                maquina =>
                    Number(
                        maquina.id
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
    // PROVEEDOR
    // =====================================================

    obtenerProveedor(id) {

        if (
            !id
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

            const proveedor =
                this.clienteProveedorService
                    .obtenerPorId(
                        Number(
                            id
                        )
                    );


            if (
                proveedor
            ) {

                return proveedor;

            }

        }


        const contactos =
            this.clienteProveedorService
            &&
            typeof
            this.clienteProveedorService
                .obtenerTodos ===
            "function"

                ? this.clienteProveedorService
                    .obtenerTodos()

                : [];


        return (
            contactos.find(
                contacto =>
                    Number(
                        contacto.id
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
    // NOMBRE MAQUINARIA
    // =====================================================

    obtenerNombreMaquinaria(
        maquina
    ) {

        return [
            maquina.nombre,
            maquina.marca,
            maquina.modelo
        ]
            .filter(Boolean)
            .join(
                " · "
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


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarGastos(
                this.gastos
            );

    }

}