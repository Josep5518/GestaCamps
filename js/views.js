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
    TrabajosView
} from "./trabajosView.js";

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

    const usuarioService =
        new UsuarioService();


    const authService =
        new AuthService();


    return {

        inicioView:
            new InicioView(
                mainContent,
                services.finca,
                services.trabajo,
                services.produccion,
                services.explotacion
            ),


        fincasView:
            new FincasView(
                mainContent,
                services.finca,
                services.parcela
            ),


        campaniasView:
            new CampaniasView(
                mainContent,
                services.campania,
                services.finca
            ),


        cultivosView:
            new CultivosView(
                mainContent,
                services.finca,
                services.cultivo,
                services.campania
            ),


        cuadernoCampoView:
            new CuadernoCampoView(
                mainContent,
                services.cuadernoCampo
            ),


        tratamientosView:
            new TratamientosView(
                mainContent,
                services.tratamiento
            ),


        trabajosView:
            new TrabajosView(
                mainContent,
                services.finca,
                services.trabajo,
                services.trabajador,
                services.maquinaria,
                services.campania
            ),


        trabajadoresView:
            new TrabajadoresView(
                mainContent,
                services.trabajador
            ),


        fichajesView:
            new FichajesView(
                mainContent,
                services.fichaje,
                services.trabajador,
                authService
            ),


        incidenciasView:
            new IncidenciasView(
                mainContent,
                services.incidencia,
                services.finca,
                services.trabajo,
                services.trabajador
            ),


        historialView:
            new HistorialView(
                mainContent,
                services.historial
            ),


        buscadorGlobalView:
            new BuscadorGlobalView(
                mainContent,
                services.buscadorGlobal,
                navegarA
            ),


        trabajadorPortalView:
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
            ),


        maquinariaView:
            new MaquinariaView(
                mainContent,
                services.maquinaria
            ),


        inventarioView:
            new InventarioView(
                mainContent,
                services.inventario
            ),


        produccionView:
            new ProduccionView(
                mainContent,
                services.finca,
                services.produccion,
                services.campania,
                services.cultivo,
                services.albaran
            ),


        clientesProveedoresView:
            new ClientesProveedoresView(
                mainContent,
                services.clienteProveedor
            ),


        albaranesView:
            new AlbaranesView(
                mainContent,
                services.finca,
                services.produccion,
                services.albaran,
                services.clienteProveedor
            ),


        facturacionView:
            new FacturacionView(
                mainContent,
                services.factura,
                services.albaran,
                services.explotacion,
                services.clienteProveedor
            ),


        gastosView:
            new GastosView(
                mainContent,
                services.gasto,
                services.finca,
                services.maquinaria,
                services.clienteProveedor,
                services.campania
            ),


        cobrosPagosView:
            new CobrosPagosView(
                mainContent,
                services.cobroPago,
                services.factura,
                services.gasto
            ),


        estadisticasView:
            new EstadisticasView(
                mainContent,
                services.estadisticas
            ),


        usuariosView:
            new UsuariosView(
                mainContent,
                usuarioService,
                services.trabajador
            ),


        perfilView:
            new PerfilView(
                mainContent,
                services.explotacion
            )

    };

}