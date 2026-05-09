"use client";

import { useState } from "react";
import { Post, ScheduledPostEntry } from "@/types";
import PostCard from "./PostCard";

interface Props {
  scheduledPosts: ScheduledPostEntry[];
  onUpdate: (sessionId: string, postId: string, updates: Partial<Post>) => void;
}

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayMon(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }
function pad(n: number) { return String(n).padStart(2, "0"); }

export default function CalendarView({ scheduledPosts, onUpdate }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const totalDays = daysInMonth(year, month);
  const offset = firstDayMon(year, month);
  const monthStr = `${year}-${pad(month + 1)}`;
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const byDate = scheduledPosts.reduce<Record<string, ScheduledPostEntry[]>>((acc, entry) => {
    const d = entry.post.scheduledDate;
    if (d && d.startsWith(monthStr)) acc[d] = [...(acc[d] ?? []), entry];
    return acc;
  }, {});

  const prevMonth = () => { setSelectedDate(null); month === 0 ? (setYear(y => y - 1), setMonth(11)) : setMonth(m => m - 1); };
  const nextMonth = () => { setSelectedDate(null); month === 11 ? (setYear(y => y + 1), setMonth(0)) : setMonth(m => m + 1); };

  return (
    <div className="space-y-4">
      {scheduledPosts.length === 0 && (
        <div className="bg-purple-50 rounded-2xl p-4 text-center text-sm text-purple-600">
          📅 投稿カードの「日付を設定」から、この月のどの日に投稿するかを決められます
        </div>
      )}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-purple-100 px-4 py-3">
        <button type="button" onClick={prevMonth} className="text-gray-400 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">◀</button>
        <div className="text-center">
          <p className="font-bold text-gray-800">{year}年{month + 1}月</p>
          {Object.keys(byDate).length > 0 && <p className="text-xs text-purple-500">{Object.keys(byDate).length}日に投稿予定</p>}
        </div>
        <button type="button" onClick={nextMonth} className="text-gray-400 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">▶</button>
      </div>
      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-purple-50">
          {DAY_LABELS.map((d, i) => (
            <div key={d} className={`text-center py-2 text-xs font-semibold ${i === 5 ? "text-blue-500" : i === 6 ? "text-red-500" : "text-gray-500"}`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: offset }).map((_, i) => <div key={`off-${i}`} className="h-12 border-b border-r border-purple-50/50" />)}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${monthStr}-${pad(day)}`;
            const entries = byDate[dateStr] ?? [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const dow = (offset + i) % 7;
            return (
              <button key={day} type="button" onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`h-12 border-b border-r border-purple-50/50 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isSelected ? "bg-purple-100" : isToday ? "bg-pink-50" : "hover:bg-gray-50"
                }`}>
                <span className={`text-xs font-medium leading-none ${
                  isToday ? "text-pink-600 font-bold" : dow === 5 ? "text-blue-500" : dow === 6 ? "text-red-500" : "text-gray-700"
                }`}>{day}</span>
                {entries.length > 0 && (
                  <div className="flex gap-0.5">
                    {entries.slice(0, 3).map((_, pi) => <div key={pi} className="w-1.5 h-1.5 rounded-full bg-purple-400" />)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {selectedDate && (
        <div>
          <h3 className="font-bold text-gray-700 mb-3 text-sm">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("ja-JP", { month: "long", day: "numeric" })} の投稿
          </h3>
          {(byDate[selectedDate] ?? []).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6 bg-white rounded-2xl border border-purple-100">この日に予定された投稿はありません</p>
          ) : (
            <div className="space-y-3">
              {(byDate[selectedDate] ?? []).map(({ post, session }) => (
                <PostCard key={post.id} post={post}
                  index={session.posts.findIndex((p) => p.id === post.id)}
                  onUpdate={(updates) => onUpdate(session.id, post.id, updates)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
