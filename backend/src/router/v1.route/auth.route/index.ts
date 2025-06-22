import { Router } from 'express';

const router = Router();

import { authController } from '@/controllers';
import { isAuthenticated, isNotAuthenticated } from '@/middlewares/auth';
import { ApiResponse } from '@/utils';

router.post('/signout', isAuthenticated, authController.signout);

router.use(isNotAuthenticated);

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/refresh', authController.refreshToken);

router.get('*path', (_, res) => {
	new ApiResponse(
		'API v1.0\nAvailable Sub-Routes:\n- ./signin\n- ./signup\n- ./signout\n- ./refresh\n',
		undefined,
		404
	).error(res);
});

export default router;
