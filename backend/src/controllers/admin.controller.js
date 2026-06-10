// src/controllers/admin.controller.js
import adminService from '../../services/admin.services.js';

export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params; 
    const { estado } = req.body; 

    const pedidoActualizado = await adminService.cambiarEstadoPedido(id, estado);
    
    return res.status(200).json({
      mensaje: 'Estado actualizado correctamente',
      pedido: pedidoActualizado
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};