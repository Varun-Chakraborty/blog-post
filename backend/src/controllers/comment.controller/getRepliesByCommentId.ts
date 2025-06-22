import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getRepliesByCommentId = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { commentId } = req.params;

	if (!commentId)
		return new ApiResponse('CommentId is required', undefined, 400).error(res);

	const prisma = getPrismaClient();

	const comment = await prisma.comment.findUnique({
		where: {
			id: commentId
		}
	});

	if (!comment)
		return new ApiResponse('Comment does not exist', undefined, 404).error(res);

	const replies = await prisma.comment.findMany({
		where: {
			parentId: commentId
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
		}
	});
	return new ApiResponse('Replies retrieved successfully', {
		replies: replies.map(reply => ({
			...reply,
			liked: !!reply.likes.length,
			likes: undefined
		}))
	}).success(res);
});
