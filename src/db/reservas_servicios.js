import {conexion} from "../db/conexion.js";

export default class ReservasServicios {

    crear = async (reserva_id, servicios) => {
        if (!servicios || !Array.isArray(servicios) || servicios.length === 0) {
            return;
        }

        const sql = "INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)";
        
        for (const servicio of servicios) {
            const { servicio_id, importe } = servicio;
            await conexion.execute(sql, [reserva_id, servicio_id, importe]);
        }
    }

    eliminarPorReserva = async (reserva_id) => {
        const sql = "DELETE FROM reservas_servicios WHERE reserva_id = ?";
        await conexion.execute(sql, [reserva_id]);
    }

}