import React, { useState, useEffect, useRef } from "react";
import { FiMoreHorizontal, FiCornerUpRight } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

const CommentsSection = ({ projectId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showMenu, setShowMenu] = useState(null);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    fetchComments();
    // Refresh comments every 30 seconds
    const interval = setInterval(fetchComments, 30000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.MESSAGES.GET_PROJECT_MESSAGES(projectId)
      );
      setComments(response.data?.messages || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.MESSAGES.SEND_MESSAGE, {
        content: newComment.trim(),
        project: projectId,
        // No receiver for project comments - they're visible to all project members
      });

      setComments((prev) => [...prev, response.data.data]);
      setNewComment("");
      toast.success("Commentaire ajouté");
    } catch (error) {
      console.error("Error sending comment:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout du commentaire");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.MESSAGES.DELETE_MESSAGE(commentId));
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      toast.success("Commentaire supprimé");
      setShowMenu(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const getAvatarInitials = (user) => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getAvatarColor = (userId) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-yellow-100 text-yellow-600",
      "bg-indigo-100 text-indigo-600",
    ];
    const index = userId ? userId.toString().charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const formatTimestamp = (date) => {
    const now = moment();
    const commentDate = moment(date);
    const diffDays = now.diff(commentDate, "days");

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return commentDate.format("DD/MM/YYYY HH:mm");
    }
  };

  const isCurrentUser = (senderId) => {
    return currentUser?._id === senderId || currentUser?.id === senderId;
  };

  return (
    <div className="space-y-6">
      {/* Header with Notifications Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Enable/disable notifications</span>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationsEnabled ? "bg-gray-900" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* New Comment Input */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(
              currentUser?._id || currentUser?.id
            )}`}
          >
            {currentUser?.profilePic ? (
              <img
                src={currentUser.profilePic}
                alt={currentUser.fullName || "User"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getAvatarInitials(currentUser)
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading ? "Envoi..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun commentaire pour le moment</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${getAvatarColor(
                    comment.sender?._id || comment.sender
                  )}`}
                >
                  {comment.sender?.profilePic ? (
                    <img
                      src={comment.sender.profilePic}
                      alt={comment.sender.fullName || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getAvatarInitials(comment.sender)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {comment.sender?.fullName || "Unknown User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title="Répondre"
                      >
                        <FiCornerUpRight size={16} />
                      </button>
                      {isCurrentUser(comment.sender?._id || comment.sender) && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowMenu(showMenu === comment._id ? null : comment._id)
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <FiMoreHorizontal size={16} />
                          </button>
                          {showMenu === comment._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={() => handleDelete(comment._id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
};

export default CommentsSection;

