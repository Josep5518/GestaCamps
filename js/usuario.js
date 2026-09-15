import { StorageService } from "./storage.js";


// =====================================================
// GESTACAMPS
// USUARIO SERVICE
// =====================================================


// =====================================================
// ROLES
// =====================================================

export const ROLES_USUARIO = {

    ADMINISTRADOR:
        "administrador",

    ENCARGADO:
        "encargado",

    TRABAJADOR:
        "trabajador"

};


// =====================================================
// NOMBRES DE ROLES
// =====================================================

export const NOMBRES_ROL = {

    [ROLES_USUARIO.ADMINISTRADOR]:
        "Administrador",

    [ROLES_USUARIO.ENCARGADO]:
        "Encargado",

    [ROLES_USUARIO.TRABAJADOR]:
        "Trabajador"

};


// =====================================================
// MÓDULOS CON PERMISOS
// =====================================================

export const MODULOS_USUARIO = [

    "inicio",

    "buscador",

    "fincas",

    "campanias",

    "cultivos",

    "cuadernoCampo",

    "tratamientos",

    "trabajos",

    "trabajadores",

    "fichajes",

    "trabajadorPortal",

    "incidencias",

    "maquinaria",

    "inventario",

    "produccion",

    "clientesProveedores",

    "albaranes",

    "facturacion",

    "cobrosPagos",

    "gastos",

    "estadisticas",

    "historial",

    "perfil",

    "usuarios"

];


// =====================================================
// ACCIONES
// =====================================================

export const ACCIONES_PERMISO = [

    "ver",

    "crear",

    "editar",

    "eliminar"

];


// =====================================================
// VALIDACIÓN PIN
// =====================================================

const PIN_REGEX =
    /^\d{4,8}$/;


// =====================================================
// HELPERS
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
// USUARIO SERVICE
// =====================================================

export class UsuarioService {

    // =================================================
    // OBTENER TODOS
    // =================================================

    obtenerTodos() {

        const usuarios =
            StorageService
                .obtenerUsuarios();


        return Array.isArray(
            usuarios
        )
            ? usuarios
            : [];

    }


    // =================================================
    // OBTENER POR ID
    // =================================================

    obtenerPorId(
        id
    ) {

        return (
            this.obtenerTodos()
                .find(
                    usuario =>
                        String(
                            usuario.id
                        )
                        ===
                        String(
                            id
                        )
                )
            ||
            null
        );

    }


    // =================================================
    // OBTENER POR USUARIO
    // =================================================

    obtenerPorUsuario(
        nombreUsuario
    ) {

        const buscado =
            this.normalizarNombreUsuario(
                nombreUsuario
            );


        if (
            !buscado
        ) {

            return null;

        }


        return (
            this.obtenerTodos()
                .find(
                    usuario =>
                        this.normalizarNombreUsuario(
                            usuario.usuario
                        )
                        ===
                        buscado
                )
            ||
            null
        );

    }


    // =================================================
    // CREAR USUARIO
    // =================================================

    async crear(
        datos = {}
    ) {

        const nombre =
            limpiarTexto(
                datos.nombre
            );


        const apellidos =
            limpiarTexto(
                datos.apellidos
            );


        const nombreUsuario =
            limpiarTexto(
                datos.usuario
            );


        const pin =
            limpiarTexto(
                datos.pin
            );


        const repetirPin =
            limpiarTexto(
                datos.repetirPin
            );


        const rol =
            this.normalizarRol(
                datos.rol
            );


        if (
            !nombre
        ) {

            return crearError(
                "El nombre es obligatorio."
            );

        }


        if (
            !nombreUsuario
        ) {

            return crearError(
                "El nombre de usuario es obligatorio."
            );

        }


        if (
            !this.esRolValido(
                rol
            )
        ) {

            return crearError(
                "El rol seleccionado no es válido."
            );

        }


        if (
            this.existeNombreUsuario(
                nombreUsuario
            )
        ) {

            return crearError(
                "Ya existe un usuario con ese nombre."
            );

        }


        const validacionPin =
            this.validarPinNuevo(
                pin,
                repetirPin
            );


        if (
            !validacionPin.ok
        ) {

            return validacionPin;

        }


        const ahora =
            new Date()
                .toISOString();


        const nuevoUsuario = {

            id:
                StorageService
                    .generarId(),

            nombre:
                nombre,

            apellidos:
                apellidos,

            usuario:
                nombreUsuario,

            rol:
                rol,

            activo:
                datos.activo !==
                false,

            trabajadorId:
                datos.trabajadorId
                ??
                null,

            pinHash:
                await this.generarHash(
                    pin
                ),

            permisos:
                this.normalizarPermisos(
                    datos.permisos,
                    rol
                ),

            fechaCreacion:
                ahora,

            fechaModificacion:
                ahora

        };


        const usuarios = [
            ...this.obtenerTodos(),
            nuevoUsuario
        ];


        const guardado =
            StorageService
                .guardarUsuarios(
                    usuarios
                );


        if (
            !guardado
        ) {

            return crearError(
                "No se ha podido guardar el usuario."
            );

        }


        return crearExito(
            {

                usuario:
                    nuevoUsuario

            }
        );

    }


    // =================================================
    // ACTUALIZAR USUARIO
    // =================================================

    async actualizar(
        id,
        datos = {}
    ) {

        const usuarios =
            this.obtenerTodos();


        const indice =
            usuarios.findIndex(
                usuario =>
                    String(
                        usuario.id
                    )
                    ===
                    String(
                        id
                    )
            );


        if (
            indice ===
            -1
        ) {

            return crearError(
                "El usuario no existe."
            );

        }


        const actual =
            usuarios[
                indice
            ];


        const nombre =
            datos.nombre !==
            undefined
                ? limpiarTexto(
                    datos.nombre
                )
                : actual.nombre;


        const apellidos =
            datos.apellidos !==
            undefined
                ? limpiarTexto(
                    datos.apellidos
                )
                : actual.apellidos;


        const nombreUsuario =
            datos.usuario !==
            undefined
                ? limpiarTexto(
                    datos.usuario
                )
                : actual.usuario;


        const rol =
            datos.rol !==
            undefined
                ? this.normalizarRol(
                    datos.rol
                )
                : actual.rol;


        if (
            !nombre
        ) {

            return crearError(
                "El nombre es obligatorio."
            );

        }


        if (
            !nombreUsuario
        ) {

            return crearError(
                "El nombre de usuario es obligatorio."
            );

        }


        if (
            !this.esRolValido(
                rol
            )
        ) {

            return crearError(
                "El rol seleccionado no es válido."
            );

        }


        if (
            this.existeNombreUsuario(
                nombreUsuario,
                actual.id
            )
        ) {

            return crearError(
                "Ya existe otro usuario con ese nombre."
            );

        }


        const actualizado = {

            ...actual,

            nombre:
                nombre,

            apellidos:
                apellidos,

            usuario:
                nombreUsuario,

            rol:
                rol,

            activo:
                datos.activo !==
                undefined
                    ? Boolean(
                        datos.activo
                    )
                    : Boolean(
                        actual.activo
                    ),

            trabajadorId:
                datos.trabajadorId !==
                undefined
                    ? datos.trabajadorId
                    : actual.trabajadorId,

            permisos:
                datos.permisos !==
                undefined
                    ? this.normalizarPermisos(
                        datos.permisos,
                        rol
                    )
                    : this.normalizarPermisos(
                        actual.permisos,
                        rol
                    ),

            fechaModificacion:
                new Date()
                    .toISOString()

        };


        const pinNuevo =
            limpiarTexto(
                datos.pinNuevo
            );


        const repetirPinNuevo =
            limpiarTexto(
                datos.repetirPinNuevo
            );


        const quiereCambiarPin =
            Boolean(
                pinNuevo
                ||
                repetirPinNuevo
            );


        if (
            quiereCambiarPin
        ) {

            const validacionPin =
                this.validarPinNuevo(
                    pinNuevo,
                    repetirPinNuevo
                );


            if (
                !validacionPin.ok
            ) {

                return validacionPin;

            }


            actualizado.pinHash =
                await this.generarHash(
                    pinNuevo
                );

        }


        usuarios[
            indice
        ] =
            actualizado;


        const guardado =
            StorageService
                .guardarUsuarios(
                    usuarios
                );


        if (
            !guardado
        ) {

            return crearError(
                "No se ha podido actualizar el usuario."
            );

        }


        return crearExito(
            {

                usuario:
                    actualizado,

                pinCambiado:
                    quiereCambiarPin

            }
        );

    }


    // =================================================
    // CAMBIAR ESTADO
    // =================================================

    cambiarEstado(
        id,
        activo
    ) {

        const usuarios =
            this.obtenerTodos();


        const indice =
            usuarios.findIndex(
                usuario =>
                    String(
                        usuario.id
                    )
                    ===
                    String(
                        id
                    )
            );


        if (
            indice ===
            -1
        ) {

            return crearError(
                "El usuario no existe."
            );

        }


        const usuario =
            usuarios[
                indice
            ];


        const nuevoEstado =
            Boolean(
                activo
            );


        if (
            usuario.rol ===
            ROLES_USUARIO.ADMINISTRADOR
            &&
            usuario.activo
            &&
            !nuevoEstado
            &&
            this.esUltimoAdministradorActivo(
                usuario.id
            )
        ) {

            return crearError(
                "No puedes desactivar el último Administrador activo."
            );

        }


        usuarios[
            indice
        ] = {

            ...usuario,

            activo:
                nuevoEstado,

            fechaModificacion:
                new Date()
                    .toISOString()

        };


        const guardado =
            StorageService
                .guardarUsuarios(
                    usuarios
                );


        if (
            !guardado
        ) {

            return crearError(
                "No se ha podido actualizar el estado del usuario."
            );

        }


        return crearExito(
            {

                usuario:
                    usuarios[
                        indice
                    ]

            }
        );

    }


    // =================================================
    // ELIMINAR
    // =================================================

    eliminar(
        id
    ) {

        const usuario =
            this.obtenerPorId(
                id
            );


        if (
            !usuario
        ) {

            return crearError(
                "El usuario no existe."
            );

        }


        if (
            usuario.rol ===
            ROLES_USUARIO.ADMINISTRADOR
            &&
            usuario.activo
            &&
            this.esUltimoAdministradorActivo(
                usuario.id
            )
        ) {

            return crearError(
                "No puedes eliminar el último Administrador activo."
            );

        }


        const usuarios =
            this.obtenerTodos()
                .filter(
                    item =>
                        String(
                            item.id
                        )
                        !==
                        String(
                            id
                        )
                );


        const guardado =
            StorageService
                .guardarUsuarios(
                    usuarios
                );


        if (
            !guardado
        ) {

            return crearError(
                "No se ha podido eliminar el usuario."
            );

        }


        return crearExito();

    }


    // =================================================
    // AUTENTICAR
    // =================================================

    async autenticar(
        nombreUsuario,
        pin
    ) {

        const usuario =
            this.obtenerPorUsuario(
                nombreUsuario
            );


        if (
            !usuario
        ) {

            return crearError(
                "Usuario o PIN incorrectos."
            );

        }


        if (
            usuario.activo ===
            false
        ) {

            return crearError(
                "Este usuario está desactivado."
            );

        }


        const pinCorrecto =
            await this.verificarPin(
                pin,
                usuario.pinHash
            );


        if (
            !pinCorrecto
        ) {

            return crearError(
                "Usuario o PIN incorrectos."
            );

        }


        return crearExito(
            {

                usuario:
                    usuario

            }
        );

    }


    // =================================================
    // MIGRAR ADMINISTRADOR LEGACY
    // =================================================

    asegurarAdministradorInicial(
        configuracionLegacy,
        datosPerfil = {}
    ) {

        const usuarios =
            this.obtenerTodos();


        if (
            usuarios.length >
            0
        ) {

            return crearExito(
                {

                    creado:
                        false,

                    usuario:
                        usuarios[
                            0
                        ]

                }
            );

        }


        if (
            !configuracionLegacy
            ||
            !limpiarTexto(
                configuracionLegacy.usuario
            )
            ||
            !configuracionLegacy.pinHash
        ) {

            return crearError(
                "No existe una configuración anterior válida para migrar."
            );

        }


        const ahora =
            new Date()
                .toISOString();


        const administrador = {

            id:
                StorageService
                    .generarId(),

            nombre:
                limpiarTexto(
                    datosPerfil.nombreUsuario
                )
                ||
                limpiarTexto(
                    configuracionLegacy.usuario
                )
                ||
                "Administrador",

            apellidos:
                "",

            usuario:
                limpiarTexto(
                    configuracionLegacy.usuario
                ),

            rol:
                ROLES_USUARIO.ADMINISTRADOR,

            activo:
                true,

            trabajadorId:
                null,

            pinHash:
                configuracionLegacy.pinHash,

            permisos:
                this.crearPermisosRol(
                    ROLES_USUARIO.ADMINISTRADOR
                ),

            fechaCreacion:
                configuracionLegacy.fechaCreacion
                ||
                ahora,

            fechaModificacion:
                configuracionLegacy.fechaModificacion
                ||
                ahora,

            migradoDesdeLegacy:
                true

        };


        const guardado =
            StorageService
                .guardarUsuarios(
                    [
                        administrador
                    ]
                );


        if (
            !guardado
        ) {

            return crearError(
                "No se ha podido migrar el Administrador actual."
            );

        }


        return crearExito(
            {

                creado:
                    true,

                usuario:
                    administrador

            }
        );

    }


    // =================================================
    // COMPROBAR NOMBRE DE USUARIO
    // =================================================

    existeNombreUsuario(
        nombreUsuario,
        excluirId = null
    ) {

        const buscado =
            this.normalizarNombreUsuario(
                nombreUsuario
            );


        return this.obtenerTodos()
            .some(
                usuario => {

                    if (
                        excluirId !==
                        null
                        &&
                        String(
                            usuario.id
                        )
                        ===
                        String(
                            excluirId
                        )
                    ) {

                        return false;

                    }


                    return (
                        this.normalizarNombreUsuario(
                            usuario.usuario
                        )
                        ===
                        buscado
                    );

                }
            );

    }


    // =================================================
    // ÚLTIMO ADMINISTRADOR ACTIVO
    // =================================================

    esUltimoAdministradorActivo(
        id
    ) {

        const administradoresActivos =
            this.obtenerTodos()
                .filter(
                    usuario =>
                        usuario.rol ===
                        ROLES_USUARIO.ADMINISTRADOR
                        &&
                        usuario.activo !==
                        false
                );


        if (
            administradoresActivos.length !==
            1
        ) {

            return false;

        }


        return (
            String(
                administradoresActivos[
                    0
                ].id
            )
            ===
            String(
                id
            )
        );

    }


    // =================================================
    // PERMISOS POR ROL
    // =================================================

    crearPermisosRol(
        rol
    ) {

        const permisos =
            this.crearPermisosVacios();


        if (
            rol ===
            ROLES_USUARIO.ADMINISTRADOR
        ) {

            MODULOS_USUARIO
                .forEach(
                    modulo => {

                        permisos[
                            modulo
                        ] =
                            this.crearPermisoCompleto();

                    }
                );


            return permisos;

        }


        if (
            rol ===
            ROLES_USUARIO.ENCARGADO
        ) {

            const modulosGestion = [

                "inicio",

                "buscador",

                "fincas",

                "campanias",

                "cultivos",

                "cuadernoCampo",

                "tratamientos",

                "trabajos",

                "trabajadores",

                "fichajes",

                "incidencias",

                "maquinaria",

                "inventario",

                "produccion",

                "clientesProveedores",

                "albaranes"

            ];


            modulosGestion.forEach(
                modulo => {

                    permisos[
                        modulo
                    ] =
                        this.crearPermisoCompleto();

                }
            );


            const modulosConsulta = [

                "facturacion",

                "cobrosPagos",

                "gastos",

                "estadisticas",

                "historial",

                "perfil"

            ];


            modulosConsulta.forEach(
                modulo => {

                    permisos[
                        modulo
                    ].ver =
                        true;

                }
            );


            return permisos;

        }


        if (
            rol ===
            ROLES_USUARIO.TRABAJADOR
        ) {

            permisos.trabajadorPortal.ver =
                true;


            permisos.trabajos.ver =
                true;


            permisos.fichajes.ver =
                true;


            permisos.fichajes.crear =
                true;


            permisos.incidencias.ver =
                true;


            permisos.incidencias.crear =
                true;


            return permisos;

        }


        return permisos;

    }


    // =================================================
    // PERMISOS VACÍOS
    // =================================================

    crearPermisosVacios() {

        const permisos = {};


        MODULOS_USUARIO
            .forEach(
                modulo => {

                    permisos[
                        modulo
                    ] = {

                        ver:
                            false,

                        crear:
                            false,

                        editar:
                            false,

                        eliminar:
                            false

                    };

                }
            );


        return permisos;

    }


    // =================================================
    // PERMISO COMPLETO
    // =================================================

    crearPermisoCompleto() {

        return {

            ver:
                true,

            crear:
                true,

            editar:
                true,

            eliminar:
                true

        };

    }


    // =================================================
    // NORMALIZAR PERMISOS
    // =================================================

    normalizarPermisos(
        permisos,
        rol
    ) {

        const base =
            this.crearPermisosRol(
                rol
            );


        if (
            !permisos
            ||
            typeof permisos !==
            "object"
        ) {

            return base;

        }


        MODULOS_USUARIO
            .forEach(
                modulo => {

                    if (
                        !permisos[
                            modulo
                        ]
                        ||
                        typeof permisos[
                            modulo
                        ] !==
                        "object"
                    ) {

                        return;

                    }


                    ACCIONES_PERMISO
                        .forEach(
                            accion => {

                                if (
                                    permisos[
                                        modulo
                                    ][
                                        accion
                                    ]
                                    !==
                                    undefined
                                ) {

                                    base[
                                        modulo
                                    ][
                                        accion
                                    ] =
                                        Boolean(
                                            permisos[
                                                modulo
                                            ][
                                                accion
                                            ]
                                        );

                                }

                            }
                        );

                }
            );


        return base;

    }


    // =================================================
    // COMPROBAR PERMISO
    // =================================================

    tienePermiso(
        usuario,
        modulo,
        accion = "ver"
    ) {

        if (
            !usuario
            ||
            usuario.activo ===
            false
        ) {

            return false;

        }


        if (
            usuario.rol ===
            ROLES_USUARIO.ADMINISTRADOR
        ) {

            return true;

        }


        if (
            !MODULOS_USUARIO.includes(
                modulo
            )
            ||
            !ACCIONES_PERMISO.includes(
                accion
            )
        ) {

            return false;

        }


        return Boolean(
            usuario.permisos
            ?.[
                modulo
            ]
            ?.[
                accion
            ]
        );

    }


    // =================================================
    // NORMALIZAR USUARIO
    // =================================================

    normalizarNombreUsuario(
        valor
    ) {

        return limpiarTexto(
            valor
        )
            .toLowerCase();

    }


    // =================================================
    // NORMALIZAR ROL
    // =================================================

    normalizarRol(
        rol
    ) {

        return limpiarTexto(
            rol
        )
            .toLowerCase();

    }


    // =================================================
    // ROL VÁLIDO
    // =================================================

    esRolValido(
        rol
    ) {

        return Object
            .values(
                ROLES_USUARIO
            )
            .includes(
                rol
            );

    }


    // =================================================
    // NOMBRE DE ROL
    // =================================================

    obtenerNombreRol(
        rol
    ) {

        return (
            NOMBRES_ROL[
                rol
            ]
            ||
            "Usuario"
        );

    }


    // =================================================
    // VALIDAR PIN
    // =================================================

    validarPinNuevo(
        pin,
        repetirPin
    ) {

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
    // FORMATO PIN
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
    // VERIFICAR PIN
    // =================================================

    async verificarPin(
        pin,
        hashEsperado
    ) {

        if (
            !pin
            ||
            !hashEsperado
        ) {

            return false;

        }


        const hash =
            await this.generarHash(
                limpiarTexto(
                    pin
                )
            );


        return (
            hash ===
            hashEsperado
        );

    }


    // =================================================
    // HASH SHA-256
    // =================================================

    async generarHash(
        texto
    ) {

        const datos =
            new TextEncoder()
                .encode(
                    String(
                        texto
                    )
                );


        const hashBuffer =
            await crypto.subtle.digest(
                "SHA-256",
                datos
            );


        return Array
            .from(
                new Uint8Array(
                    hashBuffer
                )
            )
            .map(
                byte =>
                    byte
                        .toString(
                            16
                        )
                        .padStart(
                            2,
                            "0"
                        )
            )
            .join("");

    }

}