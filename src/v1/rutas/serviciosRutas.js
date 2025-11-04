import express from 'express';
import ServiciosControlador from "../../controladores/serviciosControlador.js";
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const serviciosControlador = new ServiciosControlador();
const router = express.Router();

router.get('/', serviciosControlador.buscarTodos);

router.get('/:servicio_id', serviciosControlador.buscarPorId);

router.post('/', 
    [
        check('descripcion', 'La descripcion del servicio es necesaria.').notEmpty(),
        check('importe', 'El importe debe ser un número decimal mayor o igual a 0').isFloat({ min: 0 }),
        check('activo', 'El numero activo debe de ser 1').isInt({ min: 1 }),
        validarCampos
    ],
    
    serviciosControlador.crear);

router.put('/:servicio_id', 
    [
        check('descripcion', 'La descripción es necesaria').notEmpty(),
        check('importe', 'El importe debe ser un número decimal mayor o igual a 0').isFloat({ min: 0 }),
        check('activo', 'El campo activo debe ser 0 o 1').isInt({ min: 0, max: 1 }),
        validarCampos
    ],serviciosControlador.modificar);
    
router.delete('/:servicio_id', serviciosControlador.eliminar);


export {router};