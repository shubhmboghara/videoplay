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

  return (
    <header className="fixed w-full bg-  shadow z-50   h-17  bg-[#111827]  border-b border-gray-700 p-4  text-[#020817]">
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
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-10 mb-5"
            />
          </div>

          <ul className="hidden sm:flex items-center space-x-2 md:space-x-4">
             <div className='pb-2 w-10'>
                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:text-accent-foreground h-9 rounded-md px-3 text-white hover:bg-gray-800"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></button>
             </div>

            {authStatus && (
              <div>
                <LogoutBtn className=" px-4 py-2 rounded-full text-white mt-12 bg-red-500 hover:bg-red-700 mb-5 w-5 mb-8 " />
              </div>
            )}

          </ul>

          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-white transition"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="sm:hidden bg-black border-t border-white border  relative left-50 top-4 w-38 ">
            <Container>
              <ul className="flex flex-col pb-4 px-4 space-y-2">
                <Button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-white transition relative left-80"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >                  <HiX size={24} />


                </Button>

                {navItems.map(
                  (item) =>
                    item.active && (
                      <li key={item.name}>
                        <Link
                          to={item.slug}
                          className="block px-4 py-3 rounded-full hover:bg-gray-800 transition text-base"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    )
                )}
                {authStatus && (
                  <li className="pt-2">
                    <LogoutBtn />
                  </li>
                )}
              </ul>
            </Container>
          </nav>
        )}
      </Container>
    </header>
  );
}