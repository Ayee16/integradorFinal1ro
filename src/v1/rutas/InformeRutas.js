// src/rutas/informeRutas.js
import express from "express";
import { generarInforme } from "../controladores/informeControlador.js";

const router = express.Router();

router.get('/informe', autorizarUsuarios([1]), generarInforme);

export default router;