import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiFolderAdd } from 'react-icons/hi';

const API_BASE = '/api/playlist';

function PlaylistManager({ videoId, authStatus, onPlaylistSelected, onClose }) {

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
                setShowNewPlaylistInput(false); // Hide the input fields after creation
                fetchUserPlaylists();
                if (onClose) {
                    onClose(); // Close the modal after successful creation
                }
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
            alert('Error creating playlist. Check console for details.');
        }
    };

    const addVideoToPlaylist = async (playlistId) => {
        if (!playlistId) return alert('Select a playlist first');
        try {
            console.log('Making API call to:', `${API_BASE}/add/${videoId}/${playlistId}`);
            const res = await axios.patch(
                `${API_BASE}/add/${videoId}/${playlistId}`
            );

            if (res.data.success) {
                alert('Video added to playlist');
                fetchUserPlaylists();
                if (onPlaylistSelected) {
                    onPlaylistSelected(playlistId); 
                }
                if (onClose) {
                    onClose(); 
                }
            }
        } catch (error) {
            console.error('Error adding video:', error);
            alert('Error adding video to playlist. Check console for details.');
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
            const res = await axios.patch(`${API_BASE}/playlist/${playlistId}`, updateData);
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
        if (onClose) {
            onClose(); 
        }
    };

    if (onPlaylistSelected) {
        return (
            <div className="w-full bg-gray-800 rounded-md shadow-lg py-1 text-white " onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-400">
                    <span className="text-base font-semibold text-white">Save video to...</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
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
                            onClick={(e) => { e.stopPropagation(); handlePlaylistSelection(pl._id); }}
                        >
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                     type="checkbox"
                                     className="form-checkbox h-5 w-5 text-white bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                                     checked={selectedPlaylistId === pl._id}
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
                                onClick={(e) => { e.stopPropagation(); setShowNewPlaylistInput(true); }}
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
                                onClick={(e) => { e.stopPropagation(); createPlaylist(); }}
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
                <input
                    type="text"
                    placeholder="Playlist Name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="p-3 rounded-md text-black w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                    placeholder="Description"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    className="p-3 rounded-md text-black w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                />
                <button
                    onClick={createPlaylist}
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2.5 rounded-md hover:from-green-600 hover:to-green-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Create Playlist
                </button>
            </div>

            <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h3 className="text-xl font-semibold mb-3">Add Video to Existing Playlist</h3>
                <select
                    className="w-full p-3 rounded-md mb-4 bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setSelectedPlaylistId(e.target.value)}
                    value={selectedPlaylistId}
                >
                    <option value="">Select a playlist</option>
                    {playlists.map((pl) => (
                        <option key={pl._id} value={pl._id}>
                            {pl.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={addVideoToPlaylist}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    <HiFolderAdd className="h-5 w-5" />
                    Save Video to Selected Playlist
                </button>
            </div>

            <div>
                <h3 className="text-2xl font-bold mb-4 text-center text-purple-400">Your Playlists</h3>
                {playlists.length === 0 ? (
                    <p className="text-center text-gray-500">No playlists found. Create one above!</p>
                ) : (
                    playlists.map((pl) => (
                        <div
                            key={pl._id}
                            className="mb-6 p-5 border border-gray-700 rounded-lg bg-gray-800 shadow-md"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <strong className="text-xl text-yellow-300">{pl.name}</strong>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => deletePlaylist(pl._id)}
                                        className="text-red-400 hover:text-red-600 transition duration-200 ease-in-out"
                                    >
                                        Delete
                                    </button>
                                    {/* Add an edit button for updating playlist */}
                                    <button
                                        onClick={() => {
                                            const newName = prompt('Enter new playlist name:', pl.name);
                                            const newDescription = prompt('Enter new playlist description:', pl.description);
                                            if (newName !== null || newDescription !== null) {
                                                updatePlaylist(pl._id, { name: newName || pl.name, description: newDescription || pl.description });
                                            }
                                        }}
                                        className="text-blue-400 hover:text-blue-600 transition duration-200 ease-in-out"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{pl.description}</p>

                            {/* List videos in playlist */}
                            <h4 className="text-lg font-semibold mb-2 text-gray-300">Videos:</h4>
                            <ul className="mb-2 space-y-2">
                                {pl.videos && pl.videos.length > 0 ? (
                                    pl.videos.map((vid) => (
                                        <li key={vid._id} className="flex justify-between items-center p-2 bg-gray-700 rounded-md">
                                            <span className="text-white">{vid.title || 'Untitled Video'}</span>
                                            <button
                                                onClick={() => removeVideoFromPlaylist(pl._id, vid._id)} // Pass videoId to remove
                                                className="text-red-400 hover:text-red-600 text-sm transition duration-200 ease-in-out"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic">No videos in this playlist yet.</li>
                                )}

                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PlaylistManager;