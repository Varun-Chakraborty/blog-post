import { verifyAccessTokens } from '@/utils/tokens';
import { verifyToken } from '@/utils/tokens/tokenUtils';

jest.mock('@/utils/tokens/tokenUtils', () => ({
  verifyToken: jest.fn()
}));

describe('verifyAccessTokens', () => {
  beforeEach(() => {
    (verifyToken as jest.Mock).mockImplementation((token: string) => {
      if (token === 'valid') return { id: '1' };
      else return null
    });
  });

  it('should not verify access token if invalid', () => {
    const result = verifyAccessTokens('invalid');
    expect(result).toBe(null);
  });

  it('should verify access token if valid', () => {
    const result = verifyAccessTokens('valid');
    expect(result).toHaveProperty('id');
  });
});
