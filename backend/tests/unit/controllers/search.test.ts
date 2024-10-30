const userList = [
  {
    id: '1',
    username: 'existinguser',
    name: 'Existing User',
    email: 'email',
    role: 'USER'
  }
];

const postList = [
  {
    id: '1',
    title: 'title',
    content: 'content',
    authorId: '1'
  }
];

const prismaMock = {
  user: {
    findMany: jest.fn(() => [userList[0]])
  },
  post: {
    findMany: jest.fn(() => [postList[0]])
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { search } from '@/controllers';

import { ExpressTypes } from '@/types';

describe('search', () => {
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

  it('should return empty arrays if no query is provided', async () => {
    req.query = {};
    (prismaMock.user.findMany as jest.Mock).mockResolvedValueOnce([]);
    (prismaMock.post.findMany as jest.Mock).mockResolvedValueOnce([]);
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
            users: [userList[0]],
            posts: [postList[0]]
          }
        }
      })
    );
  });
});
