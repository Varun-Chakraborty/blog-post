import { getPrismaClient } from "@/db";
import { ExpressTypes } from "@/types";
import { ApiResponse, wrapperFx } from "@/utils";

export const updatePostById = wrapperFx(async function (
    req: ExpressTypes.Req,
    res: ExpressTypes.Res
) {
    const { postId } = req.params;
    const { title, content, imageUrl } = req.body;

    if (!postId)
        return new ApiResponse('PostId is required', undefined, 400).error(res);

    if (!title || !content)
        return new ApiResponse('Title and content are required', undefined, 400).error(res);

    const prisma = getPrismaClient();

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true }
    });

    if (!post)
        return new ApiResponse('Post does not exist', undefined, 404).error(res);

    await prisma.post.update({
        where: { id: postId },
        data: {
            title,
            content,
            imgUrl: imageUrl
        }
    });

    return new ApiResponse('Post updated successfully', { postId }, 200).success(res);
});
