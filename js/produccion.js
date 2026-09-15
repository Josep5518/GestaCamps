import { StorageService } from "./storage.js";

export class ProduccionService {

    constructor(
        fincaService,
        campaniaService,
        cultivoService
    ) {

        this.fincaService =
            fincaService;

        this.campaniaService =
            campaniaService;

        this.cultivoService =
            cultivoService;

        this.registros =
            StorageService.obtenerProduccion();


        if (
            !Array.isArray(
                this.registros
            )
        ) {

            this.registros = [];

        }

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtenerTodos() {

        return this.registros;

    }


    obtenerTodas() {

        return this.registros;

    }


    obtenerPorId(id) {

        return (
            this.registros.find(
                registro =>
                    Number(
                        registro.id
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


    obtenerPorFinca(
        fincaId
    ) {

        return this.registros.filter(
            registro =>
                Number(
                    registro.fincaId
                )
                ===
                Number(
                    fincaId
                )
        );

    }


    obtenerPorCampania(
        campaniaId
    ) {

        return this.registros.filter(
            registro =>
                Number(
                    registro.campaniaId
                )
                ===
                Number(
                    campaniaId
                )
        );

    }


    obtenerPorCultivo(
        cultivoId
    ) {

        return this.registros.filter(
            registro =>
                Number(
                    registro.cultivoId
                )
                ===
                Number(
                    cultivoId
                )
        );

    }


    // =====================================================
    // TOTALES
    // =====================================================

    obtenerTotal() {

        return this.registros.reduce(
            (
                total,
                registro
            ) =>
                total
                +
                Number(
                    registro.cantidad
                    ||
                    0
                ),
            0
        );

    }


    obtenerTotalKg() {

        return this.obtenerTotal();

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
                    registro
                ) =>
                    total
                    +
                    Number(
                        registro.cantidad
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

        const cultivo =
            this.cultivoService
                .obtenerPorId(
                    Number(
                        datos.cultivoId
                    )
                );


        if (
            !cultivo
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona un cultivo válido."
            };

        }


        const finca =
            this.fincaService
                .obtenerPorId(
                    cultivo.fincaId
                );


        if (
            !finca
        ) {

            return {
                ok: false,

                mensaje:
                    "La finca asociada al cultivo no existe."
            };

        }


        let campania =
            null;


        if (
            cultivo.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        cultivo.campaniaId
                    );

        }


        const cantidad =
            Number(
                datos.cantidad
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
                    "Introduce una cantidad válida."
            };

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce la fecha de producción."
            };

        }


        const nuevoRegistro = {

            id:
                Date.now(),

            cultivoId:
                cultivo.id,

            cultivoNombre:
                `${cultivo.tipo} · ${cultivo.variedad}`,

            fincaId:
                finca.id,

            fincaNombre:
                finca.nombre,

            parcela:
                cultivo.parcela
                ||
                "",

            producto:
                cultivo.tipo,

            variedad:
                cultivo.variedad,

            cantidad:
                cantidad,

            unidad:
                datos.unidad
                ||
                "kg",

            fecha:
                datos.fecha,

            campaniaId:
                campania
                    ? campania.id
                    : null,

            campaniaNombre:
                campania
                    ? campania.nombre
                    : "",

            observaciones:
                datos.observaciones
                    ?.trim()
                ||
                "",

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        this.registros.push(
            nuevoRegistro
        );


        this.guardar();


        return {
            ok: true,

            registro:
                nuevoRegistro
        };

    }


    // =====================================================
    // EDITAR
    // =====================================================

    editar(
        id,
        datos
    ) {

        const registro =
            this.obtenerPorId(
                id
            );


        if (
            !registro
        ) {

            return {
                ok: false,

                mensaje:
                    "El registro de producción no existe."
            };

        }


        const cultivo =
            this.cultivoService
                .obtenerPorId(
                    Number(
                        datos.cultivoId
                    )
                );


        if (
            !cultivo
        ) {

            return {
                ok: false,

                mensaje:
                    "Selecciona un cultivo válido."
            };

        }


        const finca =
            this.fincaService
                .obtenerPorId(
                    cultivo.fincaId
                );


        if (
            !finca
        ) {

            return {
                ok: false,

                mensaje:
                    "La finca asociada al cultivo no existe."
            };

        }


        let campania =
            null;


        if (
            cultivo.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        cultivo.campaniaId
                    );

        }


        const cantidad =
            Number(
                datos.cantidad
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
                    "Introduce una cantidad válida."
            };

        }


        if (
            !datos.fecha
        ) {

            return {
                ok: false,

                mensaje:
                    "Introduce la fecha de producción."
            };

        }


        registro.cultivoId =
            cultivo.id;


        registro.cultivoNombre =
            `${cultivo.tipo} · ${cultivo.variedad}`;


        registro.fincaId =
            finca.id;


        registro.fincaNombre =
            finca.nombre;


        registro.parcela =
            cultivo.parcela
            ||
            "";


        registro.producto =
            cultivo.tipo;


        registro.variedad =
            cultivo.variedad;


        registro.cantidad =
            cantidad;


        registro.unidad =
            datos.unidad
            ||
            "kg";


        registro.fecha =
            datos.fecha;


        registro.campaniaId =
            campania
                ? campania.id
                : null;


        registro.campaniaNombre =
            campania
                ? campania.nombre
                : "";


        registro.observaciones =
            datos.observaciones
                ?.trim()
            ||
            "";


        this.guardar();


        return {
            ok: true,

            registro:
                registro
        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(id) {

        const registro =
            this.obtenerPorId(
                id
            );


        if (
            !registro
        ) {

            return {
                ok: false,

                mensaje:
                    "El registro de producción no existe."
            };

        }


        this.registros =
            this.registros.filter(
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
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarProduccion(
                this.registros
            );

    }

}