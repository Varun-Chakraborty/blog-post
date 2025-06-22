import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const createPost = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { title, content, imageUrl } = req.body;
	const userId = req.user!.id;

	if (!title || !content)
		return new ApiResponse(
			'Title and content are required',
			undefined,
			400
		).error(res);

	const prisma = getPrismaClient();

	const post = await prisma.post.create({
		data: {
			title,
			content,
			imgUrl: imageUrl,
			authorId: userId,
			published: true
		},
		select: { id: true }
	});

	return new ApiResponse(
		'Post created successfully',
		{ postId: post.id },
		201
	).success(res);
});
