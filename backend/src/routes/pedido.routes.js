// src/routes/pedidos.routes.js
import express from 'express';
import { 
  crearPedido, 
  listarPedidos, 
  editarPedido, 
  cancelarPedido, 
  obtenerPedidoPorId,
  listarMenusDisponibles 
} from '../controllers/pedido.controller.js';
import { verificarToken } from '../middlewares/auth.middlewares.js';

const router = express.Router();

// GET /api/pedidos/menus-disponibles -> Obtener menús para el alta
// Esta ruta la dejamos pública para que la UI pueda cargar los menús sin autenticación
router.get('/menus-disponibles', listarMenusDisponibles);

// Aplicamos el middleware verificarToken a partir de aquí: las demás rutas requieren login
router.use(verificarToken);

// POST /api/pedidos -> Crear un pedido
router.post('/', crearPedido);

// GET /api/pedidos -> Listar los pedidos del usuario autenticado
router.get('/', listarPedidos);

// PUT /api/pedidos/:id -> Editar pedido
router.put('/:id', editarPedido);

// PATCH /api/pedidos/:id/cancelar -> Cancelar pedido
router.patch('/:id/cancelar', cancelarPedido);

// GET /api/pedidos/:id -> Obtener detalle de un pedido específico
router.get('/:id', obtenerPedidoPorId);

export default router;