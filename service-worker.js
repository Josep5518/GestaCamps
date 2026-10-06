// =====================================================
// GESTACAMPS
// SERVICE WORKER
// Network First + fallback a caché
// =====================================================


// =====================================================
// VERSIÓN DE CACHÉ
// =====================================================

const CACHE_VERSION =
    "gestacamps-v3";


// =====================================================
// ARCHIVOS PRINCIPALES
// =====================================================

const APP_SHELL = [

    "./",

    "./index.html",

    "./css/style.css",

    "./js/app.js",

    "./manifest.json",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

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


        self.skipWaiting();

    }
);


// =====================================================
// ACTIVACIÓN
// BORRAR VERSIONES ANTIGUAS
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
                                        cacheName
                                            .startsWith(
                                                "gestacamps-"
                                            )
                                        &&
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


        self.clients.claim();

    }
);


// =====================================================
// GUARDAR EN CACHÉ
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
// INTERNET PRIMERO
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
// RECURSOS
// CSS / JS / IMÁGENES / ICONOS
// INTERNET PRIMERO
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


        event.respondWith(

            responderRecurso(
                request
            )

        );

    }
);


// =====================================================
// FORZAR NUEVA VERSIÓN
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