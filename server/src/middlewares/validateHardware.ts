import { Request, Response, NextFunction } from 'express';

export const validateHardware = (req: Request, res: Response, next: NextFunction) => {
  const { model, dailyRate, status } = req.body;

  // Validación básica (puedes usar librerías como Zod o Joi aquí)
  if (!model || typeof dailyRate !== 'number' || dailyRate <= 0) {
    return res.status(400).json({ 
      message: "Datos inválidos: El modelo es obligatorio y el precio debe ser un número positivo." 
    });
  }

  const validStatuses = ['available', 'rented', 'maintenance'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Estado de hardware no permitido." });
  }

  // Si todo está bien, llamamos a next() para pasar al Controlador
  next();
};