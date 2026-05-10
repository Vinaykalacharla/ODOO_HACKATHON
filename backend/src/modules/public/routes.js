import { Router } from 'express';
import * as publicController from './controller.js';

const router = Router();

// No auth required for public routes
router.get('/:shareToken', publicController.getPublicItinerary);

export default router;
