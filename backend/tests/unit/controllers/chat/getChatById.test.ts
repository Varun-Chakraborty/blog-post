const prismaMock = {
  chat: {
    findUnique: jest.fn()
  },
  message: {
    findMany: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getChatById } from '@/controllers/chat.controller';
import { ExpressTypes } from '@/types';

describe('getChatById', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {
        chatId: 'testChatId',
      },
      user: {
        id: 'testUserId',
        username: 'testUsername',
        name: 'Test User',
        role: 'USER'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call 400 if chatId is not present', async () => {
    req.params = {};
    await getChatById(
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
    (prismaMock.chat.findUnique as jest.Mock).mockResolvedValue(null);
    await getChatById(
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

  it('should return 200 with chat if found', async () => {
    const chat = { id: 'testChatId', name: 'testChatName', messages: [] };
    (prismaMock.chat.findUnique as jest.Mock).mockResolvedValue(chat);
    (prismaMock.message.findMany as jest.Mock).mockResolvedValue([]);
    await getChatById(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chat retrieved successfully',
        data: { chat }
      })
    );
  });
});
