jest.mock('@/utils/tokens', () => ({
  verifyAccessTokens: jest.fn()
}));

import { ExpressTypes } from '@/types';
import { authenticate } from '@/middlewares/auth';
import { verifyAccessTokens } from '@/utils/tokens';

describe('authenticate', () => {
  let req: Partial<ExpressTypes.Req>;
  let res: Partial<ExpressTypes.Res>;
  let next: Partial<ExpressTypes.Next>;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should call next if token is not present, with empty user', async () => {
    req = {
      headers: {},
      cookies: {}
    };
    await authenticate(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(undefined);
  });

  it('should call next if token is found in headers but is invalid', async () => {
    req = {
      headers: {
        authorization: 'invalid'
      },
      cookies: {}
    };

    (verifyAccessTokens as jest.Mock).mockReturnValue(undefined);
    await authenticate(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(undefined);
  });

  it('should call next if token is found in cookies but is invalid', async () => {
    req = {
      headers: {},
      cookies: {
        accessToken: 'invalid'
      }
    };
    (verifyAccessTokens as jest.Mock).mockReturnValue(undefined);
    await authenticate(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(undefined);
  });

  it('should call next if token is valid and add user to req with isAdmin property false if user role is USER', async () => {
    req = {
      headers: {
        authorization: 'valid'
      },
      cookies: {
        accessToken: 'valid'
      }
    };
    (verifyAccessTokens as jest.Mock).mockReturnValue({
      id: '1',
      role: 'USER'
    });
    await authenticate(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(
      expect.objectContaining({ id: '1', isAdmin: false })
    );
  });

  it('should call next if token is valid and add user to req with isAdmin property true if user role is ADMIN', async () => {
    req = {
      headers: {
        authorization: 'valid'
      },
      cookies: {
        accessToken: 'valid'
      }
    };
    (verifyAccessTokens as jest.Mock).mockReturnValue({
      id: '1',
      role: 'ADMIN'
    });
    await authenticate(
      req as ExpressTypes.Req,
      res as ExpressTypes.Res,
      next as ExpressTypes.Next
    );
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(
      expect.objectContaining({ id: '1', isAdmin: true })
    );
  });
});
