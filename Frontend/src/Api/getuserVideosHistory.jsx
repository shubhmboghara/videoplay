import axios from "axios";

export const getUserVideosHistory = async () => {
    try {
        const response = await axios.get(`/api/users/history`);
        return response.data;
    } catch (error) {
        console.error("get user videos history error:", error);
        throw error;
    }
};
