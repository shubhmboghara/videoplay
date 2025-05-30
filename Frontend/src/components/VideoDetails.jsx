import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiEye, HiCalendar, HiThumbUp, HiThumbDown, HiShare, HiDownload, HiUsers } from 'react-icons/hi';
import Sidebar from './Sidebar';
import { Button, VideoCard } from './index';
import { useVideo } from '../hooks/useVideos';

export default function VideoDetails() {
  const { id } = useParams();
  const { video, videos, loading, error } = useVideo(id);
  const [showAllComments, setShowAllComments] = useState(false);

  if (loading || !video || !video.owner) return <p className="text-white p-4 text-center">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">Error loading video.</p>;

  return (
    <div className="flex min-h-screen relative">
      {/* Main Content */}
      <main className="flex-1 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <iframe
              src={video.VideoFile}
              title={video.title}
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Video Info & Actions */}
          <div className="p-6 rounded-xl border border-gray-800 mt-5">
            <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

            {/* Views & Actions */}
            <div className="flex flex-wrap items-center justify-between text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <HiEye className="h-4 w-4" />
                  <span>{video.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiCalendar className="h-4 w-4" />
                  <span>{video.timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center gap-1 px-3 h-9 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm">
                  <HiThumbUp className="h-4 w-4" />
                  Liked
                </button>

                <button className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm">
                  <HiThumbDown className="h-4 w-4" />
                  Dislike
                </button>

                <button className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm">
                  <HiShare className="h-4 w-4" />
                  Share
                </button>

                <button className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm">
                  <HiDownload className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="mt-6 flex items-center space-x-4">
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-medium">{video.owner.username}</h2>
                <p className="text-sm text-gray-400">
                  {video.owner.subscriberCount} subscribers
                </p>
              </div>

              <Button className="ml-auto bg-purple-700 flex items-center gap-2 px-4 py-2 rounded">
                <HiUsers size={20} />
                <span>Subscribe</span>
              </Button>
            </div>

            {/* Description */}
            <p className="mt-6 text-gray-300">{video.description}</p>
          </div>

          {/* Comments */}
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

            {/* Comment Input */}
            {showAllComments && (
              <div className="mt-4">
                <textarea
                  className="w-full bg-black border border-gray-700 p-3 rounded-md text-white resize-none"
                  rows={2}
                  placeholder="Add a comment…"
                />
                <Button className="mt-2 bg-purple-700 text-white px-4 py-2 rounded">
                  Post
                </Button>
              </div>
            )}

            {/* Comment List */}
            <div className={`${showAllComments ? 'block' : 'hidden lg:block'} mt-6 space-y-6`}>
              {video.comments?.map((c) => (
                <div key={c.id} className="flex items-start gap-4">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full" />
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

          {/* Suggestions for small screens */}
          <aside className="w-full p-4 space-y-4 bg-black lg:hidden mt-10">
            {videos?.length > 0 ? (
              videos.map((vid) => (
                <VideoCard
                  key={vid._id}
                  id={vid._id}
                  thumbnail={vid.thumbnail}
                  title={vid.title}
                  channel={vid.owner?.username}
                  avatar={vid.owner?.avatar}
                  views={vid.views}
                  time={vid.timeAgo}
                />
              ))
            ) : (
              <p className="text-gray-500">No suggestions yet.</p>
            )}
          </aside>
        </div>
      </main>

      {/* Sidebar Suggestions for large screens */}
      <aside className="hidden lg:block w-80 p-4 space-y-4">
        {videos?.length > 0 ? (
          videos.map((vid) => (
            <VideoCard
              key={vid._id}
              id={vid._id}
              thumbnail={vid.thumbnail}
              title={vid.title}
              channel={vid.owner?.username}
              avatar={vid.owner?.avatar}
              views={vid.views}
              time={vid.timeAgo}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-60">No suggestions yet.</p>
        )}
      </aside>
    </div>
  );
}
