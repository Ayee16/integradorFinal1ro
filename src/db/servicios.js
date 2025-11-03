import { conexion } from "./conexion.js";

export default class Servicios{

    buscarTodos = async() => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        const servicios = conexion.execute(sql);
        return servicios;
    }
    
    buscarPorId = async (servicio_id) => {
        const sql = `SELECT servicio_id, descripcion, importe, activo 
                        FROM servicios AS s
                        WHERE s.servicio_id = ? AND s.activo = 1;`
        const [result] = await conexion.execute(sql, [servicio_id]);
        return result[0];
    }

    crear = async(servicio) =>{
            const {descripcion, importe, activo} = servicio;
            const sql = 'INSERT INTO servicios (descripcion, importe, activo) VALUES (?,?,?)' ;
            const [result] = await conexion.execute(sql,[descripcion, importe, activo]);
            if (result.affectedRows == 0){
                return null 
            }
            return this.buscarPorId(result.insertId);
        }
    
    eliminar = async (servicio_id) => {
        const sql = 'UPDATE servicios SET activo = 0 WHERE servicio_id = ?';
        const [result] = await conexion.execute(sql, [servicio_id]);
        return result.affectedRows > 0;
    }

};


