import express from 'express';
import TurnosControlador from '../../controladores/turnosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';
import autorizarUsuarios from '../../middlewares/authUsuarios.js';


const turnosControlador = new TurnosControlador();
const router = express.Router();

const cache = apicache.middleware;//cualquier cosa borrar

router.get('/', autorizarUsuarios([1,2,3]), cache('5 minutes'), turnosControlador.buscarTodos);//cualquier cosa borrar

router.get('/:turno_id', autorizarUsuarios([1,2,3]), turnosControlador.buscarPorId);

router.post('/', autorizarUsuarios([1,2]),
    [
        check('orden', 'El numero de orden es necesario.').notEmpty(),
        check('hora_desde', 'La hora inicial es necesaria.').notEmpty(),
        check('hora_hasta', 'La hora de finalizacion es necesaria.').notEmpty(),
        check('activo', 'El numero activo debe de ser 1').isInt({ min: 1 }),
        validarCampos
    ],
    
    turnosControlador.crear);

router.put('/:turno_id', autorizarUsuarios([1,2]),
    [
        check('orden', 'El número de orden es necesario.').notEmpty(),
        check('hora_desde', 'La hora inicial es necesaria.').notEmpty(),
        check('hora_hasta', 'La hora de finalización es necesaria.').notEmpty(),
        check('activo', 'El campo activo debe ser 1 o 0.').isInt({ min: 0, max: 1 }),
        validarCampos
    ],
    turnosControlador.modificar
);

router.delete('/:turno_id', autorizarUsuarios([1,2]), turnosControlador.eliminar);

export {router} ;