import { StorageService } from "./storage.js";

export class CultivoService {

    constructor(
        fincaService,
        campaniaService
    ) {

        this.fincaService =
            fincaService;

        this.campaniaService =
            campaniaService;

        this.cultivos =
            StorageService.obtenerCultivos();


        if (
            !Array.isArray(
                this.cultivos
            )
        ) {

            this.cultivos = [];

        }

    }


    obtenerTodos() {

        return this.cultivos;

    }


    obtenerTodas() {

        return this.cultivos;

    }


    obtenerPorId(id) {

        return (
            this.cultivos.find(
                cultivo =>
                    Number(
                        cultivo.id
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


    obtenerActivos() {

        return this.cultivos.filter(
            cultivo =>
                cultivo.estado ===
                "Activo"
        );

    }


    obtenerPorFinca(
        fincaId
    ) {

        return this.cultivos.filter(
            cultivo =>
                Number(
                    cultivo.fincaId
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

        return this.cultivos.filter(
            cultivo =>
                Number(
                    cultivo.campaniaId
                )
                ===
                Number(
                    campaniaId
                )
        );

    }


    obtenerProduccionVinculada(
        cultivoId
    ) {

        try {

            if (
                typeof
                StorageService.obtenerProduccion
                !==
                "function"
            ) {

                return [];

            }


            const produccion =
                StorageService
                    .obtenerProduccion();


            if (
                !Array.isArray(
                    produccion
                )
            ) {

                return [];

            }


            return produccion.filter(
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

        catch {

            return [];

        }

    }


    validarCampaniaFinca(
        campania,
        finca
    ) {

        if (
            !campania
        ) {

            return {
                ok: true
            };

        }


        if (
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
                    "La campanya seleccionada no pertenece a la finca seleccionada."
            };

        }


        return {
            ok: true
        };

    }


    crear(datos) {

        if (
            !datos.tipo
            ||
            !datos.tipo.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce el tipo de cultivo."
            };

        }


        if (
            !datos.variedad
            ||
            !datos.variedad.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce la variedad."
            };

        }


        const finca =
            this.fincaService
                .obtenerPorId(
                    Number(
                        datos.fincaId
                    )
                );


        if (
            !finca
        ) {

            return {
                ok: false,
                mensaje:
                    "Selecciona una finca válida."
            };

        }


        let campania = null;


        if (
            datos.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        Number(
                            datos.campaniaId
                        )
                    );


            if (
                !campania
            ) {

                return {
                    ok: false,
                    mensaje:
                        "La campanya seleccionada no existe."
                };

            }


            const validacion =
                this.validarCampaniaFinca(
                    campania,
                    finca
                );


            if (
                !validacion.ok
            ) {

                return validacion;

            }

        }


        const superficie =
            Number(
                datos.superficie
                ||
                0
            );


        if (
            !Number.isFinite(
                superficie
            )
            ||
            superficie <
            0
        ) {

            return {
                ok: false,
                mensaje:
                    "La superficie no puede ser negativa."
            };

        }


        const nuevoCultivo = {

            id:
                Date.now(),

            tipo:
                datos.tipo.trim(),

            variedad:
                datos.variedad.trim(),

            fincaId:
                finca.id,

            fincaNombre:
                finca.nombre,

            parcela:
                datos.parcela?.trim()
                ||
                "",

            superficie:
                superficie,

            estado:
                datos.estado
                ||
                "Activo",

            fechaInicio:
                datos.fechaInicio
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

            notas:
                datos.notas?.trim()
                ||
                "",

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        this.cultivos.push(
            nuevoCultivo
        );


        this.guardar();


        return {
            ok: true,
            cultivo:
                nuevoCultivo
        };

    }


    editar(
        id,
        datos
    ) {

        const cultivo =
            this.obtenerPorId(
                id
            );


        if (
            !cultivo
        ) {

            return {
                ok: false,
                mensaje:
                    "El cultivo no existe."
            };

        }


        if (
            !datos.tipo
            ||
            !datos.tipo.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce el tipo de cultivo."
            };

        }


        if (
            !datos.variedad
            ||
            !datos.variedad.trim()
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce la variedad."
            };

        }


        const finca =
            this.fincaService
                .obtenerPorId(
                    Number(
                        datos.fincaId
                    )
                );


        if (
            !finca
        ) {

            return {
                ok: false,
                mensaje:
                    "Selecciona una finca válida."
            };

        }


        let campania = null;


        if (
            datos.campaniaId
        ) {

            campania =
                this.campaniaService
                    .obtenerPorId(
                        Number(
                            datos.campaniaId
                        )
                    );


            if (
                !campania
            ) {

                return {
                    ok: false,
                    mensaje:
                        "La campanya seleccionada no existe."
                };

            }


            const validacion =
                this.validarCampaniaFinca(
                    campania,
                    finca
                );


            if (
                !validacion.ok
            ) {

                return validacion;

            }

        }


        const superficie =
            Number(
                datos.superficie
                ||
                0
            );


        if (
            !Number.isFinite(
                superficie
            )
            ||
            superficie <
            0
        ) {

            return {
                ok: false,
                mensaje:
                    "La superficie no puede ser negativa."
            };

        }


        const produccionVinculada =
            this.obtenerProduccionVinculada(
                cultivo.id
            );


        const fincaCambia =
            Number(
                cultivo.fincaId
            )
            !==
            Number(
                finca.id
            );


        const campaniaActualId =
            cultivo.campaniaId
                ? Number(
                    cultivo.campaniaId
                )
                : null;


        const nuevaCampaniaId =
            campania
                ? Number(
                    campania.id
                )
                : null;


        const campaniaCambia =
            campaniaActualId
            !==
            nuevaCampaniaId;


        if (
            produccionVinculada.length >
            0
            &&
            (
                fincaCambia
                ||
                campaniaCambia
            )
        ) {

            return {
                ok: false,

                mensaje:
                    `No puedes cambiar la finca ni la campanya de este cultivo porque ya tiene ${produccionVinculada.length} registro${
                        produccionVinculada.length === 1
                            ? ""
                            : "s"
                    } de producción vinculado${
                        produccionVinculada.length === 1
                            ? ""
                            : "s"
                    }.`
            };

        }


        cultivo.tipo =
            datos.tipo.trim();

        cultivo.variedad =
            datos.variedad.trim();

        cultivo.fincaId =
            finca.id;

        cultivo.fincaNombre =
            finca.nombre;

        cultivo.parcela =
            datos.parcela?.trim()
            ||
            "";

        cultivo.superficie =
            superficie;

        cultivo.estado =
            datos.estado
            ||
            "Activo";

        cultivo.fechaInicio =
            datos.fechaInicio
            ||
            "";

        cultivo.campaniaId =
            campania
                ? campania.id
                : null;

        cultivo.campaniaNombre =
            campania
                ? campania.nombre
                : "";

        cultivo.notas =
            datos.notas?.trim()
            ||
            "";


        this.guardar();


        return {
            ok: true,
            cultivo:
                cultivo
        };

    }


    eliminar(id) {

        const cultivo =
            this.obtenerPorId(
                id
            );


        if (
            !cultivo
        ) {

            return {
                ok: false,
                mensaje:
                    "El cultivo no existe."
            };

        }


        const produccionVinculada =
            this.obtenerProduccionVinculada(
                cultivo.id
            );


        if (
            produccionVinculada.length >
            0
        ) {

            return {
                ok: false,

                mensaje:
                    `No puedes eliminar este cultivo porque ya tiene ${produccionVinculada.length} registro${
                        produccionVinculada.length === 1
                            ? ""
                            : "s"
                    } de producción vinculado${
                        produccionVinculada.length === 1
                            ? ""
                            : "s"
                    }. Puedes marcarlo como inactivo para conservar la trazabilidad.`
            };

        }


        this.cultivos =
            this.cultivos.filter(
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


    guardar() {

        StorageService
            .guardarCultivos(
                this.cultivos
            );

    }

}