import { conexion } from "./conexion.js";

export default class Usuarios {

    buscarTodos =async(req,res) =>{
        const sql = 'SELECT usuario_id,nombre,apellido,nombre_usuario,tipo_usuario FROM usuarios WHERE activo = 1';      
        const [usuarios] = await conexion.execute(sql);
        return usuarios;

    };

    buscarPorId = async (usuario_id) => {
        const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario, u.usuario_id
                        FROM usuarios AS u
                        WHERE u.usuario_id = ? AND u.activo = 1;`
        const [result] = await conexion.execute(sql, [usuario_id]);
        return result[0];
    }

    modificar =async(usuario_id,datos) =>{
        const camposAActualizar = Object.keys(datos); 
        const valoresAActualizar = Object.values(datos); 
        const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', '); 
        const parametros = [...valoresAActualizar,usuario_id]; 
        const sql = `UPDATE usuarios SET ${setValores} WHERE usuario_id = ?`; 
        const [result] = await conexion.execute(sql,parametros);
        if (result.affectedRows ===0){
            return null;
        }
        return this.buscarPorId(usuario_id); 
    };

    crear = async(usuario) =>{
            const {nombre, apellido, nombre_usuario, tipo_usuario, contrasenia,celular} = usuario;
            const sql = 'INSERT INTO usuarios (nombre, apellido, nombre_usuario, tipo_usuario, contrasenia,celular) VALUES (?,?,?,?,?,?)' ;
            const [result] = await conexion.execute(sql,[nombre, apellido, nombre_usuario, tipo_usuario, contrasenia,celular]);
            if (result.affectedRows == 0){
                return null 
            }
            return this.buscarPorId(result.insertId);
        }

    eliminar = async(usuario_id) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ?';
        const [result] = await conexion.execute(sql, [usuario_id]);
        if (result.affectedRows == 0) {
            return null;
        }
        return true;
    };
}