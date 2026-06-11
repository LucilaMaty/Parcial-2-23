import api from './api';

const pedidosService = {
  async obtenerMenusDisponibles() {
    try {
      const response = await api.get('/pedidos/menus-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener menús disponibles:', error);
      throw new Error(error.response?.data?.error || 'No se pudieron cargar los menús del día.', { cause: error });
    }
  },

  async crearPedido(pedidoData) {
    try {
      const response = await api.post('/pedidos', pedidoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw new Error(error.response?.data?.error || 'Error al procesar el pedido.', { cause: error });
    }
  },

  async cancelarPedido(id) {
    try {
      // 1. Cambiamos api.delete por api.patch
      // 2. Agregamos el /cancelar al final de la URL
      const response = await api.patch(`/pedidos/${id}/cancelar`);
      return response.data;
    } catch (error) {
      console.error(`Error al cancelar pedido ${id}:`, error);
      throw new Error(error.response?.data?.error || `Error al cancelar pedido ${id}`, { cause: error });
    }
  },

  async obtenerMisPedidos(filtros = {}) {
    try {
      const response = await api.get('/pedidos', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis pedidos:', error);
      throw new Error(error.response?.data?.error || 'No se pudo obtener la lista de pedidos.', { cause: error });
    }
  },

  async obtenerPedidoPorId(id) {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pedido ${id}:`, error);
      throw new Error(error.response?.data?.error || 'No se encontró el pedido solicitado.', { cause: error });
    }
  },

  async editarPedido(id, pedidoData) {
    try {
      const response = await api.put(`/pedidos/${id}`, pedidoData);
      return response.data;
    } catch (error) {
      console.error(`Error al editar pedido ${id}:`, error);
      throw new Error(error.response?.data?.error || 'Error al actualizar el pedido.', { cause: error });
    }
  },


  async cambiarEstadoAdmin(id, nuevoEstado) {
    try {
      // El backend `editarPedido` ya maneja el cambio de estado si se envía el campo `estado`
      const response = await api.put(`/pedidos/${id}`, { estado: nuevoEstado });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado del pedido ${id}:`, error);
      throw new Error(error.response?.data?.error || `Error al cambiar estado del pedido ${id}`, { cause: error });
    }
  },

  async obtenerResumenAdmin() {
    try {
      const response = await api.get('/admin/resumen');
      return response.data;
    } catch (error) {
      console.error('Error al obtener el resumen del admin:', error);
      throw new Error(error.response?.data?.error || 'No se pudo cargar el resumen estadístico.', { cause: error });
    }
  }
};

export default pedidosService;