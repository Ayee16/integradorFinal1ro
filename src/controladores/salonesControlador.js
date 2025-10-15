import SalonesServicio from "../servicios/salonesServicio.js";
import apicache from 'apicache';

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

    modificar = async(req, res) => {
        try {
            const salon_id = req.params.salon_id;
            const datos = req.body;
            
            // Validar que se envíen datos
            if (!datos || Object.keys(datos).length === 0) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'No se proporcionaron datos para modificar',
                    campos_validos: ['titulo', 'direccion', 'capacidad', 'importe']
                });
            }
            
            const resultado = await this.SalonesServicio.modificar(salon_id, datos);
            
            // Si hay error en la validación de campos
            if (resultado.error) {
                if (resultado.error.includes('Campos no válidos')) {
                    const camposInvalidos = resultado.error.split(': ')[1].split(', ');
                    return res.status(400).json({
                        estado: false,
                        mensaje: 'Campos no válidos para modificar',
                        campos_invalidos: camposInvalidos,
                        campos_validos: ['titulo', 'direccion', 'capacidad', 'importe']
                    });
                }
                
                if (resultado.error === 'Salón no encontrado') {
                    return res.status(404).json({
                        estado: false,
                        mensaje: 'Salón no encontrado para ser modificado'
                    });
                }
            }
            
            res.json({
                estado: true,
                mensaje: 'Salón modificado correctamente',
                salon: resultado
            });

            // Limpiar cache después de modificar
            apicache.clear('/salones');
            
        } catch(error) {
            console.log('Error en PUT /salones/:salon_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
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

            // Limpiar cache después de crear
            apicache.clear('/salones');
    
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

        // Limpiar cache después de eliminar
        apicache.clear('/salones');
    } catch (error) {
        console.log('Error en DELETE /salones/:salon_id', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor'
        });
    }
}

cambiarActivo = async (req, res) => {
    try {
        const salon_id = req.params.salon_id;
        const { activo } = req.body; // true o false
        
        // Validar que activo sea boolean
        if (typeof activo !== 'boolean') {
            return res.status(400).json({
                estado: false,
                mensaje: 'El campo activo debe ser true o false'
            });
        }
        
        const resultado = await this.SalonesServicio.cambiarActivo(salon_id, activo);
        
        if (resultado.error) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Salón no encontrado'
            });
        }
        
        res.json({
            estado: true,
            mensaje: `Salón ${activo ? 'activado' : 'desactivado'} correctamente`,
            salon: resultado
        });
        
        // Limpiar cache
        apicache.clear('/salones');
        
    } catch (error) {
        console.log('Error en PATCH /salones/:salon_id/activo', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor'
        });
    }
}


}

