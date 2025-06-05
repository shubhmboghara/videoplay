import React from 'react';
import { Link } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
    const thumbnailUrl = playlist.videos.length > 0
        ? playlist.videos[0].thumbnail?.url || playlist.videos[0].thumbnail
        : 'https://via.placeholder.com/320x180.png?text=No+Videos';

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <Link to={`/playlist/${playlist._id}`}>
                <img
                    src={thumbnailUrl}
                    alt={playlist.name}
                    className="w-full h-40 object-cover"
                />
            </Link>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    <Link to={`/playlist/${playlist._id}`} className="hover:text-blue-400">
                        {playlist.name}
                    </Link>
                </h3>
                <p className="text-gray-400 text-sm">
                    {playlist.videos.length} video{playlist.videos.length !== 1 ? 's' : ''}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                    {playlist.isPrivate ? 'Private' : 'Public'} • Playlist
                </p>
            </div>
        </div>
    );
};

export default PlaylistCard;