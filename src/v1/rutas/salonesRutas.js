import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js'
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';//cualquier cosa borrar
import autorizarUsuarios from '../../middlewares/authUsuarios.js';


const salonesControlador = new SalonesControlador();
const router = express.Router();

const cache = apicache.middleware;//cualquier cosa borrar




router.get('/', autorizarUsuarios([1,2,3]), cache('5 minutes'), salonesControlador.buscarTodos);//cualquier cosa borrar

router.get('/:salon_id', autorizarUsuarios([1,2,3]), salonesControlador.buscarPorId);

router.put('/:salon_id', autorizarUsuarios([1,2]),
    [
        check('titulo', 'El titulo es necesario').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad debe ser un número entero mayor a 0').isInt({ min: 1 }),
        check('importe', 'El importe debe ser un número decimal mayor o igual a 0').isFloat({ min: 0 }),
        validarCampos
    ],salonesControlador.modificar);

router.post('/', autorizarUsuarios([1,2]),
    [
        check('titulo', 'El titulo es necesario').notEmpty(),
        check('direccion', 'La dirección es necesaria.').notEmpty(),
        check('capacidad', 'La capacidad debe ser un número entero mayor a 0').isInt({ min: 1 }),
        check('importe', 'El importe debe ser un número decimal mayor o igual a 0').isFloat({ min: 0 }),
        validarCampos
    ],
    
    salonesControlador.crear);

router.delete('/:salon_id', autorizarUsuarios([1,2]), salonesControlador.eliminar);


export {router} ;