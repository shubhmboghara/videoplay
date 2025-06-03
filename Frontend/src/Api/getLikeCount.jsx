import axios from "axios";

export const getLikeCount = async (type, id) => {
  try {
    const urlMap = {
      video: `/api/likes/count/${id}`,
      comment: `/api/likes/count/${id}`,
      post: `/api/likes/count/${id}`,
    };



    const response = await axios.get(urlMap[type]);
    return response.data?.data?.likeCount || 0;
  } catch (error) {
    console.error("Error fetching like count:", error);
    return 0;
  }
};
