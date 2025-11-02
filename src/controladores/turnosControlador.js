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
                mensaje: 'Error interno del servidor',
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
}