import React, { useState, useEffect } from 'react';
import {
  addComment,
  getVideoComments,
  deleteComment,
  updateComment,
} from '../hooks/comments';
import { HiTrash, HiPencil, HiCheck, HiX, HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import { toggleLike } from '../hooks/toggleLike';
import DefaultAvatar from "../assets/DefaultAvatar.png"
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useSelector } from 'react-redux';

export default function CommentSection({ videoId, showPopup }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const currentUserId = useSelector(state => state.auth?.user?._id);

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
      return;
    }

    try {
      await addComment(videoId, { content: newComment });
      const res = await getVideoComments(videoId);
      setComments(res.data.data.comments);
      setNewComment('');
      setShowAllComments(true);
      showPopup('Comment posted successfully!', 'success');
    } catch (err) {
      console.error('Error posting comment:', err);
      showPopup('Failed to post comment.', 'error');
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      showPopup('Comment deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting comment:', err);
      showPopup('Failed to delete comment.', 'error');
    }
  }

  const handleStartEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  }
  const handleCancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
  }

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

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (commentToDelete) {
      await handleDeleteComment(commentToDelete);
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
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
            className="w-full bg-[#23232b] border-2 border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 p-3 rounded-lg text-white resize-none placeholder-gray-400 transition-all shadow-md focus:shadow-lg"
            rows={3}
            placeholder="Add a comment…"
            maxLength={500}
          />
          <div className="flex justify-end">
            <button
              onClick={handlePostComment}
              className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-800 hover:to-purple-600 transition-all disabled:opacity-60"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {comments.map((c) => (
            <div key={c._id} className="flex items-start gap-4 bg-[#23232b] rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <img
                src={c.owner.avatar && c.owner.avatar.trim() !== '' ? c.owner.avatar : DefaultAvatar}
                alt={c.owner.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-700 shadow"
                onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-base font-semibold text-white flex items-center gap-2">
                      {c.owner.username}
                      <span className="text-gray-400 text-xs ml-2">
                        • {new Date(c.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <button
                      onClick={async () => {
                        try {
                          setComments((prev) =>
                            prev.map((comment) =>
                              comment._id === c._id
                                ? { ...comment, isLiked: !comment.isLiked, likesCount: comment.likesCount + (comment.isLiked ? -1 : 1) }
                                : comment
                            )
                          );
                          await toggleLike('comment', c._id);
                        } catch (error) {
                          console.error('Error toggling like on comment:', error);
                        }
                      }}
                      className={`hover:text-blue-500 flex items-center px-2 py-1 rounded transition ${c.isLiked ? 'bg-blue-900/30' : 'hover:bg-gray-700/40'}`}
                      title="Like"
                    >
                      {c.isLiked ? (
                        <HiThumbUp size={18} className="text-blue-500" />
                      ) : (
                        <HiOutlineThumbUp size={18} />
                      )}
                      <span className="ml-1 text-xs font-medium">
                        {typeof c.likesCount === 'number' && c.likesCount >= 0 ? c.likesCount : ''}
                      </span>
                    </button>
                    {/* Only show edit/delete if current user is owner */}
                    {String(c.owner._id) === String(currentUserId) && (
                      <>
                        <button
                          onClick={() => handleStartEditing(c)}
                          className="hover:text-blue-500 p-1 rounded hover:bg-gray-700/40"
                          title="Edit"
                        >
                          <HiPencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c._id)}
                          className="hover:text-red-500 p-1 rounded hover:bg-gray-700/40"
                          title="Delete"
                        >
                          <HiTrash size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingCommentId === c._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full bg-[#23232b] border-2 border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 p-2 rounded-lg text-white placeholder-gray-400 transition-all shadow-md focus:shadow-lg"
                      maxLength={500}
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => handleSaveEdit(c._id)}
                        className="flex items-center gap-1 text-green-500 hover:text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg font-semibold transition-all shadow"
                        title="Save"
                      >
                        <HiCheck size={18} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="flex items-center gap-1 text-red-400 hover:text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg font-semibold transition-all shadow"
                        title="Cancel"
                      >
                        <HiX size={18} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 text-base mt-2 whitespace-pre-line border-l-4 border-purple-700 pl-3 bg-[#23232b] rounded">
                    {c.content}
                  </p>
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
                src={c.owner.avatar && c.owner.avatar.trim() !== '' ? c.owner.avatar : DefaultAvatar}
                alt={c.owner.username}
                className="w-10 h-10 rounded-full object-cover"
                onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
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
                          setComments((prev) =>
                            prev.map((comment) =>
                              comment._id === c._id
                                ? { ...comment, isLiked: !comment.isLiked, likesCount: comment.likesCount + (comment.isLiked ? -1 : 1) }
                                : comment
                            )
                          );
                          const res = await toggleLike('comment', c._id);

                        } catch (error) {
                          console.error('Error toggling like on comment:', error);
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
                      <span className="ml-1 text-xs">
                        {typeof c.likesCount === 'number' && c.likesCount >= 0 ? c.likesCount : ''}
                      </span>
                    </button>
                    <button
                      onClick={() => handleStartEditing(c)}
                      className="hover:text-blue-500"
                      title="Edit"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(c._id)}
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
                      className="w-full bg-[#23232b] border-2 border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 p-2 rounded-lg text-white placeholder-gray-400 transition-all shadow-md focus:shadow-lg"
                      maxLength={500}
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => handleSaveEdit(c._id)}
                        className="flex items-center gap-1 text-green-500 hover:text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg font-semibold transition-all shadow"
                        title="Save"
                      >
                        <HiCheck size={18} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="flex items-center gap-1 text-red-400 hover:text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg font-semibold transition-all shadow"
                        title="Cancel"
                      >
                        <HiX size={18} />
                        <span>Cancel</span>
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

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onDelete={handleConfirmDelete}
        itemName="comment"
        itemtype="comment"
      />
    </div>
  );
}
