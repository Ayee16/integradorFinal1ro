import TurnosServicio from '../servicios/turnosServicio.js'

export default class TurnosControlador {

    constructor(){
        this.TurnosServicio = new TurnosServicio()
    }

    buscarTodos = async(req,res) =>{
        try{
            const [turnos] = await this.TurnosServicio.buscarTodos(); //leo la info
            res.json({
                estado : true,
                datos : turnos
            });

        }catch(error){
            console.log('Error al obtener los turnos',error)
            res.status(500).json({
                estado: false,
                mensaje: 'error interno del servidor',
            });
        }
    }

    buscarPorId = async(req,res) => {
        try{
            const turno_id = req.params.turno_id;
            const turno = await this.TurnosServicio.buscarPorId(turno_id);
            
            if (!turno){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado'
                })
            }
            
            res.json({
                estado: true,
                salon: turno
            })
        }catch(error){
            console.log('Error en GET /turnos/turno_id', error)
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            })
        }
    }

    crear = async (req, res) => {
        try {
            const {orden, hora_desde, hora_hasta, activo} = req.body;
            const turno =  {
                orden, 
                hora_desde, 
                hora_hasta, 
                activo,
            }   

            const nuevoTurno = await this.TurnosServicio.crear(turno);

            if (!nuevoTurno) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no creado'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Turno creado!',
                turno: nuevoTurno
            });
    
        } catch (err) {
            console.log('Error en POST /turnos/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    eliminar = async (req, res) => {
        try {
            const { turno_id } = req.params;
            const turnoEliminar = await this.TurnosServicio.eliminar(turno_id);

            const eliminado = turnoEliminar && (turnoEliminar.affectedRows === 1 || turnoEliminar === 1 || turnoEliminar === true);

            if (!eliminado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Turno no encontrado'
                });
            }

            return res.json({
                estado: true,
                mensaje: 'Turno eliminado'
            });

        } catch (err) {
            console.log('Error en DELETE /turnos/:turno_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }       
}