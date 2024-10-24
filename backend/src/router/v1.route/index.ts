import { Router } from 'express';

const router = Router();

import authRouter from './auth.route';
import userRouter from './user.route';
import { search, userController } from '@/controllers';
import { authenticate, isNotAuthenticated } from '@/middlewares/auth';

router.use(authenticate);

router.use('/auth', authRouter);
router.get(
  '/isUsernameAvailable',
  isNotAuthenticated,
  userController.isUsernameAvailable
);
router.use('/user/:username', userRouter);

router.get('/search', search);

router.get('*path', (_, res) =>
  res.send(
    'API v1.0\nAvailable Sub-Routes:\n- ./user/:username\n- ./auth\n- ./search\n'
  )
);

export default router;
