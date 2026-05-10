import { Router } from 'express';
import * as budgetController from './controller.js';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { budgetEntrySchema } from './validators.js';

const router = Router();

router.use(auth);

router.get('/:id/budget', budgetController.listBudget);
router.post('/:id/budget', validate(budgetEntrySchema), budgetController.addEntry);
router.put('/:id/budget/:entryId', validate(budgetEntrySchema), budgetController.updateEntry);
router.delete('/:id/budget/:entryId', budgetController.deleteEntry);

export default router;
