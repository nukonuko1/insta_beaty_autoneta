"use client";

import { useState } from "react";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const [copied, setCopied] = useState(false);

  const fullText = `【${post.title}】\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(" ")}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-4 py-3 flex items-center justify-between">
        <span className="text-white text-sm font-semibold">投稿 {index + 1}</span>
        <button
          onClick={handleCopy}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
            copied
              ? "bg-white text-green-600"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          {copied ? "✓ コピーしました" : "コピー"}
        </button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-gray-800 text-base leading-snug">
          {post.title}
        </h3>

        <div>
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">
            本文
          </p>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {post.body}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-pink-500 uppercase tracking-wide mb-1">
            CTA
          </p>
          <p className="text-gray-700 text-sm">{post.cta}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">
            ハッシュタグ
          </p>
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag, i) => (
              <span
                key={i}
                className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
