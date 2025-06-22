import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const deletePostById = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { postId } = req.params;

	if (!postId)
		return new ApiResponse('PostId is required', undefined, 400).error(res);

	const prisma = getPrismaClient();
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		}
	});
	if (!post)
		return new ApiResponse('Post not found', undefined, 404).error(res);
	if (post.authorId !== req.user?.id)
		return new ApiResponse(
			'You are not authorized to delete this post',
			undefined,
			403
		).error(res);
	await prisma.post.delete({
		where: {
			id: postId
		}
	});
	return new ApiResponse('Post deleted successfully', undefined, 200).success(
		res
	);
});
