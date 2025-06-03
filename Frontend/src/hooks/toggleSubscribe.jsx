import axios from "axios";

export const togglesubscribe = async (channelId) => {
    
    try {
        const response = await axios.post(`/api/subscriptions/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("subscribe toggle error:", error);i
        throw error;
    }
};