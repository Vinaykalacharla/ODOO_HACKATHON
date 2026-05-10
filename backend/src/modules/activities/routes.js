import { Router } from 'express';
import * as activityController from './controller.js';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { addActivitySchema } from './validators.js';

const router = Router();

router.use(auth);

router.post('/stops/:stopId/activities', validate(addActivitySchema), activityController.addActivity);
router.delete('/stops/:stopId/activities/:taId', activityController.removeActivity);
router.patch('/stops/:stopId/activities/:taId', activityController.updateActivity);
router.get('/cities/:id/activities', activityController.listCityActivities);

export default router;
