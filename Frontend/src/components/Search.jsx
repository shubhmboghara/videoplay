import React, { useState } from "react";
import axios from 'axios'
import { HiOutlineSearch } from "react-icons/hi";


const Search = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/api/video?query=${encodeURIComponent(searchTerm)}`)
            onSearchResults(data?.data?.videos || []);
        } catch (error) {
            console.error("Search error:", error);
        }
    }

    return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search videos, channels, playlists..."
        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
      />
    </form>
  );
};



export default Search