import { conexion } from "./conexion.js";

export default class Usuarios {

    buscarTodos =async(req,res) =>{
        const sql = 'SELECT * FROM usuarios WHERE activo = 1';      
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

    modificar =async(req,res) =>{
        
    };

    crear = async(usuario) =>{
            const {nombre, apellido, nombre_usuario, tipo_usuario, contrasenia} = usuario;
            const sql = 'INSERT INTO usuarios (nombre, apellido, nombre_usuario, tipo_usuario, contrasenia) VALUES (?,?,?,?,?)' ;
            const [result] = await conexion.execute(sql,[nombre, apellido, nombre_usuario, tipo_usuario, contrasenia]);
            if (result.affectedRows == 0){
                return null //en capa de datos no se retorna informacion solo retorna datos puros
            }
            return this.buscarPorId(result.insertId);
        }

    eliminar =async(req,res) =>{
        
    };
}