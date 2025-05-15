import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import folder from "../assets/folder.png"
import { HiOutlineThumbUp, HiOutlineThumbDown, HiUsers } from "react-icons/hi";


export default function VideoDetails() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);

    useEffect(() => {
        fetch('/mockVideos.json')
            .then(res => res.json())
            .then(data => {
                const selected = data.find(v => v.id === id);
                setVideo(selected);
            });
    }, [id]);

    if (!video) return <p className="text-white p-4">Loading...</p>;

    return (
        <>
            <Sidebar className="relative bottom-4  " />

            <div>
                <div className="p-4 text-white mt- m-20  relative  lg:left-5 right-20">
                    <iframe
                        src={video.videoUrl}
                        title={video.title}
                        className=" w-200  h-96 rounded-lg "
                        allowFullScreen
                    ></iframe>

                    <div className="border w-200 mt-5 p-5  rounded-2xl  " >
                        <div className='flex    '>
                            <h2 className="text-xl font-bold mt-4">{video.title}</h2>

                            
                            <span className='relative top-2 left-45  flex  gap-10 border w-30 p-2 rounded-lg   '>

                                <button>
                                    <HiOutlineThumbUp size={25} />
                                </button>

                                <button>
                                    <HiOutlineThumbDown size={25} />
                                </button>
                            </span>

                            <div className="w-24 relative left-55 top-2">
                                <button className="bg-white text-gray-700 w-full py-2 px-3 flex items-center gap-2 rounded">
                                    <img src={folder} alt="folder" className="w-6 h-6" />
                                    <span className="text-sm font-medium">Save</span>
                                </button>
                            </div>



                        </div>


                        <div className='mt-5'>
                            <img
                                src={video.dp}
                                alt={` dp`}
                                className="h-10 rounded-full flex-shrink-0 top-10 relative"
                            />
                        </div>
                        <p className="text-gray-400 mt-2 relative left-13 bottom-2">{video.channel}</p>
                        <p className="text-gray-500 text-sm  relative left-12 bottom-2 ">{video.views} • {video.time} ago</p>

                        <button className='relative  bottom-15 left-160 bg-[#6f50a2] txt-white w-25 h-10 rounded-md p-2'>
                            <HiUsers size={30} />
                            <span className='relative bottom-7 left-5'>Follow</span>
                        </button>

                        <div className='border-b relative  bottom-12'></div>

                          <div className="">
                             <p>{video.description}</p>
                          </div>


                    </div>


                </div>

                <div>

                </div>

            </div>
        </>
    );
}
