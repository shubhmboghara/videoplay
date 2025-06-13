import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileApi } from "../hooks/profile";
import { DefaultAvatar, Button, Input, VideoCard, DefaultCoverImage, Loader, SubscribeButton } from "./index";
import { Tab } from "@headlessui/react";
import { toggleLike } from "../hooks/toggleLike";
import { getLikeCount } from "../hooks/getCount";

export default function Profile({ username: propUsername, loggedInUser }) {
  const { id: routeUsername } = useParams();
  const username = propUsername || routeUsername;
  const api = useProfileApi();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {

    api.getProfile(username).then(setProfile);
  }, [username]);

  const getUserPosts = () => {
    if (profile?._id) {
      api.getUserPosts(profile._id).then(fetchedPosts => {
        setPosts(fetchedPosts);
      });
    }
  };
  useEffect(() => {
    const fetchLikeCounts = async () => {
      if (posts.length > 0) {
        const counts = {};
        await Promise.all(posts.map(async (post) => {
          counts[post._id] = await getLikeCount('post', post._id);
        }));
        setLikeCounts(counts);
      } else {
        setLikeCounts({});
      }
    };
    fetchLikeCounts();

    getUserPosts()
  }, [posts]);

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
    try {
      const { isLiked } = await toggleLike('post', id);
      setPosts(posts.map((p) =>
        p._id === id ? { ...p, isLiked: isLiked } : p
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
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

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditText(post.content);
  };

  const handleEditCancel = () => {
    setEditingPostId(null);
    setEditText("");
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    await handleUpdatePost(id, editText);
    setEditingPostId(null);
    setEditText("");
    getUserPosts();
  };



  useEffect(() => {
    if (profile?._id) {
      getUserPosts();
      api.getideoByuser(profile._id).then((res = {}) => {
        const videos = res.videos || [];
        setVideos(videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
    }
  }, [profile?._id]);



  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96 text-xl text-gray-400">
        <Loader message="Loading profile..." />
      </div>
    );
  }

  const channelDescription = profile?.bio || "This user hasn't added a channel description yet.";
  const socialLinks = profile?.socialLinks || [];

  return (
    <div className="max-w-356 mx-auto mt-10 rounded-xl shadow-xl overflow-hidden relative xl:left-33">
      <div className="relative h-52 bg-gradient-to-r from-[#23232b] to-[#1f1f25]">
        <img
          src={profile.coverImage || DefaultCoverImage}
          alt="cover"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute left-6 -bottom-14 flex items-end gap-6">
          {isOwner ? (
            <>
              <label htmlFor="avatarUpload" className="relative group">
                <img
                  src={profile.avatar || DefaultAvatar}
                  alt="avatar"
                  className="w-42 h-32 rounded-full border-4 border-purple-600 bg-[#23232b] object-cover shadow-xl cursor-pointer group-hover:brightness-90 transition"
                  title="Click to change avatar"
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Change</span>
              </label>
              <input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </>
          ) : (
            <img
              src={profile.avatar || DefaultAvatar}
              alt="avatar"
              className="w-42 h-30 rounded-full border-4 border-purple-600 bg-[#23232b] object-cover shadow-xl"
            />
          )}
          <div className="mt-20 text-white flex flex-col gap-2 w-full">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold break-all">{profile.fullname || profile.username}</h2>
              {isOwner && <span className="bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">You</span>}
            </div>
            <p className="text-purple-400 font-mono break-all">@{profile.username}</p>
            <div className="text-gray-400 text-sm flex gap-6 flex-wrap">
              <span><strong>{profile.subscribersCount}</strong> Subscribers</span>
              <span><strong>{profile.channelsSubscribedToCount}</strong> Subscribed</span>
            </div>
            <div className="mt-2 text-gray-300 text-sm max-w-2xl break-words">{channelDescription}</div>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-2">
                {socialLinks.map((link, i) => (
                  <a key={link.url || i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                    <span>{link.icon ? <img src={link.icon} alt="" className="w-4 h-4 inline" /> : null}</span>
                    {link.label || link.url}
                  </a>
                ))}
              </div>
            )}
            {!isOwner && (
              <div className="mt-2">
                <SubscribeButton
                  channelId={profile._id}
                  isSubscribed={profile.isSubscribed}
                  loggedInUser={loggedInUser}
                  onSubscribeChange={() => api.getProfile(username).then(setProfile)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="flex justify-end px-6 pt-20">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
            Update Cover
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>
      )}

      <div className="px-6 pt-8">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex gap-4 border-b border-gray-700 mb-6">
            <Tab className={({ selected }) =>
              `px-4 py-2 text-lg font-semibold focus:outline-none transition border-b-2 ${selected ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`
            }>Videos</Tab>
            <Tab className={({ selected }) =>
              `px-4 py-2 text-lg font-semibold focus:outline-none transition border-b-2 ${selected ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`
            }>Posts</Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
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
            </Tab.Panel>
            <Tab.Panel>
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
                    <div key={post._id} className="bg-[#292932] rounded-lg p-4 border border-purple-900/20 hover:shadow-md transition">
                      {editingPostId === post._id ? (
                        <>
                          <Input
                            as="textarea"
                            rows={3}
                            value={editText}
                            maxLength={500}
                            onChange={e => setEditText(e.target.value)}
                            className="w-full bg-[#23232b] text-white border-2 border-purple-700 focus:ring-2 focus:ring-purple-500 p-3 rounded-lg resize-none placeholder-gray-400 shadow-md focus:shadow-lg mb-2"
                          />
                          <div className="flex gap-2 justify-end mb-2">
                            <Button onClick={() => handleEditSave(post._id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">Save</Button>
                            <Button onClick={handleEditCancel} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded">Cancel</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-white mb-3 whitespace-pre-line">{post.content}</p>
                        </>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                        <span>Likes: {likeCounts[post._id] ?? (post.likeby ? post.likeby.length : 0)}</span>
                        <Button
                          onClick={() => handleLikePost(post._id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-all duration-200 shadow-sm border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${post.isLiked ? 'bg-red-600 text-white transform scale-105 animate-pulse' : 'bg-gray-800 text-purple-400 hover:bg-purple-700 hover:text-white'}`}
                        >
                          {post.isLiked ? '❤️ Liked' : '♡ Like'}
                        </Button>
                        {isOwner && editingPostId !== post._id && (
                          <div className="flex gap-2">
                            <Button onClick={() => handleEditClick(post)} className="text-blue-400 hover:text-blue-600">Edit</Button>
                            <Button onClick={() => handleDeletePost(post._id)} className="text-red-400 hover:text-red-600">Delete</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}