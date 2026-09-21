export function crearProduccionStockHelper({
    albaranService,
    mismoId
}) {

    // =====================================================
    // CANTIDAD RESERVADA
    // =====================================================

    function obtenerCantidadReservada(
        produccionId
    ) {

        if (
            !albaranService
        ) {

            return 0;

        }


        if (
            typeof
            albaranService
                .obtenerCantidadReservada ===
            "function"
        ) {

            return Number(
                albaranService
                    .obtenerCantidadReservada(
                        produccionId
                    )
                ||
                0
            );

        }


        return calcularCantidadPorEstados(
            produccionId,
            [
                "Pendiente"
            ]
        );

    }


    // =====================================================
    // CANTIDAD ENTREGADA
    // =====================================================

    function obtenerCantidadEntregada(
        produccionId
    ) {

        if (
            !albaranService
        ) {

            return 0;

        }


        if (
            typeof
            albaranService
                .obtenerCantidadConsumida ===
            "function"
        ) {

            return Number(
                albaranService
                    .obtenerCantidadConsumida(
                        produccionId
                    )
                ||
                0
            );

        }


        return calcularCantidadPorEstados(
            produccionId,
            [
                "Entregado",
                "Facturado"
            ],
            true
        );

    }


    // =====================================================
    // TOTAL UTILIZADO
    // =====================================================

    function obtenerCantidadUtilizada(
        produccionId
    ) {

        return (
            obtenerCantidadReservada(
                produccionId
            )
            +
            obtenerCantidadEntregada(
                produccionId
            )
        );

    }


    // =====================================================
    // DISPONIBLE
    // =====================================================

    function obtenerCantidadDisponible(
        registro
    ) {

        const producido =
            Number(
                registro?.cantidad
                ||
                0
            );


        const ocupado =
            obtenerCantidadUtilizada(
                registro?.id
            );


        return Math.max(
            0,
            producido -
            ocupado
        );

    }


    // =====================================================
    // RESPALDO PARA VERSIONES ANTIGUAS
    // =====================================================

    function calcularCantidadPorEstados(
        produccionId,
        estados,
        incluirFacturado = false
    ) {

        const albaranes =
            obtenerAlbaranes();


        let total =
            0;


        albaranes.forEach(
            albaran => {

                let coincideEstado =
                    estados.includes(
                        albaran.estado
                    );


                if (
                    incluirFacturado
                    &&
                    albaran.facturado ===
                    true
                ) {

                    coincideEstado =
                        true;

                }


                if (
                    !coincideEstado
                ) {

                    return;

                }


                const lineas =
                    obtenerLineasAlbaran(
                        albaran
                    );


                lineas.forEach(
                    linea => {

                        if (
                            !mismoId(
                                linea.produccionId,
                                produccionId
                            )
                        ) {

                            return;

                        }


                        total +=
                            Number(
                                linea.cantidad
                                ||
                                0
                            );

                    }
                );

            }
        );


        return total;

    }


    // =====================================================
    // OBTENER ALBARANES
    // =====================================================

    function obtenerAlbaranes() {

        if (
            !albaranService
        ) {

            return [];

        }


        if (
            typeof
            albaranService
                .obtenerTodos ===
            "function"
        ) {

            const datos =
                albaranService
                    .obtenerTodos();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        if (
            typeof
            albaranService
                .obtenerTodas ===
            "function"
        ) {

            const datos =
                albaranService
                    .obtenerTodas();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }


        return [];

    }


    // =====================================================
    // LÍNEAS ALBARÁN
    // =====================================================

    function obtenerLineasAlbaran(
        albaran
    ) {

        if (
            Array.isArray(
                albaran?.lineas
            )
            &&
            albaran.lineas.length >
            0
        ) {

            return albaran.lineas;

        }


        if (
            albaran?.produccionId
        ) {

            return [
                {

                    produccionId:
                        albaran.produccionId,

                    cantidad:
                        albaran.cantidad,

                    unidad:
                        albaran.unidad

                }
            ];

        }


        return [];

    }


    // =====================================================
    // API PÚBLICA
    // =====================================================

    return {

        obtenerCantidadReservada,

        obtenerCantidadEntregada,

        obtenerCantidadUtilizada,

        obtenerCantidadDisponible,

        calcularCantidadPorEstados,

        obtenerAlbaranes,

        obtenerLineasAlbaran

    };

}