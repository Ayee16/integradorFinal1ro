import express from 'express';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { fileURLToPath} from 'url';
import { readFile } from 'fs/promises';
import path from 'path';
import { conexion } from './db/conexion.js';


const app = express();

app.use(express.json());


app.get('/estado', (req, res) => {
    res.json({'ok':true});    
})



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



    } catch (err) {
        console.log('Error en GET/usuarios/:usuario_id');
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor'
        })
    }
})


process.loadEnvFile();

app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}`);
})