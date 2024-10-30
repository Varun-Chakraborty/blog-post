const prismaMock = {
  user: {
    findUnique: jest.fn(() => ({
      id: '1',
      name: 'Test User',
      username: 'testuser',
      role: 'USER',
      email: 'email',
      followers: [],
      following: [],
      posts: []
    }))
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getProfile } from '@/controllers/user.controller';

import { ExpressTypes } from '@/types';

describe('getProfile', () => {
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
    await getProfile(
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

  it('should return current user profile if user is authenticated and requests their own username', async () => {
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
    await getProfile(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: {
            ...req.user,
            email: 'email',
            followers: [],
            following: [],
            posts: [],
            postsCount: 0,
            followersCount: 0,
            followingCount: 0
          }
        })
      })
    );
  });

  it('should return current user profile if user is authenticated and requests username "me"', async () => {
    req = {
      params: {
        username: 'me'
      },
      user: {
        id: '1',
        username: 'testuser',
        name: 'Test User',
        role: 'USER'
      }
    };
    await getProfile(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: {
            ...req.user,
            email: 'email',
            followers: [],
            following: [],
            posts: [],
            postsCount: 0,
            followersCount: 0,
            followingCount: 0
          }
        })
      })
    );
  });

  it('should return 404 if user is not found', async () => {
    req = {
      params: {
        username: 'nonexistentuser'
      }
    };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await getProfile(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User not found'
      })
    );
  });

  it('should return user profile if user is found', async () => {
    req = {
      params: {
        username: 'testuser'
      }
    };
    await getProfile(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: expect.objectContaining({
            id: '1',
            name: 'Test User',
            username: 'testuser',
            role: 'USER'
          })
        })
      })
    );
  });
});
