import axios from "axios";

export const toggleLike = async (type, id) => {
  try {
    const urlMap = {
      video: `/api/likes/toggle/v/${id}`,
      comment: `/api/likes/toggle/c/${id}`,
      post: `/api/likes/toggle/p/${id}`,
    };

    const response = await axios.post(urlMap[type]);
    return response.data;
  } catch (error) {
    console.error("Like toggle error:", error);
    throw error;
  }
};