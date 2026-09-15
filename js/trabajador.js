import { StorageService } from "./storage.js";


export class TrabajadorService {

    constructor() {

        this.trabajadores =
            StorageService.obtenerTrabajadores()
                .map(
                    trabajador => ({
                        ...trabajador,
                        pin:
                            trabajador.pin || ""
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

    obtenerPorId(id) {

        return this.trabajadores.find(
            trabajador =>
                Number(trabajador.id) ===
                Number(id)
        );

    }


    // =====================================================
    // OBTENER POR PIN
    // =====================================================

    obtenerPorPin(pin) {

        const pinBuscado =
            String(pin || "").trim();


        return this.trabajadores.find(
            trabajador =>
                String(
                    trabajador.pin || ""
                ) === pinBuscado
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
            String(pin || "")
                .trim();


        if (
            !/^\d{4}$/.test(
                pinLimpio
            )
        ) {

            return {
                ok: false,
                mensaje:
                    "El PIN debe tener exactamente 4 números."
            };

        }


        const repetido =
            this.trabajadores.find(
                trabajador =>
                    String(
                        trabajador.pin || ""
                    ) === pinLimpio
                    &&
                    Number(
                        trabajador.id
                    ) !==
                    Number(
                        idIgnorado
                    )
            );


        if (
            repetido
        ) {

            return {
                ok: false,
                mensaje:
                    "Este PIN ya está asignado a otro trabajador."
            };

        }


        return {
            ok: true
        };

    }


    // =====================================================
    // CREAR
    // =====================================================

    crear(datos) {

        if (
            !datos.nombre
        ) {

            return {
                ok: false,
                mensaje:
                    "El nombre es obligatorio."
            };

        }


        const validacionPin =
            this.validarPin(
                datos.pin
            );


        if (
            !validacionPin.ok
        ) {

            return validacionPin;

        }


        const nuevoTrabajador = {

            id:
                Date.now(),

            nombre:
                datos.nombre,

            apellidos:
                datos.apellidos || "",

            telefono:
                datos.telefono || "",

            email:
                datos.email || "",

            puesto:
                datos.puesto || "",

            estado:
                datos.estado || "Activo",

            fechaAlta:
                datos.fechaAlta || "",

            pin:
                String(
                    datos.pin
                ),

            notas:
                datos.notas || ""

        };


        this.trabajadores.push(
            nuevoTrabajador
        );


        this.guardar();


        return {
            ok: true,
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
                ok: false,
                mensaje:
                    "El trabajador no existe."
            };

        }


        if (
            !datos.nombre
        ) {

            return {
                ok: false,
                mensaje:
                    "El nombre es obligatorio."
            };

        }


        const validacionPin =
            this.validarPin(
                datos.pin,
                id
            );


        if (
            !validacionPin.ok
        ) {

            return validacionPin;

        }


        trabajador.nombre =
            datos.nombre;

        trabajador.apellidos =
            datos.apellidos || "";

        trabajador.telefono =
            datos.telefono || "";

        trabajador.email =
            datos.email || "";

        trabajador.puesto =
            datos.puesto || "";

        trabajador.estado =
            datos.estado;

        trabajador.fechaAlta =
            datos.fechaAlta || "";

        trabajador.pin =
            String(
                datos.pin
            );

        trabajador.notas =
            datos.notas || "";


        this.guardar();


        return {
            ok: true,
            trabajador:
                trabajador
        };

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    eliminar(id) {

        const fichajes =
            StorageService.obtenerFichajes();


        const tieneFichajes =
            fichajes.some(
                fichaje =>
                    Number(
                        fichaje.trabajadorId
                    ) ===
                    Number(id)
            );


        if (
            tieneFichajes
        ) {

            return {
                ok: false,
                mensaje:
                    "No puedes eliminar este trabajador porque tiene fichajes registrados. Puedes marcarlo como inactivo para conservar el historial."
            };

        }


        this.trabajadores =
            this.trabajadores.filter(
                trabajador =>
                    Number(
                        trabajador.id
                    ) !==
                    Number(id)
            );


        this.guardar();


        return {
            ok: true
        };

    }


    // =====================================================
    // ACTIVOS
    // =====================================================

    obtenerActivos() {

        return this.trabajadores.filter(
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

        return [
            trabajador.nombre,
            trabajador.apellidos
        ]
            .filter(Boolean)
            .join(" ");

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        StorageService
            .guardarTrabajadores(
                this.trabajadores
            );

    }

}