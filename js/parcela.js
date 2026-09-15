export class ParcelaService {

    constructor(fincaService) {
        this.fincaService = fincaService;
    }

    crear(fincaId, nombre, superficie, sigpac, notas) {

        const finca =
            this.fincaService.obtenerPorId(fincaId);

        if (!finca) {
            return {
                ok: false,
                mensaje: "La finca no existe."
            };
        }


        const superficieNueva =
            Number(superficie);


        const superficieUsada =
            finca.parcelas.reduce(
                (total, parcela) =>
                    total + Number(parcela.superficie),
                0
            );


        const superficieDisponible =
            Number(finca.superficie)
            - superficieUsada;


        if (superficieNueva > superficieDisponible) {

            return {
                ok: false,
                mensaje:
                    `No hay suficiente superficie disponible.\n\n` +
                    `Superficie de la finca: ${Number(finca.superficie).toFixed(2)} ha\n` +
                    `Superficie utilizada: ${superficieUsada.toFixed(2)} ha\n` +
                    `Superficie disponible: ${superficieDisponible.toFixed(2)} ha`
            };

        }


        const nuevaParcela = {

            id: Date.now(),

            nombre: nombre,

            superficie: superficieNueva,

            sigpac: sigpac,

            notas: notas,

            cultivo: null

        };


        finca.parcelas.push(nuevaParcela);

        this.fincaService.guardar();


        return {
            ok: true,
            parcela: nuevaParcela
        };

    }


    eliminar(fincaId, parcelaId) {

        const finca =
            this.fincaService.obtenerPorId(fincaId);

        if (!finca) {
            return;
        }


        finca.parcelas =
            finca.parcelas.filter(
                parcela =>
                    parcela.id !== parcelaId
            );


        this.fincaService.guardar();

    }


    obtenerPorId(fincaId, parcelaId) {

        const finca =
            this.fincaService.obtenerPorId(fincaId);

        if (!finca) {
            return null;
        }


        return finca.parcelas.find(
            parcela =>
                parcela.id === parcelaId
        );

    }

}