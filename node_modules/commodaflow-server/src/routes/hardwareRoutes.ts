import { Router } from 'express';
import { 
  getInventory, 
  createHardware, 
  updateHardwareStatus 
} from '../controllers/hardwareController.js';

const router = Router();

// Definición de Endpoints REST
router.get('/', getInventory);                // GET /api/hardware
router.post('/', createHardware);             // POST /api/hardware
router.patch('/:id/status', updateHardwareStatus); // PATCH /api/hardware/1/status

export default router;