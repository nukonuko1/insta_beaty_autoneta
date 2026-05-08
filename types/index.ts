export interface Post {
  title: string;
  body: string;
  hashtags: string[];
  cta: string;
}

export interface GenerateResponse {
  posts: Post[];
  error?: string;
}
