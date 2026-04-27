import { Request, Response } from 'express';
import * as hardwareService from '../services/hardwareService.js';

export const getHardware = (req: Request, res: Response) => {
  const items = hardwareService.getAllHardware();
  res.status(200).json(items);
};

export const addHardware = (req: Request, res: Response) => {
  const { model, type, dailyRate } = req.body;

  // Validación en la frontera (Middleware manual)
  if (!model || !type || !dailyRate) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const newItem = hardwareService.createHardware({ model, type, dailyRate });
  res.status(201).json(newItem);
};