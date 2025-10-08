import express from 'express';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { fileURLToPath} from 'url';
import { readFile } from 'fs/promises';
import path from 'path';
import { conexion } from './db/conexion.js';


const app = express();

app.use(express.json());

app.put('/usuarios/:usuario_id', async (req, res) => {
    try {
        const usuario_id = req.params.usuario_id;
        const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = req.body;

        if(!nombre || !apellido || !nombre_usuario || !contrasenia || !tipo_usuario){
            return res.status(400).json({ estado: false, mensaje: 'Faltan campos requeridos.' });
        }
        
        const [results] = await conexion.execute(`SELECT * FROM usuarios WHERE usuario_id = ? AND activo = 1`, [usuario_id]);
        if(results.length === 0){
            return res.status(404).json({ estado: false, mensaje: 'Usuario no existe.' });
        }

        const sql = `UPDATE usuarios SET 
                    nombre = ?, 
                    apellido = ?, 
                    nombre_usuario = ?, 
                    contrasenia = ?, 
                    tipo_usuario = ?, 
                    celular = ?, 
                    foto = ?
                    WHERE usuario_id = ?`;
        const valores = [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular || null, foto || null, usuario_id];

        await conexion.execute(sql, valores);

        const [usuarioActualizado] = await conexion.execute(`SELECT * FROM usuarios WHERE usuario_id = ?`, [usuario_id]);
        console.log(` Usuario actualizado (ID: ${usuario_id})`, usuarioActualizado[0]);

        res.json({ estado: true, mensaje: 'Usuario modificado.', usuario: usuarioActualizado[0] });
    } catch (err) {
        console.log('Error en PUT /usuarios/:usuario_id', err);
        res.status(500).json({ estado: false, mensaje: 'Error interno del servidor.' });
    }
});

app.get('/estado', (req, res) => {
    res.json({'ok':true});    
})

//RUTA GET PARA OBTENER TODOS LOS USUARIOS

app.get('/usuarios', async (req, res) => {
    try {
        const sql = 'SELECT * FROM usuarios WHERE activo = 1';
        
        const [results, fields] = await conexion.query(sql);

        // Verificar si hay resultados
        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontraron usuarios activos',
                usuarios: []
            });
        }

        // Respuesta exitosa
        res.status(200).json({
            ok: true,
            cantidad: results.length,
            usuarios: results
        });

    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        
        // Enviar respuesta de error al cliente
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener los usuarios',

        });
    }
});

// RUTA GET PARA OBTENER 1 USUARIO POR ID
app.get('/usuarios/:usuario_id', async(req, res) => {

    try {
        
        const usuario_id = req.params.usuario_id;
        const sql = `SELECT * FROM usuarios WHERE activo = 1 and usuario_id = ?` ;
        const valores = [usuario_id];

        const [results, fields] = await conexion.execute(sql, valores);
        
        if(results.length === 0){
            return res.status(404).json({
                estado:false,
                mensaje:'No se encuentra ese usuario. Por favor vuelva a ingresar'
            })
        }

        res.json({
            'estado':true, 
            'usuario':results [0] 
        
        });


    } catch (err) {
        console.log('Error en GET/usuarios/:usuario_id');
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor'
        })
    }
});

// RUTA POST PARA CREAR 1 USUARIO POR ID
app.post('/usuarios', async (req, res)=>{    
    try{

        if(!req.body.nombre || !req.body.apellido || !req.body.nombre_usuario || !req.body.contrasenia || !req.body.tipo_usuario || !req.body.celular || !req.body.foto ){
            return res.status(400).json({
                estado: false,
                mensaje: 'Faltan campos requeridos.'
            })
        }
        const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto} = req.body;
        
        const valores = [nombre,apellido,nombre_usuario,contrasenia,tipo_usuario,celular,foto];
        const sql = 'INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario,celular,foto) VALUES (?,?,?,?,?,?,?)';

        const [result]= await conexion.execute(sql, valores);
        
        res.status(201).json({
            estado: true,
            mensaje: `Usuario creado con id ${result.insertId}.`
        })
    }catch (err) {
        console.log('Error en POST /usuarios', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        })
    }
})

// RUTA PARA ELIMINAR UN USUARIO POR ID

app.delete('/usuarios/:usuario_id', async (req,res) => {
    try {
        const usuario_id = req.params.usuario_id;
        const [results] = await conexion.execute('SELECT * FROM usuarios WHERE usuario_id = ? and activo = 1', [usuario_id]);
        if (results.length === 0) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado o inactivo.'
            });
        }
        await conexion.execute('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [usuario_id]);
        res.json({
            estado: true,
            mensaje: 'Usuario eliminado correctamente.'
        });
    } catch (err) {
        console.log('Error en DELETE /usuarios/:usuario_id', err);
        res.status(500).json({
            estado: true,
            mensaje: 'Error interno del servidor'
        });
    }
});

//RUTA GET PARA TODOS LOS SERVICIOS
app.get('/servicios', async (req, res) => {
    try {
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        
        const [results, fields] = await conexion.query(sql);

        // Verificar si hay resultados
        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encuentra dicho servicio. Por favor vuelva a ingresar',
                servicios: []
            });
        }

        // Respuesta exitosa
        res.status(200).json({
            ok: true,
            cantidad: results.length,
            servicios: results
        });

    } catch (error) {
        console.error('Error al obtener servicios:', error);
        
        // Enviar respuesta de error al cliente
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor',

        });
    }
});

// ruta GET para obtener 1 SERVICIO POR ID
app.get('/servicios/:servicio_id', async(req, res) => {

    try {
        
        const servicio_id = req.params.servicio_id;
        const sql = `SELECT * FROM servicios WHERE activo = 1 and servicio_id = ?` ;
        const valores = [servicio_id];

        const [results, fields] = await conexion.execute(sql, valores);
        
        if(results.length === 0){
            return res.status(404).json({
                estado:false,
                mensaje:'No se encuentra dicho servicio. Por favor vuelva a ingresar'
            })
        }

        res.json({
            'estado':true, 
            'servicio':results [0] 
        
        });


    } catch (error) {
        console.log('Error en GET/servicios/:servicio_id');
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor'
        })
    }
})

//RUTA GET PARA TODOS LOS SALONES
app.get('/salones', async (req, res) => {
    try {
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        
        const [results, fields] = await conexion.query(sql);

        // Verificar si hay resultados
        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se han encontrado salones activos. Por favor vuelva a ingresar',
                salones: []
            });
        }

        // Respuesta exitosa
        res.status(200).json({
            ok: true,
            cantidad: results.length,
            salones: results
        });

    } catch (error) {
        console.error('Error al obtener salones:', error);
        
        // Enviar respuesta de error al cliente
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor',

        });
    }
});

//RUTA PARA TENER 1 SALON POR ID
app.get('/salones/:salon_id', async(req, res) => {

    try {
        
        const salon_id = req.params.salon_id;
        const sql = `SELECT * FROM salones WHERE activo = 1 and salon_id = ?` ;
        const valores = [salon_id];

        const [results, fields] = await conexion.execute(sql, valores);
        
        if(results.length === 0){
            return res.status(404).json({
                estado:false,
                mensaje:'El salon no se ha encontrado. Por favor vuelva a ingresar'
            })
        }

        res.json({
            'estado':true, 
            'salon':results [0]  
        
        });


    } catch (error) {
        console.log('Error en GET/salones/:salon_id');
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor'
        })
    }
})





process.loadEnvFile();

app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}`);
});
