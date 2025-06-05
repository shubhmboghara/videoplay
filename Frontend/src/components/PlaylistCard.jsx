import React from 'react';
import { Link } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
    const defaultThumbnail = 'https://via.placeholder.com/300x169.png?text=No+Thumbnail'; // Placeholder image

    return (
        <Link to={`/playlist/${playlist._id}`}>
            <div className="w-full rounded-lg overflow-hidden cursor-pointer bg-[#18181b] shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative bg-[#18181b]">
                    <img
                        src={playlist.videos[0]?.thumbnail || defaultThumbnail}
                        alt={playlist.name}
                        className="w-full h-full object-cover aspect-video"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-lg font-semibold">{playlist.videos.length} Videos</span>
                    </div>
                </div>
                <div className="p-3">
                    <h3 className="text-white font-semibold text-lg truncate mb-1">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{playlist.description}</p>
                </div>
            </div>
        </Link>
    );
};

export default PlaylistCard;