import { Router } from 'express';
import { listarPedidos } from '../controllers/pedido.controller.js';
// import { verificarToken, verificarRol } from '../middlewares/auth.middleware.js'; // (Descomentar cuando integres JWT)

const router = Router();

// Endpoint: GET /api/pedidos
// Como el enunciado exige protección JWT, eventualmente deberás agregar los middlewares aquí
router.get('/', listarPedidos); 

export default router;