import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    loggedIn: false, 
    userInfo: null,
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, actions) => {
            state.loggedIn = true;
            state.userInfo = actions.payload;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.userInfo = null;
        },
    },
});
export const actions = userSlice.actions;
export const reducer = userSlice.reducer;