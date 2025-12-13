import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// fonctions optimisées pour target une partie spécifique du state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAccessToken = createSelector(selectAuthState, (state) => state.accessToken);

export const selectIsLoading = createSelector(selectAuthState, (state) => state.isLoading);

export const selectError = createSelector(selectAuthState, (state) => state.error);

export const selectAuthStatus = createSelector(selectAuthState, (state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
}));
