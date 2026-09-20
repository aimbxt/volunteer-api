import { Router } from 'express';
import * as signupController from '../controllers/signupController.ts';
import { requireAuth } from '../middleware/requireAuth.ts';

const router = Router();

router.use(requireAuth);

router.patch('/:id/cancel', signupController.cancelSignup);

export default router;