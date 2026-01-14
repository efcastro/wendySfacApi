import { pool } from "../db.js";
import { IsNull, ValidarRespuestaSp } from "../utils/util.js";
import {
    TypeResultErrorNoControlado,
    SpGestionarFacturasCompras,
    SpGestionarDetalleFacturasCompras,
} from "../utils/constantes.js";
import fs from "fs";
import path from "path";

// ==========================================
// HELPER: Verificar existencia de imagen de compra
// ==========================================

/**
 * Verifica si existe la imagen de una factura de compra y retorna la URL correcta
 * @param {string} imagenURL - Ruta base sin extensión (ej: uploads/compras/Compra_5)
 * @returns {string|null} - Ruta completa con extensión si existe, null si no existe
 */
const verificarImagenCompra = (imagenURL) => {
    if (!imagenURL) return null;

    const baseDir = process.cwd();
    const extensiones = ['.jpg', '.jpeg', '.png', '.pdf'];

    for (const ext of extensiones) {
        const rutaCompleta = path.join(baseDir, `${imagenURL}${ext}`);
        if (fs.existsSync(rutaCompleta)) {
            return `${imagenURL}${ext}`;
        }
    }

    return null;
};

/**
 * Procesa el resultado del SP y verifica la existencia de imágenes
 * @param {Object|Array} resultado - Resultado del SP (objeto o array de facturas)
 * @returns {Object|Array} - Resultado con ImagenURL verificada
 */
const procesarImagenesFacturas = (resultado) => {
    if (!resultado) return resultado;

    // Si es un array de facturas
    if (Array.isArray(resultado)) {
        return resultado.map(factura => ({
            ...factura,
            ImagenURL: verificarImagenCompra(factura.ImagenURL)
        }));
    }

    // Si es una factura individual
    if (resultado.ImagenURL !== undefined) {
        return {
            ...resultado,
            ImagenURL: verificarImagenCompra(resultado.ImagenURL)
        };
    }

    return resultado;
};

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
            DescuentoGlobalMonto, // Monto fijo de descuento global
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
            pdDescuentoGlobalMonto: IsNull(DescuentoGlobalMonto),
            pnPagina: IsNull(Pagina),
            pnTamanoPagina: IsNull(TamanoPagina),
            pnCodigoUsuario: IsNull(CodigoUsuario),
        };

        const orderedParams = Object.values(Params);

        await pool.query(
            `CALL ${SpGestionarFacturasCompras}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
            [...orderedParams]
        );

        const [output] = await pool.query(
            `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
        );
        const { typeResult, result, message } = output[0];

        // Si la operación es de obtener (4), procesar las imágenes para verificar existencia
        if (TipoOperacion === 4 && result) {
            try {
                const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
                const resultadoProcesado = procesarImagenesFacturas(parsedResult);
                return ValidarRespuestaSp(typeResult, message, JSON.stringify(resultadoProcesado));
            } catch (parseError) {
                // Si hay error al parsear, devolver el resultado original
                return ValidarRespuestaSp(typeResult, message, result);
            }
        }

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
            CodigoEmpaquetado,
            DescuentoMonto, // Monto fijo de descuento por ítem
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
            pnCodigoEmpaquetado: IsNull(CodigoEmpaquetado),
            pdDescuentoMonto: IsNull(DescuentoMonto),
            pnCodigoUsuario: IsNull(CodigoUsuario),
        };

        const orderedParams = Object.values(Params);

        await pool.query(
            `CALL ${SpGestionarDetalleFacturasCompras}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
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
            `CALL ${SpGestionarFacturasCompras}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
            [
                TipoOperacion,
                IsNull(null), // CodigoFactura
                IsNull(null), // NumeroFactura
                IsNull(CodigoProveedor),
                IsNull(null), // FechaCreacion
                IsNull(null), // Observaciones
                IsNull(CodigoEstado),
                IsNull(null), // CodigoMetodoPago
                IsNull(null), // DescuentoGlobalMonto
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

/**
 * Recalcula los totales de una factura de compra basándose en sus detalles
 * @param {Object} datos - Objeto con CodigoFactura y CodigoUsuario
 * @returns {Promise<Object>} - Resultado con los totales recalculados
 */
export const RecalcularTotalesFacturaCompra = async (datos) => {
    try {
        const { CodigoFactura, CodigoUsuario } = datos;

        const TipoOperacion = 5; // Operación 5 = Recalcular totales

        const Params = {
            pnTipoOperacion: TipoOperacion,
            pnCodigoDetalle: IsNull(null),
            pnCodigoFactura: IsNull(CodigoFactura),
            pnCodigoInventario: IsNull(null),
            pnCantidad: IsNull(null),
            pdPrecioCompra: IsNull(null),
            pnCodigoTipoImpuesto: IsNull(null),
            pnCodigoEmpaquetado: IsNull(null),
            pdDescuentoMonto: IsNull(null),
            pnCodigoUsuario: IsNull(CodigoUsuario),
        };

        const orderedParams = Object.values(Params);

        await pool.query(
            `CALL ${SpGestionarDetalleFacturasCompras}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
            [...orderedParams]
        );

        const [output] = await pool.query(
            `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
        );
        const { typeResult, result, message } = output[0];
        return ValidarRespuestaSp(typeResult, message, result);
    } catch (err) {
        console.error("RecalcularTotalesFacturaCompraService", err);
        return ValidarRespuestaSp(
            TypeResultErrorNoControlado,
            "RecalcularTotalesFacturaCompraService: " + err
        );
    }
};

