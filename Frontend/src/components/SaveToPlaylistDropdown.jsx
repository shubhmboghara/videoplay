import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiFolderAdd } from 'react-icons/hi';
import Button from './Button';

const API_BASE = '/api/playlist';

export default function SaveToPlaylistDropdown({ videoId, onSaved }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch playlists
  useEffect(() => {
    if (!showDropdown) return;
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE}`)
      .then(res => {
        setPlaylists(res.data.data?.playlist || []);
      })
      .catch(() => setError('Failed to load playlists'))
      .finally(() => setLoading(false));
  }, [showDropdown]);

  // Close on outside click
  useEffect(() => {
    if (!showDropdown) return;
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setShowNew(false);
        setNewName('');
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showDropdown]);

  // Add video to playlist
  const handleAdd = async (playlistId) => {
    setAdding(true);
    setAddingId(playlistId);
    try {
      await axios.patch(`${API_BASE}/add/${videoId}/${playlistId}`);
      setShowDropdown(false);
      setShowNew(false);
      setNewName('');
      if (onSaved) onSaved();
    } catch {
      setError('Failed to add video');
    } finally {
      setAdding(false);
      setAddingId(null);
    }
  };

  // Create playlist and add video
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await axios.post(`${API_BASE}`, {
        name: newName,
        description: newName
      });
      const newPlaylist = res.data?.data;
      if (newPlaylist && newPlaylist._id) {
        await handleAdd(newPlaylist._id);
        // Playlists will refresh on next open
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
    <div className="relative">
      <Button
        onClick={() => setShowDropdown(v => !v)}
        className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm ml-5"
      >
        <HiFolderAdd className="h-4 w-4" /> Save
      </Button>
      {showDropdown && (
        <div ref={dropdownRef} className="absolute top-full left-0 mt-2 z-50 bg-gray-900 p-4 rounded-lg shadow-lg w-80 min-w-[18rem]">
          <div className="mb-2 font-semibold text-white">Save video to...</div>
          {loading ? (
            <div className="text-gray-400 py-2">Loading...</div>
          ) : error ? (
            <div className="text-red-400 py-2">{error}</div>
          ) : (
            <>
              {playlists.length === 0 && <div className="text-gray-400 py-2">No playlists yet.</div>}
              {playlists.map(pl => (
                <button
                  key={pl._id}
                  className={`w-full text-left flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-800 transition ${addingId === pl._id ? 'opacity-60 pointer-events-none' : ''}`}
                  onClick={() => handleAdd(pl._id)}
                  disabled={adding}
                >
                  <span className="truncate">{pl.name}</span>
                  {addingId === pl._id && <span className="ml-auto text-xs text-gray-400">Saving...</span>}
                </button>
              ))}
            </>
          )}
          {/* New playlist creation */}
          {showNew ? (
            <form onSubmit={handleCreate} className="mt-3 flex gap-2">
              <input
                className="flex-1 px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                placeholder="New playlist name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                disabled={creating}
                autoFocus
              />
              <Button
                type="submit"
                disabled={creating || !newName.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
              >
                {creating ? '...' : 'Create'}
              </Button>
            </form>
          ) : (
            <button
              className="mt-3 w-full text-left text-purple-400 hover:underline px-2 py-1"
              onClick={() => setShowNew(true)}
            >
              + New playlist
            </button>
          )}
        </div>
      )}
    </div>
  );
}
