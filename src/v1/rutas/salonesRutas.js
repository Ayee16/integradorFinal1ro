import express from 'express';
import apicache from 'apicache'
import SalonesControlador from '../../controladores/salonesControlador.js'
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const salonesControlador = new SalonesControlador();
const router = express.Router();
let cache = apicache.middleware

// router.get('/', salonesControlador.buscarTodos);//buscar todos los salones
router.get('/', cache('5 minutes'), salonesControlador.buscarTodos);
router.get('/:salon_id', salonesControlador.buscarPorId);

router.put('/:salon_id', salonesControlador.modificar);

router.patch('/:salon_id/activo', salonesControlador.cambiarActivo);

router.post('/', 
    [
        check('titulo', 'El titulo es necesario').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad debe ser un número entero mayor a 0').isInt({ min: 1 }),
        check('importe', 'El importe debe ser un número decimal mayor o igual a 0').isFloat({ min: 0 }),
        validarCampos
    ],
    
    salonesControlador.crear);

router.delete('/:salon_id', salonesControlador.eliminar);


export {router} ;