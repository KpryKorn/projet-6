import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '@store/auth/auth.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  host: { class: 'contents' },
})
export class HeaderComponent {
  private readonly authStore = inject(AuthStore);

  isAuthenticated = this.authStore.isAuthenticated;

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authStore.logout();
    this.closeMenu();
  }
}
