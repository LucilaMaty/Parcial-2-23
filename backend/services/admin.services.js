// src/services/admin.service.js
import { Pedido } from '../src/models/index.js';

class AdminService {
  async cambiarEstadoPedido(pedidoId, nuevoEstado) {
    const estadosPermitidos = ['pendiente', 'confirmado', 'entregado', 'cancelado'];
    
    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Use: ${estadosPermitidos.join(', ')}`);
    }

    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) {
      throw new Error('Pedido no encontrado.');
    }

    pedido.estado = nuevoEstado;
    await pedido.save();

    return pedido;
  }

  // ¡Acá a futuro podemos sumar la función para sacar el reporte de ventas!
}

export default new AdminService();