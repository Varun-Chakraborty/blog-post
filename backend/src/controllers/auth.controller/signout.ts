import { getPrismaClient } from '@/db';
import { RedisService } from '@/services';
import { ApiResponse, wrapperFx, tokens } from '@/utils';

export const signout = wrapperFx(async function (req, res) {
	const user = req.user!;

	const redis = new RedisService();
	const prisma = getPrismaClient();

	// tokens
	const accessToken = req.tokens!.accessToken!;
	const refreshToken = (await prisma.user.findUnique({
		where: { id: user.id },
		select: { refreshToken: true }
	}))!.refreshToken!;

	const accessTokenExpiry = tokens.verifyAccessTokens(accessToken)?.exp;
	const refreshTokenExpiry = tokens.verifyRefreshTokens(refreshToken)?.exp;

	await prisma.user.update({
		where: { id: user.id },
		data: { refreshToken: null }
	});

	if (accessTokenExpiry) {
		await redis.setDumpedToken(accessToken, accessTokenExpiry);
	}

	if (refreshTokenExpiry) {
		await redis.setDumpedToken(refreshToken, refreshTokenExpiry);
	}

	res.clearCookie('refreshToken');
	res.clearCookie('accessToken');

	return new ApiResponse('Signout successful').success(res);
});
