import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getChatById = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { chatId } = req.params;
  const userId = req.user!.id;

  if (!chatId)
    return new ApiResponse('ChatId is required', undefined, 400).error(res);

  const prisma = getPrismaClient();

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId
    },
    include: {
      messages: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilePicture: true
            }
          }
        },
        
      },
      participants: true
    }
  });

  if (!chat)
    return new ApiResponse('Chat not found', undefined, 404).error(res);

  //group messages by its creation date
  //@ts-ignore
  chat.groupedMessages = chat.messages.reduce((acc, message) => {
    const date = message.createdAt.toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {} as Record<string, typeof chat['messages']>);

  // mark messages until now as read
  // append current user's id to the readBy array
  const messages = await prisma.message.findMany({
    where: {
      chatId: chat.id,
      createdAt: {
        lte: new Date()
      },
    },
  });
  
  for (const message of messages) {
    await prisma.message.update({
      where: {
        id: message.id,
      },
      data: {
        readBy: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  return new ApiResponse('Chat retrieved successfully', { chat }).success(res);
});
