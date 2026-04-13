import { useState } from "react";

export default function CreatePostModal({ apiBase, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.target);

    try {
      const res = await fetch(`${apiBase}/api/news/`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create post");
      onCreated(data.data);
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
          <h2>📝 Create News Article</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          {/* Title */}
          <label className="form-label">
            Title <span className="required">*</span>
            <input className="form-input" name="title" required placeholder="Enter title…" />
          </label>

          {/* Author */}
          <label className="form-label">
            Author <span className="required">*</span>
            <input className="form-input" name="author" required placeholder="Your name…" />
          </label>

          {/* Text content */}
          <label className="form-label">
            Content
            <textarea className="form-input form-textarea" name="text_content" placeholder="Write your article…" rows={5} />
          </label>

          {/* YouTube */}
          <label className="form-label">
            YouTube Link
            <input className="form-input" name="youtube_link" placeholder="https://youtube.com/watch?v=…" />
          </label>

          {/* Files */}
          <div className="form-files-row">
            <label className="form-label">
              🖼️ Photos
              <input className="form-file" name="photos" type="file" multiple accept="image/*" />
            </label>
            <label className="form-label">
              🎬 Videos
              <input className="form-file" name="videos" type="file" multiple accept="video/*" />
            </label>
            <label className="form-label">
              🔊 Audios
              <input className="form-file" name="audios" type="file" multiple accept="audio/*" />
            </label>
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Publishing…" : "Publish Post"}
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
        .required { color: #dc2626; }
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
