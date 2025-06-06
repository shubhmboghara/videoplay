import axios from "axios";

    export const updateVideo= async (videoId, formData) => {
    
    try {
        const response = await axios.patch(`/api/video/${videoId}`, formData)
        return response.data;
    } catch (error) {
        console.error("Update video error:", error);
        throw error;
    }
}

    export const deleteVideo= async (videoId) => {
        
        try {
            const response = await axios.delete(`/api/video/${videoId}`)
            return response.data;
        } catch (error) {
            console.error("delete Video error:", error);
            throw error;
        }
    }

    export const publishAVideo= async (formData, onUploadProgress) => {
    
    try {
        const response = await axios.post(`/api/video/`, formData, {
            onUploadProgress,
        });
        return response.data;
    } catch (error) {
        console.error("Publish video error:", error);
        throw error;
    }
}

