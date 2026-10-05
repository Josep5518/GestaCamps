/* =====================================================
   GESTACAMPS
   SERVICE WORKER
   FREEZE · FRUIT ATTRACTION
===================================================== */


// =====================================================
// VERSIÓN DE CACHÉ
// =====================================================

const CACHE_VERSION =
    "gestacamps-fruit-attraction-v1";


// =====================================================
// ARCHIVOS BASE
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
                    cache =>
                        cache.addAll(
                            APP_SHELL
                        )
                )

        );


        // Activa inmediatamente
        // la nueva versión

        self.skipWaiting();

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
                    keys =>
                        Promise.all(

                            keys
                                .filter(
                                    key =>
                                        key !==
                                        CACHE_VERSION
                                )
                                .map(
                                    key =>
                                        caches.delete(
                                            key
                                        )
                                )

                        )
                )

        );


        // Toma control de las páginas
        // abiertas inmediatamente

        self.clients.claim();

    }
);


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


        // Solo recursos del propio
        // dominio de GestaCamps

        if (
            url.origin !==
            self.location.origin
        ) {

            return;

        }


        // =================================================
        // NAVEGACIÓN
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
                        response => {

                            const copia =
                                response.clone();


                            caches
                                .open(
                                    CACHE_VERSION
                                )
                                .then(
                                    cache =>
                                        cache.put(
                                            "./index.html",
                                            copia
                                        )
                                );


                            return response;

                        }
                    )

                    .catch(
                        () =>
                            caches.match(
                                "./index.html"
                            )
                    )

            );


            return;

        }


        // =================================================
        // ARCHIVOS ESTÁTICOS
        // CACHE FIRST
        // =================================================

        event.respondWith(

            caches
                .match(
                    request
                )

                .then(
                    cached => {

                        if (
                            cached
                        ) {

                            return cached;

                        }


                        return fetch(
                            request
                        )

                            .then(
                                response => {

                                    if (
                                        !response
                                        ||
                                        response.status !==
                                        200
                                    ) {

                                        return response;

                                    }


                                    const copia =
                                        response.clone();


                                    caches
                                        .open(
                                            CACHE_VERSION
                                        )

                                        .then(
                                            cache =>
                                                cache.put(
                                                    request,
                                                    copia
                                                )
                                        );


                                    return response;

                                }
                            )

                            .catch(
                                error => {

                                    console.warn(
                                        "GestaCamps: recurso no disponible.",
                                        request.url,
                                        error
                                    );


                                    throw error;

                                }
                            );

                    }
                )

        );

    }
);