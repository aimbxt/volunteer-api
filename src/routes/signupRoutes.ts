import { Router } from 'express';
import * as signupController from '../controllers/signupController.ts';

const router = Router();
router.patch('/:id/cancel', signupController.cancelSignup);
export default router;