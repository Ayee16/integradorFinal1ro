import ServiciosServicio from "../servicios/serviciosServicio.js";

export default class ServiciosControlador{
    
    constructor(){
        this.ServiciosServicio = new ServiciosServicio();
    }

    buscarTodos = async(req,res) =>{
        try{
            const [servicios] = await this.ServiciosServicio.buscarTodos();
            res.json({
                estado: true,
                datos: servicios,
            });
        } catch(error) {
            console.log('Error al obtener los servicios', error)
            res.status(500).json({
                estado: false,
                mensaje: 'error interno del servidor'
            });
        }
    }

    buscarPorId = async(req,res) => {
        try{
            const servicio_id = req.params.servicio_id;
            const servicio = await this.ServiciosServicio.buscarPorId(servicio_id);
            
            if (!servicio){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'servicio no encontrado'
                })
            }
            
            res.json({
                estado: true,
                servicio: servicio
            })
        }catch(error){
            console.log('Error en GET /servicios/servicio_id', error)
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            })
        }
    }

}