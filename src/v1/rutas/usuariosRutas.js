import express from 'express';
// import apicache from 'apicache'
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const usuariosControlador = new UsuariosControlador();
const router = express.Router();
// let cache = apicache.middleware

router.get('/', usuariosControlador.buscarTodos);//buscar todos los salones
// router.get('/', cache('5 minutes'), salonesControlador.buscarTodos);
router.get('/:usuario_id', usuariosControlador.buscarPorId);

router.put('/:usuario_id', usuariosControlador.modificar);


//CAMBIAR POR CAMPOS DE USUARIOS NO ME ACUERDO CUALES SON
router.post('/', 
    [
        check('nombre', 'El nombre es necesario').notEmpty(),
        check('apellido', 'El apellido es necesario.').notEmpty(),
        check('nombre_usuario', 'El nombre de usuario es necesario.').notEmpty(),
        check('tipo_usuario', 'El tipo de usuario es necesario.').notEmpty(),
        check('contrasenia', 'La contransenia es necesaria.').notEmpty(),
        validarCampos
    ],
    usuariosControlador.crear);

router.delete('/:usuario_id', usuariosControlador.eliminar);


export {router} ;