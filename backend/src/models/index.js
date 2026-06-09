import sequelize from '../../config/db.js';
import Usuario from './usuario.js';
import Menu from './menu.js';
import Pedido from './pedido.js';
import HistorialPedido from './historialPedido.js';

// ==========================================
// Definición de Relaciones (FKs) 
// ==========================================

// Un Menú tiene muchos Pedidos
Menu.hasMany(Pedido, { foreignKey: 'menuId', as: 'pedidos' });
Pedido.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });

// Un Usuario puede crear muchos Pedidos
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Un Pedido genera muchos registros de Historial
Pedido.hasMany(HistorialPedido, { foreignKey: 'pedidoId', as: 'historiales' });
HistorialPedido.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

// El historial registra qué usuario hizo la acción
Usuario.hasMany(HistorialPedido, { foreignKey: 'usuarioId', as: 'historiales' });
HistorialPedido.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export { sequelize, Usuario, Menu, Pedido, HistorialPedido };