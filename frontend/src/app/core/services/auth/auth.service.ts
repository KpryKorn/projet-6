import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccessTokenResponse, LoginRequest, RegisterRequest } from '@models/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  register(payload: RegisterRequest): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>('/api/auth/register', payload);
  }

  login(payload: LoginRequest): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>('/api/auth/login', payload);
  }

  refreshToken(): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>('/api/auth/refresh', {});
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {});
  }
}
