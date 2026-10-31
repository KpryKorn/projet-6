import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    store = TestBed.inject(AuthStore);
    http = TestBed.inject(HttpTestingController);
  });

  it('starts with an unknown session', () => {
    expect(store.status()).toBe('unknown');
    expect(store.isAuthenticated()).toBeFalse();
  });

  it('restores the session from the refresh cookie', async () => {
    const pending = store.init();
    http.expectOne('/api/auth/refresh').flush({ accessToken: 'token-1' });
    await pending;
    expect(store.isAuthenticated()).toBeTrue();
    expect(store.accessToken()).toBe('token-1');
  });

  it('falls back to anonymous when the refresh fails', async () => {
    const pending = store.init();
    http
      .expectOne('/api/auth/refresh')
      .flush({ message: 'Aucune session active.' }, { status: 401, statusText: 'Unauthorized' });
    await pending;
    expect(store.status()).toBe('anonymous');
  });
});
