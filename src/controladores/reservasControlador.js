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

    buscarPorId = async (req, res) => {
    try {
        const reserva_id = req.params.reserva_id;
        const reservaFilas = await this.reservasServicio.buscarPorId(reserva_id);

        const datos = [];

        if (Array.isArray(reservaFilas)) {
            reservaFilas.forEach(fila => {
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
        } else {
            
            const servicio = {
                servicio_id: reservaFilas.servicio_id,
                descripcion: reservaFilas.servicio_descripcion,
                importe: reservaFilas.servicio_importe
            };

            
            datos.push({
                reserva_id: reservaFilas.reserva_id,
                fecha_reserva: reservaFilas.fecha_reserva,
                tematica: reservaFilas.tematica,
                importe_salon: reservaFilas.importe_salon,
                importe_total: reservaFilas.importe_total,
                salon_id: reservaFilas.salon_id,
                salon_titulo: reservaFilas.salon_titulo,
                salon_direccion: reservaFilas.direccion,
                salon_capacidad: reservaFilas.capacidad,
                salon_importe: reservaFilas.salon_importe,
                turno_id: reservaFilas.turno_id,
                hora_desde: reservaFilas.hora_desde,
                hora_hasta: reservaFilas.hora_hasta,
                servicios: [servicio]
            });
        }

        res.json({
            estado: true,
            datos: datos[0]  
        });

    } catch (error) {
        console.error("Error al obtener la reserva por ID", error);
        res.status(500).json({
            estado: false,
            mensaje: "Error interno del servidor"
        });
    }
}


    modificar = async (req, res) => {
    try {
        const reserva_id = req.params.reserva_id;
        const datosReserva = req.body;

        const reservaModificada = await this.reservasServicio.modificar(reserva_id, datosReserva);

        if (!reservaModificada) {
            return res.status(404).json({
                estado: false,
                mensaje: "Reserva no encontrada"
            });
        }

        res.json({
            estado: true,
            mensaje: "Reserva modificada correctamente",
            reserva: reservaModificada
        });

    } catch (error) {
        console.error("Error al modificar la reserva", error);
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

            const nuevaReservaFilas = await this.reservasServicio.crear(reserva)

            if (!nuevaReservaFilas || !Array.isArray(nuevaReservaFilas) || nuevaReservaFilas.length === 0) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Reserva no creada'
                })
            }

            // Procesar el array de filas en un objeto único con servicios agrupados
            const datos = [];
            nuevaReservaFilas.forEach(fila => {
                let reservaExistente = datos.find(r => r.reserva_id === fila.reserva_id);
                const servicio = fila.servicio_id ? {
                    servicio_id: fila.servicio_id,
                    descripcion: fila.servicio_descripcion,
                    importe: fila.servicio_importe
                } : null;

                if (reservaExistente) {
                    if (servicio) {
                        reservaExistente.servicios.push(servicio);
                    }
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
                        servicios: servicio ? [servicio] : []
                    });
                }
            });

            res.json({
                estado: true, 
                mensaje: 'Reserva creada!',
                reserva: datos[0]
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