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

    modificar = async(salon_id,datos) => {

        const camposAActualizar = Object.keys(datos); //obtengo claves
        const valoresAActualizar = Object.values(datos); //obtengo valores
        const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', '); //junto claves y le agrego ?
        const parametros = [...valoresAActualizar,salon_id]; //junto valores y salon id y lo meto en const parametros
        const sql = `UPDATE salones SET ${setValores} WHERE salon_id = ?`; //consulta sql
        const [result] = await conexion.execute(sql,parametros);
        if (result.affectedRows ===0){
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
}


