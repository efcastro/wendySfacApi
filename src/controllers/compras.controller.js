import {
    TipoOperacionCrear,
    TipoOperacionEditar,
    TipoOperacionEliminar,
    TipoOperacionObtener,
} from "../utils/constantes.js";
import {
    GestionarFacturasCompras,
    GestionarDetalleFacturasCompras,
    ObtenerTotalFacturasCompras,
    RecalcularTotalesFacturaCompra,
} from "../services/compras.services.js";
import { CatchControlador } from "../utils/util.js";

// ==========================================
// CONTROLADORES DE FACTURAS DE COMPRAS
// ==========================================

export const ObtenerFacturasComprasController = async (req, res) => {
    try {
        const result = await GestionarFacturasCompras(TipoOperacionObtener, {
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerFacturasComprasController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerFacturaCompraPorCodigoController = async (req, res) => {
    try {
        const result = await GestionarFacturasCompras(TipoOperacionObtener, {
            CodigoFactura: req.query.CodigoFactura || req.params.CodigoFactura,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerFacturaCompraPorCodigoController:", err);
        CatchControlador(res, err);
    }
};

export const CrearFacturaCompraController = async (req, res) => {
    try {
        const result = await GestionarFacturasCompras(TipoOperacionCrear, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("CrearFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};

export const EditarFacturaCompraController = async (req, res) => {
    try {
        const result = await GestionarFacturasCompras(TipoOperacionEditar, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("EditarFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};

export const EliminarFacturaCompraController = async (req, res) => {
    try {
        const result = await GestionarFacturasCompras(TipoOperacionEliminar, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("EliminarFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerTotalFacturasComprasController = async (req, res) => {
    try {
        const result = await ObtenerTotalFacturasCompras({
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerTotalFacturasComprasController:", err);
        CatchControlador(res, err);
    }
};

// ==========================================
// CONTROLADORES DE DETALLE FACTURAS DE COMPRAS
// ==========================================

export const ObtenerDetalleFacturaCompraController = async (req, res) => {
    try {
        const result = await GestionarDetalleFacturasCompras(TipoOperacionObtener, { // Operación 4: Obtener
            CodigoFactura: req.query.CodigoFactura || req.params.CodigoFactura,
            CodigoDetalle: req.query.CodigoDetalle || req.params.CodigoDetalle,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerDetalleFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};

export const CrearDetalleFacturaCompraController = async (req, res) => {
    try {
        const result = await GestionarDetalleFacturasCompras(TipoOperacionCrear, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("CrearDetalleFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};

export const EditarDetalleFacturaCompraController = async (req, res) => {
    try {
        const result = await GestionarDetalleFacturasCompras(TipoOperacionEditar, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("EditarDetalleFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};

export const EliminarDetalleFacturaCompraController = async (req, res) => {
    try {
        const result = await GestionarDetalleFacturasCompras(TipoOperacionEliminar, { // Operación 3: Eliminar
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("EliminarDetalleFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};

export const RecalcularTotalesFacturaCompraController = async (req, res) => {
    try {
        const result = await RecalcularTotalesFacturaCompra({
            CodigoFactura: req.body.CodigoFactura || req.query.CodigoFactura,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("RecalcularTotalesFacturaCompraController:", err);
        CatchControlador(res, err);
    }
};
