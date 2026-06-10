// src/utils/filtrosPedidos.util.js

export const construirFiltros = (usuarioId, queryParams) => {
  // Siempre filtramos por el usuario que está haciendo la petición
  const wherePedido = { usuarioId };
  const whereMenu = {};

  // Vamos armando el objeto dinámicamente si los parámetros existen
  if (queryParams.fecha) {
    wherePedido.fecha = queryParams.fecha;
  }
  
  if (queryParams.estado) {
    wherePedido.estado = queryParams.estado;
  }
  
  if (queryParams.menuId) {
    wherePedido.menuId = queryParams.menuId;
  }
  
  if (queryParams.tipo) {
    whereMenu.tipo = queryParams.tipo;
  }

  // Devolvemos ambos objetos empaquetados
  return { wherePedido, whereMenu };
};