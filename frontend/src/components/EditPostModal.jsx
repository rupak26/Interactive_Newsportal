import { useState } from "react";

export default function EditPostModal({ apiBase, post, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.target);

    try {
      const res = await fetch(`${apiBase}/api/news/${post.id}`, {
        method: "PUT",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to update post");
      onUpdated(data.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>✏️ Edit Post</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          {/* Title */}
          <label className="form-label">
            Title
            <input className="form-input" name="title" defaultValue={post.title} placeholder="Enter title…" />
          </label>

          {/* Author */}
          <label className="form-label">
            Author
            <input className="form-input" name="author" defaultValue={post.author} placeholder="Your name…" />
          </label>

          {/* Text content */}
          <label className="form-label">
            Content
            <textarea className="form-input form-textarea" name="text_content" defaultValue={post.text_content || ""} placeholder="Write your article…" rows={5} />
          </label>

          {/* YouTube */}
          <label className="form-label">
            YouTube Link
            <input className="form-input" name="youtube_link" defaultValue={post.youtube_link || ""} placeholder="https://youtube.com/watch?v=…" />
          </label>

          {/* Existing files info */}
          <div className="existing-files">
            <p className="existing-label">📁 Existing files (uploading new ones will be added)</p>
            <div className="existing-badges">
              {post.photos?.length > 0 && <span className="badge badge-photo">🖼️ {post.photos.length} photo(s)</span>}
              {post.videos?.length > 0 && <span className="badge badge-video">🎬 {post.videos.length} video(s)</span>}
              {post.audios?.length > 0 && <span className="badge badge-audio">🔊 {post.audios.length} audio(s)</span>}
              {!post.photos?.length && !post.videos?.length && !post.audios?.length && (
                <span className="no-files">No files yet</span>
              )}
            </div>
          </div>

          {/* New files */}
          <div className="form-files-row">
            <label className="form-label">
              🖼️ Add Photos
              <input className="form-file" name="photos" type="file" multiple accept="image/*" />
            </label>
            <label className="form-label">
              🎬 Add Videos
              <input className="form-file" name="videos" type="file" multiple accept="video/*" />
            </label>
            <label className="form-label">
              🔊 Add Audios
              <input className="form-file" name="audios" type="file" multiple accept="audio/*" />
            </label>
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,.5);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .modal-box {
          background: var(--surface);
          border-radius: var(--radius);
          width: 100%; max-width: 580px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,.3);
        }
        .modal-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0;
          background: var(--surface);
        }
        .modal-head h2 {
          font-family: "Playfair Display", serif;
          font-size: 1.2rem; color: var(--primary-dark);
        }
        .modal-close {
          background: none; border: none;
          font-size: 1.1rem; cursor: pointer;
          color: var(--text-muted);
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .modal-close:hover { background: var(--border); }
        .post-form {
          padding: 20px 24px 24px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .form-label {
          display: flex; flex-direction: column; gap: 6px;
          font-size: .85rem; font-weight: 600; color: var(--text-main);
        }
        .form-input {
          padding: 10px 14px;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          font-size: .95rem;
          background: var(--bg);
          color: var(--text-main);
          transition: border-color .2s;
          font-family: inherit;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99,102,241,.15);
        }
        .form-textarea { resize: vertical; min-height: 100px; }
        .existing-files {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .existing-label {
          font-size: .8rem; font-weight: 600;
          color: var(--text-muted);
        }
        .existing-badges { display: flex; flex-wrap: wrap; gap: 6px; }
        .badge {
          font-size: .75rem; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
        }
        .badge-photo { background: #ecfdf5; color: #059669; }
        .badge-video { background: #eff6ff; color: #2563eb; }
        .badge-audio { background: #f3eeff; color: #7c3aed; }
        .no-files { font-size: .8rem; color: var(--text-muted); }
        .form-files-row {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;
        }
        .form-file {
          margin-top: 4px;
          font-size: .8rem; color: var(--text-muted);
        }
        .form-error {
          background: #fff1f1; color: #dc2626;
          border: 1px solid #fca5a5;
          border-radius: 8px; padding: 10px 14px;
          font-size: .85rem;
        }
        .form-actions {
          display: flex; justify-content: flex-end; gap: 10px;
          padding-top: 4px;
        }
        .btn-cancel {
          padding: 10px 20px;
          background: none;
          border: 1.5px solid var(--border);
          border-radius: 8px; cursor: pointer;
          font-size: .9rem; font-weight: 600;
          color: var(--text-muted);
          transition: all .2s;
        }
        .btn-cancel:hover { border-color: var(--primary); color: var(--primary); }
        .btn-submit {
          padding: 10px 24px;
          background: var(--primary);
          color: #fff; border: none;
          border-radius: 8px; cursor: pointer;
          font-size: .9rem; font-weight: 700;
          transition: all .2s;
        }
        .btn-submit:hover:not(:disabled) { background: var(--primary-dark); }
        .btn-submit:disabled { opacity: .6; cursor: not-allowed; }

        @media (max-width: 480px) {
          .form-files-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
