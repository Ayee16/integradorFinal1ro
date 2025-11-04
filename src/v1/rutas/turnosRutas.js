import express from 'express';
import TurnosControlador from '../../controladores/turnosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const turnosControlador = new TurnosControlador();
const router = express.Router();

router.get('/', turnosControlador.buscarTodos);

router.get('/:turno_id', turnosControlador.buscarPorId);

router.post('/', 
    [
        check('orden', 'El numero de orden es necesario.').notEmpty(),
        check('hora_desde', 'La hora inicial es necesaria.').notEmpty(),
        check('hora_hasta', 'La hora de finalizacion es necesaria.').notEmpty(),
        check('activo', 'El numero activo debe de ser 1').isInt({ min: 1 }),
        validarCampos
    ],
    
    turnosControlador.crear);

router.put('/:turno_id',
    [
        check('orden', 'El número de orden es necesario.').notEmpty(),
        check('hora_desde', 'La hora inicial es necesaria.').notEmpty(),
        check('hora_hasta', 'La hora de finalización es necesaria.').notEmpty(),
        check('activo', 'El campo activo debe ser 1 o 0.').isInt({ min: 0, max: 1 }),
        validarCampos
    ],
    turnosControlador.modificar
);

router.delete('/:turno_id', turnosControlador.eliminar);

export {router} ;