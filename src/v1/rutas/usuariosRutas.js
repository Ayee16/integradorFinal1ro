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
        check('nombre', 'El titulo es necesario').notEmpty(),
        check('apellido', 'La dirección es necesaria.').notEmpty(),
        check('nombre_usuario', 'La capacidad es necesaria.').notEmpty(),
        validarCampos
    ],
    usuariosControlador.crear);

router.delete('/:usuario_id', usuariosControlador.eliminar);


export {router} ;