import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getFollowing = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { username } = req.params;

	if (!username)
		return new ApiResponse('Username is required', undefined, 400).error(res);

	const prisma = getPrismaClient();

	const user = await prisma.user.findUnique({
		where: { username },
		select: { id: true }
	});

	if (!user)
		return new ApiResponse('User does not exist', undefined, 404).error(res);

	const followings = await prisma.follow.findMany({
		where: {
			followerId: user.id
		},
		include: {
			following: {
				select: {
					id: true,
					username: true,
					name: true,
					profilePicture: true,
					createdAt: true
				}
			}
		}
	});
	return new ApiResponse('Followings fetched', {
		following: followings.map(f => f.following)
	}).success(res);
});
