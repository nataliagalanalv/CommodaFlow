import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // 1. Logueamos el error para el desarrollador
  console.error(`[ERROR] ${err.message}`);

  // 2. Determinamos el código de estado (por defecto 500)
  const statusCode = err.statusCode || 500;

  // 3. Enviamos una respuesta uniforme al cliente
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Error interno del servidor',
    // Solo enviamos el stack trace en desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};