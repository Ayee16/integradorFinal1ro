// src/servicios/reportesServicio.js
import { conexion } from "../db/conexion.js";

export default class ReportesServicio {
    async obtenerReporteReservas() {
        try {
            
            const [datos] = await conexion.query("CALL reporte_reservas_por_mes();");

            
            return datos[0];
        } catch (error) {
            console.error("Error obteniendo reporte de reservas:", error);
            throw error;
        }
    }
}
