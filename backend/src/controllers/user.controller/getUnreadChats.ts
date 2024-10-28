import { prisma } from '@/db';
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
  if (username !== 'me' && username !== currentUser.username)
    return new ApiResponse(
      'You can only access your own chats',
      undefined,
      403
    ).error(res);
  const unreadChats = await prisma.prismaClient.chat.findMany({
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
    }
  });
  return new ApiResponse('Chats fetched', { unreadChats }).success(res);
});
