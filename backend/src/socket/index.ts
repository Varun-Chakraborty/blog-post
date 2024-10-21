// src/socket/index,ts

import { Server } from 'socket.io';

export const io = new Server(
  {
    cors: {
      origin: '*'
    }
  },
  {
    path: '/api/socket'
  }
);

io.on('connection', socket => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
