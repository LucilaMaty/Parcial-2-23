import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Sincroniza los modelos con la base de datos SQLite (crea las tablas si no existen)
    await sequelize.sync({ force: false }); // Usar force: true solo si quieren borrar todo al reiniciar
    console.log('✅ Base de datos SQLite conectada y sincronizada.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer();