import React from 'react';
import { Sidebar, VideoCard } from '../components';
import play from '../assets/play.svg';
import { useParams } from 'react-router-dom';
import { useVideo } from '../hooks/useVideos';
import Loader from '../components/Loader';

export default function Home({ showPopup, videosFromSearch = [], searching = false, onClearSearch, searchLoading = false }) {
  const { id } = useParams();
  const { video, videos, loading, error } = useVideo(id);

  // Show loader if main videos are loading and not searching
  if (!searching && loading) return <Loader message="Loading videos..." />;
  // Show loader if searching and search is loading
  if (searching && searchLoading) return <Loader message="Searching..." />;
  if (error) return <p className="text-red-500 p-4">{error.message}</p>;

  const showVideos = searching ? videosFromSearch : videos;

  return (
    <div className="flex ">
      <div className="flex-1 p-4">
        {/* Optionally, add a clear search button if searching */}
        {searching && !searchLoading && (
          <button
            className="mb-4 text-xs text-purple-400 hover:underline"
            onClick={onClearSearch}
          >
            Clear search
          </button>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:ml-65 ">
          {showVideos.length > 0 ? (
            showVideos.map((video) => (
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
            !searchLoading && (
              <div className="col-span-full text-center text-white mt-[10%] ml-[33%] fixed ">
                <img src={play} alt="No video" className="mx-auto mb-4 w-24 h-24 " />
                <p>{searching ? 'No search results found.' : 'No videos are available'}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
