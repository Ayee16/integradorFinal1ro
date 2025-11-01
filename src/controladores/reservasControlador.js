import ReservasServicio from "../servicios/reservasServicio.js";

export default class ReservasControlador{

    constructor(){
        this.reservasServicio = new ReservasServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const reservas = await this.reservasServicio.buscarTodos();

            const datos = reservas.reduce((acumulador, fila) => {
                let reservaExistente = acumulador.find(item => item.reservaId === fila.reserva_id);

                const servicioActual = {
                    id: fila.servicio_id,
                    descripcion: fila.servicio_descripcion,
                    importe: fila.servicio_importe
                };

                if (reservaExistente) {
                    reservaExistente.servicios.push(servicioActual);
                } else {
                    acumulador.push({
                        reservaId: fila.reserva_id,
                        fecha: fila.fecha_reserva,
                        tematica: fila.tematica,
                        importeSalon: fila.importe_salon,
                        importeTotal: fila.importe_total,
                        salon: {
                            id: fila.salon_id,
                            titulo: fila.salon_titulo,
                            direccion: fila.direccion,
                            capacidad: fila.capacidad,
                            importe: fila.salon_importe
                        },
                        turno: {
                            id: fila.turno_id,
                            desde: fila.hora_desde,
                            hasta: fila.hora_hasta
                        },
                        servicios: [servicioActual]
                    });
                }

                return acumulador;
            }, []);

            res.json({
                estado: true,
                datos
            });

        } catch (error) {
            console.log("Error al obtener las reservas", error);
            res.status(500).json({
                estado: false,
                mensaje: "Error interno del servidor"
            });
        }
    }
    
}
