jest.mock('@/db', () => ({
  prisma: {
    prismaClient: {
      user: {
        findUnique: jest.fn(() => ({ refreshToken: 'refresh' })),
        update: jest.fn()
      }
    }
  },
  redis: {
    redisClient: {
      set: jest.fn(),
      expireat: jest.fn()
    }
  }
}));

jest.mock('@/utils', () => ({
  wrapperFx: jest.requireActual('@/utils').wrapperFx,
  ApiResponse: jest.requireActual('@/utils').ApiResponse,
  tokens: {
    verifyAccessTokens: jest.fn(() => ({ id: '1', exp: 1 })),
    verifyRefreshTokens: jest.fn(() => ({ id: '1', exp: 1 }))
  }
}));

import { signout } from '@/controllers/auth.controller';
import { prisma, redis } from '@/db';
import { ExpressTypes } from '@/types';

describe('signout', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 200', async () => {
    req = {
      user: {
        id: '1',
        name: 'Test User',
        username: 'testuser',
        role: 'USER'
      },
      tokens: {
        accessToken: 'valid'
      }
    };
    (prisma.prismaClient.user.update as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test User',
      username: 'testuser',
      role: 'USER'
    });
    (redis.redisClient.set as jest.Mock).mockResolvedValue(true);
    await signout(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Signout successful'
      })
    );
  });
});
