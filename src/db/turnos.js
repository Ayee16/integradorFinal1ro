import { conexion } from "./conexion.js";

export default class Turnos {
    buscarTodos = async() =>{
        const sql = 'SELECT * FROM turnos WHERE activo=1'; //creo consulta
        const turnos = conexion.execute(sql); //me conecto a la db y paso consulta
        return turnos; //retorno consulta
    };

}