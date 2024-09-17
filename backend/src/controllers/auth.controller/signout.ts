import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

export const signout = wrapperFx(async function (
  req: ExpressTypes.Req,
  res: ExpressTypes.Res
) {
  const user = req.user!;
  const accessToken = req.cookies.accessToken!;

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null }
  });

  // TODO: need to implement redis for this
  // await prisma.dumpedToken.create({
  //   data: {
  //     token: accessToken,
  //     expiresAt: new Date(user.exp * 1000)
  //   }
  // });

  return new ApiResponse('Signout successful').success(res);
});
