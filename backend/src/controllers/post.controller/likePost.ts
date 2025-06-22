import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const likePost = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { postId } = req.params;
	const { id: userId } = req.user!;

	if (!postId)
		return new ApiResponse('PostId is required', undefined, 400).error(res);

	const prisma = getPrismaClient();

	const post = await prisma.post.findUnique({
		where: { id: postId }
	});

	if (!post)
		return new ApiResponse('Post not found', undefined, 404).error(res);

	const like = await prisma.like.findFirst({
		where: {
			AND: [{ authorId: userId }, { postId }]
		}
	});

	if (like)
		return new ApiResponse(
			'You have already liked this post',
			undefined,
			409
		).error(res);

	await prisma.like.create({
		data: {
			authorId: userId,
			postId
		}
	});

	return new ApiResponse('Post liked successfully', undefined, 201).success(
		res
	);
});
