import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { conexion } from '../db/conexion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class NotificacionesServicio {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    obtenerEmailUsuario = async (usuario_id) => {
        try {
            const sql = `SELECT nombre_usuario 
                        FROM usuarios 
                        WHERE usuario_id = ? AND activo = 1`;
            const [result] = await conexion.execute(sql, [usuario_id]);
            
            if (result.length === 0) {
                return null;
            }

            return result[0].nombre_usuario;
        } catch (error) {
            console.error('Error al obtener email del usuario:', error);
            return null;
        }
    }


    obtenerCorreosAdministradores = async () => {
        try {
            const sql = `SELECT nombre_usuario as correoAdmin
                        FROM usuarios 
                        WHERE tipo_usuario = 1 AND activo = 1`;
            const [result] = await conexion.execute(sql);
            
            return result.map(admin => admin.correoAdmin);

        } catch (error) {
            console.error('Error al obtener correos de administradores:', error);
            return [];
        }
    }

    compilarPlantilla = async (datos) => {
        try {
            const rutaPlantilla = path.join(__dirname, '../utiles/handlebars/plantilla.hbs');
            const plantilla = await fs.readFile(rutaPlantilla, 'utf-8');
            const compilada = handlebars.compile(plantilla);
            return compilada(datos);
        } catch (error) {
            console.error('Error al compilar la plantilla:', error);
            throw error;
        }
    }

    enviarNotificacionReserva = async (reserva) => {
        try {
            const datos = reserva.datos || reserva;
            
            // Formatear la fecha
            const fecha = new Date(datos.fecha_reserva || reserva.fecha_reserva).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const datosPlantilla = {
                fecha: fecha,
                salon: datos.salon_titulo || reserva.salon_titulo || 'Salón',
                turno: `${datos.hora_desde || reserva.hora_desde || ''} - ${datos.hora_hasta || reserva.hora_hasta || ''}`
            };

            const html = await this.compilarPlantilla(datosPlantilla);

            // Enviar email a administradores
            try {
                const correosAdmin = await this.obtenerCorreosAdministradores();
                if (correosAdmin.length > 0) {
                    await this.transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: correosAdmin.join(', '),
                        subject: 'Nueva Reserva - Notificación para Administradores 🎉',
                        html: html
                    });
                    console.log(`Email enviado a ${correosAdmin.length} administrador(es)`);
                }
            } catch (error) {
                console.error('Error al enviar email a administradores:', error);
            }

            // Enviar email al usuario
            try {
                const usuario_id = reserva.usuario_id || datos.usuario_id;
                if (usuario_id) {
                    const emailUsuario = await this.obtenerEmailUsuario(usuario_id);
                    if (emailUsuario) {
                        await this.transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: emailUsuario,
                            subject: 'Confirmación de Reserva - Casas de Cumpleaños 🎉',
                            html: html
                        });
                        console.log('Email de confirmación enviado al usuario');
                    }
                }
            } catch (error) {
                console.error('Error al enviar email al usuario:', error);
            }

            return true;
        } catch (error) {
            console.error('Error al enviar notificaciones:', error);
            return false;
        }
    }
}

