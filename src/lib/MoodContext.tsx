"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  getOrCreateUser,
  getPosts,
  createPost,
  getComments,
  addComment,
  getDailyMood,
  toggleLike,
  hasLiked,
  getPostLikes,
  seedIfEmpty,
  seedSpecialsIfNeeded,
  getUnlockedSpecialMoods,
  type Post,
  type Comment,
  type UserIdentity,
  type SpecialMood,
} from "./store";

type MoodContextValue = {
  user: UserIdentity;
  posts: Post[];
  dailyMood: ReturnType<typeof getDailyMood>;
  unlockedSpecials: SpecialMood[];
  /** Creates a post with the daily mood (no manual mood selection) */
  create: (image: string, caption: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  getCommentsForPost: (postId: string) => Comment[];
  likePost: (postId: string) => boolean;
  checkLiked: (postId: string) => boolean;
  getLikesCount: (postId: string) => number;
  refresh: () => void;
};

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [user] = useState<UserIdentity>(getOrCreateUser);
  const [posts, setPosts] = useState<Post[]>([]);

  const refresh = useCallback(() => {
    setPosts(getPosts());
  }, []);

  /* Initialise — seed data on first visit, seed specials, then load */
  useEffect(() => {
    seedIfEmpty();
    seedSpecialsIfNeeded();
    refresh();
  }, [refresh]);

  /* Recheck for newly unlocked special moods every minute */
  useEffect(() => {
    const interval = setInterval(() => {
      seedSpecialsIfNeeded();
      refresh();
    }, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  /* Listen for storage changes from other tabs */
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key?.startsWith("mood_")) refresh();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refresh]);

  const dailyMood = getDailyMood();
  const unlockedSpecials = getUnlockedSpecialMoods();

  /* Auto-assign the daily mood — users can only post in today's style */
  const create = useCallback(
    (image: string, caption: string) => {
      createPost(image, caption, dailyMood.mood.id, user);
      refresh();
    },
    [user, dailyMood, refresh],
  );

  const addCommentToPost = useCallback(
    (postId: string, text: string) => {
      addComment(postId, text, user);
      refresh();
    },
    [user, refresh],
  );

  const getCommentsForPost = useCallback((postId: string) => {
    return getComments(postId);
  }, []);

  const likePost = useCallback(
    (postId: string) => {
      const liked = toggleLike(postId, user.id);
      refresh();
      return liked;
    },
    [user.id, refresh],
  );

  const checkLiked = useCallback(
    (postId: string) => hasLiked(postId, user.id),
    [user.id],
  );

  const getLikesCount = useCallback(
    (postId: string) => getPostLikes(postId),
    [],
  );

  return (
    <MoodContext.Provider
      value={{
        user,
        posts,
        dailyMood,
        unlockedSpecials,
        create,
        addCommentToPost,
        getCommentsForPost,
        likePost,
        checkLiked,
        getLikesCount,
        refresh,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export function useMoodContext() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMoodContext must be inside <MoodProvider>");
  return ctx;
}
