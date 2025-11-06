import Usuarios from "../db/usuarios.js" //agregar siempre el .js

export default class UsuariosServicio {

    constructor(){
        this.usuarios = new Usuarios();
    }

    buscarTodos = () => {
        return this.usuarios.buscarTodos();
    }

    buscarPorUsuario = (usuario_id, contrasenia) => {
        return this.usuarios.buscarPorUsuario(usuario_id,contrasenia);
    }

    buscarPorId = (usuario_id) => {
        return this.usuarios.buscarPorId(usuario_id);
    }

    modificar = (usuario_id,datos) => {
        const existe = this.usuarios.buscarPorId(usuario_id);
        if (!existe) {
            return { error: 'Usuario no encontrado' }; 
        }
        return this.usuarios.modificar(usuario_id,datos);
    }

    crear = (usuario) => {
        return this.usuarios.crear(usuario);
    }

    eliminar = async (usuario_id) => {
        const existe = await this.usuarios.buscarPorId(usuario_id);
        if (!existe) {
            return null;
        }
        return this.usuarios.eliminar(usuario_id);
    }
}