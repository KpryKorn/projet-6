import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { SubjectsCardComponent } from '../../components/subjects-card/subjects-card.component';
import { UserStore } from '@store/user/user.store';
import { SubjectsStore } from '@store/subjects/subjects.store';

@Component({
  selector: 'app-subjects-page',
  imports: [HeaderComponent, SubjectsCardComponent],
  templateUrl: './subjects-page.component.html',
  host: { class: 'contents' },
})
export class SubjectsPageComponent implements OnInit {
  private readonly subjectsStore = inject(SubjectsStore);
  private readonly userStore = inject(UserStore);

  public readonly subjects = this.subjectsStore.subjectsWithSubscriptionStatus;
  public readonly isLoading = this.subjectsStore.isLoading;

  handleOnSubscribe(subjectId: number): void {
    this.userStore.subscribeToSubject(subjectId);
  }

  ngOnInit(): void {
    this.subjectsStore.fetchAllSubjects();
    this.userStore.fetchMe();
  }
}
