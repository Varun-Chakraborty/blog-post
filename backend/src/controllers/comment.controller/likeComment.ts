import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const likeComment = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { commentId } = req.params;
	const { id: userId } = req.user!;

	if (!commentId)
		return new ApiResponse('CommentId is required', undefined, 400).error(res);

	const prisma = getPrismaClient();

	const comment = await prisma.comment.findUnique({
		where: { id: commentId }
	});
	if (!comment)
		return new ApiResponse('Comment not found', undefined, 404).error(res);

	const like = await prisma.like.findFirst({
		where: {
			AND: [{ authorId: userId }, { commentId: commentId }]
		}
	});

	if (like)
		return new ApiResponse(
			'You have already liked this comment',
			undefined,
			409
		).error(res);

	await prisma.like.create({
		data: {
			authorId: userId,
			commentId: commentId
		}
	});

	return new ApiResponse('Comment liked successfully', undefined, 201).success(
		res
	);
});
