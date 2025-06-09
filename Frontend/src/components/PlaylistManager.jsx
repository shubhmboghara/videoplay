import React, { useState, useEffect, useRef } from 'react';
import { HiFolderAdd } from 'react-icons/hi';
import Button from './Button';
import Input from './Input';
import axios from 'axios';

const PlaylistManager = ({ videoId, authStatus, onPlaylistSelected, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewPlaylistForm, setShowNewPlaylistForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/playlist/user')
      .then(res => {
        setPlaylists(res.data.data?.playlist || []);
      })
      .catch(() => setError('Failed to load playlists'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
   
   
  }, [onClose]);

  const isVideoInPlaylist = (playlist) => {
    if (!playlist.videos) return false;
    return playlist.videos.some(v => (typeof v === 'string' ? v === videoId : v._id === videoId));
  };

  const handleTogglePlaylist = async (playlistId, checked) => {
    setAdding(true);
    setAddingId(playlistId);
    try {
      if (checked) {
        await axios.patch(`/api/playlist/add/${videoId}/${playlistId}`);
      } else {
        await axios.patch(`/api/playlist/remove/${videoId}/${playlistId}`);
      }
      const refreshed = await axios.get('/api/playlist/user');
      setPlaylists(refreshed.data.data?.playlist || []);
      if (onPlaylistSelected && checked) onPlaylistSelected(playlistId);
    } catch {
      setError('Failed to update playlist');
    } finally {
      setAdding(false);
      setAddingId(null);
    }
  };

  const handleCreateNewPlaylist = async (e) => {
    e.preventDefault();
    if (newPlaylistName.trim() === '') return;
    setCreating(true);
    setError(null);
    try {
      const res = await axios.post('/api/playlist', {
        name: newPlaylistName,
        description: newPlaylistDescription
      });
      const newPlaylist = res.data && res.data._id ? res.data : (res.data.data && res.data.data._id ? res.data.data : null);
      if (newPlaylist && newPlaylist._id) {
        const refreshed = await axios.get('/api/playlist/user');
        setPlaylists(refreshed.data.data?.playlist || []);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
        setShowNewPlaylistForm(false);
        await handleTogglePlaylist(newPlaylist._id, true);
      } else {
        setError('Failed to create playlist');
      }
    } catch {
      setError('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  return (


    <div ref={dropdownRef} className="p-4 ">
      <h3 className="text-white text-lg font-semibold mb-3">Save to Playlist</h3>
      {loading ? (
        <div className="text-gray-400 py-2">Loading...</div>
      ) : error ? (
        <div className="text-red-400 py-2">{error}</div>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              className={`flex items-center justify-between text-gray-300 hover:text-white cursor-pointer px-2 py-1 rounded ${addingId === playlist._id ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <label className="flex items-center gap-2 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVideoInPlaylist(playlist)}
                  onChange={e => handleTogglePlaylist(playlist._id, e.target.checked)}
                  disabled={addingId === playlist._id}
                  className="accent-blue-500"
                />
                <span className="truncate flex-1">{playlist.name}</span>
                <span className="text-xs text-gray-500">({playlist.videos.length} videos)</span>
                {addingId === playlist._id && <span className="ml-2 text-xs text-gray-400">Saving...</span>}
              </label>
            </li>
          ))}
          <li
            className="flex items-center text-blue-400 hover:text-blue-300 cursor-pointer mt-2"
            onClick={() => setShowNewPlaylistForm(true)}
          >
            <HiFolderAdd className="h-5 w-5 mr-2" /> New Playlist
          </li>
        </ul>
      )}
      {showNewPlaylistForm && (
        <form onSubmit={handleCreateNewPlaylist} className="mt-4 p-3 bg-gray-800 rounded-md">
          <Input
            type="text"
            placeholder="New playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="w-full mb-2 bg-gray-700 border-gray-600 text-white"
            disabled={creating}
            autoFocus
          />
          <Input
            type="text"
            placeholder="Description (optional)"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            className="w-full mb-2 bg-gray-700 border-gray-600 text-white"
            disabled={creating}
          />
          <Button
            type="submit"
            disabled={creating || !newPlaylistName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {creating ? 'Creating...' : 'Create & Save'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default PlaylistManager;