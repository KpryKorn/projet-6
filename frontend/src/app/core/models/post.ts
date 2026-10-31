export interface Author {
  id: number;
  username: string;
  bio: string | null;
}

export interface Subject {
  id: number;
  title: string;
  description: string;
  color: string;
  shortName: string;
  createdAt: string;
  followerCount?: number;
  postCount?: number;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  readingMinutes: number;
  createdAt: string;
  author: Author;
  subject: Subject;
  usefulCount: number;
  commentCount: number;
  viewerHasReacted: boolean;
  viewerHasBookmarked: boolean;
}

export interface PostRequest {
  subjectId: number;
  title: string;
  content: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  hasNext: boolean;
  totalElements: number;
}

export interface Engagement {
  usefulCount: number;
  viewerHasReacted: boolean;
}

export type FeedScope = 'subscribed' | 'all' | 'saved';

export interface PostQuery {
  scope: FeedScope;
  q?: string;
  subjectId?: number | null;
  authorId?: number | null;
  page?: number;
  size?: number;
}
