import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import { conexion } from '../db/conexion.js';

export default class ReservasServicio {

    constructor(){
        this.reserva = new Reservas();
        this.reservas_servicios = new ReservasServicios();
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

    const modificada = await this.reserva.modificar(reserva_id, datos);
    if (!modificada) {
        return null;
    }
    return this.reserva.buscarPorId(reserva_id);
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

        if (!result || !Array.isArray(result) || result.length === 0) {
            return null;
        }

        const reserva_id = result[0].reserva_id;

        // Crear los servicios asociados a la reserva si existen
        if (servicios && Array.isArray(servicios) && servicios.length > 0) {
            await this.reservas_servicios.crear(reserva_id, servicios);
        }

        // Buscar la reserva completa con todos sus datos
        return this.reserva.buscarPorId(reserva_id);
    }

    eliminar = async (reserva_id) =>{
    const existe = await this.reserva.buscarPorId(reserva_id);
    if (!existe) {
        return null;
    }
    return this.reserva.eliminar(reserva_id);
    }

}