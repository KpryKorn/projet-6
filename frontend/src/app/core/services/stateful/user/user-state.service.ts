import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User, UserRequest } from '../../../models/user';
import { UserService } from '../../api/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly userService = inject(UserService);

  // état privé via signals
  private readonly userState = signal<User | null>(null);
  private readonly userSubscriptionsState = signal<User['subscribedSubjects'] | null>(null);

  /**
   * Informations de l'utilisateur connecté
   */
  public readonly currentUser = this.userState.asReadonly();
  public readonly currentUserSubscriptions = this.userSubscriptionsState.asReadonly();

  fetchMe(): Observable<User> {
    return this.userService.me().pipe(tap((user) => this.userState.set(user)));
  }

  updateMe(user: Partial<UserRequest>): Observable<User> {
    return this.userService
      .updateMe(user)
      .pipe(tap((updatedUser) => this.userState.set(updatedUser)));
  }

  fetchMySubscriptions(): Observable<User['subscribedSubjects']> {
    return this.userService
      .getMySubscriptions()
      .pipe(tap((subs) => this.userSubscriptionsState.set(subs)));
  }
}
