import { getPrismaClient } from '@/db';
import { ExpressTypes, User, Post } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const search = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { q, searchFor } = req.query;
  const skipTill = req.query.skipTill ? Number(req.query.skipTill) : 0;
  const query = q ? q.toString().toLowerCase().trim() : '';
  let users: User[] = [];
  let posts: Post[] = [];

  const prisma = getPrismaClient();
  if (searchFor === 'users' || !searchFor) {
    users = await prisma.user.findMany({
      where: {
        AND: [
          {
            role: 'USER',
            OR: [
              { name: { contains: query } },
              { username: { contains: query } }
            ]
          }
        ]
      },
      omit: { password: true, refreshToken: true },
      skip: skipTill,
      take: 10
    });
  }
  if (searchFor === 'posts' || !searchFor) {
    posts = await prisma.post.findMany({
      where: {
        OR: [{ title: { contains: query } }, { content: { contains: query } }]
      },
      include: {
        author: {
          select: { username: true, profilePicture: true }
        }
      },
      skip: skipTill,
      take: 10
    });
  }

  return new ApiResponse('Search successful', {
    query: query,
    searchResult: { users, posts }
  }).success(res);
});
