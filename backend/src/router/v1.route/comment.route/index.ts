import { Router } from 'express';

const router = Router();

import { commentController } from '@/controllers';
import { isAuthenticated } from '@/middlewares/auth';
import { ApiResponse } from '@/utils';

router.delete('/:commentId', isAuthenticated, commentController.deleteComment);
router.get('/:commentId/replies', commentController.getRepliesByCommentId);
router.post(
	'/:commentId/reply',
	isAuthenticated,
	commentController.replyToComment
);
router.post('/:commentId/like', isAuthenticated, commentController.likeComment);
router.delete(
	'/:commentId/like',
	isAuthenticated,
	commentController.unlikeComment
);

router.get('*path', (_, res) => {
	new ApiResponse(
		'API v1.0\nAvailable Sub-Routes:\n- ./:id/replies\n- ./:id/reply\n- ./:id/like\n- ./:id/unlike\n',
		undefined,
		404
	).error(res);
});

export default router;
