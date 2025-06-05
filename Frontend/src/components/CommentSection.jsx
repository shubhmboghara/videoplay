// src/components/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import {
  addComment,
  getVideoComments,
  deleteComment,
  updateComment,
  } from '../hooks/comments';
import { HiTrash, HiPencil, HiCheck, HiX, HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import { toggleLike } from '../hooks/toggleLike';

export default function CommentSection({ videoId, showPopup }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  

  useEffect(() => {
    async function fetchComments() {
      try { 
        const res = await getVideoComments(videoId);
        setComments(res.data.data.comments);
      } catch (err) {
        console.error('Error loading comments:', err);
      showPopup('Failed to load comments.', 'error');
      }
    }
    if (videoId) {
      fetchComments();
      setShowAllComments(false);
      window.scrollTo(0, 0);
    }
  }, [videoId]);

  const handlePostComment = async () => {
    console.log('▶️ handlePostComment clicked, newComment =', newComment);
    if (!newComment.trim()) {
      ('✋ newComment is empty, doing nothing.');
      return;
    }

    try {

      const res = await addComment(videoId, { content: newComment });

      setComments([res.data.data, ...comments]);
      setNewComment('');
      setShowAllComments(true);
      showPopup('Comment posted successfully!', 'success');
    } catch (err) {
      console.error('Error posting comment:', err);
      showPopup('Failed to post comment.', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      showPopup('Comment deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting comment:', err);
      showPopup('Failed to delete comment.', 'error');
    }
  };

  const handleStartEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };
  const handleCancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
  };
  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const res = await updateComment(commentId, { content: editContent });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.data : c))
      );
      setEditingCommentId(null);
      setEditContent('');
      showPopup('Comment updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating comment:', err);
      showPopup('Failed to update comment.', 'error');
    }
  };

  const displayAll = !window.matchMedia('(max-width: 1023px)').matches || showAllComments;
  const displayedComments = displayAll ? comments : comments.slice(0, 1);

  return (
    <div className="mt-10 max-w-4xl mx-auto px-4">
      <div
        className="flex items-center justify-between cursor-pointer lg:cursor-default"
        onClick={() => {
          if (window.matchMedia('(max-width: 1023px)').matches) {
            setShowAllComments((prev) => !prev);
          }
        }}
      >
        <h2 className="text-xl font-medium">
          {comments.length > 0
            ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}`
            : 'No comments yet'}
        </h2>
        <span className="text-2xl text-gray-400 lg:hidden">
          {showAllComments ? '▲' : '▼'}
        </span>
      </div>

      <div className={`${displayAll ? 'block' : 'hidden'} lg:block`}>
        <div className="mt-4 space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-md text-white resize-none"
            rows={3}
            placeholder="Add a comment…"
          />
          <button
            onClick={handlePostComment}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            Post
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {comments.map((c) => (
            <div key={c._id} className="flex items-start gap-4">
              <img
                src={c.owner.avatar || '/default-avatar.png'}
                alt={c.owner.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-white">
                    {c.owner.username}
                    <span className="text-gray-400 text-xs ml-2">
                      •{' '}
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <button
                      onClick={async () => {
                        try {
                          const res = await toggleLike('comment', c._id);
                          setComments((prev) =>
                            prev.map((comment) =>
                              comment._id === c._id
                                ? { ...comment, isLiked: res.isLiked, likesCount: res.likesCount }
                                : comment
                            )
                          );
                          showPopup(res.isLiked ? 'Comment liked!' : 'Comment unliked!', 'success');
                        } catch (error) {
                          console.error('Error toggling like on comment:', error);
                          showPopup('Failed to toggle like on comment.', 'error');
                        }
                      }}
                      className="hover:text-blue-500"
                      title="Like"
                    >
                      {c.isLiked ? (
                        <HiThumbUp size={16} className="text-blue-500" />
                      ) : (
                        <HiOutlineThumbUp size={16} />
                      )}
                      <span className="ml-1 text-xs">{c.likesCount}</span>
                    </button>
                    <button
                      onClick={() => handleStartEditing(c)}
                      className="hover:text-blue-500"
                      title="Edit"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="hover:text-red-500"
                      title="Delete"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>

                {editingCommentId === c._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(c._id)}
                        className="text-green-500 hover:text-green-600"
                        title="Save"
                      >
                        <HiCheck size={20} />
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="text-red-400 hover:text-red-500"
                        title="Cancel"
                      >
                        <HiX size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm mt-1">{c.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {!displayAll && (
        <div className="mt-6 space-y-6 lg:hidden">
          {comments.slice(0, 1).map((c) => (
            <div key={c._id} className="flex items-start gap-4">
              <img
                src={c.owner.avatar || '/default-avatar.png'}
                alt={c.owner.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-white">
                    {c.owner.username}
                    <span className="text-gray-400 text-xs ml-2">
                      •{' '}
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <button
                      onClick={async () => {
                        try {
                          const res = await toggleLike('comment', c._id);
                          setComments((prev) =>
                            prev.map((comment) =>
                              comment._id === c._id
                                ? { ...comment, isLiked: res.isLiked, likesCount: res.likesCount }
                                : comment
                            )
                          );
                          showPopup(res.isLiked ? 'Comment liked!' : 'Comment unliked!', 'success');
                        } catch (error) {
                          console.error('Error toggling like on comment:', error);
                          showPopup('Failed to toggle like on comment.', 'error');
                        }
                      }}
                      className="hover:text-blue-500"
                      title="Like"
                    >
                      {c.isLiked ? (
                        <HiThumbUp size={16} className="text-blue-500" />
                      ) : (
                        <HiOutlineThumbUp size={16} />
                      )}
                      <span className="ml-1 text-xs">{c.likesCount}</span>
                    </button>
                    <button
                      onClick={() => handleStartEditing(c)}
                      className="hover:text-blue-500"
                      title="Edit"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="hover:text-red-500"
                      title="Delete"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>

                {editingCommentId === c._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-white"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(c._id)}
                        className="text-green-500 hover:text-green-600"
                        title="Save"
                      >
                        <HiCheck size={20} />
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="text-red-400 hover:text-red-500"
                        title="Cancel"
                      >
                        <HiX size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm mt-1">{c.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
