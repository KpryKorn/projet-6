import { HttpErrorResponse } from '@angular/common/http';

/** Human readable message from the API error body, with a safe fallback. */
export function errorMessage(
  error: unknown,
  fallback = 'Une erreur est survenue. Réessaie dans un instant.',
): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Le serveur est injoignable. Vérifie ta connexion.';
    const message = (error.error as { message?: string } | null)?.message;
    if (message) return message;
  }
  return fallback;
}

export function fieldErrors(error: unknown): Record<string, string> {
  if (error instanceof HttpErrorResponse) {
    return (error.error as { errors?: Record<string, string> } | null)?.errors ?? {};
  }
  return {};
}
