import { ExpressTypes } from '@/types';
import { setCookie } from '@/utils/setCookie';

describe('setCookie', () => {
  let res: Partial<ExpressTypes.Res>;
  
  it('should set a cookie and return the response', () => {
    res = {
      cookie: jest.fn()
    };
    const name = 'test';
    const value = 'value';

    let result = setCookie(name, value, res as ExpressTypes.Res);

    expect(res.cookie).toHaveBeenCalledWith(name, value, {
      path: '/',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    });
    expect(result).toBe(res);
  });
});
