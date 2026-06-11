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

       if (usuarioId === null) {
          delete wherePedido.usuarioId;
        }  

       return await Pedido.findAll({
           where: wherePedido,
           include: [{ 
             model: Menu, 
             as: 'menu',
             where: Object.keys(whereMenu).length > 0 ? whereMenu : undefined
           }] 
       });
  }

  // 🌟 NUEVA FUNCIÓN: Buscar un pedido individual (Punto 3 del parcial)
  async obtenerPedidoPorId(id) {
      return await Pedido.findByPk(id, {
          include: [{ 
              model: Menu, 
              as: 'menu' 
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
  
  // PUNTO 6: Editar un pedido
  async editarPedido(pedidoId, usuarioId, datosNuevos, rol) { // 🌟 1. Recibe el rol
    // 🌟 2. Agregamos "estado" para que el Admin pueda cambiarlo
    const { cantidad, turnoEntrega, puntoRetiro, observaciones, estado } = datosNuevos; 
    
    // Abrimos transacción por si algo falla al editar y guardar historial
    const transaccion = await sequelize.transaction();

    try {
      // 🌟 3. Buscamos el pedido SOLO por su ID (sin importar de quién es todavía)
      const pedido = await Pedido.findByPk(pedidoId, {
        include: [{ model: Menu, as: 'menu' }],
        transaction: transaccion
      });

      if (!pedido) throw new Error('Pedido no encontrado en el sistema.');
      
      // 🌟 4. EL PATOVICA: Validamos quién es el dueño o si es Admin
      if (rol !== 'admin' && pedido.usuarioId !== usuarioId) {
        throw new Error('Pedido no encontrado o no tienes permiso.');
      }
      
      // Validamos que no esté entregado ni cancelado
      if (pedido.estado === 'entregado' || pedido.estado === 'cancelado') {
        throw new Error('No se puede editar un pedido que ya fue entregado o cancelado.');
      }

      // Guardamos cómo estaba el pedido antes para el historial
      const valorAnterior = {
        cantidad: pedido.cantidad,
        turnoEntrega: pedido.turnoEntrega,
        puntoRetiro: pedido.puntoRetiro,
        observaciones: pedido.observaciones,
        estado: pedido.estado // Guardamos el estado anterior
      };

      // 🌟 5. CIRCUITO ADMIN: Si nos mandan un nuevo "estado", lo actualizamos
      if (estado) {
        pedido.estado = estado;
      }

      // 6. Si cambió la cantidad, hay que recalcular el cupo y el total
      if (cantidad && cantidad !== pedido.cantidad) {
        if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero.');
        
        const diferencia = cantidad - pedido.cantidad;
        
        // Si pide más de lo que ya tenía, verificamos si hay cupo
        if (diferencia > 0) {
          const pedidosExistentes = await Pedido.sum('cantidad', {
            where: { menuId: pedido.menu.id, fecha: pedido.menu.fecha, estado: { [Op.in]: ['pendiente', 'confirmado'] } },
            transaction: transaccion
          }) || 0;
          
          const cupoRestante = pedido.menu.cupoDiario - pedidosExistentes;
          if (diferencia > cupoRestante) {
            throw new Error(`Cupo insuficiente. Solo quedan ${cupoRestante} viandas más disponibles.`);
          }
        }
        
        pedido.cantidad = cantidad;
        pedido.total = cantidad * pedido.menu.precio; // Recalculamos total
      }

      // 7. Actualizamos el resto de los campos si los enviaron
      if (turnoEntrega) pedido.turnoEntrega = turnoEntrega;
      if (puntoRetiro) pedido.puntoRetiro = puntoRetiro;
      if (observaciones !== undefined) pedido.observaciones = observaciones;

      await pedido.save({ transaction: transaccion });

      // 8. Guardamos en el historial
      await HistorialPedido.create({
        pedidoId: pedido.id,
        usuarioId, // Quien ejecutó la acción (puede ser admin o alumno)
        accion: estado ? 'cambio_estado' : 'edicion', // Diferenciamos la acción
        valorAnterior: JSON.stringify(valorAnterior),
        valorNuevo: JSON.stringify({ 
          cantidad: pedido.cantidad, 
          turnoEntrega: pedido.turnoEntrega, 
          puntoRetiro: pedido.puntoRetiro,
          estado: pedido.estado 
        })
      }, { transaction: transaccion });

      await transaccion.commit();
      return pedido;

    } catch (error) {
      await transaccion.rollback();
      throw error;
    }
  }

  // PUNTO 7: Cancelar un pedido
  async cancelarPedido(pedidoId, usuarioId) {
    const pedido = await Pedido.findOne({ where: { id: pedidoId, usuarioId } });
    
    if (!pedido) throw new Error('Pedido no encontrado o no te pertenece.');
    if (pedido.estado === 'entregado' || pedido.estado === 'cancelado') {
      throw new Error('El pedido ya está entregado o cancelado.');
    }

    const valorAnterior = { estado: pedido.estado };
    
    // Cambiamos el estado a cancelado
    pedido.estado = 'cancelado';
    await pedido.save();

    // Guardamos en el historial
    await HistorialPedido.create({
      pedidoId: pedido.id,
      usuarioId,
      accion: 'cancelacion',
      valorAnterior: JSON.stringify(valorAnterior),
      valorNuevo: JSON.stringify({ estado: 'cancelado' })
    });

    return pedido;
  }

  // NUEVA FUNCIÓN: Obtener menús activos para hoy
  async obtenerMenusActivosHoy() {
    // Usamos la fecha local para evitar problemas de zona horaria con UTC
    const hoy = new Date().toLocaleDateString('en-CA'); // Retorna YYYY-MM-DD
    
    return await Menu.findAll({
      where: {
        activo: true,
        fecha: hoy, 
      },
      attributes: ['id', 'nombre', 'precio', 'cupoDiario'], // Solo retornar campos necesarios
    });
  }
}

export default new PedidosService();