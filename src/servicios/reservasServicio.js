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

    modificar = async (reserva_id, datos) => {
    const existe = await this.reserva.buscarPorId(reserva_id);

    if (!existe) {
        return null;
    }

    // const modificada = await this.reserva.modificar(reserva_id, datos);
    // if (!modificada) {
    //     return null;
    // }
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