import { toast } from '@/components/ui/use-toast';
import { APIResponseTypes } from '@/types';
import axios, { AxiosError, isAxiosError } from 'axios';
import { io } from 'socket.io-client';

class Api {
  private readonly api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  readonly socket = io('http://localhost:4002');

  constructor() {
    this.api.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.message === 'Network Error') {
          if (!error.config?.url?.includes('/health'))
            toast({
              variant: 'destructive',
              title: 'Network error',
              description: 'Please check your internet connection.'
            });
          return Promise.reject(new Error('Network Error'));
        } else if (error.response?.status === 500) {
          const response = error.response.data as
            | APIResponseTypes.ErrorResponse
            | undefined;
          toast({
            variant: 'destructive',
            title: 'Server error',
            description: response?.message ?? 'Something went wrong.'
          });
          return Promise.reject(error as Error);
        } else if (error.response?.status === 401) {
          if (error.request?.responseURL?.includes('/auth')) {
            return Promise.reject(error as Error);
          } else {
            const currentRequest = error.config!;
            await this.refreshToken();
            return await this.api.request(currentRequest);
          }
        }
        return Promise.reject(error as Error);
      }
    );
  }

  sendMessage(chatId: string, message: string) {
    this.socket.emit('message', { chatId, message });
  }

  async refreshToken() {
    const response = await this.api.get('/auth/refresh');
    return response.data;
  }

  async login(username: string, password: string) {
    const response = await this.api.post<APIResponseTypes.LoginResponse>(
      '/auth/signin',
      {
        username,
        password
      }
    );
    return response.data;
  }

  async signup(
    name: string,
    username: string,
    email: string,
    password: string
  ) {
    const response = await this.api.post<APIResponseTypes.SignupResponse>(
      '/auth/signup',
      {
        name,
        username,
        email,
        password
      }
    );
    return response.data;
  }

  async logout() {
    await this.api.post('/auth/signout');
  }

  async getProfile(username: string) {
    const response = await this.api.get<APIResponseTypes.GetProfileResponse>(
      `/user/${username}/profile`
    );
    return response.data.data?.user ?? undefined;
  }

  async isUsernameAvailable(username: string) {
    try {
      await this.api.get(`/isUsernameAvailable?username=${username}`);
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        return false;
      } else {
        throw error;
      }
    }
  }

  async search(
    query: string,
    searchFor?: 'users' | 'posts',
    skipTill?: number
  ) {
    const params = [
      `q=${query}`,
      searchFor ? `searchFor=${searchFor}` : '',
      skipTill ? `skipTill=${skipTill}` : ''
    ]
      .filter(Boolean)
      .join('&');

    const response = await this.api.get<APIResponseTypes.SearchResponse>(
      `/search?${params}`
    );
    return response.data.data!.searchResult;
  }

  async ping() {
    const response = await this.api.get('/health');
    return response.data;
  }

  async followUser(username: string) {
    const response = await this.api.post<APIResponseTypes.FollowUserResponse>(
      `/user/${username}/follow`
    );
    return response.data;
  }

  async unfollowUser(username: string) {
    const response = await this.api.post<APIResponseTypes.APIResponse>(
      `/user/${username}/unfollow`
    );
    return response.data;
  }

  async getFollowers(username?: string) {
    const response = await this.api.get<APIResponseTypes.GetFollowersResponse>(
      `/user/${username}/followers`
    );
    return response.data.data!.followers;
  }

  async getFollowing(username: string) {
    const response = await this.api.get<APIResponseTypes.GetFollowingResponse>(
      `/user/${username}/following`
    );
    return response.data.data!.following;
  }

  async createChat(
    participants: string[],
    type: 'GROUP' | 'CHAT',
    groupName?: string
  ) {
    if (type === 'GROUP' && !groupName) {
      throw new Error('Chat name is required for group chats');
    }
    const response = await this.api.post<APIResponseTypes.CreateChatResponse>(
      `/chat/create`,
      {
        participants,
        type,
        groupName
      }
    );
    return response.data.data!.chatId;
  }

  async getChats(username: string) {
    const response =
      await this.api.get<APIResponseTypes.GetChatPreviewsResponse>(
        `/user/${username}/chats`
      );
    return response.data.data!.chatPreviews;
  }

  async getUnreadChats(username: string) {
    const response =
      await this.api.get<APIResponseTypes.GetUnreadChatsResponse>(
        `/user/${username}/unreadChats`
      );
    return response.data.data!.unreadChats;
  }

  async getChatById(chatId: string) {
    const response = await this.api.get<APIResponseTypes.GetChatByIdResponse>(
      `/chat/${chatId}`
    );
    return response.data.data!.chat;
  }

  async getChatPreviewById(chatId: string) {
    const response =
      await this.api.get<APIResponseTypes.GetChatPreviewByIdResponse>(
        `/chat/preview/${chatId}`
      );
    return response.data.data!.chat;
  }
}

export default new Api();
