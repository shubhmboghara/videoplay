import axios from "axios";

export const getsubscriptions= async () => {
    
    try {
        const response = await axios.get(`/api/subscriptions/subscribedto`)
        return response.data;
    } catch (error) {
        console.error("Get liked videos  error:", error);
        throw error;
    }
};