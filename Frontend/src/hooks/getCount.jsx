import axios from "axios";

export const getLikeCount = async (type, id) => {
  try {
    const urlMap = {
      video: `/api/likes/count/video/${id}`,
      comment: `/api/likes/count/comment/${id}`,
      post: `/api/likes/count/post/${id}`,
    };

    const response = await axios.get(urlMap[type]);
    return response.data?.data?.likeCount || 0;
  } catch (error) {
    console.error("Error fetching like count:", error);
    return 0;
  }
};

export const getsubscribercount = async (channelId) => {
  try {
    const response = await axios.get(
      `/api/subscriber/subscribercount/${channelId}`
    );
    return response.data?.data?.count ?? 0;
  } catch (error) {
    console.error("Error fetching  subscriber count:", error);
    return 0;
  }
};
