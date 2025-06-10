import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileApi } from "../hooks/profile";
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
  const [videos, setVideos] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    api.getProfile(username).then(setProfile);
    getChannelVideos().then((res) => setVideos(res.data));
  }, [username]);

  useEffect(() => {
    if (profile?._id) {
      api.getUserPosts(profile._id).then(setPosts);
    }
  }, [profile]);

  const isOwner = loggedInUser?.username === profile?.username;

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    const updated = await api.updateAvatar(formData);
    setProfile({ ...profile, avatar: updated.avatar });
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("coverImage", file);
    const updated = await api.updateCoverImage(formData);
    setProfile({ ...profile, coverImage: updated.coverImage });
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96 text-xl text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-[#1f1f25] rounded-xl shadow-xl overflow-hidden border border-gray-800">
      {/* Banner */}
      <div className="relative h-52 bg-gray-900">
        <img
          src={profile.coverImage || "https://via.placeholder.com/800x200.png?text=No+Cover"}
          alt="cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute left-6 -bottom-14 flex items-end gap-4">
          <label htmlFor="avatarUpload">
            <img
              src={profile.avatar || DefaultAvatar}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-purple-600 bg-[#23232b] object-cover shadow-lg cursor-pointer"
              title="Click to change avatar"
            />
          </label>
          <input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

          <div className="mt-16 text-white">
            <h2 className="text-2xl font-bold">{profile.fullname}</h2>
            <p className="text-purple-400 font-mono">@{profile.username}</p>
            <div className="text-gray-400 text-sm mt-1 flex gap-6">
              <span><strong>{profile.subscribersCount}</strong> Subscribers</span>
              <span><strong>{profile.channelsSubscribedToCount}</strong> Subscribed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Upload Button */}
      {isOwner && (
        <div className="flex justify-end px-6 pt-20">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
            Update Cover
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>
      )}

      {/* Posts */}
      <div className="px-6 pb-10 pt-6">
        {isOwner && (
          <div className="mb-6">
            <Input
              as="textarea"
              rows={3}
              value={newPost}
              maxLength={500}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-[#2a2a33] text-white border-2 border-purple-700 focus:ring-2 focus:ring-purple-500 p-3 rounded-lg resize-none placeholder-gray-400 shadow-md focus:shadow-lg"
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:from-purple-800 hover:to-purple-600"
              >
                Post
              </Button>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-4">Posts</h3>
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-[#292932] rounded-lg p-4 border border-purple-900/20 hover:shadow-md transition"
              >
                <p className="text-white mb-3 whitespace-pre-line">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Likes: {post.likeby.length}</span>
                  <Button onClick={() => handleLikePost(post._id)} className="text-purple-400 hover:text-purple-600">Like</Button>
                  {isOwner && (
                    <>
                      <Button onClick={() => {
                        const updated = prompt("Edit post:", post.content);
                        if (updated) handleUpdatePost(post._id, updated);
                      }} className="text-blue-400 hover:text-blue-600">Edit</Button>
                      <Button onClick={() => handleDeletePost(post._id)} className="text-red-400 hover:text-red-600">Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos */}
      <div className="px-6 pb-10">
        <h3 className="text-xl font-bold text-white mb-4">Videos</h3>
        {Array.isArray(videos) && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
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
          <p className="text-center text-gray-400 py-6">No videos found.</p>
        )}
      </div>
    </div>
  );
}
