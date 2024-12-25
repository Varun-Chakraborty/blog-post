import { ChatPreview, Message } from '@/types/baseTypes';
import { createSlice } from '@reduxjs/toolkit';

interface ChatState {
  unreadChats: ChatPreview[];
  chats: ChatPreview[];
}

const initialState: ChatState = {
  unreadChats: [],
  chats: []
};

const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUnreadChats(state, action: { payload: { unreadChats: ChatPreview[]; } }) {
      state.unreadChats = action.payload.unreadChats;
    },
    setChats(state, action: { payload: { chats: ChatPreview[]; } }) {
      state.chats = action.payload.chats;
    },
    appendUnreadChat(state, action: { payload: { newChat: ChatPreview; } }) {
      const { newChat } = action.payload;
      if (!state.unreadChats.some(chat => chat.id === newChat.id))
        state.unreadChats = [newChat, ...state.unreadChats];
    },
    appendChat(state, action: { payload: { newChat: ChatPreview; } }) {
      const { newChat } = action.payload;
      if (!state.chats.some(chat => chat.id === newChat.id))
        state.chats = [newChat, ...state.chats];
    },
    updateLatestMessage(state, action: { payload: { toUnreadChats: boolean; data: { chatId: string; message: Message } } }) {
      const { data, toUnreadChats } = action.payload;
      const { chatId } = data;

      state.chats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, latestMessage: data.message, updatedAt: data.message.updatedAt };
        }
        return chat;
      });

      if (toUnreadChats) {
        state.unreadChats = state.unreadChats.map(chat => {
          if (chat.id === chatId) {
            return { ...chat, latestMessage: data.message, updatedAt: data.message.updatedAt };
          }
          return chat;
        });
      }
    },
    popUnreadChat(state, action: { payload: { id: string; } }) {
      state.unreadChats = state.unreadChats.filter(
        chat => chat.id !== action.payload.id
      );
    },
    popChat(state, action: { payload: { id: string; } }) {
      state.chats = state.chats.filter(chat => chat.id !== action.payload.id);
    }
  }
});

export const chatActions = chat.actions;
export const chatReducers = chat.reducer;
