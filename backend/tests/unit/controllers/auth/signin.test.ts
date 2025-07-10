const prismaMock = {
	user: {
		findUnique: jest.fn(),
		update: jest.fn()
	}
};

const redisMock = {
	exists: jest.fn()
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

jest.mock('@/services', () => ({
	RedisService: jest.fn(() => redisMock)
}));

jest.mock('@/utils', () => ({
	setCookie: jest.fn(),
	verifyPassword: jest.fn(fx => fx),
	wrapperFx: jest.requireActual('@/utils').wrapperFx,
	ApiResponse: jest.requireActual('@/utils').ApiResponse,
	tokens: {
		generateTokens: jest.fn()
	}
}));

import { signin } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';

import { setCookie, verifyPassword, tokens } from '@/utils';

describe('signin', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 400 if username or password is missing', async () => {
		req.body = {};

		await signin(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Missing required fields, please provide username and password'
			})
		);
	});

	it("should return 401 if username can't be found", async () => {
		req.body = {
			username: 'testuser',
			password: 'testpassword'
		};

		(prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

		await signin(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Invalid credentials'
			})
		);
	});

	it('should return 401 if password is incorrect', async () => {
		req.body = {
			username: 'testuser',
			password: 'testpassword'
		};

		(prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			email: 'email',
			role: 'USER'
		});

		(verifyPassword as jest.Mock).mockResolvedValueOnce(false);

		await signin(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Invalid credentials'
			})
		);
	});

	it('should return 200 if valid credentials and user object should not contain fields like password and refreshToken', async () => {
		req.body = {
			username: 'testuser',
			password: 'testpassword'
		};

		(prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			email: 'email',
			role: 'USER'
		});

		(verifyPassword as jest.Mock).mockResolvedValue(true);

		(tokens.generateTokens as jest.Mock).mockReturnValue({
			access: 'access',
			refresh: 'refresh',
			res: res
		});

		(prismaMock.user.update as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			email: 'email',
			role: 'USER'
		});

		await signin(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Signin successful',
				data: expect.objectContaining({
					user: expect.not.objectContaining({
						password: expect.any(String),
						refreshToken: expect.any(String)
					})
				})
			})
		);
	});

	it('should return 200 and have predefined expiry time for access token and refresh token if not available in environment variables', async () => {
		req.body = {
			username: 'testuser',
			password: 'testpassword'
		};
		process.env.ACCESS_COOKIE_MAX_AGE = undefined;
		process.env.REFRESH_COOKIE_MAX_AGE = undefined;
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			email: 'email',
			role: 'USER'
		});

		(verifyPassword as jest.Mock).mockResolvedValueOnce(true);

		(tokens.generateTokens as jest.Mock).mockReturnValueOnce({
			access: 'access',
			refresh: 'refresh',
			res: res
		});

		(prismaMock.user.update as jest.Mock).mockResolvedValueOnce({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			email: 'email',
			role: 'USER'
		});

		await signin(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Signin successful',
				data: expect.objectContaining({
					user: expect.not.objectContaining({
						password: expect.any(String),
						refreshToken: expect.any(String)
					})
				})
			})
		);
	});
});
