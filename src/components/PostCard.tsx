import { useState } from "react";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
  onToggleLike: (id: number) => Promise<void> | void;
  onAddComment: (id: number, text: string) => Promise<void> | void;
}

export function PostCard({ post, onToggleLike, onAddComment }: PostCardProps) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || isSaving) return;

    setIsSaving(true);
    try {
      await onAddComment(post.id, trimmed);
      setCommentText("");
      setIsCommentOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className={`post-card ${post.featured ? "is-featured" : ""}`}>
      <div className="post-header">
        <div className="profile-row">
          <div className="avatar">{post.avatar}</div>
          <div>
            <div className="post-name-row">
              <h4>{post.author}</h4>
              {post.following ? <span className="follow-pill">Following</span> : null}
            </div>
            <p>
              {post.handle} · {post.time}
            </p>
          </div>
        </div>
        <button className="ghost-button" type="button" aria-label={`More options for ${post.author}`}>
          ⋯
        </button>
      </div>

      <p className="post-content">{post.content}</p>

      {post.media ? (
        <div className="media-card" style={{ background: post.media.gradient }}>
          <div>
            <p>{post.media.title}</p>
            <h5>{post.media.subtitle}</h5>
          </div>
        </div>
      ) : null}

      <div className="tag-row" aria-label="Tags">
        {post.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            #{tag}
          </span>
        ))}
      </div>

      <div className="post-actions">
        <button className={`action-button ${post.liked ? "is-liked" : ""}`} type="button" onClick={() => void onToggleLike(post.id)}>
          ♥ {post.likes}
        </button>
        <button className="action-button" type="button" onClick={() => setIsCommentOpen((current) => !current)}>
          💬 {post.comments}
        </button>
        <button className="action-button" type="button">
          ↻ {post.reposts}
        </button>
        <button className="action-button" type="button">
          ⌁ {post.bookmarks}
        </button>
      </div>

      {post.latestComment ? (
        <div className="comment-preview">
          <strong>{post.latestComment.author}</strong>
          <p>{post.latestComment.text}</p>
        </div>
      ) : null}

      {isCommentOpen ? (
        <div className="comment-composer">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a quick comment..."
            rows={3}
          />
          <div className="comment-composer-actions">
            <button className="text-button" type="button" onClick={() => setIsCommentOpen(false)}>
              Cancel
            </button>
            <button className="primary-pill" type="button" onClick={() => void handleAddComment()}>
              {isSaving ? "Posting..." : "Comment"}
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
