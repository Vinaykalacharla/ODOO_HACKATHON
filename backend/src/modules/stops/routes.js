import { Router } from 'express';
import * as stopController from './controller.js';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createStopSchema, reorderStopsSchema } from './validators.js';

const router = Router();

router.use(auth);

router.get('/:id/stops', stopController.getTripStops);
router.post('/:id/stops', validate(createStopSchema), stopController.addStop);
router.put('/:id/stops/:stopId', validate(createStopSchema), stopController.updateStop);
router.delete('/:id/stops/:stopId', stopController.deleteStop);
router.patch('/:id/stops/reorder', validate(reorderStopsSchema), stopController.reorderStops);

export default router;
