import { wrapperFx } from '@/utils';
import { getPrismaClient } from '@/db';
import { ApiResponse } from '@/utils';
import { ExpressTypes } from '@/types';

export const deleteComment = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { commentId } = req.params;
	const prisma = getPrismaClient();
	const comment = await prisma.comment.findUnique({
		where: {
			id: commentId
		}
	});
	if (!comment)
		return new ApiResponse('Comment not found', undefined, 404).error(res);
	if (comment.authorId !== req.user?.id)
		return new ApiResponse(
			'You are not authorized to delete this comment',
			undefined,
			403
		).error(res);
	await prisma.comment.delete({
		where: {
			id: commentId
		}
	});
	return new ApiResponse(
		'Comment deleted successfully',
		undefined,
		200
	).success(res);
});
