import React from 'react';
import { Sidebar, VideoCard } from '../components';
import play from '../assets/play.svg';
import { useParams } from 'react-router-dom';
import { useVideo } from '../hooks/useVideos';

export default function Home() {
  const { id } = useParams()
  const { video, videos, loading, error } = useVideo(id)

  if (loading) return <p className="text-white p-4 mt-50  ml-[45%]">Loading videos…</p>;
  if (error) return <p className="text-red-500 p-4">{error.message}</p>;
  console.log({ id, video, videos, loading, error })


  return (
    <div className="flex ">


      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:ml-65 ">
        {videos.length > 0 ? (
          videos.map((v) => (
            <VideoCard
              key={v._id}
              id={v._id}
              thumbnail={v.thumbnail}
              title={v.title}
              channel={v.owner?.username}
              avatar={v.owner?.avatar}
              views={v.views}
              time={v.duration ? `${Math.floor(v.duration / 60)}:${(v.duration % 60).toString().padStart(2, '0')}` : "N/A"}
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
