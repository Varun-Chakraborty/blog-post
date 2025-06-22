import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getPosts = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const prisma = getPrismaClient();
	const posts = await prisma.post.findMany({
		include: {
			author: {
				select: {
					id: true,
					username: true,
					name: true,
					profilePicture: true,
					createdAt: true
				}
			},
			_count: { select: { comments: true, likes: true } },
			likes: { where: { authorId: req.user?.id }, select: { id: true } }
		}
	});
	return new ApiResponse('Posts retrieved successfully', {
		posts: posts.map(post => ({
			...post,
			liked: !!post.likes.length,
			likes: undefined
		}))
	}).success(res);
});
