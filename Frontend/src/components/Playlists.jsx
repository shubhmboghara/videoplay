import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiFolderAdd } from 'react-icons/hi';
import PlaylistCard from './PlaylistCard';

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
                `${API_BASE}/${playlistId}/add/${videoId}`
            );
            if (res.data.success) {
                alert('Video added to playlist');
                fetchUserPlaylists();
                if (onPlaylistSelected) {
                    onPlaylistSelected(selectedPlaylistId); // Notify parent component
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
            <div className="w-full bg-gray-800 rounded-md shadow-lg py-1 text-white">
                <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-400">
                    <span className="text-base font-semibold text-white">Save video to...</span>
                    <button onClick={() => onPlaylistSelected(null)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="py-1">
                    {playlists.map((pl) => (
                        <div
                            key={pl._id}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handlePlaylistSelection(pl._id)}
                        >
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                     type="checkbox"
                                     className="form-checkbox h-5 w-5 text-white bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                                     checked={selectedPlaylistId === pl._id}
                                     onChange={() => handlePlaylistSelection(pl._id)}
                                 />
                                 <span className="ml-4 text-white text-base">{pl.name}</span>
                            </label>
                            {pl.isPrivate && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                     className="h-4 w-4 text-gray-400 ml-2"
                                     viewBox="0 0 20 20"
                                     fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 1a4 4 0 00-4 4v2a4 4 0 00-4 4v4a2 2 0 002 2h8a2 2 0 002-2v-4a4 4 0 00-4-4V5a4 4 0 00-4-4zm3 8V5a3 3 0 10-6 0v4h6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    ))} 
                </div>
                <div className="border-t border-gray-700 mt-1 pt-1">
                    {!showNewPlaylistInput ? (
                        <div className="px-4 py-2">
                            <button
                                onClick={() => setShowNewPlaylistInput(true)}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition duration-300 ease-in-out"
                            >
                                <HiFolderAdd className="h-5 w-5" />
                                New playlist
                            </button>
                        </div>
                    ) : (
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">Create New Playlist</h3>
                            <input
                                type="text"
                                placeholder="Playlist Name"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="p-2 rounded-md text-black w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={createPlaylist}
                                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-green-800 transition duration-300 ease-in-out"
                            >
                                Create & Add Video
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
                        <PlaylistCard key={playlist._id} playlist={playlist} />
                    ))
                ) : (
                    <p className="text-gray-400 text-center col-span-full">No playlists created yet.</p>
                )}
            </div>
        </div>
    );
}

export default Playlists;