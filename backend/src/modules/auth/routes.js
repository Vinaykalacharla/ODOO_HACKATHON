import { Router } from 'express';
import * as authController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { signupSchema, loginSchema } from './validators.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

export default router;
