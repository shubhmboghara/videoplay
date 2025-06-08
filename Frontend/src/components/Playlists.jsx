import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiFolderAdd } from 'react-icons/hi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import folderImg from '../assets/folder.png';
import playIcon from '../assets/play.svg';
import Logo from '../assets/Logo.png';
import PlaylistCard from './PlaylistCard';
import Loader from './Loader';

const API_BASE = '/api/playlist';



function Playlists({ onPlaylistSelected }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Recently added');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredPlaylists = playlists.filter((pl) =>
    pl.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white w-full ">

      <div className="ml-0 lg:ml-64 px-4 sm:px-8 pt-10 pb-4">
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
      </div>

      <div className="ml-0 lg:ml-64 px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
           <div className='relative left-200 '>
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
                    onClick={() => onPlaylistSelected && onPlaylistSelected(playlist._id)}
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
                          onPlaylistSelected && onPlaylistSelected(playlist._id);
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
      </div>
    </div>
  );
}

export default Playlists;