const prismaMock = {
  chat: {
    findUnique: jest.fn()
  },
  message: {
    findFirst: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getChatPreviewById } from '@/controllers/chat.controller';
import { ExpressTypes } from '@/types';

describe('getChatPreviewById', () => {
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

  it('should return 400 if chatId is not provided', async () => {
    req.params = {};
    await getChatPreviewById(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'ChatId is required'
      })
    );
  });

  it('should return 404 if chat is not found', async () => {
    req.params = { chatId: 'testChatId' };
    (prismaMock.chat.findUnique as jest.Mock).mockResolvedValue(null);
    await getChatPreviewById(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chat not found'
      })
    );
  });

  it('should return 200 if chat is found', async () => {
    req.params = { chatId: 'testChatId' };
    (prismaMock.chat.findUnique as jest.Mock).mockResolvedValue({
      id: 'testChatId',
      title: 'Test Chat',
      createdAt: new Date()
    });
    await getChatPreviewById(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chat preview retrieved successfully'
      })
    );
  });
});
