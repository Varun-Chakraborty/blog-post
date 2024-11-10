import { ChatPreview } from '@/types';
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
    setUnreadChats(state, action) {
      state.unreadChats = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
    appendUnreadChat(state, action: { payload: ChatPreview }) {
      const newChat = action.payload;
      state.unreadChats = [newChat, ...state.unreadChats];
    },
    appendChat(state, action) {
      if (!state.chats.some(chat => chat.id === action.payload.id)) {
        state.chats = [action.payload, ...state.chats];
      }
    },
    updateLatestMessage(state, action) {
      const { data, toUnreadChats } = action.payload;
      const { chatId, latestMessage } = data;

      state.chats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, latestMessage };
        }
        return chat;
      });

      if (toUnreadChats) {
        state.unreadChats = state.unreadChats.map(chat => {
          if (chat.id === chatId) {
            return { ...chat, latestMessage };
          }
          return chat;
        });
      }
    },
    popUnreadChat(state, action) {
      state.unreadChats = state.unreadChats.filter(
        m => m.id !== action.payload
      );
    },
    popChat(state, action) {
      state.chats = state.chats.filter(m => m.id !== action.payload);
    }
  }
});

export const chatActions = chat.actions;
export const chatReducers = chat.reducer;
