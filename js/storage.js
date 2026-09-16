// =====================================================
// GESTACAMPS
// STORAGE SERVICE
// =====================================================


// =====================================================
// CLAVES DE ALMACENAMIENTO
// =====================================================

const CLAVES = {

    FINCAS:
        "gestacamps_fincas",

    CULTIVOS:
        "gestacamps_cultivos",

    CUADERNO_CAMPO:
        "gestacamps_cuaderno_campo",

    TRATAMIENTOS:
        "gestacamps_tratamientos",

    TRABAJOS:
        "gestacamps_trabajos",

    TRABAJADORES:
        "gestacamps_trabajadores",

    USUARIOS:
        "gestacamps_usuarios",

    FICHAJES:
        "gestacamps_fichajes",

    INCIDENCIAS:
        "gestacamps_incidencias",

    MAQUINARIA:
        "gestacamps_maquinaria",

    INVENTARIO:
        "gestacamps_inventario",

    PRODUCCION:
        "gestacamps_produccion",

    ALBARANES:
        "gestacamps_albaranes",

    FACTURAS:
        "gestacamps_facturas",

    GASTOS:
        "gestacamps_gastos",

    CLIENTES_PROVEEDORES:
        "gestacamps_clientes_proveedores",

    COBROS_PAGOS:
        "gestacamps_cobros_pagos",

    CAMPANIAS:
        "gestacamps_campanias",

    EXPLOTACION:
        "gestacamps_explotacion",

    HISTORIAL:
        "gestacamps_historial",

    SESION_TRABAJADOR:
        "gestacamps_trabajador_sesion",

    SESION_ADMIN:
        "gestacamps_admin_sesion"

};


// =====================================================
// LÍMITES
// =====================================================

const MAX_REGISTROS_HISTORIAL =
    5000;


// =====================================================
// NOMBRES DE ROLES
// =====================================================

const NOMBRES_ROL = {

    administrador:
        "Administrador",

    encargado:
        "Encargado",

    trabajador:
        "Trabajador"

};


// =====================================================
// CONFIGURACIÓN DE COLECCIONES
// =====================================================

const COLECCIONES = {

    fincas: {
        clave:
            CLAVES.FINCAS,

        modulo:
            "Fincas"
    },

    cultivos: {
        clave:
            CLAVES.CULTIVOS,

        modulo:
            "Cultivos"
    },

    cuadernoCampo: {
        clave:
            CLAVES.CUADERNO_CAMPO,

        modulo:
            "Cuaderno de campo"
    },

    tratamientos: {
        clave:
            CLAVES.TRATAMIENTOS,

        modulo:
            "Tratamientos"
    },

    trabajos: {
        clave:
            CLAVES.TRABAJOS,

        modulo:
            "Trabajos"
    },

    trabajadores: {
        clave:
            CLAVES.TRABAJADORES,

        modulo:
            "Trabajadores"
    },

    usuarios: {
        clave:
            CLAVES.USUARIOS,

        modulo:
            "Usuarios"
    },

    fichajes: {
        clave:
            CLAVES.FICHAJES,

        modulo:
            "Fichajes"
    },

    incidencias: {
        clave:
            CLAVES.INCIDENCIAS,

        modulo:
            "Incidencias"
    },

    maquinaria: {
        clave:
            CLAVES.MAQUINARIA,

        modulo:
            "Maquinaria"
    },

    inventario: {
        clave:
            CLAVES.INVENTARIO,

        modulo:
            "Inventario"
    },

    produccion: {
        clave:
            CLAVES.PRODUCCION,

        modulo:
            "Producción"
    },

    albaranes: {
        clave:
            CLAVES.ALBARANES,

        modulo:
            "Albaranes"
    },

    facturas: {
        clave:
            CLAVES.FACTURAS,

        modulo:
            "Facturación"
    },

    gastos: {
        clave:
            CLAVES.GASTOS,

        modulo:
            "Gastos"
    },

    clientesProveedores: {
        clave:
            CLAVES.CLIENTES_PROVEEDORES,

        modulo:
            "Clientes y Proveedores"
    },

    cobrosPagos: {
        clave:
            CLAVES.COBROS_PAGOS,

        modulo:
            "Cobros y pagos"
    },

    campanias: {
        clave:
            CLAVES.CAMPANIAS,

        modulo:
            "Campanyas"
    }

};


// =====================================================
// STORAGE SERVICE
// =====================================================

export class StorageService {

    // =================================================
    // LECTURA
    // =================================================

    static leer(
        clave,
        valorDefecto = []
    ) {

        try {

            const valor =
                localStorage.getItem(
                    clave
                );


            if (
                valor === null
            ) {

                return valorDefecto;

            }


            return JSON.parse(
                valor
            );

        }

        catch (
            error
        ) {

            console.error(
                `Error leyendo ${clave}:`,
                error
            );


            return valorDefecto;

        }

    }


    // =================================================
    // ESCRITURA
    // =================================================

    static escribir(
        clave,
        valor
    ) {

        try {

            localStorage.setItem(
                clave,
                JSON.stringify(
                    valor
                )
            );


            return true;

        }

        catch (
            error
        ) {

            console.error(
                `Error guardando ${clave}:`,
                error
            );


            return false;

        }

    }


    // =================================================
    // OBTENER COLECCIÓN
    // =================================================

    static obtenerColeccion(
        nombre
    ) {

        const configuracion =
            COLECCIONES[
                nombre
            ];


        if (
            !configuracion
        ) {

            console.error(
                `Colección desconocida: ${nombre}`
            );


            return [];

        }


        const datos =
            this.leer(
                configuracion.clave,
                []
            );


        if (
            !Array.isArray(
                datos
            )
        ) {

            console.error(
                `La colección ${nombre} no contiene un array válido.`
            );


            return [];

        }


        return datos;

    }


    // =================================================
    // GUARDAR COLECCIÓN
    // =================================================

    static guardarColeccion(
        nombre,
        datos
    ) {

        const configuracion =
            COLECCIONES[
                nombre
            ];


        if (
            !configuracion
        ) {

            console.error(
                `Colección desconocida: ${nombre}`
            );


            return false;

        }


        if (
            !Array.isArray(
                datos
            )
        ) {

            console.error(
                `No se puede guardar ${nombre}: los datos no son un array.`
            );


            return false;

        }


        return this.guardarColeccionConAuditoria(
            configuracion.clave,
            datos,
            configuracion.modulo
        );

    }


    // =================================================
    // GUARDAR CON AUDITORÍA
    // =================================================

    static guardarColeccionConAuditoria(
        clave,
        datosNuevos,
        modulo
    ) {

        const datosAnteriores =
            this.leer(
                clave,
                []
            );


        const guardado =
            this.escribir(
                clave,
                datosNuevos
            );


        if (
            !guardado
        ) {

            return false;

        }


        if (
            Array.isArray(
                datosAnteriores
            )
            &&
            Array.isArray(
                datosNuevos
            )
        ) {

            try {

                this.compararColeccion(
                    datosAnteriores,
                    datosNuevos,
                    modulo
                );

            }

            catch (
                error
            ) {

                console.error(
                    `Error generando auditoría de ${modulo}:`,
                    error
                );

            }

        }


        return true;

    }


    // =================================================
    // COMPARAR COLECCIONES
    // =================================================

    static compararColeccion(
        anteriores,
        nuevos,
        modulo
    ) {

        const mapaAnterior =
            this.crearMapaPorId(
                anteriores
            );


        const mapaNuevo =
            this.crearMapaPorId(
                nuevos
            );


        this.auditarCreaciones(
            mapaAnterior,
            mapaNuevo,
            modulo
        );


        this.auditarEliminaciones(
            mapaAnterior,
            mapaNuevo,
            modulo
        );


        this.auditarModificaciones(
            mapaAnterior,
            mapaNuevo,
            modulo
        );

    }


    // =================================================
    // CREAR MAPA POR ID
    // =================================================

    static crearMapaPorId(
        elementos
    ) {

        const mapa =
            new Map();


        elementos.forEach(
            elemento => {

                if (
                    !elemento
                    ||
                    elemento.id ===
                    undefined
                    ||
                    elemento.id ===
                    null
                ) {

                    return;

                }


                mapa.set(
                    String(
                        elemento.id
                    ),
                    elemento
                );

            }
        );


        return mapa;

    }


    // =================================================
    // AUDITAR CREACIONES
    // =================================================

    static auditarCreaciones(
        mapaAnterior,
        mapaNuevo,
        modulo
    ) {

        mapaNuevo.forEach(
            (
                item,
                id
            ) => {

                if (
                    mapaAnterior.has(
                        id
                    )
                ) {

                    return;

                }


                this.registrarAuditoria(
                    {

                        modulo:
                            modulo,

                        accion:
                            "Creación",

                        entidadId:
                            item.id,

                        referencia:
                            this.obtenerReferencia(
                                item
                            ),

                        cambios:
                            []

                    }
                );

            }
        );

    }


    // =================================================
    // AUDITAR ELIMINACIONES
    // =================================================

    static auditarEliminaciones(
        mapaAnterior,
        mapaNuevo,
        modulo
    ) {

        mapaAnterior.forEach(
            (
                item,
                id
            ) => {

                if (
                    mapaNuevo.has(
                        id
                    )
                ) {

                    return;

                }


                this.registrarAuditoria(
                    {

                        modulo:
                            modulo,

                        accion:
                            "Eliminación",

                        entidadId:
                            item.id,

                        referencia:
                            this.obtenerReferencia(
                                item
                            ),

                        cambios:
                            []

                    }
                );

            }
        );

    }


    // =================================================
    // AUDITAR MODIFICACIONES
    // =================================================

    static auditarModificaciones(
        mapaAnterior,
        mapaNuevo,
        modulo
    ) {

        mapaNuevo.forEach(
            (
                itemNuevo,
                id
            ) => {

                const itemAnterior =
                    mapaAnterior.get(
                        id
                    );


                if (
                    !itemAnterior
                ) {

                    return;

                }


                if (
                    this.sonIguales(
                        itemAnterior,
                        itemNuevo
                    )
                ) {

                    return;

                }


                const cambios =
                    this.obtenerCamposModificados(
                        itemAnterior,
                        itemNuevo
                    );


                this.registrarAuditoria(
                    {

                        modulo:
                            modulo,

                        accion:
                            this.detectarAccionEspecial(
                                modulo,
                                itemAnterior,
                                itemNuevo
                            ),

                        entidadId:
                            itemNuevo.id,

                        referencia:
                            this.obtenerReferencia(
                                itemNuevo
                            ),

                        cambios:
                            cambios

                    }
                );

            }
        );

    }


    // =================================================
    // COMPARACIÓN
    // =================================================

    static sonIguales(
        valorA,
        valorB
    ) {

        return (
            JSON.stringify(
                valorA
            )
            ===
            JSON.stringify(
                valorB
            )
        );

    }


    // =================================================
    // ACCIÓN ESPECIAL
    // =================================================

    static detectarAccionEspecial(
        modulo,
        anterior,
        nuevo
    ) {

        if (
            anterior.estado ===
            nuevo.estado
        ) {

            return "Modificación";

        }


        const modulosConEstado = [

            "Trabajos",

            "Incidencias",

            "Facturación",

            "Campanyas"

        ];


        if (
            modulosConEstado.includes(
                modulo
            )
        ) {

            return (
                `Estado: ${nuevo.estado}`
            );

        }


        return "Modificación";

    }


    // =================================================
    // CAMPOS MODIFICADOS
    // =================================================

    static obtenerCamposModificados(
        anterior,
        nuevo
    ) {

        const camposIgnorados = [

            "fechaModificacion",

            "updatedAt"

        ];


        return Object
            .keys(
                {
                    ...anterior,
                    ...nuevo
                }
            )
            .filter(
                campo => {

                    if (
                        camposIgnorados.includes(
                            campo
                        )
                    ) {

                        return false;

                    }


                    return (
                        !this.sonIguales(
                            anterior[
                                campo
                            ],
                            nuevo[
                                campo
                            ]
                        )
                    );

                }
            );

    }


    // =================================================
    // REFERENCIA LEGIBLE
    // =================================================

    static obtenerReferencia(
        item
    ) {

        if (
            !item
        ) {

            return "";

        }


        const propiedades = [

            "titulo",

            "nombre",

            "numero",

            "numeroFactura",

            "numeroAlbaran",

            "concepto",

            "productoNombre",

            "descripcion",

            "trabajadorNombre",

            "tipoActuacion"

        ];


        for (
            const propiedad
            of propiedades
        ) {

            if (
                item[
                    propiedad
                ]
            ) {

                return item[
                    propiedad
                ];

            }

        }


        return (
            `Registro ${item.id || ""}`
        );

    }


    // =================================================
    // USUARIO ACTUAL
    // =================================================

    static obtenerUsuarioActual() {

        try {

            /*
             * El portal trabajador tiene prioridad.
             *
             * Puede existir simultáneamente una sesión
             * administrativa abierta en el navegador.
             * Si el usuario está actuando desde el portal,
             * la auditoría debe atribuirse al trabajador.
             */

            const trabajadorId =
                sessionStorage.getItem(
                    CLAVES.SESION_TRABAJADOR
                );


            if (
                trabajadorId
            ) {

                const trabajador =
                    this.obtenerTrabajadores()
                        .find(
                            item =>
                                String(
                                    item.id
                                )
                                ===
                                String(
                                    trabajadorId
                                )
                        );


                if (
                    trabajador
                ) {

                    return {

                        tipo:
                            "Trabajador",

                        id:
                            trabajador.id,

                        nombre:
                            this.obtenerNombreCompleto(
                                trabajador
                            )
                            ||
                            "Trabajador"

                    };

                }

            }


            /*
             * SESIÓN DE ADMINISTRACIÓN / ENCARGADO
             */

            const sesionAdmin =
                sessionStorage.getItem(
                    CLAVES.SESION_ADMIN
                );


            if (
                sesionAdmin
            ) {

                try {

                    const sesion =
                        JSON.parse(
                            sesionAdmin
                        );


                    if (
                        sesion
                        &&
                        sesion.usuarioId !==
                        undefined
                        &&
                        sesion.usuarioId !==
                        null
                    ) {

                        const usuario =
                            this.obtenerUsuarios()
                                .find(
                                    item =>
                                        String(
                                            item.id
                                        )
                                        ===
                                        String(
                                            sesion.usuarioId
                                        )
                                );


                        if (
                            usuario
                            &&
                            usuario.activo !==
                            false
                        ) {

                            return {

                                tipo:
                                    this.obtenerNombreRol(
                                        usuario.rol
                                    ),

                                id:
                                    usuario.id,

                                nombre:
                                    this.obtenerNombreCompleto(
                                        usuario
                                    )
                                    ||
                                    usuario.usuario
                                    ||
                                    "Usuario"

                            };

                        }

                    }

                }

                catch (
                    error
                ) {

                    console.error(
                        "Error leyendo sesión administrativa para auditoría:",
                        error
                    );

                }

            }


            /*
             * COMPATIBILIDAD CON SISTEMA ANTIGUO
             */

            const explotacion =
                this.obtenerExplotacion();


            return {

                tipo:
                    "Administración",

                id:
                    null,

                nombre:
                    explotacion.nombreUsuario
                    ||
                    "Administración"

            };

        }

        catch (
            error
        ) {

            console.error(
                "Error obteniendo usuario actual:",
                error
            );


            return {

                tipo:
                    "Administración",

                id:
                    null,

                nombre:
                    "Administración"

            };

        }

    }


    // =================================================
    // NOMBRE DEL ROL
    // =================================================

    static obtenerNombreRol(
        rol
    ) {

        return (
            NOMBRES_ROL[
                String(
                    rol
                    ||
                    ""
                )
                    .toLowerCase()
            ]
            ||
            "Usuario"
        );

    }


    // =================================================
    // NOMBRE COMPLETO
    // =================================================

    static obtenerNombreCompleto(
        persona
    ) {

        if (
            !persona
        ) {

            return "";

        }


        return [

            persona.nombre,

            persona.apellidos

        ]
            .filter(
                Boolean
            )
            .join(
                " "
            );

    }


    // =================================================
    // REGISTRAR AUDITORÍA
    // =================================================

    static registrarAuditoria(
        datos
    ) {

        const historial =
            this.obtenerHistorial();


        const usuario =
            this.obtenerUsuarioActual();


        const ahora =
            new Date();


        const registro = {

            id:
                this.generarId(),

            modulo:
                datos.modulo
                ||
                "Sistema",

            accion:
                datos.accion
                ||
                "Modificación",

            entidadId:
                datos.entidadId
                ??
                null,

            referencia:
                datos.referencia
                ||
                "",

            cambios:
                Array.isArray(
                    datos.cambios
                )
                    ? datos.cambios
                    : [],

            usuarioTipo:
                usuario.tipo,

            usuarioId:
                usuario.id,

            usuarioNombre:
                usuario.nombre,

            fecha:
                this.obtenerFechaLocal(
                    ahora
                ),

            hora:
                this.obtenerHoraLocal(
                    ahora
                ),

            fechaHora:
                ahora.toISOString()

        };


        historial.push(
            registro
        );


        return this.guardarHistorial(
            historial
        );

    }


    // =================================================
    // GENERAR ID
    // =================================================

    static generarId() {

        return (
            Date.now()
            +
            Math.floor(
                Math.random()
                *
                1000
            )
        );

    }


    // =================================================
    // HISTORIAL
    // =================================================

    static obtenerHistorial() {

        const historial =
            this.leer(
                CLAVES.HISTORIAL,
                []
            );


        return Array.isArray(
            historial
        )
            ? historial
            : [];

    }


    static guardarHistorial(
        historial
    ) {

        if (
            !Array.isArray(
                historial
            )
        ) {

            console.error(
                "No se puede guardar el historial: los datos no son un array."
            );


            return false;

        }


        const historialLimitado =
            historial.length >
            MAX_REGISTROS_HISTORIAL
                ? historial.slice(
                    -MAX_REGISTROS_HISTORIAL
                )
                : historial;


        return this.escribir(
            CLAVES.HISTORIAL,
            historialLimitado
        );

    }


    // =================================================
    // FECHA LOCAL
    // =================================================

    static obtenerFechaLocal(
        fecha
    ) {

        const fechaValida =
            fecha instanceof Date
                ? fecha
                : new Date(
                    fecha
                );


        const anio =
            fechaValida.getFullYear();


        const mes =
            String(
                fechaValida.getMonth()
                +
                1
            )
                .padStart(
                    2,
                    "0"
                );


        const dia =
            String(
                fechaValida.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${anio}-${mes}-${dia}`
        );

    }


    // =================================================
    // HORA LOCAL
    // =================================================

    static obtenerHoraLocal(
        fecha
    ) {

        const fechaValida =
            fecha instanceof Date
                ? fecha
                : new Date(
                    fecha
                );


        return fechaValida
            .toLocaleTimeString(
                "es-ES",
                {

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit"

                }
            );

    }


    // =================================================
    // FINCAS
    // =================================================

    static obtenerFincas() {

        return this.obtenerColeccion(
            "fincas"
        );

    }


    static guardarFincas(
        fincas
    ) {

        return this.guardarColeccion(
            "fincas",
            fincas
        );

    }


    // =================================================
    // CULTIVOS
    // =================================================

    static obtenerCultivos() {

        return this.obtenerColeccion(
            "cultivos"
        );

    }


    static guardarCultivos(
        cultivos
    ) {

        return this.guardarColeccion(
            "cultivos",
            cultivos
        );

    }


    // =================================================
    // CUADERNO DE CAMPO
    // =================================================

    static obtenerCuadernoCampo() {

        return this.obtenerColeccion(
            "cuadernoCampo"
        );

    }


    static guardarCuadernoCampo(
        registros
    ) {

        return this.guardarColeccion(
            "cuadernoCampo",
            registros
        );

    }


    // =================================================
    // TRATAMIENTOS
    // =================================================

    static obtenerTratamientos() {

        return this.obtenerColeccion(
            "tratamientos"
        );

    }


    static guardarTratamientos(
        tratamientos
    ) {

        return this.guardarColeccion(
            "tratamientos",
            tratamientos
        );

    }


    // =================================================
    // TRABAJOS
    // =================================================

    static obtenerTrabajos() {

        return this.obtenerColeccion(
            "trabajos"
        );

    }


    static guardarTrabajos(
        trabajos
    ) {

        return this.guardarColeccion(
            "trabajos",
            trabajos
        );

    }


    // =================================================
    // TRABAJADORES
    // =================================================

    static obtenerTrabajadores() {

        return this.obtenerColeccion(
            "trabajadores"
        );

    }


    static guardarTrabajadores(
        trabajadores
    ) {

        return this.guardarColeccion(
            "trabajadores",
            trabajadores
        );

    }


    // =================================================
    // USUARIOS
    // =================================================

    static obtenerUsuarios() {

        return this.obtenerColeccion(
            "usuarios"
        );

    }


    static guardarUsuarios(
        usuarios
    ) {

        return this.guardarColeccion(
            "usuarios",
            usuarios
        );

    }


    // =================================================
    // FICHAJES
    // =================================================

    static obtenerFichajes() {

        return this.obtenerColeccion(
            "fichajes"
        );

    }


    static guardarFichajes(
        fichajes
    ) {

        return this.guardarColeccion(
            "fichajes",
            fichajes
        );

    }


    // =================================================
    // INCIDENCIAS
    // =================================================

    static obtenerIncidencias() {

        return this.obtenerColeccion(
            "incidencias"
        );

    }


    static guardarIncidencias(
        incidencias
    ) {

        return this.guardarColeccion(
            "incidencias",
            incidencias
        );

    }


    // =================================================
    // MAQUINARIA
    // =================================================

    static obtenerMaquinaria() {

        return this.obtenerColeccion(
            "maquinaria"
        );

    }


    static guardarMaquinaria(
        maquinaria
    ) {

        return this.guardarColeccion(
            "maquinaria",
            maquinaria
        );

    }


    // =================================================
    // INVENTARIO
    // =================================================

    static obtenerInventario() {

        return this.obtenerColeccion(
            "inventario"
        );

    }


    static guardarInventario(
        productos
    ) {

        return this.guardarColeccion(
            "inventario",
            productos
        );

    }


    // =================================================
    // PRODUCCIÓN
    // =================================================

    static obtenerProduccion() {

        return this.obtenerColeccion(
            "produccion"
        );

    }


    static guardarProduccion(
        registros
    ) {

        return this.guardarColeccion(
            "produccion",
            registros
        );

    }


    // =================================================
    // ALBARANES
    // =================================================

    static obtenerAlbaranes() {

        return this.obtenerColeccion(
            "albaranes"
        );

    }


    static guardarAlbaranes(
        albaranes
    ) {

        return this.guardarColeccion(
            "albaranes",
            albaranes
        );

    }


    // =================================================
    // FACTURAS
    // =================================================

    static obtenerFacturas() {

        return this.obtenerColeccion(
            "facturas"
        );

    }


    static guardarFacturas(
        facturas
    ) {

        return this.guardarColeccion(
            "facturas",
            facturas
        );

    }


    // =================================================
    // GASTOS
    // =================================================

    static obtenerGastos() {

        return this.obtenerColeccion(
            "gastos"
        );

    }


    static guardarGastos(
        gastos
    ) {

        return this.guardarColeccion(
            "gastos",
            gastos
        );

    }


    // =================================================
    // CLIENTES Y PROVEEDORES
    // =================================================

    static obtenerClientesProveedores() {

        return this.obtenerColeccion(
            "clientesProveedores"
        );

    }


    static guardarClientesProveedores(
        contactos
    ) {

        return this.guardarColeccion(
            "clientesProveedores",
            contactos
        );

    }


    // =================================================
    // COBROS Y PAGOS
    // =================================================

    static obtenerCobrosPagos() {

        return this.obtenerColeccion(
            "cobrosPagos"
        );

    }


    static guardarCobrosPagos(
        movimientos
    ) {

        return this.guardarColeccion(
            "cobrosPagos",
            movimientos
        );

    }


    // =================================================
    // CAMPANYAS
    // =================================================

    static obtenerCampanias() {

        return this.obtenerColeccion(
            "campanias"
        );

    }


    static guardarCampanias(
        campanias
    ) {

        return this.guardarColeccion(
            "campanias",
            campanias
        );

    }


    // =================================================
    // EXPLOTACIÓN
    // =================================================

    static obtenerExplotacion() {

        const datos =
            this.leer(
                CLAVES.EXPLOTACION,
                {

                    nombreExplotacion:
                        "",

                    titular:
                        "",

                    nif:
                        "",

                    telefono:
                        "",

                    email:
                        "",

                    direccion:
                        "",

                    localidad:
                        "",

                    provincia:
                        "",

                    codigoPostal:
                        "",

                    pais:
                        "España",

                    nombreUsuario:
                        "Josep",

                    cargoUsuario:
                        ""

                }
            );


        if (
            !datos
            ||
            typeof datos !==
            "object"
            ||
            Array.isArray(
                datos
            )
        ) {

            return {

                nombreExplotacion:
                    "",

                titular:
                    "",

                nif:
                    "",

                telefono:
                    "",

                email:
                    "",

                direccion:
                    "",

                localidad:
                    "",

                provincia:
                    "",

                codigoPostal:
                    "",

                pais:
                    "España",

                nombreUsuario:
                    "Josep",

                cargoUsuario:
                    ""

            };

        }


        return datos;

    }


    static guardarExplotacion(
        datos
    ) {

        if (
            !datos
            ||
            typeof datos !==
            "object"
            ||
            Array.isArray(
                datos
            )
        ) {

            console.error(
                "No se pueden guardar los datos de explotación."
            );


            return false;

        }


        const anterior =
            this.obtenerExplotacion();


        const guardado =
            this.escribir(
                CLAVES.EXPLOTACION,
                datos
            );


        if (
            !guardado
        ) {

            return false;

        }


        if (
            !this.sonIguales(
                anterior,
                datos
            )
        ) {

            try {

                this.registrarAuditoria(
                    {

                        modulo:
                            "Perfil y explotación",

                        accion:
                            "Modificación",

                        entidadId:
                            null,

                        referencia:
                            datos.nombre
                            ||
                            datos.nombreExplotacion
                            ||
                            "Datos de explotación",

                        cambios:
                            this.obtenerCamposModificados(
                                anterior,
                                datos
                            )

                    }
                );

            }

            catch (
                error
            ) {

                console.error(
                    "Error registrando auditoría de Perfil y explotación:",
                    error
                );

            }

        }


        return true;

    }

}