import { Router } from 'express';

const router = Router();

import authRouter from './auth.route';
import userRouter from './user.route';
import chatRouter from './chat.route';
import { search, userController } from '@/controllers';
import { authenticate, isNotAuthenticated } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';

router.use(authenticate);

router.use('/auth', authRouter);
router.get(
  '/isUsernameAvailable',
  isNotAuthenticated,
  userController.isUsernameAvailable
);
router.use('/user/:username', userRouter);
router.use('/chat', chatRouter);
router.get('/search', search);

router.get('*path', (_, res) =>
  new ApiResponse(
    'API v1.0\nAvailable Sub-Routes:\n- ./auth\n./user/:username\n- ./search\n- ./chat\n',
    undefined,
    404
  ).error(res)
);

export default router;
