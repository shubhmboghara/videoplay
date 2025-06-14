import React from 'react';
import { Container, LogoutBtn, Button, Search } from '../index';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';

export default function Navbar({ onSearchResults, onSearching, onToggleSidebar }) {
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <header className="fixed w-full shadow z-9999 h-17 bg-[#18181b] border-b border-gray-700 p-4 text-[#020817]">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="lg:hidden flex items-center">
            <button
              onClick={onToggleSidebar}
              className="rounded-full hover:bg-white transition pb-6 "
              aria-label="Open menu"
            >
              <HiMenu size={24} className='text-white' />
            </button>
          </div>
          <div className="pb-6 pl-5">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-white font-semibold text-xl hidden sm:block">VideoHub</span>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 max-w-md mx-4 relative mb-7">
            <Search onSearchResults={onSearchResults} onSearching={onSearching} />
          </div>

          <ul className="hidden sm:flex items-center space-x-2 md:space-x-4">
            {!authStatus ? (
              <>
                <Link to="/login">
                  <li>
                    <Button className="px-4 py-2 text-gray-300 hover:text-white transition-colors mb-7">
                      Login
                    </Button>
                  </li>
                </Link>
                <Link to="/signup">
                  <li>
                    <Button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all text-white mb-7">
                      Sign Up
                    </Button>
                  </li>
                </Link>
              </>
            ) : (
              <li className='pb-7'>
                <LogoutBtn showLabel={true} className="p-2 bg-red-500 hover:bg-red-600 rounded-full " />
              </li>
            )}
          </ul>


        </div>
      </Container>
    </header>
  );
}
