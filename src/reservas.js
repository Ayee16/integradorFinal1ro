import express from 'express';

import { router  as v1SalonesRutas } from './v1/rutas/salonesRutas.js'

const app = express();

app.use(express.json());

app.use('/api/v1/salones', v1SalonesRutas);
// app.use('/api/v1/usuarios', v1SalonesRutas)


// app.use('/api/v1/salones', apicache( '5 minutos'), v1SalonesRutas) ejemplo apicache

// app.use('/api/v1/turnos', v1SalonesRutas)

// app.use('/api/v1/reservas', v1SalonesRutas)


export default app;