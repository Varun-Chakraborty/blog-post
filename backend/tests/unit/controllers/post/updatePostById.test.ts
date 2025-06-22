const prismaMock = {
	post: {
		findUnique: jest.fn(),
		update: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { updatePostById } from '@/controllers/post.controller';
import { ExpressTypes } from '@/types';

describe('updatePostById', () => {
	let req: Partial<ExpressTypes.Req>;
	let res: Partial<ExpressTypes.Res>;
	let next: Partial<ExpressTypes.Next>;

	beforeEach(() => {
		jest.clearAllMocks();
		req = {
			user: {
				id: '1',
				username: 'user1',
				name: 'User 1',
				role: 'USER'
			},
			params: {},
			body: {}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		next = jest.fn();
	});

	it('should return 400 if postId is not provided', async () => {
		req.params = {};
		await updatePostById(
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

	it('should return 400 if title or content is not provided', async () => {
		req.params = { postId: '1' };
		await updatePostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Title and content are required'
			})
		);
	});

	it('should return 404 if post does not exist', async () => {
		req.params = { postId: '1' };
		req.body = { title: 'Test Post', content: 'This is a test post' };
		prismaMock.post.findUnique.mockResolvedValue(null);
		await updatePostById(
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

	it('should update post and return 200', async () => {
		req.params = { postId: '1' };
		req.body = { title: 'Test Post', content: 'This is a test post' };
		prismaMock.post.findUnique.mockResolvedValue({ id: '1' });
		prismaMock.post.update.mockResolvedValue({ id: '1' });
		await updatePostById(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'Post updated successfully' })
		);
	});
});
