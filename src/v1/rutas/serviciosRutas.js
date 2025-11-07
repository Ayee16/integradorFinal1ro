import express from 'express';
import ServiciosControlador from "../../controladores/serviciosControlador.js";
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';//cualquier cosa borrar
import autorizarUsuarios from '../../middlewares/authUsuarios.js';


const serviciosControlador = new ServiciosControlador();
const router = express.Router();

const cache = apicache.middleware;//cualquier cosa borrar

router.get('/', autorizarUsuarios([1,2,3]), cache('5 minutes'), serviciosControlador.buscarTodos);//cualquier cosa borrar

router.get('/:servicio_id', autorizarUsuarios([1,2,3]), serviciosControlador.buscarPorId);

router.post('/', autorizarUsuarios([1,2]),
    [
        check('descripcion', 'La descripcion del servicio es necesaria.').notEmpty(),
        check('importe', 'El importe debe ser un número decimal mayor o igual a 0').isFloat({ min: 0 }),
        check('activo', 'El numero activo debe de ser 1').isInt({ min: 1 }),
        validarCampos
    ],
    
    serviciosControlador.crear);

router.put('/:servicio_id', autorizarUsuarios([1,2]),
    [
        check('descripcion', 'La descripción es necesaria').notEmpty(),
        check('importe', 'El importe debe ser un número decimal mayor o igual a 0').isFloat({ min: 0 }),
        check('activo', 'El campo activo debe ser 0 o 1').isInt({ min: 0, max: 1 }),
        validarCampos
    ],serviciosControlador.modificar);
    
router.delete('/:servicio_id', autorizarUsuarios([1,2]), serviciosControlador.eliminar);


export {router};