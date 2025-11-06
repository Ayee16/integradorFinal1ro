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

    buscarPorId = async (reserva_id) => {
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
        LEFT JOIN reservas_servicios AS rs ON rs.reserva_id = r.reserva_id
        LEFT JOIN servicios AS sv ON sv.servicio_id = rs.servicio_id
        WHERE r.activo = 1 AND r.reserva_id = ?
    `;
    
    const [reserva] = await conexion.execute(sql, [reserva_id]);
    if (reserva.length === 0) {
        return null;
    }
    return reserva;
};

    crear = async(reserva) => {
        const {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                importe_salon,
                importe_total 
            } = reserva;
        
        const sql = `INSERT INTO reservas 
            (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) 
            VALUES (?,?,?,?,?,?,?,?)`;
        
        const [result] = await conexion.execute(sql, 
            [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]);

        if (result.affectedRows === 0){
            return null;
        }

        return this.buscarPorId(result.insertId);
        }


    modificar = async (reserva_id, reserva) => {
        const {
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero,
            tematica,
            importe_salon,
            importe_total
        } = reserva;

        const sql = `
            UPDATE reservas 
            SET 
                fecha_reserva = ?, 
                salon_id = ?, 
                usuario_id = ?, 
                turno_id = ?, 
                foto_cumpleaniero = ?, 
                tematica = ?, 
                importe_salon = ?, 
                importe_total = ?
            WHERE reserva_id = ?
        `;

        const [result] = await conexion.execute(sql, [
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero,
            tematica,
            importe_salon,
            importe_total,
            reserva_id
        ]);

        if (result.affectedRows === 0) {
            return null;
        }

        return this.buscarPorId(reserva_id);
    }



    eliminar = async (reserva_id) => {
        const sql = `UPDATE reservas SET activo = 0 WHERE reserva_id = ?`;
        const [result] = await conexion.execute(sql, [reserva_id]);
        return result.affectedRows > 0;
    }

}