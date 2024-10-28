import { Server } from 'socket.io';

export function setUpSocketListeners(io: Server) {
  io.on('connection', socket => {
    console.log('User connected');
    socket.on('typing', () => {
      socket.emit('typing');
    });
    socket.on('stoppedTyping', () => {
      socket.emit('stoppedTyping');
    });
    socket.on('new-message', message => {
      socket.emit('new-message', message);
    });
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}
