import React, { useState, useEffect } from 'react';
import { User, MessageSquare, ThumbsUp, Send, ChevronDown, ChevronUp, Reply, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  return date.toLocaleDateString();
};

const CommentItem = ({ comment, onLike, onReply, onViewThread, isThreadView = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyEmail, setReplyEmail] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyEmail || !replyText) return;

    setIsSubmitting(true);
    await onReply(comment.id, { email: replyEmail, content: replyText });
    setIsSubmitting(false);
    setShowReplyForm(false);
    setReplyEmail('');
    setReplyText('');
  };

  return (
    <div className="bg-neutral-50 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
          {comment.author ? comment.author.charAt(0).toUpperCase() : <User size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-neural-900">{comment.author || 'Anonyme'}</h4>
              <span className="text-xs text-neutral-500">{timeAgo(comment.date || comment.created_at)}</span>
            </div>
          </div>
          
          <p className="text-neutral-700 mt-2 text-sm leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${comment.isLiked ? 'text-primary-600' : 'text-neutral-500 hover:text-primary-600'}`}
            >
              <ThumbsUp size={14} className={comment.isLiked ? 'fill-current' : ''} />
              <span>{comment.likes || 0}</span>
            </button>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <Reply size={14} />
              <span>Répondre</span>
            </button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-4 pl-4 border-l-2 border-neutral-200">
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  value={replyEmail}
                  onChange={(e) => setReplyEmail(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-primary-500"
                  required
                />
                <textarea
                  placeholder="Votre réponse..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-primary-500 resize-none"
                  rows={2}
                  required
                />
                <div className="flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-200 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    Répondre
                  </button>
                </div>
              </div>
            </form>
          )}


          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-neutral-200">
              {/* Show only first 2 replies unless in Thread View */}
              {(isThreadView ? comment.replies : comment.replies.slice(0, 2)).map(reply => (
                <div key={reply.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-neutral-900">{reply.author}</span>
                    <span className="text-[10px] text-neutral-400">{timeAgo(reply.date)}</span>
                  </div>
                  <p className="text-sm text-neutral-700">{reply.content}</p>
                </div>
              ))}
              
              {!isThreadView && comment.replies.length > 2 && (
                  <button 
                    onClick={() => onViewThread(comment)}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-2"
                  >
                    <span>Voir {comment.replies.length - 2} réponses de plus</span>
                    <ChevronDown size={14} />
                  </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal state for separate view
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Thread modal state
  const [focusedComment, setFocusedComment] = useState(null);

  const fetchComments = async () => {
    try {
      const data = await api.comments.getByArticleId(articleId);
      // Ensure data is array
      setComments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch comments", e);
      setComments([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen || focusedComment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, focusedComment]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentEmail || !newCommentText) return;

    setIsSubmitting(true);
    setIsSubmitting(true);
    try {
      // Actual API call
      const newComment = await api.comments.add(articleId, { email: newCommentEmail, content: newCommentText });
      
      // Update UI with real data from backend
      setComments([newComment, ...comments]);
      setNewCommentEmail('');
      setNewCommentText('');
      
    } catch (e) {
      console.error("Failed to add comment", e);
      alert("Erreur lors de l'ajout du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
        const updatedComment = await api.comments.like(commentId);
        
        setComments(comments.map(c => {
          if (c.id === commentId) {
             // Use backend response if available, or just increment
            return updatedComment || { ...c, likes: (c.likes || 0) + 1, isLiked: true };
          }
          return c;
        }));
    } catch (e) {
        console.error("Failed to like comment", e);
    }
  };

  const handleReply = async (commentId, replyData) => {
    try {
        const updatedParentComment = await api.comments.reply(commentId, replyData);
        // Backend typically returns the new reply or the updated parent comment
        // Let's assume it returns the new reply
        
        // However, if backend returns the new reply, we need to append it.
        // If backend returns updated parent, we replace.
        // Based on common patterns:
        
        // Re-fetch comments to be safe or manually append if we know the structure
        // Let's manually append for immediate feedback, assuming 'updatedParentComment' is the new reply object
        
        // Actually, best strictly use backend response for ID consistency
        setComments(comments.map(c => {
          if (c.id === commentId) {
             // If the API returns the full updated comment structure
             if (updatedParentComment && updatedParentComment.replies) {
                 return updatedParentComment;
             }
             // Fallback: if it returns just the new reply
            return {
              ...c,
              replies: [...(c.replies || []), updatedParentComment]
            };
          }
          return c;
        }));
    } catch (e) {
        console.error("Failed to reply", e);
    }
  };

  // Logic for display
  const displayedComments = isModalOpen ? comments : comments.slice(0, 2);

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold font-serif mb-8 border-l-4 border-primary-600 pl-4">
        Commentaires ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 mb-8">
        <h4 className="font-bold text-neural-900 mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-primary-600" />
          Laisser un commentaire
        </h4>
        <form onSubmit={handleAddComment} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Votre adresse email (pour vous identifier)"
              value={newCommentEmail}
              onChange={(e) => setNewCommentEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Partagez votre avis sur cet article..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all resize-none font-sans"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary py-2 px-6 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Publier
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
             <div className="flex justify-center p-8">
               <Loader2 size={32} className="animate-spin text-primary-600" />
             </div>
        ) : (
          displayedComments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onLike={handleLike} 
              onReply={handleReply} 
              onViewThread={(c) => setFocusedComment(c)}
            />
          ))
        )}
      </div>

      {/* View More Button */}
      {!isModalOpen && comments.length > 2 && (
        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
          >
            <span>Voir plus de commentaires ({comments.length - 2})</span>
            <ChevronDown size={20} />
          </button>
        </div>
      )}

      {/* Full Screen Modal for "Comment Page" effect */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-fade-in">
           <div className="container-custom py-10 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 backdrop-blur-sm py-4 z-10 border-b border-neutral-100">
                  <h2 className="text-3xl font-serif font-bold">Tous les commentaires</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <span className="sr-only">Fermer</span>
                    <ChevronUp size={24} />
                  </button>
              </div>
              
              <div className="space-y-6 pb-20">
                {comments.map(comment => (
                    <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    onLike={handleLike} 
                    onReply={handleReply} 
                    onViewThread={(c) => setFocusedComment(c)}
                    />
                ))}
              </div>
           </div>
        </div>
      )}

      {/* Thread View Modal (Single Comment + All Replies) */}
      {focusedComment && (
        <div className="fixed inset-0 z-[110] bg-white overflow-y-auto animate-fade-in">
           <div className="container-custom py-10 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/95 backdrop-blur-sm py-4 z-10 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setFocusedComment(null)}
                        className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
                      >
                        <ChevronDown size={24} className="rotate-90" />
                      </button>
                      <h2 className="text-2xl font-serif font-bold">Réponses</h2>
                  </div>
              </div>
              
              <div className="pb-20">
                 <CommentItem 
                    comment={comments.find(c => c.id === focusedComment.id) || focusedComment}
                    onLike={handleLike}
                    onReply={handleReply}
                    onViewThread={() => {}} // No op in thread view
                    isThreadView={true} // Show all replies
                 />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
