// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

// 1. Middleware para verificar que el usuario tenga un Token válido
export const verificarToken = (req, res, next) => {
  // El token suele venir en el header "Authorization: Bearer <token>" [cite: 3646]
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    // Si no hay header, devolvemos 401 (Unauthorized) [cite: 2485, 3346, 3642]
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  // Separamos la palabra "Bearer" del token en sí
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido. Use "Bearer <token>".' });
  }

  try {
    // Verificamos si el token es válido usando la clave secreta del .env [cite: 3508, 3669]
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardamos los datos del usuario (id, rol, etc.) en el objeto 'req' 
    // para que el siguiente controlador pueda usarlos.
    req.usuario = decodificado;
    
    // next() le dice a Express: "Todo ok, pasá a la siguiente función" [cite: 2505, 3638]
    next(); 
    
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// 2. Middleware para verificar si el usuario es Administrador
export const esAdmin = (req, res, next) => {
  // Primero aseguramos que req.usuario exista (esto lo pone el middleware verificarToken)
  if (!req.usuario) {
     return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  // Verificamos si el rol guardado en el JWT no es 'admin'
  if (req.usuario.rol !== 'admin') {
    // Si es un usuario común intentando hacer cosas de admin, devolvemos 403 (Forbidden) [cite: 3347, 3642]
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }

  // Si pasa la validación, continúa a la ruta [cite: 2505]
  next();
};