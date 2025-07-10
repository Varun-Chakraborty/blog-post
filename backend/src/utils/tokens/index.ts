const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpiration = process.env.JWT_ACCESS_EXPIRATION ?? '1d';
const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION ?? '7d';

type TokenType = 'access' | 'refresh';

import { AccessJWTResponse, ExpressTypes, Profile, RefreshJWTResponse } from '@/types';
import { generateToken, verifyToken } from './tokenUtils';
import { setCookie } from '../setCookie';

export function sanitizePayload(data: Profile): Profile {
	const sanitizedPayload: Profile = {
		id: data.id,
		name: data.name,
		username: data.username,
		role: data.role
	};
	return sanitizedPayload;
}

export function generateTokens(data: Profile, type: TokenType | 'both', res: ExpressTypes.Res) {
	const sanitizedData = sanitizePayload(data);
	let access: string | undefined, refresh: string | undefined;
	if (type === 'access' || type === 'both')
		access = generateToken(sanitizedData, accessSecret!, accessExpiration);
	if (type === 'refresh' || type === 'both') {
		refresh = generateToken(
			{ id: sanitizedData.id },
			refreshSecret!,
			refreshExpiration
		);
	}
	if (access) {
		res = setCookie('accessToken', access!, res, {
				maxAge: Number(
					process.env.ACCESS_COOKIE_MAX_AGE ?? String(1000 * 60 * 60 * 24)
				)
			});
	}
	if (refresh) {
		res = setCookie('refreshToken', refresh!, res, {
				maxAge: Number(
					process.env.REFRESH_COOKIE_MAX_AGE ?? String(1000 * 60 * 60 * 24 * 7)
				)
			});
	}

	return { access, refresh, res };
}

export function verifyAccessTokens(token: string): AccessJWTResponse | null {
	return verifyToken(token, accessSecret!) as AccessJWTResponse | null;
}

export function verifyRefreshTokens(token: string): RefreshJWTResponse | null {
	return verifyToken(token, refreshSecret!) as RefreshJWTResponse | null;
}
