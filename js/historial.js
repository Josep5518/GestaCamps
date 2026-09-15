import { StorageService } from "./storage.js";


export class HistorialService {

    // =====================================================
    // TODOS
    // =====================================================

    obtenerTodos() {

        return StorageService
            .obtenerHistorial()
            .slice()
            .sort(
                (a, b) =>
                    new Date(
                        b.fechaHora
                    )
                    -
                    new Date(
                        a.fechaHora
                    )
            );

    }


    // =====================================================
    // POR MÓDULO
    // =====================================================

    obtenerPorModulo(
        modulo
    ) {

        if (
            !modulo
        ) {

            return this.obtenerTodos();

        }


        return this.obtenerTodos()
            .filter(
                registro =>
                    registro.modulo ===
                    modulo
            );

    }


    // =====================================================
    // POR USUARIO
    // =====================================================

    obtenerPorUsuario(
        usuario
    ) {

        const texto =
            String(
                usuario
                ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            !texto
        ) {

            return this.obtenerTodos();

        }


        return this.obtenerTodos()
            .filter(
                registro =>
                    String(
                        registro.usuarioNombre
                        ||
                        ""
                    )
                        .toLowerCase()
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
                    a.localeCompare(
                        b,
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
            StorageService
                .obtenerFechaLocal(
                    ahora
                );


        return this.obtenerTodos()
            .filter(
                registro =>
                    registro.fecha ===
                    fecha
            );

    }

}