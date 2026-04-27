import { Request, Response } from 'express';
import * as rentalService from '../services/rentalService.js';

export const getRentals = (req: Request, res: Response) => {
  const { userId } = req.query; // Podríamos filtrar por ?userId=xxx
  
  if (userId && typeof userId === 'string') {
    const userRentals = rentalService.getRentalsByUserId(userId);
    return res.status(200).json(userRentals);
  }

  const allRentals = rentalService.getAllRentals();
  res.status(200).json(allRentals);
};

export const addRental = (req: Request, res: Response) => {
    console.log("📥 Nueva solicitud de alquiler recibida:", req.body);
  try {
    const { hardwareId, userId, startDate, endDate, totalPrice } = req.body;

    // Validación de frontera
    if (!hardwareId || !userId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para el alquiler' });
    }

    const newRental = rentalService.createRental({ 
      hardwareId, 
      userId, 
      startDate, 
      endDate, 
      totalPrice 
    });

    res.status(201).json(newRental);
  } catch (error) {
    res.status(500).json({ message: 'Error interno al procesar el alquiler' });
  }
};