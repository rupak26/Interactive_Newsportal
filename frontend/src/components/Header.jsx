export default function Header({ onCreateClick }) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-logo">📰</span>
        <div>
          <h1 className="header-title">News Platform</h1>
          <p className="header-sub">Interactive multimedia news</p>
        </div>
      </div>

      {/* ✅ Create Post button — top right */}
      <button className="create-btn" onClick={onCreateClick}>
        + Create Post
      </button>

      <style>{`
        .header {
          height: var(--header-h);
          background: linear-gradient(135deg, var(--primary-dark), var(--primary));
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          box-shadow: 0 2px 16px rgba(49,46,129,.35);
          position: sticky; top: 0; z-index: 100;
        }
        .header-brand { display: flex; align-items: center; gap: 14px; }
        .header-logo { font-size: 1.8rem; }
        .header-title {
          font-family: "Playfair Display", serif;
          font-size: 1.4rem; color: #fff; font-weight: 800;
        }
        .header-sub { font-size: .8rem; color: rgba(255,255,255,.7); margin-top: 2px; }
        .create-btn {
          padding: 10px 20px;
          background: #fff;
          color: var(--primary-dark);
          border: none; border-radius: 8px;
          font-size: .9rem; font-weight: 700;
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
        }
        .create-btn:hover {
          background: var(--primary-light);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,.2);
        }
      `}</style>
    </header>
  );
}
