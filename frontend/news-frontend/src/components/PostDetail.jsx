const MEDIA_ICONS = {
  image:   { emoji: "🖼️", color: "#059669", bg: "#ecfdf5" },
  audio:   { emoji: "🔊", color: "#7c3aed", bg: "#f3eeff" },
  video:   { emoji: "🎬", color: "#2563eb", bg: "#eff6ff" },
  youtube: { emoji: "▶️", color: "#dc2626", bg: "#fff1f1" },
};

export default function PostDetail({ post, mediaItems, onOpenMedia }) {
  if (!post) return <div className="detail-empty">Select a post to read.</div>;

  return (
    <main className="detail">
      {/* Header */}
      <div className="detail-header">
        <h1 className="detail-title">{post.title}</h1>
        <div className="detail-meta">
          <span>✍️ <strong>{post.author}</strong></span>
          <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Media buttons */}
      {mediaItems.length > 0 && (
        <div className="detail-media-section">
          <h3 className="detail-section-label">Media</h3>
          <div className="media-grid">
            {mediaItems.map((item) => {
              const style = MEDIA_ICONS[item.type] || { emoji: "📄", color: "#666", bg: "#f5f5f5" };
              return (
                <button
                  key={item.id}
                  className="media-btn"
                  style={{ "--btn-color": style.color, "--btn-bg": style.bg }}
                  onClick={() => onOpenMedia(item)}
                >
                  <span>{style.emoji}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Article text */}
      {post.text_content && (
        <div className="detail-content">
          <h3 className="detail-section-label">Article</h3>
          <div className="article-body">
            {post.text_content.split("\n\n").map((para, i) => (
              <p key={i} className="article-para">{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* YouTube link */}
      {post.youtube_link && (
        <div className="detail-youtube">
          <h3 className="detail-section-label">YouTube</h3>
          <a href={post.youtube_link} target="_blank" rel="noreferrer" className="yt-link">
            ▶️ Watch on YouTube
          </a>
        </div>
      )}

      <style>{`
        .detail-empty {
          display: flex; align-items: center; justify-content: center;
          height: 100%; color: var(--text-muted); font-size: 1rem;
        }
        .detail {
          flex: 1; overflow-y: auto;
          padding: 32px;
          display: flex; flex-direction: column; gap: 28px;
          height: calc(100vh - var(--header-h));
        }
        .detail-header { display: flex; flex-direction: column; gap: 10px; }
        .detail-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          color: var(--primary-dark); line-height: 1.3;
        }
        .detail-meta {
          display: flex; gap: 20px;
          font-size: .85rem; color: var(--text-muted);
        }
        .detail-section-label {
          font-size: .75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: .08em;
          color: var(--text-muted); margin-bottom: 12px;
        }
        .detail-media-section, .detail-content, .detail-youtube {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px 24px;
          box-shadow: var(--shadow);
        }
        .media-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .media-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          background: var(--btn-bg);
          color: var(--btn-color);
          border: 1.5px solid var(--btn-color);
          border-radius: 8px; cursor: pointer;
          font-size: .9rem; font-weight: 600;
          transition: all .2s;
        }
        .media-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,.12);
        }
        .article-body { display: flex; flex-direction: column; gap: 14px; }
        .article-para {
          line-height: 1.85; font-size: 1rem;
          color: #374151; text-align: justify;
        }
        .yt-link {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff1f1; color: #dc2626;
          border: 1.5px solid #dc2626;
          border-radius: 8px; padding: 10px 18px;
          font-weight: 600; font-size: .9rem;
          text-decoration: none; transition: all .2s;
        }
        .yt-link:hover { background: #dc2626; color: #fff; }
      `}</style>
    </main>
  );
}
