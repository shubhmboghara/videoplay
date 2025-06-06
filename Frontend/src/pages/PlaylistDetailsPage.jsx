import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { useSelector } from 'react-redux';

const PlaylistDetailsPage = ({ showPopup }) => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/playlist/${id}`);
                if (res.data.success) {
                    setPlaylist(res.data.data.playlist);
                } else {
                    setError(res.data.message || 'Failed to fetch playlist details.');
                }
            } catch (err) {
                console.error('Error fetching playlist details:', err);
                setError('Error fetching playlist details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPlaylistDetails();
        }
    }, [id]);

    if (loading) {
        return <div className="text-white text-center py-8">Loading playlist...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-8">Error: {error}</div>;
    }

    if (!playlist) {
        return <div className="text-white text-center py-8">Playlist not found.</div>;
    }

    return (
        <div className="container mx-auto p-4   lg:left-50 relative">
            <h1 className="text-3xl font-bold text-white mb-6">{playlist.name}</h1>
            {playlist.description && (
                <p className="text-gray-400 mb-6">{playlist.description}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlist.videos.length > 0 ? (
                    playlist.videos.map((video) => (
                        <VideoCard
                            key={video._id}
                            id={video._id}
                            thumbnail={video.thumbnail}
                            title={video.title}
                            channel={video.owner.username}
                            avatar={video.owner.avatar}
                            views={video.views}
                            time={video.createdAt}
                            duration={video.duration}
                            showPopup={showPopup}
                            authStatus={authStatus}
                        />
                    ))
                ) : (
                    <p className="text-white">No videos in this playlist yet.</p>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetailsPage;