const prismaMock = {
	user: {
		findUnique: jest.fn(),
		verifyPassword: jest.fn(),
		update: jest.fn(),
		create: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

jest.mock('@/utils', () => ({
	setCookie: jest.fn(),
	wrapperFx: jest.requireActual('@/utils').wrapperFx,
	ApiResponse: jest.requireActual('@/utils').ApiResponse,
	tokens: {
		generateTokens: jest.fn()
	}
}));

import { signup } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';

import { tokens, setCookie } from '@/utils';

describe('signup', () => {
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

	it('should return 400 if username, name, email or password is missing', async () => {
		req.body = {};

		await signup(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message:
					'Missing required fields, please provide username, name, email and password'
			})
		);
	});

	it('should return 400 if username contains invalid characters', async () => {
		req.body = {
			username: 'invalid@invalid',
			name: 'Test User',
			email: 'rjQ5H@example.com',
			password: 'password'
		};

		await signup(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Username can only contain letters and numbers'
			})
		);
	});

	it('should return 409 if username already exists', async () => {
		req.body = {
			username: 'existinguser',
			name: 'Test User',
			email: 'rjQ5H@example.com',
			password: 'password'
		};

		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'existinguser',
			name: 'Test User',
			email: 'rjQ5H@example.com'
		});

		await signup(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Username already exists'
			})
		);
	});

	it('should return 409 if email already exists', async () => {
		req.body = {
			username: 'newuser',
			name: 'Test User',
			email: 'rjQ5H@example.com',
			password: 'password'
		};

		(prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'existinguser',
			name: 'Test User',
			email: 'rjQ5H@example.com'
		});

		await signup(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Email already exists'
			})
		);
	});

	it('should return 201 if valid credentials', async () => {
		req.body = {
			username: 'newuser',
			name: 'Test User',
			email: 'rjQ5H@example.com',
			password: 'password'
		};

		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

		(prismaMock.user.create as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'newuser',
			name: 'Test User',
			email: 'rjQ5H@example.com'
		});

		(prismaMock.user.update as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'newuser',
			name: 'Test User',
			email: 'rjQ5H@example.com'
		});

		(tokens.generateTokens as jest.Mock).mockReturnValue({
			access: 'access_token',
			refresh: 'refresh_token'
		});

		(setCookie as jest.Mock).mockImplementation((name, value, res) => {
			res.cookie(name, value);
			return res;
		});

		await signup(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Signup successful'
			})
		);
	});
});
