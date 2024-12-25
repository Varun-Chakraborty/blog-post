import { Router } from 'express';

const router = Router();

import { postController } from '@/controllers';
import { ApiResponse } from '@/utils';
import { isAuthenticated } from '@/middlewares/auth';

router.get('/', postController.getPosts);
router
  .route('/:postId')
  .get(postController.getPostById)
  .delete(postController.deletePostById);
router.get('/:postId/comments', postController.getCommentsByPostId);

router.use(isAuthenticated);

router.post('/:postId/comment', postController.commentOnPost);
router.post('/:postId/like', postController.likePost);
router.delete('/:postId/like', postController.unlikePost);

router.get('*path', (_, res) =>
  new ApiResponse(
    'API v1.0\nAvailable Sub-Routes:\n- ./\n- ./:id\n- ./:id/comments\n- ./:id/like\n- ./:id/unlike\n',
    undefined,
    404
  ).error(res)
);

export default router;
