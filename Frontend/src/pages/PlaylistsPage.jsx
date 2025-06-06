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
                        setPlaylistVideos(res.data.data.videos || []);
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
        <div className="p-4">
            {selectedPlaylistId ? (
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Videos in Playlist</h2>
                    {playlistVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {playlistVideos.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-white">No videos in this playlist.</p>
                    )}
                    <button
                        onClick={() => setSelectedPlaylistId(null)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Playlists
                    </button>
                </div>
            ) : (
                <PlaylistsComponent onPlaylistSelect={handlePlaylistSelect} />
            )}
        </div>
    );
}

export default PlaylistsPage;