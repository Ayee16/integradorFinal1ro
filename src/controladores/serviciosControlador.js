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

}