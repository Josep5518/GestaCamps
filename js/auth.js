import { StorageService } from "./storage.js";

import {
    UsuarioService,
    ROLES_USUARIO
} from "./usuario.js";


// =====================================================
// GESTACAMPS
// AUTH SERVICE
// =====================================================


// =====================================================
// CONSTANTES
// =====================================================

const CLAVE_AUTH_LEGACY =
    "gestacamps_admin_auth";


const CLAVE_SESION =
    "gestacamps_admin_sesion";


const PIN_REGEX =
    /^\d{4,8}$/;


// =====================================================
// HELPERS INTERNOS
// =====================================================

function limpiarTexto(
    valor
) {

    return String(
        valor
        ??
        ""
    )
        .trim();

}


function crearError(
    mensaje
) {

    return {

        ok:
            false,

        mensaje:
            mensaje

    };

}


function crearExito(
    datos = {}
) {

    return {

        ok:
            true,

        ...datos

    };

}


// =====================================================
// AUTH SERVICE
// =====================================================

export class AuthService {

    constructor() {

        this.usuarioService =
            new UsuarioService();


        this.asegurarMigracionLegacy();

    }


    // =================================================
    // MIGRACIÓN DEL ACCESO ANTIGUO
    // =================================================

    asegurarMigracionLegacy() {

        const usuarios =
            this.usuarioService
                .obtenerTodos();


        if (
            usuarios.length >
            0
        ) {

            return crearExito(
                {
                    migrado:
                        false
                }
            );

        }


        const configuracionLegacy =
            StorageService.leer(
                CLAVE_AUTH_LEGACY,
                null
            );


        if (
            !configuracionLegacy
            ||
            !limpiarTexto(
                configuracionLegacy.usuario
            )
            ||
            !configuracionLegacy.pinHash
        ) {

            return crearExito(
                {
                    migrado:
                        false
                }
            );

        }


        const datosPerfil =
            StorageService
                .obtenerExplotacion();


        const resultado =
            this.usuarioService
                .asegurarAdministradorInicial(
                    configuracionLegacy,
                    datosPerfil
                );


        if (
            !resultado.ok
        ) {

            console.error(
                "No se ha podido migrar el acceso anterior:",
                resultado.mensaje
            );


            return resultado;

        }


        return crearExito(
            {
                migrado:
                    resultado.creado ===
                    true,

                usuario:
                    resultado.usuario
            }
        );

    }


    // =================================================
    // CONFIGURACIÓN
    // =================================================

    obtenerConfiguracion() {

        this.asegurarMigracionLegacy();


        const usuarioSesion =
            this.obtenerUsuarioActual();


        if (
            usuarioSesion
        ) {

            return usuarioSesion;

        }


        const administrador =
            this.usuarioService
                .obtenerTodos()
                .find(
                    usuario =>
                        usuario.rol ===
                        ROLES_USUARIO.ADMINISTRADOR
                        &&
                        usuario.activo !==
                        false
                );


        if (
            administrador
        ) {

            return administrador;

        }


        return StorageService.leer(
            CLAVE_AUTH_LEGACY,
            null
        );

    }


    // =================================================
    // ESTÁ CONFIGURADO
    // =================================================

    estaConfigurado() {

        this.asegurarMigracionLegacy();


        const usuarios =
            this.usuarioService
                .obtenerTodos();


        if (
            usuarios.some(
                usuario =>
                    usuario.activo !==
                    false
                    &&
                    limpiarTexto(
                        usuario.usuario
                    )
                    &&
                    usuario.pinHash
            )
        ) {

            return true;

        }


        const legacy =
            StorageService.leer(
                CLAVE_AUTH_LEGACY,
                null
            );


        return Boolean(
            legacy
            &&
            limpiarTexto(
                legacy.usuario
            )
            &&
            legacy.pinHash
        );

    }


    // =================================================
    // USUARIO SUGERIDO
    // =================================================

    obtenerUsuarioSugerido() {

        this.asegurarMigracionLegacy();


        const usuarios =
            this.usuarioService
                .obtenerTodos();


        const administrador =
            usuarios.find(
                usuario =>
                    usuario.rol ===
                    ROLES_USUARIO.ADMINISTRADOR
                    &&
                    usuario.activo !==
                    false
            );


        if (
            administrador
        ) {

            return limpiarTexto(
                administrador.usuario
            );

        }


        const explotacion =
            StorageService
                .obtenerExplotacion();


        return (
            limpiarTexto(
                explotacion
                    ?.nombreUsuario
            )
            ||
            "Josep"
        );

    }


    // =================================================
    // CREAR ACCESO INICIAL
    // =================================================

    async configurarAcceso(
        usuario,
        pin,
        repetirPin
    ) {

        if (
            this.estaConfigurado()
        ) {

            return crearError(
                "El acceso de Administración ya está configurado."
            );

        }


        const usuarioLimpio =
            limpiarTexto(
                usuario
            );


        const pinLimpio =
            limpiarTexto(
                pin
            );


        const repetirLimpio =
            limpiarTexto(
                repetirPin
            );


        const validacion =
            this.validarConfiguracionInicial(
                usuarioLimpio,
                pinLimpio,
                repetirLimpio
            );


        if (
            !validacion.ok
        ) {

            return validacion;

        }


        const explotacion =
            StorageService
                .obtenerExplotacion();


        const resultado =
            await this.usuarioService
                .crear(
                    {

                        nombre:
                            limpiarTexto(
                                explotacion
                                    ?.nombreUsuario
                            )
                            ||
                            usuarioLimpio,

                        apellidos:
                            "",

                        usuario:
                            usuarioLimpio,

                        pin:
                            pinLimpio,

                        repetirPin:
                            repetirLimpio,

                        rol:
                            ROLES_USUARIO.ADMINISTRADOR,

                        activo:
                            true,

                        trabajadorId:
                            null

                    }
                );


        if (
            !resultado.ok
        ) {

            return resultado;

        }


        this.crearSesion(
            resultado.usuario
        );


        return crearExito(
            {
                usuario:
                    resultado.usuario
            }
        );

    }


    // =================================================
    // INICIAR SESIÓN
    // =================================================

    async iniciarSesion(
        usuario,
        pin
    ) {

        this.asegurarMigracionLegacy();


        if (
            !this.estaConfigurado()
        ) {

            return crearError(
                "El acceso de Administración todavía no está configurado."
            );

        }


        const usuarioLimpio =
            limpiarTexto(
                usuario
            );


        const pinLimpio =
            limpiarTexto(
                pin
            );


        if (
            !usuarioLimpio
            ||
            !pinLimpio
        ) {

            return crearError(
                "Introduce usuario y PIN."
            );

        }


        const resultado =
            await this.usuarioService
                .autenticar(
                    usuarioLimpio,
                    pinLimpio
                );


        if (
            !resultado.ok
        ) {

            return resultado;

        }


        this.crearSesion(
            resultado.usuario
        );


        return crearExito(
            {
                usuario:
                    resultado.usuario
            }
        );

    }


    // =================================================
    // CAMBIAR CREDENCIALES
    // =================================================

    async cambiarCredenciales(
        usuarioNuevo,
        pinActual,
        pinNuevo = "",
        repetirPinNuevo = ""
    ) {

        const usuarioActual =
            this.obtenerUsuarioActual();


        if (
            !usuarioActual
        ) {

            return crearError(
                "No existe una sesión de usuario activa."
            );

        }


        const usuarioLimpio =
            limpiarTexto(
                usuarioNuevo
            );


        const pinActualLimpio =
            limpiarTexto(
                pinActual
            );


        const pinNuevoLimpio =
            limpiarTexto(
                pinNuevo
            );


        const repetirLimpio =
            limpiarTexto(
                repetirPinNuevo
            );


        const validacionBasica =
            this.validarCambioCredenciales(
                usuarioLimpio,
                pinActualLimpio
            );


        if (
            !validacionBasica.ok
        ) {

            return validacionBasica;

        }


        const pinActualCorrecto =
            await this.usuarioService
                .verificarPin(
                    pinActualLimpio,
                    usuarioActual.pinHash
                );


        if (
            !pinActualCorrecto
        ) {

            return crearError(
                "El PIN actual no es correcto."
            );

        }


        if (
            this.usuarioService
                .existeNombreUsuario(
                    usuarioLimpio,
                    usuarioActual.id
                )
        ) {

            return crearError(
                "Ya existe otro usuario con ese nombre."
            );

        }


        const quiereCambiarPin =
            Boolean(
                pinNuevoLimpio
                ||
                repetirLimpio
            );


        if (
            quiereCambiarPin
        ) {

            const validacionPin =
                this.validarNuevoPin(
                    pinActualLimpio,
                    pinNuevoLimpio,
                    repetirLimpio
                );


            if (
                !validacionPin.ok
            ) {

                return validacionPin;

            }

        }


        const resultado =
            await this.usuarioService
                .actualizar(
                    usuarioActual.id,
                    {

                        usuario:
                            usuarioLimpio,

                        pinNuevo:
                            quiereCambiarPin
                                ? pinNuevoLimpio
                                : "",

                        repetirPinNuevo:
                            quiereCambiarPin
                                ? repetirLimpio
                                : ""

                    }
                );


        if (
            !resultado.ok
        ) {

            return resultado;

        }


        this.crearSesion(
            resultado.usuario
        );


        return crearExito(
            {

                usuario:
                    resultado.usuario.usuario,

                usuarioDatos:
                    resultado.usuario,

                pinCambiado:
                    quiereCambiarPin

            }
        );

    }


    // =================================================
    // VALIDACIÓN CONFIGURACIÓN INICIAL
    // =================================================

    validarConfiguracionInicial(
        usuario,
        pin,
        repetirPin
    ) {

        if (
            !usuario
        ) {

            return crearError(
                "Introduce un nombre de usuario."
            );

        }


        if (
            !this.esPinValido(
                pin
            )
        ) {

            return crearError(
                "El PIN debe tener entre 4 y 8 números."
            );

        }


        if (
            pin !==
            repetirPin
        ) {

            return crearError(
                "Los dos PIN no coinciden."
            );

        }


        return crearExito();

    }


    // =================================================
    // VALIDACIÓN CAMBIO CREDENCIALES
    // =================================================

    validarCambioCredenciales(
        usuario,
        pinActual
    ) {

        if (
            !usuario
        ) {

            return crearError(
                "El nombre de usuario es obligatorio."
            );

        }


        if (
            !pinActual
        ) {

            return crearError(
                "Introduce tu PIN actual."
            );

        }


        return crearExito();

    }


    // =================================================
    // VALIDAR NUEVO PIN
    // =================================================

    validarNuevoPin(
        pinActual,
        pinNuevo,
        repetirPinNuevo
    ) {

        if (
            !this.esPinValido(
                pinNuevo
            )
        ) {

            return crearError(
                "El nuevo PIN debe tener entre 4 y 8 números."
            );

        }


        if (
            pinNuevo !==
            repetirPinNuevo
        ) {

            return crearError(
                "Los dos PIN nuevos no coinciden."
            );

        }


        if (
            pinNuevo ===
            pinActual
        ) {

            return crearError(
                "El nuevo PIN debe ser diferente del PIN actual."
            );

        }


        return crearExito();

    }


    // =================================================
    // VALIDAR FORMATO PIN
    // =================================================

    esPinValido(
        pin
    ) {

        return PIN_REGEX.test(
            limpiarTexto(
                pin
            )
        );

    }


    // =================================================
    // COMPARAR USUARIOS
    // =================================================

    compararUsuarios(
        usuarioA,
        usuarioB
    ) {

        return (
            limpiarTexto(
                usuarioA
            )
                .toLowerCase()
            ===
            limpiarTexto(
                usuarioB
            )
                .toLowerCase()
        );

    }


    // =================================================
    // GUARDAR CONFIGURACIÓN LEGACY
    // =================================================

    guardarConfiguracion(
        configuracion
    ) {

        StorageService.escribir(
            CLAVE_AUTH_LEGACY,
            configuracion
        );

    }


    // =================================================
    // CREAR SESIÓN
    // =================================================

    crearSesion(
        usuario
    ) {

        if (
            !usuario
        ) {

            return false;

        }


        const sesion = {

            usuarioId:
                usuario.id,

            usuario:
                limpiarTexto(
                    usuario.usuario
                ),

            nombre:
                limpiarTexto(
                    usuario.nombre
                ),

            apellidos:
                limpiarTexto(
                    usuario.apellidos
                ),

            rol:
                usuario.rol,

            fechaInicio:
                new Date()
                    .toISOString()

        };


        sessionStorage.setItem(
            CLAVE_SESION,
            JSON.stringify(
                sesion
            )
        );


        return true;

    }


    // =================================================
    // OBTENER SESIÓN
    // =================================================

    obtenerSesion() {

        const sesion =
            sessionStorage.getItem(
                CLAVE_SESION
            );


        if (
            !sesion
        ) {

            return null;

        }


        try {

            const datos =
                JSON.parse(
                    sesion
                );


            if (
                !datos
            ) {

                this.cerrarSesion();


                return null;

            }


            /*
             * SESIÓN NUEVA
             */

            if (
                datos.usuarioId !==
                undefined
                &&
                datos.usuarioId !==
                null
            ) {

                const usuario =
                    this.usuarioService
                        .obtenerPorId(
                            datos.usuarioId
                        );


                if (
                    !usuario
                    ||
                    usuario.activo ===
                    false
                ) {

                    this.cerrarSesion();


                    return null;

                }


                return {

                    usuarioId:
                        usuario.id,

                    usuario:
                        usuario.usuario,

                    nombre:
                        usuario.nombre,

                    apellidos:
                        usuario.apellidos,

                    rol:
                        usuario.rol,

                    fechaInicio:
                        datos.fechaInicio

                };

            }


            /*
             * SESIÓN LEGACY
             *
             * Si había una sesión abierta antes de migrar,
             * buscamos el usuario correspondiente y la
             * convertimos automáticamente.
             */

            if (
                limpiarTexto(
                    datos.usuario
                )
            ) {

                this.asegurarMigracionLegacy();


                const usuario =
                    this.usuarioService
                        .obtenerPorUsuario(
                            datos.usuario
                        );


                if (
                    usuario
                    &&
                    usuario.activo !==
                    false
                ) {

                    this.crearSesion(
                        usuario
                    );


                    return this.obtenerSesion();

                }

            }


            this.cerrarSesion();


            return null;

        }

        catch (
            error
        ) {

            console.error(
                "Error leyendo la sesión de Administración:",
                error
            );


            this.cerrarSesion();


            return null;

        }

    }


    // =================================================
    // USUARIO ACTUAL
    // =================================================

    obtenerUsuarioActual() {

        const sesion =
            this.obtenerSesion();


        if (
            !sesion
        ) {

            return null;

        }


        return this.usuarioService
            .obtenerPorId(
                sesion.usuarioId
            );

    }


    // =================================================
    // HAY SESIÓN ACTIVA
    // =================================================

    haySesionActiva() {

        return Boolean(
            this.obtenerSesion()
        );

    }


    // =================================================
    // CERRAR SESIÓN
    // =================================================

    cerrarSesion() {

        sessionStorage.removeItem(
            CLAVE_SESION
        );

    }


    // =================================================
    // PERMISOS
    // =================================================

    tienePermiso(
        modulo,
        accion = "ver"
    ) {

        const usuario =
            this.obtenerUsuarioActual();


        return this.usuarioService
            .tienePermiso(
                usuario,
                modulo,
                accion
            );

    }


    // =================================================
    // ROL ACTUAL
    // =================================================

    obtenerRolActual() {

        return (
            this.obtenerUsuarioActual()
                ?.rol
            ||
            null
        );

    }


    // =================================================
    // ES ADMINISTRADOR
    // =================================================

    esAdministrador() {

        return (
            this.obtenerRolActual()
            ===
            ROLES_USUARIO.ADMINISTRADOR
        );

    }


    // =================================================
    // VERIFICAR PIN
    // =================================================

    async verificarPin(
        pin,
        hashEsperado
    ) {

        return this.usuarioService
            .verificarPin(
                pin,
                hashEsperado
            );

    }


    // =================================================
    // HASH SHA-256
    // =================================================

    async generarHash(
        texto
    ) {

        return this.usuarioService
            .generarHash(
                texto
            );

    }

}