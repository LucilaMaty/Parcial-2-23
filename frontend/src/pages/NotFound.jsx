import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center mt-5">
      <div className="p-5 bg-light rounded shadow-sm border">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-4">¡Ups! Página no encontrada</h2>
        <p className="text-muted mb-4">
          Lo sentimos, la sección que estás buscando no existe o ha sido movida temporalmente.
        </p>
        <Link to="/" className="btn btn-primary px-4 py-2 fw-bold">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;