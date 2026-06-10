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

export const editarPedido = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Lo inyecta el token
    const pedidoId = req.params.id; // Lo sacamos de la URL
    const datosNuevos = req.body;

    const pedidoEditado = await pedidosService.editarPedido(pedidoId, usuarioId, datosNuevos);
    return res.status(200).json(pedidoEditado);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const cancelarPedido = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const pedidoId = req.params.id;

    const pedidoCancelado = await pedidosService.cancelarPedido(pedidoId, usuarioId);
    return res.status(200).json({
      mensaje: 'Pedido cancelado correctamente',
      pedido: pedidoCancelado
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};