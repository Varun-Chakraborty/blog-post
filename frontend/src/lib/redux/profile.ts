import { createSlice } from '@reduxjs/toolkit';
import type { Profile } from '@/types/baseTypes';

const initialState: {
  loggedIn: Profile
} = {
  loggedIn: {
    id: '0',
    name: 'Guest',
    username: 'guest',
    profilePicture: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    isGuest: true,
    role: 'USER'
  }
};

const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.loggedIn = action.payload;
    },
    logout(state) {
      state.loggedIn = initialState.loggedIn;
    }
  }
});

export const profileActions = profile.actions;
export const profileReducers = profile.reducer;
