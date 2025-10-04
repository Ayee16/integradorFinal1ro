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

//ruta notificacion de reservas
app.post('/notificacion', async (req, res) => {

    if(!req.body.fecha ||  !req.body.salon || !req.body.turno || !req.body.correoDestino){
        res.status(400).send({'estado':false, 'mensaje':'Faltan datos requeridos!'});
    }
    
    try{

        const { fecha, salon, turno, correoDestino} = req.body;


        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);        
        const plantilla = path.join(__dirname, 'utiles', 'handlebars', 'plantilla.hbs');


        const archivoHbs = await readFile(plantilla, 'utf-8');

        const template = handlebars.compile(archivoHbs);

        var html = template(
            {   fecha: fecha, 
                salon: salon,
                turno: turno
            }
        );
        


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });


        const opciones = {
            to: correoDestino,
            subject: 'Notificación',
            html: html
        }


        transporter.sendMail(opciones, (error, info) => {
            if(error){
                res.json({'ok':false, 'mensaje':'Error al enviar el correo.'});           
            }
            res.json({'ok': true, 'mensaje': 'Correo enviado.'});
        });

    }catch (error){
        console.log(error);
    }
})

//ruta obtener salones
app.get('/salones', async(req, res) => {
    try {
        const sql = 'SELECT * FROM salones WHERE activo = 1';
        
        const [results, fields] = await conexion.query(sql);

        res.json({'ok':true, 'salones':results});

    } catch (err) {
        console.log(err);
    }
})

//ruta obtener salones por id
app.get('/salones/:salon_id', async(req, res) => {
    try {
        
        const salon_id = req.params.salon_id;
        const sql = `SELECT * FROM salones WHERE activo = 1 and salon_id = ?`;
        const valores = [salon_id];

        const [results, fields] = await conexion.execute(sql, valores);

        if(results.length === 0){
            return res.status(404).json({
                estado: false,
                mensaje: 'Salón no encontrado.'
            })
        }

        res.json({
            estado: true,
            salon: results[0]
        });

    } catch (err) {
        console.log('Error en GET /salones/:salon_id', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        })
    }
})

// ruta para crear un salón
app.post('/salones', async (req, res)=>{    
    try{

        if(!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe){
            return res.status(400).json({
                estado: false,
                mensaje: 'Faltan campos requeridos.'
            })
        }
        const {titulo, direccion, capacidad, importe} = req.body;
        
        const valores = [titulo, direccion, capacidad, importe];
        const sql = 'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?,?,?,?)';

        const [result]= await conexion.execute(sql, valores);
        
        res.status(201).json({
            estado: true,
            mensaje: `Salón creado con id ${result.insertId}.`
        })

    }catch (err) {
        console.log('Error en POST /salones', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        })
    }

})

// ruta para editar un salón
app.put('/salones/:salon_id', async (req, res) => {
    try{

        const salon_id = req.params.salon_id;
        const sql = `SELECT * FROM salones WHERE activo = 1 and salon_id = ?`;
        const [results] = await conexion.execute(sql, [salon_id]);
                
        if(results.length === 0){
            return res.status(404).json({
                estado: false,
                mensaje: 'El salón no existe.'
            })
        }

        if(!req.body.titulo || !req.body.direccion || !req.body.capacidad || !req.body.importe){
            return res.status(400).json({
                estado: false,
                mensaje: 'Faltan campos requeridos.'
            })
        }
        
        const {titulo, direccion, capacidad, importe} = req.body;
        
        const valores = [titulo, direccion, capacidad, importe, salon_id];
        const sql2 = `UPDATE salones 
                        SET titulo = ?, direccion = ?, capacidad = ? , importe = ? 
                        WHERE salon_id = ?`;

        const [result]= await conexion.execute(sql2, valores);

        res.status(200).json({
            estado: true,
            mensaje: `Salón modificado.`
        });
    }catch(err) {
        console.log('Error en PUT /salones/:salon_id', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        })
    }
});

// ruta para eliminiar un salón
app.delete('/salones/:salon_id', async (req, res) => {
    try{
        const salon_id = req.params.salon_id;
        const sql = `SELECT * FROM salones WHERE activo = 1 and salon_id = ?`;
                
        const [results] = await conexion.execute(sql, [salon_id]);
        
        if(results.length === 0){
            return res.status(404).json({
                estado: false,
                mensaje: 'El salón no existe.'
            })
        }

        const sql2 = `UPDATE salones 
                        SET activo = 0 
                        WHERE salon_id = ?`;

        const [result]= await conexion.execute(sql2, [salon_id]);
        
        res.status(200).json({
            estado: true,
            mensaje: `Salón eliminado.`
        });
    }catch(err) {
        console.log('Error en DELETE /salones/:salon_id', err);
        res.status(500).json({
            estado: false,
            mensaje: 'Error interno del servidor.'
        })
    }
});


process.loadEnvFile();

app.listen(process.env.PUERTO, () => {
    console.log(`Servidor iniciado en ${process.env.PUERTO}`);
})