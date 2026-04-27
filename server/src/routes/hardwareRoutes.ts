import { Router } from 'express';
import { getHardware, addHardware } from '../controllers/hardwareController.js';

const router = Router();

// Definición de los "puntos de entrada" (endpoints)
// La URL base ya es /api/hardware (definida en index.ts)

// GET /api/hardware -> Obtener lista
router.get('/', getHardware);

// POST /api/hardware -> Crear un equipo
router.post('/', addHardware);

export default router;