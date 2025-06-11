import React, { useState, useEffect } from 'react';
import {
  addComment,
  getVideoComments,
  deleteComment,
  updateComment,
} from '../hooks/comments';
import { HiTrash, HiPencil, HiCheck, HiX, HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import { toggleLike } from '../hooks/toggleLike';
import {DefaultAvatar,DeleteConfirmationModal} from "./index"
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
            <div key={c._id} className="flex items-start gap-3 bg-[#23232b] rounded-xl p-3 shadow-md border border-purple-900/10 hover:shadow-purple-900/20 transition-all group">
              <Link to={`/profile/${c.owner.username}`}>
                <img
                  src={c.owner.avatar && c.owner.avatar.trim() !== '' ? c.owner.avatar : DefaultAvatar}
                  alt={c.owner.username}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-purple-700 shadow group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                  onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <div className="truncate">
                    <span className="text-base sm:text-lg font-semibold text-white truncate">{c.owner.username}</span>
                    <span className="text-gray-400 text-xs ml-2">
                      • {new Date(c.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mt-1 sm:mt-0">
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
                      <span className="ml-1 text-xs font-semibold">
                        {typeof c.likesCount === 'number' && c.likesCount >= 0 ? c.likesCount : ''}
                      </span>
                    </button>
                    {String(c.owner._id) === String(currentUserId) && (
                      <>
                        <button
                          onClick={() => handleStartEditing(c)}
                          className="hover:text-blue-500 p-1 rounded hover:bg-gray-700/40"
                          title="Edit"
                        >
                          <HiPencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c._id)}
                          className="hover:text-red-500 p-1 rounded hover:bg-gray-700/40"
                          title="Delete"
                        >
                          <HiTrash size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingCommentId === c._id ? (
                  <div className="mt-2 bg-[#181824] border-2 border-purple-700 rounded-xl shadow-lg p-2 sm:p-4 animate-fade-in">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 text-base resize-none outline-none"
                      maxLength={500}
                      autoFocus
                      placeholder="Edit your comment..."
                      style={{ minHeight: 60 }}
                    />
                    <div className="flex gap-2 mt-3 justify-end">
                      <button
                        onClick={() => handleSaveEdit(c._id)}
                        className="flex items-center gap-1 text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 px-4 py-1.5 rounded-lg font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                        title="Save"
                      >
                        <HiCheck size={20} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="flex items-center gap-1 text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-1.5 rounded-lg font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                        title="Cancel"
                      >
                        <HiX size={20} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-100 text-[1.08rem] mt-3 whitespace-pre-line border-l-4 border-purple-700/60 pl-4 bg-[#23232b] rounded-lg shadow-inner group-hover:bg-[#23232b]/90 transition-all min-h-[44px] flex items-center">
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
            <div key={c._id} className="flex items-start gap-3 bg-[#23232b] rounded-xl p-3 shadow-md border border-purple-900/10 hover:shadow-purple-900/20 transition-all group">
              <Link to={`/profile/${c.owner.username}`}>
                <img
                  src={c.owner.avatar && c.owner.avatar.trim() !== '' ? c.owner.avatar : DefaultAvatar}
                  alt={c.owner.username}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-purple-700 shadow group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                  onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
                />
              </Link>
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
                  <div className="flex items-center gap-2 text-gray-400 mt-1 sm:mt-0">
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
                      className={`hover:text-blue-500 flex items-center px-2 py-1 rounded transition ${c.isLiked ? 'bg-blue-900/30' : 'hover:bg-gray-700/40'}`}
                      title="Like"

                    >
                      {c.isLiked ? (
                        <HiThumbUp size={18} className="text-blue-500" />
                      ) : (
                        <HiOutlineThumbUp size={18} />
                      )}
                      <span className="ml-1 text-xs font-semibold">
                        {typeof c.likesCount === 'number' && c.likesCount >= 0 ? c.likesCount : ''}
                      </span>

                    </button>

                    {String(c.owner._id) === String(currentUserId) && (
                      <>
                        <button
                          onClick={() => handleStartEditing(c)}
                          className="hover:text-blue-500 p-1 rounded hover:bg-gray-700/40"
                          title="Edit"
                        >
                          <HiPencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c._id)}
                          className="hover:text-red-500 p-1 rounded hover:bg-gray-700/40"
                          title="Delete"
                        >
                          <HiTrash size={18} />
                        </button>
                      </>
                    )}

                  </div>
                </div>

                {editingCommentId === c._id ? (
                  <div className="mt-2 bg-[#181824] border-2 border-purple-700 rounded-xl shadow-lg p-2 sm:p-4 animate-fade-in">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 text-base resize-none outline-none"
                      maxLength={500}
                      autoFocus
                      placeholder="Edit your comment..."
                      style={{ minHeight: 60 }}
                    />

                    <div className="flex gap-2 mt-3 justify-end">
                      <button
                        onClick={() => handleSaveEdit(c._id)}
                        className="flex items-center gap-1 text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 px-4 py-1.5 rounded-lg font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                        title="Save"
                      >
                        <HiCheck size={20} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="flex items-center gap-1 text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-1.5 rounded-lg font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                        title="Cancel"
                      >
                        <HiX size={20} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-100 text-[1.08rem] mt-3 whitespace-pre-line border-l-4 border-purple-700/60 pl-4 bg-[#23232b] rounded-lg shadow-inner group-hover:bg-[#23232b]/90 transition-all min-h-[44px] flex items-center">
                    {c.content}
                  </p>
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
