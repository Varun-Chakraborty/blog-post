import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    loggedIn: false, 
    userInfo: null,
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        /**
         * Reducer function to login the user and store their info in the store
         * 
         * @param {object} userInfo The data of the user
         */
        login: (state, actions) => {
            // Login the user and store their info in the store
            state.loggedIn = true;
            state.userInfo = actions.payload;
        },

        /**
         * Reducer function to logout the user and reset their info in the store
         */
        logout: (state) => {
            // Logout the user and reset their info in the store
            state.loggedIn = false;
            state.userInfo = null;
        },

    },
});
export const actions = userSlice.actions;
export const reducer = userSlice.reducer;