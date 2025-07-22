import { getPrismaClient } from '@/db';
import { ExpressTypes, User, Post } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getProfile = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	let { username } = req.params;

	if (!username)
		return new ApiResponse('Username is required', undefined, 400).error(res);

	const prisma = getPrismaClient();

	const user: User | null = await prisma.user.findUnique({
		where: { username },
		omit: { password: true, refreshToken: true },
		include: {
			_count: { select: { followers: true, following: true, posts: true } }
		}
	});

	if (!user)
		return new ApiResponse('User not found', undefined, 404).error(res);
	return new ApiResponse('User found', { user }).success(res);
});

function countFollowers(followers: { id: string }[]) {
	return followers.length;
}

function countFollowing(following: { id: string }[]) {
	return following.length;
}

function countPosts(posts: Post[]) {
	return posts.length;
}
