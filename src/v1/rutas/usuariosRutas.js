import express from 'express';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/authUsuarios.js';



const usuariosControlador = new UsuariosControlador();
const router = express.Router();

router.get('/', autorizarUsuarios([1]), usuariosControlador.buscarTodos);

router.get('/clientes', autorizarUsuarios([2]), usuariosControlador.buscarCliente);

router.get('/:usuario_id', autorizarUsuarios([1]), usuariosControlador.buscarPorId);

router.put('/:usuario_id', autorizarUsuarios([1]),
    [check('nombre', 'El nombre es necesario').notEmpty(),
    check('apellido', 'El apellido es necesario.').notEmpty(),
    check('nombre_usuario', 'El nombre de usuario es necesario.').notEmpty(),
    check('tipo_usuario', 'El tipo de usuario puede ser 1,2,3').isInt({ min: 1 , max:3}),
    check('celular', 'El campo celular debe contener solo numeros').isInt()],
    validarCampos,
    usuariosControlador.modificar);


router.post('/', autorizarUsuarios([1]), 
    [
        check('nombre', 'El nombre es necesario').notEmpty(),
        check('apellido', 'El apellido es necesario.').notEmpty(),
        check('nombre_usuario', 'El nombre de usuario es necesario.').notEmpty(),
        check('tipo_usuario', 'El tipo de usuario puede ser 1,2,3').isInt({ min: 1 , max:3}),
        check('contrasenia', 'La contransenia es necesaria.').notEmpty(),
        check('celular', 'El campo celular debe ser numerico.').isInt(),
        validarCampos
    ],
    usuariosControlador.crear);

router.delete('/:usuario_id', autorizarUsuarios([1]), usuariosControlador.eliminar);

export {router} ;