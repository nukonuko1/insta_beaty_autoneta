"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface NotifSettings {
  enabled: boolean;
  hour: number;
  notifiedDate: string;
}

const DEFAULT: NotifSettings = { enabled: false, hour: 18, notifiedDate: "" };

export default function NotificationSetup() {
  const [settings, setSettings] = useLocalStorage<NotifSettings>(
    "ig_notif_settings",
    DEFAULT
  );
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [expanded, setExpanded] = useState(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  // Check if it's time to show notification (fires when page is open)
  useEffect(() => {
    if (
      typeof Notification === "undefined" ||
      !settings.enabled ||
      permission !== "granted"
    )
      return;

    const check = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const curr = settingsRef.current;
      if (curr.notifiedDate === today) return;
      if (now.getHours() >= curr.hour) {
        new Notification("Instagram投稿の時間です！", {
          body: "今日の投稿文を作りましょう。お店の最新情報をシェアしよう✨",
          icon: "/favicon.ico",
        });
        setSettings((prev) => ({ ...prev, notifiedDate: today }));
      }
    };

    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.enabled, permission]);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setSettings((prev) => ({ ...prev, enabled: true }));
    }
  };

  // Hide if notifications are permanently denied
  if (permission === "denied") return null;

  const isActive = settings.enabled && permission === "granted";

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-4 mb-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔔</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              毎日の投稿リマインダー
            </p>
            <p className="text-xs text-gray-400">
              {isActive
                ? `毎日 ${settings.hour}:00 に通知します`
                : "投稿習慣をサポートします"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
          <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-purple-50 space-y-3">
          {permission !== "granted" ? (
            <button
              type="button"
              onClick={requestPermission}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all"
            >
              通知を許可して習慣化する
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">通知を有効にする</span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      enabled: !prev.enabled,
                    }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.enabled ? "bg-purple-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      settings.enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {settings.enabled && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">通知時刻</span>
                  <select
                    value={settings.hour}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        hour: Number(e.target.value),
                        notifiedDate: "",
                      }))
                    }
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-300"
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
