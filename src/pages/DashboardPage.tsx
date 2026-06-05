import { useEffect, useMemo, useState } from "react";
import { stories, suggestions, trends } from "../data/mockData";
import type { FeedTab, Post } from "../types";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import { RightRail } from "../components/RightRail";
import { Sidebar } from "../components/Sidebar";
import { Stories } from "../components/Stories";
import { TopBar } from "../components/TopBar";
import { useAuth } from "../auth/AuthContext";
import { addComment, createPost, getPosts, toggleLike } from "../lib/api";

const tabDescriptions: Record<FeedTab, string> = {
  "For you": "A mix of fresh and featured posts.",
  Following: "Posts from accounts you already follow.",
  Trending: "The most engaging posts right now.",
};

function toTagList(input: string) {
  return Array.from(
    new Set(
      input
        .split(/[\s,]+/)
        .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
        .filter(Boolean),
    ),
  ).slice(0, 4);
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedTab>("For you");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      try {
        setLoadError("");
        setIsLoading(true);
        const nextPosts = await getPosts();
        if (mounted) {
          setPosts(nextPosts);
        }
      } catch (error) {
        if (mounted) {
          setLoadError(error instanceof Error ? error.message : "Failed to load feed.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...posts]
      .filter((post) => {
        const matchesTab =
          activeTab === "For you"
            ? true
            : activeTab === "Following"
              ? post.following
              : post.likes + post.comments + post.reposts + post.bookmarks > 300;

        const matchesQuery =
          query.length === 0
            ? true
            : [
                post.author,
                post.handle,
                post.content,
                post.tags.join(" "),
                post.media?.title ?? "",
                post.media?.subtitle ?? "",
              ]
                .join(" ")
                .toLowerCase()
                .includes(query);

        return matchesTab && matchesQuery;
      })
      .sort((left, right) => {
        if (activeTab === "Trending") {
          const rightScore = right.likes + right.comments + right.reposts + right.bookmarks;
          const leftScore = left.likes + left.comments + left.reposts + left.bookmarks;
          return rightScore - leftScore;
        }

        return right.createdAt - left.createdAt;
      });
  }, [activeTab, posts, search]);

  const handleToggleLike = async (id: number) => {
    const nextPost = await toggleLike(id);
    setPosts((current) => current.map((post) => (post.id === id ? nextPost : post)));
  };

  const handleCreatePost = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const tags = toTagList(trimmed);
    const createdPost = await createPost({
      author: user?.name ?? "You",
      handle: `@${(user?.name ?? "akshay.creates").toLowerCase().replace(/\s+/g, ".")}`,
      avatar: (user?.name ?? "AJ")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      content: trimmed,
      tags: tags.length > 0 ? tags : ["update", "community"],
    });

    setPosts((current) => [createdPost, ...current]);
    setDraft("");
    setActiveTab("For you");
  };

  const handleAddComment = async (id: number, text: string) => {
    const nextPost = await addComment(id, text);
    setPosts((current) => current.map((post) => (post.id === id ? nextPost : post)));
  };

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={logout} />

      <main className="main-column">
        <TopBar search={search} onSearchChange={setSearch} />

        <section className="hero-card">
          <div>
            <p className="eyebrow">Pulse command center</p>
            <h2>Build a feed that feels fast, focused, and easy to come back to.</h2>
            <p>
              {tabDescriptions[activeTab]} Search to narrow the conversation, post
              an update, or switch tabs to see a different rhythm.
            </p>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>{visiblePosts.length}</strong>
              <span>visible posts</span>
            </div>
            <div>
              <strong>{posts.length}</strong>
              <span>total posts</span>
            </div>
            <div>
              <strong>Live</strong>
              <span>community mode</span>
            </div>
          </div>
        </section>

        <Stories stories={stories} />
        <PostComposer value={draft} onChange={setDraft} onSubmit={handleCreatePost} />

        <section className="feed-section" aria-labelledby="feed-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Feed</p>
              <h3 id="feed-title">{activeTab}</h3>
            </div>
            <button className="text-button" type="button">
              {visiblePosts.length} posts
            </button>
          </div>

          {loadError ? <p className="feed-status error">{loadError}</p> : null}
          {isLoading ? <p className="feed-status">Loading your feed...</p> : null}
          {!isLoading && !loadError ? (
            <div className="feed-list">
              {visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleLike={(postId) => void handleToggleLike(postId)}
                  onAddComment={(postId, text) => handleAddComment(postId, text)}
                />
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <RightRail trends={trends} suggestions={suggestions} />
    </div>
  );
}
