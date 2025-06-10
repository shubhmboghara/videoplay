import React from 'react';
import { Link } from 'react-router-dom';
import { HiLockClosed } from 'react-icons/hi';

const PlaylistCard = ({ playlist, onSelect }) => {
  const defaultThumbnail = 'https://via.placeholder.com/320x180.png?text=No+Thumbnail'
  const thumbnail = playlist.videos[0]?.thumbnail || defaultThumbnail;

  return (
    <div
      className="block w-full max-w-sm bg-[#0f0f0f] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
      onClick={() => onSelect(playlist._id)}
    >

      <div className="relative aspect-video">
        <img
          src={thumbnail}
          alt={playlist.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition duration-300 flex items-end justify-end p-2">
          <span className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {playlist.videos.length} videos
          </span>
        </div>

        {playlist.isPrivate && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 p-1 rounded-full">
            <HiLockClosed className="text-white text-sm" />
          </div>
        )}
      </div>
      <div className="px-3 py-2 flex items-center gap-2">
        {playlist.owner && (
          <Link to={`/profile/${playlist.owner.username}`}>
            <img
              src={playlist.owner.avatar && playlist.owner.avatar.trim() !== '' ? playlist.owner.avatar : 'https://via.placeholder.com/40x40.png?text=User'}
              alt={playlist.owner.username}
              className="w-8 h-8 rounded-full border-2 border-purple-400 object-cover cursor-pointer"
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40x40.png?text=User'; }}
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">{playlist.name}</h3>
          {playlist.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {playlist.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
