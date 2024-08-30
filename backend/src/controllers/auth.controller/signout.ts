import { prisma } from '@/db';
import { ExpressTypes } from '@/types';
import { Req } from '@/types/express';
import { ApiResponse } from '@/utils/ApiResponse';
import { wrapperFx } from '@/utils/wrapperFx';

export const signout = wrapperFx(async function (req: Req, res: ExpressTypes.Res) {
    const user = req.user!;

    const accessToken = req.cookies.accessToken!;

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: null } });
    await prisma.dumpedToken.create({
      data: {
        token: accessToken,
        expiresAt: new Date(user.exp * 1000),
      },
    });

    return new ApiResponse('Signout successful', { user }).success(res);
});
