import Reservas from "../db/reservas.js";

export default class ReservasServicio {

    constructor(){
        this.reserva = new Reservas();
    }

    buscarTodos = () => {
        return this.reserva.buscarTodos();
    }

}