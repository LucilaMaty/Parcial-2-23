// src/controllers/pedidos.controller.js
import pedidosService from '../../services/pedidos.services.js';

export const crearPedido = async (req, res) => {
  try {
    // Obtenemos el ID del usuario autenticado (inyectado por el middleware verificarToken)
    const usuarioId = req.usuario.id; 
    const datosPedido = req.body;

    const nuevoPedido = await pedidosService.crearPedido(usuarioId, datosPedido);
    
    return res.status(201).json(nuevoPedido);
  } catch (error) {
     // Respondemos con un 400 (Bad Request) si falla alguna validación de negocio
    return res.status(400).json({ error: error.message });
  }
};

export const listarPedidos = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const pedidos = await pedidosService.obtenerPedidosUsuario(usuarioId);
        return res.status(200).json(pedidos);
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
}