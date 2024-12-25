const prismaMock = {
  user: {
    findUnique: jest.fn()
  },
  follow: {
    findMany: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getFollowers } from '@/controllers/user.controller';
import { ExpressTypes } from '@/types';

describe('getFollowers', () => {
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
    await getFollowers(
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
    req.params = {
      username: 'nonexistentuser'
    };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    await getFollowers(
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

  it('should return followers', async () => {
    req.params = {
      username: 'testuser'
    };
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'HqNtF@example.com',
      name: 'Test User',
      role: 'USER'
    });
    (prismaMock.follow.findMany as jest.Mock).mockResolvedValue([
      {
        follower: {
          id: '1',
          username: 'testuser',
          name: 'Test User',
          profilePicture: 'profilePicture'
        }
      },
      {
        follower: {
          id: '2',
          username: 'testuser2',
          name: 'Test User 2',
          profilePicture: 'profilePicture2'
        }
      }
    ]);
    await getFollowers(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    // expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          followers: expect.arrayContaining([
            {
              id: '1',
              username: 'testuser',
              name: 'Test User',
              profilePicture: 'profilePicture'
            },
            {
              id: '2',
              username: 'testuser2',
              name: 'Test User 2',
              profilePicture: 'profilePicture2'
            }
          ])
        })
      })
    );
  });
});