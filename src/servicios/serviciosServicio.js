import Servicios from '../db/servicios.js'

export default class ServiciosServicio{

    constructor(){
        this.servicios = new Servicios();
    }

    buscarTodos = () => {
        return this.servicios.buscarTodos();
    }
}
