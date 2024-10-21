jest.mock('@/db', () => ({
  prisma: {
    prismaClient: {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn()
      }
    }
  },
  redis: {
    redisClient: {
      exists: jest.fn()
    }
  }
}));

jest.mock('@/utils/tokens', () => ({
  generateTokens: jest.fn(),
  verifyRefreshTokens: jest.fn()
}));

jest.mock('@/utils/setCookie', () => ({
  setCookie: jest.fn()
}));

jest.mock('@/utils/verifyPassword', () => ({
  verifyPassword: jest.fn()
}));

import { refreshToken } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';
import { prisma, redis } from '@/db';
import { generateTokens, verifyRefreshTokens } from '@/utils/tokens';
import { setCookie } from '@/utils/setCookie';

describe('refreshToken', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 if no refresh token is found', async () => {
    req = {
      cookies: {},
      headers: {}
    };

    await refreshToken(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'No refresh token found'
      })
    );
  });

  it('should return 401 if refresh token is found in headers but is invalid', async () => {
    req = {
      headers: { authorization: 'Bearer invalid' },
      cookies: {}
    };
    (verifyRefreshTokens as jest.Mock).mockReturnValueOnce(null);
    await refreshToken(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid refresh token'
      })
    );
  });

  it('should return 401 if refresh token is found in cookies but is invalid', async () => {
    req.cookies = { refreshToken: 'invalid' };
    (verifyRefreshTokens as jest.Mock).mockReturnValueOnce(null);
    await refreshToken(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid refresh token'
      })
    );
  });

  it('should return 401 if the refresh token is found but also found in redis', async () => {
    req.cookies = { refreshToken: 'invalid' };
    (verifyRefreshTokens as jest.Mock).mockReturnValueOnce({ id: '1' });
    (redis.redisClient.exists as jest.Mock).mockReturnValueOnce(true);
    await refreshToken(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid refresh token'
      })
    );
  });

  it('should return 401 if the id resolved from the refresh token does not exist', async () => {
    req.cookies = { refreshToken: 'invalid' };
    (verifyRefreshTokens as jest.Mock).mockReturnValueOnce({ id: '1' });
    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(
      null
    );
    await refreshToken(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid refresh token'
      })
    );
  });

  it('should return 401 if the id resolved from the refresh token does exist but the refresh token does not match', async () => {
    req.cookies = { refreshToken: 'invalid' };
    (verifyRefreshTokens as jest.Mock).mockReturnValueOnce({ id: '1' });
    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      refreshToken: 'valid'
    });
    await refreshToken(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid refresh token'
      })
    );
  });

  it('should return 200 if refresh token is valid', async () => {
    req.cookies = { refreshToken: 'valid' };
    (verifyRefreshTokens as jest.Mock).mockReturnValue({ id: '1' });
    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      refreshToken: 'valid'
    });
    (generateTokens as jest.Mock).mockReturnValue({
      access: 'access'
    });

    (setCookie as jest.Mock).mockImplementation((key, value, res) => {
      res.cookie(key, value);
      return res;
    });

    await refreshToken(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          accessToken: 'access'
        },
        message: 'Refresh successful'
      })
    );
  });
});
