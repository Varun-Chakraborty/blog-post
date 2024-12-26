import { ExpressTypes } from '@/types';
import { setCookie } from '@/utils/setCookie';

describe('setCookie', () => {
  let res: Partial<ExpressTypes.Res>;

  it('should set a cookie with samesite property lax for dev environment and return the response', () => {
    res = {
      cookie: jest.fn()
    };
    const name = 'test';
    const value = 'value';

    let result = setCookie(name, value, res as ExpressTypes.Res);

    expect(res.cookie).toHaveBeenCalledWith(
      name,
      value,
      expect.objectContaining({ sameSite: 'lax' })
    );
    expect(result).toBe(res);
  });

  it('should set a cookie with samesite property none for production environment and return the response', () => {
    process.env.NODE_ENV = 'production';
    res = {
      cookie: jest.fn()
    };
    const name = 'test';
    const value = 'value';

    let result = setCookie(name, value, res as ExpressTypes.Res);

    expect(res.cookie).toHaveBeenCalledWith(
      name,
      value,
      expect.objectContaining({ sameSite: 'none' })
    );
    expect(result).toBe(res);
  });
});
