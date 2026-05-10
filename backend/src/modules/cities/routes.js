import { Router } from 'express';
import * as cityController from './controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', cityController.listCities);

export default router;
