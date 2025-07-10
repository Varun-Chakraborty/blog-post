import { getPrismaClient } from '@/db';
import { ApiResponse, wrapperFx, tokens, setCookie } from '@/utils';
import { z } from 'zod';

export const signup = wrapperFx(async function (req, res) {
	let { username, name, email, password } = req.body;

	username = username?.trim().toLowerCase();
	name = name?.trim();
	email = email?.trim();
	password = password?.trim();

	if (!username || !name || !email || !password) {
		return new ApiResponse(
			'Missing required fields, please provide username, name, email and password',
			undefined,
			400
		).error(res);
	}

	if (
		!z
			.string()
			.regex(/^[a-zA-Z0-9]+$/)
			.safeParse(username).success
	) {
		return new ApiResponse(
			'Username can only contain letters and numbers',
			undefined,
			400
		).error(res);
	}

	const prisma = getPrismaClient();

	if (await prisma.user.findUnique({ where: { username } })) {
		return new ApiResponse('Username already exists', undefined, 409).error(
			res
		);
	}

	if (email && (await prisma.user.findUnique({ where: { email } }))) {
		return new ApiResponse('Email already exists', undefined, 409).error(res);
	}

	const user = await prisma.user.create({
		data: { username, name, email, password },
		omit: { password: true, refreshToken: true }
	});

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

	return new ApiResponse(
		'Signup successful',
		{ user: updatedUser, accessToken: access },
		201
	).success(response);
});
