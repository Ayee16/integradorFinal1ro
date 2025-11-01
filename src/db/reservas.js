import { conexion } from "./conexion.js";

export default class Reservas {

    buscarTodos = async () => {
    const sql = `
        SELECT 
            r.reserva_id,
            r.fecha_reserva,
            r.tematica,
            r.importe_salon,
            r.importe_total,
            s.salon_id,
            s.titulo AS salon_titulo,
            s.direccion,
            s.capacidad,
            s.importe AS salon_importe,
            t.turno_id,
            t.hora_desde,
            t.hora_hasta,
            sv.servicio_id,
            sv.descripcion AS servicio_descripcion,
            rs.importe AS servicio_importe
        FROM reservas AS r
        INNER JOIN salones AS s ON s.salon_id = r.salon_id
        INNER JOIN turnos AS t ON t.turno_id = r.turno_id
        INNER JOIN reservas_servicios AS rs ON rs.reserva_id = r.reserva_id
        INNER JOIN servicios AS sv ON sv.servicio_id = rs.servicio_id
        WHERE r.activo = 1
    `;
    const [reservas] = await conexion.execute(sql);
    return reservas;
    }

}