import { config } from "dotenv";
config();


export const SALT_ROUNDS = 10;

export const TypeResultErrorNoControlado = 2;
export const TypeResultErrorControlado = 1;
export const TypeResultExitoso = 0;
//DB
export const DB = process.env.DB_DATABASE + ".";
//Operaciones
export const TipoOperacionCrear = 1;
export const TipoOperacionEditar = 2;
export const TipoOperacionEliminar = 3;
export const TipoOperacionObtener = 4;
export const TipoOperacionLogin = 5;
export const TipoOperacionObtenerTodos = 6;
export const TipoOperacionCambioContrasena = 7;
export const TipoOperacionActivar = 5;
export const TipoOperacionObtenerInventarioCombo = 6;
export const TipoOperacionObtenerExtrasProductos = 7;
export const TipoOperacionObtenerVariantesProducto = 8;
export const TipoOperacionObtenerOrdenUsuario = 5;
export const TipoOperacionCrearFacturaWEB = 5;
export const TipoOperacionActualizarEstadoPreparado = 6;
export const TipoOperacionAsignarMesa = 6;
export const TipoOperacionObtenerProductosPorCategoria = 9;
export const TipoOperacionActualizarEstadoPreparacionDetalle = 7;
export const TipoOperacionAsignarOrden = 6;
export const TipoOperacionCancelar = 5;
export const TipoOperacionConfirmar = 6;
export const TipoOperacionEliminarDetalleFacturaCompra = 5;

// Operaciones de Apertura/Cierre de Caja
export const TipoOperacionAbrirCaja = 1;
export const TipoOperacionCerrarCaja = 2;
export const TipoOperacionEstadoCaja = 3;
export const TipoOperacionHistorialCaja = 4;
export const TipoOperacionValidarFacturacion = 5;
export const TipoOperacionResumenVentasCaja = 6;

// Operaciones de Movimientos de Caja
export const TipoOperacionCrearMovimiento = 1;
export const TipoOperacionObtenerMovimientos = 2;
export const TipoOperacionEliminarMovimiento = 3;

//Procedimientos Almacenados
export const SPGestionarUsuarios = DB + "seg_SpGestionarUsuarios";

//SFAC
export const SpGestionarFactura = DB + "sfac_SpGestionarFacturas";
export const SpGestionarDetalleFactura = DB + "sfac_SpGestionarDetalleFactura";
export const SpGestionarDetalleFormasPago = DB + "sfac_SpGestionarDetalleFormasPago";
export const SpObtenerInformacionFactura = DB + "sfac_SpObtenerInformacionFactura";
export const SpGestionarInventario = DB + "sfac_SpGestionarInventario";
export const SpGestionarDescuentos = DB + "sfac_SpGestionarDescuentos";
export const SpGestionarTalonarios = "sfac_SpGestionarTalonarios";
export const SpGestionarDetalleTalonario = "sfac_SpGestionarDetalleTalonario";
export const SpGestionarCajaSucursal = "sfac_SpGestionarCajaSucursal";
export const SpGestionarImpresoras = 'sfac_SpGestionarImpresoras';
export const SpGestionarOrdenes = 'sfac_SpGestionarOrdenes';
export const SpGestionarReservas = 'resv_SpGestionarReservas';
export const SpGestionarMesas = 'resv_SpGestionarMesas';
export const SpGestionarSolicitudesEventos = 'resv_SpGestionarSolicitudesEventos';
export const SpGestionarSolicitudesMenuDegustacion = 'resv_SpGestionarSolicitudesMenuDegustacion';
export const SpReporteVentasDiarias = DB + 'sfac_SpReporteVentasDiarias';

// Apertura/Cierre de Caja
export const SpGestionarAperturaCierreCaja = DB + "sfac_SpGestionarAperturaCierreCaja";
export const SpGestionarMovimientosCaja = DB + "sfac_SpGestionarMovimientosCaja";
export const SpReporteCierreCaja = DB + "sfac_SpReporteCierreCaja";


//gral
export const SpGestionarPersonas = DB + "gral_SpGestionarPersonas";

//CAT
export const SpObtenerCatalogo = DB + "cat_SpObtenerCatalogo";

// Facturas de Compras
export const SpGestionarFacturasCompras = DB + 'sfac_SpGestionarFacturasCompras';
export const SpGestionarDetalleFacturasCompras = DB + 'sfac_SpGestionarDetalleFacturasCompras';
export const SpReporteComprasDiarias = DB + 'sfac_SpReporteComprasDiarias';
