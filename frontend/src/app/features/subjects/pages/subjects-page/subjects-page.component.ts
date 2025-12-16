import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Subject } from '@models/subject';
import { SubjectsService } from '@services/api/subjects/subjects.service';
import { catchError, concatMap, EMPTY, Observable, tap } from 'rxjs';
import { HeaderComponent } from '@components/header/header.component';
import { SubjectsCardComponent } from '../../components/subjects-card/subjects-card.component';
import { UserStateService } from '@services/stateful/user/user-state.service';

@Component({
  selector: 'app-subjects-page',
  imports: [HeaderComponent, SubjectsCardComponent],
  templateUrl: './subjects-page.component.html',
  host: { class: 'contents' },
})
export class SubjectsPageComponent implements OnInit {
  private readonly subjectsService = inject(SubjectsService);
  private readonly userStateService = inject(UserStateService);

  private readonly subjectsState = signal<Subject[] | null>(null);
  private readonly userSubscriptions = computed(() => {
    const user = this.userStateService.currentUser();
    return new Set(user?.subscribedSubjects?.map((s) => s.id));
  });

  public readonly subjects = computed(() => {
    const subjects = this.subjectsState();
    const subscriptions = this.userSubscriptions();
    if (!subjects) return null;

    return subjects.map((subject) => ({
      ...subject,
      isSubscribed: subscriptions.has(subject.id),
    }));
  });

  loadSubjects(): Observable<Subject[]> {
    return this.subjectsService
      .getAllSubjects()
      .pipe(tap((subjects) => this.subjectsState.set(subjects)));
  }

  handleOnSubscribe(subjectId: number): void {
    this.subjectsService
      .subscribeToSubject(subjectId)
      .pipe(
        tap(() => this.userStateService.fetchMe().subscribe()),
        catchError((error) => {
          console.error(`Failed to subscribe for ID: ${subjectId}`, error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadSubjects().subscribe();
    this.userStateService.fetchMe().subscribe();
  }
}
