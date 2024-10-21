import { userController } from '@/controllers';
import { Req, Res } from '@/types/express';
import { Router } from 'express';

const router = Router({ mergeParams: true }); // to access the param "username" from the parent router

router.get('/profile', userController.getProfile);

router.get('*', (_: Req, res: Res) =>
  res.send('API v1.0\nAvailable Sub-Routes:\n- ./profile\n')
);

export default router;
