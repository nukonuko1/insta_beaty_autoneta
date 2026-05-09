export type PostStatus = "draft" | "scheduled" | "posted";

export interface Post {
  id: string;
  title: string;
  body: string;
  hashtags: string[];
  cta: string;
  favorite: boolean;
  status: PostStatus;
  scheduledDate: string | null;
}

export interface RawPost {
  title: string;
  body: string;
  hashtags: string[];
  cta: string;
}

export interface Session {
  id: string;
  input: string;
  createdAt: string;
  posts: Post[];
}

export interface ScheduledPostEntry {
  post: Post;
  session: Session;
}

export interface GenerateResponse {
  posts: RawPost[];
  error?: string;
}
