import express from 'express';
import ServiciosControlador from "../../controladores/serviciosControlador.js";
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const serviciosControlador = new ServiciosControlador();
const router = express.Router();

router.get('/', serviciosControlador.buscarTodos);

router.get('/:servicio_id', serviciosControlador.buscarPorId);




export {router};