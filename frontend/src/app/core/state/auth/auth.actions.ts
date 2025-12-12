import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AccessTokenResponse, LoginRequest, RegisterRequest } from '../../models/auth';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init Auth Check': emptyProps(),

    Login: props<{ request: LoginRequest }>(),
    'Login Success': props<{ response: AccessTokenResponse }>(),
    'Login Failure': props<{ error: string }>(),

    Register: props<{ request: RegisterRequest }>(),
    'Register Success': props<{ response: AccessTokenResponse }>(),
    'Register Failure': props<{ error: string }>(),

    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ response: AccessTokenResponse }>(),
    'Refresh Token Failure': props<{ error: string }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),
  },
});
