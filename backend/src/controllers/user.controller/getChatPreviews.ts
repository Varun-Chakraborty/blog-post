import { getPrismaClient } from '@/db';
import { getSocket } from '@/socket';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getChatPreviews = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { username } = req.params;

	if (!username)
		return new ApiResponse('Username is required', undefined, 400).error(res);

	const prisma = getPrismaClient();

	const chatPreviews = await Promise.all(
		(
			await prisma.chat.findMany({
				where: {
					participants: {
						some: {
							username: username
						}
					},
					messages: {
						some: {}
					}
				},
				omit: { createdAt: true },
				orderBy: {
					updatedAt: 'desc'
				},
				include: {
					participants: {
						select: {
							id: true,
							username: true,
							name: true,
							profilePicture: true
						}
					}
				}
			})
		).map(async chat => {
			const latestMessage = await prisma.message.findFirst({
				where: {
					chatId: chat.id
				},
				orderBy: {
					createdAt: 'desc'
				}
			});
			const chatPreview = {
				...chat,
				latestMessage,
				updatedAt: latestMessage?.updatedAt ?? chat.updatedAt
			};
			return chatPreview;
		})
	);

	chatPreviews.map(chatPreview =>
		getSocket(req.user!.id)?.join(`chat:${chatPreview.id}`)
	);

	return new ApiResponse('Chats fetched', { chatPreviews }).success(res);
});
