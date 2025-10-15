import { conexion } from "./conexion.js";

export default class Usuarios {

    buscarTodos =async(req,res) =>{
        const sql = 'SELECT * FROM usuarios WHERE activo = 1';      
        const [usuarios] = await conexion.execute(sql);
        return usuarios;

    };

    buscarPorId =async(req,res) =>{
        
    };

    modificar =async(req,res) =>{
        
    };

    crear =async(req,res) =>{
        
    };

    eliminar =async(req,res) =>{
        
    };
}