import { getPrismaClient } from '@/db';
import { RedisService } from '@/services';
import { ApiResponse, wrapperFx, setCookie, tokens, hashToken } from '@/utils';

export const refreshToken = wrapperFx(async function (req, res) {
	const refreshToken =
		req.cookies.refreshToken ?? req.headers.authorization?.split(' ')[1];

	if (!refreshToken)
		return new ApiResponse('No refresh token found', undefined, 401).error(res);

	const hashedToken = await hashToken(refreshToken);

	const redis = new RedisService();
	const prisma = getPrismaClient();

	const doesExists = await redis.isTheTokenDumped(hashedToken);
	if (doesExists)
		return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

	const verificationResponse = tokens.verifyRefreshTokens(refreshToken);
	if (!verificationResponse)
		return new ApiResponse('Invalid refresh token', undefined, 401).error(res);

	const { id } = verificationResponse;

	const user = await prisma.user.findUnique({
		where: { id },
		omit: { password: true }
	});

	if (!user || user.refreshToken !== hashedToken) {
		if (user?.refreshToken) {
			res.clearCookie('refreshToken');
		}
		return new ApiResponse('Invalid refresh token', undefined, 401).error(res);
	}

	const { access, res: newRes } = tokens.generateTokens(user, 'access', res);

	return new ApiResponse('Refresh successful', {
		accessToken: access
	}).success(newRes);
});
