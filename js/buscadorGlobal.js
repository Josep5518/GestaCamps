import { StorageService } from "./storage.js";


export class BuscadorGlobalService {

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    obtenerConfiguracion() {

        return [

            {
                modulo: "Fincas",
                pagina: "fincas",
                icono: "🌾",
                obtener: () =>
                    StorageService.obtenerFincas()
            },

            {
                modulo: "Campanyas",
                pagina: "campanias",
                icono: "🗓️",
                obtener: () =>
                    StorageService.obtenerCampanias()
            },

            {
                modulo: "Cultivos",
                pagina: "cultivos",
                icono: "🌱",
                obtener: () =>
                    StorageService.obtenerCultivos()
            },

            {
                modulo: "Cuaderno de campo",
                pagina: "cuadernoCampo",
                icono: "📖",
                obtener: () =>
                    StorageService.obtenerCuadernoCampo()
            },

            {
                modulo: "Tratamientos",
                pagina: "tratamientos",
                icono: "🧪",
                obtener: () =>
                    StorageService.obtenerTratamientos()
            },

            {
                modulo: "Trabajos",
                pagina: "trabajos",
                icono: "👨‍🌾",
                obtener: () =>
                    StorageService.obtenerTrabajos()
            },

            {
                modulo: "Trabajadores",
                pagina: "trabajadores",
                icono: "👷",
                obtener: () =>
                    StorageService.obtenerTrabajadores()
            },

            {
                modulo: "Fichajes",
                pagina: "fichajes",
                icono: "⏱️",
                obtener: () =>
                    StorageService.obtenerFichajes()
            },

            {
                modulo: "Incidencias",
                pagina: "incidencias",
                icono: "⚠️",
                obtener: () =>
                    StorageService.obtenerIncidencias()
            },

            {
                modulo: "Maquinaria",
                pagina: "maquinaria",
                icono: "🚜",
                obtener: () =>
                    StorageService.obtenerMaquinaria()
            },

            {
                modulo: "Inventario",
                pagina: "inventario",
                icono: "📦",
                obtener: () =>
                    StorageService.obtenerInventario()
            },

            {
                modulo: "Producción",
                pagina: "produccion",
                icono: "🍎",
                obtener: () =>
                    StorageService.obtenerProduccion()
            },

            {
                modulo: "Clientes y Proveedores",
                pagina: "clientesProveedores",
                icono: "👥",
                obtener: () =>
                    StorageService
                        .obtenerClientesProveedores()
            },

            {
                modulo: "Albaranes",
                pagina: "albaranes",
                icono: "🧾",
                obtener: () =>
                    StorageService.obtenerAlbaranes()
            },

            {
                modulo: "Facturación",
                pagina: "facturacion",
                icono: "💶",
                obtener: () =>
                    StorageService.obtenerFacturas()
            },

            {
                modulo: "Cobros y pagos",
                pagina: "cobrosPagos",
                icono: "💳",
                obtener: () =>
                    StorageService.obtenerCobrosPagos()
            },

            {
                modulo: "Gastos",
                pagina: "gastos",
                icono: "💰",
                obtener: () =>
                    StorageService.obtenerGastos()
            }

        ];

    }


    // =====================================================
    // MÓDULOS
    // =====================================================

    obtenerModulos() {

        return this
            .obtenerConfiguracion()
            .map(
                configuracion =>
                    configuracion.modulo
            );

    }


    // =====================================================
    // BUSCAR
    // =====================================================

    buscar(
        texto,
        modulo = ""
    ) {

        const consulta =
            this.normalizarTexto(
                texto
            );


        if (
            consulta.length <
            2
        ) {

            return [];

        }


        const resultados =
            [];


        this
            .obtenerConfiguracion()
            .forEach(
                configuracion => {

                    if (
                        modulo
                        &&
                        configuracion.modulo !==
                        modulo
                    ) {

                        return;

                    }


                    let elementos =
                        [];


                    try {

                        elementos =
                            configuracion.obtener()
                            ||
                            [];

                    }

                    catch (
                        error
                    ) {

                        console.error(
                            `Error buscando en ${configuracion.modulo}:`,
                            error
                        );


                        elementos =
                            [];

                    }


                    if (
                        !Array.isArray(
                            elementos
                        )
                    ) {

                        return;

                    }


                    elementos.forEach(
                        elemento => {

                            const textoElemento =
                                this.obtenerTextoBusqueda(
                                    elemento
                                );


                            if (
                                !textoElemento.includes(
                                    consulta
                                )
                            ) {

                                return;

                            }


                            resultados.push(
                                {

                                    id:
                                        elemento.id
                                        ??
                                        null,

                                    modulo:
                                        configuracion.modulo,

                                    pagina:
                                        configuracion.pagina,

                                    icono:
                                        configuracion.icono,

                                    titulo:
                                        this.obtenerTitulo(
                                            elemento,
                                            configuracion.modulo
                                        ),

                                    subtitulo:
                                        this.obtenerSubtitulo(
                                            elemento,
                                            configuracion.modulo
                                        ),

                                    detalle:
                                        this.obtenerDetalle(
                                            elemento,
                                            configuracion.modulo
                                        ),

                                    elemento:
                                        elemento

                                }
                            );

                        }
                    );

                }
            );


        return resultados
            .sort(
                (
                    a,
                    b
                ) => {

                    const tituloA =
                        this.normalizarTexto(
                            a.titulo
                        );


                    const tituloB =
                        this.normalizarTexto(
                            b.titulo
                        );


                    const empiezaA =
                        tituloA.startsWith(
                            consulta
                        );


                    const empiezaB =
                        tituloB.startsWith(
                            consulta
                        );


                    if (
                        empiezaA
                        &&
                        !empiezaB
                    ) {

                        return -1;

                    }


                    if (
                        empiezaB
                        &&
                        !empiezaA
                    ) {

                        return 1;

                    }


                    return a.modulo
                        .localeCompare(
                            b.modulo,
                            "es"
                        );

                }
            );

    }


    // =====================================================
    // TEXTO BUSCABLE
    // =====================================================

    obtenerTextoBusqueda(
        elemento
    ) {

        const valores =
            [];


        const recorrer =
            valor => {

                if (
                    valor === null
                    ||
                    valor === undefined
                ) {

                    return;

                }


                if (
                    Array.isArray(
                        valor
                    )
                ) {

                    valor.forEach(
                        item =>
                            recorrer(
                                item
                            )
                    );


                    return;

                }


                if (
                    typeof valor ===
                    "object"
                ) {

                    Object.values(
                        valor
                    )
                        .forEach(
                            item =>
                                recorrer(
                                    item
                                )
                        );


                    return;

                }


                valores.push(
                    String(
                        valor
                    )
                );

            };


        recorrer(
            elemento
        );


        return this.normalizarTexto(
            valores.join(
                " "
            )
        );

    }


    // =====================================================
    // TÍTULO
    // =====================================================

    obtenerTitulo(
        elemento,
        modulo
    ) {

        if (
            modulo ===
            "Trabajadores"
        ) {

            return [
                elemento.nombre,
                elemento.apellidos
            ]
                .filter(Boolean)
                .join(" ")
                ||
                "Trabajador";

        }


        if (
            modulo ===
            "Clientes y Proveedores"
        ) {

            return (
                elemento.nombre
                ||
                elemento.razonSocial
                ||
                elemento.empresa
                ||
                "Cliente / Proveedor"
            );

        }


        if (
            modulo ===
            "Facturación"
        ) {

            return (
                elemento.numeroFactura
                ||
                elemento.numero
                ||
                elemento.codigo
                ||
                `Factura ${elemento.id || ""}`
            );

        }


        if (
            modulo ===
            "Albaranes"
        ) {

            return (
                elemento.numeroAlbaran
                ||
                elemento.numero
                ||
                elemento.codigo
                ||
                `Albarán ${elemento.id || ""}`
            );

        }


        if (
            modulo ===
            "Fichajes"
        ) {

            return (
                elemento.trabajadorNombre
                ||
                "Fichaje"
            );

        }


        if (
            modulo ===
            "Incidencias"
        ) {

            return (
                elemento.tipo
                ||
                "Incidencia"
            );

        }


        if (
            modulo ===
            "Cuaderno de campo"
        ) {

            return (
                elemento.tipoActuacion
                ||
                elemento.descripcion
                ||
                "Actuación agrícola"
            );

        }


        if (
            modulo ===
            "Tratamientos"
        ) {

            return (
                elemento.productoNombre
                ||
                elemento.plagaObjetivo
                ||
                "Tratamiento"
            );

        }


        if (
            modulo ===
            "Cobros y pagos"
        ) {

            return (
                elemento.concepto
                ||
                elemento.referencia
                ||
                elemento.tipo
                ||
                "Movimiento"
            );

        }


        return (
            elemento.titulo
            ||
            elemento.nombre
            ||
            elemento.concepto
            ||
            elemento.descripcion
            ||
            elemento.codigo
            ||
            `Registro ${elemento.id || ""}`
        );

    }


    // =====================================================
    // SUBTÍTULO
    // =====================================================

    obtenerSubtitulo(
        elemento,
        modulo
    ) {

        const partes =
            [];


        if (
            elemento.fincaNombre
        ) {

            partes.push(
                elemento.fincaNombre
            );

        }


        if (
            elemento.campaniaNombre
        ) {

            partes.push(
                elemento.campaniaNombre
            );

        }


        if (
            elemento.estado
        ) {

            partes.push(
                elemento.estado
            );

        }


        if (
            modulo ===
            "Cuaderno de campo"
            &&
            elemento.cultivoNombre
        ) {

            partes.push(
                elemento.cultivoNombre
            );

        }


        if (
            modulo ===
            "Tratamientos"
            &&
            elemento.cultivoNombre
        ) {

            partes.push(
                elemento.cultivoNombre
            );

        }


        if (
            modulo ===
            "Trabajadores"
            &&
            elemento.puesto
        ) {

            partes.push(
                elemento.puesto
            );

        }


        if (
            modulo ===
            "Clientes y Proveedores"
            &&
            elemento.tipo
        ) {

            partes.push(
                elemento.tipo
            );

        }


        if (
            modulo ===
            "Incidencias"
            &&
            elemento.prioridad
        ) {

            partes.push(
                `Prioridad ${elemento.prioridad}`
            );

        }


        if (
            modulo ===
            "Fichajes"
            &&
            elemento.tipo
        ) {

            partes.push(
                elemento.tipo
            );

        }


        return partes
            .filter(Boolean)
            .join(
                " · "
            );

    }


    // =====================================================
    // DETALLE
    // =====================================================

    obtenerDetalle(
        elemento,
        modulo
    ) {

        if (
            modulo ===
            "Incidencias"
        ) {

            return elemento.descripcion
                ||
                "";

        }


        if (
            modulo ===
            "Trabajos"
        ) {

            return elemento.notas
                ||
                "";

        }


        if (
            modulo ===
            "Cuaderno de campo"
        ) {

            return [
                elemento.fecha,
                elemento.descripcion,
                elemento.productoNombre
            ]
                .filter(Boolean)
                .join(" · ");

        }


        if (
            modulo ===
            "Tratamientos"
        ) {

            return [
                elemento.fecha,
                elemento.dosis,
                elemento.plagaObjetivo
            ]
                .filter(Boolean)
                .join(" · ");

        }


        if (
            modulo ===
            "Trabajadores"
        ) {

            return [
                elemento.telefono,
                elemento.email
            ]
                .filter(Boolean)
                .join(" · ");

        }


        if (
            modulo ===
            "Clientes y Proveedores"
        ) {

            return [
                elemento.telefono,
                elemento.email
            ]
                .filter(Boolean)
                .join(" · ");

        }


        if (
            modulo ===
            "Maquinaria"
        ) {

            return [
                elemento.marca,
                elemento.modelo,
                elemento.matricula
            ]
                .filter(Boolean)
                .join(" · ");

        }


        if (
            elemento.fecha
        ) {

            return elemento.fecha;

        }


        if (
            elemento.descripcion
        ) {

            return elemento.descripcion;

        }


        return "";

    }


    // =====================================================
    // NORMALIZAR
    // =====================================================

    normalizarTexto(
        valor
    ) {

        return String(
            valor
            ??
            ""
        )
            .toLowerCase()
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();

    }

}