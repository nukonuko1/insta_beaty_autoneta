"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Session, Post, ScheduledPostEntry } from "@/types";

const MAX_SESSIONS = 50;

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage<Session[]>(
    "ig_gen_sessions",
    []
  );

  const addSession = useCallback(
    (input: string, posts: Post[]): string => {
      const id = `${Date.now()}`;
      const session: Session = {
        id,
        input,
        createdAt: new Date().toISOString(),
        posts,
      };
      setSessions((prev) => [session, ...prev].slice(0, MAX_SESSIONS));
      return id;
    },
    [setSessions]
  );

  const updatePost = useCallback(
    (sessionId: string, postId: string, updates: Partial<Post>) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                posts: s.posts.map((p) =>
                  p.id === postId ? { ...p, ...updates } : p
                ),
              }
            : s
        )
      );
    },
    [setSessions]
  );

  const scheduledPosts: ScheduledPostEntry[] = sessions.flatMap((s) =>
    s.posts
      .filter((p) => p.scheduledDate !== null)
      .map((p) => ({ post: p, session: s }))
  );

  const allFavorites: ScheduledPostEntry[] = sessions.flatMap((s) =>
    s.posts.filter((p) => p.favorite).map((p) => ({ post: p, session: s }))
  );

  return { sessions, addSession, updatePost, scheduledPosts, allFavorites };
}
