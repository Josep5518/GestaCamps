/* =====================================================
   GESTACAMPS
   SERVICE WORKER
   FREEZE · FRUIT ATTRACTION
===================================================== */


// =====================================================
// VERSIÓN DE CACHÉ
// =====================================================

const CACHE_VERSION =
    "gestacamps-fruit-attraction-v2";


// =====================================================
// ARCHIVOS BASE
// =====================================================

const APP_SHELL = [

    "./",

    "./index.html",

    "./css/style.css",

    "./js/app.js",

    "./manifest.json",

    "./icons/favicon-64.png",

    "./icons/apple-touch-icon.png",

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
                    cache =>
                        cache.addAll(
                            APP_SHELL
                        )
                )

        );


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


        self.clients.claim();

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


        // =================================================
        // SOLO GET
        // =================================================

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


        // =================================================
        // SOLO MISMO DOMINIO
        // =================================================

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

                            if (
                                !response
                                ||
                                !response.ok
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
                            );

                    }
                )

        );

    }
);