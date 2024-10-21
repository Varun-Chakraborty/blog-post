import { createSlice } from '@reduxjs/toolkit';
import { Profile } from '@/types';

const initialState: {
  profiles: Profile[];
  currentProfile: string;
} = {
  profiles: [
    {
      id: '0',
      name: 'Guest',
      username: 'guest',
      pfp: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      guest: true,
      role: 'USER'
    }
  ],
  currentProfile: '0'
};

const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfile(state, action) {
      state.currentProfile = action.payload;
    },
    addProfile(state, action) {
      if (state.profiles.length > 1 || !state.profiles[0].guest) {
        if (!state.profiles.some(profile => profile.id === action.payload.id)) {
          state.profiles = [...state.profiles, action.payload];
        }
      } else {
        state.profiles = [action.payload];
        state.currentProfile = action.payload.id;
      }
    },
    updateProfile(state, action) {
      state.profiles.filter((profile) => profile.id === action.payload.id)[0] = action.payload;
    },
    removeProfile(state) {
      const index = state.profiles.findIndex(
        profile => profile.id === state.currentProfile
      );
      if (state.profiles.length === 1) {
        return { ...initialState };
      } else {
        state.profiles.splice(index, 1);
        state.currentProfile = state.profiles[0].id;
      }
    }
  }
});

export const profileActions = profile.actions;
export const profileReducers = profile.reducer;
