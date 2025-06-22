import { authorizeIfRequestedUserIsMe } from '@/middlewares/user';
import { ExpressTypes } from '@/types';

describe('authorizeIfRequestedUserIsMe', () => {
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

	it('should return 401 if user is not authenticated', () => {
		authorizeIfRequestedUserIsMe(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Unauthorized'
			})
		);
	});

	it('should return 403 if username in params does not match user.username', () => {
		req = {
			user: {
				id: '1',
				username: 'testUsername',
				name: 'Test User',
				role: 'USER'
			},
			params: {
				username: 'anotherUsername'
			}
		};
		authorizeIfRequestedUserIsMe(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'You can only access such data of yourself'
			})
		);
	});

	it('should call next if username in params matches user.username', () => {
		req = {
			user: {
				id: '1',
				username: 'testUsername',
				name: 'Test User',
				role: 'USER'
			},
			params: {
				username: 'testUsername'
			}
		};
		authorizeIfRequestedUserIsMe(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(next).toHaveBeenCalled();
	});
});
