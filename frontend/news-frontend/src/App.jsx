import { useState, useEffect } from "react";
import Header from "./components/Header";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import MediaModal from "./components/MediaModal";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [posts, setPosts]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [modal, setModal]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Fetch all posts
  useEffect(() => {
    fetch(`${API_BASE}/api/news/`)
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((d) => {
        const list = d.news || [];
        setPosts(list);
        if (list.length > 0) setSelected(list[0]);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  // Fetch single post
  const fetchPost = (id) => {
    fetch(`${API_BASE}/api/news/${id}`)
      .then((r) => r.json())
      .then((d) => setSelected(d))
      .catch(console.error);
  };

  // Build media items from backend fields
  const buildMediaItems = (post) => {
    if (!post) return [];
    const items = [];
    let id = 1;
    (post.photos || []).forEach((url) =>
      items.push({ id: id++, type: "image",   label: "Photo",   url: `${API_BASE}/${url}` })
    );
    (post.videos || []).forEach((url) =>
      items.push({ id: id++, type: "video",   label: "Video",   url: `${API_BASE}/${url}` })
    );
    (post.audios || []).forEach((url) =>
      items.push({ id: id++, type: "audio",   label: "Audio",   url: `${API_BASE}/${url}` })
    );
    if (post.youtube_link)
      items.push({ id: id++, type: "youtube", label: "YouTube", url: post.youtube_link });
    return items;
  };

  const openModal = (item) => {
    if (item.type === "youtube") window.open(item.url, "_blank");
    else setModal(item);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading…</p>
    </div>
  );

  if (error) return (
    <div className="loading-screen">
      <p className="error-msg">⚠️ {error}</p>
    </div>
  );

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        {/* Left — post list */}
        <PostList
          posts={posts}
          selectedId={selected?.id}
          onSelect={fetchPost}
        />

        {/* Center — post detail */}
        <PostDetail
          post={selected}
          mediaItems={buildMediaItems(selected)}
          onOpenMedia={openModal}
        />
      </div>

      {modal && <MediaModal item={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
