import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { selectAuthStatus } from '@store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { AuthActions } from '@store/auth/auth.actions';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  host: { class: 'contents' },
})
export class HeaderComponent {
  private readonly store = inject(Store);

  authStatus = this.store.selectSignal(selectAuthStatus);

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
