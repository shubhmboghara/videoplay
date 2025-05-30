import axios from "axios";

const API = axios.create({ baseURL: '/api' }); 

export const addComment = (videoId, commentData) =>
  API.post(`/videos/${videoId}/comments`, commentData);

export const getVideoComments = (videoId) =>
  API.get(`/videos/${videoId}/comments`);

export const deleteComment = (commentId) =>
  API.delete(`/comments/${commentId}`);

export const updateComment = (commentId, updatedText) =>
  API.put(`/comments/${commentId}`, { text: updatedText });
