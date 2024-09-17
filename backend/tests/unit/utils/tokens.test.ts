import {
  generateTokens,
  verifyAccessTokens,
  verifyRefreshTokens
} from '@/utils/tokens';
import { AccessJWTPayload, RefreshJWTPayload } from '@/types';
import { sign, verify } from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

describe('tokens', () => {
  let payload: AccessJWTPayload | RefreshJWTPayload;
  beforeEach(() => {
    payload = {
      id: '1'
    };
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      (sign as jest.Mock).mockReturnValueOnce('accessToken');
      (sign as jest.Mock).mockReturnValueOnce('refreshToken');

      const tokens = generateTokens(payload as AccessJWTPayload, 'both');
      expect(tokens).toHaveProperty('access', 'accessToken');
      expect(tokens).toHaveProperty('refresh', 'refreshToken');
    });

    it('should generate access token', () => {
      (sign as jest.Mock).mockReturnValue('accessToken');

      const tokens = generateTokens(payload as AccessJWTPayload, 'access');
      expect(tokens).toHaveProperty('access', 'accessToken');
      expect(tokens).not.toHaveProperty('refresh');
    });

    it('should generate refresh token', () => {
      (sign as jest.Mock).mockReturnValue('refreshToken');

      const tokens = generateTokens(payload as AccessJWTPayload, 'refresh');
      expect(tokens).not.toHaveProperty('access');
      expect(tokens).toHaveProperty('refresh', 'refreshToken');
    });
  });

  describe('verifyAccessTokens', () => {
    beforeEach(() => {
      (verify as jest.Mock).mockImplementation((token: string) => {
        if (token === 'valid') return { id: '1' };
        else throw new Error('Invalid token');
      });
    });
    
    it('shouldnot verify access token if invalid', () => {
      const result = verifyAccessTokens('invalid');
      expect(result).toBe(null);
    });
    
    it('should verify access token if valid', () => {
      const result = verifyAccessTokens('valid');
      expect(result).toHaveProperty('id');
    });
  });

  describe('verifyRefreshTokens', () => {
    beforeEach(() => {
      (verify as jest.Mock).mockImplementation((token: string) => {
        if (token === 'valid') return { id: '1' };
        else throw new Error('Invalid token');
      });
    });

    it('should not verify refresh token if invalid', () => {
      const result = verifyRefreshTokens('invalid');
      expect(result).toBe(null);
    });
    
    it('should verify refresh token if valid', () => {
      const result = verifyRefreshTokens('valid');
      expect(result).toHaveProperty('id');
    });
  });
});
