import { getPrismaClient } from '@/db';
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

  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          username: username
        }
      }
    },
    omit: { createdAt: true },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      participants: true
    }
  });

  const chatPreviews = await Promise.all(
    chats.map(async chat => {
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
        latestMessage
      };
      return chatPreview;
    })
  );

  return new ApiResponse('Chats fetched', { chatPreviews }).success(res);
});
