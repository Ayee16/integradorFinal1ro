import express from 'express';
// import apicache from 'apicache'
import SalonesControlador from '../../controladores/salonesControlador.js'
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const salonesControlador = new SalonesControlador();
const router = express.Router();
// let cache = apicache.middleware

router.get('/', salonesControlador.buscarTodos);//buscar todos los salones
// router.get('/', cache('5 minutes'), salonesControlador.buscarTodos);
router.get('/:salon_id', salonesControlador.buscarPorId);

router.put('/:salon_id', salonesControlador.modificar);

router.post('/', 
    [
        check('titulo', 'El titulo es necesario').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad es necesaria.').notEmpty(), // ver cómo verificar que sea numérico
        check('importe', 'El importe es necesario.').notEmpty(),  // ver cómo verificar que sea numérico
        validarCampos
    ],
    
    salonesControlador.crear);

router.delete('/:salon_id', salonesControlador.eliminar);


export {router} ;