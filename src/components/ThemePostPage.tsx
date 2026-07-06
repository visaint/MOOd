"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { useMoodContext } from "@/lib/MoodContext";

export default function ThemePostPage() {
  const router = useRouter();
  const { create, dailyMood, user } = useMoodContext();

  const [imageData, setImageData] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Handle file selection ── */
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image too large. Max 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setImageData(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = e.clipboardData.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  /* ── Submit ── */
  const handleSubmit = () => {
    if (posting) return;
    if (!imageData) {
      alert("Drop or select an image first.");
      return;
    }
    if (!caption.trim()) {
      alert("Add a caption before posting.");
      return;
    }
    setPosting(true);
    create(imageData, caption.trim());
    router.push("/");
  };

  const charLimit = 220;

  return (
    <div
      className="relative w-full min-h-screen bg-[#f0f8ff] overflow-clip"
      onPaste={handlePaste}
    >
      <BackgroundBlobs />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-0 pb-24">
        <NavBar active="themes" />

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center pt-8 pb-8 gap-4">
          <div className="inline-flex items-center bg-white/50 backdrop-blur-sm rounded-full px-4 py-1.5 gap-2 border border-white/50 shadow-sm">
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
            <span className="text-purple-500 text-[13px] font-black tracking-[1.3px] uppercase">
              Today&rsquo;s mood &middot; {dailyMood.mood.label}
            </span>
          </div>

          <h1 className="chrome-text text-[64px] font-black italic leading-[0.95] tracking-[-2px] max-w-[700px]">
            Post your {dailyMood.mood.label} mood
          </h1>

          <p className="text-slate-600 text-[17px] font-bold leading-relaxed max-w-[540px]">
            {dailyMood.mood.desc}
          </p>
        </div>

        {/* ── Composer ── */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/50 shadow-[0_8px_32px_rgba(135,206,235,0.06)] grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ── Left: Image upload ── */}
          <div className="flex flex-col gap-4">
            <div className="text-sky-500 text-[15px] font-black tracking-[1.5px] uppercase">
              1 &middot; Drop your image
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-1 min-h-[320px] flex-col justify-center items-center border-dashed rounded-3xl gap-4 border-[3px] transition-all cursor-pointer ${
                imageData
                  ? "border-green-300 bg-green-50/30"
                  : "border-purple-300/50 bg-gradient-to-br from-green-50/50 to-purple-50/50 hover:border-purple-400/70 hover:bg-white/50"
              }`}
            >
              {imageData ? (
                <div className="relative w-full h-full min-h-[280px] flex flex-col items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageData}
                    alt="Preview"
                    className="max-h-[260px] max-w-full rounded-2xl object-contain shadow-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageData(null);
                    }}
                    className="mt-3 text-xs font-black text-rose-500 bg-white/80 rounded-full px-4 py-1.5 border border-rose-200 hover:bg-rose-50 transition-colors"
                  >
                    Remove &amp; choose another
                  </button>
                </div>
              ) : (
                <>
                  <div className="size-[80px] flex justify-center items-center rounded-full bg-gradient-to-br from-sky-300 via-purple-300 to-green-300 shadow-[0_8px_22px_rgba(135,206,235,0.3)] relative overflow-hidden">
                    <div className="absolute inset-0 iridescent rounded-full opacity-40" />
                    <svg
                      className="size-9 text-white relative z-[1]"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      <polyline points="16 16 12 12 8 16" />
                    </svg>
                  </div>
                  <span className="text-purple-500 text-xl font-black italic">
                    Drag a photo here
                  </span>
                  <span className="text-slate-500 text-[13px] font-bold">
                    or click to browse &middot; JPG, PNG up to 10 MB
                  </span>
                  <span className="text-slate-400 text-[11px] font-semibold">
                    You can also paste from clipboard
                  </span>
                  <div className="flex items-center bg-white/80 rounded-full px-6 py-2.5 gap-2 border-2 border-green-300 transition-all hover:border-green-400 hover:bg-white cursor-pointer">
                    <svg
                      className="size-4 text-green-500"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-green-600 text-sm font-black">
                      Choose file
                    </span>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </div>

          {/* ── Right: Caption & submit ── */}
          <div className="flex flex-col gap-4">
            {/* Caption */}
            <div className="text-purple-500 text-[15px] font-black tracking-[1.5px] uppercase">
              2 &middot; Say your moo
            </div>
            <div className="flex flex-col min-h-[180px] bg-white/80 rounded-3xl p-5 gap-2 border-2 border-sky-200/70 transition-all focus-within:border-sky-300 cursor-text">
              <span className="text-purple-400 text-xs font-black tracking-[1.2px] uppercase">
                Caption
              </span>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, charLimit))}
                placeholder="how does today feel? keep it soft, keep it real…"
                className="w-full flex-1 bg-transparent text-slate-600 text-base font-bold placeholder:text-slate-300 resize-none border-none outline-none focus:ring-0"
                rows={3}
              />
              <span className="mt-auto text-purple-300 text-xs font-black self-end">
                {caption.length} / {charLimit}
              </span>
            </div>

            {/* ── Today's mood info ── */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
              <div className="flex items-center gap-2">
                <div
                  className={`size-5 rounded-full bg-gradient-to-br ${user.color}`}
                />
                <span className="text-slate-400 text-xs font-semibold">
                  Posting as{" "}
                  <span className="text-sky-500 font-black">{user.name}</span>
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 mood-badge">
                <span>
                  {["☁️", "💜", "📀", "🌑", "🌀", "⚡", "💿"][dailyMood.index]}
                </span>
                <span>{dailyMood.mood.label}</span>
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              onClick={handleSubmit}
              disabled={posting}
              className="flex h-[60px] justify-center items-center mt-auto rounded-full gap-2.5 border-[3px] border-white/70 bg-gradient-to-r from-sky-400 to-purple-400 shadow-[0_12px_30px_rgba(135,206,235,0.25)] transition-all hover:shadow-[0_16px_36px_rgba(135,206,235,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 iridescent rounded-full opacity-25" />
              <svg
                className="size-5 text-white relative z-[1]"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span className="text-white text-lg font-black italic relative z-[1]">
                {posting ? "Posting…" : "Moo it to the herd"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
