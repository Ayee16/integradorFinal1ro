import Usuarios from "../db/usuarios.js" //agregar siempre el .js

export default class UsuariosServicio {

    constructor(){
        this.usuarios = new Usuarios();
    }

    buscarTodos = () => {
        return this.usuarios.buscarTodos();
    }

    buscarPorId = (usuario_id) => {
        return this.usuarios.buscarPorId(usuario_id);
    }

    modificar = (salon_id,datos) => {

    }

    crear = (usuario) => {
        return this.usuarios.crear(usuario);
    }

    eliminar = async (salon_id) =>{
        
    }
}