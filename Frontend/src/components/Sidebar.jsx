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

const Sidebar = ({ className }) => {
    const location = useLocation();
    const hideLabels = location.pathname.startsWith("/video/");
    const Width = hideLabels ? 'w-20' : 'w-64';

    const navItems = [
        { label: "Home", icon: <HiHome size={20} />, slug: "/" },
        { label: "Liked Videos", icon: <HiThumbUp size={20} />, slug: "/liked" },
        { label: "History", icon: <HiClock size={20} />, slug: "/history" },
        { label: "My content", icon: <HiVideoCamera size={20} />, slug: "/my-content" },
        { label: "Collection", icon: <HiFolder size={20} />, slug: "/collection" },
        { label: "Subscribers", icon: <HiUsers size={24} />, slug: "/subscribers" }
    ];

    const bottomItems = [
        { label: "Support", icon: <HiQuestionMarkCircle size={20} />, slug: "/support" },
        { label: "Settings", icon: <HiCog size={20} />, slug: "/settings" }
    ];

    const smItems = [
        { label: "Home", icon: <HiHome size={20} />, slug: "/" },
        { label: "History", icon: <HiClock size={20} />, slug: "/history" },
        { label: "Collection", icon: <HiFolder size={20} />, slug: "/collection" },
        { label: "Subscribers", icon: <HiUsers size={24} />, slug: "/subscribers" }
    ];

    return (
        <div className={className} >
            <div className="hidden lg:block border-r fixed ">
                <div className={`h-screen bg-black text-white flex flex-col p-3 border-r border-white ${Width} z-50 `}>

                    <div className="space-y-4 flex-1 ">  
                        {navItems.map((item) => (
                            <Link key={item.label} to={item.slug}>
                                <Button className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded hover:bg-white/10 w-full my-2">
                                    {item.icon}
                                    {!hideLabels && <span>{item.label}</span>}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    <div className="space-y-2 pt-4 relative bottom-20">
                        {bottomItems.map((item) => (

                            <Link to={item.slug}>

                                <Button
                                    key={item.label}
                                    className="w-full flex items-center gap-2 border border-white/20 px-4 py-2 rounded hover:bg-white/10 my-2"
                                >
                                    {item.icon}
                                    {!hideLabels && <span>{item.label}</span>}
                                </Button>
                            </Link>

                        ))}
                    </div>
                </div>
            </div>

            <div className="block lg:hidden fixed bottom-0 left-0 w-full bg-black text-white border-t border-white/20 z-50">
                <div className="flex justify-around p-2">
                    {smItems.map(item => (
                        <Link to={item.slug}>

                            <Button
                                key={item.label}
                                className="flex flex-col items-center gap-1 text-xs hover:text-purple-400"
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
