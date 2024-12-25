import { getPrismaClient } from '@/db';
import { ExpressTypes, User, Post } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const search = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { searchFor, skip, take } = req.query;
  const query = req.query.query?.toLowerCase().trim();
  let users: User[] = [];
  let posts: Post[] = [];

  if (!query)
    return new ApiResponse('Search query is required', {}, 400).error(res);

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
      take: Number(take ?? 10),
      skip: Number(skip ?? 0)
    });
  }
  if (searchFor === 'posts' || !searchFor) {
    posts = await prisma.post.findMany({
      where: {
        OR: [{ title: { contains: query } }, { content: { contains: query } }, { author: { username: query } }]
      },
      include: {
        author: {
          select: { name: true, username: true, profilePicture: true }
        },
        _count: { select: { comments: true, likes: true } }
      },
      take: Number(take ?? 10),
      skip: Number(skip ?? 0)
    });
  }

  return new ApiResponse('Search successful', {
    query: query,
    searchResult: { users, posts }
  }).success(res);
});
