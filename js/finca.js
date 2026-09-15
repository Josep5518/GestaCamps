import { StorageService } from "./storage.js";

export class FincaService {

    constructor() {

        this.fincas =
            StorageService.obtenerFincas();


        if (
            !Array.isArray(
                this.fincas
            )
        ) {

            this.fincas = [];

        }

    }


    obtenerTodas() {

        return this.fincas;

    }


    obtenerTodos() {

        return this.fincas;

    }


    obtenerPorId(id) {

        return (
            this.fincas.find(
                finca =>
                    Number(
                        finca.id
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


    crear(
        nombre,
        ubicacion,
        superficie,
        notas
    ) {

        const nuevaFinca = {

            id:
                Date.now(),

            nombre:
                nombre,

            ubicacion:
                ubicacion,

            superficie:
                Number(
                    superficie
                ),

            notas:
                notas,

            parcelas:
                []

        };


        this.fincas.push(
            nuevaFinca
        );


        this.guardar();


        return nuevaFinca;

    }


    // =====================================================
    // VÍNCULOS / TRAZABILIDAD
    // =====================================================

    obtenerVinculos(id) {

        const finca =
            this.obtenerPorId(
                id
            );


        if (
            !finca
        ) {

            return {
                campanias: 0,
                cultivos: 0,
                produccion: 0,
                trabajos: 0,
                gastos: 0,
                albaranes: 0,
                total: 0
            };

        }


        const campanias =
            this.obtenerStorageSeguro(
                "obtenerCampanias"
            );


        const cultivos =
            this.obtenerStorageSeguro(
                "obtenerCultivos"
            );


        const produccion =
            this.obtenerStorageSeguro(
                "obtenerProduccion"
            );


        const trabajos =
            this.obtenerStorageSeguro(
                "obtenerTrabajos"
            );


        const gastos =
            this.obtenerStorageSeguro(
                "obtenerGastos"
            );


        const albaranes =
            this.obtenerStorageSeguro(
                "obtenerAlbaranes"
            );


        const mismoId =
            valor =>
                Number(
                    valor
                )
                ===
                Number(
                    finca.id
                );


        const campaniasVinculadas =
            campanias.filter(
                campania =>
                    mismoId(
                        campania.fincaId
                    )
            ).length;


        const cultivosVinculados =
            cultivos.filter(
                cultivo =>
                    mismoId(
                        cultivo.fincaId
                    )
            ).length;


        const produccionVinculada =
            produccion.filter(
                registro =>
                    mismoId(
                        registro.fincaId
                    )
            ).length;


        const trabajosVinculados =
            trabajos.filter(
                trabajo =>
                    mismoId(
                        trabajo.fincaId
                    )
            ).length;


        const gastosVinculados =
            gastos.filter(
                gasto =>
                    mismoId(
                        gasto.fincaId
                    )
            ).length;


        let albaranesVinculados = 0;


        albaranes.forEach(
            albaran => {

                const lineas =
                    Array.isArray(
                        albaran.lineas
                    )
                    &&
                    albaran.lineas.length >
                    0

                        ? albaran.lineas

                        : [
                            albaran
                        ];


                if (
                    lineas.some(
                        linea =>
                            mismoId(
                                linea.fincaId
                            )
                    )
                ) {

                    albaranesVinculados++;

                }

            }
        );


        return {

            campanias:
                campaniasVinculadas,

            cultivos:
                cultivosVinculados,

            produccion:
                produccionVinculada,

            trabajos:
                trabajosVinculados,

            gastos:
                gastosVinculados,

            albaranes:
                albaranesVinculados,

            total:
                campaniasVinculadas
                +
                cultivosVinculados
                +
                produccionVinculada
                +
                trabajosVinculados
                +
                gastosVinculados
                +
                albaranesVinculados

        };

    }


    obtenerStorageSeguro(metodo) {

        try {

            if (
                typeof
                StorageService[metodo]
                !==
                "function"
            ) {

                return [];

            }


            const datos =
                StorageService[metodo]();


            return Array.isArray(
                datos
            )
                ? datos
                : [];

        }

        catch {

            return [];

        }

    }


    eliminar(id) {

        const finca =
            this.obtenerPorId(
                id
            );


        if (
            !finca
        ) {

            return {
                ok: false,
                mensaje:
                    "La finca no existe."
            };

        }


        const vinculos =
            this.obtenerVinculos(
                id
            );


        if (
            vinculos.total >
            0
        ) {

            const partes = [];


            if (
                vinculos.campanias >
                0
            ) {

                partes.push(
                    `${vinculos.campanias} campanya${
                        vinculos.campanias === 1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.cultivos >
                0
            ) {

                partes.push(
                    `${vinculos.cultivos} cultivo${
                        vinculos.cultivos === 1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.produccion >
                0
            ) {

                partes.push(
                    `${vinculos.produccion} registro${
                        vinculos.produccion === 1
                            ? ""
                            : "s"
                    } de producción`
                );

            }


            if (
                vinculos.trabajos >
                0
            ) {

                partes.push(
                    `${vinculos.trabajos} trabajo${
                        vinculos.trabajos === 1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.gastos >
                0
            ) {

                partes.push(
                    `${vinculos.gastos} gasto${
                        vinculos.gastos === 1
                            ? ""
                            : "s"
                    }`
                );

            }


            if (
                vinculos.albaranes >
                0
            ) {

                partes.push(
                    `${vinculos.albaranes} albarán${
                        vinculos.albaranes === 1
                            ? ""
                            : "es"
                    }`
                );

            }


            return {
                ok: false,

                mensaje:
                    `No puedes eliminar la finca "${finca.nombre}" porque tiene información vinculada: ${partes.join(
                        ", "
                    )}.`
            };

        }


        this.fincas =
            this.fincas.filter(
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

        StorageService.guardarFincas(
            this.fincas
        );

    }

}