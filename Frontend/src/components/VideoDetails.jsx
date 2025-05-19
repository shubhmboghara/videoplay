import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import folder from '../assets/folder.png';
import { Button, VideoCard } from './index';
import { useVideo } from '../hooks/useVideos';
import { HiOutlineThumbUp, HiOutlineThumbDown, HiUsers } from 'react-icons/hi';

export default function VideoDetails() {
  const { id } = useParams();
  const { video, Videos, loading, error } = useVideo(id);
  const [showAllComments, setShowAllComments] = useState(false);

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">Error loading video.</p>;
  if (!video) return null;

  return (
    <div className="flex bg-black min-h-screen ">
      <Sidebar className=" w-64 bg-black  overflow-hidden mt-16 "  />

      <main className="flex-1 p-6 text-white relative lg:right-60 lg:top-23 top-15  rounded-2xl" >
        <div className="max-w-4xl mx-auto">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full lg:h-123  h-60 lg:rounded-lg bg-black   rounded-2xl "
            allowFullScreen
          />

          <div className="mt-6 bg-black p-6 rounded-xl">
            <h1 className="text-2xl font-bold">{video.title}</h1>

            <div className="mt-4 flex items-center space-x-4">
              <Button><HiOutlineThumbUp size={24} /></Button>
              <Button><HiOutlineThumbDown size={24} /></Button>
              <Button className="ml-auto bg-white text-gray-800 flex items-center space-x-2 px-3 py-1 rounded">
                <img src={folder} alt="Save" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-800">Save</span>
              </Button>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <img src={video.dp} alt={video.channel} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-gray-300">{video.channel}</p>
                <p className="text-gray-500 text-sm">{video.views} • {video.time} ago</p>
              </div>
              <Button className="ml-auto bg-purple-700 flex items-center space-x-2 px-4 py-2 rounded">
                <HiUsers size={20} />
                <span className="font-medium">Follow</span>
              </Button>
            </div>

            <p className="mt-6 text-gray-200">{video.description}</p>
          </div>

          <div className="mt-10 max-w-4xl mx-auto">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowAllComments(!showAllComments)}
            >
              <h2 className="text-xl font-medium">
                {video.comments?.length || 0} Comments
              </h2>
              <span className="text-2xl text-gray-400 lg:hidden">
                {showAllComments ? '▲' : '▼'}
              </span>
            </div>

            {!showAllComments && video.comments?.[0] && (
              <div
                className="mt-4 flex items-start gap-3 border-b border-gray-700 pb-4 lg:hidden"
                onClick={() => setShowAllComments(true)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full  text-white font-semibold">

                  <img src={video.comments[0].avatar}
                    className='rounded-full'
                    alt="" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {video.comments[0].name}
                    <span className="text-gray-400 text-xs ml-2">
                      {video.comments[0].username} • {video.comments[0].time}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2 mt-1">
                    {video.comments[0].text}
                  </p>
                </div>
              </div>
            )}

            <div className={showAllComments ? 'block' : 'hidden lg:block'}>
              <div className="mt-6">
                <textarea
                  className="w-full bg-black border border-gray-700 p-3 rounded-md text-white resize-none overflow-hidden"
                  rows={2}
                  placeholder="Add a comment…"
                />
                <Button className="mt-2 bg-purple-700 text-white px-4 py-2 rounded">
                  Post
                </Button>
              </div>


              <div className="mt-8 space-y-6 ">
                {video.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full  text-white font-semibold">

                      <img src={c.avatar} alt={c.name} className='rounded-full' />

                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {c.name}
                        <span className="text-gray-400 text-xs ml-2">
                          {c.username} • {c.time}
                        </span>
                      </p>
                      <p className="text-gray-300 text-sm mt-1">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className=" w-100 p-4 space-y-4 bg-black relative lg:hidden  ">
              {Videos?.length > 0 ? (
                Videos.map((vid) => (
                  <VideoCard
                    key={vid.id}
                    id={vid.id}
                    thumbnail={vid.thumbnail}
                    title={vid.title}
                    channel={vid.channel}
                    dp={vid.dp}
                    views={vid.views}
                    time={vid.time}
                  />
                ))
              ) : (
                <p className="text-gray-500">No suggestions yet.</p>
              )}
            </aside>
          </div>
        </div>
      </main>

      <aside className="hidden lg:block w-40 p-2 space-y-4 bg-black relative right-55 top-10">
        {Videos?.length > 0 ? (
          Videos.map((vid) => (
            <VideoCard
              key={vid.id}
              id={vid.id}
              thumbnail={vid.thumbnail}
              title={vid.title}
              channel={vid.channel}
              dp={vid.dp}
              views={vid.views}
              time={vid.time}
            />
          ))
        ) : (
          <p className="text-gray-500">No suggestions yet.</p>
        )}
      </aside>
    </div>
  );
}
