import React, { useState, useEffect } from 'react';
import PlaylistsComponent from '../components/playlists';
import VideoCard from '../components/VideoCard';
import axios from 'axios';
import Loader from '../components/Loader';
import { useParams, useNavigate } from 'react-router-dom';

function PlaylistsPage() {
    const params = useParams();
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(params.id || null);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylistVideos = async () => {
            if (selectedPlaylistId) {
                setLoading(true);
                setError(null);
                try {
                    const res = await axios.get(`/api/playlist/${selectedPlaylistId}`);
                    if (res.data.success) {
                        setPlaylistVideos(res.data.data.playlist?.videos || []);
                        console.log('Setting playlistVideos:', res.data.data.playlist?.videos || []);
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

    useEffect(() => {
        if (params.id && params.id !== selectedPlaylistId) {
            setSelectedPlaylistId(params.id);
        }
    }, [params.id]);

    const handlePlaylistSelect = (playlistId) => {
        setSelectedPlaylistId(playlistId);
        navigate(`/playlist/${playlistId}`);
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
                                <VideoCard
                                    key={video._id}
                                    id={video._id}
                                    thumbnail={video.thumbnail}
                                    title={video.title}
                                    channel={video.owner?.username || video.channelName || video.channel || ''}
                                    avatar={video.owner?.avatar || video.channelAvatar || video.avatar || ''}
                                    views={video.views || 0}
                                    time={video.createdAt || video.time || ''}
                                    duration={video.duration || 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-white">No videos in this playlist.</p>
                    )}
                    <button
                        onClick={() => { setSelectedPlaylistId(null); navigate('/playlists'); }}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Playlists
                    </button>
                </div>
            ) : (
                <PlaylistsComponent onPlaylistSelected={handlePlaylistSelect} />
            )}
        </div>
    );
}

export default PlaylistsPage;