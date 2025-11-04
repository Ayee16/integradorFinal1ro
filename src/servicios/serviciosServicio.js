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

    crear = (servicio) => {
        return this.servicios.crear(servicio);
    }

    modificar = async (servicio_id, datos) =>{
    const existe = await this.servicios.buscarPorId(servicio_id);
    if (!existe) {
        return null;
    }
    return this.servicios.modificar(servicio_id, datos);
    }

    eliminar = async (servicio_id) =>{
    const existe = await this.servicios.buscarPorId(servicio_id);
    if (!existe) {
        return null;
    }
    return this.servicios.eliminar(servicio_id);
    }
}
