import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
// // import cors from 'cors';
import fs from 'fs';
import { estrategiaLocal, estrategiaJwt } from "./config/passport.js";

import { router as v1AuthRouter } from './v1/rutas/authRoutes.js';
import { router  as v1SalonesRutas } from './v1/rutas/salonesRutas.js'
import { router  as v1UsuariosRutas } from './v1/rutas/usuariosRutas.js'
import { router as v1TurnosRutas } from './v1/rutas/turnosRutas.js'
import { router as v1ServiciosRutas} from './v1/rutas/serviciosRutas.js'
import { router as v1ReservasRutas} from './v1/rutas/reservasRutas.js';

const app = express();
app.use(express.json());
app.use(passport.initialize());

// Registrar estrategias
passport.use("local", estrategiaLocal);
passport.use("jwt", estrategiaJwt);

// Morgan para logs
const log = fs.createWriteStream("./access.log", { flags: "a" });
app.use(morgan("combined", { stream: log }));

//RUTAS
app.use('/api/v1/auth', v1AuthRouter); 
app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/usuarios', v1UsuariosRutas);
app.use('/api/v1/turnos', v1TurnosRutas);
app.use('/api/v1/servicios', v1ServiciosRutas);
app.use('/api/v1/reservas', v1ReservasRutas);


export default app;
// const router = express.Router(); 

// router.post('/login', (req, res) => {
//   // lógica de login
//     res.json({ mensaje: 'Login exitoso' });
// });

// export { router };

// import { estrategia, validacion} from './config/passport.js';
// import { setupSwagger } from './swagger/swagger.js';


// // middlewares 
// // app.use(cors());

// // morgan
// let log = fs.createWriteStream('./access.log', { flags: 'a' })
// app.use(morgan('combined')) 
// app.use(morgan('combined', { stream: log })) 

// // rutas

//app.use('/api/v1/salones', v1SalonesRutas);
// app.use('/api/v1/reservas', passport.authenticate( 'jwt', { session:false }), v1ReservasRutas);
// app.use('/api/v1/usuarios', passport.authenticate( 'jwt', { session:false }), v1UsuariosRutas);



// setupSwagger(app);


