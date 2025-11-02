import Servicios from '../db/servicios.js'

export default class ServiciosServicio{

    constructor(){
        this.servicios = new Servicios();
    }

    buscarTodos = () => {
        return this.servicios.buscarTodos();
    }

    buscarPorId = (servicio_id) => {
        return this.servicios.buscarPorId(servicio_id);
    }
}
