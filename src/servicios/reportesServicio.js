    // src/servicios/reportesServicio.js
    import { conexion } from "../database/conexion.js";

    export default class ReportesServicio {
    async obtenerReporteReservas() {
        try {
        // Llamás al procedimiento almacenado
        const [datos] = await conexion.query("CALL reporte_reservas_por_mes();");

        // MySQL devuelve un array anidado, así que devolvemos la primera parte
        return datos[0];
        } catch (error) {
        console.error("Error obteniendo reporte de reservas:", error);
        throw error;
        }
    }
    }
