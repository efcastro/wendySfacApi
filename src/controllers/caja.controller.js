import {
    TipoOperacionAbrirCaja,
    TipoOperacionCerrarCaja,
    TipoOperacionEstadoCaja,
    TipoOperacionHistorialCaja,
    TipoOperacionValidarFacturacion,
    TipoOperacionResumenVentasCaja,
    TipoOperacionCrearMovimiento,
    TipoOperacionObtenerMovimientos,
    TipoOperacionEliminarMovimiento,
} from "../utils/constantes.js";
import {
    GestionarAperturaCierreCaja,
    GestionarMovimientosCaja,
    ObtenerReporteCierreCaja,
    ObtenerReporteVentasDiarias,
    ObtenerReporteComprasDiarias,
} from "../services/sfac.services.js";
import { CatchControlador } from "../utils/util.js";

// ==========================================
// CONTROLADORES DE APERTURA/CIERRE DE CAJA
// ==========================================

export const AbrirCajaController = async (req, res) => {
    try {
        const result = await GestionarAperturaCierreCaja(TipoOperacionAbrirCaja, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("AbrirCajaController:", err);
        CatchControlador(res, err);
    }
};

export const CerrarCajaController = async (req, res) => {
    try {
        const result = await GestionarAperturaCierreCaja(TipoOperacionCerrarCaja, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("CerrarCajaController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerEstadoCajaController = async (req, res) => {
    try {
        const result = await GestionarAperturaCierreCaja(TipoOperacionEstadoCaja, {
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerEstadoCajaController:", err);
        CatchControlador(res, err);
    }
};

export const ValidarPuedeFacturarController = async (req, res) => {
    try {
        const result = await GestionarAperturaCierreCaja(TipoOperacionValidarFacturacion, {
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ValidarPuedeFacturarController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerHistorialCajaController = async (req, res) => {
    try {
        const result = await GestionarAperturaCierreCaja(TipoOperacionHistorialCaja, {
            ...req.query,
            CodigoUsuario: req.query.CodigoUsuario || req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerHistorialCajaController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerResumenVentasCajaController = async (req, res) => {
    try {
        const result = await GestionarAperturaCierreCaja(TipoOperacionResumenVentasCaja, {
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerResumenVentasCajaController:", err);
        CatchControlador(res, err);
    }
};

// ==========================================
// CONTROLADORES DE MOVIMIENTOS DE CAJA
// ==========================================

export const CrearMovimientoCajaController = async (req, res) => {
    try {
        const result = await GestionarMovimientosCaja(TipoOperacionCrearMovimiento, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("CrearMovimientoCajaController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerMovimientosCajaController = async (req, res) => {
    try {
        const result = await GestionarMovimientosCaja(TipoOperacionObtenerMovimientos, {
            ...req.query,
            CodigoAperturaCierre: req.query.CodigoApertura,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerMovimientosCajaController:", err);
        CatchControlador(res, err);
    }
};

export const EliminarMovimientoCajaController = async (req, res) => {
    try {
        const result = await GestionarMovimientosCaja(TipoOperacionEliminarMovimiento, {
            ...req.body,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("EliminarMovimientoCajaController:", err);
        CatchControlador(res, err);
    }
};

// ==========================================
// CONTROLADORES DE REPORTES
// ==========================================

export const ObtenerReporteCierreCajaController = async (req, res) => {
    try {
        const result = await ObtenerReporteCierreCaja({
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerReporteCierreCajaController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerReporteVentasDiariasController = async (req, res) => {
    try {
        const result = await ObtenerReporteVentasDiarias({
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerReporteVentasDiariasController:", err);
        CatchControlador(res, err);
    }
};

export const ObtenerReporteComprasDiariasController = async (req, res) => {
    try {
        const result = await ObtenerReporteComprasDiarias({
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerReporteComprasDiariasController:", err);
        CatchControlador(res, err);
    }
};


export const ObtenerReporteInventarioController = async (req, res) => {
    try {
        const result = await ObtenerReporteInventario({
            ...req.query,
            CodigoUsuario: req.user?.CodigoUsuario,
        });
        res.status(result.status).json(result.response);
    } catch (err) {
        console.error("ObtenerReporteInventarioController:", err);
        CatchControlador(res, err);
    }
};
