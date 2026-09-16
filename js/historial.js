import { StorageService } from "./storage.js";

import {
    normalizarTexto
} from "./utils.js";


export class HistorialService {

    // =====================================================
    // TODOS
    // =====================================================

    obtenerTodos() {

        const historial =
            StorageService
                .obtenerHistorial();


        if (
            !Array.isArray(
                historial
            )
        ) {

            return [];

        }


        return historial
            .slice()
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        b.fechaHora
                        ||
                        0
                    )
                    -
                    new Date(
                        a.fechaHora
                        ||
                        0
                    )
            );

    }


    // =====================================================
    // POR MÓDULO
    // =====================================================

    obtenerPorModulo(
        modulo
    ) {

        const moduloBuscado =
            normalizarTexto(
                modulo
            );


        if (
            !moduloBuscado
        ) {

            return this.obtenerTodos();

        }


        return this.obtenerTodos()
            .filter(
                registro =>
                    normalizarTexto(
                        registro.modulo
                    )
                    ===
                    moduloBuscado
            );

    }


    // =====================================================
    // POR USUARIO
    // =====================================================

    obtenerPorUsuario(
        usuario
    ) {

        const texto =
            normalizarTexto(
                usuario
            );


        if (
            !texto
        ) {

            return this.obtenerTodos();

        }


        return this.obtenerTodos()
            .filter(
                registro =>
                    normalizarTexto(
                        registro.usuarioNombre
                    )
                        .includes(
                            texto
                        )
            );

    }


    // =====================================================
    // MÓDULOS DISPONIBLES
    // =====================================================

    obtenerModulos() {

        return [
            ...new Set(
                this.obtenerTodos()
                    .map(
                        registro =>
                            registro.modulo
                    )
                    .filter(
                        Boolean
                    )
            )
        ]
            .sort(
                (
                    a,
                    b
                ) =>
                    String(
                        a
                    )
                        .localeCompare(
                            String(
                                b
                            ),
                            "es"
                        )
            );

    }


    // =====================================================
    // REGISTROS DE HOY
    // =====================================================

    obtenerHoy() {

        const ahora =
            new Date();


        const fecha =
            typeof StorageService
                .obtenerFechaLocal ===
            "function"

                ? StorageService
                    .obtenerFechaLocal(
                        ahora
                    )

                : this.obtenerFechaLocalFallback(
                    ahora
                );


        return this.obtenerTodos()
            .filter(
                registro =>
                    registro.fecha ===
                    fecha
            );

    }


    // =====================================================
    // FALLBACK FECHA LOCAL
    // =====================================================

    obtenerFechaLocalFallback(
        fecha
    ) {

        const anio =
            fecha.getFullYear();


        const mes =
            String(
                fecha.getMonth() +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const dia =
            String(
                fecha.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${anio}-${mes}-${dia}`
        );

    }

}