import { StorageService } from "./storage.js";

import {
    generarId,
    mismoId
} from "./utils.js";

import {
    obtenerNombreTrabajador
} from "./entityHelpers.js";


export class TrabajadorService {

    constructor() {

        this.trabajadores =
            StorageService
                .obtenerTrabajadores()
                .map(
                    trabajador => ({
                        ...trabajador,

                        pin:
                            trabajador.pin
                            ||
                            ""
                    })
                );

    }


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    obtenerTodos() {

        return this.trabajadores;

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    obtenerPorId(
        id
    ) {

        return (
            this.trabajadores
                .find(
                    trabajador =>
                        mismoId(
                            trabajador.id,
                            id
                        )
                )
            ||
            null
        );

    }


    // =====================================================
    // OBTENER POR PIN
    // =====================================================

    obtenerPorPin(
        pin
    ) {

        const pinBuscado =
            String(
                pin
                ||
                ""
            )
                .trim();


        return (
            this.trabajadores
                .find(
                    trabajador =>
                        String(
                            trabajador.pin
                            ||
                            ""
                        )
                        ===
                        pinBuscado
                )
            ||
            null
        );

    }


    // =====================================================
    // VALIDAR PIN
    // =====================================================

    validarPin(
        pin,
        idIgnorado = null
    ) {

        const pinLimpio =
            String(
                pin
                ||
                ""
            )
                .trim();


        if (
            !/^\d{4}$/.test(
                pinLimpio
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El PIN debe tener exactamente 4 números."

            };

        }


        const repetido =
            this.trabajadores
                .find(
                    trabajador => {

                        if (
                            String(
                                trabajador.pin
                                ||
                                ""
                            )
                            !==
                            pinLimpio
                        ) {

                            return false;

                        }


                        if (
                            idIgnorado !==
                            null
                            &&
                            mismoId(
                                trabajador.id,
                                idIgnorado
                            )
                        ) {

                            return false;

                        }


                        return true;

                    }
                );


        if (
            repetido
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "Este PIN ya está asignado a otro trabajador."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // VALIDAR DATOS
    // =====================================================

    validar(
        datos,
        idIgnorado = null
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
                    "Los datos del trabajador no son válidos."

            };

        }


        const nombre =
            String(
                datos.nombre
                ??
                ""
            )
                .trim();


        if (
            !nombre
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El nombre es obligatorio."

            };

        }


        const estado =
            String(
                datos.estado
                ??
                "Activo"
            )
                .trim();


        if (
            ![
                "Activo",
                "Inactivo"
            ].includes(
                estado
            )
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El estado del trabajador no es válido."

            };

        }


        return this.validarPin(
            datos.pin,
            idIgnorado
        );

    }


    // =====================================================
    // NORMALIZAR DATOS
    // =====================================================

    normalizarDatos(
        datos
    ) {

        return {

            nombre:
                String(
                    datos.nombre
                    ??
                    ""
                )
                    .trim(),

            apellidos:
                String(
                    datos.apellidos
                    ??
                    ""
                )
                    .trim(),

            telefono:
                String(
                    datos.telefono
                    ??
                    ""
                )
                    .trim(),

            email:
                String(
                    datos.email
                    ??
                    ""
                )
                    .trim(),

            puesto:
                String(
                    datos.puesto
                    ??
                    ""
                )
                    .trim(),

            estado:
                String(
                    datos.estado
                    ??
                    "Activo"
                )
                    .trim()
                ||
                "Activo",

            fechaAlta:
                String(
                    datos.fechaAlta
                    ??
                    ""
                )
                    .trim(),

            pin:
                String(
                    datos.pin
                    ??
                    ""
                )
                    .trim(),

            notas:
                String(
                    datos.notas
                    ??
                    ""
                )
                    .trim()

        };

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(
        datos
    ) {

        const validacion =
            this.validar(
                datos
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const nuevoTrabajador = {

            id:
                generarId(),

            ...this.normalizarDatos(
                datos
            )

        };


        this.trabajadores.push(
            nuevoTrabajador
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            this.trabajadores =
                this.trabajadores
                    .filter(
                        trabajador =>
                            !mismoId(
                                trabajador.id,
                                nuevoTrabajador.id
                            )
                    );


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido guardar el trabajador."

            };

        }


        return {

            ok:
                true,

            trabajador:
                nuevoTrabajador

        };

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar(
        id,
        datos
    ) {

        const trabajador =
            this.obtenerPorId(
                id
            );


        if (
            !trabajador
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajador no existe."

            };

        }


        const validacion =
            this.validar(
                datos,
                id
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    trabajador
                )
            );


        Object.assign(
            trabajador,
            this.normalizarDatos(
                datos
            )
        );


        const guardado =
            this.guardar();


        if (
            !guardado
        ) {

            Object.assign(
                trabajador,
                estadoAnterior
            );


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los cambios del trabajador."

            };

        }


        return {

            ok:
                true,

            trabajador:
                trabajador

        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(
        id
    ) {

        const trabajador =
            this.obtenerPorId(
                id
            );


        if (
            !trabajador
        ) {

            return {

                ok:
                    false,

                mensaje:
                    "El trabajador no existe."

            };

        }


        const dependencia =
            this.obtenerDependencia(
                id
            );


        if (
            dependencia
        ) {

            return {

                ok:
                    false,

                mensaje:
                    `No puedes eliminar este trabajador porque tiene ${dependencia}. Puedes marcarlo como inactivo para conservar el historial.`

            };

        }


        const trabajadoresAnteriores =
            [
                ...this.trabajadores
            ];


        this.trabajadores =
            this.trabajadores
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

            this.trabajadores =
                trabajadoresAnteriores;


            return {

                ok:
                    false,

                mensaje:
                    "No se ha podido eliminar el trabajador."

            };

        }


        return {

            ok:
                true

        };

    }


    // =====================================================
    // COMPROBAR DEPENDENCIAS
    // =====================================================

    obtenerDependencia(
        trabajadorId
    ) {

        const fichajes =
            StorageService
                .obtenerFichajes();


        if (
            fichajes.some(
                fichaje =>
                    mismoId(
                        fichaje.trabajadorId,
                        trabajadorId
                    )
            )
        ) {

            return "fichajes registrados";

        }


        const incidencias =
            StorageService
                .obtenerIncidencias();


        if (
            incidencias.some(
                incidencia =>
                    mismoId(
                        incidencia.trabajadorId,
                        trabajadorId
                    )
            )
        ) {

            return "incidencias asociadas";

        }


        const trabajos =
            StorageService
                .obtenerTrabajos();


        if (
            trabajos.some(
                trabajo =>
                    this.trabajoTieneTrabajador(
                        trabajo,
                        trabajadorId
                    )
            )
        ) {

            return "trabajos o tareas asociados";

        }


        const cuaderno =
            StorageService
                .obtenerCuadernoCampo();


        if (
            cuaderno.some(
                registro =>
                    Array.isArray(
                        registro.trabajadorIds
                    )
                    &&
                    registro.trabajadorIds
                        .some(
                            id =>
                                mismoId(
                                    id,
                                    trabajadorId
                                )
                        )
            )
        ) {

            return "registros en el cuaderno de campo";

        }


        const tratamientos =
            StorageService
                .obtenerTratamientos();


        if (
            tratamientos.some(
                tratamiento =>
                    mismoId(
                        tratamiento.trabajadorId,
                        trabajadorId
                    )
            )
        ) {

            return "tratamientos asociados";

        }


        const usuarios =
            StorageService
                .obtenerUsuarios();


        if (
            usuarios.some(
                usuario =>
                    mismoId(
                        usuario.trabajadorId,
                        trabajadorId
                    )
            )
        ) {

            return "un usuario de acceso vinculado";

        }


        return null;

    }


    // =====================================================
    // TRABAJO TIENE TRABAJADOR
    // =====================================================

    trabajoTieneTrabajador(
        trabajo,
        trabajadorId
    ) {

        if (
            !trabajo
        ) {

            return false;

        }


        if (
            mismoId(
                trabajo.trabajadorId,
                trabajadorId
            )
        ) {

            return true;

        }


        if (
            Array.isArray(
                trabajo.trabajadorIds
            )
            &&
            trabajo.trabajadorIds
                .some(
                    id =>
                        mismoId(
                            id,
                            trabajadorId
                        )
                )
        ) {

            return true;

        }


        return false;

    }


    // =====================================================
    // ACTIVOS
    // =====================================================

    obtenerActivos() {

        return this.trabajadores
            .filter(
                trabajador =>
                    trabajador.estado ===
                    "Activo"
            );

    }


    // =====================================================
    // NOMBRE COMPLETO
    // =====================================================

    obtenerNombreCompleto(
        trabajador
    ) {

        return obtenerNombreTrabajador(
            trabajador
        );

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        return StorageService
            .guardarTrabajadores(
                this.trabajadores
            );

    }

}