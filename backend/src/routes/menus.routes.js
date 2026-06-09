// src/routes/menus.routes.js
import express from 'express';
// Importamos los middlewares [cite: 3636, 3637]
import { verificarToken, esAdmin } from '../middlewares/auth.middleware.js';
// Suponiendo que ya tenés tus controladores listos
import { obtenerMenus, crearMenu } from '../controllers/menus.controller.js';

const router = express.Router();

// GET /api/menus - Pública (Cualquiera puede ver qué hay para comer)
router.get('/', obtenerMenus);

// POST /api/menus - Privada (Solo Admin)
// Fijate cómo "apilamos" los middlewares antes del controlador crearMenu [cite: 2505]
router.post('/', verificarToken, esAdmin, crearMenu); 

export default router;