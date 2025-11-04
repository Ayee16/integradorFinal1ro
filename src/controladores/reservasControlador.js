import ReservasServicio from "../servicios/reservasServicio.js";

export default class ReservasControlador{

    constructor(){
        this.reservasServicio = new ReservasServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const reservasConServicios = await this.reservasServicio.buscarTodos();

            const datos = [];

            reservasConServicios.forEach((fila) => {
                let reservaExistente = datos.find(r => r.reserva_id === fila.reserva_id);

                const servicio = {
                    servicio_id: fila.servicio_id,
                    descripcion: fila.servicio_descripcion,
                    importe: fila.servicio_importe
                };

                if (reservaExistente) {
                    reservaExistente.servicios.push(servicio);
                } else {
                    datos.push({
                        reserva_id: fila.reserva_id,
                        fecha_reserva: fila.fecha_reserva,
                        tematica: fila.tematica,
                        importe_salon: fila.importe_salon,
                        importe_total: fila.importe_total,
                        salon_id: fila.salon_id,
                        salon_titulo: fila.salon_titulo,
                        salon_direccion: fila.direccion,
                        salon_capacidad: fila.capacidad,
                        salon_importe: fila.salon_importe,
                        turno_id: fila.turno_id,
                        hora_desde: fila.hora_desde,
                        hora_hasta: fila.hora_hasta,

                        servicios: [servicio]
                    });
                }
            });

            res.json({
                estado: true,
                datos
            });

        } catch (error) {
            console.error("Error al obtener las reservas", error);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor"
            });
        }
    }

    crear = async (req, res) => {
        try {
            
            const {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                importe_salon,
                importe_total,
                servicios } = req.body;

            const reserva = {
                fecha_reserva,
                salon_id,
                usuario_id,
                turno_id,
                foto_cumpleaniero, 
                tematica,
                importe_salon,
                importe_total, 
                servicios
            };

            const nuevaReserva = await this.reservasServicio.crear(reserva)

            if (!nuevaReserva) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no creada'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Reserva creada!',
                salon: nuevaReserva
            });
    
        } catch (err) {
            console.log('Error en POST /reservas/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    
    eliminar = async (req, res) => {
        try {
            const reserva_id = req.params.reserva_id;
            const reservaEliminada = await this.reservasServicio.eliminar(reserva_id);

            if (!reservaEliminada) {
                return res.status(404).json({
                    estado: false,
                    mensaje: "Reserva no encontrada"
                });
            }

            res.json({
                estado: true,
                mensaje: "Reserva eliminada correctamente"
            });

        } catch (error) {
            console.error("Error al eliminar la reserva", error);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor"
            });
        }
    }

}