import { createSlice } from '@reduxjs/toolkit';

const initialState = {posts: []};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        getPosts: (state, actions) => {
            state.posts = actions.payload;
        },
        deletePost: (state, actions) => {
            state.posts = state.posts.map(task=>task.$id!==actions.payload);
        },
        addPost: (state, actions) => {
            state.posts = [actions.payload, ...state.posts];
        }
    },
});
export const actions = postSlice.actions;
export const reducer = postSlice.reducer;