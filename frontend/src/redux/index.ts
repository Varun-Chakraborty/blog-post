import { configureStore } from "@reduxjs/toolkit";
import { profileReducers as profile } from "./profile";

export const store = configureStore({
  reducer: {
    profile,
  },
});

export type RootState = ReturnType<typeof store.getState>;