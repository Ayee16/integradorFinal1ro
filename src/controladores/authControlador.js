import jwt from 'jsonwebtoken';
import passport from 'passport';

export default class AuthControlador {
  login = async (req, res) => {
    passport.authenticate('local', { session: false }, (err, usuario, info) => {
      if (err) {
        return res.status(500).json({ estado: false, mensaje: 'Error interno', detalle: err.message });
      }
      if (!usuario) {
        return res.status(401).json({ estado: false, mensaje: info?.mensaje || 'Credenciales inválidas' });
      }

      const payload = { id: usuario.usuario_id, tipo: usuario.tipo_usuario };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({ estado: true, token });
    })(req, res);
  };
}