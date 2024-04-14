import { configureStore } from "@reduxjs/toolkit";
import { postReducer, userReducer } from "../slices";
export default configureStore({ reducer: {users: userReducer, posts: postReducer} });