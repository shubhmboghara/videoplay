import React, { useEffect, useState } from "react";
import { useProfileApi } from "../hooks/profile";
export default function Profile({ username, loggedInUser }) {
  const api = useProfileApi();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    api.getProfile(username).then(setProfile);
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

  if (!profile) return <div>Loading...</div>;

  const isOwner = loggedInUser?.username === profile.username;

  return (
    <div>
      <div>
        <img src={profile.coverImage} alt="cover" style={{ width: "100%" }} />
        <img
          src={profile.avatar}
          alt="avatar"
          style={{ width: 100, borderRadius: "50%", cursor: "pointer" }}
          onClick={() => window.location.href = `/profile/${profile.username}`}
        />
        <h2>{profile.fullname} (@{profile.username})</h2>
        <p>Subscribers: {profile.subscribersCount}</p>
        <p>Subscribed: {profile.channelsSubscribedToCount}</p>
        {isOwner && (
          <div>
            <button>Update Avatar</button>
            <button>Update Cover</button>
          </div>
        )}
      </div>
      <div>
        {isOwner && (
          <div>
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)} />
            <button onClick={handleCreatePost}>Post</button>
          </div>
        )}
        <h3>Posts</h3>
        {posts.map(post => (
          <div key={post._id} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
            <p>{post.content}</p>
            <div>
              <span>Likes: {post.likeby.length}</span>
              <button onClick={() => handleLikePost(post._id)}>Like</button>
              {isOwner && (
                <>
                  <button onClick={() => handleUpdatePost(post._id, prompt("Edit post:", post.content))}>Edit</button>
                  <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}