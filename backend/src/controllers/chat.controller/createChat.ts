import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const createChat = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { participants, type, groupName } = req.body;

  const participantsSet = new Set(participants);

  if (!participants)
    return new ApiResponse('Participants are required', undefined, 400).error(
      res
    );

  if (!type)
    return new ApiResponse('Chat type is required', undefined, 400).error(res);

  if (type === 'GROUP') {
    console.log(participants, participantsSet.size);
    if (participantsSet.size < 2)
      return new ApiResponse(
        'Group must have at least 2 participants',
        undefined,
        400
      ).error(res);
    if (!groupName)
      return new ApiResponse('Group name is required', undefined, 400).error(
        res
      );
  } else {
    if (participantsSet.size !== 2)
      return new ApiResponse(
        'Chat must have exactly 2 participants',
        undefined,
        400
      ).error(res);
  }

  const participantsArray = Array.from(participantsSet);

  const chat = await prisma.prismaClient.chat.create({
    data: {
      type,
      participants: {
        connect: participantsArray.map(p => ({ username: p }))
      },
      groupName: type === 'GROUP' ? groupName : undefined
    },
    select: { id: true }
  });

  return new ApiResponse('Chat created', { chatId: chat.id }, 201).success(res);
});
