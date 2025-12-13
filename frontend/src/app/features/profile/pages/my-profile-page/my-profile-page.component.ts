import { Component, inject, OnInit } from '@angular/core';
import { TailwindWrapperComponent } from '@components/tailwind-wrapper/tailwind-wrapper.component';
import { HeaderComponent } from '@components/header/header.component';
import { UserStateService } from '@services/stateful/user/user-state.service';

@Component({
  selector: 'app-profile-page',
  imports: [HeaderComponent],
  templateUrl: './my-profile-page.component.html',
})
export class MyProfilePageComponent extends TailwindWrapperComponent implements OnInit {
  private readonly userStateService = inject(UserStateService);

  readonly user = this.userStateService.currentUser;

  ngOnInit(): void {
    this.userStateService.fetchMe().subscribe();
  }
}
