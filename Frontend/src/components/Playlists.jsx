import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiFolderAdd } from 'react-icons/hi';
import PlaylistCard from './PlaylistCard';

const API_BASE = '/api/playlist';

function Playlists({ videoId, authStatus, onPlaylistSelected, onPlaylistSelect }) {

    const [playlists, setPlaylists] = useState([]);

    const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
    const navigate = useNavigate();


  

    const fetchUserPlaylists = async () => {
        try {
            const res = await axios.get(`${API_BASE}/user`);
             if (res.data.success) {
                 setPlaylists(res.data.data.playlist);
             }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };
    const createPlaylist = async () => {
        if (!newPlaylistName) return alert('Enter playlist name');
        try {
            const res = await axios.post(API_BASE, {
                name: newPlaylistName,
                description: newPlaylistDescription,
            });
            if (res.data.success) {
                alert('Playlist created');
                setNewPlaylistName('');
                setNewPlaylistDescription('');
                fetchUserPlaylists();
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }   
    };

    const addVideoToPlaylist = async (playlistId) => {

        if (!playlistId) return alert('Select a playlist first');

        try {
            const res = await axios.patch(
                `${API_BASE}/add/${videoId}/${playlistId}`

            );
            if (res.data.success) {
                alert('Video added to playlist');
                fetchUserPlaylists();
                if (onPlaylistSelected) {
                    onPlaylistSelected(selectedPlaylistId); 
                }
            }
        } catch (error) {
            console.error('Error adding video:', error);
        }
    };

    const removeVideoFromPlaylist = async (playlistId, videoIdToRemove) => {
        try {
            const res = await axios.patch(
                `${API_BASE}/remove/${videoIdToRemove}/${playlistId}`
            );
            if (res.data.success) {
                alert('Video removed from playlist');
                fetchUserPlaylists();
            }
        } catch (error) {
            console.error('Error removing video:', error);
        }
    };

    const deletePlaylist = async (playlistId) => {
        if (!window.confirm('Delete this playlist?')) return;
        try {
            const res = await axios.delete(`${API_BASE}/${playlistId}`);
            if (res.data.success) {
                alert('Playlist deleted');
                fetchUserPlaylists();
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    const updatePlaylist = async (playlistId, updateData) => {
        try {
            const res = await axios.patch(`${API_BASE}/${playlistId}`, updateData);
            if (res.data.success) {
                alert('Playlist updated');
                fetchUserPlaylists();
            }
        } catch (error) {
            console.error('Error updating playlist:', error);
        }
    };
        useEffect(() => {
            fetchUserPlaylists();
        
    }, []);

    const handlePlaylistSelection = async (playlistId) => {
        setSelectedPlaylistId(playlistId);
        await addVideoToPlaylist(playlistId); 
    };

    if (onPlaylistSelected) {
        return (
            <div className="w-[360px] bg-[#212121] rounded-xl shadow-xl text-white overflow-hidden">
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
    <h2 className="text-lg font-medium">Save to playlist</h2>
    <button onClick={() => onPlaylistSelected(null)} className="text-gray-400 hover:text-white">
      ✕
    </button>
  </div>

  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-700">
    {playlists.map((pl) => (
      <div key={pl._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#303030] cursor-pointer">
        <label className="flex items-center gap-3 w-full cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-purple-500 border-gray-600"
            checked={selectedPlaylistId === pl._id}
            onChange={() => handlePlaylistSelection(pl._id)}
          />
          <span className="truncate text-sm">{pl.name}</span>
        </label>
        {pl.isPrivate && (
          <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1a4 4..." clipRule="evenodd" />
          </svg>
        )}
      </div>
    ))}
  </div>

  <div className="border-t border-gray-700 px-4 py-3">
    {!showNewPlaylistInput ? (
      <button
        onClick={() => setShowNewPlaylistInput(true)}
        className="w-full flex items-center justify-center gap-2 text-sm hover:text-purple-400 transition"
      >
        <HiFolderAdd className="w-5 h-5" />
        <span>New playlist</span>
      </button>
    ) : (
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-[#2b2b2b] text-white text-sm focus:outline-none focus:ring focus:ring-purple-500"
        />
        <button
          onClick={createPlaylist}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-md"
        >
          Create & Add
        </button>
      </div>
    )}
  </div>
</div>

        );
    }

    return (
        <div className="playlist-manager p-4 border rounded-md bg-gray-900 text-white max-w-lg mx-auto shadow-lg">
            <h2 className="text-2xl mb-6 font-bold text-center text-purple-400">Your Playlists</h2>

            <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h3 className="text-xl font-semibold mb-3">Create New Playlist</h3>
                {!showNewPlaylistInput ? (
                    <button
                        onClick={() => setShowNewPlaylistInput(true)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition duration-300 ease-in-out"
                    >
                        <HiFolderAdd className="h-5 w-5" />
                        New playlist
                    </button>
                ) : (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Playlist Name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="p-3 rounded-md text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <textarea
                            placeholder="Playlist Description (Optional)"
                            value={newPlaylistDescription}
                            onChange={(e) => setNewPlaylistDescription(e.target.value)}
                            className="p-3 rounded-md text-black w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        ></textarea>
                        <button
                            onClick={createPlaylist}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-purple-800 transition duration-300 ease-in-out"
                        >
                            Create Playlist
                        </button>
                        <button
                            onClick={() => setShowNewPlaylistInput(false)}
                            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <PlaylistCard key={playlist._id} playlist={playlist} onClick={() => onPlaylistSelect && onPlaylistSelect(playlist._id)} />
                    ))
                ) : (
                    <p className="text-gray-400 text-center col-span-full">No playlists created yet.</p>
                )}
            </div>
        </div>
    );
}

export default Playlists;