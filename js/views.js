import {
    InicioView
} from "./inicioView.js";

import {
    FincasView
} from "./fincasView.js";

import {
    CampaniasView
} from "./campaniasView.js";

import {
    CultivosView
} from "./cultivosView.js";

import {
    CuadernoCampoView
} from "./cuadernoCampoView.js";

import {
    TratamientosView
} from "./tratamientosView.js";

import {
    TrabajosViewEvidencias
} from "./trabajosViewEvidencias.js";

import {
    TrabajadoresView
} from "./trabajadoresView.js";

import {
    FichajesView
} from "./fichajesView.js";

import {
    IncidenciasView
} from "./incidenciasView.js";

import {
    HistorialView
} from "./historialView.js";

import {
    BuscadorGlobalView
} from "./buscadorGlobalView.js";

import {
    TrabajadorPortalView
} from "./trabajadorPortalView.js";

import {
    MaquinariaView
} from "./maquinariaView.js";

import {
    InventarioView
} from "./inventarioView.js";

import {
    ProduccionView
} from "./produccionView.js";

import {
    ClientesProveedoresView
} from "./clientesProveedoresView.js";

import {
    AlbaranesView
} from "./albaranesView.js";

import {
    FacturacionView
} from "./facturacionView.js";

import {
    GastosView
} from "./gastosView.js";

import {
    CobrosPagosView
} from "./cobrosPagosView.js";

import {
    EstadisticasView
} from "./estadisticasView.js";

import {
    UsuariosView
} from "./usuariosView.js";

import {
    PerfilView
} from "./perfilView.js";

import {
    UsuarioService
} from "./usuario.js";

import {
    AuthService
} from "./auth.js";

import {
    NotificacionesUI
} from "./notificaciones.js";

import {
    services
} from "./services.js";


// =====================================================
// FACTORÍA DE VISTAS
// =====================================================

export function crearVistas(
    mainContent,
    navegarA,
    salirModoTrabajador
) {

    // =================================================
    // SERVICIOS LOCALES
    // =================================================

    const usuarioService =
        new UsuarioService();


    const authService =
        new AuthService();


    // =================================================
    // NOTIFICACIONES
    // =================================================

    const notificacionesUI =
        new NotificacionesUI(
            services,
            navegarA
        );


    notificacionesUI.iniciar();


    // =================================================
    // VISTAS
    // =================================================

    const inicioView =
        new InicioView(
            mainContent,
            services.finca,
            services.trabajo,
            services.produccion,
            services.explotacion
        );


    const fincasView =
        new FincasView(
            mainContent,
            services.finca,
            services.parcela
        );


    const campaniasView =
        new CampaniasView(
            mainContent,
            services.campania,
            services.finca
        );


    const cultivosView =
        new CultivosView(
            mainContent,
            services.finca,
            services.cultivo,
            services.campania
        );


    const cuadernoCampoView =
        new CuadernoCampoView(
            mainContent,
            services.cuadernoCampo
        );


    const tratamientosView =
        new TratamientosView(
            mainContent,
            services.tratamiento
        );


    const trabajosView =
        new TrabajosViewEvidencias(
            mainContent,
            services.finca,
            services.trabajo,
            services.trabajador,
            services.maquinaria,
            services.campania
        );


    const trabajadoresView =
        new TrabajadoresView(
            mainContent,
            services.trabajador
        );


    const fichajesView =
        new FichajesView(
            mainContent,
            services.fichaje,
            services.trabajador,
            authService
        );


    const incidenciasView =
        new IncidenciasView(
            mainContent,
            services.incidencia,
            services.finca,
            services.trabajo,
            services.trabajador
        );


    const historialView =
        new HistorialView(
            mainContent,
            services.historial
        );


    const buscadorGlobalView =
        new BuscadorGlobalView(
            mainContent,
            services.buscadorGlobal,
            pagina => {

                navegarA(
                    pagina
                );

            }
        );


    const trabajadorPortalView =
        new TrabajadorPortalView(
            mainContent,
            services.trabajador,
            services.trabajo,
            services.incidencia,
            services.finca,
            services.fichaje,
            () => {

                salirModoTrabajador();

                navegarA(
                    "inicio"
                );

            }
        );


    const maquinariaView =
        new MaquinariaView(
            mainContent,
            services.maquinaria
        );


    const inventarioView =
        new InventarioView(
            mainContent,
            services.inventario
        );


    const produccionView =
        new ProduccionView(
            mainContent,
            services.finca,
            services.produccion,
            services.campania,
            services.cultivo,
            services.albaran
        );


    const clientesProveedoresView =
        new ClientesProveedoresView(
            mainContent,
            services.clienteProveedor
        );


    const albaranesView =
        new AlbaranesView(
            mainContent,
            services.finca,
            services.produccion,
            services.albaran,
            services.clienteProveedor
        );


    const facturacionView =
        new FacturacionView(
            mainContent,
            services.factura,
            services.albaran,
            services.explotacion,
            services.clienteProveedor
        );


    const gastosView =
        new GastosView(
            mainContent,
            services.gasto,
            services.finca,
            services.maquinaria,
            services.clienteProveedor,
            services.campania
        );


    const cobrosPagosView =
        new CobrosPagosView(
            mainContent,
            services.cobroPago,
            services.factura,
            services.gasto
        );


    const estadisticasView =
        new EstadisticasView(
            mainContent,
            services.estadisticas
        );


    const usuariosView =
        new UsuariosView(
            mainContent,
            usuarioService,
            services.trabajador
        );


    const perfilView =
        new PerfilView(
            mainContent,
            services.explotacion
        );


    // =================================================
    // DEVOLVER VISTAS
    // =================================================

    return {

        inicioView,

        fincasView,

        campaniasView,

        cultivosView,

        cuadernoCampoView,

        tratamientosView,

        trabajosView,

        trabajadoresView,

        fichajesView,

        incidenciasView,

        historialView,

        buscadorGlobalView,

        trabajadorPortalView,

        maquinariaView,

        inventarioView,

        produccionView,

        clientesProveedoresView,

        albaranesView,

        facturacionView,

        gastosView,

        cobrosPagosView,

        estadisticasView,

        usuariosView,

        perfilView,

        notificacionesUI

    };

}