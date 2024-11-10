const prismaMock = {
  user: {
    findMany: jest.fn()
  }
};

jest.mock('@/db', () => ({
  getPrismaClient: jest.fn(() => prismaMock)
}));

import { getSuggestions } from '@/controllers/user.controller';
import { ExpressTypes } from '@/types';

describe('getSuggestions', () => {
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
    req = {
      params: {},
      query: {}
    };
    await getSuggestions(
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

  it('should return suggestions', async () => {
    req = {
      params: {
        username: 'test'
      },
      query: { take: '10' }
    };
    prismaMock.user.findMany.mockResolvedValueOnce([
      { username: 'test' },
      { username: 'test2' }
    ]);
    await getSuggestions(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Suggestions fetched successfully',
        data: {
          suggestions: expect.arrayContaining([
            expect.not.objectContaining({ username: 'test' })
          ])
        }
      })
    );
  });
});
