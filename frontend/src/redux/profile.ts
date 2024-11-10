import { createSlice } from '@reduxjs/toolkit';
import { Profile } from '@/types';

const initialState: {
  profile: Profile;
} = {
  profile: {
    id: '0',
    name: 'Guest',
    username: 'guest',
    pfp: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    guest: true,
    role: 'USER'
  }
};

const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    removeProfile(state) {
      state.profile = initialState.profile;
    }
  }
});

export const profileActions = profile.actions;
export const profileReducers = profile.reducer;
