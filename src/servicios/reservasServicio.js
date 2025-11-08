import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import { conexion } from '../db/conexion.js';
import NotificacionesServicio from './notificacionesServicio.js';

export default class ReservasServicio {

    constructor(){
        this.reserva = new Reservas();
        this.reservas_servicios = new ReservasServicios();
        this.notificaciones = new NotificacionesServicio();
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

        if (servicios && Array.isArray(servicios) && servicios.length > 0) {
            await this.reservas_servicios.crear(reserva_id, servicios);
        }

        const reservaCompleta = await this.reserva.buscarPorId(reserva_id);


        if (reservaCompleta && Array.isArray(reservaCompleta) && reservaCompleta.length > 0) {

            const datosNotificacion = {
                usuario_id: usuario_id,
                fecha_reserva: fecha_reserva,
                salon_titulo: reservaCompleta[0].salon_titulo,
                hora_desde: reservaCompleta[0].hora_desde,
                hora_hasta: reservaCompleta[0].hora_hasta,
                datos: reservaCompleta[0]
            };
            

            this.notificaciones.enviarNotificacionReserva(datosNotificacion)
                .catch(error => {
                    console.error('Error al enviar notificación (no crítico):', error);
                });
        }

        return reservaCompleta;
    }

    eliminar = async (reserva_id) =>{
    const existe = await this.reserva.buscarPorId(reserva_id);
    if (!existe) {
        return null;
    }
    return this.reserva.eliminar(reserva_id);
    }

    generarInforme = async (formato) => {
    if (formato === 'pdf') {
        
        const datosReporte = await this.generarReporteCSV();

        
        const pdf = await this.informes.informeReservasPdf(datosReporte);
        
        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="reporte.pdf"'
            }
        };

    } else if (formato === 'csv') {
        
        const datosReporte = await this.generarReporteCSV();

        
        const csv = await this.informes.informeReservasCsv(datosReporte);
        
        return {
            path: csv,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="reporte.csv"'
            }
        };
    }
}
}