jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn((token: string, secret: string) => {
    if (token === 'validToken' && secret === 'validSecret')
      return { id: '1', iat: 1, exp: 2 };
    else throw new Error('Invalid token or secret');
  })
}));

import { generateToken, verifyToken } from '@/utils/tokens/tokenUtils';
import { sign } from 'jsonwebtoken';

describe('tokenUtils', () => {
  describe('generateToken', () => {
    it('should generate a token', () => {
      const result = generateToken({ id: '1' }, 'secret', '1h');
      expect(sign).toHaveBeenCalledWith({ id: '1' }, 'secret', {
        expiresIn: '1h'
      });
      expect(result).toBe('token');
    });
  });

  describe('verifyToken', () => {
    it('should return null if token is invalid', () => {
      const result = verifyToken('invalidToken', 'secret');
      expect(result).toBeNull();
    });

    it('should return null if secret is invalid', () => {
      const result = verifyToken('validToken', 'invalidSecret');
      expect(result).toBeNull();
    });

    it('should verify if token and secret are valid', () => {
      const result = verifyToken('validToken', 'validSecret');
      expect(result).toEqual({ id: '1', iat: 1, exp: 2 });
    });
  });
});
