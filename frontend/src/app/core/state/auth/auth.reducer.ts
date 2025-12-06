import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: unknown | null;
}

export const initialState: AuthState = {
  token: null,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  // prend l'état actuel + une action => retourne le nouvel état
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    token: response.token,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    token: null,
    isLoading: false,
    error: error,
  }))
);
