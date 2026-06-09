import { Pedido, Menu } from '../models/index.js'; // Ajustá la ruta según tu estructura
import { Op } from 'sequelize';

export const listarPedidos = async (req, res, next) => {
  try {
    // 1. Extraemos los posibles filtros de la URL (Query Params)
    const { fecha, estado, menuId, tipoMenu } = req.query;

    // 2. Inicializamos los objetos donde guardaremos las condiciones
    const wherePedido = {};
    const whereMenu = {};

    // 3. Agregamos las condiciones dinámicamente si el parámetro existe
    if (fecha) {
      wherePedido.fecha = fecha; 
      // Nota: Si la fecha incluye horas, podrías necesitar usar Op.gte y Op.lte para abarcar todo el día.
    }

    if (estado) {
      wherePedido.estado = estado;
    }

    if (menuId) {
      wherePedido.menuId = menuId;
    }

    if (tipoMenu) {
      // Este filtro pertenece a la tabla Menu
      whereMenu.tipo = tipoMenu;
    }

    // 4. Ejecutamos la consulta en Sequelize
    const pedidos = await Pedido.findAll({
      where: wherePedido,
      include: [
        {
          model: Menu,
          as: 'menu', // Asegurate de usar el mismo alias que definiste en tus asociaciones
          where: Object.keys(whereMenu).length > 0 ? whereMenu : undefined,
          // Si hay filtros de menú, required: true hace un INNER JOIN. 
          // Si no, se comporta como un LEFT JOIN trayendo todos los pedidos.
          required: Object.keys(whereMenu).length > 0 
        }
      ]
    });

    // 5. Devolvemos el resultado
    res.status(200).json(pedidos);

  } catch (error) {
    // El error viaja al middleware de manejo centralizado de errores (exigencia del enunciado)
    next(error); 
  }
};