import { ChatPreview } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { unreadChats: ChatPreview[] } = {
  unreadChats: []
};

const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUnreadChats: (state, action) => {
      state.unreadChats = action.payload;
    },
    appendUnreadChat: (state, action) => {
      state.unreadChats = [...state.unreadChats, action.payload];
    },
    popUnreadChat: (state, action) => {
      state.unreadChats = state.unreadChats.filter(
        m => m.id !== action.payload
      );
    }
  }
});

export const chatActions = chat.actions;
export const chatReducers = chat.reducer;
