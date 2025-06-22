const prismaMock = {
	user: {
		findUnique: jest.fn()
	},
	follow: {
		findUnique: jest.fn(),
		delete: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { unfollowUser } from '@/controllers/user.controller';

import { ExpressTypes } from '@/types';

describe('unfollowUser', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 400 if username is not provided', async () => {
		req.params = {};
		await unfollowUser(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Username is required'
			})
		);
	});

	it('should return 404 if user is not found', async () => {
		req.params = {
			username: 'nonexistentuser'
		};
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
		await unfollowUser(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'User does not exist'
			})
		);
	});

	it('should return 404 if user is not followed', async () => {
		req = {
			params: {
				username: 'testuser'
			},
			user: {
				id: '1',
				username: 'testuser',
				name: 'Test User',
				role: 'USER'
			}
		};
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			email: 'email',
			role: 'USER'
		});
		(prismaMock.follow.findUnique as jest.Mock).mockResolvedValue(null);
		await unfollowUser(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'You are not following this user'
			})
		);
	});

	it('should return 200 if user is found', async () => {
		req = {
			params: {
				username: 'testuser'
			},
			user: {
				id: '1',
				username: 'testuser',
				name: 'Test User',
				role: 'USER'
			}
		};
		(prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			email: 'email',
			role: 'USER'
		});
		(prismaMock.follow.findUnique as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			profilePicture: 'profilePicture'
		});
		(prismaMock.follow.delete as jest.Mock).mockResolvedValue({
			id: '1',
			username: 'testuser',
			name: 'Test User',
			profilePicture: 'profilePicture'
		});
		await unfollowUser(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'User unfollowed'
			})
		);
	});
});
