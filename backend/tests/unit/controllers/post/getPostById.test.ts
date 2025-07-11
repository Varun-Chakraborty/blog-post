const prismaMock = {
	post: {
		findUnique: jest.fn()
	},
	follow: {
		count: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { getPostById } from '@/controllers/post.controller';
import { ExpressTypes } from '@/types';

describe('getPostById', () => {
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

	it('should return 400 if postId is not provided', async () => {
		req.params = {};
		await getPostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'PostId is required'
			})
		);
	});

	it('should return 404 if post does not exist', async () => {
		req.params = { postId: 'invalid-post-id' };
		await getPostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Post does not exist'
			})
		);
	});

	it('should return post with out liked field if user is not logged in', async () => {
		req = {
			params: {
				postId: '1'
			}
		};
		prismaMock.post.findUnique.mockResolvedValue({
			id: '1',
			userId: '1',
			title: 'Test Post',
			content: 'This is a test post',
			likes: ['1']
		});
		await getPostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Post retrieved successfully',
				data: {
					post: expect.any(Object)
				}
			})
		);
	});

	it('should return post with liked field if user is logged in', async () => {
		req = {
			params: {
				postId: '1'
			},
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			}
		};
		prismaMock.post.findUnique.mockResolvedValue({
			id: '1',
			userId: '1',
			title: 'Test Post',
			content: 'This is a test post',
			likes: ['1']
		});
		await getPostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Post retrieved successfully',
				data: {
					post: expect.objectContaining({
						liked: true
					})
				}
			})
		);
	});
});
