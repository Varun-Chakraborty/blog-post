import { newMessageHandler } from '@/socketListenerHandlers/newMessage';
import { verifyAccessTokens } from '@/utils/tokens';
import { Socket, Server } from 'socket.io';
const sockets = new Map<string, Socket>();

export function getSocket(userId: string) {
	return sockets.get(userId);
}

export function setUpSocketListeners(io: Server) {
	io.on('connection', socket => {
		const accessToken = parseCookies(
			socket.handshake.headers.cookie
		).accessToken;
		const userId = verifyAccessTokens(accessToken!)?.id;
		console.log('User connected');
		sockets.set(userId!, socket);
		socket.on('typing', () => {
			socket.broadcast.emit('typing');
		});
		socket.on('stoppedTyping', () => {
			socket.broadcast.emit('stoppedTyping');
		});
		socket.on('new-message', data => newMessageHandler(socket, data, userId!));
		socket.on('disconnect', () => {
			console.log('User disconnected');
			sockets.delete(userId!);
		});
	});
}

function parseCookies(cookieHeader?: string) {
	if (!cookieHeader) return {};
	const cookies = cookieHeader.split(';');
	const parsedCookies: { [key: string]: string } = {};
	for (const cookie of cookies) {
		const [name, value] = cookie.split('=');
		parsedCookies[name.trim()] = value.trim();
	}
	return parsedCookies;
}
