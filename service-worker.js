// =====================================================
// GESTACAMPS
// SERVICE WORKER
// Estrategia: Network First + fallback a caché
// =====================================================


// =====================================================
// VERSIÓN DE CACHÉ
// IMPORTANTE:
// Cada vez que hagas una publicación importante,
// cambia v2 por v3, v4, etc.
// =====================================================

const CACHE_VERSION =
    "gestacamps-v2";


// =====================================================
// ARCHIVOS PRINCIPALES DE LA APP
// =====================================================

const APP_SHELL = [

    "./",

    "./index.html",

    "./css/style.css",

    "./js/app.js",

    "./manifest.json",

    "./icons/icon-192.svg",

    "./icons/icon-512.svg"

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
                    CACHE_VERSION
                )
                .then(
                    cache => {

                        return cache.addAll(
                            APP_SHELL
                        );

                    }
                )

        );


        // Activa inmediatamente esta nueva versión
        self.skipWaiting();

    }
);


// =====================================================
// ACTIVACIÓN
// ELIMINA CACHÉS ANTIGUAS
// =====================================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    cacheName =>
                                        cacheName !==
                                        CACHE_VERSION
                                )
                                .map(
                                    cacheName =>
                                        caches.delete(
                                            cacheName
                                        )
                                )

                        );

                    }
                )

        );


        // Toma control de las pestañas abiertas
        self.clients.claim();

    }
);


// =====================================================
// GUARDAR RESPUESTA EN CACHÉ
// =====================================================

async function guardarEnCache(
    request,
    response
) {

    if (
        !response
        ||
        response.status !== 200
        ||
        response.type === "opaque"
    ) {

        return;

    }


    try {

        const cache =
            await caches.open(
                CACHE_VERSION
            );


        await cache.put(
            request,
            response.clone()
        );

    }

    catch (
        error
    ) {

        console.warn(
            "GestaCamps: no se pudo guardar en caché:",
            request.url,
            error
        );

    }

}


// =====================================================
// NAVEGACIÓN
// SIEMPRE INTENTA INTERNET PRIMERO
// =====================================================

async function responderNavegacion(
    request
) {

    try {

        const response =
            await fetch(
                request,
                {
                    cache:
                        "no-store"
                }
            );


        if (
            response
            &&
            response.status === 200
        ) {

            const cache =
                await caches.open(
                    CACHE_VERSION
                );


            await cache.put(
                "./index.html",
                response.clone()
            );

        }


        return response;

    }

    catch (
        error
    ) {

        const cachedIndex =
            await caches.match(
                "./index.html"
            );


        if (
            cachedIndex
        ) {

            return cachedIndex;

        }


        throw error;

    }

}


// =====================================================
// RECURSOS ESTÁTICOS
// CSS / JS / IMÁGENES / ICONOS
// NETWORK FIRST
// =====================================================

async function responderRecurso(
    request
) {

    try {

        const response =
            await fetch(
                request,
                {
                    cache:
                        "no-store"
                }
            );


        await guardarEnCache(
            request,
            response
        );


        return response;

    }

    catch (
        error
    ) {

        const cachedResponse =
            await caches.match(
                request
            );


        if (
            cachedResponse
        ) {

            return cachedResponse;

        }


        throw error;

    }

}


// =====================================================
// FETCH
// =====================================================

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        // Solo GET
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


        // Solo recursos de nuestro propio dominio
        if (
            url.origin !==
            self.location.origin
        ) {

            return;

        }


        // =================================================
        // NAVEGACIÓN
        // =================================================

        if (
            request.mode ===
            "navigate"
        ) {

            event.respondWith(

                responderNavegacion(
                    request
                )

            );


            return;

        }


        // =================================================
        // RECURSOS ESTÁTICOS
        // =================================================

        event.respondWith(

            responderRecurso(
                request
            )

        );

    }
);


// =====================================================
// MENSAJE OPCIONAL
// PERMITE FORZAR ACTIVACIÓN DESDE LA APP
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