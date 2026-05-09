import { NextRequest, NextResponse } from "next/server";
import { RawPost } from "@/types";

const DUMMY_POSTS: RawPost[] = [
  {
    title: "梅雨の髪の広がり、我慢していませんか？",
    body: "梅雨になると、朝きれいに整えた髪がすぐに広がってしまう…。\nそんなお悩みには、髪の内側から整える髪質改善トリートメントがおすすめです。\n湿気に負けにくい、まとまりやすい髪を目指しませんか？",
    hashtags: ["#髪質改善", "#梅雨対策", "#うねり改善", "#トリートメント", "#サロン"],
    cta: "ご相談はDMからお気軽にどうぞ。",
  },
  {
    title: "今すぐ試してほしい！季節のおすすめメニュー",
    body: "季節の変わり目は、髪や肌にとってもデリケートな時期。\nこの時期こそ、プロのケアで集中的にいたわってみてください。\n一度体験したら、その変化にきっと驚くはずです。",
    hashtags: ["#季節ケア", "#プロの技術", "#サロンケア", "#美髪", "#おすすめ"],
    cta: "プロフィールのリンクから予約できます。",
  },
  {
    title: "before→afterで一目瞭然！こんなに変わります",
    body: "施術前と後を比べると、その差は歴然。\n「こんなに変わるとは思わなかった！」というお声を多数いただいています。\n写真で違いを確認してみてください。",
    hashtags: ["#ビフォーアフター", "#仕上がり", "#変化", "#実感", "#美容"],
    cta: "お気軽にDMでご相談ください。",
  },
  {
    title: "「どんなメニューが向いているか分からない」というあなたへ",
    body: "初めての方からよくいただくご質問です。\nカウンセリングでお悩みをしっかり聞いてから、最適なメニューをご提案します。\n迷っている方こそ、まず気軽にご相談ください。",
    hashtags: ["#カウンセリング", "#初めての方", "#安心", "#丁寧な対応", "#ご相談"],
    cta: "DMまたはお電話でお気軽にどうぞ。",
  },
  {
    title: "知っておきたい！正しいホームケアのコツ",
    body: "サロンでのケアも大切ですが、毎日のホームケアがより重要。\nシャンプーの仕方ひとつで、髪の仕上がりが大きく変わります。\n次回来店時にスタッフへ気軽に聞いてみてください。",
    hashtags: ["#ホームケア", "#ヘアケア", "#豆知識", "#毎日ケア", "#美髪習慣"],
    cta: "来店時にスタッフへ何でも聞いてください。",
  },
  {
    title: "お客様の声：「通い始めて3ヶ月で変わりました」",
    body: "定期的にご来店くださっているお客様より、うれしいお言葉をいただきました。\n「最初は半信半疑でしたが、続けるうちにしっかり変化を感じられました」とのこと。\n続けることで実感できる変化があります。",
    hashtags: ["#お客様の声", "#リピーター", "#信頼", "#実績", "#体験談"],
    cta: "まずは一度体験してみませんか？",
  },
  {
    title: "今月限定！お得なキャンペーン実施中",
    body: "今月は特別なキャンペーンをご用意しています。\nいつも気になっていたメニューに、このチャンスに挑戦してみてください。\n枠に限りがありますので、お早めにどうぞ。",
    hashtags: ["#キャンペーン", "#期間限定", "#お得", "#特別価格", "#今月限定"],
    cta: "プロフィールのリンクから今すぐ予約を。",
  },
  {
    title: "スタッフがこだわる、アフターフォローの話",
    body: "私たちが特にこだわっているのは、施術後のアフターフォロー。\nご帰宅後もきれいが続くよう、ひとりひとりに合ったケア方法をお伝えしています。\nこれからもずっと、お客様の味方でいたいと思っています。",
    hashtags: ["#こだわり", "#スタッフ", "#アフターフォロー", "#丁寧", "#信念"],
    cta: "スタッフ一同、お待ちしております。",
  },
  {
    title: "やってしまいがち！NGなケアと正しい対処法",
    body: "実は逆効果になっているケアをしていませんか？\n熱すぎるお湯でのシャンプーや、タオルでのゴシゴシ拭きは髪を傷める原因に。\n小さな習慣の見直しが、美髪への近道です。",
    hashtags: ["#NGケア", "#正しいケア", "#ヘアケア", "#美髪のコツ", "#毎日の習慣"],
    cta: "正しいケア方法、来店時にお気軽に聞いてください。",
  },
  {
    title: "予約はいつでもOK！まずは気軽にご連絡を",
    body: "「いつか行ってみたい」と思っていただいている方へ。\nそのタイミングが、今かもしれません。\n初めての方も安心して来ていただけるよう、丁寧にご対応します。",
    hashtags: ["#予約受付中", "#初回歓迎", "#気軽に相談", "#新規歓迎", "#お待ちしています"],
    cta: "プロフィールのリンクから簡単に予約できます。",
  },
];

const SYSTEM_PROMPT = `あなたは小規模店舗（美容室・整体院・飲食店・ネイルサロン・個人教室など）のInstagram投稿文を作成するプロのライターです。
ユーザーが入力したお店の情報をもとに、Instagram投稿文を10個作成してください。

各投稿は必ず以下のJSON配列形式のみで返してください。JSON以外のテキストは一切出力しないでください：
[
  {
    "title": "投稿タイトル（25文字以内）",
    "body": "Instagram投稿本文（120〜220文字）",
    "hashtags": ["#タグ1", "#タグ2", "#タグ3", "#タグ4", "#タグ5"],
    "cta": "行動喚起文（自然な一文）"
  }
]

投稿文のルール：
- 小規模店舗のInstagramとして自然な文章にする
- 売り込み感を強くしすぎない
- 読者の悩みに寄り添う
- 具体的なシーンを入れる
- 本文は120〜220文字程度
- ハッシュタグは5〜8個
- CTAは自然にする
- 10個すべて切り口を変える（悩み共感・季節ネタ・Before/After風・よくある質問・豆知識・お客様の声風・キャンペーン告知・スタッフ目線・失敗回避・予約促進）`;

function parsePosts(text: string): RawPost[] {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("JSONが見つかりません");
  const parsed = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(parsed)) throw new Error("配列形式ではありません");
  return parsed.map((item: Record<string, unknown>) => ({
    title: String(item.title ?? ""),
    body: String(item.body ?? ""),
    hashtags: Array.isArray(item.hashtags)
      ? item.hashtags.map((h: unknown) => String(h))
      : [],
    cta: String(item.cta ?? ""),
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();

    if (!userInput || typeof userInput !== "string" || userInput.trim() === "") {
      return NextResponse.json(
        { error: "お店の情報を入力してください。" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json({ posts: DUMMY_POSTS });
    }

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `以下のお店の情報をもとに、Instagram投稿文を10個作成してください。\n\n${userInput.trim()}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const posts = parsePosts(content);

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("generate error:", err);
    return NextResponse.json(
      {
        error:
          "投稿文の生成に失敗しました。しばらくしてからもう一度お試しください。",
      },
      { status: 500 }
    );
  }
}
