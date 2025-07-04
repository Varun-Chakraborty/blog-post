const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpiration = process.env.JWT_ACCESS_EXPIRATION ?? '1d';
const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION ?? '7d';

type TokenType = 'access' | 'refresh';

import { AccessJWTResponse, Profile, RefreshJWTResponse } from '@/types';
import { generateToken, verifyToken } from './tokenUtils';

export function sanitizePayload(data: Profile): Profile {
	const sanitizedPayload: Profile = {
		id: data.id,
		name: data.name,
		username: data.username,
		role: data.role
	};
	return sanitizedPayload;
}

export function generateTokens(data: Profile, type: TokenType | 'both') {
	const sanitizedData = sanitizePayload(data);
	if (type === 'both')
		return {
			access: generateToken(sanitizedData, accessSecret!, accessExpiration),
			refresh: generateToken(
				{ id: sanitizedData.id },
				refreshSecret!,
				refreshExpiration
			)
		};
	else if (type === 'access')
		return {
			access: generateToken(sanitizedData, accessSecret!, accessExpiration)
		};
	else
		return {
			refresh: generateToken(
				{ id: sanitizedData.id },
				refreshSecret!,
				refreshExpiration
			)
		};
}

export function verifyAccessTokens(token: string): AccessJWTResponse | null {
	return verifyToken(token, accessSecret!) as AccessJWTResponse | null;
}

export function verifyRefreshTokens(token: string): RefreshJWTResponse | null {
	return verifyToken(token, refreshSecret!) as RefreshJWTResponse | null;
}
