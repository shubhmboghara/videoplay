import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likedVideos: [],
  likedComments: [],
  likedPosts: [],
};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {

      addVideoLike: (state, action) => {
      const videoId = action.payload;
      if (!state.likedVideos.includes(videoId)) {
        state.likedVideos.push(videoId); // Add ID if not already present
        console.log(`Redux: Added video ID ${videoId} to likedVideos.`);
      }
    },
    removeVideoLike: (state, action) => {
      const videoId = action.payload;
      state.likedVideos = state.likedVideos.filter(id => id !== videoId); // Remove ID
      console.log(`Redux: Removed video ID ${videoId} from likedVideos.`);
    },
        
    setLikedComments: (state, action) => {
      state.likedComments = action.payload;
    },
    addCommentLike: (state, action) => {
      state.likedComments.push(action.payload);
    },
    removeCommentLike: (state, action) => {
      state.likedComments = state.likedComments.filter(id => id !== action.payload);
    },

    setLikedPosts: (state, action) => {
      state.likedPosts = action.payload;
    },
    addPostLike: (state, action) => {
      state.likedPosts.push(action.payload);
    },
    removePostLike: (state, action) => {
      state.likedPosts = state.likedPosts.filter(id => id !== action.payload);
    },
  },
});

export const {
  setLikedVideos, addVideoLike, removeVideoLike,
  setLikedComments, addCommentLike, removeCommentLike,
  setLikedPosts, addPostLike, removePostLike
} = likesSlice.actions;

export default likesSlice.reducer;
