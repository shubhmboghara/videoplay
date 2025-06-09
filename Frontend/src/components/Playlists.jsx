import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsThreeDotsVertical } from 'react-icons/bs';
import folderImg from '../assets/folder.png';
import VideoCard from './VideoCard';
import Loader from './Loader';
import {Button,Input} from './index';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const API_BASE = '/api/playlist';

function PlaylistsComponent({ onPlaylistSelected }) {
  const [playlists, setPlaylists] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState(null);
  const [showNewPlaylistForm, setShowNewPlaylistForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteName, setDeleteName] = useState('');

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

  const addVideoToPlaylist = async (videoId, playlistId) => {
    try {
      await axios.patch(`/api/playlist/add/${videoId}/${playlistId}`);
    } catch (error) {
      console.error('Error adding video to playlist:', error);
    }
  };

  const removeVideoFromPlaylist = async (videoId, playlistId) => {
    try {
      await axios.patch(`/api/playlist/remove/${videoId}/${playlistId}`);
    } catch (error) {
      console.error('Error removing video from playlist:', error);
    }
  };

  const updatePlaylist = async (playlistId, newName) => {
    try {
      await axios.patch(`/api/playlist/${playlistId}`, { name: newName });
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/playlist/${playlistId}`);
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

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await axios.post('/api/playlist', {
        name: newPlaylistName,
        description: newPlaylistDescription
      });
      if (res.data && (res.data._id || (res.data.data && res.data.data._id))) {
        const refreshed = await axios.get(`${API_BASE}/user`);
        setPlaylists(refreshed.data.data?.playlist || []);
        setShowNewPlaylistForm(false);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
      } else {
        setCreateError('Failed to create playlist');
      }
    } catch {
      setCreateError('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const handleRequestDelete = (playlist) => {
    setDeletingId(playlist._id)
    setDeleteName(`${playlist.name} playlist`) 

    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deletePlaylist(deletingId);
      setPlaylists(pls => pls.filter(pl => pl._id !== deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
      setDeleteName('');
    } catch {
    } finally {
      setDeleteLoading(false);
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
        <div className="mb-6">
          {showNewPlaylistForm ? (
            <form onSubmit={handleCreatePlaylist} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end bg-[#23232b] p-4 rounded-xl shadow-md max-w-165">
              <Input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none w-full sm:w-48"
                required
                disabled={creating}
                autoFocus
              />
              <Input
                type="text"
                placeholder="Description (optional)"
                value={newPlaylistDescription}
                onChange={e => setNewPlaylistDescription(e.target.value)}
                className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none w-full sm:w-64"
                disabled={creating}
              />
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded shadow disabled:bg-purple-600 disabled:text-white disabled:opacity-70"
                disabled={creating || !newPlaylistName.trim()}
              >
                {creating ? 'Creating...' : 'Create'}
              </Button>
              <Button
                type="button"
                className="text-white text-xs px-4 py-2 rounded shadow bg-red-600 disabled:bg-red-600 "
                onClick={() => { setShowNewPlaylistForm(false); setNewPlaylistName(''); setNewPlaylistDescription(''); }}
                disabled={creating}
              >
                Cancel
              </Button>
              {createError && <span className="text-red-400 text-xs ml-2">{createError}</span>}
            </form>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-semibold"
              onClick={() => setShowNewPlaylistForm(true)}
            >
              + New Playlist
            </Button>
          )}
        </div>
        {selectedPlaylist ? (
          <div>
            <Button
              className="mb-4 text-purple-400 hover:underline"
              onClick={() => { setSelectedPlaylist(null); setPlaylistVideos([]); }}
            >
              ← Back to playlists
            </Button>
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
                        <h3 className="text-lg font-bold truncate mb-1 flex items-center gap-2">
                          {playlist.isEditing ? (
                            <input
                              className="bg-gray-800 text-white rounded px-2 py-1 text-base w-32"
                              value={playlist.editName || playlist.name}
                              onChange={e => {
                                setPlaylists(pls => pls.map(pl => pl._id === playlist._id ? { ...pl, editName: e.target.value } : pl));
                              }}
                              onBlur={async () => {
                                if (playlist.editName && playlist.editName !== playlist.name) {
                                  await updatePlaylist(playlist._id, playlist.editName);
                                  setPlaylists(pls => pls.map(pl => pl._id === playlist._id ? { ...pl, name: playlist.editName, isEditing: false, editName: undefined } : pl));
                                } else {
                                  setPlaylists(pls => pls.map(pl => pl._id === playlist._id ? { ...pl, isEditing: false, editName: undefined } : pl));
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="hover:underline cursor-pointer"
                              onClick={() => setPlaylists(pls => pls.map(pl => pl._id === playlist._id ? { ...pl, isEditing: true, editName: playlist.name } : pl))}
                            >
                              {playlist.name}
                            </span>
                          )}
                          <button
                            className="ml-2 text-xs text-gray-400 hover:text-red-500"
                            title="Delete playlist"
                            onClick={e => {
                              e.stopPropagation();
                              handleRequestDelete(playlist);
                            }}
                          >
                            Delete
                          </button>
                        </h3>

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
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        itemName={deleteName}
        loading={deleteLoading}
        itemtype="playlist"

      />
    </div>
  );
}

export default PlaylistsComponent;