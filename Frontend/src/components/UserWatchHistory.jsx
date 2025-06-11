import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserVideosHistory } from "../hooks/getuserVideosHistory";
import {Loader,VideoCard}  from "./index"

const UserWatchHistory = ({ showPopup }) => {
  const userId = useSelector((state) => state.auth.user?._id);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserVideosHistory();
        setVideos(res?.data || []);
      } catch (err) {
        showPopup("error", "Error loading watch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <Loader message="Loading watch history..." />;

  return (

    <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:ml-65 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 col-span-full">Watch history</h1>

      {videos.length === 0 ? (
        <p className="text-center text-gray-400 text-lg col-span-full">
          No watch history found.
        </p>
      ) : (
        <>
          {videos.map((video) => (
            <div key={video._id}>
              <VideoCard
                classNameImg="w-full"
                key={video._id} 
                id={video._id}
                thumbnail={video.thumbnail}
                title={video.title}
                channel={video.owner[0].username}
                avatar={video.owner[0].avatar }
                views={video.views}
                time={video.createdAt}
                duration={video.duration}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserWatchHistory;
