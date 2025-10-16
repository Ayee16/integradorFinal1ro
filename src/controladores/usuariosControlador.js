import UsuariosServicio from "../servicios/usuariosServicio.js";

export default class UsuariosControlador{

    constructor(){
        this.UsuarioServicio = new UsuariosServicio();
    }

    buscarTodos = async (req, res) => {
        try{
            const usuarios = await this.UsuarioServicio.buscarTodos();
            res.json({
                estado: true,
                datos: usuarios
            });

        } catch(error){
        console.log('Error al obtener usuarios:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor',
            });
        }
    };


    buscarPorId = async(req,res) => {
        try{
            const usuario_id = req.params.usuario_id;
            const usuario = await this.UsuarioServicio.buscarPorId(usuario_id);
            
            if (!usuario){
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado'
                })
            }
            
            res.json({
                estado: true,
                usuario: usuario
            })
        }catch(error){
            console.log('Error en GET /usuarios/usuario_id', error)
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            })
        }
    }

    modificar = async(req,res) => {
        try {
            const usuario_id = req.params.usuario_id;
            const datos = req.body;

            if (!datos || Object.keys(datos).length === 0) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'No se proporcionaron datos para modificar',
                    campos_validos: [
                        'nombre',
                        'apellido',
                        'nombre_usuario',
                        'contrasenia',
                        'tipo_usuario'  
                    ]
                });
            }

            const resultado = await this.UsuarioServicio.modificar(usuario_id, datos);

            if (resultado?.error) {
                if (resultado.error.includes('Campos no válidos')) {
                    const camposInvalidos = resultado.error.split(': ')[1].split(', ');
                    return res.status(400).json({
                        estado: false,
                        mensaje: 'Campos no válidos para modificar',
                        campos_invalidos: camposInvalidos,
                        campos_validos: [
                            'nombre',
                            'apellido',
                            'nombre_usuario',
                            'contrasenia',
                            'tipo_usuario',
                            'celular'
                        ]
                    });
                }

                if (resultado.error === 'Usuario no encontrado') {
                    return res.status(404).json({
                        estado: false,
                        mensaje: 'Usuario no encontrado para ser modificado'
                    });
                }
            }

            res.json({
                estado: true,
                mensaje: 'Usuario modificado correctamente',
                usuario: resultado
            });

        } catch (error) {
            console.log('Error en PUT /usuarios/:usuario_id', error);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }

    crear = async (req, res) => {
        try {
            const {nombre, apellido, nombre_usuario, tipo_usuario, contrasenia,celular} = req.body;
            const usuario =  {
                nombre, 
                apellido, 
                nombre_usuario, 
                tipo_usuario,
                contrasenia,
                celular
            }   

            const nuevoUsuario = await this.UsuarioServicio.crear(usuario);

            if (!nuevoUsuario) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no creado'
                })
            }

            res.json({
                estado: true, 
                mensaje: 'Usuario creado!',
                usuario: nuevoUsuario
            });
    
        } catch (err) {
            console.log('Error en POST /usuarios/', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor.'
            });
        }
    }
    
    eliminar = async (req, res) => {
        try {
            const usuario_id = req.params.usuario_id;
            const usuarioEliminado = await this.UsuarioServicio.eliminar(usuario_id);
            
            if (!usuarioEliminado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Usuario no encontrado para eliminar'
                });
            }
            
            res.json({
                estado: true,
                mensaje: 'Usuario eliminado',
                usuario: usuarioEliminado
            });

        } catch(err) {
            console.log('Error en DELETE /usuarios/:usuario_id', err);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }

}