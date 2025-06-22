import { Router } from 'express';

const router = Router();

import authRouter from './auth.route';
import chatRouter from './chat.route';
import postRouter from './post.route';
import userRouter from './user.route';
import commentRouter from './comment.route';

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
router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/post', postRouter);
router.get('/search', search);
router.use('/comment', commentRouter);

router.get('*path', (_, res) => {
	new ApiResponse(
		'API v1.0\nAvailable Sub-Routes:\n- ./auth\n./user/:username\n- ./search\n- ./chat\n',
		undefined,
		404
	).error(res);
});

export default router;
