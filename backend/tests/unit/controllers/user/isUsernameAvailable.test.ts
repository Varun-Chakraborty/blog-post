jest.mock('@/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

import { isUsernameAvailable } from '@/controllers/user.controller';
import { prisma } from '@/db';
import { ExpressTypes } from '@/types';

describe('isUsernameAvailable', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if username is not provided', async () => {
    req.query = {};
    await isUsernameAvailable(
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

  it('should return 400 if username contains invalid characters', async () => {
    req.query = { username: 'invalid@invalid' };
    await isUsernameAvailable(
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
    req.query = { username: 'existinguser' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      username: 'existinguser',
      name: 'Existing User',
      email: 'email',
      role: 'USER'
    });
    await isUsernameAvailable(
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

  it('should return 200 if username is available to use', async () => {
    req.query = { username: 'newuser' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await isUsernameAvailable(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Username is available'
      })
    );
  });
});
