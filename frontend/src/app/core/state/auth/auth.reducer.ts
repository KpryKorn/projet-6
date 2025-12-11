import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, AuthActions.register, AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    AuthActions.loginSuccess,
    AuthActions.registerSuccess,
    AuthActions.refreshTokenSuccess,
    (state, { response }) => ({
      ...state,
      accessToken: response.accessToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  ),

  on(
    AuthActions.loginFailure,
    AuthActions.registerFailure,
    AuthActions.refreshTokenFailure,
    (state, { error }) => ({
      ...state,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: error,
    })
  ),

  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.logoutSuccess, () => initialState),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...initialState,
    error: error,
  }))
);
