// src/routes/admin.routes.js
import { Router } from 'express';
import { actualizarEstadoPedido } from '../controllers/admin.controller.js';
import { verificarToken, esAdmin } from '../middlewares/auth.middlewares.js';

const router = Router();

// Aplicamos los DOS guardias a todas las rutas de este archivo
router.use(verificarToken);
router.use(esAdmin);

// Endpoint: PATCH /api/admin/pedidos/:id/estado
router.patch('/pedidos/:id/estado', actualizarEstadoPedido);

export default router;