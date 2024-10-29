import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getChatPreviewById = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { chatId } = req.params;

  if (!chatId) {
    return new ApiResponse('ChatId is required', undefined, 400).error(res);
  }

  const chat = await prisma.prismaClient.chat.findUnique({
    where: {
      id: chatId
    },
    omit: { createdAt: true }
  });

  if (!chat) {
    return new ApiResponse('Chat not found', undefined, 404).error(res);
  }

  const latestMessage = await prisma.prismaClient.message.findFirst({
    where: {
      chatId: chat.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const chatPreview = {
    ...chat,
    lastMessage: latestMessage
  };

  return new ApiResponse('Chat preview retrieved successfully', { chatPreview }).success(res);
});
