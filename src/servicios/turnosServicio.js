import Turnos from '../db/turnos.js';

export default class TurnosServicio{

    constructor() {
        this.turnos = new Turnos();
    }

    buscarTodos = () => {
        return this.turnos.buscarTodos();
    }

    buscarPorId = (turno_id) => {
        return this.turnos.buscarPorId(turno_id);
    }



}