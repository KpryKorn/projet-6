import { Subject } from './subject';

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
}
