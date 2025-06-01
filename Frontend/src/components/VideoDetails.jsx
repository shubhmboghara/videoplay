import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiEye,
  HiCalendar,
  HiThumbUp,
  HiThumbDown,
  HiShare,
  HiDownload,
  HiUsers
} from 'react-icons/hi';
import Sidebar from './Sidebar'; 
import { Button, VideoCard } from './index'; 
import { useVideo } from '../hooks/useVideos';
import CommentSection from './CommentSection';
import { toggleLike } from '../hooks/toggleLike';
import { getLikeCount } from '../hooks/getLikeCount';
import { addVideoLike, removeVideoLike } from '../redux/slices/likesSlice';

export default function VideoDetails() {
  const { id } = useParams();
  const { video, videos, loading, error } = useVideo(id);
  const dispatch = useDispatch();

  const likedvideos = useSelector(state => state.likes.likedVideos);
  const isLikedInStore = likedvideos.includes(id);

  const [likeLoading, setLikeLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);



  useEffect(() => {

    if (!video) {
      console.log("6. Video object is null/undefined in useEffect, returning early.");
      return;
    }
    if (video.isLikedByUser) {
      dispatch(addVideoLike(id));
    } else {
      dispatch(removeVideoLike(id));
    }

    getLikeCount("video", id)
      .then(count => {
        setLikesCount(count);
        console.log(`10. Fetched initial like count for ID: ${id}: ${count}`);
      })
      .catch(err => console.error("Error fetching initial like count:", err));

  }, [video, id, dispatch]);


  const handleVideoLike = async () => {
    if (likeLoading) return; 

    setLikeLoading(true); 
    try {
      const res = await toggleLike('video', id);      const isNowLiked = res?.data?.newLike;

      console.log(`11. Backend response from toggleLike - newLike: ${isNowLiked}`);

      if (isNowLiked) {
        dispatch(addVideoLike(id));
      } else {
        dispatch(removeVideoLike(id));
      }

      const updatedCount = await getLikeCount('video', id);
      setLikesCount(updatedCount);
      console.log(`14. Updated like count to ${updatedCount}`);

    } catch (err) {
      console.error('Video like failed:', err);
    } finally {
      setLikeLoading(false); 
    }
  };


  if (loading || !video || !video.owner) {
    return <p className="text-white p-4 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-4">Error loading video.</p>;
  }

  return (
    <div className="flex min-h-screen bg-[#18181b]">
      <main className="flex-1 p-6 text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <iframe
              src={video.VideoFile}
              title={video.title}
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="p-6 rounded-xl border border-gray-800">
            <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
            <div className="flex items-center justify-between text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <HiEye className="h-4 w-4" />
                  <span>{video.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiCalendar className="h-4 w-4" />
                  <span>{video.timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={likeLoading}
                  onClick={handleVideoLike}
                  className={`inline-flex items-center gap-1 px-3 h-9 rounded-md ${
                    isLikedInStore 
                      ? 'bg-purple-600 text-white'
                      : 'border border-gray-600 text-white hover:bg-gray-800'
                  } text-sm disabled:opacity-50 ${likeLoading ? 'pointer-events-none' : ''}`}
                >
                  <HiThumbUp className="h-4 w-4" />
                  {likeLoading ? '...' : isLikedInStore ? "Liked" : "Like"} ({likesCount})
                </button>

                <button className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm">
                  <HiThumbDown className="h-4 w-4" /> Dislike
                </button>
                <button className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm">
                  <HiShare className="h-4 w-4" /> Share
                </button>
                <button className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm">
                  <HiDownload className="h-4 w-4" /> Save
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-medium">{video.owner.username}</h2>
                <p className="text-sm text-gray-400">
                  {video.owner.subscriberCount} subscribers
                </p>
              </div>
              <Button className="ml-auto bg-purple-700 flex items-center gap-2 px-4 py-2 rounded">
                <HiUsers size={20} />
                <span>Subscribe</span>
              </Button>
            </div>

            <p className="mt-6 text-gray-300">{video.description}</p>
          </div>

          <CommentSection videoId={id} />
        </div>

        <aside className="mt-10 bg-[#18181b] lg:hidden">
          {videos?.length ? (
            videos.map((vid) => (
              <VideoCard
                key={vid._id}
                id={vid._id}
                thumbnail={vid.thumbnail}
                title={vid.title}
                channel={vid.owner.username}
                avatar={vid.owner.avatar}
                views={vid.views}
                time={vid.timeAgo}
                duration={vid.duration}
              />
            ))
          ) : (
            <p className="text-gray-500">No suggestions yet.</p>
          )}
        </aside>
      </main>

      <aside className="hidden lg:block  p-4 space-y-4 bg-[#18181b] w-80 mr-15">
        {videos?.length ? (
          videos.map((vid) => (
            <VideoCard
              classNameImg="w-full"
              key={vid._id}
              id={vid._id}
              thumbnail={vid.thumbnail}
              title={vid.title}
              channel={vid.owner.username}
              avatar={vid.owner.avatar}
              views={vid.views}
              time={vid.timeAgo}
              duration={vid.duration}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-60">No suggestions yet.</p>
        )}
      </aside>
    </div>
  );
}