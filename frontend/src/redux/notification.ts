import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      id: 1,
      title: 'Notification 1',
      description: 'Description 1',
      at: '2022-01-01 00:00:00'
    },
    {
      id: 2,
      title: 'Notification 2',
      description: 'Description 2',
      at: '2022-01-01 00:00:00'
    },
    {
      id: 3,
      title: 'Notification 3',
      description: 'Description 3',
      at: '2022-01-01 00:00:00'
    }
  ],
  unreadNotifications: []
};

const notification = createSlice({
  name: 'notification',
  initialState,
  reducers: {}
});

export const notificationActions = notification.actions;
export const notificationReducers = notification.reducer;
