import { conexion } from "./conexion.js";
import bcrypt from 'bcryptjs';

export default class Usuarios {

    buscarTodos = async (req,res) => {
        const sql = 'SELECT usuario_id,nombre,apellido,nombre_usuario,tipo_usuario FROM usuarios WHERE activo = 1';
        const [usuarios] = await conexion.execute(sql);
        return usuarios;
    };

    buscarPorId = async (usuario_id) => {
        const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario, u.usuario_id, u.nombre_usuario
                     FROM usuarios AS u
                     WHERE u.usuario_id = ? AND u.activo = 1;`
        const [result] = await conexion.execute(sql, [usuario_id]);
        return result[0];
    };

    buscarCliente = async (req,res) => {
        const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario, u.usuario_id, u.nombre_usuario
                     FROM usuarios AS u
                     WHERE u.tipo_usuario = 3 AND u.activo = 1;`
        const [result] = await conexion.execute(sql);
        return result[0];
    };

    buscarPorUsuario = async (nombre_usuario) => {
        const sql = `SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, contrasenia FROM usuarios WHERE nombre_usuario = ? AND activo = 1`;
        const [result] = await conexion.execute(sql, [nombre_usuario]);
        return result[0];
    };

    modificar = async (usuario_id, datos) => {
        if (datos?.contrasenia) {
            datos.contrasenia = await bcrypt.hash(datos.contrasenia, 10);
        }
        const camposAActualizar = Object.keys(datos);
        const valoresAActualizar = Object.values(datos);
        const setValores = camposAActualizar.map(campo => `${campo} = ?`).join(', ');
        const parametros = [...valoresAActualizar, usuario_id];
        const sql = `UPDATE usuarios SET ${setValores} WHERE usuario_id = ?`;
        const [result] = await conexion.execute(sql, parametros);
        if (result.affectedRows === 0){
            return null;
        }
        return this.buscarPorId(usuario_id);
    };

    crear = async (usuario) => {
        const {nombre, apellido, nombre_usuario, tipo_usuario, contrasenia, celular} = usuario;
        const hash = await bcrypt.hash(contrasenia, 10);
        const sql = 'INSERT INTO usuarios (nombre, apellido, nombre_usuario, tipo_usuario, contrasenia, celular) VALUES (?,?,?,?,?,?)';
        const [result] = await conexion.execute(sql,[nombre, apellido, nombre_usuario, tipo_usuario, hash, celular]);
        if (result.affectedRows == 0){
            return null;
        }
        return this.buscarPorId(result.insertId);
    };

    eliminar = async (usuario_id) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE usuario_id = ?';
        const [result] = await conexion.execute(sql, [usuario_id]);
        if (result.affectedRows == 0) {
            return null;
        }
        return true;
    };
}