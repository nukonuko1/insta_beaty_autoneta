"use client";

interface Props {
  savedInputs: string[];
  onLoad: (input: string) => void;
  onRemove: (index: number) => void;
}

export default function SavedInputs({ savedInputs, onLoad, onRemove }: Props) {
  if (savedInputs.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 font-semibold mb-2">
        📌 保存した入力（タップで読み込み）
      </p>
      <div className="flex flex-col gap-1.5">
        {savedInputs.map((input, i) => (
          <div key={i} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onLoad(input)}
              className="flex-1 text-left text-xs bg-gray-50 text-gray-700 px-3 py-2 rounded-xl border border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all truncate"
            >
              {input}
            </button>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors rounded-full hover:bg-red-50 text-base leading-none"
              aria-label="削除"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
