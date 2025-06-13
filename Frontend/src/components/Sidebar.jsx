import React from 'react';
import Button from './Button';
import { useLocation, Link } from "react-router-dom";

import {
    HiHome,
    HiThumbUp,
    HiClock,
    HiVideoCamera,
    HiFolder,
    HiQuestionMarkCircle,
    HiCog,
    HiUsers
} from "react-icons/hi";

const Sidebar = ({ className, loggedInUser }) => {
    const location = useLocation();
    const hideLabels = location.pathname.startsWith("/video/");
    const Width = hideLabels ? 'w-25' : 'w-64';

    const navItems = [
        { label: "Home", icon: <HiHome size={30} />, slug: "/" },
        { label: "Liked Videos", icon: <HiThumbUp size={30}  />, slug: "/likedvideos" },
        { label: "History", icon: <HiClock size={30}  />, slug: "/history" },
        { label: "My content", icon: <HiVideoCamera size={30} />, slug: "/my-content" },
        { label: "playlists", icon: <HiFolder size={30} />, slug: "/playlists" },
        { label: "Subscriptions", icon: <HiUsers size={30} />, slug: "/subscriptions" },
        { label: "Settings", icon: <HiCog size={30} />, slug: "/settings" }
    ];

    const smItems = [
         { label: "Home", icon: <HiHome size={25} />, slug: "/" },
        { label: "Liked Videos", icon: <HiThumbUp size={25} />, slug: "/likedvideos" },
        { label: "History", icon: <HiClock size={25} />, slug: "/history" },
        { label: "My content", icon: <HiVideoCamera size={25} />, slug: "/my-content" },
        { label: "playlists", icon: <HiFolder size={25} />, slug: "/playlists" },
        { label: "Subscriptions", icon: <HiUsers size={25} />, slug: "/subscriptions" },
        { label: "Settings", icon: <HiCog size={25} />, slug: "/settings" }
    ];

    return (
        <div className={className}>
            <div className="hidden lg:block border-r fixed border-gray-700 bg-[#18181b] z-200 ">
                <div className={`h-screen text-white flex flex-col ${Width} z-50 pl-3 mr-2 `}>
                    {loggedInUser && (
                        <Link to={`/profile/${loggedInUser.username}`} >
                            <div className="flex items-center mb-6 cursor-pointer p-5 pt-8">
                            <img
                                src={loggedInUser.avatar}
                                alt={loggedInUser.fullname}
                                className="w-15 h-15 rounded-full border-2 border-purple-400"
                            />
                            {!hideLabels && (
                                <div className="ml-3 ">
                                    <div className="font-semibold">{loggedInUser.fullname}</div>
                                    <div className="text-md text-gray-400">@{loggedInUser.username}</div>
                                </div>
                            )}
                        </div>
                        </Link>
                        
                    )}

                    <div className="space-y-2  my-4 flex-col flex gap-3">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.slug;
                            return (
                                <Link key={item.label} to={item.slug}>
                                    <Button
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2
                                              ${isActive
                                                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 font-semibold"
                                                : "hover:bg-gray-700 text-gray-300 relative  "
                                            }`}
                                    >
                                        {item.icon}
                                        {!hideLabels && <span className='text-[19px]' >{item.label}</span>}
                                    </Button>
                                </Link>
                            );
                        })}

                    </div>
                </div>
            </div>
            

            <div className="block lg:hidden fixed bottom-0 left-0 w-full bg-[#18181b] text-white border-t border-white/20 z-50">
                <div className="flex justify-around p-2">
                    {smItems.map(item => {
                        const isActive = location.pathname === item.slug;
                        return (
                            <Link to={item.slug} key={item.label}>
                                <Button
                                    className={`flex flex-col items-center gap-1 text-xs 
                                        ${isActive ? "text-purple-400 font-semibold" : "text-gray-300 hover:text-purple-400"}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;