import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getUnreadChats = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.params;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  const currentUser = req.user!;

  const prisma = getPrismaClient();

  if (username !== currentUser.username)
    return new ApiResponse(
      'You can only access your own chats',
      undefined,
      403
    ).error(res);

  const unreadChats = await Promise.all(
    (
      await prisma.chat.findMany({
        where: {
          messages: {
            some: {
              readBy: {
                none: {
                  username: currentUser.username
                }
              }
            }
          }
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

      return {
        ...chat,
        latestMessage
      };
    })
  );
  return new ApiResponse('Fetched unread chats', { unreadChats }).success(res);
});
