import { conexion } from "./conexion.js";

export default class Turnos {
    buscarTodos = async() =>{
        const sql = 'SELECT * FROM turnos WHERE activo=1'; 
        const turnos = conexion.execute(sql); 
        return turnos; 
    }

    buscarPorId = async (turno_id) => {
        const sql = `SELECT turno_id, orden, activo, CONCAT(t.hora_desde, '-', t.hora_hasta) as horario
                        FROM turnos AS t
                        WHERE t.turno_id = ? AND t.activo = 1;`
        const [result] = await conexion.execute(sql, [turno_id]);
        return result[0];
    }

    crear = async(turno) =>{
            const {orden, hora_desde, hora_hasta, activo} = turno;
            const sql = 'INSERT INTO turnos (orden, hora_desde, hora_hasta, activo) VALUES (?,?,?,?)' ;
            const [result] = await conexion.execute(sql,[orden, hora_desde, hora_hasta, activo]);
            if (result.affectedRows == 0){
                return null 
            }
            return this.buscarPorId(result.insertId);
        }
    
    modificar = async (turno_id, datos) => {
    const sql = `
        UPDATE turnos 
        SET 
            orden = ?, 
            hora_desde = ?, 
            hora_hasta = ?, 
            activo = ?
        WHERE turno_id = ?
    `;

    const [resultado] = await conexion.execute(sql, [
        datos.orden,
        datos.hora_desde,
        datos.hora_hasta,
        datos.activo ?? 1,
        turno_id
    ]);

    if (resultado.affectedRows === 0) {
        return null;
    }
    return this.buscarPorId(turno_id);
}

    eliminar = async(turno_id) => {
        const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ?';
        const [result] = await conexion.execute(sql, [turno_id]);
        return result.affectedRows > 0;
    }
}