import { search } from '@/controllers';
import { prisma } from '@/db';
import { ExpressTypes, User } from '@/types';

jest.mock('@/db', () => ({
  prisma: {
    user: {
      findMany: jest.fn()
    }
  }
}));

describe('search', () => {
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
  it('should return empty arrays if no query is provided', async () => {
    req.query = {};
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
    await search(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          query: '',
          searchResult: {
            users: [],
            posts: []
          }
        }
      })
    );
  });

  it('should return search results if query is provided', async () => {
    req.query = { q: 'Existing' };
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: '1',
        username: 'existinguser',
        name: 'Existing User',
        email: 'email',
        role: 'USER'
      } as User
    ]);
    await search(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          query: 'existing',
          searchResult: {
            users: [
              {
                id: '1',
                username: 'existinguser',
                name: 'Existing User',
                email: 'email',
                role: 'USER'
              } as User
            ],
            posts: []
          }
        }
      })
    );
  });
});
