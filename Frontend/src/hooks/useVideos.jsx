import { useEffect, useState } from 'react';
import axios from 'axios';

export function useVideo(id) {
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create promises for API calls
        const allVideosPromise = axios.get('/api/video');
        const singleVideoPromise = id 
          ? axios.get(`/api/video/${id}`) 
          : Promise.resolve(null);

        // Execute both requests in parallel
        const [allRes, singleRes] = await Promise.all([
          allVideosPromise,
          singleVideoPromise
        ]);

        // Handle all videos response
        const allVideos = allRes.data.data?.videos || [];
        if (!Array.isArray(allVideos)) {
          throw new Error("Invalid videos data format");
        }

        // Handle single video response
        if (id && singleRes) {
          const videoData = singleRes.data.data?.videoData;
          if (!videoData) {
            throw new Error("Video data not found in response");
          }
          setVideo(videoData);
        }

        // Filter out current video from suggestions
        setVideos(
          id 
            ? allVideos.filter(v => v._id !== id) 
            : allVideos
        );
      } catch (err) {
        console.error("API error:", err);
        setError(err.message || "Failed to load video data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { video, videos, loading, error };
}