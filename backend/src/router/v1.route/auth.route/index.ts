import { Router } from 'express';

const router = Router();

import { authController } from '@/controllers';
import { isAuthenticated, isNotAuthenticated } from '@/middlewares/auth';

router.post('/signout', isAuthenticated, authController.signout);

router.use(isNotAuthenticated);

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/refresh', authController.refreshToken);

router.get('*', (_, res) =>
  res.send(
    'API v1.0\nAvailable Sub-Routes:\n- ./login\n- ./signup\n- ./signout\n- ./refresh'
  )
);

export default router;
