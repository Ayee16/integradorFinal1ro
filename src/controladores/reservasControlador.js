import ReservasServicio from "../servicios/reservasServicio.js";

export default class ReservasControlador{

    constructor(){
        this.reservasServicio = new ReservasServicio();
    }

    buscarTodos = async(req,res) =>{
        try{
            const reservas = await this.reservasServicio.buscarTodos(); //leo la info
            res.json({
                estado : true,
                datos : reservas,
            });

        }catch(error){
            console.log('Error al obtener las reservas',error)
            res.status(500).json({
                estado: false,
                mensaje: 'error interno del servidor',
            });
        }
    }

}