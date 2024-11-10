import { Message } from 'react-hook-form';
import { io } from 'socket.io-client';

class SocketService {
  private readonly socket = io(import.meta.env.VITE_API_HOST, {
    withCredentials: true
  });
  onNewMessage(
    callback: (data: { chatId: string; message: Message }) => Promise<void>
  ) {
    this.socket.on('new-message', (data: string) => {
      const parsedData = JSON.parse(data) as {
        chatId: string;
        message: Message;
      };
      callback(parsedData);
    });
  }

  sendMessage(chatId: string, message: string) {
    this.socket.emit('new-message', { chatId, message });
  }

  emitTyping() {
    this.socket.emit('typing');
  }

  emitStoppedTyping() {
    this.socket.emit('stoppedTyping');
  }

  onTyping(callback: () => void) {
    this.socket.on('typing', () => {
      callback();
    });
  }

  onStoppedTyping(callback: () => void) {
    this.socket.on('stoppedTyping', () => {
      callback();
    });
  }

  offTyping() {
    this.socket.off('typing');
  }

  offStoppedTyping() {
    this.socket.off('stoppedTyping');
  }
}

export default new SocketService();
