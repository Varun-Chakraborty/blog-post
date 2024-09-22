jest.mock('@/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      verifyPassword: jest.fn(),
      update: jest.fn()
    }
  }
}));

jest.mock('@/utils/tokens', () => ({
  generateTokens: jest.fn()
}));

jest.mock('@/utils/setCookie', () => ({
  setCookie: jest.fn()
}));

import { signin } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';
import { prisma } from '@/db';
import { generateTokens } from '@/utils/tokens';
import { setCookie } from '@/utils/setCookie';

describe('signin', () => {
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

  it('should return 400 if username or password is missing', async () => {
    req.body = {};

    await signin(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Missing required fields, please provide username and password'
      })
    );
  });

  it("should return 401 if username can't be found", async () => {
    req.body = {
      username: 'testuser',
      password: 'testpassword'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await signin(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid credentials'
      })
    );
  });

  it('should return 401 if password is incorrect', async () => {
    req.body = {
      username: 'testuser',
      password: 'testpassword'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      username: 'testuser',
      name: 'Test User',
      email: 'email',
      role: 'USER'
    });

    (prisma.user.verifyPassword as jest.Mock).mockResolvedValueOnce(false);

    await signin(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid credentials'
      })
    );
  });

  it('should return 200 if valid credentials', async () => {
    req.body = {
      username: 'testuser',
      password: 'testpassword'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      username: 'testuser',
      name: 'Test User',
      email: 'email',
      role: 'USER'
    });

    (prisma.user.verifyPassword as jest.Mock).mockResolvedValueOnce(true);

    (generateTokens as jest.Mock).mockResolvedValueOnce({
      access: 'access',
      refresh: 'refresh'
    });

    (prisma.user.update as jest.Mock).mockResolvedValueOnce({
      id: '1',
      username: 'testuser',
      name: 'Test User',
      email: 'email',
      role: 'USER'
    });

    (setCookie as jest.Mock).mockImplementation((key, value, res) => {
      res.cookie(key, value, { maxAge: 1000 * 60 * 60 * 24 });
      return res;
    });

    await signin(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Signin successful',
        data: {
          user: {
            id: '1',
            username: 'testuser',
            name: 'Test User',
            email: 'email',
            role: 'USER'
          }
        }
      })
    );
  });
});
