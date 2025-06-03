import React, { useEffect, useState } from 'react';
import { getChannelStats, getChannelVideos, togglePublishStatus } from '../hooks/getdashboard';
import Loader from './Loader';

function DashboardChannel() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await getChannelStats();
        setStats(statsResponse.data);

        const videosResponse = await getChannelVideos();
        setVideos(videosResponse.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

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
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
      alert('Failed to toggle publish status.');
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white p-8 relative lg:left-68 lg:w-300">
      <h1 className="text-3xl font-bold mb-8">Welcome back </h1>
      <p className="text-gray-400 mb-8">Track, manage and forecast your channel .</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <div className="text-purple-400 text-4xl mb-3">👁️</div>
          <p className="text-gray-400 text-lg">Total Views</p>
          <p className="text-3xl font-bold">{stats?.totalViews || 0}</p>
        </div>
        <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <div className="text-purple-400 text-4xl mb-3">👥</div>
          <p className="text-gray-400 text-lg">Total Subscribers</p>
          <p className="text-3xl font-bold">{stats?.totalSubscribers || 0}</p>
        </div>
        <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <div className="text-purple-400 text-4xl mb-3">❤️</div>
          <p className="text-gray-400 text-lg">Total Likes</p>
          <p className="text-3xl font-bold">{stats?.totalLikes || 0}</p>
        </div>
      </div>

      <div className="bg-[#2a2a31] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Uploaded Videos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
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
                    <button className="text-purple-400 hover:text-purple-600 mr-3">🗑️</button>
                    <button className="text-purple-400 hover:text-purple-600">✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardChannel;