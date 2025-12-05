import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  register(payload: RegisterRequest) {
    return this.http.post<AuthResponse>('/api/auth/register', payload);
  }

  login(payload: LoginRequest) {
    return this.http.post<AuthResponse>('/api/auth/login', payload);
  }
}
