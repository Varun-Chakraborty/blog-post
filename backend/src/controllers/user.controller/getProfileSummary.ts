import { ApiResponse, wrapperFx } from '@/utils';
import { getPrismaClient } from '@/db';
import { ExpressTypes } from '@/types';

export const getProfileSummary = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { username } = req.params;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  delete req.user?.isAdmin;

  if (username === req.user?.username) {
    return new ApiResponse('Profile summary retrieved successfully', {
      profileSummary: req.user
    }).success(res);
  }

  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      profilePicture: true,
      role: true
    }
  });

  if (!user)
    return new ApiResponse('User does not exist', undefined, 404).error(res);

  return new ApiResponse('Profile summary retrieved successfully', {
    profileSummary: user
  }).success(res);
});
