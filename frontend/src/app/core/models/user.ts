export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  // subscribedSubjects: Subject[];
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
}
