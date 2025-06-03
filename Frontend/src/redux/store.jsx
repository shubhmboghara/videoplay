import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import likesReducer from './slices/likesSlice';
import  subscriptionReducer from "./slices/subscriptionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    likes: likesReducer, 
   subscription:subscriptionReducer,

  },
});
