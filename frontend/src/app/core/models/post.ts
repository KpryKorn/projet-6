import { Subject } from './subject';
import { User } from './user';

export interface PostRequest {
  subjectTitle: string;
  title: string;
  content: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  subject: Subject;
  author: User;
}
