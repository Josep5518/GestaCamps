// =====================================================
// GESTACAMPS
// STORAGE SERVICE
// =====================================================


// =====================================================
// GESTACAMPS
// SUPABASE SYNC (ESPEJO EN LA NUBE)
// =====================================================
//
// La app sigue funcionando con localStorage.
// Este archivo solo copia cada colección a Supabase
// y trae los cambios de otros dispositivos.
//
// Si no hay internet o Supabase falla, GestaCamps
// sigue funcionando en local igual que antes.
// =====================================================


// =====================================================
// CONFIGURACIÓN
// =====================================================

const SUPABASE_URL =
    "https://gqlbnxnjzsaowwthrlsz.supabase.co";

const SUPABASE_CLAVE_PUBLICA =
    "sb_publishable_Kl2_v1Y_gNN1bnmuUOvSKw_QVqtULB9";

const SUPABASE_LIBRERIA =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const TABLA =
    "gc_colecciones";

const PREFIJO_DATOS =
    "gestacamps_";


// Claves que son de cada dispositivo y NO se comparten.
const CLAVES_EXCLUIDAS = [
    "gestacamps_trabajador_sesion",
    "gestacamps_admin_sesion",
    "gestacamps_modo_campo",
    "gestacamps_meta_ultima_copia"
];


// Claves internas de la sincronización.
const CLAVE_PENDIENTES =
    "gcsync_pendientes";

const CLAVE_VERSIONES =
    "gcsync_versiones";

const CLAVE_INICIADO =
    "gcsync_iniciado";

const CLAVE_DISPOSITIVO =
    "gcsync_dispositivo";

const CLAVE_RECARGAS =
    "gcsync_recargas";


const ESPERA_SUBIDA_MS =
    500;

const INTERVALO_REVISION_MS =
    15000;


// =====================================================
// ESTADO
// =====================================================

let cliente =
    null;

let sesionActiva =
    false;

let canal =
    null;

let temporizadorSubida =
    null;

let temporizadorRecarga =
    null;

let subiendo =
    false;

let bajando =
    false;

let estado =
    "local";

let mensajeError =
    "";

let iniciadoModulo =
    false;


// =====================================================
// UTILIDADES LOCALSTORAGE
// =====================================================

function leerJSON(
    clave,
    valorDefecto
) {

    try {

        const valor =
            localStorage.getItem(
                clave
            );

        return valor === null
            ? valorDefecto
            : JSON.parse(
                valor
            );

    }

    catch (
        error
    ) {

        return valorDefecto;

    }

}


function guardarJSON(
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

    }

    catch (
        error
    ) {

        console.error(
            "GestaCamps Sync: no se pudo guardar",
            clave,
            error
        );

    }

}


function esClaveSincronizable(
    clave
) {

    return Boolean(
        clave
        &&
        clave.startsWith(
            PREFIJO_DATOS
        )
        &&
        !CLAVES_EXCLUIDAS.includes(
            clave
        )
    );

}


function obtenerClavesLocales() {

    const claves =
        [];

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const clave =
            localStorage.key(
                i
            );

        if (
            esClaveSincronizable(
                clave
            )
        ) {

            claves.push(
                clave
            );

        }

    }

    return claves;

}


function obtenerDispositivo() {

    let id =
        localStorage.getItem(
            CLAVE_DISPOSITIVO
        );

    if (
        !id
    ) {

        id =
            "disp-"
            + Date.now().toString(36)
            + "-"
            + Math.random()
                .toString(36)
                .slice(2, 8);

        localStorage.setItem(
            CLAVE_DISPOSITIVO,
            id
        );

    }

    return id;

}


function obtenerPendientes() {

    return leerJSON(
        CLAVE_PENDIENTES,
        []
    );

}


function marcarPendiente(
    clave
) {

    const pendientes =
        obtenerPendientes();

    if (
        !pendientes.includes(
            clave
        )
    ) {

        pendientes.push(
            clave
        );

        guardarJSON(
            CLAVE_PENDIENTES,
            pendientes
        );

    }

}


function quitarPendiente(
    clave
) {

    guardarJSON(
        CLAVE_PENDIENTES,
        obtenerPendientes()
            .filter(
                item =>
                    item !== clave
            )
    );

}


function yaIniciado() {

    return localStorage.getItem(
        CLAVE_INICIADO
    ) === "1";

}


// =====================================================
// CONEXIÓN
// =====================================================

async function obtenerCliente() {

    if (
        cliente
    ) {

        return cliente;

    }

    const libreria =
        await import(
            SUPABASE_LIBRERIA
        );

    cliente =
        libreria.createClient(
            SUPABASE_URL,
            SUPABASE_CLAVE_PUBLICA
        );

    return cliente;

}


async function arrancarConexion() {

    try {

        const supabase =
            await obtenerCliente();

        const {
            data
        } =
            await supabase.auth
                .getSession();

        sesionActiva =
            Boolean(
                data?.session
            );

        if (
            !sesionActiva
        ) {

            cambiarEstado(
                "desconectado"
            );

            return;

        }

        await despuesDeEntrar();

    }

    catch (
        error
    ) {

        console.warn(
            "GestaCamps Sync: sin conexión, modo local.",
            error
        );

        cambiarEstado(
            "sin-conexion"
        );

    }

}


async function despuesDeEntrar() {

    if (
        !yaIniciado()
    ) {

        const filasRemotas =
            await contarRemoto();

        if (
            filasRemotas === 0
        ) {

            await subirTodo();

        }

        else {

            cambiarEstado(
                "elegir"
            );

            abrirPanel();

            return;

        }

    }

    await subirPendientes();

    await bajarCambios();

    suscribirTiempoReal();

    if (
        estado !== "error"
    ) {

        cambiarEstado(
            "sincronizado"
        );

    }

}


async function contarRemoto() {

    const {
        count,
        error
    } =
        await cliente
            .from(
                TABLA
            )
            .select(
                "clave",
                {
                    count: "exact",
                    head: true
                }
            );

    if (
        error
    ) {

        throw error;

    }

    return count || 0;

}


// =====================================================
// SUBIR
// =====================================================

function programarSubida() {

    clearTimeout(
        temporizadorSubida
    );

    temporizadorSubida =
        setTimeout(
            () => {

                subirPendientes();

            },
            ESPERA_SUBIDA_MS
        );

}


async function subirPendientes() {

    if (
        !cliente
        ||
        !sesionActiva
        ||
        !yaIniciado()
        ||
        subiendo
    ) {

        return;

    }

    const pendientes =
        obtenerPendientes();

    if (
        pendientes.length === 0
    ) {

        return;

    }

    subiendo =
        true;

    cambiarEstado(
        "sincronizando"
    );

    let huboError =
        false;

    for (
        const clave of pendientes
    ) {

        const textoLocal =
            localStorage.getItem(
                clave
            );

        if (
            textoLocal === null
        ) {

            quitarPendiente(
                clave
            );

            continue;

        }

        let datos;

        try {

            datos =
                JSON.parse(
                    textoLocal
                );

        }

        catch (
            error
        ) {

            quitarPendiente(
                clave
            );

            continue;

        }

        try {

            const {
                data,
                error
            } =
                await cliente
                    .from(
                        TABLA
                    )
                    .upsert(
                        {
                            clave,
                            datos,
                            updated_at:
                                new Date()
                                    .toISOString(),
                            updated_by:
                                obtenerDispositivo()
                        }
                    )
                    .select(
                        "clave,updated_at"
                    );

            if (
                error
            ) {

                throw error;

            }

            const versiones =
                leerJSON(
                    CLAVE_VERSIONES,
                    {}
                );

            versiones[clave] =
                data?.[0]?.updated_at
                || "";

            guardarJSON(
                CLAVE_VERSIONES,
                versiones
            );

            // Si mientras subía se volvió a guardar,
            // se deja pendiente para la siguiente vuelta.
            if (
                localStorage.getItem(
                    clave
                ) === textoLocal
            ) {

                quitarPendiente(
                    clave
                );

            }

        }

        catch (
            error
        ) {

            huboError =
                true;

            mensajeError =
                error?.message
                || "No se pudo subir.";

            console.warn(
                "GestaCamps Sync: error subiendo",
                clave,
                error
            );

        }

    }

    subiendo =
        false;

    if (
        huboError
    ) {

        cambiarEstado(
            navigator.onLine
                ? "error"
                : "sin-conexion"
        );

        return;

    }

    cambiarEstado(
        "sincronizado"
    );

    if (
        obtenerPendientes().length > 0
    ) {

        programarSubida();

    }

}


async function subirTodo() {

    obtenerClavesLocales()
        .forEach(
            marcarPendiente
        );

    localStorage.setItem(
        CLAVE_INICIADO,
        "1"
    );

    await subirPendientes();

}


// =====================================================
// BAJAR
// =====================================================

async function bajarCambios(
    forzarTodo = false
) {

    if (
        !cliente
        ||
        !sesionActiva
        ||
        bajando
    ) {

        return;

    }

    if (
        !forzarTodo
        &&
        !yaIniciado()
    ) {

        return;

    }

    bajando =
        true;

    try {

        const {
            data: filas,
            error
        } =
            await cliente
                .from(
                    TABLA
                )
                .select(
                    "clave,updated_at"
                );

        if (
            error
        ) {

            throw error;

        }

        const versiones =
            leerJSON(
                CLAVE_VERSIONES,
                {}
            );

        const pendientes =
            forzarTodo
                ? []
                : obtenerPendientes();

        const cambiadas =
            (filas || [])
                .filter(
                    fila =>
                        esClaveSincronizable(
                            fila.clave
                        )
                        &&
                        !pendientes.includes(
                            fila.clave
                        )
                        &&
                        (
                            forzarTodo
                            ||
                            versiones[fila.clave]
                            !== fila.updated_at
                        )
                )
                .map(
                    fila =>
                        fila.clave
                );

        if (
            cambiadas.length === 0
        ) {

            bajando =
                false;

            return;

        }

        const {
            data: completas,
            error: errorDatos
        } =
            await cliente
                .from(
                    TABLA
                )
                .select(
                    "clave,datos,updated_at"
                )
                .in(
                    "clave",
                    cambiadas
                );

        if (
            errorDatos
        ) {

            throw errorDatos;

        }

        let hayDatosNuevos =
            false;

        (completas || [])
            .forEach(
                fila => {

                    const textoNuevo =
                        JSON.stringify(
                            fila.datos
                        );

                    if (
                        localStorage.getItem(
                            fila.clave
                        ) !== textoNuevo
                    ) {

                        localStorage.setItem(
                            fila.clave,
                            textoNuevo
                        );

                        hayDatosNuevos =
                            true;

                    }

                    versiones[fila.clave] =
                        fila.updated_at;

                }
            );

        guardarJSON(
            CLAVE_VERSIONES,
            versiones
        );

        if (
            forzarTodo
        ) {

            guardarJSON(
                CLAVE_PENDIENTES,
                []
            );

        }

        bajando =
            false;

        if (
            hayDatosNuevos
        ) {

            pedirRecarga();

        }

    }

    catch (
        error
    ) {

        bajando =
            false;

        mensajeError =
            error?.message
            || "No se pudo descargar.";

        console.warn(
            "GestaCamps Sync: error bajando",
            error
        );

        cambiarEstado(
            navigator.onLine
                ? "error"
                : "sin-conexion"
        );

    }

}


// =====================================================
// TIEMPO REAL
// =====================================================

function suscribirTiempoReal() {

    if (
        canal
        ||
        !cliente
    ) {

        return;

    }

    canal =
        cliente
            .channel(
                "gc-colecciones"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: TABLA
                },
                cambio => {

                    if (
                        cambio?.new?.updated_by
                        === obtenerDispositivo()
                    ) {

                        return;

                    }

                    bajarCambios();

                }
            )
            .subscribe();

}


// =====================================================
// RECARGA SEGURA
// =====================================================
//
// Los servicios de GestaCamps cargan los datos al
// arrancar. Para que vean los datos nuevos hay que
// recargar la página. Solo se hace cuando no se
// está escribiendo en un formulario.
// =====================================================

function esMomentoSeguro() {

    const activo =
        document.activeElement;

    const escribiendo =
        activo
        &&
        (
            [
                "INPUT",
                "TEXTAREA",
                "SELECT"
            ].includes(
                activo.tagName
            )
            ||
            activo.isContentEditable
        );

    const dialogoAbierto =
        Boolean(
            document.querySelector(
                "dialog[open]"
            )
        );

    const panelAbierto =
        Boolean(
            document.getElementById(
                "gcsync-panel"
            )
        );

    return (
        !escribiendo
        &&
        !dialogoAbierto
        &&
        !panelAbierto
    );

}


function recargaPermitida() {

    // Protección contra recargas en bucle.
    let registro;

    try {

        registro =
            JSON.parse(
                sessionStorage.getItem(
                    CLAVE_RECARGAS
                )
                || "[]"
            );

    }

    catch (
        error
    ) {

        registro =
            [];

    }

    const ahora =
        Date.now();

    registro =
        registro.filter(
            momento =>
                ahora - momento < 20000
        );

    if (
        registro.length >= 3
    ) {

        return false;

    }

    registro.push(
        ahora
    );

    sessionStorage.setItem(
        CLAVE_RECARGAS,
        JSON.stringify(
            registro
        )
    );

    return true;

}


function pedirRecarga() {

    cambiarEstado(
        "datos-nuevos"
    );

    if (
        temporizadorRecarga
    ) {

        return;

    }

    temporizadorRecarga =
        setInterval(
            () => {

                if (
                    !esMomentoSeguro()
                ) {

                    return;

                }

                clearInterval(
                    temporizadorRecarga
                );

                temporizadorRecarga =
                    null;

                if (
                    recargaPermitida()
                ) {

                    window.location.reload();

                }

            },
            1200
        );

}


// =====================================================
// INTERFAZ: INDICADOR Y PANEL
// =====================================================

const TEXTOS_ESTADO = {

    "local": {
        texto: "",
        color: "#9aa59d"
    },

    "desconectado": {
        texto: "Conectar nube",
        color: "#9aa59d"
    },

    "elegir": {
        texto: "Elegir datos",
        color: "#d9a520"
    },

    "sincronizando": {
        texto: "",
        color: "#d9a520"
    },

    "sincronizado": {
        texto: "",
        color: "#2e9e5b"
    },

    "datos-nuevos": {
        texto: "Datos nuevos…",
        color: "#2e9e5b"
    },

    "sin-conexion": {
        texto: "Sin conexión",
        color: "#d9a520"
    },

    "error": {
        texto: "Error de nube",
        color: "#c0392b"
    }

};


function insertarEstilos() {

    if (
        document.getElementById(
            "gcsync-estilos"
        )
    ) {

        return;

    }

    const estilos =
        document.createElement(
            "style"
        );

    estilos.id =
        "gcsync-estilos";

    estilos.textContent = `
        #gcsync-indicador {
            position: fixed;
            right: 12px;
            bottom: calc(12px + env(safe-area-inset-bottom, 0px));
            z-index: 9000;
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 28px;
            padding: 6px 10px;
            border: 1px solid rgba(20, 60, 40, 0.14);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.94);
            color: #1f3d2b;
            font: 600 12px/1 system-ui, sans-serif;
            box-shadow: 0 4px 14px rgba(20, 60, 40, 0.12);
            cursor: pointer;
        }
        #gcsync-indicador .gcsync-punto {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex: none;
        }
        #gcsync-fondo {
            position: fixed;
            inset: 0;
            z-index: 9001;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding: 16px;
            background: rgba(15, 35, 25, 0.45);
        }
        @media (min-width: 640px) {
            #gcsync-fondo {
                align-items: center;
            }
        }
        #gcsync-panel {
            width: 100%;
            max-width: 380px;
            padding: 22px;
            border-radius: 20px;
            background: #fbfaf6;
            color: #1f3d2b;
            font: 400 14px/1.45 system-ui, sans-serif;
            box-shadow: 0 20px 50px rgba(15, 35, 25, 0.3);
        }
        #gcsync-panel h3 {
            margin: 0 0 6px;
            font-size: 18px;
        }
        #gcsync-panel p {
            margin: 0 0 14px;
            color: #55685c;
        }
        #gcsync-panel label {
            display: block;
            margin: 0 0 4px;
            font-weight: 600;
            font-size: 13px;
        }
        #gcsync-panel input {
            width: 100%;
            box-sizing: border-box;
            margin: 0 0 12px;
            padding: 12px;
            border: 1px solid #cfd8d1;
            border-radius: 12px;
            background: #fff;
            font-size: 16px;
        }
        #gcsync-panel button {
            width: 100%;
            margin: 0 0 8px;
            padding: 13px;
            border: 0;
            border-radius: 12px;
            background: #1f4d36;
            color: #fff;
            font: 600 15px/1 system-ui, sans-serif;
            cursor: pointer;
        }
        #gcsync-panel button.gcsync-secundario {
            background: #e7ece6;
            color: #1f3d2b;
        }
        #gcsync-panel button.gcsync-texto {
            background: transparent;
            color: #55685c;
            margin: 0;
        }
        #gcsync-panel .gcsync-aviso {
            color: #c0392b;
            font-weight: 600;
        }
    `;

    document.head.appendChild(
        estilos
    );

}


function pintarIndicador() {

    if (
        !document.body
    ) {

        return;

    }

    insertarEstilos();

    let indicador =
        document.getElementById(
            "gcsync-indicador"
        );

    if (
        !indicador
    ) {

        indicador =
            document.createElement(
                "button"
            );

        indicador.id =
            "gcsync-indicador";

        indicador.type =
            "button";

        indicador.addEventListener(
            "click",
            abrirPanel
        );

        document.body.appendChild(
            indicador
        );

    }

    const info =
        TEXTOS_ESTADO[estado]
        || TEXTOS_ESTADO.local;

    indicador.style.display =
        estado === "local"
            ? "none"
            : "flex";

    indicador.title =
        "Nube GestaCamps";

    indicador.innerHTML =
        `<span class="gcsync-punto" style="background:${info.color}"></span>`
        + (
            info.texto
                ? `<span>${info.texto}</span>`
                : ""
        );

}


function cambiarEstado(
    nuevoEstado
) {

    estado =
        nuevoEstado;

    pintarIndicador();

}


function cerrarPanel() {

    document
        .getElementById(
            "gcsync-fondo"
        )
        ?.remove();

}


function abrirPanel() {

    cerrarPanel();

    insertarEstilos();

    const fondo =
        document.createElement(
            "div"
        );

    fondo.id =
        "gcsync-fondo";

    const panel =
        document.createElement(
            "div"
        );

    panel.id =
        "gcsync-panel";

    fondo.appendChild(
        panel
    );

    fondo.addEventListener(
        "click",
        event => {

            if (
                event.target === fondo
            ) {

                cerrarPanel();

            }

        }
    );

    if (
        !sesionActiva
    ) {

        pintarPanelEntrada(
            panel
        );

    }

    else if (
        !yaIniciado()
    ) {

        pintarPanelEleccion(
            panel
        );

    }

    else {

        pintarPanelConectado(
            panel
        );

    }

    document.body.appendChild(
        fondo
    );

}


function pintarPanelEntrada(
    panel
) {

    panel.innerHTML = `
        <h3>Conectar con la nube</h3>
        <p>Entra con la cuenta de la explotación para compartir los datos entre dispositivos.</p>
        <form id="gcsync-form">
            <label for="gcsync-email">Email</label>
            <input id="gcsync-email" type="email" autocomplete="username" required>
            <label for="gcsync-clave">Contraseña</label>
            <input id="gcsync-clave" type="password" autocomplete="current-password" required>
            <p class="gcsync-aviso" id="gcsync-aviso"></p>
            <button type="submit">Conectar</button>
            <button type="button" class="gcsync-texto" id="gcsync-cerrar">Seguir solo en este dispositivo</button>
        </form>
    `;

    panel
        .querySelector(
            "#gcsync-cerrar"
        )
        .addEventListener(
            "click",
            cerrarPanel
        );

    panel
        .querySelector(
            "#gcsync-form"
        )
        .addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const aviso =
                    panel.querySelector(
                        "#gcsync-aviso"
                    );

                aviso.textContent =
                    "Conectando…";

                try {

                    const supabase =
                        await obtenerCliente();

                    const {
                        error
                    } =
                        await supabase.auth
                            .signInWithPassword(
                                {
                                    email:
                                        panel
                                            .querySelector(
                                                "#gcsync-email"
                                            )
                                            .value
                                            .trim(),
                                    password:
                                        panel
                                            .querySelector(
                                                "#gcsync-clave"
                                            )
                                            .value
                                }
                            );

                    if (
                        error
                    ) {

                        throw error;

                    }

                    sesionActiva =
                        true;

                    cerrarPanel();

                    await despuesDeEntrar();

                }

                catch (
                    error
                ) {

                    aviso.textContent =
                        error?.message
                            === "Invalid login credentials"
                            ? "Email o contraseña incorrectos."
                            : (
                                "No se pudo conectar: "
                                + (
                                    error?.message
                                    || "sin internet"
                                )
                            );

                }

            }
        );

}


function pintarPanelEleccion(
    panel
) {

    panel.innerHTML = `
        <h3>¿Qué datos mandan?</h3>
        <p>En la nube ya hay datos de GestaCamps. Elige qué hacer en este dispositivo. Solo se pregunta la primera vez.</p>
        <button type="button" id="gcsync-bajar">Descargar los datos de la nube</button>
        <button type="button" class="gcsync-secundario" id="gcsync-subir">Subir los datos de este dispositivo</button>
        <p class="gcsync-aviso" id="gcsync-aviso"></p>
        <button type="button" class="gcsync-texto" id="gcsync-cerrar">Decidir más tarde</button>
    `;

    panel
        .querySelector(
            "#gcsync-cerrar"
        )
        .addEventListener(
            "click",
            cerrarPanel
        );

    panel
        .querySelector(
            "#gcsync-bajar"
        )
        .addEventListener(
            "click",
            async () => {

                if (
                    !window.confirm(
                        "Los datos de este dispositivo se sustituirán por los de la nube. ¿Continuar?"
                    )
                ) {

                    return;

                }

                localStorage.setItem(
                    CLAVE_INICIADO,
                    "1"
                );

                cerrarPanel();

                await bajarCambios(
                    true
                );

                suscribirTiempoReal();

                if (
                    estado !== "datos-nuevos"
                    &&
                    estado !== "error"
                ) {

                    cambiarEstado(
                        "sincronizado"
                    );

                }

            }
        );

    panel
        .querySelector(
            "#gcsync-subir"
        )
        .addEventListener(
            "click",
            async () => {

                if (
                    !window.confirm(
                        "Los datos de la nube se sustituirán por los de este dispositivo. ¿Continuar?"
                    )
                ) {

                    return;

                }

                cerrarPanel();

                await subirTodo();

                suscribirTiempoReal();

            }
        );

}


function pintarPanelConectado(
    panel
) {

    const pendientes =
        obtenerPendientes().length;

    panel.innerHTML = `
        <h3>Nube GestaCamps</h3>
        <p>
            ${
                estado === "error"
                    ? "Error: " + mensajeError
                    : estado === "sin-conexion"
                        ? "Sin conexión. Los cambios se guardan aquí y se subirán al volver internet."
                        : "Conectado. Los cambios se comparten entre dispositivos."
            }
            ${
                pendientes > 0
                    ? "<br>Cambios por subir: " + pendientes
                    : ""
            }
        </p>
        <button type="button" id="gcsync-ahora">Sincronizar ahora</button>
        <button type="button" class="gcsync-secundario" id="gcsync-subir-todo">Subir todos los datos de este dispositivo</button>
        <button type="button" class="gcsync-secundario" id="gcsync-salir">Desconectar la nube</button>
        <button type="button" class="gcsync-texto" id="gcsync-cerrar">Cerrar</button>
    `;

    panel
        .querySelector(
            "#gcsync-cerrar"
        )
        .addEventListener(
            "click",
            cerrarPanel
        );

    panel
        .querySelector(
            "#gcsync-ahora"
        )
        .addEventListener(
            "click",
            async () => {

                cerrarPanel();

                await subirPendientes();

                await bajarCambios();

            }
        );

    panel
        .querySelector(
            "#gcsync-subir-todo"
        )
        .addEventListener(
            "click",
            async () => {

                if (
                    !window.confirm(
                        "Los datos de la nube se sustituirán por los de este dispositivo. ¿Continuar?"
                    )
                ) {

                    return;

                }

                cerrarPanel();

                await subirTodo();

            }
        );

    panel
        .querySelector(
            "#gcsync-salir"
        )
        .addEventListener(
            "click",
            async () => {

                cerrarPanel();

                try {

                    if (
                        canal
                    ) {

                        await cliente.removeChannel(
                            canal
                        );

                        canal =
                            null;

                    }

                    await cliente.auth
                        .signOut();

                }

                catch (
                    error
                ) {

                    console.warn(
                        "GestaCamps Sync: error al desconectar",
                        error
                    );

                }

                sesionActiva =
                    false;

                localStorage.removeItem(
                    CLAVE_INICIADO
                );

                cambiarEstado(
                    "desconectado"
                );

            }
        );

}


// =====================================================
// API PÚBLICA
// =====================================================

const SupabaseSync = {

    /*
     * Lo llama StorageService.escribir()
     * cada vez que se guarda algo.
     */
    registrarEscritura(
        clave
    ) {

        try {

            if (
                !esClaveSincronizable(
                    clave
                )
            ) {

                return;

            }

            marcarPendiente(
                clave
            );

            programarSubida();

        }

        catch (
            error
        ) {

            console.warn(
                "GestaCamps Sync: aviso de escritura fallido",
                error
            );

        }

    },


    iniciar() {

        if (
            iniciadoModulo
            ||
            typeof window === "undefined"
        ) {

            return;

        }

        iniciadoModulo =
            true;

        const empezar =
            () => {

                pintarIndicador();

                arrancarConexion();

            };

        if (
            document.readyState === "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                empezar
            );

        }

        else {

            empezar();

        }

        window.addEventListener(
            "online",
            async () => {

                if (
                    !cliente
                    ||
                    !sesionActiva
                ) {

                    await arrancarConexion();

                    return;

                }

                await subirPendientes();

                await bajarCambios();

            }
        );

        window.addEventListener(
            "offline",
            () => {

                if (
                    sesionActiva
                ) {

                    cambiarEstado(
                        "sin-conexion"
                    );

                }

            }
        );

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.visibilityState
                    === "visible"
                ) {

                    subirPendientes();

                    bajarCambios();

                }

            }
        );

        setInterval(
            () => {

                if (
                    document.visibilityState
                    === "visible"
                    &&
                    navigator.onLine
                ) {

                    subirPendientes();

                    bajarCambios();

                }

            },
            INTERVALO_REVISION_MS
        );

    }

};



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


            /*
             * Copia en la nube (Supabase).
             * Si falla, el guardado local sigue siendo válido.
             */
            SupabaseSync.registrarEscritura(
                clave
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


// =====================================================
// SINCRONIZACIÓN CON LA NUBE
// =====================================================

SupabaseSync.iniciar();