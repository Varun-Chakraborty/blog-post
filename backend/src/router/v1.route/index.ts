import { Router } from 'express';

const router = Router();

import authRouter from './auth.route';
import userRouter from './user.route';
import { search, isUsernameAvailable } from '@/controllers';
import { authenticate, isAuthenticated, isNoAuth } from '@/middlewares/auth';

router.use(authenticate);

router.use('/auth', authRouter);
router.get('/isUsernameAvailable', isNoAuth, isUsernameAvailable);
router.use('/user', isAuthenticated, userRouter);

router.get('/search', search);

router.get('*', (req, res) =>
  res.send('API v1.0\nAvailable Sub-Routes:\n- ./auth\n- ./search')
);

export default router;
