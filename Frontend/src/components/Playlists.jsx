import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiFolderAdd } from 'react-icons/hi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import folderImg from '../assets/folder.png';
import playIcon from '../assets/play.svg';
import Logo from '../assets/Logo.png';
import PlaylistCard from './PlaylistCard';
import VideoCard from './VideoCard';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api/playlist';

function PlaylistsComponent({ onPlaylistSelected }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Recently added');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user`);
        if (res.data.success) {
          setPlaylists(res.data.data.playlist);
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPlaylists();
  }, []);

  // Add a video to a playlist
  const addVideoToPlaylist = async (videoId, playlistId) => {
    try {
      await axios.patch(`/api/playlist/add/${videoId}/${playlistId}`);
      // Optionally, refresh playlists or show a success message
    } catch (error) {
      console.error('Error adding video to playlist:', error);
    }
  };

  // Remove a video from a playlist
  const removeVideoFromPlaylist = async (videoId, playlistId) => {
    try {
      await axios.patch(`/api/playlist/remove/${videoId}/${playlistId}`);
      // Optionally, refresh playlists or show a success message
    } catch (error) {
      console.error('Error removing video from playlist:', error);
    }
  };

  // Update a playlist
  const updatePlaylist = async (playlistId, newName) => {
    try {
      await axios.patch(`/api/playlist/${playlistId}`, { name: newName });
      // Optionally, refresh playlists or show a success message
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  // Delete a playlist
  const deletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/playlist/${playlistId}`);
      // Optionally, refresh playlists or show a success message
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handlePlaylistSelect = async (playlistId) => {
    setVideosLoading(true);
    setVideosError(null);
    setSelectedPlaylist(playlistId);
    try {
      const res = await axios.get(`/api/playlist/${playlistId}`);
      if (res.data.success) {
        setPlaylistVideos(res.data.data.playlist?.videos || []);
      } else {
        setVideosError(res.data.message || 'Failed to fetch playlist videos.');
      }
    } catch (err) {
      setVideosError('Error fetching playlist videos.');
    } finally {
      setVideosLoading(false);
    }
  };

  const filteredPlaylists = playlists.filter((pl) =>
    pl.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white w-full ">
      <div className="ml-0 lg:ml-64 px-4 sm:px-8 pt-10 pb-4">
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
      </div>
      <div className="ml-0 lg:ml-64 px-4 sm:px-8 pb-16">
        {selectedPlaylist ? (
          <div>
            <button
              className="mb-4 text-purple-400 hover:underline"
              onClick={() => { setSelectedPlaylist(null); setPlaylistVideos([]); }}
            >
              ← Back to playlists
            </button>
            <h3 className="text-2xl font-bold mb-6">Videos in Playlist</h3>
            {videosLoading ? (
              <Loader message="Loading playlist videos..." />
            ) : videosError ? (
              <p className="text-red-500">{videosError}</p>
            ) : playlistVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlistVideos.map((video) => (
                  <VideoCard
                    key={video._id}
                    id={video._id}
                    thumbnail={video.thumbnailUrl || video.thumbnail}
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
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className='relative left-100'>
                <Loader message="Loading playlists..." />
              </div>
            ) : filteredPlaylists.length > 0 ? (
              filteredPlaylists.map((playlist) => {
                const videosArr = Array.isArray(playlist.videos) ? playlist.videos : [];
                let coverImg = folderImg;
                if (videosArr.length > 0 && videosArr[0]) {
                  coverImg = videosArr[0].thumbnailUrl || videosArr[0].thumbnail || folderImg;
                }
                return (
                  <div
                    key={playlist._id}
                    className="rounded-2xl shadow-lg hover:shadow-2xl transition group cursor-pointer flex flex-col bg-[#181818] box-border"
                    style={{ minWidth: 0 }}
                  >
                    <div
                      className="relative w-full aspect-video overflow-hidden rounded-t-2xl"
                      onClick={() => handlePlaylistSelect(playlist._id)}
                    >
                      <img
                        src={coverImg}
                        alt={playlist.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.onerror = null; e.target.src = folderImg; }}
                      />
                      <button className="absolute top-3 right-3 p-1 rounded-full bg-black/60 hover:bg-black/80">
                        <BsThreeDotsVertical className="text-gray-300" size={20} />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-4">
                      <div>
                        <h3 className="text-lg font-bold truncate mb-1">{playlist.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          {playlist.isPrivate && <span>Private</span>}
                          <span>Playlist</span>
                        </div>
                        <a
                          href="#"
                          className="text-sm text-purple-400 font-semibold hover:underline"
                          onClick={e => {
                            e.preventDefault();
                            handlePlaylistSelect(playlist._id);
                          }}
                        >
                          View full playlist
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center col-span-full text-lg py-12">No playlists created yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistsComponent;