import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '@store/auth/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    this.authStore.refresh();
  }
}
