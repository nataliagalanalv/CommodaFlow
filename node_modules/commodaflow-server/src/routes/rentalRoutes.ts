import { Router } from 'express';
import { createRental } from '../controllers/rentalController.js';

const router = Router();

// POST /api/rentals
router.post('/', createRental);

export default router;