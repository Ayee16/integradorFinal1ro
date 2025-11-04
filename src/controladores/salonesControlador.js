import SalonesServicio from "../servicios/salonesServicio.js";

export default class SalonesControlador{

    constructor(){
        this.SalonesServicio = new SalonesServicio();
    }

    buscarTodos = async (req, res) => { //1:12
        try{
            const salones = await this.SalonesServicio.buscarTodos();
            res.json({
                estado: true,
                datos: salones
            });

        } catch(error){
        console.log('Error al obtener salones:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor',
            });
        }
    }

    buscarPorId = async(req,res) => {
        try{
            const salon_id = req.params.salon_id;
            const salon = await this.SalonesServicio.buscarPorId(salon_id);
            
            if (!salon){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'salon no encontrado'
                })
            }
            
            res.json({
                estado: true,
                salon: salon
            })
        }catch(error){
            console.log('Error en GET /salones/salon_id', error)
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            })
        }
    }

    modificar = async(req,res) => {
        try {
            const salon_id = req.params.salon_id;
            const datos = req.body;

            const salonModificado = await this.SalonesServicio.modificar(salon_id,datos);

            if (!salonModificado){
                    return res.status(404).json({
                        estado: false,
                        mensaje: 'salon no encontrado'
                    })
            }

            res.json({
                estado: true,
                mensaje: 'Salon modificado',
                salon: salonModificado
            });

        }catch(error){
            console.log('Error en PUT /salones/:salon_id', error)
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            })
        }
    }

    crear = async (req, res) => {
        try {
            const {titulo, direccion, capacidad, importe} = req.body;
            const salon =  {
                titulo, 
                direccion, 
                capacidad, 
                importe
            }   

            const nuevoSalon = await this.SalonesServicio.crear(salon);

            if (!nuevoSalon) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Salón no creado'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Salón creado!',
                salon: nuevoSalon
            });
    
        } catch (err) {
            console.log('Error en POST /salones/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    
    eliminar = async (req, res) => {
    try {
        const salon_id = req.params.salon_id;
        const salonEliminado = await this.SalonesServicio.eliminar(salon_id);
        
        if (!salonEliminado) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Salón no encontrado'
            });
        }
        
        res.json({
            estado: true,
            mensaje: 'Salón eliminado correctamente'
        });

    } catch (error) {
        console.log('Error en DELETE /salones/:salon_id', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor'
        });
    }
}
}