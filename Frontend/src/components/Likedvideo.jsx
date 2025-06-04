import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getlikedvideos } from '../hooks/getlikedvideos';
import Loader from "./Loader";
import VideoCard from "./VideoCard";

function likedvideo() {

    const userId = useSelector((state) => state.auth.user?._id);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getlikedvideoss = async () => {
            try {
                const res = await getlikedvideos();
                setVideos(res?.data || []);
            } catch (err) {
                console.error("Error loading liked video:", err);
            } finally {
                setLoading(false);
            }
        };

        getlikedvideoss();
    }, []);

    if (loading) return <Loader message="Loading liked videos..." />;
    return (
        <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:ml-65 overflow-hidden">
            <h1 className="text-2xl font-bold mb-4 col-span-full">Liked videos</h1>

            {videos.length === 0 ? (
                <p className="text-center text-gray-400 text-lg col-span-full">
                    No liked video  found.
                </p>
            ) : (
                <>
                    {videos.filter(video => video.video !== null).map((video) => (
                        <div key={video._id}>
                            <VideoCard
                                classNameImg="w-full"
                                key={video.video._id}
                                id={video.video._id}
                                thumbnail={video.video.thumbnail}
                                title={video.video.title}
                                channel={video.video.owner.username}
                                avatar={video.video.owner.avatar}
                                views={video.video.views}
                                time={video.video.createdAt}
                                duration={video.video.duration}
                            />
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default likedvideo