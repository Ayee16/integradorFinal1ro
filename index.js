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

process.loadEnvFile();

app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}`);
});
