import Usuarios from "../db/usuarios.js";

export default class UsuariosServicio {
    constructor(){
        this.usuarios = new Usuarios();
    }

    buscarTodos = () => this.usuarios.buscarTodos();

    buscarPorUsuario = (nombre_usuario) => {
        return this.usuarios.buscarPorUsuario(nombre_usuario);
    };

    buscarPorId = (usuario_id) => this.usuarios.buscarPorId(usuario_id);

    modificar = (usuario_id, datos) => {
        return this.usuarios.modificar(usuario_id, datos);
    };

    crear = (usuario) => this.usuarios.crear(usuario);

    eliminar = async (usuario_id) => {
        const existe = await this.usuarios.buscarPorId(usuario_id);
        if (!existe) return null;
        return this.usuarios.eliminar(usuario_id);
    };
}