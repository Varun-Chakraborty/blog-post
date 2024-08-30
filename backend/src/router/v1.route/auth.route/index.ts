import { Router } from 'express';

const router = Router();

import {
  signin,
  signup,
  signout,
  refreshToken
} from '@/controllers/auth.controller';
import { isAuthenticated, isNoAuth } from '@/middlewares/auth';

router.post('/signout', isAuthenticated, signout);

router.use(isNoAuth);

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/refresh', refreshToken);

router.get('*', (req, res) =>
  res.send(
    'API v1.0\nAvailable Sub-Routes:\n- ./login\n- ./signup\n- ./signout'
  )
);

export default router;
