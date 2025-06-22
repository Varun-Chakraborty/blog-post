import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const commentOnPost = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { postId } = req.params;
	const { id: userId } = req.user!;
	const { message } = req.body;

	if (!postId)
		return new ApiResponse('PostId is required', undefined, 400).error(res);

	if (!message)
		return new ApiResponse(
			'A comment message is required',
			undefined,
			400
		).error(res);

	const prisma = getPrismaClient();

	const post = await prisma.post.findUnique({
		where: { id: postId }
	});
	if (!post)
		return new ApiResponse('Post not found', undefined, 404).error(res);

	const comment = await prisma.comment.create({
		data: {
			content: message,
			authorId: userId,
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
			}
		}
	});
	return new ApiResponse(
		'Comment created successfully',
		{ comment: { ...comment, _count: { replies: 0, likes: 0 } } },
		201
	).success(res);
});
