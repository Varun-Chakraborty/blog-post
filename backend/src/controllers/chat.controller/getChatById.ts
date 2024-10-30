import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getChatById = wrapperFx(async function (
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
      messages: true
    }
  });

  if (!chat) return new ApiResponse('Chat not found', {}, 404).error(res);

  return new ApiResponse('Chat retrieved successfully', { chat }).success(res);
});
