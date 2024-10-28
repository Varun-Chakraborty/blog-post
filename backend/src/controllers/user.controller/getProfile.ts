import { prisma } from '@/db';
import { ExpressTypes, User, Post } from '@/types';
import { ApiResponse, wrapperFx } from '@/utils';

export const getProfile = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  let { username } = req.params;

  if (!username)
    return new ApiResponse('Username is required', undefined, 400).error(res);

  if (username === 'me') {
    username = req.user!.username;
  }
  const user: User | null = await prisma.prismaClient.user.findUnique({
    where: { username },
    omit: { password: true, refreshToken: true },
    include: {
      posts: { include: { author: true } },
      followers: { select: { id: true } },
      following: { select: { id: true } }
    }
  });
  if (!user)
    return new ApiResponse('User not found', undefined, 404).error(res);
  user.followersCount = countFollowers(user.followers!);
  user.followingCount = countFollowing(user.following!);
  user.postsCount = countPosts(user.posts!);
  return new ApiResponse('User found', { user }).success(res);
});

function countFollowers(followers: { id: string }[]) {
  return followers.length;
}

function countFollowing(following: { id: string }[]) {
  return following.length;
}

function countPosts(posts: Post[]) {
  return posts.length;
}
