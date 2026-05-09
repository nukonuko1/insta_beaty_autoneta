"use client";

import { useState } from "react";
import { Session, Post } from "@/types";
import PostCard from "./PostCard";

interface Props {
  sessions: Session[];
  onUpdate: (sessionId: string, postId: string, updates: Partial<Post>) => void;
}

export default function HistoryPanel({ sessions, onUpdate }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favOnly, setFavOnly] = useState(false);

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📂</p>
        <p className="text-base font-medium">まだ生成履歴がありません</p>
        <p className="text-sm mt-1">
          「生成」タブで投稿文を作ると、ここに自動保存されます
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFavOnly(false)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
            !favOnly
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"
          }`}
        >
          すべて
        </button>
        <button
          type="button"
          onClick={() => setFavOnly(true)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
            favOnly
              ? "bg-yellow-400 text-white border-yellow-400"
              : "bg-white text-gray-500 border-gray-200 hover:border-yellow-300"
          }`}
        >
          ★ お気に入りのみ
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const visiblePosts = favOnly
            ? session.posts.filter((p) => p.favorite)
            : session.posts;

          if (favOnly && visiblePosts.length === 0) return null;

          const favCount = session.posts.filter((p) => p.favorite).length;
          const postedCount = session.posts.filter(
            (p) => p.status === "posted"
          ).length;
          const isExpanded = expandedId === session.id;

          return (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-purple-100 overflow-hidden"
            >
              <button
                type="button"
                className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-purple-50 transition-colors"
                onClick={() =>
                  setExpandedId(isExpanded ? null : session.id)
                }
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">
                    {new Date(session.createdAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-700 font-medium line-clamp-2">
                    {session.input}
                  </p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-gray-400">
                      {session.posts.length}件生成
                    </span>
                    {favCount > 0 && (
                      <span className="text-xs text-yellow-500">
                        ★ {favCount}件
                      </span>
                    )}
                    {postedCount > 0 && (
                      <span className="text-xs text-green-600">
                        ✓ {postedCount}件投稿済み
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-400 text-xs mt-1 shrink-0">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-purple-50 pt-3">
                  {visiblePosts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={
                        favOnly
                          ? session.posts.findIndex((p) => p.id === post.id)
                          : i
                      }
                      onUpdate={(updates) =>
                        onUpdate(session.id, post.id, updates)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
