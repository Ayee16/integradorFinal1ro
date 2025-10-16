import { conexion } from "./conexion.js";

export default class Usuarios {

    buscarTodos =async(req,res) =>{
        const sql = 'SELECT usuario_id,nombre,apellido,nombre_usuario,tipo_usuario FROM usuarios WHERE activo = 1';      
        const [usuarios] = await conexion.execute(sql);
        return usuarios;

    };

    buscarPorId = async(usuario_id) =>{
        const sql = 'SELECT * FROM usuarios WHERE activo = 1 AND usuario_id = ?';
        const [usuario] = await conexion.execute(sql, [usuario_id]);
        if (usuario.length === '0'){
            return null
        }
        return usuario[0];
    }

    modificar =async(usuario_id,datos) =>{
      const camposAActualizar = Object.keys(datos); //obtengo claves
        const valoresAActualizar = Object.values(datos); //obtengo valores
        const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', '); //junto claves y le agrego ?
        const parametros = [...valoresAActualizar,usuario_id]; //junto valores y salon id y lo meto en const parametros
        const sql = `UPDATE usuarios SET ${setValores} WHERE usuario_id = ?`; //consulta sql
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
                return null //en capa de datos no se retorna informacion solo retorna datos puros
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