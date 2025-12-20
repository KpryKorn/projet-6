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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

const AuraMdd = definePreset(Aura, {
  semantic: {
    primary: palette('#7763C5'),
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AuraMdd,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
