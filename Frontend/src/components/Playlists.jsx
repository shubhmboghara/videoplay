import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiFolderAdd } from 'react-icons/hi';
import PlaylistCard from './PlaylistCard';
import folderImg from '../assets/folder.png';

const API_BASE = '/api/playlist';

function Playlists({ videoId, authStatus, onPlaylistSelected }) {

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
        <div className="min-h-screen bg-[#18181b] text-white px-2 sm:px-4 py-8 w-full overflow-x-hidden relative lg:left-25 bottom-13">
            <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-center">Playlists</h1>
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-w-0">
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <div key={playlist._id} className="rounded-xl bg-[#23232b] shadow-lg border border-[#23232b] overflow-hidden flex flex-col cursor-pointer group transition-transform duration-200 hover:scale-[1.03] min-w-0 max-w-full">
                            <div className="relative w-full h-40 bg-black overflow-hidden" onClick={() => navigate(`/playlist/${playlist._id}`)}>
                                <img
                                    src={playlist.videos && playlist.videos[0] ? playlist.videos[0].thumbnail : folderImg}
                                    alt={playlist.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-0.5 rounded text-white font-semibold">
                                    {playlist.videos ? playlist.videos.length : 0} videos
                                </div>
                                <div className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-0.5 rounded text-white font-semibold">
                                    Playlist
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col min-w-0">
                                <h2 className="text-base font-bold truncate mb-1 text-white">{playlist.name}</h2>
                                <div className="text-xs text-gray-400 truncate mb-1">{playlist.description}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                    {playlist.updatedAt && <><span>Updated {new Date(playlist.updatedAt).toLocaleDateString()}</span></>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 py-12">No playlists created yet.</div>
                )}
            </div>
        </div>
    );
}

export default Playlists;