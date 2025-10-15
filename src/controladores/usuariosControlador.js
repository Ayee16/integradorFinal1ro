import UsuariosServicio from "../servicios/usuariosServicio.js";

export default class UsuariosControlador{

    constructor(){
        this.UsuarioServicio = new UsuariosServicio();
    }

    buscarTodos = async (req, res) => {
        try{
            const usuarios = await this.UsuarioServicio.buscarTodos();
            res.json({
                estado: true,
                datos: usuarios
            });

        } catch(error){
        console.log('Error al obtener usuarios:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor',
            });
        }
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