import React, { useState, useEffect, useCallback ,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiEye,
  HiCalendar,
  HiThumbUp,
  HiFolderAdd
} from 'react-icons/hi';
import SubscribeButton from './SubscribeButton';
import { Button, VideoCard } from './index';
import Loader from './Loader';
import { timeAgo } from '../utils';
import { useVideo } from '../hooks/useVideos';
import CommentSection from './CommentSection';
import { toggleLike } from '../hooks/toggleLike';
import { getLikeCount } from '../hooks/getLikeCount';
import { addVideoLike, removeVideoLike } from '../redux/slices/likesSlice';
import PlaylistManager from './PlaylistManager';
import SaveToPlaylistDropdown from './SaveToPlaylistDropdown';

export default function VideoDetails({ showPopup }) {
  const { id } = useParams();
  const { video, videos, loading, error } = useVideo(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const likedVideos = useSelector((state) => state.likes.likedVideos);
  const isLikedInStore = likedVideos.includes(id);

  const [likeLoading, setLikeLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const playlistDropdownRef = useRef(null);



  useEffect(() => {
    if (!video) return;

    if (video.isLiked) {
      dispatch(addVideoLike(id));
    } else {
      dispatch(removeVideoLike(id));
    }

    getLikeCount('video', id).then(setLikesCount).catch(console.error);
    setSubscriberCount(Number(video.owner?.subscriberCount || 0));
  }, [video, id, dispatch]);

  const handleVideoLike = useCallback(async () => {
    if (!authStatus) {
      navigate('/login');
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const res = await toggleLike('video', id);
      const isNowLiked = res?.data?.newLike;

      if (isNowLiked && !likedVideos.includes(id)) {
        dispatch(addVideoLike(id));
      } else {
        dispatch(removeVideoLike(id));
      }

      const updatedCount = await getLikeCount('video', id);
      setLikesCount(updatedCount);
    } catch (err) {
      console.error('Video like failed:', err);
      showPopup?.('Failed to toggle like. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  }, [likeLoading, id, dispatch, likedVideos, authStatus]);

  const handleSubscriberCountChange = useCallback((newCount) => {
    setSubscriberCount(newCount);
  }, []);

  const handleSaveClick = () => {
    console.log('handleSaveClick triggered');
    if (!authStatus) {
      navigate('/login');
      showPopup?.('Please log in to save videos.', 'error');
      return;
    }
    setShowPlaylistModal(true);
  };

  const handlePlaylistSelected = (playlistId) => {
    console.log(`Video ${id} selected for playlist ${playlistId}`);
    showPopup?.('Video added to playlist!', 'success');
  };

  if (loading || !video || !video.owner) {
    return <Loader message="Loading video details..." />;
  }
  if (error) {
    return <p className="text-red-500 p-4">Error loading video.</p>;
  }

  return (
    <div className="flex min-h-screen bg-[#18181b] relative">
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
                  <span>{timeAgo(video.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  disabled={likeLoading}
                  onClick={handleVideoLike}
                  className={`
                    inline-flex items-center gap-1 px-3 h-9 rounded-md 
                    transition-all duration-200
                    ${isLikedInStore ? 'bg-purple-600 text-white border-gray-600' : 'border border-gray-600 text-white hover:bg-gray-800'} 
                    text-sm disabled:opacity-50 
                    ${likeLoading ? 'pointer-events-none' : ''}
                  `}
                >
                  <HiThumbUp className="h-4 w-4" />
                  {likeLoading ? '...' : isLikedInStore ? 'Liked' : 'Like'} ({likesCount})
                </Button>

                <div className="relative">
                  <Button
                    onClick={handleSaveClick}
                    className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-gray-600 text-white hover:bg-gray-800 text-sm ml-5"
                  >
                    <HiFolderAdd className="h-4 w-4" /> Save
                  </Button>
                  {showPlaylistModal && (
                    <div ref={playlistDropdownRef} className="absolute top-full left-0 mt-2 z-50 bg-gray-900 p-4 rounded-lg shadow-lg w-80">
                      <PlaylistManager videoId={id} authStatus={authStatus} onPlaylistSelected={handlePlaylistSelected} onClose={() => setShowPlaylistModal(false)} />
                    </div>
                  )}
                </div>
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
                  {subscriberCount} subscriber{subscriberCount === 1 ? '' : 's'}
                </p>
              </div>

              <div className="flex items-center space-x-2 relative lg:left-135">
                <SubscribeButton
                  channelId={video.owner._id}
                  initialSubscribed={video.owner.isSubscribed}
                  currentCount={subscriberCount}
                  onCountChange={handleSubscriberCountChange}
                />
              </div>
            </div>

            <p className="mt-6 text-gray-300">{video.description}</p>
          </div>

          <CommentSection videoId={id} />
        </div>



        <aside className="mt-10 bg-[#18181b] lg:hidden">
          {videos?.length ? (
            videos.map((sugg) => (
              <VideoCard
                key={sugg._id}
                id={sugg._id}
                thumbnail={sugg.thumbnail}
                title={sugg.title}
                channel={sugg.owner.username}
                avatar={sugg.owner.avatar}
                views={sugg.views}
                time={sugg.createdAt}
                duration={sugg.duration}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No suggested videos.</p>
          )}
        </aside>
      </main>

      <aside className="hidden lg:block p-4 space-y-4 bg-[#18181b] w-80 mr-15">
        {videos?.length ? (
          videos.map((sugg) => (
            <VideoCard
              classNameImg="w-full"
              key={sugg._id}
              id={sugg._id}
              thumbnail={sugg.thumbnail}
              title={sugg.title}
              channel={sugg.owner.username}
              avatar={sugg.owner.avatar}
              views={sugg.views}
              time={sugg.createdAt}
              duration={sugg.duration}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-60">No suggestions yet.</p>
        )}
      </aside>

      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-white">Select Playlist</h3>
            <PlaylistManager
              videoId={id}
              authStatus={authStatus}
              onPlaylistSelected={handlePlaylistSelected}
            />
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <SaveToPlaylistDropdown videoId={id} />
    </div>
  );
}

