import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getChatById = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { chatId } = req.params;

  const chat = await prisma.prismaClient.chat.findUnique({
    where: {
      id: chatId
    },
    include: {
      messages: true
    }
  });
  return new ApiResponse('Chat fetched', { chat }).success(res);
});
