import { Request, Response } from 'express';
import { hardwareService } from '../services/hardwareService.js';
import { HardwareStatus } from '../models/Hardware.js';
import { catchAsync } from '../utils/catchAsync.js';

// 1. Obtener todo el inventario
export const getInventory = catchAsync(async (req: Request, res: Response) => {
  const items = hardwareService.getAll();
  res.status(200).json(items);
});

// 2. Crear un nuevo equipo
export const createHardware = catchAsync(async (req: Request, res: Response) => {
  const newItem = hardwareService.create(req.body);
  res.status(201).json(newItem);
});

// 3. Actualizar estado
export const updateHardwareStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const updatedItem = hardwareService.updateStatus(id, status as HardwareStatus);
  
  if (!updatedItem) {
    // Aquí puedes usar un error personalizado en el futuro
    const error = new Error("Equipo no encontrado");
    (error as any).statusCode = 404;
    throw error;
  }

  res.status(200).json(updatedItem);
});