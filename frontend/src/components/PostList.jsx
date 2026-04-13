export default function PostList({ posts, selectedId, onSelect }) {
  return (
    <aside className="post-list">
      <div className="post-list-header">
        <h2>All Posts <span className="post-count">{posts.length}</span></h2>
      </div>

      <div className="post-list-body">
        {posts.length === 0 && (
          <p className="no-posts">No posts yet.</p>
        )}
        {posts.map((post) => (
          <button
            key={post.id}
            className={`post-item ${post.id === selectedId ? "active" : ""}`}
            onClick={() => onSelect(post.id)}
          >
            {/* Media type badges */}
            <div className="post-badges">
              {post.photos?.length > 0  && <span className="badge badge-photo">🖼️ {post.photos.length}</span>}
              {post.videos?.length > 0  && <span className="badge badge-video">🎬 {post.videos.length}</span>}
              {post.audios?.length > 0  && <span className="badge badge-audio">🔊 {post.audios.length}</span>}
              {post.youtube_link        && <span className="badge badge-yt">▶️ YT</span>}
            </div>
            <p className="post-item-title">{post.title}</p>
            <div className="post-item-meta">
              <span>✍️ {post.author}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .post-list {
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          height: calc(100vh - var(--header-h));
          overflow: hidden;
          position: sticky; top: var(--header-h);
        }
        .post-list-header {
          padding: 20px 20px 14px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .post-list-header h2 {
          font-size: 1rem; font-weight: 700;
          color: var(--primary-dark);
          display: flex; align-items: center; gap: 8px;
        }
        .post-count {
          background: var(--primary); color: #fff;
          font-size: .7rem; font-weight: 700;
          padding: 2px 7px; border-radius: 20px;
        }
        .post-list-body {
          overflow-y: auto; flex: 1;
          padding: 12px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .no-posts { color: var(--text-muted); font-size: .9rem; padding: 12px; }
        .post-item {
          width: 100%;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          cursor: pointer; text-align: left;
          display: flex; flex-direction: column; gap: 6px;
          transition: all .2s;
        }
        .post-item:hover { border-color: var(--primary); background: var(--primary-light); }
        .post-item.active {
          border-color: var(--primary);
          background: var(--primary-light);
          box-shadow: 0 2px 10px rgba(67,56,202,.15);
        }
        .post-badges { display: flex; flex-wrap: wrap; gap: 4px; }
        .badge {
          font-size: .68rem; font-weight: 600;
          padding: 2px 7px; border-radius: 20px;
        }
        .badge-photo { background: #ecfdf5; color: #059669; }
        .badge-video { background: #eff6ff; color: #2563eb; }
        .badge-audio { background: #f3eeff; color: #7c3aed; }
        .badge-yt    { background: #fff1f1; color: #dc2626; }
        .post-item-title {
          font-size: .9rem; font-weight: 600;
          color: var(--text-main); line-height: 1.4;
        }
        .post-item-meta {
          display: flex; justify-content: space-between;
          font-size: .72rem; color: var(--text-muted);
        }
      `}</style>
    </aside>
  );
}
