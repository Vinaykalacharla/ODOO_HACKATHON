import { Router } from 'express';
import * as adminController from './controller.js';
import { auth } from '../../middleware/auth.js';
import { adminGuard } from '../../middleware/adminGuard.js';

const router = Router();

router.use(auth);
router.use(adminGuard); // All admin routes require admin privileges

router.get('/stats', adminController.getStats);
router.get('/users', adminController.listUsers);

export default router;
