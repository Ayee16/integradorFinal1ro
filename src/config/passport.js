import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalSrategy } from "passport-local";
import UsuariosServicio from "../servicios/usuariosServicio.js";

const estrategia = new LocalSrategy({
    usuarioField: 'nombre_usuario', 
    contraseniaField: 'contrasenia'
    }, 
    async (nombre_usuario, contrasenia, done) => {
        try{
            const usuariosServicio = new UsuariosServicio();
            const usuario = await usuariosServicio.buscarPorUsuario(nombre_usuario, contrasenia);
            if(!usuario){
                return done(null, false, { mensaje: 'Login incorrecto'})
            }
            return done(null, usuario, { mensaje: 'Ha iniciado sesión correctamente'})
        }
        catch(err){
            return done(err);
        }
    }
)

const validacion = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: process.env.JWT_SECRET    
},
    async (payload, done) => {
        const usuariosServicio = new UsuariosServicio();
        const usuario = await usuariosServicio(payload.usuario_id);
        if(!usuario){
            return done(null, false, { mensaje: 'Token incorrecto'});
        }

        return done(null, usuario);
    }    
)
export { estrategia, validacion };