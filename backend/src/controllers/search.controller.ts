import { prisma } from '@/db';
import { ExpressTypes, User, Post } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

export const search = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const { q, searchFor } = req.query;
  const query = q ? q.toString().toLowerCase().trim() : '';
  let users: User[] = [];
  let posts: Post[] = [];
  if (searchFor === 'users' || !searchFor) {
    users = await prisma.prismaClient.user.findMany({
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
      omit: { password: true, refreshToken: true }
    });
  }
  if (searchFor === 'posts' || !searchFor) {
    posts = await prisma.prismaClient.post.findMany({
      where: {
        title: { contains: query }
      },
      include: { author: true }
    });
  }
  // TODO: Add pagination
  return new ApiResponse('Search successful', {
    query: query,
    searchResult: { users, posts }
  }).success(res);
});
