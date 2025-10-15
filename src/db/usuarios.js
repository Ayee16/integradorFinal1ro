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

    crear =async(req,res) =>{
        
    };

    eliminar =async(req,res) =>{
        
    };
}