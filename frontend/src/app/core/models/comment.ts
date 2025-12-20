import { Post } from './post';
import { User } from './user';

export interface CommentRequest {
  content: string;
  postId: number;
}

export interface Comment {
  id: number;
  content: string;
  post: Post;
  author: User;
  createdAt: string;
}
