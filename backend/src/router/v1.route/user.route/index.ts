import { Req, Res } from '@/types/express';
import { ApiResponse } from '@/utils/ApiResponse';
import { Router } from 'express';

const router = Router();

router.get('/profile', (req: Req, res: Res) => {
  const user = req.user;
  return new ApiResponse('Get User', { user }).success(res);
});

export default router;
