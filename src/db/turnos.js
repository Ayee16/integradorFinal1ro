import { conexion } from "./conexion.js";

export default class Turnos {
    buscarTodos = async() =>{
        const sql = 'SELECT * FROM turnos WHERE activo=1'; //creo consulta
        const turnos = conexion.execute(sql); //me conecto a la db y paso consulta
        return turnos; //retorno consulta
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

}