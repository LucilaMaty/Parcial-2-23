// src/routes/pedidos.routes.js
import express from 'express';
import { crearPedido, listarPedidos } from '../controllers/pedido.controller.js';
import { verificarToken } from '../middlewares/auth.middlewares.js';

const router = express.Router();

// Aplicamos el middleware verificarToken a todas las rutas de este archivo
router.use(verificarToken);

// POST /api/pedidos -> Crear un pedido
router.post('/', crearPedido);

// GET /api/pedidos -> Listar los pedidos del usuario autenticado
router.get('/', listarPedidos);

export default router;