import React, { useEffect, useState } from 'react';
import { Sidebar, VideoCard } from '../components';
import play from "../assets/play.svg"
import axios from 'axios';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/mockVideos.json')
      .then(res => {
        const data = res.data;
        setVideos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load videos');
        setLoading(true);
      });
  }, []);

  if (loading) return <p className="text-white p-4">Loading videos…</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="flex ">
      <div className="mb-20 mt-16  ">
        <Sidebar className="" />
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-3 lg:ml-65">

        {videos.length > 0 ? (
          videos.map(video => (
            <VideoCard
              key={video.id}
              id={video.id}
              thumbnail={video.thumbnail}
              dp={video.dp}
              title={video.title}
              channel={video.channel}
              views={video.views}
              time={video.time}
            />
          ))
        ) : (
          <div className="col-span-full text-center 'text-white mt-10  fixed ">
            <div>
              <img src={play} alt="" srcset=""className='relative top-65 left-150  ' />

            </div>
            <p className='text-white relative top-70 left-140 '>No videos is available</p>
          </div>
        )}

      </div>
    </div>
  );
}
