import express from 'express';

import { router  as v1SalonesRutas } from './v1/rutas/salonesRutas.js'
import { router  as v1UsuariosRutas } from './v1/rutas/usuariosRutas.js'
const app = express();

app.use(express.json());

app.use('/api/v1/salones', v1SalonesRutas);
app.use('/api/v1/usuarios', v1UsuariosRutas);

export default app;