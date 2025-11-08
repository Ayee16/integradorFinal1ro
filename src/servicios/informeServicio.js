import { createObjectCsvWriter } from 'csv-writer';
import puppeteer from "puppeteer";
import handlebars from 'handlebars';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class InformeServicio {
    
    informeReservasCsv = async (datosReporte) => {
        try{
            if (!Array.isArray(datosReporte) || datosReporte.length === 0) {
                throw new Error('No hay datos para generar el CSV');
            } 

            const csvWriter = createObjectCsvWriter({
                path: 'reservas.csv',
                header: [
                    {id: 'mes', title: 'Mes'},
                    {id: 'total_reservas', title: 'Total de reservas'},
                    {id: 'total_recaudado', title: 'Total recaudado'}
                ]
            });
            
            await csvWriter.writeRecords(datosReporte);
            return path.resolve('reservas.csv');
            
        }catch (error){
            console.log('Error generando csv:', error);
            throw error;
        }
    }

    informeReservasPdf = async (datosReporte) => {
        try{
            
            if (!Array.isArray(datosReporte) || datosReporte.length === 0) {
                throw new Error('No hay datos para generar el PDF');
            }

            
            const plantillaPath = path.join(__dirname, '../utiles/handlebars/informe.hbs');

            if (!fs.existsSync(plantillaPath)) {
                throw new Error(`Plantilla Handlebars no encontrada en ${plantillaPath}`);
            }

            const plantillaHtml = fs.readFileSync(plantillaPath, 'utf8');
            const fechaActual = new Date().toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            
            const template = handlebars.compile(plantillaHtml);
            const htmlFinal = template({ reservas: datosReporte, fechaActual });

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setContent(htmlFinal);

            const buffer = await page.pdf({
                path: 'reservas.pdf', 
                format: 'A4', 
                printBackground: true
            });

            await browser.close();

            return buffer;

        }catch(error){
            console.error('Error generando el PDF:', error);
            throw error;
        }
    }

}
