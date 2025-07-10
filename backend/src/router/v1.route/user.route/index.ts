import { userController } from '@/controllers';
import { isAuthenticated } from '@/middlewares/auth';
import {
	authorizeIfRequestedUserIsMe,
	resolveUsernameMeKeyword
} from '@/middlewares/user';
import { Req, Res } from '@/types/express';
import { ApiResponse } from '@/utils';
import { Router } from 'express';

const router = Router();

router.get(
	'/:username/profile',
	resolveUsernameMeKeyword,
	userController.getProfile
);
router.get(
	'/:username/profile/summary',
	resolveUsernameMeKeyword,
	userController.getProfileSummary
);
router.get(
	'/:username/followers',
	resolveUsernameMeKeyword,
	userController.getFollowers
);
router.get(
	'/:username/following',
	resolveUsernameMeKeyword,
	userController.getFollowing
);
router.get(
	'/:username/posts',
	resolveUsernameMeKeyword,
	userController.getPosts
);
router.get('/suggestions', userController.getSuggestions);

router.use(isAuthenticated);

router.get(
	'/:username/isFollowedByUser',
	resolveUsernameMeKeyword,
	userController.isFollowed
);
router.get(
	'/:username/isFollowingUser',
	resolveUsernameMeKeyword,
	userController.isFollowing
);
router.post('/:username/follow', userController.followUser);
router.delete('/:username/follow', userController.unfollowUser);

router.get(
	'/:username/chats',
	resolveUsernameMeKeyword,
	authorizeIfRequestedUserIsMe,
	userController.getChatPreviews
);
router.get(
	'/:username/unreadChats',
	resolveUsernameMeKeyword,
	authorizeIfRequestedUserIsMe,
	userController.getUnreadChats
);
router.get(
	'/:username/likedPosts',
	resolveUsernameMeKeyword,
	authorizeIfRequestedUserIsMe,
	userController.getLikedPosts
);

router.get('*path', (_: Req, res: Res) => {
	new ApiResponse(
		'API v1.0\nAvailable Sub-Routes:\n- /:username/profile\n- ./:username/profile/summary\n- ./:username/followers\n- ./:username/following\n- ./:username/isFollowedByUser\n- ./:username/isFollowingUser\n- ./:username/posts\n- ./:username/suggestions\n- ./:username/follow\n- ./:username/unfollow\n- ./:username/chats\n- ./:username/unreadChats\n',
		undefined,
		404
	).error(res);
});

export default router;
