import express from 'express';
import ReservasControlador from '../../controladores/reservasControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';


const reservasControlador = new ReservasControlador();
const router = express.Router();

router.get('/', reservasControlador.buscarTodos);

router.delete('/:reserva_id', reservasControlador.eliminar);

router.post('/',
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

export { router };