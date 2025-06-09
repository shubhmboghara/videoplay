import axios from 'axios';

const API = axios.create({
  baseURL: '/api/comments',
});



export const getVideoComments = (videoId) => {
  return  API.get(`/${videoId}`);
};

export const addComment = (videoId, commentData) => {
  return  API.post(`/${videoId}`, commentData);
};

export const deleteComment = (commentId) => {
  return  API.delete(`/c/${commentId}`);
};

export const updateComment = (commentId, updatedData) => {
  return  API.patch(`/c/${commentId}`, updatedData);
};


export const getUserComments = () =>{
    return  API.get(`/user/all`, updatedData);

}
