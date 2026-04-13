import { useState, useEffect } from "react";
import Header from "./components/Header";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import MediaModal from "./components/MediaModal";
import CreatePostModal from "./components/CreatePostModal";
import EditPostModal from "./components/EditPostModal";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [posts, setPosts]             = useState([]);
  const [selected, setSelected]       = useState(null);
  const [modal, setModal]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showCreate, setShowCreate]   = useState(false);  // ✅ Create modal
  const [editPost, setEditPost]       = useState(null);   // ✅ Edit modal

  // Fetch all posts
  useEffect(() => {
    fetch(`${API_BASE}/api/news/`)
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((d) => {
        const list = d.data || [];
        setPosts(list);
        if (list.length > 0) setSelected(list[0]);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  // Fetch single post by id
  // const fetchPost = (news_id) => {
  //   fetch(`${API_BASE}/api/news/${news_id}`)
  //     .then((r) => r.json())
  //     .then((d) => setSelected(d.data || d))
  //     .catch(console.error);
  // };
  const fetchPost = (id) => {
    const post = posts.find((p) => p.id === id);
    if (post) setSelected(post);
   };

  // ✅ Called after a new post is created — add to top of list and select it
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setSelected(newPost);
  };

  // ✅ Called after a post is updated — update in list and re-select
  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => p.id === updatedPost.id ? updatedPost : p));
    setSelected(updatedPost);
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
      {/* ✅ Header gets onCreateClick prop */}
      <Header onCreateClick={() => setShowCreate(true)} />

      <div className="app-body">
        {/* Left — post list */}
        <PostList
          posts={posts}
          selectedId={selected?.id}
          onSelect={fetchPost}
        />

        {/* Center — post detail with Edit button */}
        <PostDetail
          post={selected}
          mediaItems={buildMediaItems(selected)}
          onOpenMedia={openModal}
          onEdit={(post) => setEditPost(post)}   // ✅ opens edit modal
        />
      </div>

      {/* Media viewer modal */}
      {modal && <MediaModal item={modal} onClose={() => setModal(null)} />}

      {/* ✅ Create post modal */}
      {showCreate && (
        <CreatePostModal
          apiBase={API_BASE}
          onClose={() => setShowCreate(false)}
          onCreated={handlePostCreated}
        />
      )}

      {/* ✅ Edit post modal */}
      {editPost && (
        <EditPostModal
          apiBase={API_BASE}
          post={editPost}
          onClose={() => setEditPost(null)}
          onUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
}
