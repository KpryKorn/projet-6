import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './core/state/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(AuthActions.initAuthCheck());
  }
}
