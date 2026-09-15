import { StorageService } from "./storage.js";

export class MaquinariaService {

    constructor() {

        this.maquinas =
            StorageService.obtenerMaquinaria();

    }


    obtenerTodas() {
        return this.maquinas;
    }


    obtenerPorId(id) {

        return this.maquinas.find(
            maquina => maquina.id === id
        );

    }


    obtenerActivas() {

        return this.maquinas.filter(
            maquina =>
                maquina.estado === "Activa"
        );

    }


    crear(datos) {

        if (!datos.nombre) {

            return {
                ok: false,
                mensaje: "El nombre de la máquina es obligatorio."
            };

        }


        const nuevaMaquina = {

            id: Date.now(),

            nombre:
                datos.nombre,

            tipo:
                datos.tipo || "",

            marca:
                datos.marca || "",

            modelo:
                datos.modelo || "",

            matricula:
                datos.matricula || "",

            estado:
                datos.estado || "Activa",

            horasUso:
                Number(datos.horasUso || 0),

            proximaRevision:
                datos.proximaRevision || "",

            notas:
                datos.notas || ""

        };


        this.maquinas.push(
            nuevaMaquina
        );


        this.guardar();


        return {
            ok: true,
            maquina: nuevaMaquina
        };

    }


    actualizar(id, datos) {

        const maquina =
            this.obtenerPorId(id);


        if (!maquina) {

            return {
                ok: false,
                mensaje: "La máquina no existe."
            };

        }


        maquina.nombre =
            datos.nombre;

        maquina.tipo =
            datos.tipo || "";

        maquina.marca =
            datos.marca || "";

        maquina.modelo =
            datos.modelo || "";

        maquina.matricula =
            datos.matricula || "";

        maquina.estado =
            datos.estado;

        maquina.horasUso =
            Number(datos.horasUso || 0);

        maquina.proximaRevision =
            datos.proximaRevision || "";

        maquina.notas =
            datos.notas || "";


        this.guardar();


        return {
            ok: true,
            maquina: maquina
        };

    }


    eliminar(id) {

        this.maquinas =
            this.maquinas.filter(
                maquina =>
                    maquina.id !== id
            );


        this.guardar();

    }


    obtenerNombreCompleto(maquina) {

        const partes = [
            maquina.nombre,
            maquina.marca,
            maquina.modelo
        ];

        return partes
            .filter(Boolean)
            .join(" · ");

    }


    guardar() {

        StorageService.guardarMaquinaria(
            this.maquinas
        );

    }

}