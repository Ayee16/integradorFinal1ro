import express from 'express';
import ReservasControlador from '../../controladores/reservasControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/authUsuarios.js';

import apicache from 'apicache'; //cualquier cosa borrar

const cache = apicache.middleware; //cualquier cosa borrar

const reservasControlador = new ReservasControlador();
const router = express.Router();

router.get('/', autorizarUsuarios([1,2,3]) , cache('5 minutes'), reservasControlador.buscarTodos); //cualquier cosa borrar

router.get('/:reserva_id', autorizarUsuarios([1,2,3]) , reservasControlador.buscarPorId);

router.put('/:reserva_id', autorizarUsuarios([1]) ,
    [
        check('fecha_reserva', 'La fecha de reserva es obligatoria y debe tener formato YYYY-MM-DD').notEmpty().isDate({ format: 'YYYY-MM-DD' }),
        check('turno_id', 'El turno_id es obligatorio y debe ser un número entero').notEmpty().isInt(),
        check('activo', 'El campo activo debe ser 0 o 1').optional().isInt({ min: 0, max: 1 }),
        validarCampos
    ],reservasControlador.modificar);

router.post('/', autorizarUsuarios([1,3]) ,
    [
        check('fecha_reserva', 'La fecha de la reserva es necesaria.').notEmpty(),
        check('salon_id', 'El salon es necesario.').notEmpty(),
        check('usuario_id', 'El usuario es necesario.').notEmpty(),
        check('turno_id', 'El turno es necesario.').notEmpty(),
        check('servicios', 'Faltan los servicios del a reserva.')
        .notEmpty()
        .isArray(),
        check('servicios.*.importe')
        .isFloat()
        .withMessage('El importe debe ser numerico'),
        validarCampos
    ],
    reservasControlador.crear);

router.delete('/:reserva_id', autorizarUsuarios([1]), reservasControlador.eliminar);

export { router };