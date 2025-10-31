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
}