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
    <header className="fixed w-full bg-black text-white shadow z-50 border-b border-white h-16">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <Logo className="h-25 w-32" />
          </Link>
          <div className="flex flex-1 max-w-md mx-4 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2  border 0 bg-black text-white focus:outline-none focus:border-white text-sm"
            />
          </div>
          <ul className="hidden sm:flex items-center space-x-2 md:space-x-4">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <Link to={item.slug} className="px-3 py-2 md:px-4 rounded-full  transition text-sm md:text-base">
                      <Button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition" >
                        {item.name}
                      </Button>

                    </Link>
                  </li>
                )
            )}
            {authStatus && (
              <div>
                <LogoutBtn className=" px-4 py-2 rounded-full text-white mt-12 bg-red-500 hover:bg-red-700 mb-5 w-5 " />
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