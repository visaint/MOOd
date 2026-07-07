"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import Link from "next/link";
import { useMoodContext } from "@/lib/MoodContext";
import { MOODS, type Post } from "@/lib/store";

/* ── Format timestamp ── */
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ── Mood display helpers ── */
const moodMeta: Record<string, { icon: string }> = {
  dreamy: { icon: "☁️" },
  neon: { icon: "💜" },
  vintage: { icon: "📀" },
  noir: { icon: "🌑" },
  ethereal: { icon: "🌀" },
  gritty: { icon: "⚡" },
  chrome: { icon: "💿" },
  /* Special moods */
  comic: { icon: "💥" },
  blurred: { icon: "🌫️" },
  terminal: { icon: "🖥️" },
  pixel: { icon: "👾" },
  glitch: { icon: "⚡" },
  vhs: { icon: "📼" },
  watercolor: { icon: "🎨" },
};

/* ══════════════════════════════════════════════
   PostCard — mood filter, comments, likes
   ══════════════════════════════════════════════ */
function PostCard({ post }: { post: Post }) {
  const {
    addCommentToPost,
    getCommentsForPost,
    likePost,
    checkLiked,
    getLikesCount,
    user,
  } = useMoodContext();
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(() => checkLiked(post.id));
  const [likeCount, setLikeCount] = useState(() => getLikesCount(post.id));

  const allComments = getCommentsForPost(post.id);
  const previewCount = 2;
  const visibleComments = showAllComments
    ? allComments
    : allComments.slice(0, previewCount);
  const hasMore = allComments.length > previewCount;

  const handleLike = () => {
    const now = likePost(post.id);
    setLiked(now);
    setLikeCount((c) => (now ? c + 1 : c - 1));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    addCommentToPost(post.id, commentText.trim());
    setCommentText("");
  };

  const mood = moodMeta[post.moodId];
  const isOwner = post.authorId === user.id;

  return (
    <div
      className={`group flex flex-col bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-[24px] overflow-clip border mood-card mood-${post.moodId}`}
      style={{
        borderColor: "var(--mood-border, #e2e8f0)",
      }}
    >
      {/* ── Stacked photos (different images, wider spacing, expand on hover) ── */}
      <div className="mood-figure w-full relative pt-5 pb-3 flex justify-center">
        <div className="photo-stack">
          <div
            className="photo-stack__item photo-stack__item--back"
            style={{
              backgroundImage: `url('${(post.images ?? [post.image])[2] || post.image}')`,
            }}
          />
          <div
            className="photo-stack__item photo-stack__item--middle"
            style={{
              backgroundImage: `url('${(post.images ?? [post.image])[1] || post.image}')`,
            }}
          />
          <div
            className="photo-stack__item photo-stack__item--front"
            style={{ backgroundImage: `url('${post.image}')` }}
          />
          <div className="mood-overlay" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col p-[18px] gap-3">
        {/* Author row */}
        <div className="flex items-center gap-2">
          <div
            className={`size-[30px] shrink-0 rounded-full border-2 border-white/80 dark:border-slate-700/80 bg-gradient-to-br ${post.authorColor}`}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sky-700 dark:text-sky-300 text-sm font-black">
              {post.authorName}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
              {timeAgo(post.timestamp)}
            </span>
          </div>
          {/* Mood badge */}
          <div className="ml-auto mood-badge">
            <span>{mood?.icon}</span>
            <span>{post.moodId}</span>
          </div>
        </div>

        {/* Caption — darker for readability */}
        <p className="caption-text text-sm">{post.caption}</p>

        {/* ── Action bar ── */}
        <div className="flex items-center pt-1 gap-3">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              liked
                ? "text-rose-500 bg-rose-50/60 dark:bg-rose-900/30"
                : "text-sky-400 hover:text-rose-400 hover:bg-rose-50/30 dark:hover:bg-rose-900/20"
            }`}
          >
            <svg
              className="size-[18px]"
              stroke="currentColor"
              fill={liked ? "currentColor" : "none"}
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-sm font-black">{likeCount || ""}</span>
          </button>

          {/* Comment button — bigger, always visible */}
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer text-base ${
              showAllComments
                ? "text-purple-500 bg-purple-50/60 dark:bg-purple-900/30"
                : "text-purple-400 hover:text-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-900/20"
            }`}
          >
            <svg
              className="size-[18px]"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className="text-sm font-black">
              {allComments.length || ""}
            </span>
          </button>

          {isOwner && (
            <span className="ml-auto text-[10px] font-black text-slate-300 dark:text-slate-500 italic">
              you
            </span>
          )}
        </div>

        {/* ── Comments section — always shows preview ── */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-sky-100 dark:border-slate-700/50">
          {/* No comments yet */}
          {allComments.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold italic">
              No moos yet. Be the first.
            </p>
          )}

          {/* Visible comments (preview or all) */}
          {visibleComments.map((c) => (
            <div key={c.id} className="flex items-start gap-[7px]">
              <div
                className={`size-5 shrink-0 rounded-full bg-gradient-to-br ${c.authorColor}`}
              />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-purple-600 dark:text-purple-400 font-black text-xs">
                    {c.authorName}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
                    {timeAgo(c.timestamp)}
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-semibold text-xs">
                  {c.text}
                </span>
              </div>
            </div>
          ))}

          {/* "Show all" / "Show less" toggle */}
          {hasMore && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="self-start text-purple-400 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 text-xs font-black tracking-wide uppercase transition-colors cursor-pointer"
            >
              {showAllComments
                ? `▲ hide`
                : `▼ view all ${allComments.length} moos`}
            </button>
          )}

          {/* Comment input — always visible */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder="Add a moo…"
              className="comment-input flex-1 bg-white/70 dark:bg-slate-800/60 rounded-full px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-500 border border-sky-200 dark:border-slate-600/50 outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800/80 transition-colors"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="rounded-full px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-sky-400 to-purple-400 disabled:opacity-40 transition-all hover:scale-[1.04] active:scale-[0.96] cursor-pointer"
            >
              Moo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ComicGrid — varied panel sizes like a comic layout
   ══════════════════════════════════════════════ */
const PANEL_SIZES = [
  "", // 1×1
  "wide", // 2×1
  "", // 1×1
  "tall", // 1×2
  "large", // 2×2
  "", // 1×1
  "wide", // 2×1
  "", // 1×1
  "mega", // 3×1
  "", // 1×1
  "tall", // 1×2
  "", // 1×1
  "wide", // 2×1
  "large", // 2×2
  "", // 1×1
  "", // 1×1
];

function PostMasonry({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="comic-grid">
      {posts.map((post, i) => {
        const sizeClass = PANEL_SIZES[i % PANEL_SIZES.length];
        return (
          <div
            key={post.id}
            className={`comic-panel${sizeClass ? " comic-panel--" + sizeClass : ""}`}
          >
            <PostCard post={post} />
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   GalleryPage
   ══════════════════════════════════════════════ */
export default function GalleryPage() {
  const { posts, dailyMood, unlockedSpecials } = useMoodContext();
  const todayId = dailyMood.mood.id;

  /* Seed default posts if the store is empty */
  const todayPosts = posts.filter((p) => p.moodId === todayId);
  const otherMoods = MOODS.filter((m) => m.id !== todayId);
  const pastGrouped = otherMoods
    .map((m) => ({
      mood: m,
      posts: posts.filter((p) => p.moodId === m.id),
    }))
    .filter((g) => g.posts.length > 0);

  /* Unlocked special moods with posts */
  const specialSections = unlockedSpecials
    .map((m) => ({
      mood: m,
      posts: posts.filter((p) => p.moodId === m.id),
    }))
    .filter((g) => g.posts.length > 0);

  const hasContent =
    todayPosts.length > 0 ||
    pastGrouped.length > 0 ||
    specialSections.length > 0;

  return (
    <div className="relative w-full min-h-screen bg-[#f0f8ff] dark:bg-[#0a0e1a] overflow-clip transition-colors">
      <BackgroundBlobs />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-0 pb-24">
        <NavBar active="feed" />

        {/* ── Today's Theme Hero ── */}
        <div className="flex flex-col items-center text-center pt-8 pb-6 gap-4">
          <div className="inline-flex items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-1.5 gap-2 border border-white/50 dark:border-slate-600/30 shadow-sm">
            <svg
              className="size-[15px] text-sky-400"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            <span className="text-purple-500 dark:text-purple-400 text-[13px] font-black tracking-[1.3px] uppercase">
              Daily Mood &middot; {dailyMood.mood.label}
            </span>
          </div>

          <h1 className="chrome-text text-[72px] font-black italic leading-[0.95] tracking-[-2px] max-w-[800px]">
            {dailyMood.mood.label}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-[17px] font-bold leading-relaxed max-w-[540px]">
            {dailyMood.mood.desc}
          </p>

          {/* ── Prompt — personal invitation ── */}
          <p className="text-slate-500 dark:text-slate-400 italic text-sm font-semibold leading-relaxed max-w-[480px] bg-white/50 dark:bg-slate-800/50 rounded-2xl px-5 py-3 border border-white/30 dark:border-slate-600/30 shadow-sm">
            {dailyMood.mood.prompt}
          </p>

          <Link
            href="/themes"
            className="inline-flex h-14 items-center rounded-full px-8 gap-2.5 border-[3px] border-white/70 dark:border-slate-600/50 bg-gradient-to-r from-sky-400 to-purple-400 shadow-[0_12px_34px_rgba(135,206,235,0.3)] transition-all hover:shadow-[0_16px_40px_rgba(135,206,235,0.4)] hover:scale-[1.02] active:scale-[0.98] no-underline relative overflow-hidden"
          >
            <div className="absolute inset-0 iridescent rounded-full opacity-25" />
            <svg
              className="size-[22px] text-white relative z-[1]"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="text-white text-xl font-black italic relative z-[1]">
              Post your {dailyMood.mood.label} mood
            </span>
          </Link>
        </div>

        {/* ── Content ── */}
        {/* ── Unlocked Special Moods ── */}
        {specialSections.map(({ mood, posts: moodPosts }) => (
          <section key={mood.id} className={`pt-8 pb-8 mood-${mood.id}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="limited-badge flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200/60 shadow-sm dark:from-purple-900/30 dark:to-pink-900/30 dark:border-purple-500/30">
                <svg
                  className="size-3.5 text-purple-500 dark:text-purple-400"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[1px]">
                  Limited Edition
                </span>
              </div>
              <div
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--mood-accent, #94a3b8)" }}
              />
              <h2 className="text-slate-600 dark:text-slate-300 text-base font-black tracking-[1px] uppercase shrink-0">
                {moodMeta[mood.id]?.icon} {mood.label}
              </h2>
              <div className="theme-divider flex-1" />
            </div>
            <p className="section-prompt">{mood.prompt}</p>
            <PostMasonry posts={moodPosts} />
          </section>
        ))}

        {!hasContent && (
          <div className="flex flex-col items-center justify-center pt-16 pb-16 gap-6">
            <div className="size-20 rounded-full bg-gradient-to-br from-sky-300 via-purple-300 to-green-300 flex items-center justify-center shadow-lg">
              <svg
                className="size-10 text-white"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-bold italic max-w-sm text-center">
              No moos yet. The herd is waiting for yours.
            </p>
            <Link
              href="/themes"
              className="inline-flex h-12 items-center rounded-full px-6 gap-2 bg-gradient-to-r from-sky-400 to-purple-400 text-white font-black italic text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] no-underline"
            >
              Compose your first mood
            </Link>
          </div>
        )}

        {/* ── Today's Posts ── */}
        {todayPosts.length > 0 && (
          <section className="pt-4 pb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-3 rounded-full bg-gradient-to-br from-sky-400 to-purple-400 shadow-[0_0_8px_rgba(135,206,235,0.3)] shrink-0" />
              <h2 className="text-slate-600 dark:text-slate-300 text-lg font-black tracking-[1.5px] uppercase shrink-0">
                Today&rsquo;s {dailyMood.mood.label} Moos
              </h2>
              <div className="theme-divider flex-1" />
            </div>
            <p className="section-prompt">{dailyMood.mood.prompt}</p>
            <PostMasonry posts={todayPosts} />
          </section>
        )}

        {/* ── Past Themes ── */}
        {pastGrouped.map(({ mood, posts: moodPosts }) => (
          <section key={mood.id} className={`pt-6 pb-8 mood-${mood.id}`}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--mood-accent, #94a3b8)" }}
              />
              <h2 className="text-slate-600 dark:text-slate-300 text-base font-black tracking-[1px] uppercase shrink-0">
                {moodMeta[mood.id].icon} {mood.label} Moos
              </h2>
              <div className="theme-divider flex-1" />
            </div>
            <p className="section-prompt">{mood.prompt}</p>
            <PostMasonry posts={moodPosts} />
          </section>
        ))}

        {/* Footer — CD reflection detail */}
        <div className="flex flex-col items-center justify-center pt-16 pb-4 gap-3 opacity-40">
          <div className="size-16 rounded-full bg-gradient-to-br from-sky-300/30 via-purple-300/30 to-green-300/30 dark:from-sky-500/20 dark:via-purple-500/20 dark:to-green-500/20 relative overflow-hidden">
            <div className="absolute inset-0 iridescent rounded-full opacity-60" />
          </div>
          <span className="text-slate-400 dark:text-slate-500 text-xs font-black italic tracking-[2px] uppercase">
            MOOd &mdash; share your daily mood
          </span>
        </div>
      </div>
    </div>
  );
}
