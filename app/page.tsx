"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";
import SeasonalSuggestions from "@/components/SeasonalSuggestions";
import SavedInputs from "@/components/SavedInputs";
import HistoryPanel from "@/components/HistoryPanel";
import CalendarView from "@/components/CalendarView";
import NotificationSetup from "@/components/NotificationSetup";
import { Post, RawPost } from "@/types";
import { useSessions } from "@/hooks/useSessions";
import { useSavedInputs } from "@/hooks/useSavedInputs";

const MAX_CHARS = 500;
const PLACEHOLDER = `例）福島市の美容室です。30代女性向けに、髪質改善トリートメントを売りたいです。梅雨の広がりやうねりに悩む人向けのInstagram投稿を作りたいです。`;

type Tab = "generate" | "saved" | "calendar";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "generate", label: "生成", icon: "✨" },
  { key: "saved", label: "保存済み", icon: "📂" },
  { key: "calendar", label: "カレンダー", icon: "📅" },
];

const HOW_TO_STEPS = [
  {
    num: "1",
    title: "お店の情報を入力",
    desc: "業種・特徴・ターゲット・売りたいサービスなどを自由に書いてください。",
  },
  {
    num: "2",
    title: "ボタンを押す",
    desc: "「投稿文を生成する」を押すだけで、10種類の投稿文が完成します。",
  },
  {
    num: "3",
    title: "コピーしてInstagramへ",
    desc: "気に入った投稿文のコピーボタンを押して、Instagramに貼り付けるだけ。",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [userInput, setUserInput] = useState("");
  const [currentPosts, setCurrentPosts] = useState<Post[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [inputSaved, setInputSaved] = useState(false);

  const { sessions, addSession, updatePost, scheduledPosts } = useSessions();
  const { savedInputs, saveInput, removeInput } = useSavedInputs();

  // Core generation — accepts input directly to avoid stale closure issues
  const handleGenerateWith = async (input: string) => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    setCurrentPosts([]);
    setCurrentSessionId(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "エラーが発生しました。");
        return;
      }

      const rawPosts: RawPost[] = data.posts ?? [];
      const posts: Post[] = rawPosts.map((p, i) => ({
        ...p,
        id: `${Date.now()}-${i}`,
        favorite: false,
        status: "draft",
        scheduledDate: null,
      }));

      setCurrentPosts(posts);
      const sid = addSession(input, posts);
      setCurrentSessionId(sid);
    } catch {
      setError(
        "通信エラーが発生しました。インターネット接続を確認してもう一度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => handleGenerateWith(userInput);

  const handleUpdateCurrentPost = (postId: string, updates: Partial<Post>) => {
    setCurrentPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updates } : p))
    );
    if (currentSessionId) {
      updatePost(currentSessionId, postId, updates);
    }
  };

  // Append seasonal theme AND immediately trigger generation with the new text
  const handleAppendSuggestion = (theme: string) => {
    const suffix = userInput.trim() ? `、${theme}` : theme;
    const newInput = (userInput + suffix).slice(0, MAX_CHARS);
    setUserInput(newInput);
    void handleGenerateWith(newInput);
  };

  // Load saved input into textarea (user can edit before generating)
  const handleLoadSavedInput = (input: string) => {
    setUserInput(input);
  };

  const handleSaveInput = () => {
    if (!userInput.trim()) return;
    saveInput(userInput);
    setInputSaved(true);
    setTimeout(() => setInputSaved(false), 2000);
  };

  const handleCopyAll = async () => {
    if (currentPosts.length === 0) return;
    const text = currentPosts
      .map(
        (p, i) =>
          `【投稿${i + 1}】${p.title}\n\n${p.body}\n\n${p.cta}\n\n${p.hashtags.join(" ")}`
      )
      .join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-xl">✨</span>
            <span className="font-bold text-purple-700 text-base">
              Instagram投稿ジェネレーター
            </span>
          </div>
          {/* Tab nav */}
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === tab.key
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                {tab.icon} {tab.label}
                {tab.key === "saved" && sessions.length > 0 && (
                  <span
                    className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === "saved"
                        ? "bg-white/30 text-white"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {sessions.length}
                  </span>
                )}
                {tab.key === "calendar" && scheduledPosts.length > 0 && (
                  <span
                    className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === "calendar"
                        ? "bg-white/30 text-white"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {scheduledPosts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-16">
        {/* ── Generate Tab ── */}
        {activeTab === "generate" && (
          <>
            <section className="pt-8 pb-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-snug mb-3">
                Instagram投稿文を10個、
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  30秒で自動生成
                </span>
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                お店の特徴を入力するだけで、投稿ネタ・本文・
                <br className="hidden sm:block" />
                ハッシュタグ・CTAまでまとめて作れます。
              </p>
            </section>

            {/* Notification reminder setup */}
            <NotificationSetup />

            {/* Input card */}
            <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 sm:p-6 mb-6">
              <SeasonalSuggestions onSelect={handleAppendSuggestion} />

              {/* Saved inputs */}
              <SavedInputs
                savedInputs={savedInputs}
                onLoad={handleLoadSavedInput}
                onRemove={removeInput}
              />

              <label
                htmlFor="userInput"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                お店の情報・売りたいサービスを入力してください
              </label>
              <textarea
                id="userInput"
                value={userInput}
                onChange={(e) =>
                  setUserInput(e.target.value.slice(0, MAX_CHARS))
                }
                placeholder={PLACEHOLDER}
                rows={5}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition"
              />
              <div className="flex items-center justify-between mt-1">
                <button
                  type="button"
                  onClick={handleSaveInput}
                  disabled={!userInput.trim()}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    inputSaved
                      ? "bg-green-50 border-green-300 text-green-600"
                      : "bg-white border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
                >
                  {inputSaved ? "✓ 保存しました" : "📌 入力を保存"}
                </button>
                <p
                  className={`text-xs font-medium ${
                    userInput.length >= MAX_CHARS
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {userInput.length}/{MAX_CHARS}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !userInput.trim()}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 px-6 rounded-xl text-base shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isLoading
                  ? "投稿文を生成中です..."
                  : "投稿文を生成する ✨"}
              </button>
            </section>

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-sm border border-purple-100">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-600 font-medium">
                    投稿文を生成中です...
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Results */}
            {currentPosts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800 text-lg">
                    生成された投稿文
                    <span className="text-purple-500 ml-1">
                      ({currentPosts.length}件)
                    </span>
                  </h2>
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                      allCopied
                        ? "bg-green-50 border-green-300 text-green-600"
                        : "bg-white border-purple-200 text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    {allCopied ? "✓ 全部コピーしました" : "全部まとめてコピー"}
                  </button>
                </div>

                <p className="text-xs text-gray-400 mb-3">
                  ★ でお気に入り保存、ステータスや日付も設定できます
                </p>

                <div className="space-y-4">
                  {currentPosts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={i}
                      onUpdate={(updates) =>
                        handleUpdateCurrentPost(post.id, updates)
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* How to use — shown only before first generation */}
            {currentPosts.length === 0 && !isLoading && (
              <section className="mt-8">
                <h2 className="text-center font-bold text-gray-700 mb-5 text-base">
                  かんた〉3ステップで使えます
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {HOW_TO_STEPS.map((step) => (
                    <div
                      key={step.num}
                      className="bg-white rounded-2xl border border-purple-100 p-4 text-center shadow-sm"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-base mx-auto mb-3">
                        {step.num}
                      </div>
                      <p className="font-semibold text-gray-800 text-sm mb-1">
                        {step.title}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── Saved Tab ── */}
        {activeTab === "saved" && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">生成履歴</h2>
              <span className="text-xs text-gray-400">
                {sessions.length}件保存済み
              </span>
            </div>
            <HistoryPanel sessions={sessions} onUpdate={updatePost} />
          </div>
        )}

        {/* ── Calendar Tab ── */}
        {activeTab === "calendar" && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">
                投稿カレンダー
              </h2>
              <span className="text-xs text-gray-400">
                {scheduledPosts.length}件予定
              </span>
            </div>
            <CalendarView
              scheduledPosts={scheduledPosts}
              onUpdate={updatePost}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/60">
        <div className="max-w-2xl mx-auto px-4 py-5 text-center text-xs text-gray-400">
          <p>Instagram投稿ジェネレーター — 小規模店舗向け無料ツール</p>
        </div>
      </footer>
    </div>
  );
}
