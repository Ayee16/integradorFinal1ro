import express from 'express';
import ReservasControlador from '../../controladores/reservasControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';


const reservasControlador = new ReservasControlador();
const router = express.Router();

router.get('/', reservasControlador.buscarTodos);

router.get('/:reserva_id', reservasControlador.buscarPorId);

router.delete('/:reserva_id', reservasControlador.eliminar);

export { router };