import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../models/user';
import { Subject } from '@models/subject';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  me(): Observable<User> {
    return this.http.get<User>('/api/users/me');
  }

  updateMe(user: Partial<User>): Observable<User> {
    return this.http.patch<User>('/api/users/me', user);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  getMySubscriptions(): Observable<Subject[]> {
    return this.http.get<Subject[]>('/api/users/me/subscriptions');
  }
}
