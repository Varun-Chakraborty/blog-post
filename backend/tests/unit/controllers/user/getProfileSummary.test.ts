const prismaMock = {
  user: {
    findUnique: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getProfileSummary } from '@/controllers/user.controller';
import { ExpressTypes } from '@/types';

describe('getProfileSummary', () => {
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
    await getProfileSummary(
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

  it('should return summary from req.user if its my username', async () => {
    req = {
      user: {
        id: '1',
        username: 'test',
        name: 'Test User',
        role: 'USER'
      },
      params: {
        username: 'test'
      }
    };
    await getProfileSummary(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { profileSummary: req.user },
        message: 'Profile summary retrieved successfully'
      })
    );
  });

  it('should return 404 if user is not found', async () => {
    req.params = {
      username: 'test'
    };
    prismaMock.user.findUnique.mockResolvedValue(null);
    await getProfileSummary(
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

  it('should return summary from db if its not my username', async () => {
    req.params = {
      username: 'test'
    };
    prismaMock.user.findUnique.mockResolvedValue({
      id: '1',
      username: 'test',
      name: 'Test User',
      role: 'USER'
    });
    await getProfileSummary(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Profile summary retrieved successfully',
        data: {
          profileSummary: {
            id: '1',
            username: 'test',
            name: 'Test User',
            role: 'USER'
          }
        }
      })
    );
  });
});
