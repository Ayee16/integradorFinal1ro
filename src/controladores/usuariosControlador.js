import UsuariosServicio from "../servicios/usuariosServicio.js";

export default class UsuariosControlador{

    constructor(){
        this.UsuarioServicio = new UsuarioServicio();
    }

    buscarTodos = async (req, res) => {
    };


    buscarPorId = async(req,res) => {
    }

    modificar = async(req,res) => {
    }

    crear = async (req, res) => {
    }
    
    eliminar = async (req, res) => {
    }
}