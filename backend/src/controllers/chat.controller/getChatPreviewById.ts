import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getChatPreviewById = wrapperFx(async function (
	req: ExpressTypes.Req,
	res: ExpressTypes.Res
) {
	const { chatId } = req.params;

	if (!chatId)
		return new ApiResponse('ChatId is required', undefined, 400).error(res);

	const prisma = getPrismaClient();

	const chat = await prisma.chat.findUnique({
		where: {
			id: chatId
		},
		include: {
			participants: {
				select: { id: true, username: true, name: true, profilePicture: true }
			}
		},
		omit: { createdAt: true }
	});

	if (!chat)
		return new ApiResponse('Chat not found', undefined, 404).error(res);

	const latestMessage = await prisma.message.findFirst({
		where: {
			chatId: chat.id
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 1
	});

	const chatPreview = {
		...chat,
		latestMessage,
		updatedAt: latestMessage?.updatedAt ?? chat.updatedAt
	};

	return new ApiResponse('Chat preview retrieved successfully', {
		chatPreview
	}).success(res);
});
