import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UsuariosServicio from "../servicios/usuariosServicio.js";
import jwt from "jsonwebtoken";

const usuariosServicio = new UsuariosServicio();

// Estrategia LOCAL (login)
export const estrategiaLocal = new LocalStrategy(
{
        usernameField: "nombre_usuario", // campo que mandás en el body
        passwordField: "password"
    },
    async (nombre_usuario, password, done) => {
        try {
        const usuario = await usuariosServicio.buscarPorNombre_Usuario(nombre_usuario);

        if (!usuario) {
            return done(null, false, { mensaje: "Usuario no encontrado" });
        }

        // ✅ SIN bcrypt, comparación directa
        if (usuario.contrasenia !== password) {
            return done(null, false, { mensaje: "Contraseña incorrecta" });
        }

        // Si todo está bien
        return done(null, usuario);
        } catch (error) {
        return done(error);
        }
    }
    );

    // Estrategia JWT (proteger rutas)
    export const estrategiaJwt = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || "clave_secreta_dev"
    },
    async (payload, done) => {
        try {
        // Verificamos si el usuario existe todavía en la base
        const usuario = await usuariosServicio.buscarPorId(payload.usuario_id);
        if (!usuario) return done(null, false);
        return done(null, usuario);
        } catch (error) {
        return done(error, false);
        }
    }
    );
