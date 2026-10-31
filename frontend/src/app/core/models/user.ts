import { Subject } from './post';

export interface Me {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  subscribedSubjects: Subject[];
}

export interface Profile {
  id: number;
  username: string;
  bio: string | null;
  createdAt: string;
  postCount: number;
  commentCount: number;
  usefulReceived: number;
  subjects: Subject[];
}

export interface ProfileUpdate {
  username?: string;
  bio?: string;
  password?: string;
}
