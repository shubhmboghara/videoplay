import React, { useEffect, useState } from "react";
import { useProfileApi } from "../hooks/profile";
import { useParams, useNavigate } from "react-router-dom";
import DefaultAvatar from "../assets/DefaultAvatar.png";
import Button from "./Button";
import Input from "./Input";
import { getChannelVideos } from "../hooks/getdashboard";
import VideoCard from "./VideoCard";

export default function Profile({ username: propUsername, loggedInUser }) {
  const { id: routeUsername } = useParams();
  const username = propUsername || routeUsername;
  const api = useProfileApi();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [videos, setVideos] = useState();

  useEffect(() => {
    api.getProfile(username).then(setProfile);
    getChannelVideos().then((videosResponse) => {
      setVideos(videosResponse.data);
    });
  }, [username]);

  useEffect(() => {
    if (profile?._id) {
      api.getUserPosts(profile._id).then(setPosts);
    }
  }, [profile]);

  const handleCreatePost = async () => {
    if (!newPost) return;
    const post = await api.createPost(newPost, profile._id);
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleDeletePost = async (id) => {
    await api.deletePost(id);
    setPosts(posts.filter((p) => p._id !== id));
  };

  const handleUpdatePost = async (id, content) => {
    const updated = await api.updatePost(id, content);
    setPosts(posts.map((p) => (p._id === id ? updated : p)));
  };

  const handleLikePost = async (id) => {
    const updated = await api.likePost(id);
    setPosts(posts.map((p) => (p._id === id ? updated : p)));
  };

  if (!profile) return <div className="flex justify-center items-center h-96 text-xl text-gray-400">Loading profile...</div>;

  const isOwner = loggedInUser?.username === profile.username;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-[#18181b] rounded-xl shadow-lg overflow-hidden border border-gray-800">
      <div className="relative h-48 bg-gray-900">
        <img
          src={profile.coverImage || "https://via.placeholder.com/800x200.png?text=No+Cover"}
          alt="cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute left-6 -bottom-12 flex items-end gap-4">
          <img
            src={profile.avatar || DefaultAvatar}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-purple-500 object-cover bg-[#23232b] shadow-xl cursor-pointer"
            onClick={() => window.location.href = `/profile/${profile.username}`}
          />
          <div className="flex flex-col gap-1 mt-12">
            <span className="text-2xl font-bold text-white">{profile.fullname}</span>
            <span className="text-purple-400 text-lg font-mono">@{profile.username}</span>
            <div className="flex gap-4 text-gray-400 text-sm mt-1">
              <span><b>{profile.subscribersCount}</b> Subscribers</span>
              <span><b>{profile.channelsSubscribedToCount}</b> Subscribed</span>
            </div>
          </div>
        </div>
      </div>
      {isOwner && (
        <div className="flex gap-4 justify-end p-6 pt-16">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Update Avatar</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Update Cover</Button>
        </div>
      )}
      <div className="p-6 pt-2">
        {isOwner && (
          <div className="mb-6 flex flex-col gap-2">
            <Input
              as="textarea"
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-[#23232b] border-2 border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 p-3 rounded-lg text-white resize-none placeholder-gray-400 transition-all shadow-md focus:shadow-lg"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-800 hover:to-purple-600 transition-all disabled:opacity-60"
                disabled={!newPost.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        )}
        <h3 className="text-xl font-bold text-white mb-4">Posts</h3>
        {posts.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No posts yet.</div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post._id} className="bg-[#23232b] rounded-lg p-4 shadow border border-purple-900/10 hover:shadow-purple-900/20 transition-all group">
                <p className="text-white text-base mb-2 whitespace-pre-line">{post.content}</p>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span>Likes: {post.likeby.length}</span>
                  <Button onClick={() => handleLikePost(post._id)} className="text-purple-400 hover:text-purple-600">Like</Button>
                  {isOwner && (
                    <>
                      <Button onClick={() => handleUpdatePost(post._id, prompt("Edit post:", post.content))} className="text-blue-400 hover:text-blue-600">Edit</Button>
                      <Button onClick={() => handleDeletePost(post._id)} className="text-red-400 hover:text-red-600">Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 pt-2">
        <h3 className="text-xl font-bold text-white mb-4">Videos</h3>
        {Array.isArray(videos) && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {videos.map(video => (
              <VideoCard
                key={video._id}
                id={video._id}
                thumbnail={video.thumbnail}
                title={video.title}
                channel={profile.username}
                avatar={profile.avatar}
                views={video.views}
                time={video.createdAt}
                duration={video.duration || 0} 
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">No videos found.</div>
        )}
      </div>
    </div>
  );
}