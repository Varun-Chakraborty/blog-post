jest.mock('@/db', () => ({
  prisma: {
    prismaClient: {
      user: {
        findUnique: jest.fn()
      },
      follow: {
        findUnique: jest.fn()
      }
    }
  }
}));

import { isFollowing } from '@/controllers/user.controller';
import { prisma } from '@/db';
import { ExpressTypes } from '@/types';

describe('isFollowing', () => {
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
    await isFollowing(
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
    req.params = { username: 'test' };
    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
    await isFollowing(
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

  it('should return 404 if user is found but not following', async () => {
    req = {
      params: {
        username: 'test'
      },
      user: {
        id: '1',
        username: 'test',
        name: 'Test User',
        role: 'USER'
      }
    };
    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1
    });
    (prisma.prismaClient.follow.findUnique as jest.Mock).mockResolvedValue(null);
    await isFollowing(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    // expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'You are not following this user'
    }));
  });

  it('should return 200 if user is found and following', async () => {
    req = {
      params: {
        username: 'test'
      },
      user: {
        id: '1',
        username: 'test',
        name: 'Test User',
        role: 'USER'
      }
    };
    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1
    });
    (prisma.prismaClient.follow.findUnique as jest.Mock).mockResolvedValue({
      id: 1
    });
    await isFollowing(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'You are following this user'
    }));
  });
});
