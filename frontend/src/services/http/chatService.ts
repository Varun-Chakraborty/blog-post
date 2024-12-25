import { ChatResponseTypes } from '@/types/responseTypes';
import { HTTPService } from './httpService';

class ChatService extends HTTPService {
  constructor() {
    super();
  }

  async createChat(
    participants: string[],
    type: 'GROUP' | 'CHAT',
    groupName?: string
  ) {
    if (type === 'GROUP' && !groupName) {
      throw new Error('Chat name is required for group chats');
    }
    const response = await this.api.post<ChatResponseTypes.CreateChatResponse>(
      `/chat/create`,
      {
        participants,
        type,
        groupName
      }
    );
    return response.data.data?.chatId;
  }

  async getChats(username: string = 'me') {
    const response =
      await this.api.get<ChatResponseTypes.GetChatPreviewsResponse>(
        `/user/${username}/chats`
      );
    return response.data.data?.chatPreviews;
  }

  async getUnreadChats(username: string = 'me') {
    const response =
      await this.api.get<ChatResponseTypes.GetUnreadChatsResponse>(
        `/user/${username}/unreadChats`
      );
    return response.data.data?.unreadChats;
  }

  async getChatById(chatId: string) {
    const response = await this.api.get<ChatResponseTypes.GetChatByIdResponse>(
      `/chat/${chatId}`
    );
    return response.data.data?.chat;
  }

  async getChatPreviewById(chatId: string) {
    const response =
      await this.api.get<ChatResponseTypes.GetChatPreviewByIdResponse>(
        `/chat/preview/${chatId}`
      );
    return response.data.data?.chatPreview;
  }
}

export default new ChatService();
