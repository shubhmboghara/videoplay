    import axios from "axios";

    export const updateVideo= async (videoId) => {
        
        try {
            const response = await axios.patch(`/api/video/${videoId}`)
            return response.data;
        } catch (error) {
            console.error("Get liked videos  error:", error);
            throw error;
        }
    }

    export const deleteVideo= async (videoId) => {
        
        try {
            const response = await axios.delete(`/api/video/${videoId}`)
            return response.data;
        } catch (error) {
            console.error("Get liked videos  error:", error);
            throw error;
        }
    }

    export const publishAVideo= async () => {
        
        try {
            const response = await axios.post(`/api/video/`)
            return response.data;
        } catch (error) {
            console.error("Get liked videos  error:", error);
            throw error;
        }
    }

