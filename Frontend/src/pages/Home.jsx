import React from 'react';
import { Sidebar, VideoCard } from '../components';
import play from '../assets/play.svg';
import { useParams } from 'react-router-dom';
import { useVideo } from '../hooks/useVideos';
import Loader from '../components/Loader';

export default function Home({ showPopup }) {
  const { id } = useParams()
  const { video, videos, loading, error } = useVideo(id)

  if (loading) return <Loader message="Loading videos..." />;
  if (error) return <p className="text-red-500 p-4">{error.message}</p>;
  console.log({ id, video, videos, loading, error })


  return (
    <div className="flex ">


      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:ml-65 ">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              classNameImg="w-full"
              key={video._id}
              id={video._id}
              thumbnail={video.thumbnail}
              title={video.title}
              channel={video.owner.username}
              avatar={video.owner.avatar}
              views={video.views}
              time={video.createdAt}
              duration={video.duration}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-white mt-[10%] ml-[33%] fixed ">
            <img src={play} alt="No video" className="mx-auto mb-4 w-24 h-24 " />
            <p>No videos are available</p>
          </div>
        )}
      </div>
    </div>
  );
}
