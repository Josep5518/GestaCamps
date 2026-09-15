import { FincaService } from "./finca.js";
import { ParcelaService } from "./parcela.js";
import { CultivoService } from "./cultivo.js";
import { TrabajoService } from "./trabajo.js";
import { TrabajadorService } from "./trabajador.js";
import { FichajeService } from "./fichaje.js";
import { IncidenciaService } from "./incidencia.js";
import { HistorialService } from "./historial.js";
import { BuscadorGlobalService } from "./buscadorGlobal.js";
import { CuadernoCampoService } from "./cuadernoCampo.js";
import { TratamientoService } from "./tratamiento.js";
import { MaquinariaService } from "./maquinaria.js";
import { InventarioService } from "./inventario.js";
import { ProduccionService } from "./produccion.js";
import { AlbaranService } from "./albaran.js";
import { FacturaService } from "./factura.js";
import { GastoService } from "./gasto.js";
import { EstadisticasService } from "./estadisticas.js";
import { ClienteProveedorService } from "./clienteProveedor.js";
import { ExplotacionService } from "./explotacion.js";
import { CobroPagoService } from "./cobroPago.js";
import { CampaniaService } from "./campania.js";


// =====================================================
// SERVICIOS BASE
// =====================================================

const fincaService =
    new FincaService();


const parcelaService =
    new ParcelaService(
        fincaService
    );


const campaniaService =
    new CampaniaService(
        fincaService
    );


const cultivoService =
    new CultivoService(
        fincaService,
        campaniaService
    );


const trabajoService =
    new TrabajoService(
        fincaService,
        campaniaService
    );


const trabajadorService =
    new TrabajadorService();


const fichajeService =
    new FichajeService(
        trabajadorService
    );


const incidenciaService =
    new IncidenciaService(
        fincaService,
        trabajoService,
        trabajadorService
    );


const historialService =
    new HistorialService();


const buscadorGlobalService =
    new BuscadorGlobalService();


const cuadernoCampoService =
    new CuadernoCampoService();


const maquinariaService =
    new MaquinariaService();


const inventarioService =
    new InventarioService();


const tratamientoService =
    new TratamientoService(
        inventarioService,
        cuadernoCampoService
    );


const produccionService =
    new ProduccionService(
        fincaService,
        campaniaService,
        cultivoService
    );


const clienteProveedorService =
    new ClienteProveedorService();


const explotacionService =
    new ExplotacionService();


const albaranService =
    new AlbaranService(
        fincaService,
        produccionService,
        clienteProveedorService
    );


const facturaService =
    new FacturaService(
        albaranService
    );


const gastoService =
    new GastoService(
        fincaService,
        maquinariaService,
        clienteProveedorService,
        campaniaService
    );


const cobroPagoService =
    new CobroPagoService(
        facturaService,
        gastoService
    );


const estadisticasService =
    new EstadisticasService(
        facturaService,
        gastoService,
        produccionService,
        fincaService,
        albaranService,
        cobroPagoService,
        campaniaService
    );


// =====================================================
// EXPORTS
// =====================================================

export {

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

};