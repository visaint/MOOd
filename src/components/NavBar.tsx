"use client";

import Link from "next/link";
import { useDarkMode } from "@/lib/DarkModeContext";

type NavBarProps = {
  active: "feed" | "themes";
};

export default function NavBar({ active }: NavBarProps) {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <div className="nav-bar flex relative h-[76px] shrink-0 items-center z-[2] mt-6 mb-0 bg-white/60 shadow-[0_4px_24px_rgba(135,206,235,0.08)] backdrop-blur-xl rounded-[26px] px-6 py-0 mx-0 gap-4 border border-white/40 transition-colors">
      {/* Logo */}
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2.5 no-underline"
      >
        <div className="size-[46px] flex justify-center items-center rounded-full bg-gradient-to-br from-sky-300 via-purple-300 to-green-300 shadow-[0_4px_14px_rgba(135,206,235,0.3)] relative overflow-hidden">
          <div className="absolute inset-0 iridescent rounded-full opacity-60" />
          <svg
            className="size-[26px] text-white relative z-[1] drop-shadow-sm"
            fill="currentColor"
            viewBox="0 0 512 512"
          >
            <path d="M468.958 108.958c-27.507 2.08-48.997 7.94-71.375 22.572-5.333-2.214-12.62-17.738-16-16-11.82 6.08-14.892 19.555-4.916 32.817l-59.084 9.916c-24.776 3.341-49.567 4.838-74.187 5.334 1.326 3.832 2.96 7.636 4.812 10.05 5.219 6.802 20.323 6.21 21.07 14.75 1.935 22.098-24.876 47.415-47.056 47.057-15.401-.248-17.017-28.762-31.604-33.713-19.097-6.482-41.62 18.77-59.699 9.832-15.267-7.547-24.992-39.8-27.836-50.41-10.213-.127-20.327-.142-30.316.035-12.564.366-22.902 5.645-29.408 14.239-8.676 11.458-11.652 26.658-13.254 42.925-1.78 18.057 6.147 53.007 5.517 70.282-.504 13.85-7.493 11.87-11.912 18.888-13.52 21.47 8.894 20.83 17.014 5.56 12.482-23.473 4.253-63.11 7.195-92.974 1.855-35.76 10.597-23.937 15.664-24.588-4.2 13.065-6.21 30.962-7 51.334 6.895-2.342 36.498-11.6 42.73-.174 6.872 12.598-27.802 22.016-23.878 35.819 2.464 8.666 22.95 2.378 24.582 11.238 3.322 18.035-32.13 38.713-42.236 44.209.812 23.329 1.564 45.567 1.238 65.086H88.91c-4.234-16.543-12.038-49.944-4.06-55.084 21.425-18.091 29.836-37.484 42.732-56.428 8.755 2.556 16.92 4.787 24.782 6.672 3.553.972 7.244 1.771 10.984 2.44 24.859 4.967 61.553 5.678 90.783-.172 3.76 34.12 7.263 68.452 4.602 102.572h28.957c-12.375-26.902-4.263-65.044 13.892-86.27l44.934-33.462c24.881-16.384 42.93-37.996 55.982-63.38 30.402 3.413 57.086 3.29 77.192-.786l12.84-19.55c-24.257-17.857-43.3-36.585-62.948-58.13 10.063-14.533 25.027-22.765 39.375-32.506zm-39.375 54.572a8 8 0 1 1 0 16 8 8 0 0 1 0-16z" />
          </svg>
        </div>
        <span className="chrome-text text-3xl font-black italic tracking-[-0.75px]">
          MOOd
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex justify-center items-center flex-1 gap-7">
        <Link
          href="/"
          className={`flex items-center text-[15px] gap-1.5 no-underline transition-all hover:opacity-80 ${
            active === "feed"
              ? "text-sky-600 dark:text-sky-400 font-black underline decoration-green-400 decoration-[3px] underline-offset-4"
              : "text-sky-500 dark:text-sky-400 font-bold"
          }`}
        >
          <svg
            className="size-4"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Feed
        </Link>
        <Link
          href="/themes"
          className={`flex items-center text-[15px] gap-1.5 no-underline transition-all hover:opacity-80 ${
            active === "themes"
              ? "text-purple-600 dark:text-purple-400 font-black underline decoration-green-400 decoration-[3px] underline-offset-4"
              : "text-purple-500 dark:text-purple-400 font-bold"
          }`}
        >
          <svg
            className="size-4"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          Compose
        </Link>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        className="flex size-[46px] shrink-0 items-center justify-center rounded-full border border-white/40 dark:border-slate-600/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm transition-all hover:scale-[1.08] active:scale-[0.95] cursor-pointer"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          /* Sun — click to switch to light */
          <svg
            className="size-5 text-amber-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm8.66-10.34a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0zM6.34 18.34a1 1 0 0 1 0-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41 0zM21 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h16a1 1 0 0 1 1 1zM5.66 5.66a1 1 0 0 1 1.41 0l.7.7a1 1 0 0 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41zm14.68 14.68a1 1 0 0 1-1.41 0l-.7-.7a1 1 0 1 1 1.41-1.41l.7.7a1 1 0 0 1 0 1.41z" />
          </svg>
        ) : (
          /* Moon — click to switch to dark */
          <svg
            className="size-5 text-indigo-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z" />
          </svg>
        )}
      </button>

      <Link
        href="/themes"
        className="flex h-[46px] shrink-0 items-center rounded-full px-5 gap-2 border border-white/70 dark:border-slate-600/50 no-underline bg-gradient-to-r from-sky-400 to-purple-400 shadow-[0_6px_18px_rgba(135,206,235,0.25)] transition-all hover:shadow-[0_8px_24px_rgba(135,206,235,0.35)] hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
      >
        <div className="absolute inset-0 iridescent rounded-full opacity-30" />
        <span className="text-white text-[15px] font-black relative z-[1]">
          Post a Moo
        </span>
      </Link>
    </div>
  );
}
