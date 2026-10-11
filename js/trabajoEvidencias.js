import {
    TrabajoService
} from "./trabajo.js";

import {
    EvidenciasService
} from "./evidenciasService.js";

import {
    mismoId
} from "./utils.js";


export class TrabajoServiceEvidencias extends TrabajoService {

    // =====================================================
    // NORMALIZAR
    // =====================================================

    normalizarTrabajo(
        trabajo
    ) {

        const normalizado =
            super.normalizarTrabajo(
                trabajo
            );


        return {

            ...normalizado,

            evidencias:
                Array.isArray(
                    trabajo?.evidencias
                )
                    ? trabajo.evidencias
                    : []

        };

    }


    // =====================================================
    // OBTENER EVIDENCIAS
    // =====================================================

    obtenerEvidencias(
        id
    ) {

        const trabajo =
            this.obtenerPorId(
                id
            );


        if (
            !trabajo
        ) {

            return [];

        }


        return Array.isArray(
            trabajo.evidencias
        )
            ? [
                ...trabajo.evidencias
            ]
            : [];

    }


    // =====================================================
    // AÑADIR EVIDENCIA
    // =====================================================

    agregarEvidencia(
        id,
        evidencia
    ) {

        const trabajo =
            this.obtenerPorId(
                id
            );


        if (
            !trabajo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajo no existe."

            };

        }


        if (
            !evidencia
            ||
            !evidencia.id
            ||
            !evidencia.ruta
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La evidencia no es válida."

            };

        }


        const anteriores =
            Array.isArray(
                trabajo.evidencias
            )
                ? [
                    ...trabajo.evidencias
                ]
                : [];


        trabajo.evidencias = [
            ...anteriores,
            evidencia
        ];


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            trabajo.evidencias =
                anteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido asociar la evidencia al trabajo."

            };

        }


        return {

            ok:
                true,

            trabajo,

            evidencia

        };

    }


    // =====================================================
    // QUITAR EVIDENCIA
    // =====================================================

    quitarEvidencia(
        id,
        evidenciaId
    ) {

        const trabajo =
            this.obtenerPorId(
                id
            );


        if (
            !trabajo
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajo no existe."

            };

        }


        const anteriores =
            Array.isArray(
                trabajo.evidencias
            )
                ? [
                    ...trabajo.evidencias
                ]
                : [];


        const evidencia =
            anteriores.find(
                item =>
                    mismoId(
                        item?.id,
                        evidenciaId
                    )
            )
            ||
            null;


        if (
            !evidencia
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "La evidencia no existe."

            };

        }


        trabajo.evidencias =
            anteriores.filter(
                item =>
                    !mismoId(
                        item?.id,
                        evidenciaId
                    )
            );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            trabajo.evidencias =
                anteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido quitar la evidencia del trabajo."

            };

        }


        return {

            ok:
                true,

            evidencia

        };

    }


    // =====================================================
    // ELIMINAR TAREA
    // =====================================================

    eliminar(
        id
    ) {

        const trabajo =
            this.obtenerPorId(
                id
            );


        const evidencias =
            Array.isArray(
                trabajo?.evidencias
            )
                ? [
                    ...trabajo.evidencias
                ]
                : [];


        const resultado =
            super.eliminar(
                id
            );


        if (
            resultado?.ok
            &&
            evidencias.length > 0
        ) {

            EvidenciasService
                .eliminarVarias(
                    evidencias
                )
                .catch(
                    error =>
                        console.warn(
                            "GestaCamps: no se pudieron borrar algunas evidencias del trabajo.",
                            error
                        )
                );

        }


        return resultado;

    }


    // =====================================================
    // ELIMINAR SERIE RECURRENTE
    // =====================================================

    eliminarSerie(
        serieRecurrenciaId
    ) {

        const serie =
            this.obtenerPorSerie(
                serieRecurrenciaId
            );


        const evidencias =
            serie.flatMap(
                trabajo =>
                    Array.isArray(
                        trabajo.evidencias
                    )
                        ? trabajo.evidencias
                        : []
            );


        const resultado =
            super.eliminarSerie(
                serieRecurrenciaId
            );


        if (
            resultado?.ok
            &&
            evidencias.length > 0
        ) {

            EvidenciasService
                .eliminarVarias(
                    evidencias
                )
                .catch(
                    error =>
                        console.warn(
                            "GestaCamps: no se pudieron borrar algunas evidencias de la serie.",
                            error
                        )
                );

        }


        return resultado;

    }

}