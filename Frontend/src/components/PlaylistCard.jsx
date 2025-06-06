import React from 'react';
import { Link } from 'react-router-dom';
import { HiLockClosed } from 'react-icons/hi';

const PlaylistCard = ({ playlist }) => {
  const defaultThumbnail = 'https://via.placeholder.com/320x180.png?text=No+Thumbnail';
  const thumbnail = playlist.videos[0]?.thumbnail || defaultThumbnail;

  return (
    <Link to={`/playlist/${playlist._id}`} className="block w-full max-w-sm">
      <div className="bg-[#0f0f0f] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
        {/* Thumbnail Section */}
        <div className="relative aspect-video">
          <img
            src={thumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition duration-300 flex items-end justify-end p-2">
            <span className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {playlist.videos.length} videos
            </span>
          </div>

          {/* Lock Icon for Private */}
          {playlist.isPrivate && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 p-1 rounded-full">
              <HiLockClosed className="text-white text-sm" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="px-3 py-2">
          <h3 className="text-white font-semibold text-base truncate">{playlist.name}</h3>
          {playlist.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {playlist.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;
