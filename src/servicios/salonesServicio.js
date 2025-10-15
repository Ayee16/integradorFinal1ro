import Salones from "../db/salones.js" //agregar siempre el .js

export default class SalonesServicio {

    constructor(){
        this.salones = new Salones();
    }

    buscarTodos = () => {
        return this.salones.buscarTodos();
    }

    buscarPorId = (salon_id) => {
        return this.salones.buscarPorId(salon_id);
    }

    modificar = async (salon_id, datos) => {
        const existe = await this.salones.buscarPorId(salon_id);
        if (!existe) {
            return { error: 'Salón no encontrado' };
        }
        
        try {
            return await this.salones.modificar(salon_id, datos);
        } catch (error) {
            return { error: error.message };
        }
    }

    crear = (salon) => {
        return this.salones.crear(salon);
    }

    eliminar = async (salon_id) =>{
    const existe = await this.salones.buscarPorId(salon_id);
    if (!existe) {
        return null;
    }
    return this.salones.eliminar(salon_id);
    }

    cambiarActivo = async (salon_id, activo) => {
        // Usar el nuevo método que busca sin filtro de activo
        const existe = await this.salones.buscarPorIdParaModificar(salon_id);
        if (!existe) {
            return { error: 'Salón no encontrado' };
        }
        
        try {
            return await this.salones.cambiarActivo(salon_id, activo);
        } catch (error) {
            return { error: error.message };
        }
    }
    
}