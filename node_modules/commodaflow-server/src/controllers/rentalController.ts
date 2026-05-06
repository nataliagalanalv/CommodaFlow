import { Request, Response } from 'express';
import { rentalService } from '../services/rentalService.js';

export const createRental = async (req: Request, res: Response) => {
  try {
    const rental = await rentalService.createRental(req.body);
    // Código 201: Recurso creado con éxito
    res.status(201).json(rental);
  } catch (error: any) {
    // Código 400: Error de lógica (ej: equipo ya alquilado)
    res.status(400).json({ message: error.message });
  }
};