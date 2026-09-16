import {
    generarId,
    mismoId,
    numeroSeguro
} from "./utils.js";


export class ParcelaService {

    constructor(
        fincaService
    ) {

        this.fincaService =
            fincaService;

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        fincaId,
        nombre,
        superficie,
        sigpac,
        notas
    ) {

        const finca =
            this.fincaService
                .obtenerPorId(
                    fincaId
                );


        if (
            !finca
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La finca no existe."

            };

        }


        const nombreLimpio =
            String(
                nombre
                ??
                ""
            )
                .trim();


        if (
            !nombreLimpio
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El nombre de la parcela es obligatorio."

            };

        }


        const superficieNueva =
            numeroSeguro(
                superficie,
                NaN
            );


        if (
            !Number.isFinite(
                superficieNueva
            )
            ||
            superficieNueva <=
            0
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Introduce una superficie válida."

            };

        }


        if (
            !Array.isArray(
                finca.parcelas
            )
        ) {

            finca.parcelas =
                [];

        }


        const superficieUsada =
            finca.parcelas
                .reduce(
                    (
                        total,
                        parcela
                    ) =>
                        total
                        +
                        numeroSeguro(
                            parcela.superficie,
                            0
                        ),
                    0
                );


        const superficieFinca =
            numeroSeguro(
                finca.superficie,
                0
            );


        const superficieDisponible =
            Math.max(
                0,
                superficieFinca
                -
                superficieUsada
            );


        if (
            superficieNueva >
            superficieDisponible
            +
            0.000001
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No hay suficiente superficie disponible.\n\n`
                    +
                    `Superficie de la finca: ${superficieFinca.toFixed(
                        2
                    )} ha\n`
                    +
                    `Superficie utilizada: ${superficieUsada.toFixed(
                        2
                    )} ha\n`
                    +
                    `Superficie disponible: ${superficieDisponible.toFixed(
                        2
                    )} ha`

            };

        }


        const nuevaParcela = {

            id:
                generarId(),

            nombre:
                nombreLimpio,

            superficie:
                Number(
                    superficieNueva
                        .toFixed(
                            2
                        )
                ),

            sigpac:
                String(
                    sigpac
                    ??
                    ""
                )
                    .trim(),

            notas:
                String(
                    notas
                    ??
                    ""
                )
                    .trim(),

            cultivo:
                null

        };


        finca.parcelas.push(
            nuevaParcela
        );


        const guardado =
            this.fincaService
                .guardar();


        if (
            guardado ===
            false
        ) {

            finca.parcelas =
                finca.parcelas
                    .filter(
                        parcela =>
                            !mismoId(
                                parcela.id,
                                nuevaParcela.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar la parcela."

            };

        }


        return {

            ok:
                true,

            parcela:
                nuevaParcela

        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        fincaId,
        parcelaId
    ) {

        const finca =
            this.fincaService
                .obtenerPorId(
                    fincaId
                );


        if (
            !finca
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La finca no existe."

            };

        }


        if (
            !Array.isArray(
                finca.parcelas
            )
        ) {

            finca.parcelas =
                [];

        }


        const parcela =
            finca.parcelas
                .find(
                    item =>
                        mismoId(
                            item.id,
                            parcelaId
                        )
                );


        if (
            !parcela
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La parcela no existe."

            };

        }


        const parcelasAnteriores =
            [
                ...finca.parcelas
            ];


        finca.parcelas =
            finca.parcelas
                .filter(
                    item =>
                        !mismoId(
                            item.id,
                            parcelaId
                        )
                );


        const guardado =
            this.fincaService
                .guardar();


        if (
            guardado ===
            false
        ) {

            finca.parcelas =
                parcelasAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar la parcela."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        fincaId,
        parcelaId
    ) {

        const finca =
            this.fincaService
                .obtenerPorId(
                    fincaId
                );


        if (
            !finca
            ||
            !Array.isArray(
                finca.parcelas
            )
        ) {

            return null;

        }


        return (
            finca.parcelas
                .find(
                    parcela =>
                        mismoId(
                            parcela.id,
                            parcelaId
                        )
                )
            ||
            null
        );

    }

}