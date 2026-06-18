import React, { useEffect, useState } from 'react';
import { Loader2, MessageSquare, Reply, Send, ThumbsUp } from 'lucide-react';
import { api } from '../services/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

const CommentItem = ({ comment, onLike, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyEmail, setReplyEmail] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="mb-7">
      <div className="flex gap-4">
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-primary-50 font-display font-bold text-primary-700">
          {(comment.author || 'A').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-serif text-[17px] font-black text-neutral-950">{comment.author || 'Anonyme'}</div>
          <div className="font-display text-xs text-neutral-500">{formatDate(comment.date || comment.created_at)}</div>
          <p className="mt-3 font-serif text-[15px] leading-7 text-neutral-700">{comment.content}</p>

          <div className="mt-3 flex items-center gap-5 font-display text-sm text-neutral-500">
            <button onClick={() => onLike(comment.id)} className="inline-flex items-center gap-2 hover:text-primary-700">
              <ThumbsUp size={15} />
              {comment.likes || 0}
            </button>
            <button onClick={() => setShowReplyForm((value) => !value)} className="inline-flex items-center gap-2 hover:text-primary-700">
              <Reply size={15} />
              Répondre
            </button>
          </div>

          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-4 space-y-3 border-l border-neutral-200 pl-4">
              <input value={replyEmail} onChange={(e) => setReplyEmail(e.target.value)} type="email" placeholder="Votre email" className="focus-input py-3 text-sm" required />
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Votre réponse..." className="focus-input resize-none py-3 text-sm" rows={2} required />
              <button disabled={isSubmitting} className="inline-flex items-center gap-2 font-display text-sm font-semibold text-primary-700">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Publier
              </button>
            </form>
          )}

          {comment.replies?.length > 0 && (
            <div className="mt-5 space-y-3 border-l border-neutral-200 pl-5">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="bg-white p-4 shadow-sm">
                  <div className="font-display text-sm font-bold text-neutral-800">{reply.author || 'Anonyme'}</div>
                  <div className="font-display text-xs text-neutral-400">{formatDate(reply.date || reply.created_at)}</div>
                  <p className="mt-2 font-serif text-[14px] text-neutral-700">{reply.content}</p>
                </div>
              ))}
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
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await api.comments.getByArticleId(articleId);
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch comments', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentEmail || !newCommentText) return;
    setIsSubmitting(true);
    try {
      const newComment = await api.comments.add(articleId, { email: newCommentEmail, content: newCommentText });
      setComments([newComment, ...comments]);
      setNewCommentEmail('');
      setNewCommentText('');
    } catch (error) {
      console.error('Failed to add comment', error);
      alert("Erreur lors de l'ajout du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const updatedComment = await api.comments.like(commentId);
      setComments(comments.map((comment) => (
        comment.id === commentId ? (updatedComment || { ...comment, likes: (comment.likes || 0) + 1 }) : comment
      )));
    } catch (error) {
      console.error('Failed to like comment', error);
    }
  };

  const handleReply = async (commentId, replyData) => {
    try {
      const reply = await api.comments.reply(commentId, replyData);
      setComments(comments.map((comment) => (
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      )));
    } catch (error) {
      console.error('Failed to reply', error);
    }
  };

  return (
    <section className="mt-16">
      <h2 className="mb-8 border-l-2 border-primary-600 pl-5 font-serif text-[24px] font-black text-neutral-950">
        Commentaires ({comments.length})
      </h2>

      <form onSubmit={handleAddComment} className="mb-12 bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-3 font-serif text-[18px] font-black text-neutral-950">
          <MessageSquare size={20} className="text-primary-700" />
          Laisser un commentaire
        </h3>
        <div className="space-y-5">
          <input
            type="email"
            value={newCommentEmail}
            onChange={(e) => setNewCommentEmail(e.target.value)}
            placeholder="Votre adresse email (pour vous identifier)"
            className="focus-input"
            required
          />
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Partagez votre avis sur cet article..."
            rows={4}
            className="focus-input resize-none"
            required
          />
          <div className="flex justify-end">
            <button disabled={isSubmitting} className="inline-flex items-center gap-3 px-2 py-3 font-display text-sm font-semibold text-neutral-800 hover:text-primary-700">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={19} />}
              Publier
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary-700" size={32} />
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onLike={handleLike} onReply={handleReply} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentsSection;
