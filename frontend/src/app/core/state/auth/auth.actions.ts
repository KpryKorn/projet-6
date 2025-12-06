import { createActionGroup, props } from '@ngrx/store';
import { AuthResponse, LoginRequest } from '../../models/auth';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ payload: LoginRequest }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: unknown }>(),
  },
});
