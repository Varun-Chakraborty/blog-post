import { configureStore } from '@reduxjs/toolkit';
import { profileReducers as profile } from './profile';
import { chatReducers as chat } from './chat';
import { notificationReducers as notification } from './notification';

export const store = configureStore({
  reducer: {
    profile,
    chat,
    notification
  }
});

export type RootState = ReturnType<typeof store.getState>;
