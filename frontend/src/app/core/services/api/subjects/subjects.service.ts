import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from '@models/subject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private readonly http = inject(HttpClient);

  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>('/api/subjects');
  }

  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<Subject>(`/api/subjects/${id}`);
  }

  subscribeToSubject(id: number): Observable<void> {
    return this.http.post<void>(`/api/subjects/${id}/subscribe`, {});
  }

  unsubscribeFromSubject(id: number): Observable<void> {
    return this.http.delete<void>(`/api/subjects/${id}/unsubscribe`);
  }
}
