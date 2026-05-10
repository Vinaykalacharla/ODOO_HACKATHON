import { Router } from 'express';
import * as noteController from './controller.js';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { noteSchema } from './validators.js';

const router = Router();

router.use(auth);

router.get('/:id/notes', noteController.listNotes);
router.post('/:id/notes', validate(noteSchema), noteController.addNote);
router.put('/:id/notes/:noteId', validate(noteSchema), noteController.updateNote);
router.delete('/:id/notes/:noteId', noteController.deleteNote);

export default router;
