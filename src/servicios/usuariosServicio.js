import Usuarios from "../db/usuarios.js" //agregar siempre el .js

export default class UsuariosServicio {

    constructor(){
        this.usuarios = new Usuarios();
    }

    buscarTodos = () => {
        return this.usuarios.buscarTodos();
    }

    buscarPorId = (salon_id) => {

    }

    modificar = (salon_id,datos) => {

    }

    crear = (salon) => {

    }

    eliminar = async (salon_id) =>{
        
    }
}