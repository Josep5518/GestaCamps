import { StorageService } from "./storage.js";

export class ExplotacionService {

    constructor() {

        this.datos =
            StorageService.obtenerExplotacion
                ? StorageService.obtenerExplotacion()
                : null;


        if (
            !this.datos ||
            typeof this.datos !== "object"
        ) {

            this.datos = {};

        }


        this.migrarDatos();

    }


    // =====================================================
    // MIGRACIÓN
    // =====================================================

    migrarDatos() {

        let cambios = false;


        if (
            this.datos.nombre === undefined &&
            this.datos.nombreExplotacion
        ) {

            this.datos.nombre =
                this.datos.nombreExplotacion;

            cambios = true;

        }


        if (
            this.datos.nombreExplotacion === undefined &&
            this.datos.nombre
        ) {

            this.datos.nombreExplotacion =
                this.datos.nombre;

            cambios = true;

        }


        if (
            this.datos.titular === undefined
        ) {

            this.datos.titular =
                this.datos.razonSocial
                ||
                this.datos.nombre
                ||
                "";

            cambios = true;

        }


        if (
            this.datos.razonSocial === undefined
        ) {

            this.datos.razonSocial =
                this.datos.titular
                ||
                "";

            cambios = true;

        }


        if (
            this.datos.nifCif === undefined
        ) {

            this.datos.nifCif =
                this.datos.nif
                ||
                this.datos.cif
                ||
                "";

            cambios = true;

        }


        if (
            this.datos.telefono === undefined
        ) {

            this.datos.telefono = "";

            cambios = true;

        }


        if (
            this.datos.email === undefined
        ) {

            this.datos.email = "";

            cambios = true;

        }


        if (
            this.datos.direccion === undefined
        ) {

            this.datos.direccion = "";

            cambios = true;

        }


        if (
            this.datos.localidad === undefined
        ) {

            this.datos.localidad = "";

            cambios = true;

        }


        if (
            this.datos.provincia === undefined
        ) {

            this.datos.provincia = "";

            cambios = true;

        }


        if (
            this.datos.codigoPostal === undefined
        ) {

            this.datos.codigoPostal = "";

            cambios = true;

        }


        if (
            this.datos.pais === undefined
        ) {

            this.datos.pais =
                "España";

            cambios = true;

        }


        if (
            this.datos.nombreUsuario === undefined
        ) {

            this.datos.nombreUsuario =
                "Josep";

            cambios = true;

        }


        if (
            this.datos.cargo === undefined
        ) {

            this.datos.cargo =
                "Administrador";

            cambios = true;

        }


        // ==========================================
        // NUEVA OPCIÓN DE DOCUMENTOS
        // ==========================================

        if (
            this.datos.mostrarMarcaGestaCamps === undefined
        ) {

            /*
             * Por defecto DESACTIVADA.
             */
            this.datos.mostrarMarcaGestaCamps =
                false;

            cambios = true;

        }


        if (
            cambios
        ) {

            this.guardar();

        }

    }


    // =====================================================
    // OBTENER
    // =====================================================

    obtener() {

        return this.datos;

    }


    obtenerDatos() {

        return this.datos;

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar(datos) {

        if (
            !datos.nombre &&
            !datos.nombreExplotacion
        ) {

            return {
                ok: false,
                mensaje:
                    "Introduce el nombre de la explotación."
            };

        }


        const nombre =
            datos.nombre
            ||
            datos.nombreExplotacion
            ||
            "";


        this.datos.nombre =
            nombre.trim();

        this.datos.nombreExplotacion =
            nombre.trim();


        this.datos.titular =
            (
                datos.titular
                ||
                datos.razonSocial
                ||
                ""
            ).trim();


        this.datos.razonSocial =
            this.datos.titular;


        this.datos.nifCif =
            (
                datos.nifCif
                ||
                ""
            ).trim();


        this.datos.telefono =
            (
                datos.telefono
                ||
                ""
            ).trim();


        this.datos.email =
            (
                datos.email
                ||
                ""
            ).trim();


        this.datos.direccion =
            (
                datos.direccion
                ||
                ""
            ).trim();


        this.datos.localidad =
            (
                datos.localidad
                ||
                ""
            ).trim();


        this.datos.provincia =
            (
                datos.provincia
                ||
                ""
            ).trim();


        this.datos.codigoPostal =
            (
                datos.codigoPostal
                ||
                ""
            ).trim();


        this.datos.pais =
            (
                datos.pais
                ||
                "España"
            ).trim();


        this.datos.nombreUsuario =
            (
                datos.nombreUsuario
                ||
                "Josep"
            ).trim();


        this.datos.cargo =
            (
                datos.cargo
                ||
                "Administrador"
            ).trim();


        this.datos.mostrarMarcaGestaCamps =
            datos.mostrarMarcaGestaCamps === true;


        this.guardar();


        return {
            ok: true,
            datos:
                this.datos
        };

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        if (
            StorageService.guardarExplotacion
        ) {

            StorageService
                .guardarExplotacion(
                    this.datos
                );

            return;

        }


        /*
         * Compatibilidad si tu StorageService
         * todavía no tiene esos métodos.
         */
        localStorage.setItem(
            "gestacamps_explotacion",
            JSON.stringify(
                this.datos
            )
        );

    }

}