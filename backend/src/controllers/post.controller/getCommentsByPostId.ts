import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getCommentsByPostId = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { postId } = req.params;

	const prisma = getPrismaClient();

	const comments = await prisma.comment.findMany({
		where: {
			postId
		},
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
			_count: { select: { likes: true, replies: true } },
			likes: { where: { authorId: req.user?.id }, select: { id: true } }
		},
		orderBy: { createdAt: 'desc' }
	});

	return new ApiResponse('Comments retrieved successfully', {
		comments: comments.map(comment => ({
			...comment,
			liked: !!comment.likes.length,
			likes: undefined
		}))
	}).success(res);
});
