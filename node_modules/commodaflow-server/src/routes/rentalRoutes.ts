import { Router } from 'express';
import { getRentals, addRental } from '../controllers/rentalController.js';

const router = Router();

// GET /api/rentals -> Listar todos (o por usuario con query string)
router.get('/', getRentals);

// POST /api/rentals -> Crear nueva solicitud de alquiler
router.post('/', addRental);

export default router;