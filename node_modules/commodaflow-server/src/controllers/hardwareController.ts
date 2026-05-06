import { Request, Response } from 'express';
import { Hardware, HardwareStatus } from '../models/Hardware.js';
import { catchAsync } from '../utils/catchAsync.js';
import { hardwareService } from '../services/hardwareService.js';

// 1. Obtener todo el inventario (Ordenado por fecha de creación)
export const getInventory = catchAsync(async (_req: Request, res: Response) => {
  // .find() sin parámetros trae todo, .sort({ createdAt: -1 }) pone los nuevos primero
  const items = await hardwareService.getAll();
  res.status(200).json(items);
});

// 2. Crear un nuevo equipo
export const createHardware = catchAsync(async (req: Request, res: Response) => {
  // Mongoose valida automáticamente los campos según el Schema
  const newItem = await hardwareService.create(req.body);
  res.status(201).json(newItem);
});

// 3. Actualizar estado
export const updateHardwareStatus = catchAsync(async (req: Request, res: Response) => {
  // Forzamos a que id sea tratado como string
  const id = req.params.id as string; 
  const { status } = req.body;

  // Ahora TS ya no se quejará aquí
  const updatedItem = await hardwareService.updateStatus(id, status as HardwareStatus);
  
  if (!updatedItem) {
    const error = new Error("Equipo no encontrado");
    (error as any).statusCode = 404;
    throw error;
  }

  res.status(200).json(updatedItem);
});