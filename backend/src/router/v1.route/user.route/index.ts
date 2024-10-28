import { userController } from '@/controllers';
import { isAuthenticated } from '@/middlewares/auth';
import { handleMeKeyword } from '@/middlewares/user';
import { Req, Res } from '@/types/express';
import { ApiResponse } from '@/utils';
import { Router } from 'express';

const router = Router({ mergeParams: true }); // to access the param "username" from the parent router

router.use(handleMeKeyword);

router.get('/profile', userController.getProfile);
router.get('/followers', userController.getFollowers);
router.get('/following', userController.getFollowing);

router.use(isAuthenticated);

router.get('/isFollowed', userController.isFollowed);
router.get('/isFollowing', userController.isFollowing);
router.get('/chats', userController.getChatPreviews);
router.get('/unreadChats', userController.getUnreadChats);
router.post('/follow', userController.followUser);
router.post('/unfollow', userController.unfollowUser);

router.get('*path', (_: Req, res: Res) =>
  new ApiResponse(
    'API v1.0\nAvailable Sub-Routes:\n- ./profile\n- ./followers\n- ./following\n- ./chats\n- ./unread-chats\n- ./isFollowed\n- ./isFollowing\n- ./follow\n- ./unfollow\n',
    undefined,
    404
  ).error(res)
);

export default router;
