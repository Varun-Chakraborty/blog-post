import { signup } from '@/controllers/auth.controller';
import { ExpressTypes } from '@/types';
import { prisma } from '@/db';
import { generateTokens } from '@/utils/tokens';
import { setCookie } from '@/utils/setCookie';

jest.mock('@/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      verifyPassword: jest.fn(),
      update: jest.fn(),
      create: jest.fn()
    }
  }
}));

jest.mock('@/utils/tokens', () => ({
  generateTokens: jest.fn()
}));

jest.mock('@/utils/setCookie', () => ({
  setCookie: jest.fn()
}));

describe('signup', () => {
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

  it('should return 400 if username, name, email or password is missing', async () => {
    req.body = {};

    await signup(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          'Missing required fields, please provide username, name, email and password'
      })
    );
  });

  it('should return 400 if username contains invalid characters', async () => {
    req.body = {
      username: 'invalid@invalid',
      name: 'Test User',
      email: 'rjQ5H@example.com',
      password: 'password'
    };

    await signup(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Username can only contain letters and numbers'
      })
    );
  });

  it('should return 409 if username already exists', async () => {
    req.body = {
      username: 'existinguser',
      name: 'Test User',
      email: 'rjQ5H@example.com',
      password: 'password'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'existinguser',
      name: 'Test User',
      email: 'rjQ5H@example.com'
    });

    await signup(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Username already exists'
      })
    );
  });

  it('should return 409 if email already exists', async () => {
    req.body = {
      username: 'newuser',
      name: 'Test User',
      email: 'rjQ5H@example.com',
      password: 'password'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'existinguser',
      name: 'Test User',
      email: 'rjQ5H@example.com'
    });

    await signup(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Email already exists'
      })
    );
  });

  it('should return 201 if valid credentials', async () => {
    req.body = {
      username: 'newuser',
      name: 'Test User',
      email: 'rjQ5H@example.com',
      password: 'password'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'newuser',
      name: 'Test User',
      email: 'rjQ5H@example.com'
    });

    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: '1',
      username: 'newuser',
      name: 'Test User',
      email: 'rjQ5H@example.com'
    });

    (generateTokens as jest.Mock).mockReturnValue({
      access: 'access_token',
      refresh: 'refresh_token'
    });

    (setCookie as jest.Mock).mockImplementation((name, value, res) => {
      res.cookie(name, value);
      return res;
    })

    await signup(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Signup successful',
      })
    );
  });
});
