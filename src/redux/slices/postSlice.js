import { createSlice } from '@reduxjs/toolkit';

const initialState = {posts: []};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        /**
         * Reducer function to set the posts list in the store
         * 
         * @param {object} post The list of posts to be stored in the store
         */
        getPosts: (state, actions) => {
            state.posts = actions.payload;
        },

        /**
         * Reducer function to delete a post in the posts list in the store
         * 
         * @param {String} id The id of post to be deleted
         */
        deletePost: (state, actions) => {
            state.posts = state.posts.filter(post=>post.$id!==actions.payload);
        },
        /**
         * Reducer function to add a new post to the posts list in the store
         * 
         * @param {object} post The data of the new post to be added
         */
        addPost: (state, actions) => {
            state.posts = [actions.payload, ...state.posts];
        },
        /**
         * Reducer function to update a post in the posts list in the store
         
         * @param {object} actions The action with the payload containing the post id and the post data to update with keys id and postData
         */
        updatePost: (state, actions) => {
            /**
             * Map the current posts list to a new list:
             * - If the post id matches the id in the action, return a new post with the updated data merged with the postData in the action.
             * - If the post id doesn't match, return the original post unchanged.
             */
            state.posts = state.posts.map(post=>
                post.$id===actions.payload.id ? {...post, ...actions.payload.postData} : post
            );
        }

    },
});
export const actions = postSlice.actions;
export const reducer = postSlice.reducer;