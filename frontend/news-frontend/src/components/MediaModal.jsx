import { useEffect } from "react";

export default function MediaModal({ item, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">{item.label}</h3>

        <div className="modal-body">
          {item.type === "audio" && (
            <div className="audio-wrap">
              <div className="audio-icon">🎵</div>
              <audio controls autoPlay src={item.url} className="audio-player">
                Your browser does not support audio.
              </audio>
            </div>
          )}
          {item.type === "video" && (
            <video controls autoPlay src={item.url} className="video-player">
              Your browser does not support video.
            </video>
          )}
          {item.type === "image" && (
            <img src={item.url} alt="media" className="image-display" />
          )}
        </div>
      </div>

      <style>{`
        .overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(15,10,40,.65);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn .2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: var(--surface);
          border-radius: 18px; padding: 32px;
          width: min(580px, 94vw);
          position: relative;
          box-shadow: 0 24px 60px rgba(0,0,0,.3);
          animation: popIn .25s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .modal-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px;
          background: var(--bg); border: none; border-radius: 50%;
          cursor: pointer; font-size: 1rem; color: var(--text-muted);
          transition: background .2s, color .2s;
        }
        .modal-close:hover { background: var(--danger); color: #fff; }
        .modal-title {
          font-family: "Playfair Display", serif;
          font-size: 1.3rem; color: var(--primary);
          margin-bottom: 20px; padding-bottom: 12px;
          border-bottom: 2px solid var(--primary-light);
        }
        .audio-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .audio-icon { font-size: 4rem; animation: pulse 2s ease infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .audio-player { width: 100%; }
        .video-player { width: 100%; max-height: 340px; border-radius: 10px; outline: none; }
        .image-display { width: 100%; border-radius: 10px; object-fit: cover; }
      `}</style>
    </div>
  );
}
