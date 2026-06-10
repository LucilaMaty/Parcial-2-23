// src/services/pedidos.service.js
import { Pedido, Menu, HistorialPedido, sequelize } from '../src/models/index.js';
import { Op } from 'sequelize';

// 1. Importamos la utilidad de los filtros
import { construirFiltros } from '../src/utils/filtroPedidos.util.js';

class PedidosService {
  async crearPedido(usuarioId, datosPedido) {
    const { menuId, fecha, cantidad, turnoEntrega, puntoRetiro, observaciones } = datosPedido;

    // Utilizamos una transacción para asegurar que todas las operaciones de la BD 
    // se realicen juntas o se reviertan si algo falla.
    const transaccion = await sequelize.transaction();

    try {
      // 1. Validar que la cantidad sea mayor a 0
      if (cantidad <= 0) {
        throw new Error('La cantidad del pedido debe ser mayor a cero.');
      }

      // 2. Verificar si el menú existe y está activo para la fecha
      const menu = await Menu.findByPk(menuId, { transaction: transaccion });
      if (!menu || !menu.activo || menu.fecha !== fecha) {
         throw new Error('El menú no existe, no está activo o la fecha no es válida.');
      }

      // 3. Calcular el cupo disponible
      const pedidosExistentes = await Pedido.sum('cantidad', {
        where: {
          menuId,
          fecha,
          estado: { [Op.in]: ['pendiente', 'confirmado'] } // Consideramos los pedidos activos
        },
        transaction: transaccion
      }) || 0; 

      const cupoRestante = menu.cupoDiario - pedidosExistentes;

      // Validar si la cantidad solicitada supera el cupo restante
      if (cantidad > cupoRestante) {
        throw new Error(`Cupo insuficiente. Solo quedan ${cupoRestante} viandas disponibles.`);
      }

      // 4. Calcular el total del pedido en el backend
      const totalCalculado = cantidad * menu.precio;

      // 5. Crear el pedido
      const nuevoPedido = await Pedido.create({
        usuarioId,
        menuId,
        fecha,
        cantidad,
        turnoEntrega,
        puntoRetiro,
        total: totalCalculado,
        estado: 'pendiente', 
        observaciones
      }, { transaction: transaccion });

      // 6. Registrar en el historial
      await HistorialPedido.create({
        pedidoId: nuevoPedido.id,
        usuarioId,
        accion: 'creacion',
        valorNuevo: JSON.stringify(nuevoPedido) 
      }, { transaction: transaccion });

      // Si todo fue exitoso, confirmamos la transacción
      await transaccion.commit();
      return nuevoPedido;

    } catch (error) {
      // Si ocurre un error, revertimos todos los cambios en la BD
      await transaccion.rollback();
      throw error; 
    }
  }

// PUNTO 3: Listar pedidos con filtros combinables (ahora usa la utilidad)
  async obtenerPedidosUsuario(usuarioId, filtros = {}) {
       // Usamos la función separada para mantener este archivo limpio
       const { wherePedido, whereMenu } = construirFiltros(usuarioId, filtros);

       return await Pedido.findAll({
           where: wherePedido,
           include: [{ 
             model: Menu, 
             as: 'menu',
             where: Object.keys(whereMenu).length > 0 ? whereMenu : undefined
           }] 
       });
  }

  // PUNTO 4: Ver el detalle dinámico de un pedido específico
  async obtenerDetalle(pedidoId, usuarioId) {
    const pedido = await Pedido.findOne({
      where: { id: pedidoId, usuarioId }, // Validamos que el ID coincida y que sea de este usuario
      include: [{ model: Menu, as: 'menu' }]
    });

    if (!pedido) {
      throw new Error('Pedido no encontrado o no te pertenece.');
    }
    
    return pedido;
  }
}

export default new PedidosService();