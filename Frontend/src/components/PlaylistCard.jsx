import React from 'react';
import { Link } from 'react-router-dom';
import { HiPlay, HiLockClosed } from 'react-icons/hi';


function PlaylistCard({ playlist }) {
  return (
    <Link to={`/playlist/${playlist._id}`}>
      <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden group ">
        <img
          src={playlist.videos[0]?.thumbnail || 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HiPlay className="text-white text-5xl" />
        </div>
        {playlist.isPrivate && (
          <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <HiLockClosed className="w-3 h-3 mr-1" /> Private
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <h3 className="text-white text-lg font-semibold truncate">{playlist.name}</h3>
          <p className="text-gray-300 text-sm">{playlist.videos.length} video{playlist.videos.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </Link>
  );
}

export default PlaylistCard;