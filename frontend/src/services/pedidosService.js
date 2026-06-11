// @ts-nocheck
/* eslint-disable */

import api from './api'; // Importamos el teléfono inteligente con el interceptor

const pedidosService = {
  // 1. TAREA: TRAER PEDIDOS (CON O SIN FILTROS DINÁMICOS)
  obtenerMisPedidos: async (filtros = {}) => {
    try {
      // Axios permite pasar un objeto 'params' y él solito lo transforma en ?estado=pendiente&fecha=...
      const respuesta = await api.get('/pedidos', { params: filtros });
      return respuesta.data; // Devolvemos el array de pedidos que mandó el backend
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al cargar tus pedidos');
    }
  },

  // 2. TAREA: CREAR UN NUEVO PEDIDO
  crearPedido: async (datosPedido) => {
    try {
      const respuesta = await api.post('/pedidos', datosPedido);
      return respuesta.data; // Devolvemos el pedido creado (con su ID 14, total calculado, etc.)
    } catch (error) {
      throw new Error(error.response?.data?.error || 'No se pudo registrar el pedido');
    }
  },

  // 3. TAREA: EDITAR UN PEDIDO EXISTENTE (Punto 6 del parcial)
  editarPedido: async (pedidoId, datosNuevos) => {
    try {
      const respuesta = await api.put(`/pedidos/${pedidoId}`, datosNuevos);
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al modificar el pedido');
    }
  },

  // 4. TAREA: CANCELAR UN PEDIDO (Punto 7 del parcial)
  cancelarPedido: async (pedidoId) => {
    try {
      const respuesta = await api.patch(`/pedidos/${pedidoId}/cancelar`);
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'No se pudo cancelar el pedido');
    }
  },
  // 5. TAREA DEL ADMIN: Cambiar estado a confirmado o entregado
  // (La agregamos al objeto existente adentro de pedidosService)
  cambiarEstadoAdmin: async (pedidoId, nuevoEstado) => {
    try {
      // Le pegamos al endpoint de edición o al específico de estados que tengan en el backend
      // Usamos PUT pasándole el nuevo estado en el body
      const respuesta = await api.put(`/pedidos/${pedidoId}`, { estado: nuevoEstado });
      return respuesta.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'No se pudo actualizar el estado del pedido');
    }
  }
};

export default pedidosService;