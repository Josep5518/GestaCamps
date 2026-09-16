import { InicioView } from "./inicioView.js";
import { FincasView } from "./fincasView.js";
import { CampaniasView } from "./campaniasView.js";
import { CultivosView } from "./cultivosView.js";
import { CuadernoCampoView } from "./cuadernoCampoView.js";
import { TratamientosView } from "./tratamientosView.js";
import { TrabajosView } from "./trabajosView.js";
import { TrabajadoresView } from "./trabajadoresView.js";
import { FichajesView } from "./fichajesView.js";
import { IncidenciasView } from "./incidenciasView.js";
import { HistorialView } from "./historialView.js";
import { BuscadorGlobalView } from "./buscadorGlobalView.js";
import { TrabajadorPortalView } from "./trabajadorPortalView.js";
import { MaquinariaView } from "./maquinariaView.js";
import { InventarioView } from "./inventarioView.js";
import { ProduccionView } from "./produccionView.js";
import { ClientesProveedoresView } from "./clientesProveedoresView.js";
import { AlbaranesView } from "./albaranesView.js";
import { FacturacionView } from "./facturacionView.js";
import { CobrosPagosView } from "./cobrosPagosView.js";
import { GastosView } from "./gastosView.js";
import { EstadisticasView } from "./estadisticasView.js";
import { UsuariosView } from "./usuariosView.js";
import { PerfilView } from "./perfilView.js";

import { UsuarioService } from "./usuario.js";

import {
    fincaService,
    parcelaService,
    campaniaService,
    cultivoService,
    trabajoService,
    trabajadorService,
    fichajeService,
    incidenciaService,
    historialService,
    buscadorGlobalService,
    cuadernoCampoService,
    maquinariaService,
    inventarioService,
    tratamientoService,
    produccionService,
    clienteProveedorService,
    explotacionService,
    albaranService,
    facturaService,
    gastoService,
    cobroPagoService,
    estadisticasService
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


    const inicioView =
        new InicioView(
            mainContent,
            fincaService,
            trabajoService,
            produccionService,
            explotacionService
        );


    const fincasView =
        new FincasView(
            mainContent,
            fincaService,
            parcelaService
        );


    const campaniasView =
        new CampaniasView(
            mainContent,
            campaniaService,
            fincaService
        );


    const cultivosView =
        new CultivosView(
            mainContent,
            fincaService,
            cultivoService,
            campaniaService
        );


    const cuadernoCampoView =
        new CuadernoCampoView(
            mainContent,
            cuadernoCampoService
        );


    const tratamientosView =
        new TratamientosView(
            mainContent,
            tratamientoService
        );


    const trabajosView =
        new TrabajosView(
            mainContent,
            fincaService,
            trabajoService,
            trabajadorService,
            maquinariaService,
            campaniaService
        );


    const trabajadoresView =
        new TrabajadoresView(
            mainContent,
            trabajadorService
        );


    const fichajesView =
        new FichajesView(
            mainContent,
            fichajeService,
            trabajadorService
        );


    const incidenciasView =
        new IncidenciasView(
            mainContent,
            incidenciaService,
            fincaService,
            trabajoService,
            trabajadorService
        );


    const historialView =
        new HistorialView(
            mainContent,
            historialService
        );


    const buscadorGlobalView =
        new BuscadorGlobalView(
            mainContent,
            buscadorGlobalService,
            pagina => {

                navegarA(
                    pagina
                );

            }
        );


    const trabajadorPortalView =
        new TrabajadorPortalView(
            mainContent,
            trabajadorService,
            trabajoService,
            incidenciaService,
            fincaService,
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
            maquinariaService
        );


    const inventarioView =
        new InventarioView(
            mainContent,
            inventarioService
        );


    const produccionView =
        new ProduccionView(
            mainContent,
            fincaService,
            produccionService,
            campaniaService,
            cultivoService,
            albaranService
        );


    const clientesProveedoresView =
        new ClientesProveedoresView(
            mainContent,
            clienteProveedorService
        );


    const albaranesView =
        new AlbaranesView(
            mainContent,
            fincaService,
            produccionService,
            albaranService,
            clienteProveedorService
        );


    const facturacionView =
        new FacturacionView(
            mainContent,
            facturaService,
            albaranService,
            explotacionService,
            clienteProveedorService
        );


    const cobrosPagosView =
        new CobrosPagosView(
            mainContent,
            cobroPagoService,
            facturaService,
            gastoService
        );


    const gastosView =
        new GastosView(
            mainContent,
            gastoService,
            fincaService,
            maquinariaService,
            clienteProveedorService,
            campaniaService
        );


    const estadisticasView =
        new EstadisticasView(
            mainContent,
            estadisticasService
        );


    const usuariosView =
        new UsuariosView(
            mainContent,
            usuarioService,
            trabajadorService
        );


    const perfilView =
        new PerfilView(
            mainContent,
            explotacionService
        );


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
        cobrosPagosView,
        gastosView,
        estadisticasView,
        usuariosView,
        perfilView
    };

}