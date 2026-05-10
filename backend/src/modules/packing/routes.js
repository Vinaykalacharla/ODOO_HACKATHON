import { Router } from 'express';
import * as packingController from './controller.js';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { packingItemSchema } from './validators.js';

const router = Router();

router.use(auth);

router.get('/:id/packing', packingController.listPacking);
router.post('/:id/packing', validate(packingItemSchema), packingController.addItem);
router.patch('/:id/packing/:itemId', packingController.toggleItem);
router.delete('/:id/packing/:itemId', packingController.deleteItem);

export default router;
