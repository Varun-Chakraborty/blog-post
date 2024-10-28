jest.mock('@/db', () => ({
  prisma: {
    prismaClient: {
      user: {
        findUnique: jest.fn(),
        update: jest.fn()
      }
    }
  }
}));

jest.mock('@/utils', () => ({
  setCookie: jest.fn(),
  verifyPassword: jest.fn(fx => fx),
  wrapperFx: jest.requireActual('@/utils').wrapperFx,
  ApiResponse: jest.requireActual('@/utils').ApiResponse,
  tokens: {
    generateTokens: jest.fn()
  }
}));

import { signin } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';
import { prisma } from '@/db';
import { setCookie, verifyPassword, tokens } from '@/utils';

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

    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(
      null
    );

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

    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      username: 'testuser',
      name: 'Test User',
      email: 'email',
      role: 'USER'
    });

    (verifyPassword as jest.Mock).mockResolvedValueOnce(false);

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

  it('should return 200 if valid credentials and user object should not contain fields like password and refreshToken', async () => {
    req.body = {
      username: 'testuser',
      password: 'testpassword'
    };

    (prisma.prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      username: 'testuser',
      name: 'Test User',
      email: 'email',
      role: 'USER'
    });

    (verifyPassword as jest.Mock).mockResolvedValueOnce(true);

    (tokens.generateTokens as jest.Mock).mockResolvedValueOnce({
      access: 'access',
      refresh: 'refresh'
    });

    (prisma.prismaClient.user.update as jest.Mock).mockResolvedValueOnce({
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
          user: expect.not.objectContaining({
            password: expect.any(String),
            refreshToken: expect.any(String)
          })
        }
      })
    );
  });
});
