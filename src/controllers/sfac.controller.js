import {
  TipoOperacionCrear,
  TipoOperacionEditar,
  TipoOperacionEliminar,
  TipoOperacionObtener,
  TipoOperacionActivar,
  TipoOperacionObtenerInventarioCombo,
  TipoOperacionObtenerExtrasProductos,
  TipoOperacionObtenerVariantesProducto,
  TipoOperacionObtenerOrdenUsuario,
  TipoOperacionCrearFacturaWEB,
  TipoOperacionActualizarEstadoPreparado,
  TipoOperacionObtenerProductosPorCategoria,
  TipoOperacionActualizarEstadoPreparacionDetalle,
  TipoOperacionAsignarOrden,
} from "../utils/constantes.js";
import {
  GestionarDescuentos,
  GestionarDetalleFactura,
  GestionarFacturas,
  GestionarInventario,
  GestionarDetalleFormasPago,
  ObtenerTotalProductos,
  ObtenerTotalFacturas,
  GestionarTalonarios,
  GestionarDetalleTalonario,
  GestionarCajaSucursal,
  GestionarOrdenes,
  GestionarEmpaquetados,
} from "../services/sfac.services.js";
import { CatchControlador } from "../utils/util.js";

export const ObtenerFacturasController = async (req, res) => {
  try {
    const result = await GestionarFacturas(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerFacturasController:", err);
    CatchControlador(res, err);
  }
};

export const CrearFacturaController = async (req, res) => {
  try {
    const result = await GestionarFacturas(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearFacturaController:", err);
    CatchControlador(res, err);
  }
};

export const CrearFacturaControllerWEB = async (req, res) => {
  try {
    const result = await GestionarFacturas(TipoOperacionCrearFacturaWEB, {
      ...req.body,
      // CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearFacturaControllerWEB:", err);
    CatchControlador(res, err);
  }
};

export const EditarFacturaController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;

    const result = await GestionarFacturas(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarFacturaController:", err);
    CatchControlador(res, err);
  }
};

export const AsignarOrdenFacturaController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarFacturas(TipoOperacionAsignarOrden, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("AsignarOrdenFacturaController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerDetalleFacturaController = async (req, res) => {
  try {
    const result = await GestionarDetalleFactura(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerDetalleFacturaController:", err);
    CatchControlador(res, err);
  }
};

export const CrearDetalleFacturaController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDetalleFactura(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearDetalleFacturaController:", err);
    CatchControlador(res, err);
  }
};

export const CrearDetalleFacturaControllerWEB = async (req, res) => {
  try {
    const result = await GestionarDetalleFactura(TipoOperacionCrear, {
      ...req.body,
      // CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearDetalleFacturaControllerWEB:", err);
    CatchControlador(res, err);
  }
};

export const EditarDetalleFacturaController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDetalleFactura(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarDetalleFacturaController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarDetalleFacturaController = async (req, res) => {
  try {
    const result = await GestionarDetalleFactura(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarDetalleFacturaController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerInventarioController = async (req, res) => {
  try {
    const result = await GestionarInventario(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerInventarioController:", err);
    CatchControlador(res, err);
  }
};

//inventario para web (10 productos por categoria)
export const ObtenerInventarioWEBController = async (req, res) => {
  try {
    const result = await GestionarInventario(
      TipoOperacionObtenerProductosPorCategoria,
      {
        ...req.query,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerInventarioController:", err);
    CatchControlador(res, err);
  }
};

export const CrearInventarioController = async (req, res) => {
  try {
    const result = await GestionarInventario(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearInventarioController:", err);
    CatchControlador(res, err);
  }
};

export const EditarInventarioController = async (req, res) => {
  try {
    const result = await GestionarInventario(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarInventarioController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarInventarioController = async (req, res) => {
  try {
    const result = await GestionarInventario(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarInventarioController:", err);
    CatchControlador(res, err);
  }
};

export const ActivarInventarioController = async (req, res) => {
  try {
    const result = await GestionarInventario(TipoOperacionActivar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ActivarInventarioController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerDescuentoFactura = async (req, res) => {
  try {
    const result = await GestionarDescuentos(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerDescuentoFactura" + "Controller:", err);
    CatchControlador(res, err);
  }
};

export const CrearDescuentoFactura = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDescuentos(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearDescuentoFactura" + "Controller:", err);
    CatchControlador(res, err);
  }
};

export const EditarDescuentoFactura = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDescuentos(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarDescuentoFactura" + "Controller:", err);
    CatchControlador(res, err);
  }
};

export const EliminarDescuentoFactura = async (req, res) => {
  try {
    const result = await GestionarDescuentos(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarDescuentoFactura" + "Controller:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerDetalleFormasPagoController = async (req, res) => {
  try {
    const result = await GestionarDetalleFormasPago(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerDetalleFormasPagoController:", err);
    CatchControlador(res, err);
  }
};

export const CrearDetalleFormasPagoController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDetalleFormasPago(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearDetalleFormasPagoController:", err);
    CatchControlador(res, err);
  }
};

export const EditarDetalleFormasPagoController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDetalleFormasPago(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarDetalleFormasPagoController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarDetalleFormasPagoController = async (req, res) => {
  try {
    const result = await GestionarDetalleFormasPago(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarDetalleFormasPagoController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerTotalProductosController = async (req, res) => {
  try {
    const result = await ObtenerTotalProductos();
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerTotalProductosController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerTotalFacturasController = async (req, res) => {
  try {
    const result = await ObtenerTotalFacturas();
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerTotalFacturasController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerTalonariosController = async (req, res) => {
  try {
    const result = await GestionarTalonarios(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerTalonariosController:", err);
    CatchControlador(res, err);
  }
};

export const CrearTalonarioController = async (req, res) => {
  try {
    const result = await GestionarTalonarios(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearTalonarioController:", err);
    CatchControlador(res, err);
  }
};

export const EditarTalonarioController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarTalonarios(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarTalonarioController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarTalonarioController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarTalonarios(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarTalonarioController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerDetalleTalonarioController = async (req, res) => {
  try {
    const result = await GestionarDetalleTalonario(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerDetalleTalonarioController:", err);
    CatchControlador(res, err);
  }
};

export const CrearDetalleTalonarioController = async (req, res) => {
  try {
    const result = await GestionarDetalleTalonario(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearDetalleTalonarioController:", err);
    CatchControlador(res, err);
  }
};

export const EditarDetalleTalonarioController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDetalleTalonario(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarDetalleTalonarioController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarDetalleTalonarioController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarDetalleTalonario(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarDetalleTalonarioController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerCajasSucursalController = async (req, res) => {
  try {
    const result = await GestionarCajaSucursal(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerCajasSucursalController:", err);
    CatchControlador(res, err);
  }
};

export const CrearCajaSucursalController = async (req, res) => {
  try {
    const result = await GestionarCajaSucursal(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearCajaSucursalController:", err);
    CatchControlador(res, err);
  }
};

export const EditarCajaSucursalController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarCajaSucursal(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarCajaSucursalController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarCajaSucursalController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarCajaSucursal(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarCajaSucursalController:", err);
    CatchControlador(res, err);
  }
};

//productos combo
export const ObtenerProductosComboController = async (req, res) => {
  try {
    const result = await GestionarInventario(
      TipoOperacionObtenerInventarioCombo,
      {
        ...req.query,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerProductosComboController:", err);
    CatchControlador(res, err);
  }
};

//Extras productos
export const ObtenerExtrasProductosController = async (req, res) => {
  try {
    const result = await GestionarInventario(
      TipoOperacionObtenerExtrasProductos,
      {
        ...req.query,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerExtrasProductosController:", err);
    CatchControlador(res, err);
  }
};

//Variantes productos
export const ObtenerVariantesProductosController = async (req, res) => {
  try {
    const result = await GestionarInventario(
      TipoOperacionObtenerVariantesProducto,
      {
        ...req.query,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerVariantesProductosController:", err);
    CatchControlador(res, err);
  }
};

//Ordenes (Carrito)
export const ObtenerOrdenesController = async (req, res) => {
  try {
    const result = await GestionarOrdenes(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerOrdenesController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerOrdenesUsuarioController = async (req, res) => {
  try {
    const result = await GestionarOrdenes(TipoOperacionObtenerOrdenUsuario, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerOrdenesUsuarioController:", err);
    CatchControlador(res, err);
  }
};

export const CrearOrdenesController = async (req, res) => {
  try {
    // 1. Crear la orden
    const result = await GestionarOrdenes(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });

    // Validar resultado
    if (result.status !== 200) {
      return res.status(result.status).json(result.response);
    }
    console.log("result", result);

    // ⚡ result.response trae solo el NumeroOrden
    const numeroOrden = result.response.result;

    // 2. Obtener la orden completa con otra llamada al SP
    const resultOrdenCompleta = await GestionarOrdenes(TipoOperacionObtener, {
      CodigoOrden: numeroOrden,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    console.log("resultOrdenCompleta", resultOrdenCompleta);

    // 3. Emitir la orden completa por Socket.IO
    if (resultOrdenCompleta.status === 200) {
      let ordenes = resultOrdenCompleta.response.result;
      const io = req.app.get("io");
      if (typeof ordenes === "string") {
        ordenes = JSON.parse(ordenes);
      }
      io.emit("nueva-orden", Array.isArray(ordenes) ? ordenes[0] : ordenes);
    }

    // 4. Responder al cliente REST con lo que normalmente devuelves
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearOrdenesController:", err);
    CatchControlador(res, err);
  }
};

export const EditarOrdenesController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarOrdenes(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarOrdenesController:", err);
    CatchControlador(res, err);
  }
};

export const ActualizarEstadoOrdenesController = async (req, res) => {
  try {
    // 1. Actualizar estado en la BD
    const result = await GestionarOrdenes(
      TipoOperacionActualizarEstadoPreparacionDetalle,
      {
        ...req.body,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );

    // Responder error si algo falla
    if (result.status !== 200) {
      return res.status(result.status).json(result.response);
    }
    console.log("result", result);

    // ⚡ Aquí result.response debe traer el CodigoOrden (lo necesitarás para consultar la orden completa)
    const codigoOrden = result.response.result;

    // 2. Obtener la orden actualizada desde la BD
    const resultOrdenCompleta = await GestionarOrdenes(TipoOperacionObtener, {
      CodigoOrden: codigoOrden,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    console.log("resultOrdenCompleta", resultOrdenCompleta);

    // 3. Emitir la orden completa por Socket.IO
    if (resultOrdenCompleta.status === 200) {
      let ordenes = resultOrdenCompleta.response.result;
      const io = req.app.get("io");
      if (typeof ordenes === "string") {
        ordenes = JSON.parse(ordenes);
      }
      io.emit("orden-actualizada", Array.isArray(ordenes) ? ordenes[0] : ordenes);
    }

    // 4. Responder al cliente que hizo el request con lo que devuelves normalmente
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ActualizarEstadoOrdenesController:", err);
    CatchControlador(res, err);
  }
};

export const CerrarOrdenesController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarOrdenes(
      TipoOperacionActualizarEstadoPreparado,
      {
        ...req.body,
        CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CerrarOrdenesController:", err);
    CatchControlador(res, err);
  }
};

// ==========================================
// CONTROLADORES DE EMPAQUETADOS
// ==========================================

export const ObtenerEmpaquetadosController = async (req, res) => {
  try {
    const result = await GestionarEmpaquetados(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerEmpaquetadosController:", err);
    CatchControlador(res, err);
  }
};

export const CrearEmpaquetadoController = async (req, res) => {
  try {
    const result = await GestionarEmpaquetados(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearEmpaquetadoController:", err);
    CatchControlador(res, err);
  }
};

export const EditarEmpaquetadoController = async (req, res) => {
  try {
    const result = await GestionarEmpaquetados(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarEmpaquetadoController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarEmpaquetadoController = async (req, res) => {
  try {
    const result = await GestionarEmpaquetados(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarEmpaquetadoController:", err);
    CatchControlador(res, err);
  }
};
