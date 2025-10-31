import Turnos from '../db/turnos.js';

export default class TurnosServicio{

    constructor() {
        this.turnos = new Turnos();
    }

    buscarTodos = () => {
        return this.turnos.buscarTodos();
    }



}