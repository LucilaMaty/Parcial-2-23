import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const HistorialPedido = sequelize.define('HistorialPedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accion: {
    type: DataTypes.STRING, // Creacion, edicion, confirmacion, cancelacion, entrega [cite: 1827]
    allowNull: false,
  },
  fechaHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  valorAnterior: {
    type: DataTypes.TEXT, // Guardamos como JSON stringified para flexibilidad [cite: 1827]
    allowNull: true,
  },
  valorNuevo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default HistorialPedido;