import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from '@models/post';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubjectsService {
  private readonly http = inject(HttpClient);

  list(): Observable<Subject[]> {
    return this.http.get<Subject[]>('/api/subjects');
  }

  get(id: number): Observable<Subject> {
    return this.http.get<Subject>(`/api/subjects/${id}`);
  }

  subscribe(id: number): Observable<void> {
    return this.http.post<void>(`/api/subjects/${id}/subscribe`, {});
  }

  unsubscribe(id: number): Observable<void> {
    return this.http.delete<void>(`/api/subjects/${id}/unsubscribe`);
  }
}
