import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcryptjs';
import UsuariosServicio from "../servicios/usuariosServicio.js";

const estrategia = new LocalStrategy(
  {
    usernameField: 'nombre_usuario',
    passwordField: 'contrasenia',
  },
  async (nombre_usuario, contrasenia, done) => {
    try {
      const usuariosServicio = new UsuariosServicio();
      const usuario = await usuariosServicio.buscarPorUsuario(nombre_usuario);
      if (!usuario) {
        return done(null, false, { mensaje: 'Datos inválidos' });
      }

      const ok = await bcrypt.compare(contrasenia, usuario.contrasenia).catch(() => false);
      if (!ok) {
        return done(null, false, { mensaje: 'Datos inválidos' });
      }
      const datosLimpios = { //se pasan los datos limpios sin exponer la contra del usuario
        usuario_id: usuario.usuario_id,
        nombre_usuario: usuario.nombre_usuario,
        tipo_usuario: usuario.tipo_usuario
      };
      return done(null, datosLimpios, { mensaje: 'Login ok' });
    } catch (err) {
      return done(err);
    }
  }
);

const validacion = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      const usuariosServicio = new UsuariosServicio();
      const usuario = await usuariosServicio.buscarPorId(payload.id);
      if (!usuario) {
        return done(null, false, { mensaje: 'Token inválido' });}
      return done(null, usuario);
    } catch (e) {
      return done(e, false);
    }
  }
);

export { estrategia, validacion };