const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpiration = process.env.JWT_ACCESS_EXPIRATION || '1d';
const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';

type TokenType = 'access' | 'refresh';

import { AccessJWTPayload, AccessJWTResponse, RefreshJWTResponse } from '@/types';
import { sign, verify } from 'jsonwebtoken';

function generateToken(data: any, secret: string, expiresIn: string) {
  return sign(data, secret, { expiresIn }) as string;
}

function verifyToken(token: string, secret: string) {
  try {
    return verify(token, secret) as AccessJWTResponse | RefreshJWTResponse;
  } catch (error) {
    return null;
  }
}

export function generateTokens(data: AccessJWTPayload, type: TokenType | 'both') {
  if (type === 'both')
    return {
      access: generateToken(data, accessSecret!, accessExpiration),
      refresh: generateToken(
        { id: data.id },
        refreshSecret!,
        refreshExpiration!
      )
    };
  else if (type === 'access')
    return { access: generateToken(data, accessSecret!, accessExpiration) };
  else
    return {
      refresh: generateToken({ id: data.id }, refreshSecret!, refreshExpiration)
    };
}

export function verifyTokens(token: string, type: TokenType): AccessJWTResponse | RefreshJWTResponse | null {
  if (type === 'access') {
    return verifyToken(token, accessSecret!) as AccessJWTResponse | null;
  } else {
    return verifyToken(token, refreshSecret!) as RefreshJWTResponse | null;
  }
}
