import Servicios from '../db/servicios.js'

export default class ServiciosServicio{

    constructor(){
        this.servicios = new Servicios();
    }

    buscarTodos = () => {
        return this.servicios.buscarTodos();
    }

    eliminar = async (servicio_id) =>{
    const existe = await this.servicios.buscarPorId(servicio_id);
    if (!existe) {
        return null;
    }
    return this.servicios.eliminar(servicio_id);
    }
}
