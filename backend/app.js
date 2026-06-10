// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importamos las rutas de autenticación (registro/login) [cite: 3636, 3637]
import authRoutes from './src/routes/auth.routes.js';
import { sequelize } from './src/models/index.js'; // Importamos la sincronización de la DB

// Importamos las rutas de pedidos
import pedidosRoutes from './src/routes/pedido.routes.js';

dotenv.config();

const app = express();

// Middlewares globales indispensables
app.use(cors());
app.use(express.json()); // Habilita la lectura de req.body en formato JSON

// Montamos las rutas de autenticación
app.use('/api/auth', authRoutes);

// Montamos las rutas de pedidos
app.use('/api/pedidos', pedidosRoutes);

// Middleware de manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error capturado por el middleware:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Función para arrancar el servidor sincronizando la base de datos local
const iniciarServidor = async () => {
  try {
    // Sincroniza los modelos con SQLite antes de escuchar peticiones
    await sequelize.sync({ force: false }); 
    console.log('📦 Base de datos de SQLite conectada y sincronizada.');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Error crítico al inicializar el backend:', error);
  }
};

iniciarServidor();

export default app;