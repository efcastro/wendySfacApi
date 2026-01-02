import { pool } from "../db.js";
import { IsNull, ValidarRespuestaSp, getLocalIp } from "../utils/util.js";
import { PORT } from "../config.js";
import {
  TypeResultErrorNoControlado,
  SpGestionarFactura,
  SpGestionarDetalleFactura,
  SpGestionarInventario,
  SpGestionarDescuentos,
  SpGestionarDetalleFormasPago,
  SpGestionarTalonarios,
  SpGestionarDetalleTalonario,
  SpGestionarCajaSucursal,
  SpGestionarOrdenes,
  SpGestionarAperturaCierreCaja,
  SpGestionarMovimientosCaja,
  SpReporteCierreCaja,
  SpReporteVentasDiarias,
  SpReporteComprasDiarias,
  SpReporteInventario,
} from "../utils/constantes.js";
const localIps = getLocalIp();
const IPSERVER = `${localIps[0]}:${PORT}/`;

export const GestionarFacturas = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoFactura,
      CodigoUsuario,
      CodigoEstado,
      CodigoPersona,
      CodigoMoneda,
      NoOrdenCompraExenta,
      NoConstanciaRegistroExonerado,
      NoRegistroSag,
      Observaciones,
      CodigoDescuento,
      CodigoFormaPago,
      Pagina,
      TamanoPagina,
      Aux,
    } = datos;

    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoFactura: IsNull(CodigoFactura),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pnFKEstado: IsNull(CodigoEstado),
      pnCodigoPersona: IsNull(CodigoPersona),
      pnCodigoMoneda: IsNull(CodigoMoneda),
      pcNoOrdenCompraExenta: IsNull(NoOrdenCompraExenta),
      pcNoConstanciaRegistroExonerado: IsNull(NoConstanciaRegistroExonerado),
      pcNoRegistroSag: IsNull(NoRegistroSag),
      pcObservaciones: IsNull(Observaciones),
      pnCodigoDescuento: IsNull(CodigoDescuento),
      pnCodigoFormaPago: IsNull(CodigoFormaPago),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      Aux: IsNull(JSON.stringify(Aux)),
    };
    const orderedParams = Object.values(Params);


    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarFactura}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarFacturasService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarFacturasService: " + err
    );
  }
};

export const GestionarDetalleFactura = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoDetalle,
      CodigoFactura,
      CodigoInventario,
      Cantidad,
      PrecioVenta,
      CodigoUsuario,
      ProductosCombo,
      Extras,
    } = datos;
    // Extraer los parámetros en el orden correcto

    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoDetalle: IsNull(CodigoDetalle),
      pnCodigoFactura: IsNull(CodigoFactura),
      pnCodigoInventario: IsNull(CodigoInventario),
      pnCantidad: IsNull(Cantidad),
      pnPrecioVenta: IsNull(PrecioVenta),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pnProductosCombo: IsNull(JSON.stringify(ProductosCombo)),
      pnExtras: IsNull(JSON.stringify(Extras)),
    };

    const orderedParams = Object.values(Params);

    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarDetalleFactura}(?, ?, ?, ?, ?, ?, ?,?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];

    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarDetalleFacturaService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarDetalleFacturaService: " + err
    );
  }
};

export const GestionarInventario = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoInventario,
      Nombre,
      FKCodigoTipoInventario,
      FKCodigoCategoriaInventario,
      Cantidad,
      FechaExpiracion,
      FKCodigoUbicacion,
      PrecioUnitario,
      PrecioVenta,
      FKCodigoEstado,
      FKCodigoTipoImpuesto,
      Pagina,
      TamanoPagina,
      Busqueda,
      CodigoUsuario,
      ProductosCombo,
      Extras,
      Variantes,
      TieneExtras,
      TieneVariantes,
    } = datos;

    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoInventario: IsNull(CodigoInventario),
      pcNombre: IsNull(Nombre),
      pnFKCodigoTipoInventario: IsNull(FKCodigoTipoInventario),
      pnFKCodigoCategoriaInventario: IsNull(FKCodigoCategoriaInventario),
      pnCantidad: IsNull(Cantidad),
      pdFechaExpiracion: IsNull(FechaExpiracion),
      pnFKCodigoUbicacion: IsNull(FKCodigoUbicacion),
      pnPrecioUnitario: IsNull(PrecioUnitario),
      pnPrecioVenta: IsNull(PrecioVenta),
      pnFKCodigoEstado: IsNull(FKCodigoEstado),
      pnFKCodigoTipoImpuesto: IsNull(FKCodigoTipoImpuesto),
      pcDireccionIP: IPSERVER,
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pcBusqueda: IsNull(Busqueda),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pcProductosCombo: IsNull(JSON.stringify(ProductosCombo)),
      pcExtras: IsNull(JSON.stringify(Extras)),
      pcVariantes: IsNull(JSON.stringify(Variantes)),
      pnTieneExtras: IsNull(TieneExtras),
      pnTieneVariantes: IsNull(TieneVariantes),
    };

    const orderedParams = Object.values(Params);

    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarInventario}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];

    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarInventarioService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarInventarioService: " + err
    );
  }
};

export const GestionarDescuentos = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoDescuentoFactura,
      CodigoDescuento,
      CodigoFactura,
      CodigoUsuario,
    } = datos;
    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoDescuentoFactura: IsNull(CodigoDescuentoFactura),
      pnCodigoDescuento: IsNull(CodigoDescuento),
      pnCodigoFactura: IsNull(CodigoFactura),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarDescuentos}(?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarDescuentos" + "Service", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarDescuentos" + "Service: " + err
    );
  }
};

export const GestionarDetalleFormasPago = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoDetalle,
      CodigoFactura,
      CodigoFormaPago,
      MontoRecibido,
      Referencia,
      CodigoUsuario,
    } = datos;

    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoDetalle: IsNull(CodigoDetalle),
      pnCodigoFactura: IsNull(CodigoFactura),
      pnCodigoFormaPago: IsNull(CodigoFormaPago),
      pnMontoRecibido: IsNull(MontoRecibido),
      pcReferencia: IsNull(Referencia),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };

    const orderedParams = Object.values(Params);

    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarDetalleFormasPago}(?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    // Obtener los resultados del procedimiento almacenado
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );

    const { typeResult, result, message } = output[0];

    // Validar y retornar la respuesta
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarDetalleFormasPagoService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarDetalleFormasPagoService: " + err.message
    );
  }
};

export const ObtenerTotalProductos = async () => {
  try {
    const query = "SELECT COUNT(*) AS totalProductos FROM sfac_Inventario";
    const [result] = await pool.query(query);

    // Retornar el resultado
    return {
      status: 200,
      response: {
        result: result[0].totalProductos,
        typeResult: 0,
        message: "Se obtuvieron todos los productos",
      },
    };
  } catch (err) {
    console.error("ObtenerTotalProductosService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerTotalProductosService: " + err
    );
  }
};

export const ObtenerTotalFacturas = async () => {
  try {
    const query = "SELECT COUNT(*) AS totalFacturas FROM sfac_Factura";
    const [result] = await pool.query(query);

    // Retornar el resultado
    return {
      status: 200,
      response: {
        result: result[0].totalFacturas,
        typeResult: 0,
        message: "Se obtuvieron todos las Facturas",
      },
    };
  } catch (err) {
    console.error("ObtenerTotalFacturasServices:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerTotalFacturasServices: " + err
    );
  }
};

export const GestionarTalonarios = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoTalonario,
      CodigoUsuario,
      NumeroDeclaracion,
      FechaLimiteEmision,
      CAI,
      FKEstado,
      Busqueda,
      Pagina,
      TamanoPagina,
    } = datos;
    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoTalonario: IsNull(CodigoTalonario),
      pcNumeroDeclaracion: IsNull(NumeroDeclaracion),
      pdFechaLimiteEmision: IsNull(FechaLimiteEmision),
      pcCAI: IsNull(CAI),
      pnFKEstado: IsNull(FKEstado),
      pcBusqueda: IsNull(Busqueda),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);

    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarTalonarios}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    // Obtener los resultados del procedimiento almacenado
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];

    // Validar y retornar la respuesta
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarTalonariosService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarTalonariosService: " + err
    );
  }
};

export const GestionarDetalleTalonario = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoDetalleTalonario,
      CodigoTalonario,
      CodigoSucursal,
      CodigoTipoDocumento,
      RangoInicial,
      RangoFinal,
      FKEstado,
      CodigoUsuario,
      // Pagina,
      // TamanoPagina
    } = datos;

    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoDetalleTalonario: IsNull(CodigoDetalleTalonario),
      pnCodigoTalonario: IsNull(CodigoTalonario),
      pnFKCodigoSucursal: IsNull(CodigoSucursal),
      pnFKCodigoTipoDocumento: IsNull(CodigoTipoDocumento),
      pcRangoInicial: IsNull(RangoInicial),
      pcRangoFinal: IsNull(RangoFinal),
      pnFKEstado: IsNull(FKEstado),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      // pnPagina: IsNull(Pagina),
      // pnTamanoPagina: IsNull(TamanoPagina)
    };
    const orderedParams = Object.values(Params);

    await pool.query(
      `CALL ${SpGestionarDetalleTalonario}(?, ?, ?, ?, ?, ?, ?, ?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];

    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarDetalleTalonarioService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarDetalleTalonarioService: " + err.message
    );
  }
};

export const GestionarCajaSucursal = async (TipoOperacion, datos) => {
  try {
    const {
      Codigo,
      NumeroCaja,
      FKCodigoUsuario,
      CodigoDetalleTalonario,
      CodigoSucursal,
      CodigoUsuario,
    } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoCajaSucursal: IsNull(Codigo),
      pnNumeroCaja: IsNull(NumeroCaja),
      pnFKCodigoUsuario: IsNull(FKCodigoUsuario),
      pnFKCodigoDetalleTalonario: IsNull(CodigoDetalleTalonario),
      pnFKCodigoSucursal: IsNull(CodigoSucursal),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };

    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarCajaSucursal}(?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );

    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarCajaSucursalService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarCajaSucursalService: " + err.message
    );
  }
};

//ORDENES

export const GestionarOrdenes = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoOrden,
      CodigoUsuario,
      CodigoEstado,
      Pagina,
      TamanoPagina,
      DetalleOrden,
      CodigoMesa
    } = datos;


    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoOrden: IsNull(CodigoOrden),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pnFKEstado: IsNull(CodigoEstado),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pcDetalleOrden: IsNull(JSON.stringify(DetalleOrden)),
      pcDireccionIP: IPSERVER,
      pnFKCodigoMesa: IsNull(CodigoMesa)
    };


    const orderedParams = Object.values(Params);

    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarOrdenes}(?, ?, ?, ?, ?, ?, ?, ?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarOrdenesService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarOrdenesService: " + err
    );
  }
};

// ==========================================
// SERVICIOS DE APERTURA/CIERRE DE CAJA
// ==========================================

export const GestionarAperturaCierreCaja = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoApertura,
      CodigoCajaSucursal,
      CodigoUsuario,
      MontoInicial,
      MontoFinalReal,
      Observaciones,
      Pagina,
      TamanoPagina,
    } = datos;

    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoApertura: IsNull(CodigoApertura),
      pnCodigoCajaSucursal: IsNull(CodigoCajaSucursal),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pnMontoInicial: IsNull(MontoInicial),
      pnMontoFinalReal: IsNull(MontoFinalReal),
      pcObservaciones: IsNull(Observaciones),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
    };

    const orderedParams = Object.values(Params);

    await pool.query(
      `CALL ${SpGestionarAperturaCierreCaja}(?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarAperturaCierreCajaService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarAperturaCierreCajaService: " + err
    );
  }
};

export const GestionarMovimientosCaja = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoMovimiento,
      CodigoAperturaCierre,
      TipoMovimiento,
      Monto,
      Descripcion,
      CodigoUsuario,
    } = datos;

    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoMovimiento: IsNull(CodigoMovimiento),
      pnCodigoAperturaCierre: IsNull(CodigoAperturaCierre),
      pcTipoMovimiento: IsNull(TipoMovimiento),
      pdMonto: IsNull(Monto),
      pcDescripcion: IsNull(Descripcion),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };

    const orderedParams = Object.values(Params);

    await pool.query(
      `CALL ${SpGestionarMovimientosCaja}(?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarMovimientosCajaService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarMovimientosCajaService: " + err
    );
  }
};

export const ObtenerReporteCierreCaja = async (datos) => {
  try {
    const { CodigoApertura, CodigoUsuario } = datos;

    await pool.query(
      `CALL ${SpReporteCierreCaja}(?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [IsNull(CodigoApertura), IsNull(CodigoUsuario)]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("ObtenerReporteCierreCajaService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerReporteCierreCajaService: " + err
    );
  }
};

export const ObtenerReporteVentasDiarias = async (datos) => {
  try {
    const { FechaInicio, FechaFin, CodigoSucursal, CodigoCaja, CodigoUsuario } = datos;

    await pool.query(
      `CALL ${SpReporteVentasDiarias}(?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [
        IsNull(FechaInicio),
        IsNull(FechaFin),
        IsNull(CodigoSucursal),
        IsNull(CodigoCaja),
        IsNull(CodigoUsuario),
      ]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("ObtenerReporteVentasDiariasService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerReporteVentasDiariasService: " + err
    );
  }
};

export const ObtenerReporteComprasDiarias = async (datos) => {
  try {
    const { FechaInicio, FechaFin, CodigoProveedor, CodigoEstado, CodigoUsuario } = datos;

    await pool.query(
      `CALL ${SpReporteComprasDiarias}(?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [
        IsNull(FechaInicio),
        IsNull(FechaFin),
        IsNull(CodigoProveedor),
        IsNull(CodigoEstado),
        IsNull(CodigoUsuario),
      ]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("ObtenerReporteComprasDiariasService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerReporteComprasDiariasService: " + err
    );
  }
};

export const ObtenerReporteInventario = async (datos) => {
  try {
    const {
      CodigoCategoria,
      Busqueda,
      TipoFiltroStock,
      CodigoUsuario
    } = datos;

    console.log("datos", datos);

    await pool.query(
      `CALL ${SpReporteInventario}(?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [
        IsNull(CodigoCategoria),
        IsNull(Busqueda),
        IsNull(TipoFiltroStock),
        IsNull(CodigoUsuario),
      ]
    );

    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("ObtenerReporteInventarioService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerReporteInventarioService: " + err
    );
  }
};
