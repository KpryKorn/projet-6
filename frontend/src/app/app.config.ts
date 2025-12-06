import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { authReducer } from './core/state/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import * as authEffects from './core/state/auth/auth.effect';

const AuraSky = definePreset(Aura, {
  semantic: {
    primary: palette('{sky}'),
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AuraSky,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideStore(),
    provideState({ name: 'auth', reducer: authReducer }),
    provideEffects(authEffects),
  ],
};
