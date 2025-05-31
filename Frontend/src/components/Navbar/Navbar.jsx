import React, { useState } from 'react';
import { Container, LogoutBtn, Logo, Button, } from '../index';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
  ];
  // bg-[#111827] 
  return (
    <header className="fixed w-full   shadow z-9999   h-17   bg-[#18181b] border-b border-gray-700 p-4  text-[#020817]" >
      <Container>
        <div className="flex items-center justify-between h-16">

          <div className=' pb-5'>
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-white font-semibold text-xl hidden sm:block">VideoHub</span></div>
            </Link>
          </div>

          <div className="flex flex-1 max-w-md mx-4 relative">
            <HiOutlineSearch className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-500 " />
            <input
              type="search"
              placeholder="Search videos, channels, playlists..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-10 mb-5"
            />
          </div>

          <ul className="hidden sm:flex items-center space-x-2 md:space-x-4  ">

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


            {authStatus && (
              <div>
                <LogoutBtn className=" px-4 py-2 rounded-full text-white mt-12 bg-red-500 hover:bg-red-700 mb-5 w-5 mb-8 " />
              </div>
            )}

          </ul>

          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-white transition bg-white mb-6"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} className='' />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="sm:hidden bg-[#27272a] border-t border-zinc-700 relative w-full h-35 ">
            <Container>
              <ul className="flex flex-col pb-4 px-4 space-y-2 text-white">

                <div className="pt-7 pb-3 relative bottom-5">

                  <Link to="/login">

                    <li>
                      <Button className="px-27 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all text-white mb-7"
                      >
                        Login
                      </Button>
                    </li>
                  </Link>

                  <Link>
                    <li>
                      <Button to="/signup"
                        className="px-25 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all text-white mb-7"
                      >
                        Sign Up
                      </Button>
                    </li>
                  </Link>

                  {authStatus && (
                    <li className="pt-2">
                      <LogoutBtn />
                    </li>
                  )}
                </div>
              </ul>
            </Container>
          </nav>
        )}

      </Container>
    </header >
  );
}