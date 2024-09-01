import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

export const search = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { q } = req.query;
  const query = q ? q.toString().toLowerCase().trim() : '';
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query
          }
        },
        {
          username: {
            contains: query
          }
        }
      ]
    },
    select: {
      id: true,
      name: true,
      username: true
    }
  });
  // TODO: Add pagination and post search
  return new ApiResponse('Search successful', {
    query: query,
    searchResult: { users }
  }).success(res);
});
