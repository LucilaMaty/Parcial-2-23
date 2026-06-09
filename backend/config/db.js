import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para obtener la ruta actual usando ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializamos Sequelize apuntando a un archivo físico local
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // Ponelo en true si querés ver las consultas SQL en la consola
});

export default sequelize;