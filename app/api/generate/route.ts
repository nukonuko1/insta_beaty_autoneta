import { NextRequest, NextResponse } from "next/server";
import { RawPost } from "@/types";

// Generic fallback — business-type-agnostic, used when no API key is configured
const FALLBACK_POSTS: RawPost[] = [
  {
    title: "あなたのお悩み、解決できます",
    body: "「なんとかしたいけど、どこに相談すればいいか分からない」そんな方へ。\n私たちはお客様一人ひとりの状況をしっかり聞いてから、最適なご提案をします。\n一人で抱え込まず、まずは気軽にお声がけください。",
    hashtags: ["#お悩み解決", "#丁寧な対応", "#プロの技術", "#地域密着", "#ご相談"],
    cta: "DMからいつでもお気軽にご相談ください。",
  },
  {
    title: "季節に合わせたケアしていますか？",
    body: "季節の変わり目は、体や肌・髪など様々なところに影響が出やすい時期。\nこの時期だからこそ、プロの目線でしっかりケアしてみませんか？\n定期的なメンテナンスで、コンディションを整えましょう。",
    hashtags: ["#季節ケア", "#プロの技術", "#定期メンテ", "#体のケア", "#おすすめ"],
    cta: "プロフィールのリンクから予約できます。",
  },
  {
    title: "before→afterで違いを実感！",
    body: "「こんなに変わるとは思わなかった！」というお声を多数いただいています。\nプロの施術は、自分では気づけなかった変化をもたらしてくれます。\nぜひ一度、その違いを体感してみてください。",
    hashtags: ["#ビフォーアフター", "#変化", "#プロの仕事", "#実感", "#体験談"],
    cta: "まずは体験だけでもぜひどうぞ。",
  },
  {
    title: "初めてでも安心！カウンセリングから",
    body: "「初めてで何も分からない」という方こそ、ぜひお越しください。\nカウンセリングでじっくりお話を聞いてから、最適なメニューをご提案します。\n押し売りは一切しませんので、安心してご相談ください。",
    hashtags: ["#初回歓迎", "#カウンセリング", "#安心", "#初めての方", "#丁寧な説明"],
    cta: "気軽にDMやお電話でどうぞ。",
  },
  {
    title: "知って得する！プロが教えるポイント",
    body: "日常の小さな習慣が、長い目で見ると大きな差になります。\nプロとして、ちょっと得するコツをお伝えします。\n「そんな方法があったのか！」と思っていただけると嬉しいです。",
    hashtags: ["#豆知識", "#プロのコツ", "#日常ケア", "#知って得する", "#ライフハック"],
    cta: "もっと詳しく聞きたい方はDMでどうぞ。",
  },
  {
    title: "お客様の声：「通い続けて良かった」",
    body: "継続してご来店いただいているお客様からうれしいお言葉をいただきました。\n「最初は半信半疑でしたが、続けるうちに確実に変化を感じています」とのこと。\n焦らず続けることで、本当の効果が出てきます。",
    hashtags: ["#お客様の声", "#リピーター", "#継続は力なり", "#信頼", "#実績"],
    cta: "あなたも一歩を踏み出してみませんか？",
  },
  {
    title: "今月限定！特別メニューのご案内",
    body: "今月だけの特別なご提供をご用意しました。\n気になっていたメニューへの挑戦、このタイミングがチャンスかもしれません。\nご予約枠に限りがありますので、お早めにご確認ください。",
    hashtags: ["#期間限定", "#キャンペーン", "#お得情報", "#今月のおすすめ", "#特別価格"],
    cta: "プロフィールのリンクから今すぐご予約を。",
  },
  {
    title: "スタッフのこだわりをお伝えします",
    body: "私たちが一番大切にしているのは、施術後もお客様の生活が豊かになること。\nそのために、アフターケアのアドバイスも丁寧にお伝えしています。\nお客様の笑顔を見ることが、私たちのやりがいです。",
    hashtags: ["#スタッフ紹介", "#こだわり", "#アフターケア", "#丁寧な仕事", "#やりがい"],
    cta: "スタッフ一同、心よりお待ちしています。",
  },
  {
    title: "やりがちなNG行動、知っていますか？",
    body: "良かれと思ってやっていることが、実は逆効果になっているケースがあります。\nプロの目線から見ると、日常のちょっとした行動が結果に大きく影響します。\n気になる方は、次回ご来店時にぜひ聞いてみてください。",
    hashtags: ["#NGな行動", "#正しいケア", "#プロのアドバイス", "#豆知識", "#改善のヒント"],
    cta: "来店時に遠慮なく聞いてください。",
  },
  {
    title: "「そのうち行こう」が今になるかも",
    body: "「いつかお願いしたい」と思い続けている方へ。\nそのタイミングが、実は今かもしれません。\n初めての方も安心してお越しいただけるよう、丁寧に対応します。",
    hashtags: ["#予約受付中", "#新規歓迎", "#初回限定", "#気軽に相談", "#お待ちしています"],
    cta: "プロフィールのリンクから簡単に予約できます。",
  },
];

const SYSTEM_PROMPT = `あなたは小規模店舗（美容室・整体院・飲食店・ネイルサロン・カフェ・個人教室・接骨院など）のInstagram投稿文を作成するプロのライターです。
ユーザーが入力したお店の情報をもとに、そのお店・業種に合わせたInstagram投稿文を10個作成してください。

重要：入力されたお店の業種・サービス・商品に完全に合わせた内容にしてください。美容室なら美容室の、飲食店なら飲食店の、整体なら整体の内容で書いてください。

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
- 入力されたお店の業種・サービス・ターゲットに完全に合わせること
- 小規模店舗のInstagramとして自然な文章にする
- 売り込み感を強くしすぎない
- 読者の悩みに寄り添う
- 具体的なシーンを入れる
- 本文は120〜220文字程度
- ハッシュタグは5〜8個（そのお店の業種に合ったタグを使う）
- CTAは自然にする
- 10個すべて切り口を変える（悩み共感・季節ネタ・Before/After風・よくある質問・豆知識・お客様の声風・キャンペーン告知・スタッフ目線・失敗回避・予約促進）`;

const USER_PROMPT = (input: string) =>
  `以下のお店の情報をもとに、そのお店・業種に完全に合わせたInstagram投稿文を10個作成してください。\n\n${input.trim()}`;

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

function buildFallback(seed: string): RawPost[] {
  const hash = seed.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
  const arr = [...FALLBACK_POSTS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (hash * (i + 3)) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Each generator returns posts on success, error string on failure, null if skipped
async function tryAnthropic(userInput: string, apiKey: string): Promise<RawPost[] | string> {
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: USER_PROMPT(userInput) }],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");
    return parsePosts(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[generate] Anthropic failed:", msg);
    return msg;
  }
}

async function tryOpenAI(userInput: string, apiKey: string): Promise<RawPost[] | string> {
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT(userInput) },
      ],
      temperature: 0.8,
      max_tokens: 4096,
    });
    const text = completion.choices[0]?.message?.content ?? "";
    return parsePosts(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[generate] OpenAI failed:", msg);
    return msg;
  }
}

export async function POST(req: NextRequest) {
  // Parse request body
  let userInput: string;
  try {
    const body = await req.json();
    userInput = body?.userInput ?? "";
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
    return NextResponse.json({ error: "お店の情報を入力してください。" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  let apiErrorMsg = "";

  // Try Anthropic → OpenAI → fallback (each isolated, never throws to caller)
  if (anthropicKey) {
    const result = await tryAnthropic(userInput, anthropicKey);
    if (Array.isArray(result)) return NextResponse.json({ posts: result });
    apiErrorMsg = result;
  }

  if (openaiKey) {
    const result = await tryOpenAI(userInput, openaiKey);
    if (Array.isArray(result)) return NextResponse.json({ posts: result });
    if (!apiErrorMsg) apiErrorMsg = result;
  }

  // Fallback — always succeeds
  await new Promise((r) => setTimeout(r, 600));
  const hasKey = !!(anthropicKey || openaiKey);
  return NextResponse.json({
    posts: buildFallback(userInput),
    warning: hasKey
      ? `APIエラー: ${apiErrorMsg}`
      : "APIキーが未設定のためサンプルを表示しています。Vercel環境変数に ANTHROPIC_API_KEY を設定後、必ず再デプロイしてください。",
  });
}
