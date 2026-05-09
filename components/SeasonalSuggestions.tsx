"use client";

// 月・季節・イベントを考慮し6テーマ/月
const MONTHLY_THEMES: Record<number, string[]> = {
  1: [
    "お正月明けケア",
    "成人の日キャンペーン",
    "冬の乾燥対策",
    "新年の目標達成",
    "バレンタイン早割準備",
    "初売り・お得情報",
  ],
  2: [
    "バレンタインギフト",
    "節分イベント",
    "春の足音",
    "冬ダメージケア",
    "ホワイトデー準備",
    "花粉シーズン前",
  ],
  3: [
    "ひな祭り企画",
    "卒業・入学シーズン",
    "花粉対策",
    "ホワイトデー",
    "春の新メニュー",
    "春分の日キャンペーン",
  ],
  4: [
    "新生活スタート",
    "お花見と事ール",
    "春の新メニュー",
    "GW前準備",
    "新学期応援",
    "春の紫外線対策",
  ],
  5: [
    "GW限定",
    "母の日ギフト",
    "初夏の準備",
    "衣替えケア",
    "子どもの日企画",
    "梅雨前集中ケア",
  ],
  6: [
    "梅雨の髪ケア",
    "ジューンブライド",
    "父の日ギフト",
    "紫外線・UV対策",
    "夏に向けた準備",
    "夏至キャンペーン",
  ],
  7: [
    "夏本番キャンペーン",
    "七夕イベント",
    "夏休みギフト",
    "海の日",
    "サマーセール",
    "熱中症・夏バテ対策",
  ],
  8: [
    "お盆休み",
    "UVダメージケア",
    "夏バテ対策",
    "夏の終わりセール",
    "秋準備スタート",
    "スポーツの秋準備",
  ],
  9: [
    "秋の変化ケア",
    "敬老の日ギフト",
    "衣替えシーズン",
    "食欲の秋",
    "シルバーウィーク",
    "秋の美容強化月間",
  ],
  10: [
    "ハロウィン企画",
    "秋の美容",
    "行楽シーズン",
    "紅葉シーズン",
    "冬準備スタート",
    "体育の日キャンペーン",
  ],
  11: [
    "七五三",
    "冬支度",
    "年末準備",
    "感謝祭キャンペーン",
    "勤労感謝の日",
    "ブラックフライデー",
  ],
  12: [
    "クリスマスギフト",
    "年末年始準備",
    "冬のご襲美ケア",
    "冬至キャンペーン",
    "年末セール",
    "来年への抑豚",
  ],
};

interface Props {
  onSelect: (theme: string) => void;
}

export default function SeasonalSuggestions({ onSelect }: Props) {
  const month = new Date().getMonth() + 1;
  const themes = MONTHLY_THEMES[month] ?? [];

  return (
    <div className="mb-4">
      <p className="text-xs text-purple-500 font-semibold mb-2">
        ✨ {month}月のおすすめテーマ（タップで入力＋自動生成）
      </p>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => onSelect(theme)}
            className="bg-purple-50 text-purple-600 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-200 hover:bg-purple-100 active:scale-95 transition-all"
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
