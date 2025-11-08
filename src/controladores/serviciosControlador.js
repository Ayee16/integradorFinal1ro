import ServiciosServicio from "../servicios/serviciosServicio.js";
import apicache from "apicache";

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

    crear = async (req, res) => {
        try {
            const {descripcion, importe, activo} = req.body;
            const servicio =  {
                descripcion, 
                importe,
                activo,
            }   

            const nuevoServicio = await this.ServiciosServicio.crear(servicio);

            if (!nuevoServicio) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Servicio no creado'
                })
            }

            apicache.clear('/api/v1/servicios'); //cualquier cosa borrar

            res.json({
                estado: true, 
                mensaje: 'Servicio creado!',
                servicio: nuevoServicio
            });
    
        } catch (err) {
            console.log('Error en POST /servicios/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }

    modificar = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id;
            const datos = req.body;

            // llamar al método modificar de la instancia
            const servicioModificado = await this.ServiciosServicio.modificar(servicio_id, datos);

            if (!servicioModificado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'servicio no encontrado para ser modificado'
                });
            }

            apicache.clear('/api/v1/servicios'); //cualquier cosa borrar

            res.json({
                estado: true,
                mensaje: 'Servicio modificado',
                servicio: servicioModificado
            });
        } catch (error) {
            console.log('Error en PUT /servicios/:servicio_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
        }   
    }
    
    eliminar = async (req, res) => {
        try {
            const servicio_id = req.params.servicio_id;
            const servicioEliminado = await this.ServiciosServicio.eliminar(servicio_id);
            
            if (!servicioEliminado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Servicio no encontrado'
                });
            }
            
            apicache.clear('/api/v1/servicios'); //cualquier cosa borrar

            res.json({
                estado: true,
                mensaje: 'Servicio eliminado'
            });

        } catch (error) {
            console.log('Error en DELETE /servicios/servicio_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }
}