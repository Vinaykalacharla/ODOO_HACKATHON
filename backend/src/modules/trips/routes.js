import { Router } from 'express';
import * as tripController from './controller.js';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createTripSchema, updateTripSchema } from './validators.js';

const router = Router();

router.use(auth); // All trip routes require auth

router.get('/', tripController.getAllTrips);
router.post('/', validate(createTripSchema), tripController.createTrip);
router.get('/:id', tripController.getTrip);
router.put('/:id', validate(updateTripSchema), tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);
router.get('/:id/cost-summary', tripController.getCostSummary);
router.patch('/:id/visibility', tripController.toggleVisibility);

export default router;
