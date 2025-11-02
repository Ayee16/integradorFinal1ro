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

};


