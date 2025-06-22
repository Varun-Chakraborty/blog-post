jest.mock('@/utils', () => ({
	ApiResponse: jest.requireActual('@/utils').ApiResponse,
	wrapperFx: jest.requireActual('@/utils').wrapperFx
}));

const prismaMock = {
	chat: {
		findMany: jest.fn()
	},
	message: {
		findFirst: jest.fn()
	}
};

jest.mock('@/db', () => ({
	getPrismaClient: jest.fn(() => prismaMock)
}));

import { getChatPreviews } from '@/controllers/user.controller';
import { ExpressTypes } from '@/types';

describe('getChatPreviews', () => {
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
		await getChatPreviews(
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

	it('should return 200', async () => {
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
		const chats = [
			{
				id: '1',
				title: 'Test Chat',
				createdAt: new Date()
			},
			{
				id: '2',
				title: 'Test Chat 2',
				createdAt: new Date()
			}
		];

		const latestMessages = [
			{
				id: '1',
				chatId: '1',
				sentBy: 'testuser',
				sentAt: new Date(),
				message: 'test message'
			},
			{
				id: '2',
				chatId: '2',
				sentBy: 'testuser',
				sentAt: new Date(),
				message: 'test message 2'
			}
		];

		(prismaMock.message.findFirst as jest.Mock).mockResolvedValueOnce(
			latestMessages[0]
		);
		(prismaMock.message.findFirst as jest.Mock).mockResolvedValueOnce(
			latestMessages[1]
		);

		(prismaMock.chat.findMany as jest.Mock).mockResolvedValue(chats);
		await getChatPreviews(
			req as ExpressTypes.Req,
			res as ExpressTypes.Res,
			next as ExpressTypes.Next
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: {
					chatPreviews: chats.map((chat, i) => ({
						...chat,
						latestMessage: latestMessages[i]
					}))
				}
			})
		);
	});
});
