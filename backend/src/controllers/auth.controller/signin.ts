import { getPrismaClient } from '@/db';
import { ApiResponse, wrapperFx, tokens, verifyPassword } from '@/utils';

export const signin = wrapperFx(async function (req, res) {
	const { username, password } = req.body;

	if (!username || !password) {
		return new ApiResponse(
			'Missing required fields, please provide username and password',
			undefined,
			400
		).error(res);
	}

	const prisma = getPrismaClient();

	const user = await prisma.user.findUnique({
		where: { username },
		omit: { refreshToken: true }
	});

	if (!user || !(await verifyPassword(password, user.password))) {
		return new ApiResponse('Invalid credentials', undefined, 401).error(res);
	}

	const {
		access,
		refresh,
		res: response
	} = tokens.generateTokens(user, 'both', res);

	const updatedUser = await prisma.user.update({
		where: { id: user.id },
		data: { refreshToken: refresh },
		omit: { password: true, refreshToken: true }
	});

	return new ApiResponse('Signin successful', {
		user: updatedUser,
		accessToken: access
	}).success(response);
});
