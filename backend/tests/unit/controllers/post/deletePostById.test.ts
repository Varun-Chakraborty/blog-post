const prismaMock = {
	post: {
		findUnique: jest.fn(),
		delete: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { deletePostById } from '@/controllers/post.controller';
import { ExpressTypes } from '@/types';

describe('deletePostById', () => {
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
		await deletePostById(
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

	it('should return 404 if post is not found', async () => {
		req = { params: { postId: '1' } };
		prismaMock.post.findUnique.mockResolvedValue(null);
		await deletePostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Post not found'
			})
		);
	});

	it('should return 403 if user is not authorized to delete the post', async () => {
		req = {
			params: { postId: '1' },
			user: { id: '2', username: 'user2', name: 'User 2', role: 'USER' }
		};
		prismaMock.post.findUnique.mockResolvedValue({ authorId: '1' });
		await deletePostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'You are not authorized to delete this post'
			})
		);
	});

	it('should delete the post', async () => {
		req = {
			params: { postId: '1' },
			user: { id: '1', username: 'user1', name: 'User 1', role: 'ADMIN' }
		};
		prismaMock.post.findUnique.mockResolvedValue({ authorId: '1' });
		await deletePostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(prismaMock.post.delete).toHaveBeenCalledWith({ where: { id: '1' } });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Post deleted successfully'
			})
		);
	});
});
