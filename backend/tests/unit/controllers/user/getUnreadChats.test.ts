const prismaMock = {
  user: {
    findUnique: jest.fn()
  },
  chat: {
    findMany: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getUnreadChats } from '@/controllers/user.controller';

import { ExpressTypes } from '@/types';

describe('getUreadChats', () => {
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
    await getUnreadChats(
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

  it('should return 403 if accessing messages of other users', async () => {
    req = {
      params: {
        username: 'nonexistentuser'
      },
      user: {
        id: '1',
        username: 'testuser',
        name: 'Test User',
        role: 'USER'
      }
    };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    await getUnreadChats(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'You can only access your own chats'
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
    await getUnreadChats(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Chats fetched'
      })
    );
  });
});
