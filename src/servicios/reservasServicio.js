import Reservas from "../db/reservas.js";

export default class ReservasServicio {

    constructor(){
        this.reserva = new Reservas();
    }

    buscarTodos = () => {
        return this.reserva.buscarTodos();
    }

    buscarPorId = (reserva_id) => {
        return this.reserva.buscarPorId(reserva_id);
    }

    eliminar = async (reserva_id) =>{
    const existe = await this.reservas.buscarPorId(reserva_id);
    if (!existe) {
        return null;
    }
    return this.reservas.eliminar(reserva_id);
    }

}