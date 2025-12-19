import { pool } from "../db.js";
import { IsNull, ValidarRespuestaSp } from "../utils/util.js";
import {
    TypeResultErrorNoControlado,
    SpGestionarFacturasCompras,
    SpGestionarDetalleFacturasCompras,
} from "../utils/constantes.js";

// ==========================================
// GESTIÓN DE FACTURAS DE COMPRAS
// ==========================================

export const GestionarFacturasCompras = async (TipoOperacion, datos) => {
    try {
        const {
            CodigoFactura,
            NumeroFactura,
            CodigoProveedor,
            FechaCreacion,
            Observaciones,
            CodigoEstado,
            CodigoMetodoPago,
            Pagina,
            TamanoPagina,
            CodigoUsuario,
        } = datos;

        const Params = {
            pnTipoOperacion: TipoOperacion,
            pnCodigoFactura: IsNull(CodigoFactura),
            pcNumeroFactura: IsNull(NumeroFactura),
            pnCodigoProveedor: IsNull(CodigoProveedor),
            pdFechaCreacion: IsNull(FechaCreacion),
            pcObservaciones: IsNull(Observaciones),
            pnCodigoEstado: IsNull(CodigoEstado),
            pnCodigoMetodoPago: IsNull(CodigoMetodoPago),
            pnPagina: IsNull(Pagina),
            pnTamanoPagina: IsNull(TamanoPagina),
            pnCodigoUsuario: IsNull(CodigoUsuario),
        };

        const orderedParams = Object.values(Params);

        await pool.query(
            `CALL ${SpGestionarFacturasCompras}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
            [...orderedParams]
        );

        const [output] = await pool.query(
            `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
        );
        const { typeResult, result, message } = output[0];
        return ValidarRespuestaSp(typeResult, message, result);
    } catch (err) {
        console.error("GestionarFacturasComprasService", err);
        return ValidarRespuestaSp(
            TypeResultErrorNoControlado,
            "GestionarFacturasComprasService: " + err
        );
    }
};

export const GestionarDetalleFacturasCompras = async (TipoOperacion, datos) => {
    try {
        console.log("TipoOperacion", TipoOperacion);
        console.log("datos", datos);
        const {
            CodigoDetalle,
            CodigoFactura,
            CodigoInventario,
            Cantidad,
            PrecioCompra,
            CodigoTipoImpuesto,
            CodigoUsuario,
        } = datos;

        const Params = {
            pnTipoOperacion: TipoOperacion,
            pnCodigoDetalle: IsNull(CodigoDetalle),
            pnCodigoFactura: IsNull(CodigoFactura),
            pnCodigoInventario: IsNull(CodigoInventario),
            pnCantidad: IsNull(Cantidad),
            pdPrecioCompra: IsNull(PrecioCompra),
            pnCodigoTipoImpuesto: IsNull(CodigoTipoImpuesto),
            pnCodigoUsuario: IsNull(CodigoUsuario),
        };

        const orderedParams = Object.values(Params);

        await pool.query(
            `CALL ${SpGestionarDetalleFacturasCompras}(?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
            [...orderedParams]
        );

        const [output] = await pool.query(
            `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
        );
        const { typeResult, result, message } = output[0];
        return ValidarRespuestaSp(typeResult, message, result);
    } catch (err) {
        console.error("GestionarDetalleFacturasComprasService", err);
        return ValidarRespuestaSp(
            TypeResultErrorNoControlado,
            "GestionarDetalleFacturasComprasService: " + err
        );
    }
};

export const ObtenerTotalFacturasCompras = async (datos = {}) => {
    try {
        const { CodigoEstado, CodigoProveedor, CodigoUsuario } = datos;

        const TipoOperacion = 5; // Operación 5 = Obtener total

        await pool.query(
            `CALL ${SpGestionarFacturasCompras}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
            [
                TipoOperacion,
                IsNull(null), // CodigoFactura
                IsNull(null), // NumeroFactura
                IsNull(CodigoProveedor),
                IsNull(null), // FechaCreacion
                IsNull(null), // Observaciones
                IsNull(CodigoEstado),
                IsNull(null), // CodigoMetodoPago
                IsNull(null), // Pagina
                IsNull(null), // TamanoPagina
                IsNull(CodigoUsuario),
            ]
        );

        const [output] = await pool.query(
            `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
        );
        const { typeResult, result, message } = output[0];
        return ValidarRespuestaSp(typeResult, message, result);
    } catch (err) {
        console.error("ObtenerTotalFacturasComprasService", err);
        return ValidarRespuestaSp(
            TypeResultErrorNoControlado,
            "ObtenerTotalFacturasComprasService: " + err
        );
    }
};
