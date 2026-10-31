import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Me, Profile, ProfileUpdate } from '@models/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  me(): Observable<Me> {
    return this.http.get<Me>('/api/users/me');
  }

  updateMe(changes: ProfileUpdate): Observable<Me> {
    return this.http.patch<Me>('/api/users/me', changes);
  }

  profile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`/api/users/${id}`);
  }
}
