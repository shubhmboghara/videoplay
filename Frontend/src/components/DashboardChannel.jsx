import React, { useEffect, useState } from 'react';
import { getChannelStats, getChannelVideos, togglePublishStatus } from '../hooks/getdashboard';
import { deleteVideo, updateVideo } from '../hooks/video';
import Loader from './Loader';
import UploadVideoModal from './UploadVideoModal';
import EditVideoModal from './EditVideoModal';
import {
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import { HiUserGroup } from 'react-icons/hi';
import AuthLoader from './AuthLoader';

function DashboardChannel({ showPopup }) {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const fetchData = async () => {
    try {
      const statsResponse = await getChannelStats();
      setStats(statsResponse.data);

      const videosResponse = await getChannelVideos();
      setVideos(videosResponse.data);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      showPopup('error', 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePublish = async (videoId) => {
    try {
      await togglePublishStatus(videoId);
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video._id === videoId ? { ...video, isPublished: !video.isPublished } : video
        )
      );
      showPopup('success', 'Publish status toggled successfully!');
    } catch (err) {
      showPopup('error', 'Failed to toggle publish status.');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(videoId);
        setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
        showPopup('success', 'Video deleted successfully!');
      } catch (err) {
        showPopup('error', 'Failed to delete video.');
      }
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setIsEditModalOpen(true);
  };

  const handleUpdateVideo = async (videoId, updatedData) => {
    try {
      await updateVideo(videoId, updatedData);
      setIsEditModalOpen(false);
      setEditingVideo(null);
      fetchData();
      showPopup('success', 'Video updated successfully!');
    } catch (err) {
      showPopup('error', 'Failed to update video.');
    }
  };

  const handleUploadVideo = () => {
    setIsUploadModalOpen(true);
  };

  const handleVideoUploaded = () => {
    fetchData();
    setIsUploadModalOpen(false);
  };

  const handleVideoUpdated = () => {
    fetchData();
    setIsEditModalOpen(false);
    setEditingVideo(null);
  };

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white p-8 relative lg:left-68 lg:w-300">
      <h1 className="text-3xl font-bold mb-8">Welcome bac   </h1>
      <p className="text-gray-400 mb-8">Track, manage and forecast your channel.</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <AiOutlineEye className="h-6 w-6 text-blue-400" />

          <p className="text-gray-400 text-lg">Total Views </p>
          <p className="text-3xl font-bold">{stats?.totalViews || 0}</p>
        </div>
        <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <HiUserGroup className="h-6 w-6 text-green-400" />

          <p className="text-gray-400 text-lg">Total Subscribers</p>
          <p className="text-3xl font-bold">{stats?.totalSubscribers || 0}</p>
        </div>
        <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <AiOutlineLike className="h-6 w-6 text-pink-400" />
          <p className="text-gray-400 text-lg">Total Likes</p>
          <p className="text-3xl font-bold">{stats?.totalLikes || 0}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Videos</h2>
        <button
          onClick={handleUploadVideo}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Video
        </button>
      </div>

      <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Uploaded Videos</h2>
        <div>
          <table className="min-w-[768px] md:min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {videos.map(video => (
                <tr key={video._id} className="hover:bg-[#33333b]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={video.isPublished}
                        onChange={() => handleTogglePublish(video._id)}
                      />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${video.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {video.isPublished ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={video.thumbnail} alt={video.title} className="w-10 h-10 rounded-full object-cover mr-4" />
                      <span className="text-sm font-medium text-white">{video.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{video.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                    <button onClick={() => handleDeleteVideo(video._id)} className="text-purple-400 hover:text-purple-500 mr-3">
                      <TrashIcon className="w-5 h-5  text-gray-420" />

                    </button>

                    <button onClick={() => handleEditVideo(video)} className="text-purple-400 hover:text-purple-600">
                      <PencilSquareIcon className="w-5 h-5 text-blue-600 cursor-pointer" />

                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isUploadModalOpen && (
        <div className='realtive'>
          <UploadVideoModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onVideoUploaded={handleVideoUploaded}
          />
        </div>

      )}

      {isEditModalOpen && editingVideo && (
        <EditVideoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          video={editingVideo}
          onVideoUpdated={handleVideoUpdated}
        />
      )}
    </div>
  );
}

export default DashboardChannel;