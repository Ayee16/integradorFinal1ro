import express from 'express';
//import AuthControlador from '../../controladores/authControlador.js';
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
// const authControlador = new AuthControlador();


// 🔓 Login público usando passport-local
router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    (req, res) => {
        const usuario = req.user;

        // Generar token
        const token = jwt.sign(
        {
            usuario_id: usuario.usuario_id,
            tipo_usuario: usuario.tipo_usuario,
            nombre_usuario: usuario.nombre_usuario
        },
        process.env.JWT_SECRET || "clave_secreta_dev",
        { expiresIn: "2h" }
        );

        res.json({
        estado: true,
        mensaje: "Login exitoso",
        token,
        usuario: {
            id: usuario.usuario_id,
            nombre_usuario: usuario.nombre_usuario,
            tipo: usuario.tipo_usuario
        }
        });
    }
);

export { router };

// v1/rutas/authRoutes.js
// import express from 'express';
// const router = express.Router();

// router.post('/login', (req, res) => {
//     res.json({ mensaje: 'Login exitoso' });
// });


