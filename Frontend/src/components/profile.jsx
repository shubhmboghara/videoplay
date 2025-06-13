import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileApi } from "../hooks/profile";
import {
  DefaultAvatar,
  Button,
  Input,
  VideoCard,
  DefaultCoverImage,
  Loader,
  SubscribeButton,
} from "./index";
import { Tab } from "@headlessui/react";
import { toggleLike } from "../hooks/toggleLike";
import { getLikeCount } from "../hooks/getCount";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);

  useEffect(() => {

    api.getProfile(username).then(fetchedProfile => {
      console.log("Fetched profile:", fetchedProfile);
      setProfile(fetchedProfile);
    });
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

  }, [posts]);



  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    const post = await api.createPost(newPost, profile._id);
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleDeletePost = async (id) => {
    setPostToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (postToDeleteId) {
      await api.deletePost(postToDeleteId);
      setPosts(posts.filter((p) => p._id !== postToDeleteId));
      setIsDeleteModalOpen(false);
      setPostToDeleteId(null);
    }
  };

  const cancelDeletePost = () => {
    setIsDeleteModalOpen(false);
    setPostToDeleteId(null);
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

  const isOwner = loggedInUser && profile && loggedInUser.username === profile.username;


  const bio = profile.bio || "This user hasn't added a channel description yet.";
  const socials = profile.socialLinks || [];


  return (
    <div className="relative w-full max-w-700 mx-auto   lg:pl-68 ">
      <div className="relative h-60 sm:h-72 bg-gradient-to-r from-gray-700 to-gray-900">
        <img
          src={profile.coverImage || DefaultCoverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-80"
        />
        {isOwner && (
          <label className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
            Change Cover
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </label>
        )}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <label className="relative block group">
            <img
              src={profile.avatar || DefaultAvatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-purple-600 bg-gray-800 object-cover shadow-lg"
            />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Change</span>

            {isOwner && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
              />
            )}
          </label>
        </div>
      </div>

      <div className="mt-16 text-center sm:text-left ml-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
          {profile.fullname || profile.username}
          {isOwner && (
            <span className="ml-2 inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">
              You
            </span>
          )}
        </h1>
        <p className="text-purple-400 font-mono mt-1 break-words">
          @{profile.username}
        </p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-gray-400 mt-2">
          <span>
            <strong>{profile.subscribersCount}</strong> Subscribers
          </span>
          <span>
            <strong>{profile.channelsSubscribedToCount}</strong> Subscribed
          </span>
        </div>
        <p className="mt-4 text-gray-300 max-w-3xl mx-auto sm:mx-0 break-words">
          {bio}
        </p>
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:underline text-sm"
              >
                {s.icon && <img src={s.icon} alt="" className="w-4 h-4" />}
                <span>{s.label || s.url}</span>
              </a>
            ))}
          </div>
        )}

        {!isOwner && (
          <div className="mt-4">
            <SubscribeButton
              channelId={profile._id}
              isSubscribed={profile.isSubscribed}
              loggedInUser={loggedInUser}
              onSubscribeChange={() => api.getProfile(username).then(setProfile)}
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex justify-center sm:justify-start space-x-4 border-b border-gray-700">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-lg font-semibold transition border-b-2 ${{
                  true: 'border-purple-500 text-purple-300',
                  false: 'border-transparent text-gray-400 hover:text-white',
                }[selected]}`
              }
            >
              Videos
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-lg font-semibold transition border-b-2 ${{
                  true: 'border-purple-500 text-purple-300',
                  false: 'border-transparent text-gray-400 hover:text-white',
                }[selected]}`
              }
            >
              Posts
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {videos.map((v) => (
                    <VideoCard
                      key={v._id}
                      id={v._id}
                      thumbnail={v.thumbnail}
                      title={v.title}
                      channel={profile.username}
                      avatar={profile.avatar}
                      views={v.views}
                      time={v.createdAt}
                      duration={v.duration}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No videos found.</p>
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
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeletePost}
        onDelete={confirmDeletePost}
        itemName="post"
        itemType="post"
      />
    </div>
  );
}