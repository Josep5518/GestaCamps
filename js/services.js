import {
    FincaService
} from "./finca.js";

import {
    ParcelaService
} from "./parcela.js";

import {
    CampaniaService
} from "./campania.js";

import {
    CultivoService
} from "./cultivo.js";

import {
    TrabajoService
} from "./trabajo.js";

import {
    TrabajadorService
} from "./trabajador.js";

import {
    FichajeService
} from "./fichaje.js";

import {
    IncidenciaService
} from "./incidencia.js";

import {
    HistorialService
} from "./historial.js";

import {
    BuscadorGlobalService
} from "./buscadorGlobal.js";

import {
    CuadernoCampoService
} from "./cuadernoCampo.js";

import {
    TratamientoService
} from "./tratamiento.js";

import {
    MaquinariaService
} from "./maquinaria.js";

import {
    InventarioService
} from "./inventario.js";

import {
    ProduccionService
} from "./produccion.js";

import {
    ClienteProveedorService
} from "./clienteProveedor.js";

import {
    ExplotacionService
} from "./explotacion.js";

import {
    AlbaranService
} from "./albaran.js";

import {
    FacturaService
} from "./factura.js";

import {
    GastoService
} from "./gasto.js";

import {
    CobroPagoService
} from "./cobroPago.js";

import {
    EstadisticasService
} from "./estadisticas.js";


// =====================================================
// SERVICIOS
// =====================================================

export const fincaService =
    new FincaService();


export const parcelaService =
    new ParcelaService(
        fincaService
    );


export const campaniaService =
    new CampaniaService(
        fincaService
    );


export const cultivoService =
    new CultivoService(
        fincaService,
        campaniaService
    );


export const trabajoService =
    new TrabajoService(
        fincaService,
        campaniaService
    );


export const trabajadorService =
    new TrabajadorService();


export const fichajeService =
    new FichajeService(
        trabajadorService
    );


export const incidenciaService =
    new IncidenciaService(
        fincaService,
        trabajoService,
        trabajadorService
    );


export const historialService =
    new HistorialService();


export const buscadorGlobalService =
    new BuscadorGlobalService();


export const cuadernoCampoService =
    new CuadernoCampoService();


export const maquinariaService =
    new MaquinariaService();


export const inventarioService =
    new InventarioService();


export const tratamientoService =
    new TratamientoService(
        inventarioService,
        cuadernoCampoService
    );


export const produccionService =
    new ProduccionService(
        fincaService,
        campaniaService,
        cultivoService
    );


export const clienteProveedorService =
    new ClienteProveedorService();


export const explotacionService =
    new ExplotacionService();


export const albaranService =
    new AlbaranService(
        fincaService,
        produccionService,
        clienteProveedorService
    );


export const facturaService =
    new FacturaService(
        albaranService
    );


export const gastoService =
    new GastoService(
        fincaService,
        maquinariaService,
        clienteProveedorService,
        campaniaService
    );


export const cobroPagoService =
    new CobroPagoService(
        facturaService,
        gastoService
    );


export const estadisticasService =
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
// OBJETO GLOBAL DE SERVICIOS
// =====================================================

export const services = {

    finca:
        fincaService,

    parcela:
        parcelaService,

    campania:
        campaniaService,

    cultivo:
        cultivoService,

    trabajo:
        trabajoService,

    trabajador:
        trabajadorService,

    fichaje:
        fichajeService,

    incidencia:
        incidenciaService,

    historial:
        historialService,

    buscadorGlobal:
        buscadorGlobalService,

    cuadernoCampo:
        cuadernoCampoService,

    maquinaria:
        maquinariaService,

    inventario:
        inventarioService,

    tratamiento:
        tratamientoService,

    produccion:
        produccionService,

    clienteProveedor:
        clienteProveedorService,

    explotacion:
        explotacionService,

    albaran:
        albaranService,

    factura:
        facturaService,

    gasto:
        gastoService,

    cobroPago:
        cobroPagoService,

    estadisticas:
        estadisticasService

};