import { StorageService } from "./storage.js";


export class ExplotacionService {

    constructor() {

        this.datos =
            typeof StorageService.obtenerExplotacion ===
            "function"

                ? StorageService.obtenerExplotacion()

                : null;


        if (
            !this.datos
            ||
            typeof this.datos !==
            "object"
            ||
            Array.isArray(
                this.datos
            )
        ) {

            this.datos =
                {};

        }


        this.migrarDatos();

    }


    // =====================================================
    // MIGRACIÓN
    // =====================================================

    migrarDatos() {

        let cambios =
            false;


        if (
            this.datos.nombre ===
            undefined
            &&
            this.datos.nombreExplotacion
        ) {

            this.datos.nombre =
                this.datos.nombreExplotacion;

            cambios =
                true;

        }


        if (
            this.datos.nombreExplotacion ===
            undefined
            &&
            this.datos.nombre
        ) {

            this.datos.nombreExplotacion =
                this.datos.nombre;

            cambios =
                true;

        }


        if (
            this.datos.titular ===
            undefined
        ) {

            this.datos.titular =
                this.datos.razonSocial
                ||
                this.datos.nombre
                ||
                "";

            cambios =
                true;

        }


        if (
            this.datos.razonSocial ===
            undefined
        ) {

            this.datos.razonSocial =
                this.datos.titular
                ||
                "";

            cambios =
                true;

        }


        if (
            this.datos.nifCif ===
            undefined
        ) {

            this.datos.nifCif =
                this.datos.nif
                ||
                this.datos.cif
                ||
                "";

            cambios =
                true;

        }


        if (
            this.datos.telefono ===
            undefined
        ) {

            this.datos.telefono =
                "";

            cambios =
                true;

        }


        if (
            this.datos.email ===
            undefined
        ) {

            this.datos.email =
                "";

            cambios =
                true;

        }


        if (
            this.datos.direccion ===
            undefined
        ) {

            this.datos.direccion =
                "";

            cambios =
                true;

        }


        if (
            this.datos.localidad ===
            undefined
        ) {

            this.datos.localidad =
                "";

            cambios =
                true;

        }


        if (
            this.datos.provincia ===
            undefined
        ) {

            this.datos.provincia =
                "";

            cambios =
                true;

        }


        if (
            this.datos.codigoPostal ===
            undefined
        ) {

            this.datos.codigoPostal =
                "";

            cambios =
                true;

        }


        if (
            this.datos.pais ===
            undefined
        ) {

            this.datos.pais =
                "España";

            cambios =
                true;

        }


        if (
            this.datos.nombreUsuario ===
            undefined
        ) {

            this.datos.nombreUsuario =
                "Josep";

            cambios =
                true;

        }


        if (
            this.datos.cargo ===
            undefined
        ) {

            this.datos.cargo =
                "Administrador";

            cambios =
                true;

        }


        if (
            this.datos.mostrarMarcaGestaCamps ===
            undefined
        ) {

            this.datos.mostrarMarcaGestaCamps =
                false;

            cambios =
                true;

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

    actualizar(
        datos
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
                    "Los datos de la explotación no son válidos."

            };

        }


        const nombre =
            String(
                datos.nombre
                ??
                datos.nombreExplotacion
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
                    "Introduce el nombre de la explotación."

            };

        }


        const estadoAnterior =
            JSON.parse(
                JSON.stringify(
                    this.datos
                )
            );


        this.datos.nombre =
            nombre;


        this.datos.nombreExplotacion =
            nombre;


        this.datos.titular =
            String(
                datos.titular
                ??
                datos.razonSocial
                ??
                ""
            )
                .trim();


        this.datos.razonSocial =
            this.datos.titular;


        this.datos.nifCif =
            String(
                datos.nifCif
                ??
                ""
            )
                .trim();


        this.datos.telefono =
            String(
                datos.telefono
                ??
                ""
            )
                .trim();


        this.datos.email =
            String(
                datos.email
                ??
                ""
            )
                .trim();


        this.datos.direccion =
            String(
                datos.direccion
                ??
                ""
            )
                .trim();


        this.datos.localidad =
            String(
                datos.localidad
                ??
                ""
            )
                .trim();


        this.datos.provincia =
            String(
                datos.provincia
                ??
                ""
            )
                .trim();


        this.datos.codigoPostal =
            String(
                datos.codigoPostal
                ??
                ""
            )
                .trim();


        this.datos.pais =
            String(
                datos.pais
                ??
                "España"
            )
                .trim()
            ||
            "España";


        this.datos.nombreUsuario =
            String(
                datos.nombreUsuario
                ??
                "Josep"
            )
                .trim()
            ||
            "Josep";


        this.datos.cargo =
            String(
                datos.cargo
                ??
                "Administrador"
            )
                .trim()
            ||
            "Administrador";


        this.datos.mostrarMarcaGestaCamps =
            datos.mostrarMarcaGestaCamps ===
            true;


        const guardado =
            this.guardar();


        if (
            guardado ===
            false
        ) {

            this.datos =
                estadoAnterior;


            return {

                ok:
                    false,

                mensaje:
                    "No se han podido guardar los datos de la explotación."

            };

        }


        return {

            ok:
                true,

            datos:
                this.datos

        };

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    guardar() {

        try {

            if (
                typeof StorageService.guardarExplotacion ===
                "function"
            ) {

                const resultado =
                    StorageService
                        .guardarExplotacion(
                            this.datos
                        );


                return resultado !==
                    false;

            }


            /*
             * Compatibilidad por si StorageService
             * todavía no dispone de estos métodos.
             */
            localStorage.setItem(
                "gestacamps_explotacion",
                JSON.stringify(
                    this.datos
                )
            );


            return true;

        }

        catch (
            error
        ) {

            console.error(
                "Error guardando los datos de explotación:",
                error
            );


            return false;

        }

    }

}