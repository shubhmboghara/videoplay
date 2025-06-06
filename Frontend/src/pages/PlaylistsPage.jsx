import React, { useState, useEffect } from 'react';
import PlaylistsComponent from '../components/playlists';
import { VideoCard } from '../components';
import axios from 'axios';
import Loader from '../components/Loader';

function PlaylistsPage() {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylistVideos = async () => {
            if (selectedPlaylistId) {
                setLoading(true);
                setError(null);
                try {
                    const res = await axios.get(`/api/playlist/${selectedPlaylistId}`);

                    if (res.data.success) {
                        setPlaylistVideos(res.data.data.playlist.videos || []);
                    } else {
                        setError(res.data.message || 'Failed to fetch playlist videos.');
                    }
                } catch (err) {
                    console.error('Error fetching playlist videos:', err);
                    setError('Error fetching playlist videos.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPlaylistVideos();
    }, [selectedPlaylistId]);

    const handlePlaylistSelect = (playlistId) => {
        console.log('Playlist selected:', playlistId);
        setSelectedPlaylistId(playlistId);
    };

    if (loading) {
        return <Loader message="Loading playlist videos..." />;
    }

    if (error) {
        return <p className="text-red-500 p-4">{error}</p>;
    }

    return (
        <div className="p-4  relative  lg:left-70">
            <button
                onClick={() => setSelectedPlaylistId(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700  mb-5 ml-2"
            >
                Back to Playlists
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Videos in Playlist</h2>

            {selectedPlaylistId ? (
                <div>
                    {playlistVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {playlistVideos.map((video) => (
                                <div key={video._id} className="flex flex-col bg-[#18181b] rounded-lg overflow-hidden shadow-md h-full">
                                    <VideoCard
                                        classNameImg="w-full h-48 object-cover"
                                        id={video._id}
                                        thumbnail={video.thumbnail}
                                        title={video.title}
                                        channel={video.owner.username}
                                        avatar={video.owner.avatar}
                                        views={video.views}
                                        time={video.createdAt}
                                        duration={video.duration}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white">No videos in this playlist.</p>
                    )}

                </div>
            ) : (
                <PlaylistsComponent onPlaylistSelect={handlePlaylistSelect} />
            )}
        </div>
    );
}

export default PlaylistsPage;