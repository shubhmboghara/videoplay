import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import folder from "../assets/folder.png"
import { Button, Input,VideoCard } from './index'
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

            <div className='relative  lg:left-5 right-20 top-[8px] bottom-[8px]'>
                <div className="p-4 text-white mt- m-20   w-[857.33px] h-[1488px ]  gap-24px ">
                    <iframe
                        src={video.videoUrl}
                        title={video.title}
                        className="   rounded-[8px]  m-2 mb-2  w-[857.33px] h-[380px]"
                        allowFullScreen
                    ></iframe>

                    <div className="border-[1px]    w-[857.33px] mt-5  rounded-[16px] p-[24px] relative  left-2" >
                        <div className='flex    '>
                            <h2 className="text-xl font-bold mt-4">{video.title}</h2>


                            <span className='relative top-2 left-60  flex  gap-10 border w-30  rounded-lg   '>

                                <Button>
                                    <HiOutlineThumbUp size={25} />
                                </Button>

                                <Button>
                                    <HiOutlineThumbDown size={25} />
                                </Button>
                            </span>

                            <div className="w-24 relative left-65 top-2">
                                <Button className="bg-white text-gray-700 w-full py-2 px-3 flex items-center gap-2 rounded">
                                    <img src={folder} alt="folder" className="w-6 h-6" />
                                    <span className="text-sm font-medium text-black">Save</span>
                                </Button>
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

                        <Button className='relative  bottom-15 left-173 bg-[#6f50a2] txt-white w-25 h-10 rounded-md p-2'>
                            <HiUsers size={30} />
                            <span className='relative bottom-7 left-5'>Follow</span>
                        </Button>

                        <div className='border-b relative  bottom-12'></div>

                        <div className="">
                            <p>{video.description}</p>
                        </div>

                    </div>

                </div>

                <div className="mt-1 border w-[857.33px]  text-white  rounded-[16px] p-[24px] flex gap-[24px] relative left-25  bottom-15">
                    <div className="">
                        <span> counts api : Comments</span>

                        <div>

                            <textarea
                                className="text-white bg-transparent border w-[50rem] p-2 rounded resize-none overflow-hidden"
                                placeholder="Add a comment"
                                rows={2}
                            />
                            <Button className="mt-2 bg-[#6f50a2] text-white px-4 py-1 rounded my-2">Post</Button>
                        </div>

                        <div className="border-b"></div>
                        <div className="mt-5 ">
                            {video.comments?.length > 0 ? (
                                video.comments.map((comment) => (
                                    <div key={comment.id} className="mb-4 flex items-start gap-4  border-b p-2 ">
                                        <img
                                            src={comment.avatar}
                                            alt={comment.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className='mb-3'>
                                            <p className="text-sm font-semibold">
                                                {comment.name}
                                                <span className="text-gray-400 text-xs ml-2">
                                                    {comment.username} • {comment.time}
                                                </span>
                                            </p>
                                            <p className="text-gray-300 text-sm">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No comments yet.</p>
                            )}
                        </div>

                    </div>

                </div>
                   

                   <div className="relative left-80">
                       <VideoCard />
                      
                   </div>
            </div>
        </>
    );
}
