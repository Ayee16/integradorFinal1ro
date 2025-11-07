import express from 'express';
import passport from 'passport';
import { estrategia, validacion } from './config/passport.js';
import { setupSwagger } from './swagger/swagger.js';

import { router as v1AuthRouter } from './v1/rutas/authRutas.js';
import { router as v1SalonesRutas } from './v1/rutas/salonesRutas.js';
import { router as v1UsuariosRutas } from './v1/rutas/usuariosRutas.js';
import { router as v1TurnosRutas } from './v1/rutas/turnosRutas.js';
import { router as v1ServiciosRutas } from './v1/rutas/serviciosRutas.js';
import { router as v1ReservasRutas } from './v1/rutas/reservasRutas.js';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.static('public'));

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

app.use('/api/v1/auth', v1AuthRouter);
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/usuarios', v1UsuariosRutas);
app.use('/api/v1/turnos', v1TurnosRutas);
app.use('/api/v1/servicios', v1ServiciosRutas);

app.use('/api/v1/reservas', passport.authenticate('jwt', { session: false }), v1ReservasRutas);

setupSwagger(app);

export default app;