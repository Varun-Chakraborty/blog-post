const prismaMock = {
	user: {
		update: jest.fn(),
		findUnique: jest.fn()
	}
};

const redisMock = {
	isTheTokenDumped: jest.fn()
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

jest.mock('@/services', () => ({
	RedisService: jest.fn(() => redisMock)
}));

jest.mock('@/utils', () => ({
	setCookie: jest.fn(),
	hashToken: jest.fn(),
	verifyToken: jest.fn(),
	wrapperFx: jest.requireActual('@/utils').wrapperFx,
	ApiResponse: jest.requireActual('@/utils').ApiResponse,
	tokens: {
		generateTokens: jest.fn(),
		verifyRefreshTokens: jest.fn()
	}
}));

import { refreshToken } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';

import { tokens, setCookie, hashToken } from '@/utils';

describe('refreshToken', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
			clearCookie: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 401 if no refresh token is found', async () => {
		req = {
			cookies: {},
			headers: {}
		};

		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'No refresh token found'
			})
		);
	});

	it('should return 401 if refresh token is found in headers but is invalid', async () => {
		req = {
			headers: { authorization: 'Bearer invalid' },
			cookies: {}
		};
		(tokens.verifyRefreshTokens as jest.Mock).mockReturnValueOnce(null);
		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Invalid refresh token'
			})
		);
	});

	it('should return 401 if refresh token is found in cookies but is invalid', async () => {
		req.cookies = { refreshToken: 'invalid' };
		(tokens.verifyRefreshTokens as jest.Mock).mockReturnValueOnce(null);
		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Invalid refresh token'
			})
		);
	});

	it('should return 401 if the refresh token is found but also found in redis', async () => {
		req.cookies = { refreshToken: 'invalid' };
		(tokens.verifyRefreshTokens as jest.Mock).mockReturnValueOnce({ id: '1' });
		(redisMock.isTheTokenDumped as jest.Mock).mockReturnValueOnce(true);
		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Invalid refresh token'
			})
		);
	});

	it('should return 401 if the id resolved from the refresh token does not exist', async () => {
		req.cookies = { refreshToken: 'invalid' };
		(tokens.verifyRefreshTokens as jest.Mock).mockReturnValueOnce({ id: '1' });
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Invalid refresh token'
			})
		);
	});

	it('should return 401 if the id resolved from the refresh token does exist but the hash of refresh token does not match', async () => {
		req.cookies = { refreshToken: 'invalid' };
		(hashToken as jest.Mock).mockReturnValue('hash');
		(tokens.verifyRefreshTokens as jest.Mock).mockReturnValueOnce({ id: '1' });
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce({
			id: '1',
			refreshToken: 'validhash'
		});
		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Invalid refresh token'
			})
		);
	});

	it('should return 200 if refresh token is valid', async () => {
		req.cookies = { refreshToken: 'valid' };
		(hashToken as jest.Mock).mockReturnValue('hash');
		(tokens.verifyRefreshTokens as jest.Mock).mockReturnValue({ id: '1' });
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: '1',
			refreshToken: 'hash'
		});
		(tokens.generateTokens as jest.Mock).mockReturnValue({
			access: 'access'
		});
		(tokens.generateTokens as jest.Mock).mockReturnValue({
			access: 'access',
			res: res
		});

		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					accessToken: 'access'
				},
				message: 'Refresh successful'
			})
		);
	});

	it('should return 200 and have predefined expiry time for access token if not available in environment variables', async () => {
		req.cookies = { refreshToken: 'valid' };
		process.env.ACCESS_COOKIE_MAX_AGE = undefined;
		(hashToken as jest.Mock).mockReturnValue('hash');
		(tokens.verifyRefreshTokens as jest.Mock).mockReturnValue({ id: '1' });
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: '1',
			refreshToken: 'hash'
		});
		(tokens.generateTokens as jest.Mock).mockReturnValue({
			access: 'access',
			res: res
		});

		await refreshToken(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					accessToken: 'access'
				},
				message: 'Refresh successful'
			})
		);
	});
});
