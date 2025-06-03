import axios from "axios";

export const togglesubscribe = async (channelId) => {
    
    try {
        const response = await axios.post(`/api/subscriptions/${channelId}`);
        console.log("Toggle subscribe API response:", response.data);
        return response.data.data; 
    } catch (error) {
        console.error("subscribe toggle error:", error);
        throw error;
    }
};