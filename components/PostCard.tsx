"use client";

import { useState } from "react";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  index: number;
  onUpdate?: (updates: Partial<Post>) => void;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "下書き", color: "text-gray-500 bg-gray-100" },
  { value: "scheduled", label: "投稿予定", color: "text-blue-600 bg-blue-50" },
  { value: "posted", label: "投稿済み ✓", color: "text-green-600 bg-green-50" },
] as const;

export default function PostCard({ post, index, onUpdate }: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const fullText = `《${post.title}》\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(" ")}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      const el = document.createElement("textarea");
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === post.status) ?? STATUS_OPTIONS[0];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200 ${
      post.status === "posted" ? "border-green-200 opacity-75" : "border-purple-100"
    }`}>
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white text-sm font-semibold shrink-0">投稿 {index + 1}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onUpdate && (
            <button type="button" onClick={() => onUpdate({ favorite: !post.favorite })}
              className={`text-xl leading-none transition-transform active:scale-90 ${
                post.favorite ? "text-yellow-300" : "text-white/40 hover:text-white/70"
              }`} aria-label={post.favorite ? "お気に入り解除" : "お気に入りに追加"}>
              ★
            </button>
          )}
          <button type="button" onClick={handleCopy}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
              copied ? "bg-white text-green-600" : "bg-white/20 text-white hover:bg-white/30"
            }`}>
            {copied ? "✓ コピー済み" : "コピー"}
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-gray-800 text-base leading-snug">{post.title}</h3>
        <div>
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">本文</p>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{post.body}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-pink-500 uppercase tracking-wide mb-1">CTA</p>
          <p className="text-gray-700 text-sm">{post.cta}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">ハッシュタグ</p>
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        {onUpdate && (
          <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2">
            <select value={post.status} onChange={(e) => onUpdate({ status: e.target.value as Post["status"] })}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-300">
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {showDate ? (
              <input type="date" defaultValue={post.scheduledDate ?? ""} autoFocus
                onChange={(e) => { onUpdate({ scheduledDate: e.target.value || null }); setShowDate(false); }}
                onBlur={() => setShowDate(false)}
                className="text-xs border border-purple-200 rounded-lg px-2 py-1.5 bg-white text-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-300" />
            ) : (
              <button type="button" onClick={() => setShowDate(true)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors">
                {post.scheduledDate ? `📅 ${post.scheduledDate}` : "📅 日付を設定"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
