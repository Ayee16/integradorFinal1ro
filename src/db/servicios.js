import { conexion } from "./conexion.js";

export default class Servicios{

    buscarTodos = async() => {
        const sql = 'SELECT * FROM servicios WHERE activo = 1';
        const servicios = conexion.execute(sql);
        return servicios;
    }

};


