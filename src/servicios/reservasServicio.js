import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import { conexion } from '../db/conexion.js';

export default class ReservasServicio {

    constructor(){
        this.reserva = new Reservas();
    }

    buscarTodos = () => {
        return this.reserva.buscarTodos();
    }

    crear = async (reserva) => {
        
        const {
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero, 
            tematica,
            importe_salon,
            importe_total,
            servicios } = reserva;

        const nuevaReserva = {
            fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero, 
            tematica,
            importe_salon,
            importe_total
        }    

        const result = await this.reserva.crear(nuevaReserva);

        if (!result) {
            return null;
        }

        await this.reservas_servicios.crear(result.reserva_id, servicios);     

        return this.reserva.buscarPorId(result.reserva_id);
    }

    eliminar = async (reserva_id) =>{
    const existe = await this.reservas.buscarPorId(reserva_id);
    if (!existe) {
        return null;
    }
    return this.reservas.eliminar(reserva_id);
    }

}