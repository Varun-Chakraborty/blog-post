import { Socket } from 'socket.io';
import { getPrismaClient } from '@/db';

type newMessageHandler = (
  socket: Socket,
  data: { chatId: string; message: string }
) => Promise<void>;

export async function newMessageHandler(
  socket: Socket,
  { chatId, content }: { chatId: string; content: string },
  userId: string
) {
  const prisma = getPrismaClient();
  const message = await prisma.message.create({
    data: {
      content,
      chat: {
        connect: {
          id: chatId
        }
      },
      readBy: {
        connect: {
          id: userId
        }
      },
      author: {
        connect: {
          id: userId
        }
      }
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profilePicture: true
        }
      }
    }
  });
  socket.broadcast.emit('new-message', { chatId, message });
  socket.emit('new-message', { chatId, message });
}
