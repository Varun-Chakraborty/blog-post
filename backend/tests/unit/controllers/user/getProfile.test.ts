import { getProfile } from '@/controllers/user.controller';
import { ExpressTypes } from '@/types';

describe('getProfile', () => {
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

  it('should return user profile', async () => {
    req.user = {
      id: '1',
      username: 'testuser',
      name: 'Test User',
      role: 'USER'
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
          user: req.user
        })
      })
    );
  });
});
