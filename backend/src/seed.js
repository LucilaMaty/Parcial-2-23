// src/seed.js
import bcrypt from 'bcryptjs';
import { sequelize, Usuario, Menu, Pedido } from '../src/models/index.js';

const cargarDatosSemilla = async () => {
  try {
    // Sincroniza la base de datos destruyendo las tablas existentes (ideal para desarrollo)
    await sequelize.sync({ force: true });
    console.log('📦 Base de datos reiniciada para carga de semillas.');

    // 1. Hashear contraseña por defecto para los usuarios de prueba
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    // 2. Crear Usuarios (1 admin, 2 comunes) 
    const usuariosData = [
      { nombre: 'Admin Master', email: 'admin@dds.com', passwordHash, rol: 'admin', activo: true },
      { nombre: 'Juan Perez', email: 'juan@dds.com', passwordHash, rol: 'usuario', activo: true },
      { nombre: 'Maria Lopez', email: 'maria@dds.com', passwordHash, rol: 'usuario', activo: true }
    ];
    const usuarios = await Usuario.bulkCreate(usuariosData);
    console.log('👤 Usuarios semilla creados.');

    // 3. Crear 6 Menús (activos y con cupos) 
    const hoy = new Date().toISOString().split('T')[0]; // Fecha actual YYYY-MM-DD
    const menusData = [
      { nombre: 'Milanesa con Puré', descripcion: 'Clásico argentino', fecha: hoy, tipo: 'clasico', precio: 5000, cupoDiario: 50, activo: true },
      { nombre: 'Ensalada Caesar', descripcion: 'Con pollo grillado', fecha: hoy, tipo: 'clasico', precio: 4500, cupoDiario: 30, activo: true },
      { nombre: 'Wok de Vegetales', descripcion: 'Solo vegetales salteados', fecha: hoy, tipo: 'vegetariano', precio: 4800, cupoDiario: 20, activo: true },
      { nombre: 'Hamburguesa de Lentejas', descripcion: 'Con papas rústicas', fecha: hoy, tipo: 'vegano', precio: 5200, cupoDiario: 15, activo: true },
      { nombre: 'Fideos de Arroz', descripcion: 'Apto celíacos', fecha: hoy, tipo: 'sin tacc', precio: 4900, cupoDiario: 25, activo: true },
      { nombre: 'Pollo al Horno', descripcion: 'Con ensalada mixta', fecha: hoy, tipo: 'clasico', precio: 5500, cupoDiario: 40, activo: true }
    ];
    const menus = await Menu.bulkCreate(menusData);
    console.log('🍔 Menús semilla creados.');

    // 4. Crear 12 Pedidos en distintos estados 
    const pedidosData = [];
    const estados = ['pendiente', 'confirmado', 'entregado', 'cancelado'];
    
    for (let i = 0; i < 12; i++) {
      pedidosData.push({
        usuarioId: usuarios[(i % 2) + 1].id, // Alterna entre los usuarios comunes
        menuId: menus[i % 6].id,             // Alterna entre los menús
        fecha: hoy,
        cantidad: Math.floor(Math.random() * 3) + 1, // Cantidad entre 1 y 3
        turnoEntrega: i % 2 === 0 ? 'almuerzo' : 'cena',
        puntoRetiro: 'Campus Buffet',
        total: 5000, // En un caso real se recalcula, acá lo forzamos para la semilla
        estado: estados[i % 4], // Distribuye los estados 
        observaciones: 'Sin sal por favor'
      });
    }
    await Pedido.bulkCreate(pedidosData);
    console.log('📦 12 Pedidos semilla creados.');

    console.log('✅ ¡Semilla de datos ejecutada con éxito!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al cargar la semilla de datos:', error);
    process.exit(1);
  }
};

cargarDatosSemilla();