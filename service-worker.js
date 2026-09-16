// =====================================================
// GESTACAMPS
// SERVICE WORKER
// =====================================================

const CACHE_PREFIX =
    "gestacamps-";


const CACHE_NAME =
    "gestacamps-v10";


// =====================================================
// ARCHIVOS PRINCIPALES
// =====================================================

const ARCHIVOS_INICIALES = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/style.css",


    // =================================================
    // APP
    // =================================================

    "./js/app.js",

    "./js/services.js",

    "./js/views.js",

    "./js/utils.js",

    "./js/entityHelpers.js",


    // =================================================
    // SEGURIDAD / AUTENTICACIÓN
    // =================================================

    "./js/auth.js",

    "./js/loginView.js",

    "./js/seguridadView.js",

    "./js/usuario.js",

    "./js/usuariosView.js",


    // =================================================
    // SERVICES / MODELOS
    // =================================================

    "./js/storage.js",

    "./js/finca.js",

    "./js/parcela.js",

    "./js/campania.js",

    "./js/cultivo.js",

    "./js/cuadernoCampo.js",

    "./js/tratamiento.js",

    "./js/trabajo.js",

    "./js/trabajador.js",

    "./js/fichaje.js",

    "./js/incidencia.js",

    "./js/historial.js",

    "./js/buscadorGlobal.js",

    "./js/maquinaria.js",

    "./js/inventario.js",

    "./js/produccion.js",

    "./js/clienteProveedor.js",

    "./js/explotacion.js",

    "./js/albaran.js",

    "./js/factura.js",

    "./js/gasto.js",

    "./js/cobroPago.js",

    "./js/estadisticas.js",

    "./js/backup.js",


    // =================================================
    // VISTAS
    // =================================================

    "./js/inicioView.js",

    "./js/fincasView.js",

    "./js/campaniasView.js",

    "./js/cultivosView.js",

    "./js/cuadernoCampoView.js",

    "./js/tratamientosView.js",

    "./js/trabajosView.js",

    "./js/trabajadoresView.js",

    "./js/fichajesView.js",

    "./js/incidenciasView.js",

    "./js/historialView.js",

    "./js/buscadorGlobalView.js",

    "./js/trabajadorPortalView.js",

    "./js/maquinariaView.js",

    "./js/inventarioView.js",

    "./js/produccionView.js",

    "./js/clientesProveedoresView.js",

    "./js/albaranesView.js",

    "./js/facturacionView.js",

    "./js/gastosView.js",

    "./js/cobrosPagosView.js",

    "./js/estadisticasView.js",

    "./js/perfilView.js",


    // =================================================
    // ICONOS
    // =================================================

    "./icons/icon-192.png",

    "./icons/icon-512.png",

    "./icons/apple-touch-icon.png",

    "./icons/favicon-64.png"

];


// =====================================================
// INSTALACIÓN
// =====================================================

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    cache => {

                        return cache.addAll(
                            ARCHIVOS_INICIALES
                        );

                    }
                )
                .then(
                    () => {

                        return self.skipWaiting();

                    }
                )

        );

    }
);


// =====================================================
// ACTIVACIÓN
// =====================================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    nombresCache => {

                        return Promise.all(

                            nombresCache
                                .map(
                                    nombre => {

                                        const esCacheGestaCamps =
                                            nombre.startsWith(
                                                CACHE_PREFIX
                                            );


                                        const esCacheActual =
                                            nombre ===
                                            CACHE_NAME;


                                        if (
                                            esCacheGestaCamps
                                            &&
                                            !esCacheActual
                                        ) {

                                            return caches.delete(
                                                nombre
                                            );

                                        }


                                        return Promise.resolve();

                                    }
                                )

                        );

                    }
                )
                .then(
                    () => {

                        return self.clients.claim();

                    }
                )

        );

    }
);


// =====================================================
// PETICIONES
// =====================================================

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        if (
            request.method !==
            "GET"
        ) {

            return;

        }


        const url =
            new URL(
                request.url
            );


        if (
            url.origin !==
            self.location.origin
        ) {

            return;

        }


        // =================================================
        // NAVEGACIÓN HTML
        // NETWORK FIRST
        // =================================================

        if (
            request.mode ===
            "navigate"
        ) {

            event.respondWith(

                fetch(
                    request
                )
                    .then(
                        async respuesta => {

                            if (
                                respuesta
                                &&
                                respuesta.status ===
                                200
                            ) {

                                const copia =
                                    respuesta.clone();


                                const cache =
                                    await caches.open(
                                        CACHE_NAME
                                    );


                                await cache.put(
                                    request,
                                    copia
                                );

                            }


                            return respuesta;

                        }
                    )
                    .catch(
                        async () => {

                            const paginaExacta =
                                await caches.match(
                                    request
                                );


                            if (
                                paginaExacta
                            ) {

                                return paginaExacta;

                            }


                            const indexCacheado =
                                await caches.match(
                                    "./index.html"
                                );


                            if (
                                indexCacheado
                            ) {

                                return indexCacheado;

                            }


                            return caches.match(
                                "./"
                            );

                        }
                    )

            );


            return;

        }


        // =================================================
        // RESTO DE ARCHIVOS
        // NETWORK FIRST
        // =================================================

        event.respondWith(

            fetch(
                request
            )
                .then(
                    async respuesta => {

                        if (
                            !respuesta
                            ||
                            respuesta.status !==
                            200
                        ) {

                            return respuesta;

                        }


                        const copia =
                            respuesta.clone();


                        const cache =
                            await caches.open(
                                CACHE_NAME
                            );


                        await cache.put(
                            request,
                            copia
                        );


                        return respuesta;

                    }
                )
                .catch(
                    () => {

                        return caches.match(
                            request
                        );

                    }
                )

        );

    }
);


// =====================================================
// MENSAJES
// =====================================================

self.addEventListener(
    "message",
    event => {

        if (
            event.data
            &&
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }

    }
);