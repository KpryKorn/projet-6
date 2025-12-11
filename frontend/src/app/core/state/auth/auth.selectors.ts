import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// fonctions optimisées pour target une partie spécifique du state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoading = createSelector(selectAuthState, (state) => state.isLoading);

export const selectError = createSelector(selectAuthState, (state) => state.error);

export const selectToken = createSelector(selectAuthState, (state) => state.token);
