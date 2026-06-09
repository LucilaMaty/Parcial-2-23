import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // Atajamos de entrada cantidades menores o iguales a cero [cite: 1838]
    },
  },
  turnoEntrega: {
    type: DataTypes.STRING, // almuerzo, cena [cite: 1825]
    allowNull: false,
  },
  puntoRetiro: {
    type: DataTypes.STRING, // Campus Buffet, Dirección, etc. [cite: 1825]
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false, // Calculado en backend en la Fase 3 [cite: 1847]
  },
  estado: {
    type: DataTypes.STRING, // pendiente, confirmado, cancelado, entregado [cite: 1825]
    allowNull: false,
    defaultValue: 'pendiente',
  },
  observaciones: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Pedido;