import { Router } from 'express';
import { 
  getInventory, 
  createHardware, 
  updateHardwareStatus 
} from '../controllers/hardwareController.js';

const router = Router();

/**
 * @route   GET /api/hardware
 * @desc    Obtener todos los equipos del inventario (conectado a MongoDB)
 */
router.get('/', getInventory);

/**
 * @route   POST /api/hardware
 * @desc    Crear un nuevo equipo (usado por el formulario de Admin)
 */
router.post('/', createHardware);

/**
 * @route   PATCH /api/hardware/:id/status
 * @desc    Actualizar disponibilidad (disponible, alquilado, mantenimiento)
 */
router.patch('/:id/status', updateHardwareStatus);

export default router;