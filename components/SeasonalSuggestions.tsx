"use client";

const MONTHLY_THEMES: Record<number, string[]> = {
  1: ["お正月明けケア", "新年の目標", "冬の乾燥対策", "バレンタイン準備"],
  2: ["バレンタインギフト", "節分イベント", "春の足音", "冬ダメージケア"],
  3: ["春支度", "卒業・入学シーズン", "花粉対策", "ホワイトデー"],
  4: ["新生活スタート", "お花見", "春の新メニュー", "GW前準備"],
  5: ["GW限定", "母の日ギフト", "初夏の準備", "衣替えケア"],
  6: ["梅雨の髪ケア", "ジューンブライド", "紫外線対策", "夏に向けた準備"],
  7: ["夏本番キャンペーン", "七夕イベント", "夏休みギフト", "熱中症対策"],
  8: ["お盆休み", "UVダメージケア", "夏バテ対策", "秋準備スタート"],
  9: ["秋の変化ケア", "敢老の日ギフト", "衣替えシーズン", "食欲の秋"],
  10: ["ハロウィン山画", "秋の美容", "行樽シーズン", "冬準備"],
  11: ["七五三", "冬支度", "年末準備", "感謝祭キャンペーン"],
  12: ["クリスマスギフト", "年末年始準備", "冬のご蚁美ケア", "来年への抑迟"],
};

interface Props {
  onSelect: (theme: string) => void;
}

export default function SeasonalSuggestions({ onSelect }: Props) {
  const month = new Date().getMonth() + 1;
  const themes = MONTHLY_THEMES[month] ?? [];
  return (
    <div className="mb-4">
      <p className="text-xs text-purple-500 font-semibold mb-2">✨ {month}月のおすすめテーマ（タップで入力に追加）</p>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button key={theme} type="button" onClick={() => onSelect(theme)}
            className="bg-purple-50 text-purple-600 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-200 hover:bg-purple-100 active:scale-95 transition-all">
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
