import { conexion } from "./conexion.js";

export default class Salones {
    buscarTodos = async() =>{
        const sql = 'SELECT * FROM salones WHERE activo = 1';      
        const [salones] = await conexion.execute(sql);
        return salones;
    }

    buscarPorId = async(salon_id) =>{
        const sql = 'SELECT * FROM salones WHERE activo = 1 AND salon_id = ?';
        const [salon] = await conexion.execute(sql, [salon_id]);
        if (salon.length === '0'){
            return null
        }
        return salon[0];
    }

    buscarPorIdParaModificar = async(salon_id) => {
        const sql = 'SELECT * FROM salones WHERE salon_id = ?'; // Sin filtro de activo
        const [salon] = await conexion.execute(sql, [salon_id]);
        if (salon.length === 0){
            return null
        }
        return salon[0];
    }

    modificar = async(salon_id, datos) => {
        // Definir campos válidos para modificar
        const camposValidos = ['titulo', 'direccion', 'capacidad', 'importe'];
        
        // Validar que todos los campos sean válidos
        const camposInvalidos = Object.keys(datos).filter(campo => !camposValidos.includes(campo));
        
        if (camposInvalidos.length > 0) {
            throw new Error(`Campos no válidos: ${camposInvalidos.join(', ')}`);
        }
        
        // Si no hay campos para actualizar
        if (Object.keys(datos).length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }
        
        const camposAActualizar = Object.keys(datos);
        const valoresAActualizar = Object.values(datos);
        const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresAActualizar, salon_id];
        
        const sql = `UPDATE salones SET ${setValores} WHERE salon_id = ?`;
        const [result] = await conexion.execute(sql, parametros);
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return this.buscarPorId(salon_id);
    }
    
    crear = async(salon) =>{
            const {titulo, direccion, capacidad, importe} = salon;
            const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?,?,?,?)' ;
            const [result] = await conexion.execute(sql,[titulo, direccion, capacidad, importe]);
            if (result.affectedRows == 0){
                return null //en capa de datos no se retorna informacion solo retorna datos puros
            }
            return this.buscarPorId(result.insertId);
        }

    eliminar = async(salon_id) =>{
        const sql = 'UPDATE salones SET activo = 0 WHERE salon_id = ?'
        const [result] = await conexion.execute(sql, [salon_id]);
        if (result.affectedRows === 0) {
            return null;
        }
        return true; // o podrías retornar el salon_id eliminado
    }

    cambiarActivo = async (salon_id, activo) => {
        const sql = 'UPDATE salones SET activo = ? WHERE salon_id = ?';
        const [result] = await conexion.execute(sql, [activo, salon_id]);
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return this.buscarPorIdParaModificar(salon_id);
    }
}


