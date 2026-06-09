import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY, // Usamos DATEONLY para trabajar solo con YYYY-MM-DD [cite: 1822]
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING, // clásico, vegetariano, vegano, sin tacc [cite: 1822]
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cupoDiario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

export default Menu;