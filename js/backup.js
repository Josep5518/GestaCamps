export class BackupService {

    constructor() {

        this.claveUltimaCopia =
            "gestacamps_meta_ultima_copia";

    }


    // =====================================================
    // CREAR COPIA
    // =====================================================

    crearCopia() {

        const datos =
            {};


        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            const clave =
                localStorage.key(
                    i
                );


            if (
                !clave
                ||
                !clave.startsWith(
                    "gestacamps_"
                )
            ) {

                continue;

            }


            if (
                clave ===
                this.claveUltimaCopia
            ) {

                continue;

            }


            const valor =
                localStorage.getItem(
                    clave
                );


            try {

                datos[clave] =
                    JSON.parse(
                        valor
                    );

            }

            catch (
                error
            ) {

                datos[clave] =
                    valor;

            }

        }


        const ahora =
            new Date();


        const explotacion =
            datos[
                "gestacamps_explotacion"
            ]
            ||
            {};


        return {

            app:
                "GestaCamps",

            version:
                1,

            fechaCopia:
                ahora.toISOString(),

            explotacion:
                explotacion.nombre
                ||
                explotacion.nombreExplotacion
                ||
                "GestaCamps",

            datos:
                datos

        };

    }


    // =====================================================
    // DESCARGAR
    // =====================================================

    descargarCopia() {

        const copia =
            this.crearCopia();


        const json =
            JSON.stringify(
                copia,
                null,
                4
            );


        const blob =
            new Blob(
                [
                    json
                ],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const enlace =
            document.createElement(
                "a"
            );


        enlace.href =
            url;


        enlace.download =
            this.generarNombreArchivo(
                copia
            );


        document.body.appendChild(
            enlace
        );


        enlace.click();


        enlace.remove();


        URL.revokeObjectURL(
            url
        );


        localStorage.setItem(
            this.claveUltimaCopia,
            copia.fechaCopia
        );


        return {
            ok:
                true,

            copia:
                copia
        };

    }


    // =====================================================
    // NOMBRE ARCHIVO
    // =====================================================

    generarNombreArchivo(
        copia
    ) {

        const fecha =
            new Date(
                copia.fechaCopia
            );


        const anio =
            fecha.getFullYear();


        const mes =
            String(
                fecha.getMonth()
                +
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


        const hora =
            String(
                fecha.getHours()
            )
                .padStart(
                    2,
                    "0"
                );


        const minuto =
            String(
                fecha.getMinutes()
            )
                .padStart(
                    2,
                    "0"
                );


        const nombre =
            this.limpiarNombre(
                copia.explotacion
                ||
                "GestaCamps"
            );


        return (
            `GestaCamps_${nombre}_${anio}-${mes}-${dia}_${hora}-${minuto}.json`
        );

    }


    limpiarNombre(
        nombre
    ) {

        return String(
            nombre
            ||
            "GestaCamps"
        )
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-zA-Z0-9_-]+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            )
            .replace(
                /^-|-$|_/g,
                ""
            )
            ||
            "GestaCamps";

    }


    // =====================================================
    // LEER ARCHIVO
    // =====================================================

    async leerArchivo(
        archivo
    ) {

        if (
            !archivo
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Selecciona un archivo de copia de seguridad."
            };

        }


        if (
            !archivo.name
                .toLowerCase()
                .endsWith(
                    ".json"
                )
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La copia debe ser un archivo JSON."
            };

        }


        try {

            const texto =
                await archivo.text();


            const copia =
                JSON.parse(
                    texto
                );


            const validacion =
                this.validarCopia(
                    copia
                );


            if (
                !validacion.ok
            ) {

                return validacion;

            }


            return {
                ok:
                    true,

                copia:
                    copia,

                resumen:
                    this.obtenerResumen(
                        copia
                    )
            };

        }

        catch (
            error
        ) {

            console.error(
                "Error leyendo copia de seguridad:",
                error
            );


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido leer la copia de seguridad."
            };

        }

    }


    // =====================================================
    // VALIDAR COPIA
    // =====================================================

    validarCopia(
        copia
    ) {

        if (
            !copia
            ||
            typeof copia !==
            "object"
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "El archivo no contiene una copia válida."
            };

        }


        if (
            copia.app !==
            "GestaCamps"
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "Este archivo no pertenece a GestaCamps."
            };

        }


        if (
            Number(
                copia.version
            )
            !==
            1
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La versión de esta copia de seguridad no es compatible."
            };

        }


        if (
            !copia.datos
            ||
            typeof copia.datos !==
            "object"
            ||
            Array.isArray(
                copia.datos
            )
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La copia no contiene datos válidos."
            };

        }


        const claves =
            Object.keys(
                copia.datos
            );


        const clavesInvalidas =
            claves.filter(
                clave =>
                    !clave.startsWith(
                        "gestacamps_"
                    )
            );


        if (
            clavesInvalidas.length >
            0
        ) {

            return {
                ok:
                    false,

                mensaje:
                    "La copia contiene datos no reconocidos por GestaCamps."
            };

        }


        return {
            ok:
                true
        };

    }


    // =====================================================
    // RESUMEN
    // =====================================================

    obtenerResumen(
        copia
    ) {

        const datos =
            copia.datos
            ||
            {};


        const contar =
            clave => {

                const valor =
                    datos[clave];


                return Array.isArray(
                    valor
                )
                    ? valor.length
                    : 0;

            };


        const explotacion =
            datos[
                "gestacamps_explotacion"
            ]
            ||
            {};


        return {

            fecha:
                copia.fechaCopia,

            explotacion:
                explotacion.nombre
                ||
                explotacion.nombreExplotacion
                ||
                copia.explotacion
                ||
                "—",

            fincas:
                contar(
                    "gestacamps_fincas"
                ),

            campanias:
                contar(
                    "gestacamps_campanias"
                ),

            cultivos:
                contar(
                    "gestacamps_cultivos"
                ),

            cuaderno:
                contar(
                    "gestacamps_cuaderno_campo"
                ),

            tratamientos:
                contar(
                    "gestacamps_tratamientos"
                ),

            trabajos:
                contar(
                    "gestacamps_trabajos"
                ),

            trabajadores:
                contar(
                    "gestacamps_trabajadores"
                ),

            fichajes:
                contar(
                    "gestacamps_fichajes"
                ),

            incidencias:
                contar(
                    "gestacamps_incidencias"
                ),

            maquinaria:
                contar(
                    "gestacamps_maquinaria"
                ),

            inventario:
                contar(
                    "gestacamps_inventario"
                ),

            produccion:
                contar(
                    "gestacamps_produccion"
                ),

            contactos:
                contar(
                    "gestacamps_clientes_proveedores"
                ),

            albaranes:
                contar(
                    "gestacamps_albaranes"
                ),

            facturas:
                contar(
                    "gestacamps_facturas"
                ),

            movimientos:
                contar(
                    "gestacamps_cobros_pagos"
                ),

            gastos:
                contar(
                    "gestacamps_gastos"
                ),

            historial:
                contar(
                    "gestacamps_historial"
                )

        };

    }


    // =====================================================
    // RESTAURAR
    // =====================================================

    restaurarCopia(
        copia
    ) {

        const validacion =
            this.validarCopia(
                copia
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        try {

            const clavesActuales =
                [];


            for (
                let i = 0;
                i < localStorage.length;
                i++
            ) {

                const clave =
                    localStorage.key(
                        i
                    );


                if (
                    clave
                    &&
                    clave.startsWith(
                        "gestacamps_"
                    )
                ) {

                    clavesActuales.push(
                        clave
                    );

                }

            }


            clavesActuales.forEach(
                clave =>
                    localStorage.removeItem(
                        clave
                    )
            );


            Object.entries(
                copia.datos
            )
                .forEach(
                    (
                        [
                            clave,
                            valor
                        ]
                    ) => {

                        if (
                            !clave.startsWith(
                                "gestacamps_"
                            )
                        ) {

                            return;

                        }


                        localStorage.setItem(
                            clave,
                            JSON.stringify(
                                valor
                            )
                        );

                    }
                );


            return {
                ok:
                    true
            };

        }

        catch (
            error
        ) {

            console.error(
                "Error restaurando copia:",
                error
            );


            return {
                ok:
                    false,

                mensaje:
                    "No se ha podido restaurar la copia de seguridad."
            };

        }

    }


    // =====================================================
    // BORRAR TODOS LOS DATOS
    // =====================================================

    borrarTodosLosDatos() {

        try {

            const claves =
                [];


            for (
                let i = 0;
                i < localStorage.length;
                i++
            ) {

                const clave =
                    localStorage.key(
                        i
                    );


                if (
                    clave
                    &&
                    clave.startsWith(
                        "gestacamps_"
                    )
                ) {

                    claves.push(
                        clave
                    );

                }

            }


            claves.forEach(
                clave =>
                    localStorage.removeItem(
                        clave
                    )
            );


            sessionStorage.removeItem(
                "gestacamps_trabajador_sesion"
            );


            return {
                ok:
                    true
            };

        }

        catch (
            error
        ) {

            console.error(
                "Error borrando datos:",
                error
            );


            return {
                ok:
                    false,

                mensaje:
                    "No se han podido borrar los datos."
            };

        }

    }


    // =====================================================
    // ÚLTIMA COPIA
    // =====================================================

    obtenerUltimaCopia() {

        return localStorage.getItem(
            this.claveUltimaCopia
        );

    }

}