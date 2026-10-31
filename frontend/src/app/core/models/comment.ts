import { Author } from './post';

export interface Comment {
  id: number;
  postId: number;
  content: string;
  author: Author;
  createdAt: string;
}

export interface CommentRequest {
  content: string;
  postId: number;
}
