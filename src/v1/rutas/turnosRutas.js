import express from 'express';
import TurnosControlador from '../../controladores/turnosControlador.js';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const turnosControlador = new TurnosControlador();
const router = express.Router();

router.get('/', turnosControlador.buscarTodos);

router.get('/:turno_id', turnosControlador.buscarPorId);

router.delete('/:turno_id', turnosControlador.eliminar);

export {router} ;